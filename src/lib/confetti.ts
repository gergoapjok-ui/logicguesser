// Lightweight canvas-based confetti — no dependency
// Honors the no-anim UI preference
export function celebrate(opts?: { particles?: number; duration?: number; colors?: string[] }) {
  if (typeof document === "undefined") return;
  if (document.documentElement.classList.contains("no-anim")) return;

  const count = opts?.particles ?? 120;
  const duration = opts?.duration ?? 1800;
  const colors = opts?.colors ?? ["#10b981", "#a855f7", "#f59e0b", "#3b82f6", "#ec4899"];

  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;

  const parts = Array.from({ length: count }).map(() => ({
    x: canvas.width / 2 + (Math.random() - 0.5) * 100,
    y: canvas.height / 2,
    vx: (Math.random() - 0.5) * 14,
    vy: -Math.random() * 14 - 4,
    g: 0.35,
    size: 4 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    life: 1,
  }));

  const start = performance.now();
  let raf = 0;

  const tick = (now: number) => {
    const t = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parts.forEach(p => {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life = Math.max(0, 1 - t / duration);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    if (t < duration) {
      raf = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(raf);
      canvas.remove();
    }
  };
  raf = requestAnimationFrame(tick);
}
