"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";

const nutEmojis = ["🌰", "🥜", "🌰", "🥜", "🌰"];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const nutsRef = useRef<Matter.Body[]>([]);
  const hasStartedRef = useRef(false);
  const hasSpawnedOnceRef = useRef(false);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const impulseIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (hasStartedRef.current || !footerRef.current) return;
    hasStartedRef.current = true;

    const footer = footerRef.current;
    const getFooterBounds = () => {
      const rect = footer.getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };
    };

    const bounds = getFooterBounds();

    // Create engine
    const engine = Matter.Engine.create();
    engineRef.current = engine;
    engine.world.gravity.y = 0.8; // Increased gravity for more movement
    engine.world.gravity.x = 0.3; // Stronger horizontal gravity to roll right

    // Create canvas for emoji rendering
    const canvas = document.createElement("canvas");
    canvas.width = bounds.width;
    canvas.height = bounds.height;
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "5";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    footer.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create ground (at bottom of footer)
    const ground = Matter.Bodies.rectangle(
      bounds.width / 2,
      bounds.height - 10,
      bounds.width,
      20,
      {
        isStatic: true,
        render: { visible: false },
      }
    );

    // Create left wall (for containing nuts)
    const leftWall = Matter.Bodies.rectangle(
      -10,
      bounds.height / 2,
      20,
      bounds.height,
      {
        isStatic: true,
        render: { visible: false },
      }
    );

    // Create right wall (near resources)
    const rightWall = Matter.Bodies.rectangle(
      bounds.width + 10,
      bounds.height / 2,
      20,
      bounds.height,
      {
        isStatic: true,
        render: { visible: false },
      }
    );

    Matter.World.add(engine.world, [ground, leftWall, rightWall]);

    // Function to render emojis
    const renderEmojis = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      nutsRef.current.forEach((nut, index) => {
        const size = (nut.circleRadius || 30) * 2.2; // Smaller emojis
        const emoji = nutEmojis[index % nutEmojis.length];
        
        ctx.save();
        ctx.translate(nut.position.x, nut.position.y);
        ctx.rotate(nut.angle);
        
        ctx.font = `${size}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(emoji, 0, 0);
        
        ctx.restore();
      });
    };

    // Run engine
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    runnerRef.current = runner;

    // Function to create a nut
    const createNut = (x: number, y: number) => {
      const size = 25 + Math.random() * 8; // Smaller nuts
      const nut = Matter.Bodies.circle(x, y, size, {
        restitution: 0.9, // Very bouncy
        friction: 0.05, // Very low friction for rolling
        frictionAir: 0.01, // Low air resistance
        density: 0.001,
        render: {
          visible: false,
        },
      });

      // Add initial velocity - slight rightward push, mainly downward
      Matter.Body.setVelocity(nut, {
        x: 0.5 + Math.random() * 1, // Small rightward push
        y: 1 + Math.random() * 2, // Downward
      });

      // Add angular velocity for rolling effect
      Matter.Body.setAngularVelocity(nut, 0.1 + Math.random() * 0.2);

      Matter.World.add(engine.world, nut);
      nutsRef.current.push(nut);
      return nut;
    };

    // Function to start spawning nuts
    const startSpawning = () => {
      // Don't start if already spawned once
      if (hasSpawnedOnceRef.current) return;
      hasSpawnedOnceRef.current = true;

      // Spawn nuts continuously from top left
      const spawnNuts = () => {
        // Spawn from top left area
        const spawnX = 50 + Math.random() * 80;
        const spawnY = -30 - Math.random() * 20;
        
        createNut(spawnX, spawnY);
      };

      // Initial spawn
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          spawnNuts();
        }, i * 300);
      }

      // Continuous spawning
      spawnIntervalRef.current = setInterval(() => {
        if (nutsRef.current.length < 20) {
          spawnNuts();
        }
      }, 1500);

      // Add periodic random impulses to keep nuts moving
      impulseIntervalRef.current = setInterval(() => {
        nutsRef.current.forEach((nut) => {
          if (Math.random() > 0.7) {
            Matter.Body.applyForce(nut, nut.position, {
              x: (Math.random() * 0.02),
              y: (Math.random() - 0.5) * 0.01,
            });
          }
        });
      }, 2000);

      // Remove nuts that fall too far off screen
      cleanupIntervalRef.current = setInterval(() => {
        nutsRef.current = nutsRef.current.filter((nut) => {
          if (nut.position.y > bounds.height + 100) {
            Matter.World.remove(engine.world, nut);
            return false;
          }
          return true;
        });
      }, 5000);
    };

    // Function to stop spawning
    const stopSpawning = () => {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
        spawnIntervalRef.current = null;
      }
      if (impulseIntervalRef.current) {
        clearInterval(impulseIntervalRef.current);
        impulseIntervalRef.current = null;
      }
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
        cleanupIntervalRef.current = null;
      }
    };

    // Intersection Observer to detect when footer is visible
    // Only spawn once when footer first becomes visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasSpawnedOnceRef.current) {
            startSpawning();
          }
        });
      },
      {
        threshold: 0.1, // Start when 10% of footer is visible
      }
    );

    observer.observe(footer);

    // Animation loop to render emojis
    const animationLoop = () => {
      renderEmojis();
      requestAnimationFrame(animationLoop);
    };
    animationLoop();

    // Handle window resize
    const handleResize = () => {
      const footerBounds = getFooterBounds();
      canvas.width = footerBounds.width;
      canvas.height = footerBounds.height;

      Matter.Body.setPosition(ground, {
        x: footerBounds.width / 2,
        y: footerBounds.height - 10,
      });
      Matter.Body.scale(ground, footerBounds.width / bounds.width, 1);

      Matter.Body.setPosition(leftWall, {
        x: -10,
        y: footerBounds.height / 2,
      });
      Matter.Body.scale(leftWall, 1, footerBounds.height / bounds.height);

      Matter.Body.setPosition(rightWall, {
        x: footerBounds.width + 10,
        y: footerBounds.height / 2,
      });
      Matter.Body.scale(rightWall, 1, footerBounds.height / bounds.height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      observer.disconnect();
      stopSpawning();
      window.removeEventListener("resize", handleResize);
      if (runnerRef.current) {
        Matter.Runner.stop(runnerRef.current);
      }
      Matter.Engine.clear(engine);
      canvas.remove();
    };
  }, []);

  return (
    <footer ref={footerRef} className="hero-texture-combined pt-12 md:pt-16 pb-24 md:pb-32 px-6 border-t border-black relative overflow-hidden min-h-[400px]">
      <div className="max-w-6xl mx-auto relative z-10 flex flex-col h-full">
        <div className="flex flex-col gap-8">
          <div>
            <h4 
              className="font-bold text-white mb-6 text-3xl md:text-4xl uppercase tracking-wider"
              style={{ 
                fontFamily: "var(--font-sauce-tm)",
                textShadow: "2px 2px 0px rgba(0,0,0,0.2)",
                letterSpacing: "0.15em"
              }}
            >
              Nut November
            </h4>
            <ul className="flex flex-wrap gap-6 md:gap-8 text-white">
              <li>
                <a 
                  href="https://cashu.space/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-black transition-all duration-300 text-2xl md:text-3xl uppercase tracking-wide font-bold"
                  style={{ 
                    fontFamily: "var(--font-sauce-tm)",
                    textShadow: "1px 1px 0px rgba(0,0,0,0.15)",
                    letterSpacing: "0.1em"
                  }}
                >
                  Cashu
                </a>
              </li>
              <li>
                <a 
                  href="https://docs.cashu.space/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-black transition-all duration-300 text-2xl md:text-3xl uppercase tracking-wide font-bold"
                  style={{ 
                    fontFamily: "var(--font-sauce-tm)",
                    textShadow: "1px 1px 0px rgba(0,0,0,0.15)",
                    letterSpacing: "0.1em"
                  }}
                >
                  Docs
                </a>
              </li>
              <li>
                <a 
                  href="https://opencash.dev/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-black transition-all duration-300 text-2xl md:text-3xl uppercase tracking-wide font-bold"
                  style={{ 
                    fontFamily: "var(--font-sauce-tm)",
                    textShadow: "1px 1px 0px rgba(0,0,0,0.15)",
                    letterSpacing: "0.1em"
                  }}
                >
                  Opencash
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/cashubtc" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-black transition-all duration-300 text-2xl md:text-3xl uppercase tracking-wide font-bold"
                  style={{ 
                    fontFamily: "var(--font-sauce-tm)",
                    textShadow: "1px 1px 0px rgba(0,0,0,0.15)",
                    letterSpacing: "0.1em"
                  }}
                >
                  Github
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex gap-6 items-center mt-auto pt-12 md:pt-16">
          <a 
            href="https://x.com/cashubtc" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:opacity-70 transition-all duration-300"
            aria-label="X (Twitter)"
          >
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="text-white"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a 
            href="https://t.me/CashuBTC" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:opacity-70 transition-all duration-300"
            aria-label="Telegram"
          >
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="text-white"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.82 1.16-5.14 3.41-.49.33-.93.49-1.33.48-.44-.01-1.29-.25-1.92-.46-.77-.26-1.38-.41-1.33-.87.03-.23.39-.47 1.07-.68 4.21-1.51 7.02-2.51 8.34-3.02 3.92-1.52 4.73-1.79 5.26-1.8.12 0 .42.03.61.18.15.13.2.3.22.42-.01.11-.01.15.01.21z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
