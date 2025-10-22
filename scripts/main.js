import { smoothScroll } from './utils/smooth-scroll.js';
import { initModalBasic } from './utils/modalInit.js';
import { initHeaderSection } from './animations/sections/header.js';
import { initForewordSection } from './animations/sections/foreword.js';
import { initStickyTitleScroll } from './animations/sections/stickyTitles.js';
import { initCircularBarChart } from './animations/charts/circularBarChart.js';
import { initTreeMapChart } from './animations/charts/treeMapChart.js';
import { initStaggerColumns } from './animations/staggerColumns.js';
import { initWordBreak } from './animations/wordBreak.js';
import { initHighlightText } from './animations/highlightText.js';
import { initTitleWaterfall } from './animations/titleWaterfall.js';
import { initSectionTitleScroll } from './animations/sectionTitleScroll.js';
import { initCardsScramble } from './animations/cardsScramble.js';
import { initDirectionalListHover } from './animations/directionalHover.js';
import { initLogoWallCycle } from './animations/logoWallCycle.js';
import { initTeamTabs } from './animations/teamTabs.js';
import { initGlobalParallax } from './utils/globalParallax.js';
import { initFooterWaves } from './animations/footerWaves.js';
import { initImageBreak } from './animations/imageBreak.js';
import { initMembersSection } from './animations/sections/members.js';
import { initRegionsSection } from './animations/sections/regions.js';
import { initEventsSection } from './animations/sections/events.js';
import { initImpactActionSection } from './animations/sections/impact-action.js';

gsap.registerPlugin(ScrollTrigger,Observer,SplitText,Draggable);

window.lenis = smoothScroll();

const initAllAnimations = () => {
  initModalBasic();
  initHeaderSection();
  initForewordSection();
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
  initLogoWallCycle();
  initTeamTabs();
  initGlobalParallax();
  initFooterWaves();
  initImageBreak();
  initMembersSection();
  initRegionsSection();
  initEventsSection();
  initImpactActionSection();
};

document.addEventListener("DOMContentLoaded", async () => {
  await document.fonts.ready;
  initAllAnimations();
});