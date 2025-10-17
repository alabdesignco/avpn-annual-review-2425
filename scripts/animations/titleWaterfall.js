export const initTitleWaterfall = () => {
    const root = document.querySelector('.section_highlight-content .is-title-waterfall');
    if (!root) return;

    root.querySelectorAll('.highlight-title_container').forEach(container => {
        const title = container.querySelector('.highlight-title-heading');
        
        const split = new SplitText(title, { 
            type: 'chars',
            charsClass: 'letter'
        });
        
        const letters = split.chars;
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
};