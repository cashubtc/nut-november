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
          <a 
            href="https://primal.net/p/nprofile1qqs0y3tvskgs9gpgxxu5ahgz3fmms3rzmxt504qceqtz4a6pdgfwlkghwl6j8" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:opacity-70 transition-all duration-300"
            aria-label="Nostr"
          >
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 875 875" 
              fill="currentColor" 
              className="text-white"
            >
              <path d="m684.72,485.57c.22,12.59-11.93,51.47-38.67,81.3-26.74,29.83-56.02,20.85-58.42,20.16s-3.09-4.46-7.89-3.77-9.6,6.17-18.86,7.2-17.49,1.71-26.06-1.37c-4.46.69-5.14.71-7.2,2.24s-17.83,10.79-21.6,11.47c0,7.2-1.37,44.57,0,55.89s3.77,25.71,7.54,36c3.77,10.29,2.74,10.63,7.54,9.94s13.37.34,15.77,4.11c2.4,3.77,1.37,6.51,5.49,8.23s60.69,17.14,99.43,19.2c26.74.69,42.86,2.74,52.12,19.54,1.37,7.89,7.54,13.03,11.31,14.06s8.23,2.06,12,5.83,1.03,8.23,5.49,11.66c4.46,3.43,14.74,8.57,25.37,13.71,10.63,5.14,15.09,13.37,15.77,16.11s1.71,10.97,1.71,10.97c0,0-8.91,0-10.97-2.06s-2.74-5.83-2.74-5.83c0,0-6.17,1.03-7.54,3.43s.69,2.74-7.89.69-11.66-3.77-18.17-8.57c-6.51-4.8-16.46-17.14-25.03-16.8,4.11,8.23,5.83,8.23,10.63,10.97s8.23,5.83,8.23,5.83l-7.2,4.46s-4.46,2.06-14.74-.69-11.66-4.46-12.69-10.63,0-9.26-2.74-14.4-4.11-15.77-22.29-21.26c-18.17-5.49-66.52-21.26-100.12-24.69s-22.63-2.74-28.11-1.37-15.77,4.46-26.4-1.37c-10.63-5.83-16.8-13.71-17.49-20.23s-1.71-10.97,0-19.2,3.43-19.89,1.71-26.74-14.06-55.89-19.89-64.12c-13.03,1.03-50.74-.69-50.74-.69,0,0-2.4-.69-17.49,5.83s-36.48,13.76-46.77,19.93-14.4,9.7-16.12,13.13c.12,3-1.23,7.72-2.79,9.06s-12.48,2.42-12.48,2.42c0,0-5.85,5.86-8.25,9.97-6.86,9.6-55.2,125.14-66.52,149.83-13.54,32.57-9.77,27.43-37.71,27.43s-8.06.3-8.06.3c0,0-12.34,5.88-16.8,5.88s-18.86-2.4-26.4,0-16.46,9.26-23.31,10.29-4.95-1.34-8.38-3.74c-4-.21-14.27-.12-14.27-.12,0,0,1.74-6.51,7.91-10.88,8.23-5.83,25.37-16.11,34.63-21.26s17.49-7.89,23.31-9.26,18.51-6.17,30.51-9.94,19.54-8.23,29.83-31.54c10.29-23.31,50.4-111.43,51.43-116.23.63-2.96,3.73-6.48,4.8-15.09.66-5.35-2.49-13.04,1.71-22.63,10.97-25.03,21.6-20.23,26.4-20.23s17.14.34,26.4-1.37,15.43-2.74,24.69-7.89,11.31-8.91,11.31-8.91l-19.89-3.43s-18.51.69-25.03-4.46-15.43-15.77-15.43-15.77l-7.54-7.2,1.03,8.57s-5.14-8.91-6.51-10.29-8.57-6.51-11.31-11.31-7.54-25.03-7.54-25.03l-6.17,13.03-1.71-18.86-5.14,7.2-2.74-16.11-4.8,8.23-3.43-14.4-5.83,4.46-2.4-10.29-5.83-3.43s-14.06-9.26-16.46-9.6-4.46,3.43-4.46,3.43l1.37,12-12.2-6.27-7-11.9s2.36,4.01-9.62,7.53c-20.55,0-21.89-2.28-24.93-3.94-1.31-6.56-5.57-10.11-5.57-10.11h-20.57l-.34-6.86-7.89,3.09.69-10.29h-14.06l1.03-11.31h-8.91s3.09-9.26,25.71-22.97,25.03-16.46,46.29-17.14c21.26-.69,32.91,2.74,46.29,8.23s38.74,13.71,43.89,17.49c11.31-9.94,28.46-19.89,34.29-19.89,1.03-2.4,6.19-12.33,17.96-17.6,35.31-15.81,108.13-34,131.53-35.54,31.2-2.06,7.89-1.37,39.09,2.06,31.2,3.43,54.17,7.54,69.6,12.69,12.58,4.19,25.03,9.6,34.29,2.06,4.33-1.81,11.81-1.34,17.83-5.14,30.69-25.09,34.72-32.35,43.63-41.95s20.14-24.91,22.54-45.14,4.46-58.29-10.63-88.12-28.8-45.26-34.63-69.26c-5.83-24-8.23-61.03-6.17-73.03,2.06-12,5.14-22.29,6.86-30.51s9.94-14.74,19.89-16.46c9.94-1.71,17.83,1.37,22.29,4.8,4.46,3.43,11.65,6.28,13.37,10.29.34,1.71-1.37,6.51,8.23,8.23,9.6,1.71,16.05,4.16,16.05,4.16,0,0,15.64,4.29,3.11,7.73-12.69,2.06-20.52-.71-24.29,1.69s-7.21,10.08-9.61,11.1-7.2.34-12,4.11-9.6,6.86-12.69,14.4-5.49,15.77-3.43,26.74,8.57,31.54,14.4,43.2c5.83,11.66,20.23,40.8,24.34,47.66s15.77,29.49,16.8,53.83,1.03,44.23,0,54.86-10.84,51.65-35.53,85.94c-8.16,14.14-23.21,31.9-24.67,35.03-1.45,3.13-3.02,4.88-1.61,7.65,4.62,9.05,12.87,22.13,14.71,29.22,2.29,6.64,6.99,16.13,7.22,28.72Z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
