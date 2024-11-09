document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.dispositivo-card');
    
    // Efecto hover mejorado para las tarjetas
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 8px 16px rgba(57, 255, 20, 0.3)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
    });

    // Animación de aparición al hacer scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease-out';
        observer.observe(card);
    });

    // Mejora del rendimiento
    let ticking = false;
    document.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const header = document.querySelector('header');
                if (window.scrollY > 50) {
                    header.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                } else {
                    header.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                }
                ticking = false;
            });
            ticking = true;
        }
    });
});
