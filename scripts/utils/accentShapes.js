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
          
          const scrollStart = shape.getAttribute("data-accent-scroll-start") || "top 40%"
          const scrollEnd = shape.getAttribute("data-accent-scroll-end") || "bottom 40%"
          
          const duration = parseFloat(shape.getAttribute("data-accent-duration")) || 0.8
          const ease = shape.getAttribute("data-accent-ease") || "back.out(1.7)"
          
          const shouldLoop = shape.hasAttribute("data-accent-loop")
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

          if (shouldLoop) {
            tl.to(target, {
              rotation: "+=360",
              duration: loopDuration,
              ease: loopEase,
              repeat: -1
            }, 0)
          }
        })
      })

      return () => ctx.revert()
    }
  )
}
