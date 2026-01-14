(() => {
  // ============================================
  // SELECCIÓN DE ELEMENTOS DEL DOM
  // ============================================
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
    facturaFecha: $('facturaFecha'),
    facturaAsunto: $('facturaAsunto'),
    instruccionesPago1: $('instruccionesPago1'),
    instruccionesPago2: $('instruccionesPago2'),
    
    // Cálculos
    baseImponible: $('baseImponible'),
    ivaCheck: $('ivaCheck'),
    ivaRate: $('ivaRate'),
    ivaException: $('ivaException'),
    ivaExceptionField: $('ivaExceptionField'),
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
    prevInstruccionesPago: $('prevInstruccionesPago'),
    
    prevSubtotal: $('prevSubtotal'),
    prevIrpf: $('prevIrpf'),
    prevIva: $('prevIva'),
    prevIvaLabel: $('prevIvaLabel'),
    prevTotal: $('prevTotal'),
    prevIrpfRow: $('prevIrpfRow'),
    prevIvaException: $('prevIvaException'),
    
    downloadBtn: $('downloadBtn'),
    loadJsonBtn: $('loadJsonBtn'),
    jsonFileInput: $('jsonFileInput'),
  };

  // ============================================
  // UTILIDADES DE FORMATO Y CONVERSIÓN
  // ============================================
  
  const toNum = (v) => {
    const n = Number(String(v).replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  };

  const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

  const getDateParts = (value) => {
    if (!value) return null;
    const [y, m, d] = value.split('-');
    if (!y || !m || !d) return null;
    return { y, m, d };
  };

  const getYearShort = (value) => {
    const parts = getDateParts(value);
    return parts ? parts.y.slice(-2) : '';
  };

  const getYearShortForFile = (value) => {
    const year = getYearShort(value);
    if (year) return year;
    return String(new Date().getFullYear()).slice(-2);
  };

  const formatDate = (value) => {
    const parts = getDateParts(value);
    return parts ? `${parts.d}/${parts.m}/${parts.y}` : '—';
  };

  // ============================================
  // CÁLCULOS DE FACTURA
  // ============================================
  
  function calculateInvoice() {
    const baseInput = Math.max(0, toNum(els.baseImponible.value));
    const base = baseInput;
    const ivaEnabled = els.ivaCheck.checked;
    const ivaRateValue = Math.max(0, Math.floor(toNum(els.ivaRate.value))) / 100;
    const ivaRate = ivaEnabled ? ivaRateValue : 0;
    const irpfEnabled = els.irpfCheck.checked;
    const irpfRateValue = Math.max(0, Math.floor(toNum(els.irpfRate.value))) / 100;
    const irpfRate = irpfEnabled ? irpfRateValue : 0;
    
    const iva = round2(base * ivaRate);
    const irpf = round2(base * irpfRate);
    const total = round2(base + iva - irpf);
    
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

  // ============================================
  // INICIALIZACIÓN
  // ============================================
  
  function initDateFields() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    els.facturaFecha.value = `${yyyy}-${mm}-${dd}`;
  }

  // ============================================
  // PREVISUALIZACIÓN
  // ============================================
  
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
    const fechaValue = els.facturaFecha.value;
    const facturaAnio = getYearShort(fechaValue);
    els.prevFacturaNum.textContent = facturaAnio ? `${facturaNum}/${facturaAnio}` : `${facturaNum}/—`;
    els.prevFacturaFecha.textContent = formatDate(fechaValue);
    
    els.prevFacturaAsunto.textContent = els.facturaAsunto.value || '—';
    
    // Instrucciones de pago
    const instruccionesPago1Text = els.instruccionesPago1.value.trim();
    const instruccionesPago2Text = els.instruccionesPago2.value.trim();
    
    if (instruccionesPago1Text || instruccionesPago2Text) {
      els.prevInstruccionesPago.style.display = 'block';
      let htmlContent = '<strong>Instrucciones de pago:</strong><br>';
      if (instruccionesPago1Text) htmlContent += instruccionesPago1Text + '<br>';
      if (instruccionesPago2Text) htmlContent += instruccionesPago2Text;
      els.prevInstruccionesPago.innerHTML = htmlContent;
    } else {
      els.prevInstruccionesPago.style.display = 'none';
      els.prevInstruccionesPago.innerHTML = '';
    }
    
    // Cálculos
    const calc = calculateInvoice();
    
    els.prevSubtotal.textContent = fmt.format(calc.base);
    els.prevIva.textContent = fmt.format(calc.iva);
    els.prevTotal.textContent = fmt.format(calc.total);
    
    // IRPF
    if (calc.irpfEnabled && Math.abs(calc.irpf) > 0) {
      els.prevIrpfRow.style.display = 'grid';
      els.prevIrpf.textContent = '- ' + fmt.format(Math.abs(calc.irpf));
    } else {
      els.prevIrpfRow.style.display = 'none';
      els.prevIrpf.textContent = fmt.format(0);
    }

    // IVA label
    els.prevIvaLabel.textContent = calc.ivaEnabled ? 'I.V.A.' : 'I.V.A. (exento)';

    // Excepción IVA
    const ivaExceptionText = els.ivaException.value.trim();
    if (!calc.ivaEnabled && ivaExceptionText) {
      els.prevIvaException.style.display = 'block';
      els.prevIvaException.textContent = ivaExceptionText;
    } else {
      els.prevIvaException.style.display = 'none';
      els.prevIvaException.textContent = '';
    }
  }

  // ============================================
  // TOGGLES DE CHECKBOXES
  // ============================================
  
  function toggleIrpf() {
    els.irpfRate.disabled = !els.irpfCheck.checked;
    updatePreview();
  }

  function toggleIva() {
    const ivaEnabled = els.ivaCheck.checked;
    els.ivaRate.disabled = !ivaEnabled;
    els.ivaExceptionField.style.display = ivaEnabled ? 'none' : 'flex';
    updatePreview();
  }

  // ============================================
  // GESTIÓN DE DATOS (JSON)
  // ============================================
  
  function buildInvoiceData() {
    return {
      version: 1,
      emisor: {
        nombre: els.emisorNombre.value || '',
        direccion1: els.emisorDireccion1.value || '',
        direccion2: els.emisorDireccion2.value || '',
        nif: els.emisorNIF.value || '',
      },
      cliente: {
        nombre: els.clienteNombre.value || '',
        direccion1: els.clienteDireccion1.value || '',
        direccion2: els.clienteDireccion2.value || '',
        nif: els.clienteNIF.value || '',
      },
      factura: {
        numero: els.facturaNumero.value || '',
        fecha: els.facturaFecha.value || '',
        asunto: els.facturaAsunto.value || '',
        instruccionesPago1: els.instruccionesPago1.value || '',
        instruccionesPago2: els.instruccionesPago2.value || '',
      },
      calculos: {
        base: toNum(els.baseImponible.value),
        ivaRate: toNum(els.ivaRate.value),
        ivaEnabled: els.ivaCheck.checked,
        ivaException: els.ivaException.value || '',
        irpfEnabled: els.irpfCheck.checked,
        irpfRate: toNum(els.irpfRate.value),
      },
    };
  }

  function applyInvoiceData(data) {
    if (!data || typeof data !== 'object') return;
    const { emisor = {}, cliente = {}, factura = {}, calculos = {} } = data;

    // Emisor
    if (typeof emisor.nombre === 'string') els.emisorNombre.value = emisor.nombre;
    if (typeof emisor.direccion1 === 'string') els.emisorDireccion1.value = emisor.direccion1;
    if (typeof emisor.direccion2 === 'string') els.emisorDireccion2.value = emisor.direccion2;
    if (typeof emisor.nif === 'string') els.emisorNIF.value = emisor.nif;

    // Cliente
    if (typeof cliente.nombre === 'string') els.clienteNombre.value = cliente.nombre;
    if (typeof cliente.direccion1 === 'string') els.clienteDireccion1.value = cliente.direccion1;
    if (typeof cliente.direccion2 === 'string') els.clienteDireccion2.value = cliente.direccion2;
    if (typeof cliente.nif === 'string') els.clienteNIF.value = cliente.nif;

    // Factura
    if (typeof factura.numero !== 'undefined') els.facturaNumero.value = factura.numero;
    if (typeof factura.fecha === 'string') els.facturaFecha.value = factura.fecha;
    if (typeof factura.asunto === 'string') els.facturaAsunto.value = factura.asunto;
    if (typeof factura.instruccionesPago1 === 'string') els.instruccionesPago1.value = factura.instruccionesPago1;
    if (typeof factura.instruccionesPago2 === 'string') els.instruccionesPago2.value = factura.instruccionesPago2;
    // Retrocompatibilidad con versión anterior (un solo campo)
    if (typeof factura.instruccionesPago === 'string' && !factura.instruccionesPago1) {
      els.instruccionesPago1.value = factura.instruccionesPago;
    }

    // Cálculos
    if (typeof calculos.base !== 'undefined') els.baseImponible.value = calculos.base;
    if (typeof calculos.ivaRate !== 'undefined') els.ivaRate.value = calculos.ivaRate;
    if (typeof calculos.ivaEnabled !== 'undefined') els.ivaCheck.checked = !!calculos.ivaEnabled;
    if (typeof calculos.ivaException === 'string') els.ivaException.value = calculos.ivaException;
    if (typeof calculos.irpfEnabled !== 'undefined') els.irpfCheck.checked = !!calculos.irpfEnabled;
    if (typeof calculos.irpfRate !== 'undefined') els.irpfRate.value = calculos.irpfRate;
    
    toggleIva();
    toggleIrpf();
    updatePreview();
  }

  function downloadJSON() {
    const data = buildInvoiceData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const facturaNum = els.facturaNumero.value || 'sin_numero';
    const yearShort = getYearShortForFile(els.facturaFecha.value);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `factura_${facturaNum}_${yearShort}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  // ============================================
  // GENERACIÓN DE PDF
  // ============================================
  
  function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    
    // Recopilar datos
    const emisorNombre = els.emisorNombre.value || '';
    const emisorDir1 = els.emisorDireccion1.value || '';
    const emisorDir2 = els.emisorDireccion2.value || '';
    const emisorNIF = els.emisorNIF.value || '';
    
    const clienteNombre = els.clienteNombre.value || '';
    const clienteDir1 = els.clienteDireccion1.value || '';
    const clienteDir2 = els.clienteDireccion2.value || '';
    const clienteNIF = els.clienteNIF.value || '';
    
    const facturaNumValue = els.facturaNumero.value || '—';
    const facturaNumFile = els.facturaNumero.value || 'sin_numero';
    const fechaValue = els.facturaFecha.value;
    const facturaAnio = getYearShort(fechaValue) || '—';
    const facturaAnioFile = getYearShortForFile(fechaValue);
    const fechaFormateada = formatDate(fechaValue);
    const asunto = els.facturaAsunto.value || '';
    const instruccionesPago1 = els.instruccionesPago1.value.trim();
    const instruccionesPago2 = els.instruccionesPago2.value.trim();
    
    // Cálculos
    const calc = calculateInvoice();
    const ivaExceptionText = els.ivaException.value.trim();
    
    // Configuración de página
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const leftX = margin;
    const rightX = pageWidth / 2 + 5;
    let y = margin;

    // Título de factura
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(`Factura ${facturaNumValue}/${facturaAnio}`, leftX, y);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    y += 8;

    // Sección emisor y datos de factura
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Emisor', leftX, y);
    doc.text('Datos de factura', rightX, y);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    y += 5;

    doc.text(emisorNombre, leftX, y);
    doc.text(`N.º ${facturaNumValue}/${facturaAnio}`, rightX, y);
    y += 5;
    doc.text(emisorDir1, leftX, y);
    doc.text(fechaFormateada, rightX, y);
    y += 5;
    doc.text(emisorDir2, leftX, y);
    y += 5;
    doc.text(emisorNIF, leftX, y);
    y += 10;

    // Sección cliente
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Cliente', leftX, y);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    y += 5;
    doc.text(clienteNombre, leftX, y);
    y += 5;
    doc.text(clienteDir1, leftX, y);
    y += 5;
    doc.text(clienteDir2, leftX, y);
    y += 5;
    doc.text(clienteNIF, leftX, y);
    y += 10;

    // Concepto
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Concepto', leftX, y);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    y += 5;

    const concepto = asunto || '—';
    const conceptoLines = doc.splitTextToSize(concepto, pageWidth - margin * 2);
    doc.text(conceptoLines, leftX, y);
    y += conceptoLines.length * 5 + 8;

    // Preparar totales
    const totals = [
      { label: 'Base imponible', value: fmt.format(calc.base) },
    ];
    if (calc.irpfEnabled && Math.abs(calc.irpf) > 0) {
      totals.push({ label: 'Retención IRPF', value: '- ' + fmt.format(Math.abs(calc.irpf)) });
    }
    totals.push({ label: calc.ivaEnabled ? 'IVA' : 'IVA (exento)', value: fmt.format(calc.iva) });
    totals.push({ label: 'TOTAL', value: fmt.format(calc.total), bold: true });

    // Calcular espacio necesario para totales e instrucciones
    const noteLines = (!calc.ivaEnabled && ivaExceptionText)
      ? doc.splitTextToSize(ivaExceptionText, 70)
      : [];
    const noteHeight = noteLines.length ? noteLines.length * 4 + 2 : 0;
    
    let instruccionesText = '';
    if (instruccionesPago1) instruccionesText += instruccionesPago1;
    if (instruccionesPago1 && instruccionesPago2) instruccionesText += '\n';
    if (instruccionesPago2) instruccionesText += instruccionesPago2;
    
    const instruccionesLines = instruccionesText
      ? doc.splitTextToSize(instruccionesText, 70)
      : [];
    const instruccionesHeight = instruccionesLines.length ? instruccionesLines.length * 4 + 8 : 0;
    
    const lineHeight = 6;
    const totalsHeight = totals.length * lineHeight;
    let totalsY = pageHeight - margin - totalsHeight - noteHeight - instruccionesHeight;
    
    if (totalsY < y + 4) {
      totalsY = y + 4;
    }

    const labelX = pageWidth - margin - 70;
    const valueX = pageWidth - margin;

    // Excepción IVA (si existe)
    if (noteLines.length) {
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      doc.text(noteLines, labelX, totalsY);
      totalsY += noteLines.length * 4 + 2;
    }

    // Dibujar totales
    totals.forEach((row) => {
      if (row.bold) {
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
      } else {
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
      }
      doc.text(row.label, labelX, totalsY);
      doc.text(row.value, valueX, totalsY, { align: 'right' });
      totalsY += lineHeight;
    });
    
    // Instrucciones de pago (si existen)
    if (instruccionesLines.length) {
      totalsY += 4;
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      doc.text('Instrucciones de pago:', labelX, totalsY);
      totalsY += 4;
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      doc.text(instruccionesLines, labelX, totalsY);
    }
    
    // Descargar PDF
    doc.save(`factura_${facturaNumFile}_${facturaAnioFile}.pdf`);
  }

  // ============================================
  // EVENTOS Y INICIALIZACIÓN
  // ============================================
  
  function init() {
    initDateFields();
    
    // Eventos de inputs
    const allInputs = [
      els.emisorNombre, els.emisorDireccion1, els.emisorDireccion2, els.emisorNIF,
      els.clienteNombre, els.clienteDireccion1, els.clienteDireccion2, els.clienteNIF,
      els.facturaNumero, els.facturaFecha, els.facturaAsunto, 
      els.instruccionesPago1, els.instruccionesPago2,
      els.baseImponible, els.ivaRate, els.ivaException, els.irpfRate,
    ];
    
    allInputs.forEach(input => {
      input.addEventListener('input', updatePreview);
      input.addEventListener('change', updatePreview);
    });
    
    // Eventos checkbox
    els.irpfCheck.addEventListener('change', toggleIrpf);
    els.ivaCheck.addEventListener('change', toggleIva);
    
    // Evento cargar JSON
    els.loadJsonBtn.addEventListener('click', () => els.jsonFileInput.click());
    els.jsonFileInput.addEventListener('change', (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          applyInvoiceData(data);
        } catch (error) {
          console.error('JSON inválido', error);
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    });
    
    // Evento botón descargar
    els.downloadBtn.addEventListener('click', () => {
      generatePDF();
      downloadJSON();
    });
    
    toggleIva();
    toggleIrpf();

    // Preview inicial
    updatePreview();
  }

  init();
})();
