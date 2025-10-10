export const initWordBreak = () => {
    const section = document.querySelector('.section_word-break');
    const text = document.querySelector('.section_word-break .word-break-text');
  
    const split = new SplitText(text, { type: "words, chars", smartWrap: true, wordsClass: "word", charsClass: "char" });
    
    const letters = split.chars;
    const words = split.words; 
  
    const distance = text.clientWidth - document.body.clientWidth;
  
    const scrollTween = gsap.to(text, {
      x: -distance,
      ease: 'none',
      scrollTrigger: {
        trigger: '.section_word-break .word-break_container',
        pin: true,
        end: '+=' + distance,
        scrub: true
      }
    });
  
    gsap.from(section, {
      ease: "power1.out",
      scrollTrigger: {
        trigger: '.section_word-break .word-break_container',
        start: 'top top',
        end: '+=200',
        scrub: true
      }
    });
  
    letters.forEach(letter => {
      gsap.from(letter, {
        yPercent: (Math.random() - 0.5) * 400,
        rotation: (Math.random() - 0.5) * 60,
        ease: "elastic.out(1.2, 1)",
        scrollTrigger: {
          trigger: letter,
          containerAnimation: scrollTween,
          start: 'left 90%',
          end: 'left 10%',
          scrub: 0.5
        }
      });
    });
};