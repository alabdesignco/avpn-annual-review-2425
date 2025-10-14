import { smoothScroll } from './utils/smooth-scroll.js';
import initInfiniteCanvas from './animations/infiniteCanvas.js';
import { initHorizontalScroll } from './animations/horizontalScroll.js';
import { initStickyTitleScroll } from './animations/stickyTitles.js';
import { initCircularBarChart } from './animations/charts/circularBarChart.js';
import { initTreeMapChart } from './animations/charts/treeMapChart.js';
import { initStaggerColumns } from './animations/staggerColumns.js';
import { initWordBreak } from './animations/wordBreak.js';
import { initHighlightText } from './animations/highlightText.js';
import { initSectionTitleScroll } from './animations/sectionTitleScroll.js';
import { initCardsScramble } from './animations/cardsScramble.js';
  
gsap.registerPlugin(ScrollTrigger,Observer,SplitText,Draggable);

smoothScroll();

document.addEventListener("DOMContentLoaded", () => {
  initInfiniteCanvas();
  initHorizontalScroll();
  initStickyTitleScroll();
  initCircularBarChart();
  initTreeMapChart();
  initStaggerColumns();
  initWordBreak();
  initHighlightText();
  initSectionTitleScroll();
  initCardsScramble();
});