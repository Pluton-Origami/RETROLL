const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const siguienteCanvas = document.getElementById('siguiente');
const siguienteCtx = siguienteCanvas.getContext('2d');
const btnInicio = document.getElementById('btn-inicio');
const pantallaInicio = document.getElementById('pantalla-inicio');
const pantallaPausa = document.getElementById('pantalla-pausa');

// Configuración del juego
const COLUMNAS = 12;
const FILAS = 20;
const TAMANO_BLOQUE = 20;
const COLORES = [
    '#FF0D72', '#0DC2FF', '#0DFF72',
    '#F538FF', '#FF8E0D', '#FFE138', '#3877FF'
];

// Variables del juego
let juegoIniciado = false;
let juegoEnPausa = false;
let intervaloCaida;
let tablero = Array(FILAS).fill().map(() => Array(COLUMNAS).fill(0));
let piezaActual;
let siguientePieza;
let puntaje = 0;
let lineas = 0;
let nivel = 1;
let velocidadCaida = 1000;

// Piezas del Tetris
const PIEZAS = [
    [[1,1,1,1]], // I
    [[1,1],[1,1]], // O
    [[1,1,1],[0,1,0]], // T
    [[1,1,1],[1,0,0]], // L
    [[1,1,1],[0,0,1]], // J
    [[1,1,0],[0,1,1]], // S
    [[0,1,1],[1,1,0]]  // Z
];

function inicializarJuego() {
    tablero = Array(FILAS).fill().map(() => Array(COLUMNAS).fill(0));
    puntaje = 0;
    lineas = 0;
    nivel = 1;
    velocidadCaida = 1000;
    actualizarPuntaje();
    crearNuevaPieza();
}

function crearNuevaPieza() {
    if (!piezaActual) {
        piezaActual = {
            forma: PIEZAS[Math.floor(Math.random() * PIEZAS.length)],
            color: COLORES[Math.floor(Math.random() * COLORES.length)],
            x: Math.floor(COLUMNAS/2) - 1,
            y: 0
        };
    } else {
        piezaActual = siguientePieza;
    }
    
    siguientePieza = {
        forma: PIEZAS[Math.floor(Math.random() * PIEZAS.length)],
        color: COLORES[Math.floor(Math.random() * COLORES.length)],
        x: Math.floor(COLUMNAS/2) - 1,
        y: 0
    };
    
    if (colision()) {
        gameOver();
    }
    
    dibujarSiguientePieza();
}

function colision(offsetX = 0, offsetY = 0, nuevaForma = piezaActual.forma) {
    return nuevaForma.some((fila, y) => 
        fila.some((valor, x) => {
            if (!valor) return false;
            const nuevoX = piezaActual.x + x + offsetX;
            const nuevoY = piezaActual.y + y + offsetY;
            return nuevoX < 0 || 
                   nuevoX >= COLUMNAS || 
                   nuevoY >= FILAS ||
                   (nuevoY >= 0 && tablero[nuevoY][nuevoX]);
        })
    );
}

function fijarPieza() {
    piezaActual.forma.forEach((fila, y) => {
        fila.forEach((valor, x) => {
            if (valor) {
                const posY = piezaActual.y + y;
                const posX = piezaActual.x + x;
                if (posY >= 0) {
                    tablero[posY][posX] = piezaActual.color;
                }
            }
        });
    });
    
    let lineasCompletas = 0;
    for (let y = FILAS - 1; y >= 0; y--) {
        if (tablero[y].every(valor => valor)) {
            tablero.splice(y, 1);
            tablero.unshift(Array(COLUMNAS).fill(0));
            lineasCompletas++;
            y++;
        }
    }
    
    if (lineasCompletas > 0) {
        lineas += lineasCompletas;
        puntaje += lineasCompletas * 100 * nivel;
        nivel = Math.floor(lineas / 10) + 1;
        velocidadCaida = Math.max(100, 1000 - (nivel - 1) * 100);
        actualizarPuntaje();
        if (intervaloCaida) {
            clearInterval(intervaloCaida);
            intervaloCaida = setInterval(caer, velocidadCaida);
        }
    }
    
    crearNuevaPieza();
}

function actualizarPuntaje() {
    document.getElementById('puntaje').textContent = puntaje;
    document.getElementById('lineas').textContent = lineas;
    document.getElementById('nivel').textContent = nivel;
}

function dibujar() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    tablero.forEach((fila, y) => {
        fila.forEach((valor, x) => {
            if (valor) {
                ctx.fillStyle = valor;
                ctx.fillRect(x * TAMANO_BLOQUE, y * TAMANO_BLOQUE, 
                           TAMANO_BLOQUE - 1, TAMANO_BLOQUE - 1);
            }
        });
    });
    
    if (piezaActual) {
        ctx.fillStyle = piezaActual.color;
        piezaActual.forma.forEach((fila, y) => {
            fila.forEach((valor, x) => {
                if (valor) {
                    ctx.fillRect((piezaActual.x + x) * TAMANO_BLOQUE, 
                               (piezaActual.y + y) * TAMANO_BLOQUE,
                               TAMANO_BLOQUE - 1, TAMANO_BLOQUE - 1);
                }
            });
        });
    }
}

function dibujarSiguientePieza() {
    siguienteCtx.fillStyle = 'black';
    siguienteCtx.fillRect(0, 0, siguienteCanvas.width, siguienteCanvas.height);
    
    if (siguientePieza) {
        siguienteCtx.fillStyle = siguientePieza.color;
        siguientePieza.forma.forEach((fila, y) => {
            fila.forEach((valor, x) => {
                if (valor) {
                    siguienteCtx.fillRect(
                        (x + 1) * TAMANO_BLOQUE,
                        (y + 1) * TAMANO_BLOQUE,
                        TAMANO_BLOQUE - 1,
                        TAMANO_BLOQUE - 1
                    );
                }
            });
        });
    }
}

function rotar() {
    const piezaRotada = piezaActual.forma[0].map((_, i) => 
        piezaActual.forma.map(fila => fila[i]).reverse()
    );
    
    if (!colision(0, 0, piezaRotada)) {
        piezaActual.forma = piezaRotada;
    }
}

function caer() {
    if (!colision(0, 1)) {
        piezaActual.y++;
    } else {
        fijarPieza();
    }
    dibujar();
}

function mover(dir) {
    if (!colision(dir, 0)) {
        piezaActual.x += dir;
        dibujar();
    }
}

function soltarPieza() {
    while (!colision(0, 1)) {
        piezaActual.y++;
    }
    fijarPieza();
    dibujar();
}

function iniciarJuego() {
    if (!juegoIniciado) {
        juegoIniciado = true;
        juegoEnPausa = false;
        pantallaInicio.style.display = 'none';
        inicializarJuego();
        if (intervaloCaida) clearInterval(intervaloCaida);
        intervaloCaida = setInterval(caer, velocidadCaida);
    }
}

function pausarJuego() {
    if (juegoIniciado && !juegoEnPausa) {
        juegoEnPausa = true;
        clearInterval(intervaloCaida);
        pantallaPausa.style.display = 'flex';
    }
}

function reanudarJuego() {
    if (juegoIniciado && juegoEnPausa) {
        juegoEnPausa = false;
        pantallaPausa.style.display = 'none';
        intervaloCaida = setInterval(caer, velocidadCaida);
    }
}

function gameOver() {
    juegoIniciado = false;
    juegoEnPausa = false;
    clearInterval(intervaloCaida);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#39ff14';
    ctx.font = '20px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
    
    setTimeout(() => {
        pantallaInicio.style.display = 'flex';
    }, 2000);
}

// Eventos de teclado
document.addEventListener('keydown', e => {
    if (!juegoIniciado || juegoEnPausa) {
        if (e.code === 'Space') {
            e.preventDefault();
            if (!juegoIniciado) {
                iniciarJuego();
            } else {
                reanudarJuego();
            }
        }
        return;
    }

    switch(e.code) {
        case 'ArrowLeft':
            mover(-1);
            break;
        case 'ArrowRight':
            mover(1);
            break;
        case 'ArrowDown':
            caer();
            break;
        case 'ArrowUp':
            rotar();
            break;
        case 'Space':
            e.preventDefault();
            if (!juegoEnPausa) {
                pausarJuego();
            }
            break;
    }
});

// Controles móviles
document.getElementById('izquierda').addEventListener('click', () => mover(-1));
document.getElementById('derecha').addEventListener('click', () => mover(1));
document.getElementById('rotar').addEventListener('click', rotar);
document.getElementById('bajar').addEventListener('click', caer);
document.getElementById('soltar').addEventListener('click', soltarPieza);
btnInicio.addEventListener('click', iniciarJuego);

// Inicialización
dibujar(); 
