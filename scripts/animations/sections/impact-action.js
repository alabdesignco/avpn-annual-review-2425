export function initImpactActionSection() {
  const highlightScrollSections = document.querySelectorAll('.section_highlight-scroll');
  
  highlightScrollSections.forEach((section) => {
    const icons = section.querySelectorAll('.highlight-scroll_icon');
    const contentItems = section.querySelectorAll('.highlight-scroll_content');
    const headings = section.querySelectorAll('.highlight-scroll_content .heading-style-h3');
    const timelineCircles = section.querySelectorAll('.highlight_timeline-circle');
    const timelineLine = section.querySelector('.highlight_timeline-line');
    const iconWrapper = section.querySelector('.highlight-scroll_icon-wrapper');
    
    if (icons.length === 0 || headings.length === 0) return;
    
    // Initialize icons - hide all except first
    icons.forEach((icon, index) => {
      if (index === 0) {
        icon.classList.add('is-active');
        gsap.set(icon, { autoAlpha: 1 });
      } else {
        icon.classList.remove('is-active');
        gsap.set(icon, { autoAlpha: 0 });
      }
    });
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top center",
        end: "bottom center",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const activeIndex = Math.round(progress * (headings.length - 1));
          const clampedIndex = Math.min(Math.max(activeIndex, 0), headings.length - 1);
          
          icons.forEach((icon, index) => {
            const isActive = index === clampedIndex;
            
            if (isActive) {
              icon.classList.add('is-active');
              gsap.to(icon, { autoAlpha: 1, duration: 0.3, ease: "power2.out" });
            } else {
              icon.classList.remove('is-active');
              gsap.to(icon, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
            }
          });
          
          timelineCircles.forEach((circle, index) => {
            const isActive = index === clampedIndex;
            const wasActive = circle.classList.contains('is-active');
            
            if (isActive && !wasActive) {
              circle.classList.add('is-active');
              gsap.fromTo(circle, 
                { scale: 0.5, opacity: 0.3 },
                { scale: 1.2, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
              );
            } else if (!isActive && wasActive) {
              circle.classList.remove('is-active');
              gsap.to(circle, { scale: 0.8, opacity: 0.3, duration: 0.3, ease: "power2.out" });
            }
            
            // Sync circle position with wrapper
            if (iconWrapper) {
              const wrapperRect = iconWrapper.getBoundingClientRect();
              const sectionRect = section.getBoundingClientRect();
              const relativeTop = wrapperRect.top - sectionRect.top;
              const sectionHeight = sectionRect.height;
              const circleProgress = Math.max(0, Math.min(1, relativeTop / sectionHeight));
              
              gsap.set(circle, { 
                y: circleProgress * 100 + "%",
                transformOrigin: "center center"
              });
              
            }
          });
          
          if (timelineLine && iconWrapper) {
            const wrapperRect = iconWrapper.getBoundingClientRect();
            const sectionRect = section.getBoundingClientRect();
            const relativeTop = wrapperRect.top - sectionRect.top;
            const sectionHeight = sectionRect.height;
            const wrapperProgress = Math.max(0, Math.min(1, relativeTop / sectionHeight));
            
            gsap.set(timelineLine, { 
              scaleY: wrapperProgress,
              transformOrigin: "top center"
            });
          }
        }
      }
    });
    
    headings.forEach((heading, index) => {
      ScrollTrigger.create({
        trigger: heading,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          icons.forEach((icon, i) => {
            const isActive = i === index;
            const wasActive = icon.classList.contains('is-active');
            
            if (isActive) {
              icon.classList.add('is-active');
              gsap.to(icon, { autoAlpha: 1, duration: 0.3, ease: "power2.out" });
            } else {
              icon.classList.remove('is-active');
              gsap.to(icon, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
            }
          });
          
          timelineCircles.forEach((circle, i) => {
            const isActive = i === index;
            const wasActive = circle.classList.contains('is-active');
            
            if (isActive && !wasActive) {
              circle.classList.add('is-active');
              gsap.fromTo(circle, 
                { scale: 0.5, opacity: 0.3 },
                { scale: 1.2, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
              );
            } else if (!isActive && wasActive) {
              circle.classList.remove('is-active');
              gsap.to(circle, { scale: 0.8, opacity: 0.3, duration: 0.3, ease: "power2.out" });
            }
          });
        },
        onEnterBack: () => {
          icons.forEach((icon, i) => {
            const isActive = i === index;
            const wasActive = icon.classList.contains('is-active');
            
            if (isActive) {
              icon.classList.add('is-active');
              gsap.to(icon, { autoAlpha: 1, duration: 0.3, ease: "power2.out" });
            } else {
              icon.classList.remove('is-active');
              gsap.to(icon, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
            }
          });
          
          timelineCircles.forEach((circle, i) => {
            const isActive = i === index;
            const wasActive = circle.classList.contains('is-active');
            
            if (isActive && !wasActive) {
              circle.classList.add('is-active');
              gsap.fromTo(circle, 
                { scale: 0.5, opacity: 0.3 },
                { scale: 1.2, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
              );
            } else if (!isActive && wasActive) {
              circle.classList.remove('is-active');
              gsap.to(circle, { scale: 0.8, opacity: 0.3, duration: 0.3, ease: "power2.out" });
            }
          });
        }
      });
    });
  });
}
