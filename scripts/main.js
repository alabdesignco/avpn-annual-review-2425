import { smoothScroll } from './utils/smooth-scroll.js';
import { initScrollReveal } from './utils/scrollReveal.js';
import { initModalBasic } from './utils/modalInit.js';
import { initHeaderSection } from './animations/sections/header.js';
// import { initForewordSection } from './animations/sections/foreword.js';
import { initHorizontalScrolling } from './animations/sections/forewordv2.js';
import { initStickyTitleScroll } from './animations/sections/stickyTitles.js';
import { initCircularBarChart } from './animations/charts/circularBarChart.js';
import { initTreeMapChart } from './animations/charts/treeMapChart.js';
import { initStaggerColumns } from './animations/sections/whats-new.js';
import { initWordBreak } from './animations/wordBreak.js';
import { initHighlightText } from './animations/highlightText.js';
import { initSectionTitleScroll } from './animations/sectionTitleScroll.js';
import { initCardsScramble } from './animations/cardsScramble.js';
import { initDirectionalListHover } from './animations/directionalHover.js';
import { initLogoWallCycle } from './animations/logoWallCycle.js';
import { initTeamTabs } from './animations/teamTabs.js';
import { initGlobalParallax } from './utils/globalParallax.js';
import { initSectionBgTransition } from './utils/sectionBgTransition.js';
import { initFalling2DMatterJS } from './animations/sections/footer.js';
import { initImageBreakSection } from './animations/sections/image-break.js';
import { initMembersSection } from './animations/sections/members.js';
import { initRegionsSection } from './animations/sections/regions.js';
import { initEventsSection } from './animations/sections/events.js';
import { initImpactActionSection } from './animations/sections/impact-action.js';
import { initBenefitsSection } from './animations/sections/benefits.js';
import { initImpactHighlights } from './animations/sections/impact-highlights.js';

gsap.registerPlugin(ScrollTrigger,Observer,SplitText);

window.lenis = smoothScroll();

const initAllAnimations = () => {
  initScrollReveal();
  initModalBasic();
  initHeaderSection();
  // initForewordSection();
  initHorizontalScrolling();
  initStickyTitleScroll();
  initCircularBarChart();
  initTreeMapChart();
  initStaggerColumns();
  initWordBreak();
  initHighlightText();
  initImpactHighlights();
  initSectionTitleScroll();
  initCardsScramble();
  initDirectionalListHover();
  initLogoWallCycle();
  initTeamTabs();
  initGlobalParallax();
  initSectionBgTransition();
  initFalling2DMatterJS();
  initImageBreakSection();
  initMembersSection();
  initRegionsSection();
  initEventsSection();
  initImpactActionSection();
  initBenefitsSection();
};

document.addEventListener("DOMContentLoaded", async () => {
  await document.fonts.ready;
  initAllAnimations();
});