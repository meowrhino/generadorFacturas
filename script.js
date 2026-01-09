(() => {
  // Selección de elementos del DOM
  const $ = (id) => document.getElementById(id);

  const fmt = new Intl.NumberFormat('es-ES', { 
    style: 'currency', 
    currency: 'EUR' 
  });

  const els = {
    // Emisor
    emisorNombre: $('emisorNombre'),
    emisorDireccion1: $('emisorDireccion1'),
    emisorDireccion2: $('emisorDireccion2'),
    emisorNIF: $('emisorNIF'),
    
    // Cliente
    clienteNombre: $('clienteNombre'),
    clienteDireccion1: $('clienteDireccion1'),
    clienteDireccion2: $('clienteDireccion2'),
    clienteNIF: $('clienteNIF'),
    
    // Factura
    facturaNumero: $('facturaNumero'),
    facturaAnio: $('facturaAnio'),
    facturaFecha: $('facturaFecha'),
    facturaAsunto: $('facturaAsunto'),
    
    // Cálculos
    baseImponible: $('baseImponible'),
    ivaRate: $('ivaRate'),
    irpfCheck: $('irpfCheck'),
    irpfRate: $('irpfRate'),
    
    // Preview
    prevEmisorNombre: $('prevEmisorNombre'),
    prevEmisorDireccion1: $('prevEmisorDireccion1'),
    prevEmisorDireccion2: $('prevEmisorDireccion2'),
    prevEmisorNIF: $('prevEmisorNIF'),
    
    prevClienteNombre: $('prevClienteNombre'),
    prevClienteDireccion1: $('prevClienteDireccion1'),
    prevClienteDireccion2: $('prevClienteDireccion2'),
    prevClienteNIF: $('prevClienteNIF'),
    
    prevFacturaNum: $('prevFacturaNum'),
    prevFacturaFecha: $('prevFacturaFecha'),
    prevFacturaAsunto: $('prevFacturaAsunto'),
    
    prevSubtotal: $('prevSubtotal'),
    prevIrpf: $('prevIrpf'),
    prevIva: $('prevIva'),
    prevTotal: $('prevTotal'),
    prevIrpfRow: $('prevIrpfRow'),
    
    downloadBtn: $('downloadBtn'),
  };

  // Utilidades
  const toNum = (v) => {
    const n = Number(String(v).replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  };

  const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

  // Inicializar fecha y año
  function initDateFields() {
    const today = new Date();
    const year = today.getFullYear();
    const yearShort = String(year).slice(-2);
    
    // Establecer año (2 últimos dígitos)
    els.facturaAnio.value = yearShort;
    
    // Establecer fecha actual
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    els.facturaFecha.value = `${yyyy}-${mm}-${dd}`;
  }

  // Actualizar previsualización
  function updatePreview() {
    // Emisor
    els.prevEmisorNombre.textContent = els.emisorNombre.value || '—';
    els.prevEmisorDireccion1.textContent = els.emisorDireccion1.value || '—';
    els.prevEmisorDireccion2.textContent = els.emisorDireccion2.value || '—';
    els.prevEmisorNIF.textContent = els.emisorNIF.value ? `N.I.F.: ${els.emisorNIF.value}` : '—';
    
    // Cliente
    els.prevClienteNombre.textContent = els.clienteNombre.value || '—';
    els.prevClienteDireccion1.textContent = els.clienteDireccion1.value || '—';
    els.prevClienteDireccion2.textContent = els.clienteDireccion2.value || '—';
    els.prevClienteNIF.textContent = els.clienteNIF.value ? `N.I.F.: ${els.clienteNIF.value}` : '—';
    
    // Factura
    const facturaNum = els.facturaNumero.value || '—';
    const facturaAnio = els.facturaAnio.value || '—';
    els.prevFacturaNum.textContent = `${facturaNum}/${facturaAnio}`;
    
    const fechaValue = els.facturaFecha.value;
    if (fechaValue) {
      const [y, m, d] = fechaValue.split('-');
      els.prevFacturaFecha.textContent = `${d}/${m}/${y}`;
    } else {
      els.prevFacturaFecha.textContent = '—';
    }
    
    els.prevFacturaAsunto.textContent = els.facturaAsunto.value || '—';
    
    // Cálculos
    const base = Math.max(0, toNum(els.baseImponible.value));
    const ivaRate = Math.max(0, Math.floor(toNum(els.ivaRate.value))) / 100;
    const irpfEnabled = els.irpfCheck.checked;
    const irpfRate = irpfEnabled ? Math.max(0, Math.floor(toNum(els.irpfRate.value))) / 100 : 0;
    
    const iva = round2(base * ivaRate);
    const irpf = round2(base * irpfRate);
    const total = round2(base + iva - irpf);
    
    els.prevSubtotal.textContent = fmt.format(base);
    els.prevIva.textContent = fmt.format(iva);
    els.prevTotal.textContent = fmt.format(total);
    
    if (irpfEnabled && irpf > 0) {
      els.prevIrpfRow.style.display = 'block';
      els.prevIrpf.textContent = '− ' + fmt.format(irpf);
    } else {
      els.prevIrpfRow.style.display = 'none';
      els.prevIrpf.textContent = fmt.format(0);
    }
  }

  // Toggle IRPF
  function toggleIrpf() {
    els.irpfRate.disabled = !els.irpfCheck.checked;
    updatePreview();
  }

  // Generar PDF
  function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Datos
    const emisorNombre = els.emisorNombre.value || '';
    const emisorDir1 = els.emisorDireccion1.value || '';
    const emisorDir2 = els.emisorDireccion2.value || '';
    const emisorNIF = els.emisorNIF.value || '';
    
    const clienteNombre = els.clienteNombre.value || '';
    const clienteDir1 = els.clienteDireccion1.value || '';
    const clienteDir2 = els.clienteDireccion2.value || '';
    const clienteNIF = els.clienteNIF.value || '';
    
    const facturaNum = els.facturaNumero.value || '1';
    const facturaAnio = els.facturaAnio.value || '26';
    const fechaValue = els.facturaFecha.value;
    let fechaFormateada = '';
    if (fechaValue) {
      const [y, m, d] = fechaValue.split('-');
      fechaFormateada = `${d}/${m}/${y}`;
    }
    const asunto = els.facturaAsunto.value || '';
    
    const base = Math.max(0, toNum(els.baseImponible.value));
    const ivaRate = Math.max(0, Math.floor(toNum(els.ivaRate.value))) / 100;
    const irpfEnabled = els.irpfCheck.checked;
    const irpfRate = irpfEnabled ? Math.max(0, Math.floor(toNum(els.irpfRate.value))) / 100 : 0;
    
    const iva = round2(base * ivaRate);
    const irpf = round2(base * irpfRate);
    const total = round2(base + iva - irpf);
    
    // Configuración del PDF
    let y = 20;
    
    // Emisor (bloque con borde)
    doc.setFontSize(10);
    doc.rect(20, y, 100, 30);
    doc.text(emisorNombre, 22, y + 5);
    doc.text(emisorDir1, 22, y + 10);
    doc.text(emisorDir2, 22, y + 15);
    doc.text(`N.I.F.: ${emisorNIF}`, 22, y + 20);
    
    // Número y fecha (derecha)
    doc.text(`N.º factura: ${facturaNum}/${facturaAnio}`, 140, y + 5);
    doc.text(`Fecha: ${fechaFormateada}`, 140, y + 10);
    
    y += 40;
    
    // Cliente (bloque con borde)
    doc.rect(20, y, 100, 30);
    doc.text(clienteNombre, 22, y + 5);
    doc.text(clienteDir1, 22, y + 10);
    doc.text(clienteDir2, 22, y + 15);
    doc.text(`N.I.F.: ${clienteNIF}`, 22, y + 20);
    
    y += 40;
    
    // Asunto (bloque con borde)
    doc.rect(20, y, 170, 40);
    doc.text(asunto, 105, y + 20, { align: 'center' });
    
    y += 50;
    
    // Cálculos (tabla alineada a la derecha)
    const xLabel = 130;
    const xValue = 180;
    
    doc.text('Subtotal', xLabel, y);
    doc.text(fmt.format(base), xValue, y, { align: 'right' });
    y += 7;
    
    if (irpfEnabled && irpf > 0) {
      doc.text('I.R.P.F.', xLabel, y);
      doc.text('− ' + fmt.format(irpf), xValue, y, { align: 'right' });
      y += 7;
    }
    
    doc.text('I.V.A.', xLabel, y);
    doc.text(fmt.format(iva), xValue, y, { align: 'right' });
    y += 10;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL', xLabel, y);
    doc.text(fmt.format(total), xValue, y, { align: 'right' });
    
    // Descargar
    doc.save(`factura_${facturaNum}_${facturaAnio}.pdf`);
  }

  // Inicializar eventos
  function init() {
    initDateFields();
    
    // Eventos de inputs
    const allInputs = [
      els.emisorNombre, els.emisorDireccion1, els.emisorDireccion2, els.emisorNIF,
      els.clienteNombre, els.clienteDireccion1, els.clienteDireccion2, els.clienteNIF,
      els.facturaNumero, els.facturaFecha, els.facturaAsunto,
      els.baseImponible, els.ivaRate, els.irpfRate,
    ];
    
    allInputs.forEach(input => {
      input.addEventListener('input', updatePreview);
      input.addEventListener('change', updatePreview);
    });
    
    // Evento checkbox IRPF
    els.irpfCheck.addEventListener('change', toggleIrpf);
    
    // Evento botón descargar
    els.downloadBtn.addEventListener('click', generatePDF);
    
    // Preview inicial
    updatePreview();
  }

  init();
})();
