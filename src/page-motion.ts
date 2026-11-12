import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import type Swiper from 'swiper';

gsap.registerPlugin(ScrollTrigger);

export function initPageMotion(hero?: Swiper) {
  let scroll: Lenis | undefined;
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    const lenis = new Lenis({ anchors: true });
    scroll = lenis;
    const tick = (seconds: number) => lenis.raf(seconds * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const splits = new Map<HTMLElement, SplitType>();
    const reveal = { yPercent: 0, ease: 'power3.out', clearProps: 'transform' };
    for (const title of document.querySelectorAll<HTMLElement>('.heading-reveal')) {
      const heading = title.parentElement!;
      heading.setAttribute('aria-label', title.textContent!.replace(/\s+/g, ' ').trim());
      title.setAttribute('aria-hidden', 'true');
      const split = new SplitType(title, { types: ['words', 'chars'], tagName: 'span', wordClass: 'reveal-word' });
      splits.set(title, split);
      if (heading.classList.contains('section-title')) {
        gsap.fromTo(split.chars, { yPercent: 105 }, {
          ...reveal,
          duration: 0.35,
          stagger: 0.018,
          scrollTrigger: { trigger: heading, start: 'top 72%', once: true }
        });
      }
    }

    let heroTween: gsap.core.Tween | undefined;
    const revealSlide = () => {
      const title = hero?.slides[hero.activeIndex]?.querySelector<HTMLElement>('.heading-reveal');
      heroTween?.progress(1).kill();
      const chars = title && splits.get(title)?.chars;
      if (chars) heroTween = gsap.fromTo(chars, { yPercent: 105 }, {
        ...reveal, duration: 0.8, stagger: 0.045, delay: 0.18, ease: 'power2.out'
      });
    };
    revealSlide();
    hero?.on('slideChangeTransitionStart', revealSlide);
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      hero?.off('slideChangeTransitionStart', revealSlide);
      heroTween?.revert();
      for (const [title, split] of splits) {
        split.revert();
        title.removeAttribute('aria-hidden');
        title.parentElement?.removeAttribute('aria-label');
      }
      gsap.ticker.remove(tick);
      lenis.destroy();
      scroll = undefined;
    };
  });
  return () => {
    if (scroll) scroll.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: 'instant' });
  };
}
