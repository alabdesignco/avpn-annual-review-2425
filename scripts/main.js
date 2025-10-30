import { smoothScroll } from './utils/smooth-scroll.js';
import { initModalBasic } from './utils/modalInit.js';
import { initHeaderSection } from './animations/sections/header.js';
import { initHorizontalScrolling } from './animations/sections/forewordv2.js';
import { initStickyTitleScroll } from './animations/sections/stickyTitles.js';
import { initCircularBarChart } from './animations/charts/circularBarChart.js';
import { initTreeMapChart } from './animations/charts/treeMapChart.js';
import { initStaggerColumns } from './animations/sections/whats-new.js';
import { initWordBreak } from './animations/wordBreak.js';
import { initHighlightText } from './animations/highlightText.js';
import { initSectionTitleScroll } from './animations/sectionTitleScroll.js';
import { initCardsScramble } from './animations/cardsScramble.js';
import { initWork } from './animations/sections/work.js';
import { initPartners } from './animations/sections/partners.js';
import { initTeam } from './animations/sections/team.js';
import { initGlobalParallax } from './utils/globalParallax.js';
import { initSectionBgTransition } from './utils/sectionBgTransition.js';
import { initFalling2DMatterJS } from './animations/sections/footer.js';
import { initImageBreakSection } from './animations/sections/image-break.js';
import { initMembersSection } from './animations/sections/members.js';
import { initRegionsSection } from './animations/sections/regions.js';
import { initEventsSection } from './animations/sections/events.js';
import { initImpactActionSection } from './animations/sections/impact-action.js';
// import { initBenefitsSection } from './animations/sections/benefits.js';
import { initImpactHighlights } from './animations/sections/impact-highlights.js';
import { initAccentShapes } from './utils/accentShapes.js';
import { initSwiperSlider } from './utils/swiperInit.js';
import { initSocialLinks } from './utils/socialLinks.js';

gsap.registerPlugin(ScrollTrigger,SplitText);

window.lenis = smoothScroll();

const initAllAnimations = () => {
  initModalBasic();
  initHeaderSection();
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
  initWork();
  initPartners();
  initTeam();
  initGlobalParallax();
  initSectionBgTransition();
  initFalling2DMatterJS();
  initImageBreakSection();
  initMembersSection();
  initRegionsSection();
  initEventsSection();
  initImpactActionSection();
  // initBenefitsSection();
  initAccentShapes();
  initSwiperSlider();
  initSocialLinks();
};

document.addEventListener("DOMContentLoaded", async () => {
  await document.fonts.ready;
  initAllAnimations();
});

// Global ScrollTrigger refresh on window resize
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);
});