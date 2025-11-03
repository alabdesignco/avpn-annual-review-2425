import { initModalBasic } from '../utils/modalInit.js';

const initCardsScramble = () => {
    const container = document.querySelector('.section_highlight-cards .highlight-card_wrapper');
    if (!container) return;
    
    const isTabletOrMobile = window.matchMedia('(max-width: 991px)').matches;
    const cards = document.querySelectorAll('.highlight_card');
    const cardsLength = cards.length;
    const cardContent = document.querySelectorAll('.highlight_card .highlight_card-content');
    
    if (isTabletOrMobile) {
        container.classList.add('swiper');
        container.innerHTML = `<div class="swiper-wrapper">${container.innerHTML}</div>`;
        
        const updatedCards = container.querySelectorAll('.highlight_card');
        updatedCards.forEach(card => {
            card.classList.add('swiper-slide');
        });
        
        new Swiper(container, {
            effect: 'cards',
            grabCursor: true,
            preventClicks: false,
            preventClicksPropagation: false,
            loop: true,
            touchRatio: 1.5,
            touchAngle: 45,
            longSwipesRatio: 0.5,
            longSwipesMs: 300,
            cardsEffect: {
                perSlideOffset: 8,
                perSlideRotate: 2,
                rotate: true,
                slideShadows: false
            }
        });
        
        initModalBasic();
        
        return;
    }
    
    const containerW = container.clientWidth;
    let currentPortion = 0;
    
    cards.forEach(card => {
        gsap.set(card, {
            xPercent: (Math.random() - 0.5) * 10,
            yPercent: (Math.random() - 0.5) * 10,
            rotation: (Math.random() - 0.5) * 20,
        });
    });
    
    const resetPortion = (index) => {
        if (index < 0 || index >= cards.length) return;
        
        gsap.set(cards[index], { zIndex: 'auto' });
        
        gsap.to(cards[index], {
            xPercent: (Math.random() - 0.5) * 10,
            yPercent: (Math.random() - 0.5) * 10,
            rotation: (Math.random() - 0.5) * 20,
            scale: 1,
            duration: 0.8,
            ease: 'elastic.out(1, 0.75)',
        });
    };
    
    const newPortion = (i) => {
        cards.forEach((card, index) => {
            gsap.set(card, { zIndex: index === i ? 20 : 'auto' });
        });
        
        gsap.to(cards[i], {
            xPercent: 0,
            yPercent: 0,
            rotation: 0,
            duration: 0.8,
            scale: 1.1,
            ease: 'elastic.out(1, 0.75)'
        });
        
        cardContent.forEach((cardContent, index) => {
            if (index !== i) {
                gsap.to(cardContent, {
                    xPercent: 80 / (index - i),
                    ease: 'elastic.out(1, 0.75)',
                    duration: 0.8
                });
            } else {
                gsap.to(cardContent, {
                    xPercent: 0,
                    ease: 'elastic.out(1, 0.75)',
                    duration: 0.8
                });
            }
        });
    };
    
    container.addEventListener("mousemove", e => {
        const mouseX = e.clientX - container.getBoundingClientRect().left;
        const percentage = mouseX / containerW;
        const activePortion = Math.ceil(percentage * cardsLength);
        
        if (
            currentPortion !== activePortion &&
            activePortion > 0 &&
            activePortion <= cardsLength
        ) {
            if (currentPortion !== 0) { resetPortion(currentPortion - 1); }
            currentPortion = activePortion;
            newPortion(currentPortion - 1);
        }
    });
    
    container.addEventListener("mouseleave", () => {
        if (currentPortion > 0) {
            resetPortion(currentPortion - 1);
        }
        currentPortion = 0;
        
        gsap.to(cardContent, {
            xPercent: 0,
            ease: 'elastic.out(1, 0.75)',
            duration: 0.8
        });
    });
};

export { initCardsScramble };