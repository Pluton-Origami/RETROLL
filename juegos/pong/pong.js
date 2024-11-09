const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');
const btnInicio = document.getElementById('btn-inicio');
const pantallaInicio = document.getElementById('pantalla-inicio');
const pantallaPausa = document.getElementById('pantalla-pausa');

// Variables del juego
let juegoIniciado = false;
let juegoEnPausa = false;
let animacionFrame;
let paleta1Y = 150;
let paleta2Y = 150;
const PALETA_ALTURA = 100;
const PALETA_ANCHO = 10;
const VELOCIDAD_PALETA = 8;

let pelotaX = canvas.width/2;
let pelotaY = canvas.height/2;
let pelotaVelocidadX = 5;
let pelotaVelocidadY = 5;
const PELOTA_RADIO = 8;

let puntaje1 = 0;
let puntaje2 = 0;

// Funciones del juego
function inicializarJuego() {
    pelotaX = canvas.width/2;
    pelotaY = canvas.height/2;
    pelotaVelocidadX = Math.random() > 0.5 ? 5 : -5;
    pelotaVelocidadY = Math.random() * 6 - 3;
    paleta1Y = canvas.height/2 - PALETA_ALTURA/2;
    paleta2Y = canvas.height/2 - PALETA_ALTURA/2;
    actualizarPuntaje();
}

function dibujar() {
    // Limpiar canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar paletas
    ctx.fillStyle = '#39ff14';
    ctx.fillRect(0, paleta1Y, PALETA_ANCHO, PALETA_ALTURA);
    ctx.fillRect(canvas.width - PALETA_ANCHO, paleta2Y, PALETA_ANCHO, PALETA_ALTURA);

    // Dibujar pelota
    ctx.beginPath();
    ctx.arc(pelotaX, pelotaY, PELOTA_RADIO, 0, Math.PI * 2);
    ctx.fillStyle = '#39ff14';
    ctx.fill();
    ctx.closePath();

    // Dibujar línea central
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.strokeStyle = '#39ff14';
    ctx.stroke();
    ctx.setLineDash([]);
}

function actualizarJuego() {
    if (!juegoIniciado || juegoEnPausa) return;

    // Mover pelota
    pelotaX += pelotaVelocidadX;
    pelotaY += pelotaVelocidadY;

    // Colisiones con bordes superior e inferior
    if (pelotaY - PELOTA_RADIO < 0 || pelotaY + PELOTA_RADIO > canvas.height) {
        pelotaVelocidadY = -pelotaVelocidadY;
    }

    // Colisiones con paletas
    if (pelotaX - PELOTA_RADIO < PALETA_ANCHO && 
        pelotaY > paleta1Y && 
        pelotaY < paleta1Y + PALETA_ALTURA) {
        pelotaVelocidadX = -pelotaVelocidadX;
        let relativeIntersectY = (paleta1Y + (PALETA_ALTURA/2)) - pelotaY;
        pelotaVelocidadY = -(relativeIntersectY * 0.1);
    }

    if (pelotaX + PELOTA_RADIO > canvas.width - PALETA_ANCHO && 
        pelotaY > paleta2Y && 
        pelotaY < paleta2Y + PALETA_ALTURA) {
        pelotaVelocidadX = -pelotaVelocidadX;
        let relativeIntersectY = (paleta2Y + (PALETA_ALTURA/2)) - pelotaY;
        pelotaVelocidadY = -(relativeIntersectY * 0.1);
    }

    // Puntuación
    if (pelotaX < 0) {
        puntaje2++;
        reiniciarPelota();
    } else if (pelotaX > canvas.width) {
        puntaje1++;
        reiniciarPelota();
    }

    actualizarPuntaje();
    dibujar();
    animacionFrame = requestAnimationFrame(actualizarJuego);
}

function reiniciarPelota() {
    pelotaX = canvas.width/2;
    pelotaY = canvas.height/2;
    pelotaVelocidadX = Math.random() > 0.5 ? 5 : -5;
    pelotaVelocidadY = Math.random() * 6 - 3;
}

function actualizarPuntaje() {
    document.getElementById('puntaje1').textContent = puntaje1;
    document.getElementById('puntaje2').textContent = puntaje2;
}

function iniciarJuego() {
    if (!juegoIniciado) {
        juegoIniciado = true;
        juegoEnPausa = false;
        pantallaInicio.style.display = 'none';
        inicializarJuego();
        actualizarJuego();
    }
}

function pausarJuego() {
    if (juegoIniciado && !juegoEnPausa) {
        juegoEnPausa = true;
        cancelAnimationFrame(animacionFrame);
        pantallaPausa.style.display = 'flex';
    }
}

function reanudarJuego() {
    if (juegoIniciado && juegoEnPausa) {
        juegoEnPausa = false;
        pantallaPausa.style.display = 'none';
        actualizarJuego();
    }
}

// Controles de teclado
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (!juegoIniciado) {
            iniciarJuego();
        } else if (!juegoEnPausa) {
            pausarJuego();
        } else {
            reanudarJuego();
        }
        return;
    }

    if (!juegoIniciado || juegoEnPausa) return;

    switch(e.key.toLowerCase()) {
        case 'w':
            if (paleta1Y > 0) paleta1Y -= VELOCIDAD_PALETA;
            break;
        case 's':
            if (paleta1Y < canvas.height - PALETA_ALTURA) paleta1Y += VELOCIDAD_PALETA;
            break;
        case 'arrowup':
            if (paleta2Y > 0) paleta2Y -= VELOCIDAD_PALETA;
            break;
        case 'arrowdown':
            if (paleta2Y < canvas.height - PALETA_ALTURA) paleta2Y += VELOCIDAD_PALETA;
            break;
    }
});

// Controles móviles
const controlesMoviles = {
    'j1-arriba': () => { if (paleta1Y > 0) paleta1Y -= VELOCIDAD_PALETA; },
    'j1-abajo': () => { if (paleta1Y < canvas.height - PALETA_ALTURA) paleta1Y += VELOCIDAD_PALETA; },
    'j2-arriba': () => { if (paleta2Y > 0) paleta2Y -= VELOCIDAD_PALETA; },
    'j2-abajo': () => { if (paleta2Y < canvas.height - PALETA_ALTURA) paleta2Y += VELOCIDAD_PALETA; }
};

Object.entries(controlesMoviles).forEach(([id, funcion]) => {
    const boton = document.getElementById(id);
    let intervalo;
    
    boton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (intervalo) clearInterval(intervalo);
        intervalo = setInterval(funcion, 16);
    });
    
    boton.addEventListener('touchend', () => {
        if (intervalo) clearInterval(intervalo);
    });
});

// Botón de inicio
btnInicio.addEventListener('click', iniciarJuego);

// Ajustar canvas al cargar y al cambiar tamaño de ventana
function ajustarCanvas() {
    if (window.innerWidth <= 768) {
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
    } else {
        canvas.style.width = '600px';
        canvas.style.height = '400px';
    }
}

window.addEventListener('resize', ajustarCanvas);
ajustarCanvas();
dibujar(); 
