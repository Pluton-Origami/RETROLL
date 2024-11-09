document.addEventListener('DOMContentLoaded', function() {
    const devButton = document.getElementById('dev-button');
    const modal = document.getElementById('social-modal');
    const closeButton = document.getElementsByClassName('close')[0];

    devButton.onclick = function() {
        modal.style.display = "block";
    }

    closeButton.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    const elementosCuadricula = document.querySelectorAll('.elemento-cuadricula');

    elementosCuadricula.forEach(elemento => {
        elemento.addEventListener('mouseenter', () => {
            elemento.style.transform = 'translateY(-5px)';
            elemento.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
        });

        elemento.addEventListener('mouseleave', () => {
            elemento.style.transform = 'translateY(0)';
            elemento.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
    });
});
