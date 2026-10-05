"use client";
// Pinned, scroll-scrubbed canvas: scrolling plays one day of a Sunvault install.
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createCinema, STAGES } from "../lib/cinema";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollCinema() {
  const section = useRef(null);
  const canvas = useRef(null);
  const ticks = useRef([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const font = getComputedStyle(document.documentElement).getPropertyValue("--font-sora") || "system-ui";
    const scene = createCinema(canvas.current, { font });
    const state = { p: 0 };

    const ctx = gsap.context(() => {
      gsap.to(state, {
        p: 1,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "+=400%", pin: true, scrub: 0.8 },
        onUpdate: () => {
          scene.render(state.p);
          const idx = Math.min(STAGES.length - 1, Math.floor(state.p * STAGES.length));
          setActive((cur) => (cur === idx ? cur : idx));
          ticks.current.forEach((t, i) => {
            if (t) t.style.transform = `scaleX(${Math.min(1, Math.max(0, state.p * STAGES.length - i))})`;
          });
        },
      });
    }, section);

    scene.render(0);
    return () => { ctx.revert(); scene.destroy(); };
  }, []);

  return (
    <section className="cinema" ref={section} id="how" aria-label="How a Sunvault install works">
      <canvas ref={canvas} role="img" aria-label="Animated scene of a house getting solar panels and a battery, staying lit during loadshedding" />
      <div className="cinema-ui">
        <div className="wrap">
          <div className="captions" aria-live="polite">
            {STAGES.map((s, i) => (
              <div key={s.n} className={`caption${i === active ? " is-active" : ""}`}>
                <span className="n">{s.n} / 05</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
          <div className="ticks" aria-hidden="true">
            {STAGES.map((s, i) => (
              <span key={s.n}><i ref={(el) => (ticks.current[i] = el)} /></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
