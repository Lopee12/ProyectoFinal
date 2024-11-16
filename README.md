Proyecto de Inventario en Angular
Introducción
Este proyecto es una aplicación web desarrollada en Angular para la gestión de inventarios. Permite a los usuarios realizar un seguimiento de los productos, gestionar el stock y optimizar la organización de un inventario. Es ideal para pequeñas y medianas empresas que desean un sistema eficiente y fácil de usar para administrar sus bienes.

Instalación
Sigue estos pasos para instalar y configurar el proyecto:

Clona el repositorio:

bash
Copiar código
git clone https://github.com/Lopee12/ProyectoFinal.git
cd nombre-del-repositorio
Instala las dependencias: Asegúrate de tener instalado Node.js y Angular CLI. Luego ejecuta:

bash
Copiar código
npm install
Inicia el servidor de desarrollo:

bash
Copiar código
ng serve
Accede a la aplicación: Abre tu navegador y visita http://localhost:4200.
cd dbb y ejecutar npm run backend

configuracion:
Al ejecutar el npm run backend podra acceder a los distintos usuarios. Los usuarios seran los siguientes:

Administrador: Usuario: eve.gen  Contraseña:12345
Vendedor: Usuario: juan.martel contraseña: 12345
encargado: Usuario: tupi.rodriguez contraseña: 12345
Fabrica: usuario: nico.lope contraseña: 12345


Uso
Agregar productos: Permite añadir nuevos productos al inventario especificando detalles como nombre, cantidad, precio y descripción.
Actualizar inventario: Edita la información de los productos existentes.
Eliminar productos: Elimina productos que ya no están disponibles.
Visualizar inventario: Consulta el listado completo de productos con opciones de búsqueda y filtrado.
Características
Gestión completa del inventario.
Interfaz intuitiva
Función de búsqueda avanzada.
Filtrados.

Este proyecto utiliza las siguientes tecnologías y bibliotecas:

Angular: Framework principal para el desarrollo.
Angular Material: Para la interfaz de usuario.
RxJS: Manejo de datos reactivos.
Node.js: Entorno de ejecución.
Para un listado completo, revisa el archivo package.json.

bash
Copiar código
ng serve --port 4300
Problemas con dependencias: Elimina la carpeta node_modules y reinstala:

bash
Copiar código
rm -rf node_modules
npm install
Problemas de compilación: Asegúrate de que la versión de Angular CLI coincida con la versión del proyecto.

Contribuidores
Nicolas Lopez Osornio - Tupac Rodriguez - Evelyn Gentsch - Juan Cruz Martel
