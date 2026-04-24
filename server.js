const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Mutex } = require('async-mutex');
const { Sema } = require('async-sema');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('Cliente conectado. Iniciando simulaciones...');

    const log = (ejercicio, mensaje) => {
        socket.emit('log', { ejercicio, mensaje });
    };
    // Ejercicio 1: Venta de boletos con Mutex
    const runEj1 = async () => {
        const mutex = new Mutex();
        let boletos_vendidos = 0;
        const M_VENTAS = 1000;
        const N_HILOS = 5;

        const ejecutarVenta = async (id) => {
            for (let i = 0; i < M_VENTAS; i++) {
                const release = await mutex.acquire();
                try {
                    let temp = boletos_vendidos;
                    boletos_vendidos = temp + 1;
                    if (i % 250 === 0) log('ej1', `Hilo ${id} vendió boleto. Total: ${boletos_vendidos}`);
                } finally {
                    release();
                }
            }
        };

        const hilos = Array.from({ length: N_HILOS }, (_, i) => ejecutarVenta(i + 1));
        await Promise.all(hilos);
        log('ej1', `Ventas Totales Finales: ${boletos_vendidos} (Esperado: ${N_HILOS * M_VENTAS})`);
    };

    // Ejercicio 2: Gimnasio con Semaforo
    const runEj2 = async () => {
        const semaforoGimnasio = new Sema(3);
        let maquinasEnUso = 0;

        const atleta = async (id) => {
            log('ej2', `Atleta ${id} esperando makina...`);
            await semaforoGimnasio.acquire();
            maquinasEnUso++;
            log('ej2', `Atleta ${id} entrenando. Makinas en uso: ${maquinasEnUso}`);
            
            await new Promise(res => setTimeout(res, 1000 + Math.random() * 2000));
            
            maquinasEnUso--;
            log('ej2', `Atleta ${id} termino. Mákinas en uso: ${maquinasEnUso}`);
            semaforoGimnasio.release();
        };

        Array.from({ length: 8 }, (_, i) => atleta(i + 1));
    };

    // Ejercicio 3: Panaderia con Semaforos y Mutex
    const runEj3 = async () => {
        const espacios_vacios = new Sema(10);
        const panes_listos = new Sema(0);
        const mutex_vitrina = new Mutex();
        const vitrina = [];
        let simulacionActiva = true;

        const panadero = async () => {
            while (simulacionActiva) {
                await espacios_vacios.acquire();
                const release = await mutex_vitrina.acquire();
                vitrina.push('pan');
                log('ej3', `Panadero horneo. Vitrina: ${vitrina.length}/10`);
                release();
                panes_listos.release();
                await new Promise(res => setTimeout(res, 800));
            }
        };

        const cliente = async (id) => {
            while (simulacionActiva) {
                await panes_listos.acquire();
                const release = await mutex_vitrina.acquire();
                vitrina.pop();
                log('ej3', `Cliente ${id} compro. Vitrina: ${vitrina.length}/10`);
                release();
                espacios_vacios.release();
                await new Promise(res => setTimeout(res, 1500));
            }
        };

        panadero();
        cliente(1);
        cliente(2);
        setTimeout(() => { simulacionActiva = false; log('ej3', 'Jornada terminada.'); }, 10000);
    };

    // Ejercicio 4: Lectores y Escritores con Mutex y Semaforo
    const runEj4 = async () => {
        let cant_lectores = 0;
        const mutex_lectores = new Mutex();
        const sem_escritor = new Sema(1);

        const lector = async (id) => {
            const releaseMutex = await mutex_lectores.acquire();
            cant_lectores++;
            if (cant_lectores === 1) await sem_escritor.acquire();
            releaseMutex();

            log('ej4', `Estudiante ${id} leyendo el tablón. (Lectores: ${cant_lectores})`);
            await new Promise(res => setTimeout(res, 2000));

            const releaseMutexExit = await mutex_lectores.acquire();
            cant_lectores--;
            if (cant_lectores === 0) sem_escritor.release();
            releaseMutexExit();
        };

        const escritor = async (id) => {
            log('ej4', `Profesor ${id} esperando para escribir...`);
            await sem_escritor.acquire();
            log('ej4', `Profesor ${id} ESCRIBIENDO (Exclusivo). Nadie lee.`);
            await new Promise(res => setTimeout(res, 3000));
            log('ej4', `Profesor ${id} terminó de escribir.`);
            sem_escritor.release();
        };

        lector(1); lector(2);
        setTimeout(() => escritor(1), 500);
        setTimeout(() => lector(3), 1000);
    };

    // Ejercicio 5: Barrera de Sincronizacion con Promesas
    const runEj5 = async () => {
        const N_TOTAL = 5;
        let contador = 0;
        let resolverBarrera;
        const barreraPromesa = new Promise(res => { resolverBarrera = res; });

        const llegarABarrera = async (id) => {
            log('ej5', `HILO ${id} llego a la barrera (Fase 1 completada).`);
            contador++;
            
            if (contador === N_TOTAL) {
                log('ej5', `Todos llegaron (${contador}/${N_TOTAL}). Liberando barrera.`);
                resolverBarrera();
            } else {
                await barreraPromesa;
            }
            log('ej5', `HILO ${id} iniciando Fase 2...`);
        };

        Array.from({ length: 5 }, (_, i) => {
            setTimeout(() => llegarABarrera(i + 1), Math.random() * 3000);
        });
    };

    runEj1();
    setTimeout(runEj2, 1000);
    setTimeout(runEj3, 2000);
    setTimeout(runEj4, 3000);
    setTimeout(runEj5, 4000);
});

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});