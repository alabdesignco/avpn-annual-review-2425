import { preloadImages } from '../../utils/imageLoaded.js'

export const initHeaderSection = () => {
  const container = document.querySelector(".section_home-header .home-header_wrapper");
  if (!container) return;

class Grid {
  constructor() {
    this.dom = document.querySelector(".section_home-header")
    this.grid = document.querySelector(".home-header_wrapper")
    this.imageWrappers = [...document.querySelectorAll(".home-header_image-wrapper")]
    this.heading = document.querySelector(".home-header_heading")
    this.navbar = document.querySelector(".navbar_component")
    this.taglines = [...document.querySelectorAll(".tagline")]

    this.baseX = 0
    this.baseY = 0
  }

  init() {
    this.intro()
  }

  intro() {
    this.centerGrid()
    this.setupSplitText()

    const timeline = gsap.timeline()

    timeline.set(this.dom, { scale: .5 })
    timeline.set(this.imageWrappers, {
      scale: 0.5,
      autoAlpha: 0
    })
    if (this.taglines.length > 0) {
      timeline.set(this.taglines, {
        yPercent: 100,
        autoAlpha: 0,
      })
    }
    timeline.set(this.navbar, {
      y: -100,
      autoAlpha: 0
    })

    timeline.to(this.heading, {
      autoAlpha: 1,
      duration: 0.1
    })
    timeline.from(this.headingChars, {
      yPercent: 100,
      autoAlpha: 0,
      duration: 2,
      ease: "expo.inOut",
      stagger: 0.02
    })
    if (this.taglines.length > 0) {
      timeline.to(this.taglines, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.15
      }, "-=1.5")
    }

    timeline.to(this.imageWrappers, {
      scale: 1,
      autoAlpha: 1,
      duration: 0.6,
      ease: "power3.out",
      stagger: {
        amount: 1.2,
        from: "random"
      }
    })
    timeline.to(this.dom, {
      scale: 1,
      duration: 1.2,
      ease: "power3.inOut"
    })
    timeline.to(this.navbar, {
      y: 0,
      autoAlpha: 1,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4")
    timeline.call(() => {
      this.animateToPositions()
      this.addEvents()
      this.observeImages()
      this.applyHideAfterIntro()
    })
  }

  animateToPositions() {
    gsap.to(this.imageWrappers, {
      x: (i, el) => this.getResponsiveValue(el, 'x') || 0,
      y: (i, el) => this.getResponsiveValue(el, 'y') || 0,
      duration: 0.96,
      ease: "power3.inOut"
    })
  }

  setupSplitText() {
    if (!this.heading) return

    this.splitText = SplitText.create(this.heading, { 
      type: "chars",
      mask: "chars"
    })
    this.headingChars = this.splitText.chars

  }

  getResponsiveValue(element, attr) {
    const isMobile = window.matchMedia('(max-width: 479px)').matches;
    const isTablet = window.matchMedia('(min-width: 480px) and (max-width: 991px)').matches;
    
    if (isMobile) {
      return element.dataset[`mobile${attr.charAt(0).toUpperCase() + attr.slice(1)}`] || 
             element.dataset[`tablet${attr.charAt(0).toUpperCase() + attr.slice(1)}`] || 
             element.dataset[attr];
    } else if (isTablet) {
      return element.dataset[`tablet${attr.charAt(0).toUpperCase() + attr.slice(1)}`] || 
             element.dataset[attr];
    }
    return element.dataset[attr];
  }

  repositionImages() {
    this.imageWrappers.forEach((wrapper) => {
      const x = this.getResponsiveValue(wrapper, 'x') || 0;
      const y = this.getResponsiveValue(wrapper, 'y') || 0;
      
      gsap.set(wrapper, {
        x: x,
        y: y
      })
    })
  }

  centerGrid() {
    const gridWidth = this.grid.offsetWidth
    const gridHeight = this.grid.offsetHeight
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    const centerX = (windowWidth - gridWidth) / 2
    const centerY = (windowHeight - gridHeight) / 2

    gsap.set(this.grid, {
      x: centerX,
      y: centerY
    })
    
    this.baseX = centerX
    this.baseY = centerY
  }

  addEvents() {
    let resizeTimer;
    let lastWidth = window.innerWidth;
    
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const currentWidth = window.innerWidth;
        if (currentWidth !== lastWidth) {
          this.centerGrid();
          this.repositionImages();
          lastWidth = currentWidth;
        }
      }, 200);
    })

    const isDesktop = window.innerWidth >= 992;
    
    if (isDesktop) {
      this.dom.addEventListener("mousemove", (e) => {
        const offsetX = (e.clientX / window.innerWidth - 0.5) * 30
        const offsetY = (e.clientY / window.innerHeight - 0.5) * 30
        
        gsap.to(this.grid, {
          x: this.baseX + offsetX,
          y: this.baseY + offsetY,
          duration: 0.8,
          ease: "power2.out",
          overwrite: "auto"
        })
      })
    }
  }

  observeImages() {
    const isDesktop = window.innerWidth >= 992;
    
    if (!isDesktop) return;
    
    const showThreshold = 0.88
    const hideThreshold = 0.72
    const steps = [0, 0.5, 0.72, 0.88, 1]

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target
        const ratio = entry.intersectionRatio
        const isVisible = el.__visible === true

        if (!isVisible && ratio >= showThreshold) {
          el.__visible = true
          gsap.to(el, {
            scale: 1,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power3.out"
          })
        } else if (ratio <= hideThreshold && el.__visible !== false) {
          el.__visible = false
          gsap.to(el, {
            scale: 0.5,
            autoAlpha: 0,
            duration: 0.6,
            ease: "power3.out"
          })
        }
      })
    }, {
      threshold: steps
    })

    this.imageWrappers.forEach(imageWrapper => {
      if (imageWrapper.hasAttribute('data-hide-after')) return
      observer.observe(imageWrapper)
    })
  }

  applyHideAfterIntro() {
    const isMobile = window.matchMedia('(max-width: 479px)').matches;
    const isTablet = window.matchMedia('(min-width: 480px) and (max-width: 991px)').matches;
    const isDesktop = window.innerWidth >= 992;
    
    this.imageWrappers.forEach(w => {
      if (w.hasAttribute('data-hide-after')) {
        const breakpoint = w.getAttribute('data-hide-after');
        const shouldHide = !breakpoint || 
                          (breakpoint === 'mobile' && isMobile) ||
                          (breakpoint === 'tablet' && isTablet) ||
                          (breakpoint === 'desktop' && isDesktop);
        
        if (shouldHide) {
          gsap.to(w, {
            scale: 0.5,
            autoAlpha: 0,
            duration: 0.6,
            ease: "power3.out"
          })
        }
      } else if (!isDesktop) {
        gsap.set(w, {
          scale: 1,
          autoAlpha: 1
        })
      }
    })
  }
}

  

  const grid = new Grid()

  preloadImages('.home-header_image').then(() => {
    grid.init()
    document.body.classList.remove('loading')
  })
};