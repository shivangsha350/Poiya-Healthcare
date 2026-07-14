"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px', // Trigger slightly before it comes fully into view
      threshold: 0.05,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const observeElements = () => {
      const revealElements = document.querySelectorAll('.reveal:not([data-observed])');
      revealElements.forEach((el) => {
        el.setAttribute('data-observed', 'true');
        observer.observe(el);
      });
    };

    // Initial observation
    observeElements();

    // Setup MutationObserver to watch for dynamic or lazy-loaded elements
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
