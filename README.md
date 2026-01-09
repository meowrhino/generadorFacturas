# generador de facturas

Generador de facturas con previsualización en tiempo real y descarga en PDF.

## Características

### Datos del emisor
- Nombre
- Dirección 1
- Dirección 2
- N.I.F.

### Datos del cliente
- Nombre
- Dirección 1
- Dirección 2
- N.I.F.

### Datos de la factura
- **Número de factura**: Input numérico
- **Año**: Autocompletado con los 2 últimos dígitos del año actual
- **Fecha**: Autocompletada con la fecha actual (editable)
- **Asunto/Concepto**: Descripción del servicio o producto

### Cálculos
- **Base imponible**: Input numérico con decimales
- **IVA**: Por defecto 21% (editable, solo números enteros)
- **IRPF**: Checkbox para activar/desactivar (por defecto 15% cuando está activo)

### Previsualización
La factura se previsualiza en tiempo real con el diseño final que tendrá el PDF.

### Descarga en PDF
Botón para descargar la factura en formato PDF con todos los datos introducidos.

## Uso

Simplemente abre `index.html` en tu navegador. Rellena los campos y la previsualización se actualizará automáticamente. Haz clic en "Descargar PDF" para obtener el archivo.

## Tecnologías

- HTML5
- CSS3
- JavaScript (vanilla)
- jsPDF (librería para generación de PDF)

## Créditos

Desarrollado por [meowrhino.studio](https://meowrhino.studio)
