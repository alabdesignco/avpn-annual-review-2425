import { smoothScroll } from './utils/smooth-scroll.js';
import { initModalBasic } from './utils/modalInit.js';
import initInfiniteCanvas from './animations/infiniteCanvas.js';
import { initHorizontalScroll } from './animations/horizontalScroll.js';
import { initStickyTitleScroll } from './animations/stickyTitles.js';
import { initCircularBarChart } from './animations/charts/circularBarChart.js';
import { initTreeMapChart } from './animations/charts/treeMapChart.js';
import { initStaggerColumns } from './animations/staggerColumns.js';
import { initWordBreak } from './animations/wordBreak.js';
import { initHighlightText } from './animations/highlightText.js';
import { initTitleWaterfall } from './animations/titleWaterfall.js';
import { initSectionTitleScroll } from './animations/sectionTitleScroll.js';
import { initCardsScramble } from './animations/cardsScramble.js';
import { initDirectionalListHover } from './animations/directionalHover.js';
import { initOdometerCounter } from './animations/odometerCounter.js';
import { initLogoWallCycle } from './animations/logoWallCycle.js';
import { initTeamTabs } from './animations/teamTabs.js';
import { initGlobalParallax } from './utils/globalParallax.js';
import { initFooterWaves } from './animations/footerWaves.js';
import { initImageBreak } from './animations/imageBreak.js';
  
gsap.registerPlugin(ScrollTrigger,Observer,SplitText,Draggable);

smoothScroll();

document.addEventListener("DOMContentLoaded", () => {
  initModalBasic();
  initInfiniteCanvas();
  initHorizontalScroll();
  initStickyTitleScroll();
  initCircularBarChart();
  initTreeMapChart();
  initStaggerColumns();
  initWordBreak();
  initHighlightText();
  initTitleWaterfall();
  initSectionTitleScroll();
  initCardsScramble();
  initDirectionalListHover();
  initOdometerCounter();
  initLogoWallCycle();
  initTeamTabs();
  initGlobalParallax();
  initFooterWaves();
  initImageBreak();
});