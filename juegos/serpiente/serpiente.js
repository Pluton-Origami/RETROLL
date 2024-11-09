const canvas = document.getElementById('serpiente');
const ctx = canvas.getContext('2d');
const btnInicio = document.getElementById('btn-inicio');
const pantallaInicio = document.getElementById('pantalla-inicio');
const pantallaPausa = document.getElementById('pantalla-pausa');

// Variables del juego
let juegoIniciado = false;
let juegoEnPausa = false;
let intervaloPrincipal;
let velocidad = 10;
let tamañoCuadro;
let manzanaX;
let manzanaY;
let velocidadX = 0;
let velocidadY = 0;
let puntaje = 0;
let serpiente = [];
let ultimaDireccion = '';

function inicializarVariables() {
    tamañoCuadro = window.innerWidth <= 768 ? 15 : 20;
    serpiente = [
        {x: 5, y: 5},
        {x: 4, y: 5},
        {x: 3, y: 5}
    ];
    velocidadX = 1;
    velocidadY = 0;
    puntaje = 0;
    ultimaDireccion = 'derecha';
    document.getElementById('puntaje').textContent = puntaje;
    generarManzana();
}

function generarManzana() {
    const columnas = Math.floor(canvas.width / tamañoCuadro);
    const filas = Math.floor(canvas.height / tamañoCuadro);
    do {
        manzanaX = Math.floor(Math.random() * columnas);
        manzanaY = Math.floor(Math.random() * filas);
    } while (serpiente.some(segmento => segmento.x === manzanaX && segmento.y === manzanaY));
}

function dibujarJuego() {
    // Limpiar canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar serpiente
    serpiente.forEach((segmento, index) => {
        ctx.fillStyle = '#39ff14';
        ctx.fillRect(
            segmento.x * tamañoCuadro + 1,
            segmento.y * tamañoCuadro + 1,
            tamañoCuadro - 2,
            tamañoCuadro - 2
        );
    });

    // Dibujar manzana
    ctx.fillStyle = 'red';
    ctx.fillRect(
        manzanaX * tamañoCuadro + 1,
        manzanaY * tamañoCuadro + 1,
        tamañoCuadro - 2,
        tamañoCuadro - 2
    );
}

function actualizarJuego() {
    if (!juegoIniciado || juegoEnPausa) return;

    const nuevaCabezaX = serpiente[0].x + velocidadX;
    const nuevaCabezaY = serpiente[0].y + velocidadY;

    // Verificar colisiones
    if (nuevaCabezaX < 0 || 
        nuevaCabezaX >= canvas.width / tamañoCuadro || 
        nuevaCabezaY < 0 || 
        nuevaCabezaY >= canvas.height / tamañoCuadro ||
        serpiente.some(segmento => segmento.x === nuevaCabezaX && segmento.y === nuevaCabezaY)) {
        gameOver();
        return;
    }

    // Mover serpiente
    serpiente.unshift({x: nuevaCabezaX, y: nuevaCabezaY});

    // Verificar si come manzana
    if (nuevaCabezaX === manzanaX && nuevaCabezaY === manzanaY) {
        puntaje += 10;
        document.getElementById('puntaje').textContent = puntaje;
        generarManzana();
    } else {
        serpiente.pop();
    }

    dibujarJuego();
}

function iniciarJuego() {
    if (!juegoIniciado) {
        juegoIniciado = true;
        juegoEnPausa = false;
        pantallaInicio.style.display = 'none';
        inicializarVariables();
        if (intervaloPrincipal) clearInterval(intervaloPrincipal);
        intervaloPrincipal = setInterval(actualizarJuego, 1000/velocidad);
    }
}

function pausarJuego() {
    if (juegoIniciado && !juegoEnPausa) {
        juegoEnPausa = true;
        clearInterval(intervaloPrincipal);
        pantallaPausa.style.display = 'flex';
    }
}

function reanudarJuego() {
    if (juegoIniciado && juegoEnPausa) {
        juegoEnPausa = false;
        pantallaPausa.style.display = 'none';
        intervaloPrincipal = setInterval(actualizarJuego, 1000/velocidad);
    }
}

function gameOver() {
    juegoIniciado = false;
    juegoEnPausa = false;
    clearInterval(intervaloPrincipal);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#39ff14';
    ctx.font = '20px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
    ctx.fillText(`Puntaje: ${puntaje}`, canvas.width/2, canvas.height/2 + 40);
    
    setTimeout(() => {
        pantallaInicio.style.display = 'flex';
    }, 2000);
}

// Eventos
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
        case 'arrowup':
        case 'w':
            if (ultimaDireccion !== 'abajo') {
                velocidadX = 0;
                velocidadY = -1;
                ultimaDireccion = 'arriba';
            }
            break;
        case 'arrowdown':
        case 's':
            if (ultimaDireccion !== 'arriba') {
                velocidadX = 0;
                velocidadY = 1;
                ultimaDireccion = 'abajo';
            }
            break;
        case 'arrowleft':
        case 'a':
            if (ultimaDireccion !== 'derecha') {
                velocidadX = -1;
                velocidadY = 0;
                ultimaDireccion = 'izquierda';
            }
            break;
        case 'arrowright':
        case 'd':
            if (ultimaDireccion !== 'izquierda') {
                velocidadX = 1;
                velocidadY = 0;
                ultimaDireccion = 'derecha';
            }
            break;
    }
});

// Eventos para iniciar el juego
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !juegoIniciado) {
        iniciarJuego();
    }
});

canvas.addEventListener('touchstart', (e) => {
    if (!juegoIniciado) {
        e.preventDefault();
        iniciarJuego();
    }
});

function ajustarCanvas() {
    if (window.innerWidth <= 768) {
        canvas.width = 300;
        canvas.height = 300;
        tamañoCuadro = 15;
    } else {
        canvas.width = 400;
        canvas.height = 400;
        tamañoCuadro = 20;
    }
    inicializarJuego();
}

window.addEventListener('resize', ajustarCanvas);
ajustarCanvas();

// Iniciar juego
generarManzana();
setInterval(dibujarJuego, 1000/velocidad); 
