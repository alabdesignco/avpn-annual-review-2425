import { smoothScroll } from './utils/smooth-scroll.js';
import { initInfiniteCanvas } from './animations/infiniteCanvas.js';
import { initHorizontalScroll } from './animations/horizontalScroll.js';
import { initStickyTitleScroll } from './animations/stickyTitles.js';
import { initCircularBarChart } from './animations/charts/circularBarChart.js';
import { initTreeMapChart } from './animations/charts/treeMapChart.js';
import { initStaggerColumns } from './animations/staggerColumns.js';

gsap.registerPlugin(ScrollTrigger,Observer,SplitText);

smoothScroll();

document.addEventListener("DOMContentLoaded", () => {
  initInfiniteCanvas();
  initHorizontalScroll();
  initStickyTitleScroll();
  initCircularBarChart();
  initTreeMapChart();
  initStaggerColumns();
});