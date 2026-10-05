"use client";
// Page-wide motion: preloader, Lenis smooth scroll wired into GSAP's ticker, and scroll reveals.
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export default function Motion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Smooth scroll (skipped for reduced motion)
    let lenis;
    const tick = (time) => lenis && lenis.raf(time * 1000);
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.1 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {
      // Preloader: count to 100 once fonts are ready, then lift away and reveal the hero
      const counter = { v: 0 };
      const count = document.querySelector(".preloader-count");
      const bar = document.querySelector(".preloader-bar i");
      const tl = gsap.timeline({ paused: true });
      tl.to(counter, {
        v: 100, duration: reduce ? 0.2 : 1.4, ease: "power2.inOut",
        onUpdate: () => { count.textContent = `Loading ${Math.round(counter.v)}%`; bar.style.width = counter.v + "%"; },
      })
        .to(".preloader", { yPercent: -100, duration: reduce ? 0.2 : 0.9, ease: "expo.inOut" })
        .from(".hero h1 .line > span", { yPercent: 110, duration: 1, ease: "expo.out", stagger: 0.08 }, "-=0.35")
        .from(".hero .reveal", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 }, "-=0.7")
        .set(".preloader", { display: "none" });
      document.fonts.ready.then(() => tl.play());

      // Section reveals
      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        gsap.from(el.children, {
          y: 40, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 82%" },
        });
      });

      // Count-up numbers
      gsap.utils.toArray("[data-count]").forEach((el) => {
        const end = parseFloat(el.dataset.count), dec = el.dataset.count.includes(".") ? 1 : 0, o = { v: 0 };
        gsap.to(o, {
          v: end, duration: 1.6, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => (el.textContent = o.v.toFixed(dec)),
        });
      });
    });

    return () => {
      ctx.revert();
      if (lenis) { gsap.ticker.remove(tick); lenis.destroy(); }
    };
  }, []);

  return null;
}
