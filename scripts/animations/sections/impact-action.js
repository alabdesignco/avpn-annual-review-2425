export const initImpactActionSection = () => {
  const highlightScrollSections = document.querySelectorAll('.section_highlight-scroll');
  
  highlightScrollSections.forEach((section) => {
    const contentItems = section.querySelectorAll('.highlight-scroll_content');
    const headings = section.querySelectorAll('.highlight-scroll_content .heading-style-h3');
    const timelineLine = section.querySelector('.highlight_timeline-line');
    
    if (headings.length === 0) return;
    
    // Initialize content items and their circles - hide all initially
    contentItems.forEach((item, index) => {
      const circle = item.querySelector('.highlight_timeline-circle');
      
      gsap.set(item, { autoAlpha: 0, y: 30 });
      if (circle) {
        circle.classList.remove('is-active');
      }
    });
    
    const firstItem = contentItems[0];
    const lastItem = contentItems[contentItems.length - 1];
    
    const sectionTrigger = ScrollTrigger.create({
      trigger: firstItem,
      start: "top center",
      endTrigger: lastItem,
      end: "bottom center",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        
        if (timelineLine) {
          gsap.set(timelineLine, { 
            scaleY: progress,
            transformOrigin: "top center"
          });
        }
      }
    });
    
    contentItems.forEach((item, index) => {
      const circle = item.querySelector('.highlight_timeline-circle');
      
      ScrollTrigger.create({
        trigger: item,
        start: "top center",
        toggleActions: "play none none reverse",
        animation: gsap.to(item, { 
          autoAlpha: 1, 
          y: 0, 
          duration: 0.6, 
          ease: "power2.out" 
        }),
        onEnter: () => {
          if (circle) {
            circle.classList.add('is-active');
          }
        },
        onEnterBack: () => {
          if (circle) {
            circle.classList.add('is-active');
          }
        },
        onLeave: () => {
          if (circle) {
            circle.classList.remove('is-active');
          }
        },
        onLeaveBack: () => {
          if (circle) {
            circle.classList.remove('is-active');
          }
        }
      });
    });
  });
}
