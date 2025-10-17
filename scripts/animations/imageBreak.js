export function initImageBreak() {
    const W = window.innerWidth
    const H = window.innerHeight

    const container = document.querySelector('.section_image-break .image-break_wrapper')
    const medias = container.querySelectorAll('.image-break_media')
    const textElement = document.querySelector('.section_image-break .image-break_text')
    
    if (textElement) {
        const text = textElement.textContent
        textElement.innerHTML = text.split('').map(char => 
            char === ' ' ? '<span>&nbsp;</span>' : `<span>${char}</span>`
        ).join('')
        
        const chars = textElement.querySelectorAll('span')
        gsap.set(chars, { opacity: 0, yPercent: 100 })
    }

    medias.forEach(media => {
        gsap.set(media, {
            x: (Math.random() - 0.5) * 0.16 * W,
            y: (Math.random() - 0.5) * 0.1 * W
        })
    })

    const distance = container.clientWidth - document.body.clientWidth
    const scrollTween = gsap.to(container, {
        x: - distance,
        ease: 'none',
        scrollTrigger: {
            trigger: container.parentNode,
            pin: true,
            scrub: true,
            end: '+=' + distance
        }
    })

    medias.forEach(media => {
        gsap.from(media, {
            rotation: (Math.random() - 0.5) * 80,
            yPercent: (Math.random() - 0.5) * 300,
            xPercent: Math.random() * 400,
            ease:'power1.out',
            scrollTrigger:{
                trigger: media,
                containerAnimation: scrollTween,
                start: 'left 110%',
                end: 'left 65%',
                scrub: true,
            }
        })

        gsap.fromTo(media, {
            rotation: 0,
            yPercent: 0,
            xPercent: 0,
        }, {
            rotation: (Math.random() - 0.5) * 80,
            yPercent: (Math.random() - 0.5) * 300,
            xPercent: -Math.random() * 400,
            ease: 'power1.in',
            scrollTrigger:{
                trigger: media,
                containerAnimation: scrollTween,
                start: 'right 35%',
                end: 'right -10%',
                scrub: true
            }
        })
    })

    if (textElement && medias.length > 0) {
        const chars = textElement.querySelectorAll('span')
        const centerIndex = Math.floor(chars.length / 2)
        const lastMedia = medias[medias.length - 1]
        
        gsap.to(chars, {
            opacity: 1,
            yPercent: 0,
            duration: 1.2,
            ease: 'back.out(2.5)',
            stagger: {
                amount: 0.8,
                from: centerIndex,
                ease: 'power2.out'
            },
            scrollTrigger: {
                trigger: lastMedia,
                containerAnimation: scrollTween,
                start: 'left center',
                toggleActions: 'play none none none'
            }
        })
    }
}