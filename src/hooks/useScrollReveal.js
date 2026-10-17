import { useEffect, useRef, useState } from 'react';

/**
 * Element viewportga kirganda animation qo'shadi.
 * IntersectionObserver API ishlatadi — heavy kutubxona kerak emas.
 *
 * Usage:
 *   const [ref, isVisible] = useScrollReveal({ threshold: 0.15 });
 *   return <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>...</div>
 */
export default function useScrollReveal(options = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -50px 0px', once = true } = options;
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, isVisible];
}
