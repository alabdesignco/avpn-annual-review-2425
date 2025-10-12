import { preloadImages } from '../utils/imageLoaded.js'

const initInfiniteCanvas = () => {
  const container = document.querySelector(".section_home-header .home-header_wrapper");
  if (!container) return;

class Grid {
  constructor() {
    this.dom = document.querySelector(".section_home-header")
    this.grid = document.querySelector(".home-header_wrapper")
    this.products = [...document.querySelectorAll(".home-header_image-wrapper")]

    this.isDragging = false
  }

  init() {
    this.intro()
  }

  intro() {
    this.centerGrid()

    const timeline = gsap.timeline()

    timeline.set(this.dom, { scale: .5 })
    timeline.set(this.products, {
      scale: 0.5,
      opacity: 0,
    })

    timeline.to(this.products, {
      scale: 1,
      opacity: 1,
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
      ease: "power3.inOut",
      onComplete: () => {
        this.setupDraggable()
        this.addEvents()
        this.observeProducts()
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
      },

      onDragEnd: () => {
        this.isDragging = false
        this.grid.classList.remove("--is-dragging")
      }
    })[0]
  }

  addEvents() {
    window.addEventListener("wheel", (e) => {
      e.preventDefault()

      const deltaX = -e.deltaX * 7
      const deltaY = -e.deltaY * 7

      const currentX = gsap.getProperty(this.grid, "x")
      const currentY = gsap.getProperty(this.grid, "y")

      const newX = currentX + deltaX
      const newY = currentY + deltaY

      const bounds = this.draggable.vars.bounds
      const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, newX))
      const clampedY = Math.max(bounds.minY, Math.min(bounds.maxY, newY))

      gsap.to(this.grid, {
        x: clampedX,
        y: clampedY,
        duration: 0.3,
        ease: "power3.out"
      })
    }, { passive: false })

    window.addEventListener("resize", () => {
      this.updateBounds()
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
            duration: 0.5,
            ease: "power2.out"
          })
        } else {
          gsap.to(entry.target, {
            opacity: 0,
            scale: 0.5,
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

  preloadImages('.grid img').then(() => {
    grid.init()
    document.body.classList.remove('loading')
  })
}

export default initInfiniteCanvas