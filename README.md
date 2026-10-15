# SISTEMA DE GESTIÓN DE UN CENTRO DE ADOLESCENTES

## 1. Objetivo del proyecto

Desarrolla una aplicación web progresiva (PWA) para administrar de manera organizada, moderna y segura la información de un centro de adolescentes en conflicto con la ley.

El sistema será un prototipo administrativo destinado a demostrar la gestión de expedientes, el seguimiento socioeducativo, los registros de actividades y la administración del centro.

La interfaz debe estar completamente en español, ser sencilla de utilizar y tener una apariencia profesional.

**IMPORTANTE:** Utiliza exclusivamente información ficticia para las demostraciones. No incorpores datos reales de menores de edad. El prototipo no debe presentarse como un sistema listo para almacenar expedientes judiciales reales.

## 2. Tecnologías obligatorias

Utiliza las siguientes tecnologías:

- HTML5 para la estructura.
- CSS3 para los estilos y el diseño adaptable.
- JavaScript moderno (ES6+) para toda la lógica.
- JSON para los datos de demostración y la importación/exportación de registros ficticios.
- Service Worker para las funciones PWA.
- Web App Manifest para permitir la instalación de la aplicación.
- LocalStorage o IndexedDB únicamente para persistir los datos ficticios de la demostración.

No utilices React, Angular, Vue, TypeScript ni frameworks pesados. El proyecto debe realizarse con JavaScript puro.

No dependas de una API de pago ni de servicios externos para que la demostración funcione.

## 3. Diseño visual

Construye una interfaz administrativa profesional con estas características:

- Barra lateral de navegación.
- Encabezado con título de la sección, buscador y menú de usuario.
- Panel principal con tarjetas de estadísticas.
- Tablas con filas organizadas y acciones claras.
- Formularios con etiquetas descriptivas.
- Ventanas modales para consultar, crear y editar registros.
- Notificaciones visuales de éxito, advertencia y error.
- Iconos sencillos y consistentes.
- Paleta de colores institucional: azul oscuro, azul claro, blanco y grises neutros.
- Tipografía legible.
- Bordes discretos, sombras suaves y espacios bien distribuidos.
- Diseño adaptable a escritorio, tabletas y celulares.
- Estados de carga, listas vacías y mensajes cuando no existan resultados.

Evita una apariencia infantil, excesivamente colorida o recargada. La interfaz debe parecer un sistema administrativo institucional real.

## 4. Estructura del proyecto

Organiza los archivos de la siguiente manera:

/
├── index.html
├── manifest.json
├── service-worker.js
├── README.md
├── assets/
│   ├── icons/
│   └── images/
├── css/
│   ├── styles.css
│   ├── layout.css
│   ├── components.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── navigation.js
│   ├── dashboard.js
│   ├── expedientes.js
│   ├── seguimiento.js
│   ├── actividades.js
│   ├── usuarios.js
│   ├── storage.js
│   ├── validation.js
│   └── utils.js
└── data/
    ├── adolescentes.json
    ├── actividades.json
    ├── seguimientos.json
    └── usuarios-demo.json

Puedes modificar esta estructura si existe una razón técnica válida, pero mantén los módulos separados y el código fácil de comprender.

No coloques todo el proyecto en un único archivo HTML.

## 5. Módulo: Panel principal

La página inicial debe mostrar tarjetas con indicadores como:

- Total de adolescentes registrados.
- Adolescentes actualmente bajo custodia.
- Ingresos recientes.
- Egresos registrados.
- Seguimientos pendientes.
- Actividades programadas para los próximos días.
- Registros que necesitan revisión administrativa.

Incluye una tabla de ingresos recientes y una sección de próximas actividades.

Los indicadores deben calcularse dinámicamente a partir de los registros de demostración.

No inventes cifras independientes de los datos almacenados.

Añade botones de acceso rápido para registrar un nuevo expediente, consultar expedientes y programar una actividad.

## 6. Módulo: Expedientes individuales

Crea un módulo principal denominado "Expedientes".

Debe mostrar una tabla con las siguientes columnas:

- Código del expediente.
- Nombre de demostración.
- Edad.
- Fecha de ingreso.
- Estado del expediente.
- Situación actual.
- Acciones.

Incluye un buscador que permita filtrar por código, nombre ficticio y estado.

Agrega filtros por rango de edad, situación del expediente y fecha de ingreso.

Implementa ordenamiento por columnas, paginación y un botón para limpiar los filtros.

Cada fila debe incluir un botón "Ver expediente".

Al seleccionarlo, abre una página de detalle o ventana amplia con toda la información autorizada correspondiente a ese registro.

### Información del expediente

Organiza la ficha en pestañas:

**A. Información general**
- Código interno único.
- Nombre ficticio.
- Fecha de nacimiento ficticia.
- Edad calculada automáticamente.
- Fotografía ilustrativa o avatar genérico.
- Fecha de ingreso.
- Estado del expediente.
- Centro o unidad asignada.
- Persona responsable del seguimiento.

No solicites cédulas reales, direcciones particulares, teléfonos personales ni otros datos identificativos reales de menores.

**B. Situación jurídica**
- Código de referencia judicial ficticio.
- Autoridad o unidad judicial, representada mediante datos de prueba.
- Fecha de resolución.
- Clasificación general de la infracción o del hecho investigado.
- Estado procesal o administrativo.
- Medida socioeducativa registrada.
- Fecha de inicio y finalización prevista, cuando corresponda.
- Próxima revisión.
- Observaciones autorizadas.

Distingue entre una investigación, una resolución y una decisión firme. No presentes una acusación como una condena.

No generes sentencias ni asesoramiento jurídico automático.

**C. Historial de ingresos y egresos**
- Fecha y hora del movimiento.
- Tipo de movimiento.
- Motivo administrativo.
- Usuario responsable del registro.
- Observaciones.
- Estado de validación del movimiento.

El registro debe conservar la trazabilidad de los movimientos anteriores.

**D. Seguimiento socioeducativo**
- Objetivos individuales.
- Avances educativos.
- Participación en talleres.
- Actividades formativas.
- Evaluaciones programadas.
- Observaciones de seguimiento.
- Próxima fecha de revisión.

No utilices etiquetas estigmatizantes ni puntuaciones automáticas de peligrosidad o reincidencia.

**E. Historial de incidentes**
- Código del incidente.
- Fecha y hora.
- Categoría.
- Descripción breve y neutral.
- Medidas institucionales adoptadas.
- Estado de revisión.
- Responsable del registro.

Los incidentes deben registrarse con lenguaje objetivo, sin juicios personales. No incluyas detalles gráficos ni información sensible innecesaria.

**F. Documentación**
- Nombre del documento ficticio.
- Categoría.
- Fecha de registro.
- Usuario que lo registró.
- Estado documental.

En el prototipo, utiliza documentos de ejemplo y metadatos ficticios. No permitas cargar documentos reales sensibles.

**G. Historial de modificaciones**
- Fecha y hora.
- Usuario de demostración.
- Tipo de operación.
- Registro afectado.
- Descripción del cambio.

Este historial debe ser de solo lectura desde la interfaz.

## 7. Módulo: Registro de adolescentes

Crea un formulario para registrar un nuevo expediente ficticio.

El formulario debe validar:

- Campos obligatorios.
- Código interno único.
- Fechas válidas.
- Fecha de nacimiento anterior a la fecha actual.
- Fecha de ingreso válida.
- Campos de texto dentro de los límites establecidos.
- Valores seleccionados dentro de las opciones permitidas.

Muestra los errores junto a los campos correspondientes.

Evita que se guarde el mismo expediente dos veces.

Al guardar, muestra una notificación de confirmación y actualiza automáticamente la tabla, los indicadores y el buscador.

Incluye la opción de cancelar sin guardar los cambios.

## 8. Módulo: Seguimiento socioeducativo

Permite registrar y consultar actividades de seguimiento vinculadas a un expediente.

Campos:

- Código del seguimiento.
- Expediente asociado.
- Tipo de seguimiento.
- Fecha.
- Objetivo.
- Descripción de la actividad.
- Resultado u observación.
- Próxima revisión.
- Estado.
- Usuario responsable.

Tipos de seguimiento de ejemplo:

- Educativo.
- Orientación vocacional.
- Talleres formativos.
- Reinserción social.
- Actividades culturales.
- Orientación familiar.
- Revisión administrativa.

No incluyas diagnósticos clínicos ni notas terapéuticas confidenciales en los datos de demostración.

Permite filtrar por fecha, tipo y estado.

## 9. Módulo: Actividades y calendario

Crea una sección para administrar las actividades del centro.

Cada actividad debe tener:

- Código.
- Nombre.
- Categoría.
- Fecha.
- Hora de inicio.
- Hora de finalización.
- Responsable.
- Descripción.
- Capacidad prevista, cuando corresponda.
- Estado.

Permite crear, consultar, editar y cancelar actividades.

Incluye una vista de calendario y otra de lista.

Muestra las actividades próximas en el panel principal.

Utiliza fechas y horarios coherentes y valida que la hora de finalización sea posterior a la hora de inicio.

## 10. Módulo: Ingresos, egresos y movimientos

Implementa una pantalla administrativa para registrar movimientos.

Cada movimiento debe estar vinculado a un expediente y contener:

- Código.
- Tipo de movimiento.
- Fecha y hora.
- Referencia administrativa ficticia.
- Motivo.
- Usuario responsable.
- Estado de validación.
- Observaciones.

Los movimientos definitivos no deben poder eliminarse simplemente con un botón.

En la demostración, permite anular un movimiento mediante un procedimiento controlado que conserve el registro original y documente la anulación.

No implementes decisiones automáticas sobre la libertad, custodia o situación jurídica de ninguna persona.

## 11. Módulo: Usuarios y roles de demostración

Diseña una pantalla para visualizar los roles institucionales.

Incluye los siguientes roles de ejemplo:

**Administrador**
- Gestiona la configuración de demostración.
- Consulta estadísticas administrativas.
- Administra los usuarios ficticios.

**Personal jurídico autorizado**
- Consulta la información jurídica que le corresponde.
- Registra referencias judiciales ficticias.
- Consulta los movimientos autorizados.

**Personal socioeducativo**
- Registra actividades y seguimientos.
- Consulta únicamente los datos necesarios para su función.

**Personal administrativo**
- Gestiona registros administrativos y movimientos conforme a sus permisos.

Implementa una matriz visual de permisos y una función central de autorización para controlar las acciones de la interfaz.

IMPORTANTE: como este proyecto no tiene un servidor, estos roles son únicamente una simulación visual. No los presentes como un mecanismo de seguridad real. No incluyas contraseñas reales ni una autenticación falsa que sugiera protección efectiva de los datos.

Documenta que el control de acceso real deberá verificarse en un backend y en la base de datos.

## 12. Módulo: Búsqueda global

Implementa un buscador en el encabezado.

Debe permitir buscar entre los registros ficticios autorizados por:

- Código de expediente.
- Nombre ficticio.
- Estado.
- Código de seguimiento.
- Código de movimiento.

Los resultados deben agruparse por categoría.

Al seleccionar un resultado, debe abrir la sección correspondiente.

Incluye mensajes para búsquedas sin resultados y evita mostrar información restringida en sugerencias o resultados de usuarios sin permisos.

## 13. Módulo: Informes y estadísticas

Crea una sección de estadísticas administrativas con filtros de fechas.

Incluye:

- Registros activos y archivados.
- Ingresos y egresos por período.
- Actividades programadas y realizadas.
- Seguimientos pendientes.
- Distribución de actividades por categoría.

Permite exportar estadísticas agregadas en CSV y JSON utilizando únicamente los datos ficticios.

No incluyas nombres ni información jurídica individual en informes generales.

Las estadísticas deben generarse a partir de los registros y reflejar correctamente los filtros seleccionados.

## 14. Módulo: Configuración y gestión de datos

Incluye una sección que permita:

- Restaurar los datos ficticios originales.
- Consultar la cantidad de registros almacenados.
- Exportar datos de demostración.
- Importar archivos JSON de demostración.
- Validar la estructura de los archivos importados.
- Rechazar archivos malformados o con campos inválidos.
- Mostrar mensajes de confirmación antes de reemplazar datos.

Nunca ejecutes código contenido en archivos JSON mediante eval() o mecanismos similares.

Utiliza una lista permitida de campos y valida los valores importados.

No incluyas una función de borrado irreversible de expedientes desde la interfaz.

## 15. Datos ficticios de prueba

Crea al menos 12 expedientes completamente ficticios, con edades comprendidas entre los 14 y 17 años.

Utiliza nombres inventados y códigos como EXP-0001, EXP-0002 y EXP-0003.

No uses información de personas reales ni datos que puedan identificar a un menor.

Los expedientes de demostración deben incluir:

- Datos generales.
- Situación jurídica simulada.
- Historial de movimientos.
- Seguimientos.
- Actividades.
- Incidentes ficticios.
- Próximas revisiones.

Utiliza diferentes estados y situaciones para comprobar que los filtros funcionen.

Los hechos e infracciones deben describirse mediante categorías generales y neutrales. No incluyas detalles gráficos.

Crea también datos de prueba para actividades, usuarios, seguimientos y movimientos.

Los archivos JSON deben ser válidos, tener una estructura coherente y relacionarse mediante códigos únicos.

## 16. Aplicación web progresiva (PWA)

Configura correctamente:

- manifest.json.
- Nombre de la aplicación.
- Nombre corto.
- Iconos de instalación.
- Colores del tema.
- Modo de visualización standalone.
- Service Worker.
- Caché de recursos estáticos.
- Página de respaldo cuando corresponda.
- Detección del estado de conexión.
- Mensaje informativo cuando no exista conexión.

La aplicación debe poder instalarse desde un navegador compatible cuando se sirva por HTTPS o localhost.

El Service Worker no debe almacenar expedientes ni datos personales en cachés compartidas.

La funcionalidad sin conexión debe limitarse a la interfaz y los recursos estáticos del prototipo. No afirmes que los datos sensibles están protegidos por trabajar sin conexión.

## 17. Privacidad y seguridad

Aplica las siguientes reglas durante todo el desarrollo:

- Utiliza datos exclusivamente ficticios.
- No presentes el prototipo como apto para expedientes reales.
- No incluyas secretos, claves API ni contraseñas reales.
- No muestres información sensible en notificaciones, registros de consola o URL.
- Evita insertar contenido dinámico utilizando innerHTML sin una sanitización adecuada.
- Utiliza textContent para mostrar texto de usuarios siempre que sea posible.
- Valida los datos tanto al crear como al editar e importar.
- No confundas ocultar un botón con proteger un recurso.
- No utilices LocalStorage como mecanismo de protección de datos.
- No guardes documentos judiciales reales en el navegador.
- Documenta las limitaciones de seguridad y privacidad.

Antes de cualquier uso institucional, el sistema deberá contar con backend, autenticación segura, autorización aplicada en el servidor, almacenamiento protegido, auditoría resistente a modificaciones, copias de seguridad, gestión de sesiones y revisión jurídica y de protección de datos conforme a la normativa ecuatoriana aplicable a menores de edad.

## 18. Usabilidad y accesibilidad

Implementa:

- Navegación mediante teclado.
- Etiquetas asociadas a los campos.
- Contraste suficiente.
- Indicadores de foco visibles.
- Textos de ayuda.
- Mensajes de error comprensibles.
- Confirmaciones antes de operaciones importantes.
- Botones con nombres claros.
- Diseño responsive.
- Estados vacíos y mensajes de carga.
- Formatos de fecha y hora comprensibles en español.

Evita botones decorativos que no hagan nada.

## 19. Requisitos técnicos

El sistema debe:

- Cargar sin errores de JavaScript.
- Tener rutas de navegación funcionales dentro de la aplicación.
- Mantener los módulos separados.
- Reutilizar funciones comunes.
- Evitar código duplicado.
- Usar nombres de variables y funciones descriptivos en español.
- Manejar errores de lectura y escritura de datos.
- No depender de archivos que no existan.
- Evitar enlaces rotos.
- Mostrar mensajes claros cuando ocurra un error.
- Funcionar correctamente en navegadores modernos.

Implementa una función de inicialización que cargue los datos ficticios, prepare la navegación y actualice los indicadores.

Si utilizas importaciones de módulos JavaScript, documenta cómo ejecutar el proyecto desde un servidor local.

No intentes leer archivos JSON mediante fetch() directamente desde file://, ya que puede fallar por las restricciones del navegador.

## 20. Pruebas obligatorias

Antes de finalizar, comprueba los siguientes casos:

1. La aplicación abre correctamente.
2. El panel principal muestra cifras coherentes.
3. El buscador encuentra un expediente por código.
4. El buscador encuentra un expediente por nombre ficticio.
5. Los filtros funcionan correctamente.
6. La ficha individual muestra el expediente seleccionado.
7. Se puede crear un expediente de demostración.
8. Se rechazan códigos duplicados.
9. Se validan correctamente las fechas.
10. Se puede editar un registro ficticio.
11. Se pueden crear y consultar seguimientos.
12. Se pueden programar actividades.
13. Los movimientos conservan su historial.
14. Los informes reflejan los filtros seleccionados.
15. La importación JSON rechaza archivos inválidos.
16. La restauración recupera los datos de prueba.
17. La aplicación se adapta a pantallas pequeñas.
18. El Service Worker funciona cuando se ejecuta desde un servidor compatible.
19. No hay errores en la consola del navegador.
20. Los datos de prueba no incluyen información personal real.

Corrige los errores encontrados antes de dar el proyecto por terminado.

## 21. Forma de trabajo solicitada a OpenCode

Trabaja directamente en la carpeta actual del proyecto.

Sigue este orden:

1. Inspecciona los archivos existentes antes de modificarlos.
2. Crea la estructura de carpetas.
3. Implementa la interfaz y la navegación.
4. Implementa los módulos de expedientes.
5. Implementa seguimientos, actividades y movimientos.
6. Implementa los datos ficticios en JSON.
7. Implementa la persistencia local de demostración.
8. Configura el manifest y el Service Worker.
9. Realiza las pruebas funcionales.
10. Corrige los errores encontrados.
11. Actualiza el README con las instrucciones de ejecución.

No te limites a mostrar fragmentos de código o ejemplos. Crea los archivos completos directamente en el proyecto.

No dejes botones sin funcionalidad, funciones vacías, enlaces rotos ni comentarios del tipo "implementar después" para las funcionalidades principales solicitadas.

Si una característica no puede implementarse de forma segura en una aplicación sin backend, crea una demostración claramente identificada y documenta qué sería necesario para implementarla correctamente.

Al terminar, entrega un resumen de los archivos creados, las funcionalidades implementadas, las pruebas realizadas, las limitaciones pendientes y los comandos exactos para ejecutar la aplicación en Windows.

## 22. Resultado esperado

El resultado debe ser una aplicación web administrativa funcional, visualmente profesional, modular, progresiva y completamente navegable.

Debe permitir recorrer el panel principal, buscar expedientes ficticios, consultar sus fichas, registrar seguimientos, gestionar actividades, revisar movimientos y generar estadísticas.

La prioridad es conseguir una demostración funcional, coherente, fácil de utilizar y mantenible, sin sacrificar la privacidad ni presentar como seguras funciones que todavía no cuentan con un backend real.

## Instrucciones de ejecución (Windows)

Este proyecto es una PWA estática. Para que el Service Worker y la carga de archivos funcionen correctamente, **no abra index.html directamente con doble clic** cuando use funciones avanzadas. Puede funcionar en modo archivo para la mayor parte de la demostración, pero se recomienda un servidor local.

### Opción 1: Python
1. Abra PowerShell o CMD en la carpeta del proyecto:
   `cd "C:\Users\jdavi\OneDrive\Desktop\Penitenciaria"`
2. Ejecute:
   `python -m http.server 8080`
3. Abra en el navegador: http://localhost:8080/

### Opción 2: Node.js (http-server)
1. Instale: `npm install -g http-server`
2. En la carpeta del proyecto: `http-server -p 8080`
3. Abra: http://localhost:8080/

### Opción 3: VS Code Live Server
Abra la carpeta en VS Code y use la extensión Live Server.

### Limitaciones
- Prototipo sin backend. Los datos se persisten en LocalStorage del navegador.
- Roles son simulación visual, no seguridad real.
- Utiliza únicamente datos ficticios. No apto para expedientes reales.
- Control de acceso real requiere backend, autenticación y autorización en servidor.