const initStaggerColumns = () => {
    const root = document.querySelector('.section_new');
    const pinHeight = root.querySelector('.new_pin-height');
    const container = root.querySelector('.new_layout');
    const paragraphs = root.querySelectorAll('.new-paragraph_item');

    const splits = Array.from(paragraphs).map(paragraph =>
        new SplitText(paragraph, { type: 'words', wordsClass: 'word', mask: "words" })
    );

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

    paragraphs.forEach((paragraph, index) => {
        if (paragraphs[index + 1]) {
            tl.to(splits[index].words, {
                y: '100%',
                duration: 1,
                stagger: 0.2,
                ease: 'power4.in'
            });
            tl.to(splits[index + 1].words, {
                y: '0%',
                duration: 1,
                delay: 1,
                stagger: 0.2,
                ease: 'power4.out'
            }, '<');
        }
    });
};

export { initStaggerColumns };