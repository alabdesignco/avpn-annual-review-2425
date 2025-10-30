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
    this.repositionImages()
    this.centerGrid()
    this.setupSplitText()

    const timeline = gsap.timeline()

    timeline.set(this.dom, { scale: .5 })
    timeline.set(this.imageWrappers, {
      scale: 0.5,
      opacity: 0,
      filter: "blur(4px)"
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
      opacity: 1,
      filter: "blur(0px)",
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
    timeline.to(this.imageWrappers, {
      x: (i, el) => el.dataset.x || 0,
      y: (i, el) => el.dataset.y || 0,
      duration: 0.96,
      ease: "power3.inOut"
    }, "-=1.2")
    timeline.to(this.navbar, {
      y: 0,
      autoAlpha: 1,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4")
    timeline.call(() => {
      this.addEvents()
      this.observeImages()
      this.applyHideAfterIntro()
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

  repositionImages() {
    this.imageWrappers.forEach((wrapper) => {
      const x = wrapper.dataset.x
      const y = wrapper.dataset.y
      
      if (x || y) {
        gsap.set(wrapper, {
          clearProps: "all",
          ...(x && { x }),
          ...(y && { y })
        })
      }
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
    window.addEventListener("resize", () => {
      this.centerGrid()
    })

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

  observeImages() {
    const showThreshold = 0.88
    const hideThreshold = 0.72
    const steps = Array.from({ length: 21 }, (_, i) => i / 20)

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target
        const ratio = entry.intersectionRatio
        const isVisible = el.__visible === true

        if (!isVisible && ratio >= showThreshold) {
          el.__visible = true
          gsap.to(el, {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            visibility: "visible",
            duration: 0.8,
            ease: "power3.out"
          })
        } else if (ratio <= hideThreshold && el.__visible !== false) {
          el.__visible = false
          gsap.to(el, {
            opacity: 0,
            duration: 0.6,
            ease: "power3.out"
          })
          gsap.to(el, {
            scale: 0.5,
            filter: "blur(4px)",
            duration: 0.5,
            ease: "power3.out",
            delay: 0.2
          })
          gsap.to(el, {
            visibility: "hidden",
            duration: 0.1,
            delay: 0.7
          })
        }
      })
    }, {
      root: null,
      threshold: steps,
      rootMargin: "0px 0px -6% 0px"
    })

    this.imageWrappers.forEach(imageWrapper => {
      if (imageWrapper.hasAttribute('data-hide-after')) return
      observer.observe(imageWrapper)
    })
  }

  applyHideAfterIntro() {
    this.imageWrappers.forEach(w => {
      if (w.hasAttribute('data-hide-after')) {
        gsap.set(w, {
          opacity: 0,
          scale: 0.5,
          filter: "blur(4px)",
          visibility: "hidden"
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