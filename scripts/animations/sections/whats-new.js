export const initStaggerColumns = () => {
    const root = document.querySelector('.section_new');
    if (!root) return;

    const pinHeight = root.querySelector('.new_pin-height');
    const container = root.querySelector('.new_layout');
    const paragraphs = root.querySelectorAll('.new-paragraph_item');
    const buttonGroup = root.querySelector('.button-group');

    if (!pinHeight || !container || paragraphs.length === 0) return;

    const splits = Array.from(paragraphs).map(paragraph =>
        new SplitText(paragraph, { 
            type: 'words', 
            wordsClass: 'word',
            mask: 'words'
        })
    );

    gsap.set(splits.flatMap(split => split.words), { yPercent: 100 });

    let initialized = false;

    ScrollTrigger.create({
        trigger: root,
        start: 'top bottom',
        once: true,
        onEnter: () => {
            if (initialized) return;
            initialized = true;

            requestAnimationFrame(() => {
                ScrollTrigger.refresh();

                ScrollTrigger.create({
                    trigger: pinHeight,
                    start: 'top top',
                    end: 'bottom bottom',
                    pin: container
                });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: pinHeight,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: true
                    }
                });

                splits.forEach((split, index) => {
                    tl.to(split.words, {
                        yPercent: 0,
                        duration: 1,
                        stagger: 0.2,
                        ease: 'power4.out'
                    }, index > 0 ? '+=0.5' : 0);
                });

                if (buttonGroup) {
                    gsap.set(buttonGroup, { opacity: 0, y: 20 });
                    tl.to(buttonGroup, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power2.out'
                    }, '+=0.3');
                }
            });
        }
    });
};

