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