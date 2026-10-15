const SeguimientoState = { fecha: '', tipo: '', estado: '', texto: '' };

function todosSeguimientos() {
  const list = [];
  window.Storage.obtenerAdolescentes().forEach(function (a) {
    (a.seguimientos || []).forEach(function (s) {
      list.push(Object.assign({}, s, { expediente: a.codigo, nombre: a.nombreFicticio }));
    });
  });
  return list;
}

function filtradosSeguimientos() {
  const t = SeguimientoState.texto.toLowerCase().trim();
  return todosSeguimientos().filter(function (s) {
    if (SeguimientoState.fecha && s.fecha !== SeguimientoState.fecha) return false;
    if (SeguimientoState.tipo && s.tipo !== SeguimientoState.tipo) return false;
    if (SeguimientoState.estado && s.estado !== SeguimientoState.estado) return false;
    if (t && !(s.codigo.toLowerCase().includes(t) || s.expediente.toLowerCase().includes(t) || (s.nombre || '').toLowerCase().includes(t))) return false;
    return true;
  }).sort(function (a,b){ return new Date(b.fecha) - new Date(a.fecha); });
}

function renderSeguimiento() {
  const tbody = document.getElementById('tbl-seguimiento-body');
  if (!tbody) return;
  const datos = filtradosSeguimientos();
  if (!datos.length) {
    tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><div class="icon">📝</div>Sin seguimientos</div></td></tr>';
    return;
  }
  tbody.innerHTML = datos.map(function (s) {
    return '<tr>' +
      '<td>' + escaparHTML(s.codigo) + '</td>' +
      '<td>' + escaparHTML(s.expediente) + '</td>' +
      '<td>' + escaparHTML(s.nombre) + '</td>' +
      '<td>' + escaparHTML(s.tipo) + '</td>' +
      '<td>' + window.Utils.formatFecha(s.fecha) + '</td>' +
      '<td>' + escaparHTML(s.objetivo) + '</td>' +
      '<td>' + escaparHTML(s.estado) + '</td>' +
      '<td>' + window.Utils.formatFecha(s.proximaRevision) + '</td>' +
    '</tr>';
  }).join('');
  // populate expediente select for modal if exists
  poblarSelectExpedientes('seg-form-expediente');
}

function aplicarFiltrosSeguimiento() {
  SeguimientoState.fecha = val('seg-filtro-fecha');
  SeguimientoState.tipo = val('seg-filtro-tipo');
  SeguimientoState.estado = val('seg-filtro-estado');
  SeguimientoState.texto = val('seg-buscar');
  renderSeguimiento();
}

function limpiarFiltrosSeguimiento() {
  SeguimientoState.fecha = ''; SeguimientoState.tipo = ''; SeguimientoState.estado = ''; SeguimientoState.texto = '';
  setVal('seg-filtro-fecha', ''); setVal('seg-filtro-tipo', ''); setVal('seg-filtro-estado', ''); setVal('seg-buscar', '');
  renderSeguimiento();
}

function abrirCrearSeguimiento() {
  resetSegForm();
  poblarSelectExpedientes('seg-form-expediente');
  abrirModal('modal-seguimiento');
}
function resetSegForm() {
  ['seg-form-codigo','seg-form-fecha','seg-form-objetivo','seg-form-descripcion','seg-form-resultado','seg-form-proxima'].forEach(function (id){ const e=document.getElementById(id); if(e) e.value=''; });
  setVal('seg-form-tipo','Educativo');
  setVal('seg-form-estado','Pendiente');
  const e = document.getElementById('seg-form-codigo'); if (e) e.value = 'SEG-' + (todosSeguimientos().length + 1).toString().padStart(4,'0');
}

function guardarSeguimiento() {
  const codigo = document.getElementById('seg-form-codigo').value.trim().toUpperCase();
  const expediente = document.getElementById('seg-form-expediente').value;
  const tipo = document.getElementById('seg-form-tipo').value;
  const fecha = document.getElementById('seg-form-fecha').value;
  const objetivo = document.getElementById('seg-form-objetivo').value.trim();
  const descripcion = document.getElementById('seg-form-descripcion').value.trim();
  const resultado = document.getElementById('seg-form-resultado').value.trim();
  const proxima = document.getElementById('seg-form-proxima').value;
  const estado = document.getElementById('seg-form-estado').value;

  if (!codigo) { notificar('Código obligatorio', 'warning'); return; }
  if (!expediente) { notificar('Seleccione un expediente', 'warning'); return; }
  if (!window.Validation.fechaValida(fecha)) { notificar('Fecha inválida', 'warning'); return; }
  // unique among all
  const existentes = todosSeguimientos().map(function (s){ return s.codigo; });
  if (existentes.indexOf(codigo) !== -1) { notificar('Código de seguimiento duplicado', 'warning'); return; }

  const a = window.Storage.obtenerAdolescentes().find(function (x){ return x.codigo === expediente; });
  if (!a) { notificar('Expediente no encontrado', 'error'); return; }
  a.seguimientos = a.seguimientos || [];
  a.seguimientos.push({
    codigo: codigo, tipo: tipo, fecha: fecha, objetivo: objetivo, descripcion: descripcion,
    resultado: resultado, proximaRevision: proxima, estado: estado,
    usuario: (window.Storage.obtenerUsuarioActual() || {}).nombre || 'Sistema demo'
  });
  a.historial = a.historial || [];
  a.historial.push({
    fecha: new Date().toISOString(),
    usuario: (window.Storage.obtenerUsuarioActual() || {}).nombre || 'Sistema demo',
    operacion: 'Creación',
    registro: codigo,
    descripcion: 'Registro de seguimiento socioeducativo'
  });
  window.Storage.guardarDatos();
  notificar('Seguimiento ' + codigo + ' registrado', 'success');
  cerrarModal('modal-seguimiento');
  renderSeguimiento();
  if (typeof Dashboard !== 'undefined') Dashboard.render();
}

function poblarSelectExpedientes(selectId) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  const actual = sel.value;
  sel.innerHTML = '<option value="">Seleccione...</option>' + window.Storage.obtenerAdolescentes().map(function (a) {
    return '<option value="' + escaparHTML(a.codigo) + '">' + escaparHTML(a.codigo) + ' · ' + escaparHTML(a.nombreFicticio) + '</option>';
  }).join('');
  if (actual) sel.value = actual;
}

window.Seguimiento = { render: renderSeguimiento, aplicarFiltros: aplicarFiltrosSeguimiento, limpiar: limpiarFiltrosSeguimiento, abrirCrear: abrirCrearSeguimiento, guardar: guardarSeguimiento };
