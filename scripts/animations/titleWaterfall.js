export const initTitleWaterfall = () => {
    const containers = document.querySelectorAll('.section_highlight-content.is-title-waterfall .highlight-title_container');
    if (!containers.length) return;

    containers.forEach(container => {
        const title = container.querySelector('.highlight-title-heading');
        if (!title) return;
        
        const split = new SplitText(title, { 
            type: 'chars',
            charsClass: 'letter'
        });
        
        const letters = split.chars;
        
        requestAnimationFrame(() => {
            const dist = container.clientHeight - title.clientHeight;

            ScrollTrigger.create({
                trigger: container,
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
};