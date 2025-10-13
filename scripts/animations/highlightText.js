export function initHighlightText(){
  let splitHeadingTargets = document.querySelectorAll("[data-highlight-text]")
  splitHeadingTargets.forEach((heading) => {
    const scrollStart = heading.getAttribute("data-highlight-scroll-start") || "top 90%"
    const scrollEnd = heading.getAttribute("data-highlight-scroll-end") || "center 40%"
    const fadedValue = heading.getAttribute("data-highlight-fade") || 0.2
    const staggerValue = heading.getAttribute("data-highlight-stagger") || 0.1
    const bgColor = heading.getAttribute("data-highlight-bg") || "193, 230, 231"
    
    new SplitText(heading, {
      type: "words",
      autoSplit: true,
      onSplit(self) {
        let ctx = gsap.context(() => {
          const wordWrappers = [];
          
          self.words.forEach((word) => {
            const wrapper = document.createElement("div");
            wrapper.className = "highlight-word";
            word.parentNode.insertBefore(wrapper, word);
            wrapper.appendChild(word);
            wordWrappers.push(wrapper);
          });
          
          let tl = gsap.timeline({
            scrollTrigger: {
              scrub: true,
              trigger: heading, 
              start: scrollStart,
              end: scrollEnd,
            }
          });
          
          self.words.forEach((word, index) => {
            const wrapper = wordWrappers[index];
            const wordDelay = index * staggerValue;
            
            tl.from(wrapper, {
              backgroundColor: `rgba(${bgColor}, 0)`,
              duration: 0.3,
              ease: "linear"
            }, wordDelay)
            .from(word, {
              opacity: 0,
              duration: 0.2,
              ease: "linear"
            }, wordDelay + 0.1)
            .to(wrapper, {
              backgroundColor: `rgba(${bgColor}, 0)`,
              duration: 0.3,
              ease: "linear"
            }, wordDelay + 0.4);
          });
        });
        return ctx;
      }
    });    
  });
}