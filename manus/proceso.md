# Proceso de creación - generadorFacturas

## Objetivo

Crear un generador de facturas con formularios para datos del emisor y cliente, previsualización en tiempo real y descarga en PDF.

## Requisitos funcionales

### Bloque 1: Datos del emisor
- Nombre
- Dirección 1
- Dirección 2
- N.I.F.

### Bloque 2: Datos del cliente
- Nombre
- Dirección 1
- Dirección 2
- N.I.F.

### Bloque 3: Datos de la factura
- **Número de factura**: Input numérico (números naturales)
- **Año**: Autocompletado con los 2 últimos dígitos del año actual (readonly)
- **Fecha**: Autocompletada con la fecha actual (editable)
- **Asunto/Concepto**: Input de texto para descripción del servicio

### Bloque 4: Cálculos
- **Base imponible**: Input numérico con decimales
- **IVA**: Por defecto 21%, solo números enteros
- **IRPF**: Checkbox para activar/desactivar, por defecto 15% cuando está activo

### Previsualización
- Muestra la factura en tiempo real con el diseño final
- Se actualiza automáticamente al modificar cualquier campo

### Descarga en PDF
- Botón para generar y descargar el PDF
- El PDF mantiene el diseño de la previsualización

## Decisiones de diseño

### Estructura HTML

El proyecto se divide en cuatro secciones principales:

1. **Header**: Título y descripción breve
2. **Form section**: Grid con 4 tarjetas (emisor, cliente, factura, cálculos)
3. **Preview section**: Previsualización de la factura con botón de descarga
4. **Branding**: Footer con enlace a meowrhino.studio

### Estilo visual

Se mantiene la estética del proyecto original `tarifas2026`:

- Paleta de colores: `--primary: #7c5aa8`, `--bg: #faf9fb`
- Tipografía: System fonts (Apple/Segoe UI/Roboto)
- Border radius: 12px
- Sombras suaves
- Grid responsive con `minmax(300px, 1fr)`

### Diseño de la factura

Se basó en el PDF de ejemplo proporcionado:

- Bloques con bordes negros para emisor y cliente
- Metadatos (número y fecha) alineados a la derecha
- Bloque de concepto/asunto centrado
- Tabla de cálculos alineada a la derecha
- Tipografía limpia y profesional

### Funcionalidad JavaScript

El script se estructura de forma modular:

1. **Selección de elementos**: Función helper `$()` para acceder al DOM
2. **Utilidades**: Funciones `toNum()` y `round2()` para conversión y redondeo
3. **Inicialización de fechas**: Función `initDateFields()` que establece fecha y año actuales
4. **Previsualización**: Función `updatePreview()` que actualiza todos los campos de la preview
5. **Toggle IRPF**: Función `toggleIrpf()` que activa/desactiva el campo IRPF
6. **Generación de PDF**: Función `generatePDF()` que usa jsPDF para crear el PDF
7. **Inicialización**: Función `init()` que configura eventos y estado inicial

### Generación de PDF con jsPDF

Se utilizó la librería jsPDF (desde CDN) para generar el PDF:

- Se carga desde CDN: `https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js`
- Se usa el formato A4 por defecto
- Se replican los bloques con bordes usando `doc.rect()`
- Se alinean los textos según el diseño de la previsualización
- El nombre del archivo es `factura_[numero]_[año].pdf`

### Autocompletado de fecha y año

- El campo "año" se autocompleta con los 2 últimos dígitos del año actual
- El campo "fecha" se autocompleta con la fecha actual en formato ISO (YYYY-MM-DD)
- Ambos campos son editables (excepto el año que es readonly)

### Validación de inputs

- **IVA e IRPF**: Se usa `Math.floor()` para asegurar que solo se aceptan números enteros
- **Base imponible**: Permite decimales con `step="0.01"`
- **Valores negativos**: Se usa `Math.max(0, ...)` para evitar valores negativos

## Archivos generados

- `index.html`: Estructura de la página con formularios y previsualización
- `styles.css`: Estilos visuales basados en tarifas2026
- `script.js`: Lógica de previsualización y generación de PDF
- `README.md`: Documentación del proyecto
- `manus/proceso.md`: Este archivo de documentación del proceso

## Dependencias externas

- **jsPDF**: Librería para generación de PDF desde el navegador
  - CDN: `https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js`
  - Versión: 2.5.1

## Próximos pasos

1. Subir el proyecto a GitHub como nuevo repositorio
2. Probar la generación de PDF en diferentes navegadores
3. Validar el responsive en dispositivos móviles
4. Considerar añadir más opciones de personalización (logo, colores, etc.)
