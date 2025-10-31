export const initSwiperSlider = () => {  
  const swiperSliderGroups = document.querySelectorAll("[data-swiper-group]");
  
  swiperSliderGroups.forEach((swiperGroup) => {
    const swiperSliderWrap = swiperGroup.querySelector("[data-swiper-wrap]");
    if(!swiperSliderWrap) return;
    
    const prevButton = swiperGroup.querySelector("[data-swiper-prev]");
    const nextButton = swiperGroup.querySelector("[data-swiper-next]");
    
    const isTouchDevice = 'ontouchstart' in window;
    
    const swiper = new Swiper(swiperSliderWrap, {
      slidesPerView: 1.25,
      speed: 600,
      mousewheel: !isTouchDevice,
      grabCursor: true,
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
        waitForTransition: true,
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
        },
        // when window width is >= 480px
        480: {
          slidesPerView: 1,
        },
        // when window width is >= 992px
        992: {
          slidesPerView: 1.25,
        }
      },
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },    
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },      
    });    
    
    if (swiper.autoplay) swiper.autoplay.stop();
    
  });
};