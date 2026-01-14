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


---

## 2026-01-14 10:50:49

### Mejoras de diseño y funcionalidad: Instrucciones de pago

**Sinopsis:** Implementación de mejoras visuales para que la factura se vea más profesional y "legit", y adición de un nuevo campo "instrucciones de pago" para facilitar el cobro.

**Contexto:**

El generador de facturas funcionaba correctamente, pero se identificaron oportunidades de mejora tanto en el diseño visual como en la funcionalidad. El objetivo era crear un generador de facturas universal, limpio y opensource que cualquiera pudiera usar sin necesidad de personalizarlo, manteniendo la sencillez pero mejorando la profesionalidad.

**Investigación previa:**

Se realizó una investigación sobre mejores prácticas de diseño de facturas minimalistas, enfocándose en:
- Espaciado y jerarquía visual
- Ubicación de información crítica (número de factura, total, instrucciones de pago)
- Uso de bordes y líneas divisorias
- Tipografía y legibilidad

Los hallazgos indicaron que las facturas profesionales se caracterizan por:
- Mucho espacio en blanco para facilitar la lectura
- Bordes sutiles (1px) en lugar de bordes gruesos (2px)
- Información de pago ubicada después de los totales
- Jerarquía clara con el TOTAL como elemento más prominente

**Cambios implementados:**

#### 1. Mejoras de diseño visual (CSS)

**Espaciado mejorado:**
- Aumentado el padding de `.invoice-preview` de 2rem a 2.5rem
- Aumentado el `margin-bottom` de `.invoice-block` de 1.5rem a 2rem
- Aumentado el espacio entre concepto y totales de 1.5rem a 2.5rem
- Mejorado el `line-height` de 1.5 a 1.6 en `.invoice-preview`

**Bordes más sutiles:**
- Reducido el borde de `.invoice-preview` de 2px a 1px
- Reducido el borde de `.invoice-block` de 2px a 1px
- Reducido el borde de `.invoice-concept` de 2px a 1px
- Reducido el borde de `.invoice-header-section` de 2px a 1px
- Mantenido el borde del `.total-row` en 2px para destacarlo

**Concepto más limpio:**
- Reducido el padding de `.invoice-concept` de 2rem a 1.5rem
- Reducido el `min-height` de 120px a 100px

**Total más prominente:**
- Aumentado el tamaño de fuente del `.total-row` de 1rem a 1.1rem
- Aumentado el padding del `.total-row` de 0.35rem a 0.5rem

**Nuevo elemento: Instrucciones de pago:**
- Creado `.invoice-payment-instructions` con:
  - Fondo gris claro (`#f9fafb`)
  - Borde sutil de 1px
  - Border radius de 6px
  - Padding de 1rem
  - Fuente de 0.88rem
  - Oculto por defecto, se muestra solo si hay contenido

#### 2. Nueva funcionalidad: Campo "Instrucciones de pago"

**En el formulario (HTML):**
- Añadido nuevo input `instruccionesPago` en el bloque "factura"
- Ubicado después del campo "asunto / concepto"
- Placeholder: "instrucciones de pago (opcional)"
- Campo opcional para no forzar su uso

**En la previsualización (HTML):**
- Añadido nuevo elemento `prevInstruccionesPago`
- Ubicado después de los totales y antes de las notas de IVA
- Se muestra solo si el usuario ha introducido texto

**En el JavaScript:**
- Añadido `instruccionesPago` al objeto `els` para acceso al DOM
- Añadido `prevInstruccionesPago` al objeto `els` para previsualización
- Actualizada función `updatePreview()` para mostrar/ocultar instrucciones
- Actualizada función `buildInvoiceData()` para incluir `instruccionesPago` en el JSON
- Actualizada función `applyInvoiceData()` para cargar `instruccionesPago` desde JSON
- Actualizada función `generatePDF()` para incluir instrucciones en el PDF

**Lógica de visualización:**
```javascript
const instruccionesPagoText = els.instruccionesPago.value.trim();
if (instruccionesPagoText) {
  els.prevInstruccionesPago.style.display = 'block';
  els.prevInstruccionesPago.innerHTML = `<strong>Instrucciones de pago:</strong><br>${instruccionesPagoText}`;
} else {
  els.prevInstruccionesPago.style.display = 'none';
  els.prevInstruccionesPago.innerHTML = '';
}
```

**En el PDF:**
- Las instrucciones se renderizan después de los totales
- Se usa `doc.splitTextToSize()` para ajustar el texto al ancho disponible
- Se calcula dinámicamente el espacio necesario para evitar solapamientos
- Formato: título en negrita (9pt) + contenido (8pt)

#### 3. Refactorización del código JavaScript

**Estructura modular mejorada:**

Se reorganizó el código en secciones claramente delimitadas con comentarios:

```javascript
// SELECCIÓN DE ELEMENTOS DEL DOM
// UTILIDADES DE FORMATO Y CONVERSIÓN
// CÁLCULOS DE FACTURA
// INICIALIZACIÓN
// PREVISUALIZACIÓN
// TOGGLES DE CHECKBOXES
// GESTIÓN DE DATOS (JSON)
// GENERACIÓN DE PDF
// EVENTOS Y INICIALIZACIÓN
```

**Nueva función: `calculateInvoice()`**

Se extrajo la lógica de cálculo en una función independiente que retorna un objeto con todos los valores calculados:

```javascript
function calculateInvoice() {
  // ... cálculos ...
  return {
    base,
    iva,
    irpf,
    total,
    ivaEnabled,
    irpfEnabled,
    ivaRate: ivaRateValue,
    irpfRate: irpfRateValue
  };
}
```

Esto permite reutilizar los cálculos tanto en la previsualización como en la generación del PDF, evitando duplicación de código.

**Mejoras en legibilidad:**
- Comentarios más descriptivos en cada sección
- Nombres de variables más claros
- Separación visual con líneas de comentarios
- Código más espaciado y organizado

#### 4. Compatibilidad con JSON

El nuevo campo `instruccionesPago` se integra completamente con el sistema de carga/guardado de JSON:

**Estructura del JSON actualizada:**
```json
{
  "version": 1,
  "factura": {
    "numero": "1",
    "fecha": "2026-01-14",
    "asunto": "Servicios de diseño web",
    "instruccionesPago": "Transferencia bancaria: ES12 3456..."
  }
}
```

**Beneficios:**
- Los usuarios pueden guardar plantillas con sus instrucciones de pago
- Facilita la reutilización de datos entre facturas
- Mantiene la retrocompatibilidad con JSONs antiguos (el campo es opcional)

**Impacto en archivos:**

- **index.html**: +4 líneas (nuevo input + nuevo elemento de preview)
- **styles.css**: ~40 líneas modificadas/añadidas (mejoras visuales + estilos de instrucciones)
- **script.js**: ~60 líneas modificadas/añadidas (refactorización + nueva funcionalidad)

**Resultado final:**

El generador de facturas ahora:
1. Se ve más profesional y "legit" con espaciados mejorados y bordes sutiles
2. Permite añadir instrucciones de pago que aparecen tanto en la previsualización como en el PDF
3. Tiene un código más limpio, modular y fácil de mantener
4. Mantiene la simplicidad y el fondo blanco original
5. Es completamente funcional para uso universal sin necesidad de personalización

**Próximos pasos sugeridos:**

1. Considerar añadir un campo de "fecha de vencimiento" opcional
2. Permitir múltiples líneas de concepto con cantidades y precios unitarios
3. Añadir soporte para múltiples idiomas
4. Implementar temas de color opcionales manteniendo el blanco como predeterminado
