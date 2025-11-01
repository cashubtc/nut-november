"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";

interface NutParticlesProps {
  heroSectionRef: React.RefObject<HTMLElement>;
}

export default function NutParticles({ heroSectionRef }: NutParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const nutsRef = useRef<Matter.Body[]>([]);
  const hasStartedRef = useRef(false);
  const mouseHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const groundRef = useRef<Matter.Body | null>(null);
  const leftWallRef = useRef<Matter.Body | null>(null);
  const rightWallRef = useRef<Matter.Body | null>(null);

  // Array of different nut emojis
  const nutEmojis = ["🌰", "🥜", "🥥", "🔩"];

  useEffect(() => {
    if (hasStartedRef.current || !heroSectionRef.current) return;
    hasStartedRef.current = true;

    const heroSection = heroSectionRef.current;
    const getHeroBounds = () => {
      const rect = heroSection.getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };
    };

    const bounds = getHeroBounds();

    // Create engine
    const engine = Matter.Engine.create();
    engineRef.current = engine;
    engine.world.gravity.y = 0.8;

    // Create canvas for emoji rendering
    const canvas = document.createElement("canvas");
    canvas.width = bounds.width;
    canvas.height = bounds.height;
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "10";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    heroSection.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create ground (at bottom of hero section)
    const ground = Matter.Bodies.rectangle(
      bounds.width / 2,
      bounds.height - 20,
      bounds.width,
      40,
      {
        isStatic: true,
        render: { visible: false },
      }
    );
    groundRef.current = ground;

    // Create walls (left and right of hero section)
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
    leftWallRef.current = leftWall;

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
    rightWallRef.current = rightWall;

    Matter.World.add(engine.world, [ground, leftWall, rightWall]);

    // Function to render emojis
    const renderEmojis = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw each nut emoji
      nutsRef.current.forEach((nut) => {
        const size = (nut.circleRadius || 25) * 2.2; // Larger multiplier for bigger emojis
        const emoji = (nut as any).emoji || "🌰"; // Get stored emoji or default
        
        ctx.save();
        ctx.translate(nut.position.x, nut.position.y);
        ctx.rotate(nut.angle);
        
        // Draw nut emoji
        ctx.font = `${size}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(emoji, 0, 0);
        
        ctx.restore();
      });
    };

    // Mouse interaction to push nuts
    const handleMouseMove = (event: MouseEvent) => {
      const heroBounds = getHeroBounds();
      const mouseX = event.clientX - heroBounds.left;
      const mouseY = event.clientY - heroBounds.top;
      
      // Only interact if mouse is within hero section
      if (mouseX < 0 || mouseX > heroBounds.width || mouseY < 0 || mouseY > heroBounds.height) {
        return;
      }

      nutsRef.current.forEach((nut) => {
        const dx = nut.position.x - mouseX;
        const dy = nut.position.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const pushRadius = 100; // Increased radius

        if (distance < pushRadius && distance > 0) {
          const force = (pushRadius - distance) / pushRadius;
          // Increased force multiplier from 0.003 to 0.015 for stronger effect
          const forceX = (dx / distance) * force * 0.015;
          const forceY = (dy / distance) * force * 0.015;

          Matter.Body.applyForce(nut, nut.position, {
            x: forceX,
            y: forceY,
          });
        }
      });
    };

    mouseHandlerRef.current = handleMouseMove;
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.style.pointerEvents = "auto";

    // Run engine
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    runnerRef.current = runner;

    // Function to create a nut
    const createNut = () => {
      const heroBounds = getHeroBounds();
      const x = Math.random() * heroBounds.width;
      const size = 25 + Math.random() * 15; // Increased from 15-25 to 25-40
      const nut = Matter.Bodies.circle(x, -50, size, {
        restitution: 0.4,
        friction: 0.5,
        density: 0.001,
        render: {
          visible: false,
        },
      });

      // Assign a random nut emoji to this nut
      const randomEmoji = nutEmojis[Math.floor(Math.random() * nutEmojis.length)];
      (nut as any).emoji = randomEmoji;

      Matter.World.add(engine.world, nut);
      nutsRef.current.push(nut);
    };

    // Animation loop to render emojis
    const animationLoop = () => {
      renderEmojis();
      requestAnimationFrame(animationLoop);
    };
    animationLoop();

    // Spawn nuts after delay
    const spawnDelay = setTimeout(() => {
      for (let i = 0; i < 15; i++) {
        setTimeout(() => {
          createNut();
        }, i * 200);
      }
    }, 500); // Reduced from 3000ms to 500ms

    // Handle window resize and scroll
    const updateBounds = () => {
      const heroBounds = getHeroBounds();
      canvas.width = heroBounds.width;
      canvas.height = heroBounds.height;

      if (groundRef.current) {
        Matter.Body.setPosition(groundRef.current, {
          x: heroBounds.width / 2,
          y: heroBounds.height - 20,
        });
        Matter.Body.scale(groundRef.current, heroBounds.width / (bounds.width || heroBounds.width), 1);
      }

      if (leftWallRef.current) {
        Matter.Body.setPosition(leftWallRef.current, {
          x: -10,
          y: heroBounds.height / 2,
        });
        Matter.Body.scale(leftWallRef.current, 1, heroBounds.height / (bounds.height || heroBounds.height));
      }

      if (rightWallRef.current) {
        Matter.Body.setPosition(rightWallRef.current, {
          x: heroBounds.width + 10,
          y: heroBounds.height / 2,
        });
        Matter.Body.scale(rightWallRef.current, 1, heroBounds.height / (bounds.height || heroBounds.height));
      }
    };

    const handleResize = () => {
      updateBounds();
    };

    const handleScroll = () => {
      updateBounds();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      clearTimeout(spawnDelay);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      if (mouseHandlerRef.current) {
        canvas.removeEventListener("mousemove", mouseHandlerRef.current);
      }
      if (runnerRef.current) {
        Matter.Runner.stop(runnerRef.current);
      }
      Matter.Engine.clear(engine);
      canvas.remove();
    };
  }, [heroSectionRef]);

  return null;
}
