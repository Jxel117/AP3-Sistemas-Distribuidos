# APE 3 - Arquitectura de Sistemas Distribuidos

Este repositorio contiene la resolución de la Guía de Actividades Práctico-Experimentales Nro. 003 para la asignatura de Sistemas Distribuidos. El proyecto implementa diversos mecanismos de sincronización y concurrencia utilizando un entorno asíncrono.

## Descripción del Proyecto

El sistema está desarrollado en Node.js y utiliza WebSockets para reflejar en tiempo real el estado de diferentes procesos concurrentes en una interfaz gráfica. Se abordan cinco problemas clásicos de concurrencia:

1. **El Dilema de la Taquilla:** Implementación de Exclusión Mutua (Mutex) para evitar condiciones de carrera en la venta concurrente de boletos.
2. **El Gimnasio:** Uso de semáforos de conteo para gestionar el acceso limitado a un conjunto de recursos compartidos (máquinas de entrenamiento).
3. **La Vitrina de la Panadería:** Resolución del problema Productor-Consumidor utilizando semáforos para espacios vacíos, elementos listos y un mutex para la sección crítica.
4. **El Tablón de Notas:** Implementación del problema Lectores-Escritores con prioridad para los lectores, controlando el acceso concurrente y exclusivo a un recurso.
5. **El Punto de Encuentro:** Creación de una barrera de sincronización para coordinar hilos en distintas fases de ejecución.

## Tecnologías Utilizadas

* **Back-end:** Node.js, Express
* **Concurrencia:** async-mutex, async-sema
* **Comunicación en Tiempo Real:** Socket.io
* **Front-end:** HTML5, Tailwind CSS

## Requisitos Previos

Para ejecutar este proyecto, es necesario tener instalado Node.js en el sistema.

## Instalación y Ejecución

1. Clonar el repositorio o descargar los archivos fuente.
2. Abrir una terminal y navegar hasta el directorio raíz del proyecto.
3. Instalar las dependencias necesarias ejecutando:
   `npm install`
4. Iniciar el servidor:
   `node server.js`
5. Abrir un navegador web y acceder a la siguiente dirección para visualizar la interfaz y la ejecución de los algoritmos en tiempo real:
   `http://localhost:3000`

## Estructura del Proyecto

* `server.js`: Contiene la lógica del servidor, la configuración de WebSockets y la implementación de los cinco algoritmos de sincronización.
* `public/index.html`: Interfaz de usuario que recibe y muestra los registros emitidos por el servidor en tiempo real.

## Autor

Stalin Joel Tapia Pinta
