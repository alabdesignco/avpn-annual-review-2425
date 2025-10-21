import { initOdometerCounter } from '../odometerCounter.js';

export function initMembersSection() {
  initOdometerCounter();
  const startRotation = initMembersTabs();
  initMembersReveal(startRotation);
}

function initMembersTabs() {
  const tabItems = document.querySelectorAll("[cs-element='tab-item']");
  const tabMain = document.querySelector("[cs-element='tab-main']");
  if (!tabMain) return;

  tabMain.setAttribute("data-member-color", "");

  const mainTitle = tabMain.querySelector("h3.heading-style-h6");
  const mainIcon = tabMain.querySelector(".member-tab-center_icon");
  const mainParagraph = tabMain.querySelector("p");
  if (!mainTitle || !mainIcon || !mainParagraph) return;

  let currentIndex = 0;
  let autoRotateTimer;
  let autoRotateTimeout;

  const switchToTab = (item) => {
    const iconWrapper = item.querySelector(".members-tab_icon-wrapper");
    const titleElement = item.querySelector(".tab-title-small");
    const descriptionParagraph = item.querySelector(".members-tab_description > p");
    if (!iconWrapper || !titleElement || !descriptionParagraph) return;

    const icon = iconWrapper.innerHTML;
    const title = titleElement.textContent;
    const description = descriptionParagraph.textContent;
    const color = item.getAttribute("data-member-color");

    if (mainTitle.innerText !== title) {
      mainTitle.innerHTML = title;
      mainIcon.innerHTML = icon;
      mainParagraph.textContent = description;
      tabMain.parentNode.setAttribute("data-member-color", color);

      gsap.fromTo(
        tabMain.parentNode,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.4)" }
      );
    }
  };

  const startAutoRotate = (initialDelay = 8000) => {
    autoRotateTimeout = setTimeout(() => {
      currentIndex = (currentIndex + 1) % tabItems.length;
      switchToTab(tabItems[currentIndex]);
      
      autoRotateTimer = setInterval(() => {
        currentIndex = (currentIndex + 1) % tabItems.length;
        switchToTab(tabItems[currentIndex]);
      }, 10000);
    }, initialDelay);
  };

  const resetAutoRotate = () => {
    clearTimeout(autoRotateTimeout);
    clearInterval(autoRotateTimer);
    startAutoRotate();
  };

  tabItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      currentIndex = index;
      switchToTab(item);
      resetAutoRotate();
    });
  });

  return startAutoRotate;
}

function initMembersReveal(startRotation) {
  const wrappers = document.querySelectorAll('.members-content_wrapper');
  const tabItems = document.querySelectorAll("[cs-element='tab-item']");
  const tabCenter = document.querySelector("[data-member-tab-center]");
  
  wrappers.forEach(wrapper => {
    if (!wrapper.odometerInstance) return;

    const heading = wrapper.querySelector('[data-member-heading]');
    const button = wrapper.querySelector('[data-member-button]');
    if (!heading || !button) return;

    const tabItemsArray = Array.from(tabItems);
    const midIndex = Math.floor(tabItemsArray.length / 2);
    const allTabElements = [...tabItemsArray.slice(0, midIndex), tabCenter, ...tabItemsArray.slice(midIndex)];

    gsap.set([heading, button], { opacity: 0, y: 30 });
    gsap.set(allTabElements, { opacity: 0, scale: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top 80%',
        once: true
      },
      onComplete: () => {
        if (startRotation) startRotation(2000);
      }
    });

    tl.call(() => {
      wrapper.odometerInstance.odometer.update(wrapper.odometerInstance.endValue);
    })
    .to([heading, button], {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out'
    }, '+=0.3')
    .to(allTabElements, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      stagger: {
        amount: 0.8,
        from: 'center'
      },
      ease: 'back.out(1.4)'
    }, '<');
  });
}