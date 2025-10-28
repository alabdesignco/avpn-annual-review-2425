class HighlightEffect {
  constructor(el, delay = 0) {
    if (!el || !(el instanceof HTMLElement)) {
      throw new Error('Invalid element provided.');
    }

    this.highlightedElement = el;
    this.highlightedWords = this.highlightedElement.querySelectorAll('.word');
    this.delay = delay;
    this.animationDefaults = {
      duration: 0.4,
      ease: 'power1',
    };
    
    this.setInitialState();
    this.initializeEffect();
  }
  
  setInitialState() {
    gsap.set(this.highlightedWords, {
      scale: 1.3,
      opacity: 0
    });
    gsap.set(this.highlightedElement, {
      '--after-scale': 0
    });
  }

  initializeEffect() {
    this.scroll();
  }

  scroll() {
    ScrollTrigger.create({
      trigger: this.highlightedElement,
      start: 'top 60%',
      onEnter: () => this.animateWords(),
      onEnterBack: () => this.animateWords(),
      onLeave: () => this.resetWords(),
      onLeaveBack: () => this.resetWords()
    });
  }

  animateWords() {
    gsap
    .timeline({defaults: this.animationDefaults, delay: this.delay})
    .fromTo(this.highlightedWords, {
      scale: 1.3,
      opacity: 0
    }, { 
      stagger: pos => 0.1+0.05*pos,
      scale: 1,
      opacity: 1
    })
    .fromTo(this.highlightedElement, {
      '--after-scale': 0
    }, {
      duration: 0.8,
      ease: 'expo',
      '--after-scale': 1
    }, 0);
  }

  resetWords() {
    gsap.killTweensOf([this.highlightedWords, this.highlightedElement]);
    gsap.set(this.highlightedElement, {
      '--after-scale': 0
    });
  }
}

export const initImpactHighlights = () => {
    const titleContainers = document.querySelectorAll('.section_highlight-content.is-title-waterfall .highlight-title_container');
    const contentContainers = document.querySelectorAll('.section_highlight-content.is-title-waterfall .highlight-content_bottom');
    if (!titleContainers.length || !contentContainers.length) return;

    titleContainers.forEach(titleContainer => {
        const title = titleContainer.querySelector('.highlight-title-heading');
        if (!title) return;
        
        const split = new SplitText(title, { 
            type: 'chars',
            charsClass: 'letter'
        });
        
        const letters = split.chars;
        
        requestAnimationFrame(() => {
            const dist = titleContainer.clientHeight - title.clientHeight;

            ScrollTrigger.create({
                trigger: titleContainer,
                pin: title,
                start: 'top top',
                end: '+=' + dist,
            });
            
            letters.forEach(letter => {
                const randomDistance = Math.random() * dist;

                gsap.from(letter, {
                    y: randomDistance,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: title,
                        start: 'top top',
                        end: '+=' + randomDistance,
                        scrub: true
                    }
                });
            });
        });
    });

    contentContainers.forEach(contentContainer => {
        const paragraph = contentContainer.querySelector('.text-size-large');
        const image = contentContainer.querySelector('.highlight-image_wrapper');
        const textColorElements = contentContainer.querySelectorAll('[data-highlight-stagger]');
        
        if (paragraph) {
            gsap.from(paragraph, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: contentContainer,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            });
        }
        
        textColorElements.forEach(textElement => {
            const split = new SplitText(textElement, { 
                type: 'words',
                wordsClass: 'word'
            });
            
            new HighlightEffect(textElement, 0.5);
        });
        
        if (image) {
            gsap.from(image, {
                scale: 0.8,
                opacity: 0,
                duration: 1.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: contentContainer,
                    start: 'top 50%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            });
        }
    });
};