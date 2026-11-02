import { useEffect, useRef } from "react";
import type { Scenario } from "../data/types";

type Props = {
  gravity: number;
  oxygen: number;
  scenario: Scenario;
  flow: number;
};

type Particle = { a: number; life: number; speed: number; drift: number; size: number };

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    a: Math.random(),
    life: Math.random(),
    speed: 0.35 + Math.random() * 0.8,
    drift: Math.random() * Math.PI * 2,
    size: 0.6 + Math.random() * 1.8,
  }));
}

export function Flame({ gravity, oxygen, scenario, flow }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef({ gravity, oxygen, scenario, flow });
  propsRef.current = { gravity, oxygen, scenario, flow };

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const particles = makeParticles(70);
    let raf = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const paint = (time: number) => {
      const { gravity: g, oxygen: o2, scenario: mode, flow: u } = propsRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w < 2 || h < 2) return;
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cool = mode === "cool";
      const buoyancy = Math.max(0, Math.min(1, g / 0.9));
      const cx = w * 0.5 + (cool ? 0 : Math.sin(time / 900) * 2);
      const lean = cool ? 0 : Math.min(18, u * 0.25) * (1 - buoyancy * 0.7);
      const rx = cool ? w * 0.11 : w * (0.13 + (1 - buoyancy) * 0.045);
      const ry = cool ? w * 0.11 : w * (0.16 + buoyancy * 0.22 + (1 - buoyancy) * 0.05);
      const baseY = h * (cool ? 0.54 : 0.64);
      const hot = Math.max(0, Math.min(1, (o2 - 17) / 18));
      const wobble = reduced ? 0 : Math.sin(time / 280);

      const drawBody = (scale: number, color: string, blur: number) => {
        ctx.save();
        ctx.translate(cx + lean * 0.3, baseY);
        ctx.scale(1, 1);
        ctx.shadowColor = color;
        ctx.shadowBlur = blur;
        ctx.fillStyle = color;
        ctx.beginPath();
        if (cool || buoyancy < 0.04) {
          ctx.ellipse(0, 0, rx * scale, ry * scale, 0, 0, Math.PI * 2);
        } else {
          const tip = -ry * scale;
          const base = ry * scale * 0.78;
          const half = rx * scale;
          ctx.moveTo(wobble * 3, tip);
          ctx.bezierCurveTo(half * 0.2, tip + ry * 0.35, half * 1.05, -ry * 0.05, half * 0.62, base);
          ctx.quadraticCurveTo(0, base + half * 0.25, -half * 0.62, base);
          ctx.bezierCurveTo(-half * 1.05, -ry * 0.05, -half * 0.15, tip + ry * 0.3, wobble * 3, tip);
        }
        ctx.fill();
        ctx.restore();
      };

      const glow = ctx.createRadialGradient(cx, baseY, 8, cx, baseY - ry * 0.2, ry * 2.2);
      if (cool) {
        glow.addColorStop(0, "rgba(150, 200, 255, 0.45)");
        glow.addColorStop(1, "rgba(150, 200, 255, 0)");
      } else {
        glow.addColorStop(0, `rgba(255, ${120 + hot * 40}, 40, 0.38)`);
        glow.addColorStop(1, "rgba(255, 70, 20, 0)");
      }
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, baseY - ry * 0.15, ry * 2.1, 0, Math.PI * 2);
      ctx.fill();

      if (cool) {
        drawBody(1.35, "rgba(90, 150, 230, 0.18)", 24);
        drawBody(1, "rgba(170, 214, 255, 0.55)", 16);
        drawBody(0.45, "rgba(232, 244, 255, 0.9)", 8);
      } else {
        drawBody(1.25, `rgba(255, ${60 + hot * 20}, 16, ${0.22 + hot * 0.12})`, 28);
        drawBody(0.92, `rgba(255, ${92 + hot * 30}, 24, 0.82)`, 12);
        drawBody(0.42, `rgba(255, ${230 - hot * 20}, ${190 - hot * 40}, 0.95)`, 6);
      }

      particles.forEach((particle, index) => {
        const cycle = ((time * 0.00015 * particle.speed + particle.life) % 1);
        const rise = cool ? (0.5 - cycle) * ry * 1.4 : -cycle * ry * (1.3 + buoyancy);
        const spread = (1 - buoyancy) * 18 + 6;
        const x = cx + lean * cycle + Math.sin(particle.drift + cycle * 6 + index) * spread * cycle;
        const y = baseY + ry * 0.2 + rise;
        const alpha = cool ? (1 - cycle) * 0.45 : (1 - cycle) * (0.35 + hot * 0.35);
        ctx.fillStyle = cool ? `rgba(186, 220, 255, ${alpha})` : `rgba(255, ${170 - hot * 40}, 80, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!reduced) raf = requestAnimationFrame(paint);
    };

    raf = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(raf);
  }, []);

  const caption =
    scenario === "cool"
      ? "Cool flame, drawn so you can see a regime the eye misses"
      : gravity <= 0.02
        ? "Spherical. The fan is the only draft."
        : gravity < 0.75
          ? "Partial gravity. Enough lift to feed, not enough to cool."
          : "Earth. Buoyancy stretches the flame and carries smoke up.";

  return (
    <figure className="flame-block">
      <div className="flame-well">
        <canvas ref={ref} className="flame-canvas" aria-hidden />
      </div>
      <div className="flame-chip">
        <span>
          {gravity <= 0.02
            ? "0 g"
            : Math.abs(gravity - 0.166) < 0.015
              ? "0.166 g"
              : Math.abs(gravity - 0.38) < 0.02
                ? "0.38 g"
                : gravity >= 0.97
                  ? "1 g"
                  : `${gravity.toFixed(2)} g`}
        </span>
        <span>{oxygen.toFixed(1)}% O₂</span>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
