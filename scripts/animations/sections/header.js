import { preloadImages } from '../../utils/imageLoaded.js'

const initHeaderSection = () => {
  const container = document.querySelector(".section_home-header .home-header_wrapper");
  if (!container) return;

class Grid {
  constructor() {
    this.dom = document.querySelector(".section_home-header")
    this.grid = document.querySelector(".home-header_wrapper")
    this.products = [...document.querySelectorAll(".home-header_image-wrapper")]
    this.heading = document.querySelector(".home-header_heading")
    this.navbar = document.querySelector(".navbar_component")
    this.taglines = [...document.querySelectorAll(".tagline")]

    this.isDragging = false
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
    timeline.set(this.products, {
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

    timeline.to(this.products, {
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
    timeline.to(this.navbar, {
      y: 0,
      autoAlpha: 1,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4")
    timeline.call(() => {
      this.setupDraggable()
      this.addEvents()
      this.observeProducts()
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

  centerGrid() {
    const gridWidth = this.grid.offsetWidth
    const gridHeight = this.grid.offsetHeight
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    const centerX = (windowWidth - gridWidth) / 2
    const centerY = (windowHeight - gridHeight) / 2 - (windowWidth * 0.12)

    gsap.set(this.grid, {
      x: centerX,
      y: centerY
    })
    
    this.baseX = centerX
    this.baseY = centerY
  }

  setupDraggable() {
    this.dom.classList.add("--is-loaded")

    this.draggable = Draggable.create(this.grid, {
      type: "x,y",
      bounds: {
        minX: -(this.grid.offsetWidth - window.innerWidth) - 200,
        maxX: 200,
        minY: -(this.grid.offsetHeight - window.innerHeight) - 100,
        maxY: 100
      },
      inertia: true,
      allowEventDefault: true,
      edgeResistance: 0.9,

      onDragStart: () => {
        this.isDragging = true
        this.grid.classList.add("--is-dragging")
        gsap.killTweensOf(this.grid)
      },

      onDrag: () => {
        this.baseX = this.draggable.x
        this.baseY = this.draggable.y
      },

      onDragEnd: () => {
        this.isDragging = false
        this.grid.classList.remove("--is-dragging")
      }
    })[0]
  }

  addEvents() {
    window.addEventListener("resize", () => {
      this.updateBounds()
    })

    this.dom.addEventListener("mousemove", (e) => {
      if (this.isDragging) return
      
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

  updateBounds() {
    if (this.draggable) {
      this.draggable.vars.bounds = {
        minX: -(this.grid.offsetWidth - window.innerWidth) - 50,
        maxX: 50,
        minY: -(this.grid.offsetHeight - window.innerHeight) - 50,
        maxY: 50
      }
    }
  }

  observeProducts() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.to(entry.target, {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.5,
            ease: "power2.out"
          })
        } else {
          gsap.to(entry.target, {
            opacity: 0,
            scale: 0.5,
            filter: "blur(4px)",
            duration: 0.5,
            ease: "power2.in"
          })
        }
      })
    }, {
      root: null,
      threshold: 0.1
    })

    this.products.forEach(product => {
      observer.observe(product)
    })
  }
}

  const grid = new Grid()

  preloadImages('.home-header_image').then(() => {
    grid.init()
    document.body.classList.remove('loading')
  })
};

export { initHeaderSection };