export function initAccentShapes() {
  const mm = gsap.matchMedia()

  mm.add(
    {
      isMobile: "(max-width:479px)",
      isMobileLandscape: "(max-width:767px)",
      isTablet: "(max-width:991px)",
      isDesktop: "(min-width:992px)"
    },
    (context) => {
      const { isMobile, isMobileLandscape, isTablet } = context.conditions

      const ctx = gsap.context(() => {
        document.querySelectorAll('[data-accent-shape]').forEach((shape) => {
          const disable = shape.getAttribute("data-accent-disable")
          if (
            (disable === "mobile" && isMobile) ||
            (disable === "mobileLandscape" && isMobileLandscape) ||
            (disable === "tablet" && isTablet)
          ) {
            return
          }

          const target = shape.querySelector('[data-accent-target]') || shape
          
          const startScale = parseFloat(shape.getAttribute("data-accent-scale-start")) || 0
          const endScale = parseFloat(shape.getAttribute("data-accent-scale-end")) || 1
          const startOpacity = parseFloat(shape.getAttribute("data-accent-opacity-start")) || 0
          const endOpacity = parseFloat(shape.getAttribute("data-accent-opacity-end")) || 1
          
          const scrollStart = shape.getAttribute("data-accent-scroll-start") || "top 80%"
          const scrollEnd = shape.getAttribute("data-accent-scroll-end") || "bottom 20%"
          
          const duration = parseFloat(shape.getAttribute("data-accent-duration")) || 0.8
          const ease = shape.getAttribute("data-accent-ease") || "back.out(1.7)"
          
          const mode = (shape.getAttribute("data-accent-mode") || "").toLowerCase()
          const loopDuration = parseFloat(shape.getAttribute("data-accent-loop-duration")) || 3
          const loopEase = shape.getAttribute("data-accent-loop-ease") || "none"

          gsap.set(target, {
            scale: startScale,
            opacity: startOpacity
          })

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: shape,
              start: scrollStart,
              end: scrollEnd,
              toggleActions: "play none none reverse"
            }
          })

          tl.to(target, {
            scale: endScale,
            opacity: endOpacity,
            duration,
            ease
          })

          let loopController

          if (shape.hasAttribute("data-accent-mode") && (mode === "" || mode === "rotate")) {
            loopController = gsap.to(target, {
              rotation: "+=360",
              duration: loopDuration,
              ease: loopEase,
              repeat: -1,
              paused: true
            })
          } else if (mode === "pulse") {
            const beatTl = gsap.timeline({ repeat: -1, repeatDelay: loopDuration, paused: true })
            beatTl
              .to(target, { scale: endScale * 1.12, duration: loopDuration * 0.18, ease: "power2.out" })
              .to(target, { scale: endScale * 1.02, duration: loopDuration * 0.12, ease: "power2.inOut" })
              .to(target, { scale: endScale * 1.08, duration: loopDuration * 0.16, ease: "power2.out" })
              .to(target, { scale: endScale, duration: loopDuration * 0.24, ease: "power2.inOut" })
            loopController = beatTl
          } else if (mode === "scrub") {
            gsap.to(target, {
              rotation: 45,
              ease: "none",
              scrollTrigger: {
                trigger: shape,
                start: scrollStart,
                end: scrollEnd,
                scrub: true
              }
            })
          }

          if (loopController) {
            const guardStart = (mode === "" || mode === "rotate" || mode === "pulse") ? "top bottom" : scrollStart
            const guardEnd = (mode === "" || mode === "rotate" || mode === "pulse") ? "bottom top" : scrollEnd
            ScrollTrigger.create({
              trigger: shape,
              start: guardStart,
              end: guardEnd,
              onEnter: () => loopController.play(),
              onEnterBack: () => loopController.play(),
              onLeave: () => loopController.pause(),
              onLeaveBack: () => loopController.pause()
            })
          }
        })
      })

      return () => ctx.revert()
    }
  )
}
