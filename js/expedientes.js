const ExpedientesState = {
  texto: '', edadMin: '', edadMax: '', situacion: '', estadoExp: '', fechaDesde: '', fechaHasta: '',
  sortBy: 'codigo', sortDir: 'asc', page: 1, pageSize: 8, sortColumn: 'codigo'
};

function listaFiltradaExpedientes() {
  const adols = window.Storage.obtenerAdolescentes();
  const t = ExpedientesState.texto.toLowerCase().trim();
  return adols.filter(function (a) {
    if (t && !(a.codigo.toLowerCase().includes(t) || a.nombreFicticio.toLowerCase().includes(t) || (a.estado || '').toLowerCase().includes(t))) return false;
    if (ExpedientesState.situacion && a.situacionActual !== ExpedientesState.situacion) return false;
    if (ExpedientesState.estadoExp && a.estado !== ExpedientesState.estadoExp) return false;
    const edad = window.Utils.edadDesdeFechaNac(a.fechaNacimiento);
    if (ExpedientesState.edadMin && edad < parseInt(ExpedientesState.edadMin, 10)) return false;
    if (ExpedientesState.edadMax && edad > parseInt(ExpedientesState.edadMax, 10)) return false;
    if (ExpedientesState.fechaDesde) {
      if (new Date(a.fechaIngreso) < new Date(ExpedientesState.fechaDesde)) return false;
    }
    if (ExpedientesState.fechaHasta) {
      if (new Date(a.fechaIngreso) > new Date(ExpedientesState.fechaHasta + 'T23:59:59')) return false;
    }
    return true;
  }).sort(function (a, b) {
    const col = ExpedientesState.sortColumn;
    let va, vb;
    if (col === 'edad') { va = window.Utils.edadDesdeFechaNac(a.fechaNacimiento); vb = window.Utils.edadDesdeFechaNac(b.fechaNacimiento); }
    else if (col === 'fechaIngreso') { va = new Date(a.fechaIngreso).getTime(); vb = new Date(b.fechaIngreso).getTime(); }
    else if (col === 'nombreFicticio') { va = a.nombreFicticio; vb = b.nombreFicticio; }
    else if (col === 'estado') { va = a.estado; vb = b.estado; }
    else if (col === 'situacionActual') { va = a.situacionActual; vb = b.situacionActual; }
    else { va = a.codigo; vb = b.codigo; }
    if (va < vb) return ExpedientesState.sortDir === 'asc' ? -1 : 1;
    if (va > vb) return ExpedientesState.sortDir === 'asc' ? 1 : -1;
    return 0;
  });
}

function renderExpedientes() {
  const datos = listaFiltradaExpedientes();
  const total = datos.length;
  const pageSize = ExpedientesState.pageSize;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (ExpedientesState.page > totalPages) ExpedientesState.page = totalPages;
  const start = (ExpedientesState.page - 1) * pageSize;
  const pageData = datos.slice(start, start + pageSize);

  const tbody = document.getElementById('tbl-expedientes-body');
  if (tbody) {
    if (!pageData.length) {
      tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><div class="icon">📁</div>Sin expedientes que coincidan con los filtros</div></td></tr>';
    } else {
      tbody.innerHTML = pageData.map(function (a) {
        return '<tr>' +
          '<td><strong>' + escaparHTML(a.codigo) + '</strong></td>' +
          '<td>' + escaparHTML(a.nombreFicticio) + '</td>' +
          '<td>' + window.Utils.edadDesdeFechaNac(a.fechaNacimiento) + '</td>' +
          '<td>' + window.Utils.formatFecha(a.fechaIngreso) + '</td>' +
          '<td><span class="badge ' + estadoBadgeClass(a.estado) + '">' + escaparHTML(a.estado) + '</span></td>' +
          '<td>' + escaparHTML(a.situacionActual) + '</td>' +
          '<td><button class="btn small primary" onclick="Expedientes.abrirDetalle(\'' + a.codigo + '\')">Ver expediente</button> <button class="btn small" onclick="Expedientes.abrirEditar(\'' + a.codigo + '\')">Editar</button></td>' +
        '</tr>';
      }).join('');
    }
  }

  const info = document.getElementById('exp-pag-info');
  if (info) info.textContent = 'Mostrando ' + (total ? start + 1 : 0) + '–' + Math.min(start + pageSize, total) + ' de ' + total;

  const pag = document.getElementById('exp-paginacion');
  if (pag) {
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
      html += '<button class="' + (i === ExpedientesState.page ? 'active' : '') + '" onclick="Expedientes.irPagina(' + i + ')">' + i + '</button>';
    }
    pag.innerHTML = html;
  }
  actualizarIndicadoresOrdenamiento();
}

function estadoBadgeClass(e) {
  const l = (e || '').toLowerCase();
  if (l === 'activo') return 'activo';
  if (l === 'archivado') return 'archivado';
  if (l === 'en revisión' || l === 'en revision') return 'revision';
  return '';
}

function actualizarIndicadoresOrdenamiento() {
  document.querySelectorAll('#tbl-expedientes thead th').forEach(function (th) {
    const col = th.getAttribute('data-sort');
    const ind = th.querySelector('.sort-indicator');
    if (!ind) return;
    if (col === ExpedientesState.sortColumn) {
      ind.textContent = ExpedientesState.sortDir === 'asc' ? '▲' : '▼';
    } else { ind.textContent = ''; }
  });
}

function limpiarFiltrosExpedientes() {
  ExpedientesState.texto = ''; ExpedientesState.edadMin = ''; ExpedientesState.edadMax = '';
  ExpedientesState.situacion = ''; ExpedientesState.estadoExp = '';
  ExpedientesState.fechaDesde = ''; ExpedientesState.fechaHasta = '';
  ExpedientesState.page = 1;
  sincronizarInputsFiltros();
  renderExpedientes();
}

function sincronizarInputsFiltros() {
  setVal('exp-buscar', ExpedientesState.texto);
  setVal('exp-edad-min', ExpedientesState.edadMin);
  setVal('exp-edad-max', ExpedientesState.edadMax);
  setVal('exp-situacion', ExpedientesState.situacion);
  setVal('exp-estado', ExpedientesState.estadoExp);
  setVal('exp-fecha-desde', ExpedientesState.fechaDesde);
  setVal('exp-fecha-hasta', ExpedientesState.fechaHasta);
}
function setVal(id, v) { const el = document.getElementById(id); if (el) el.value = v || ''; }

function aplicarFiltrosDesdeUI() {
  ExpedientesState.texto = val('exp-buscar');
  ExpedientesState.edadMin = val('exp-edad-min');
  ExpedientesState.edadMax = val('exp-edad-max');
  ExpedientesState.situacion = val('exp-situacion');
  ExpedientesState.estadoExp = val('exp-estado');
  ExpedientesState.fechaDesde = val('exp-fecha-desde');
  ExpedientesState.fechaHasta = val('exp-fecha-hasta');
  ExpedientesState.page = 1;
  renderExpedientes();
  // buscador encabezado global también
}

function val(id) { const el = document.getElementById(id); return el ? el.value : ''; }

function ordenarExpedientes(col) {
  if (ExpedientesState.sortColumn === col) {
    ExpedientesState.sortDir = ExpedientesState.sortDir === 'asc' ? 'desc' : 'asc';
  } else {
    ExpedientesState.sortColumn = col;
    ExpedientesState.sortDir = 'asc';
  }
  ExpedientesState.page = 1;
  renderExpedientes();
}

function irPaginaExpedientes(n) { ExpedientesState.page = n; renderExpedientes(); }

function abrirDetalleExpediente(codigo) {
  const a = window.Storage.obtenerAdolescentes().find(function (x) { return x.codigo === codigo; });
  if (!a) { notificar('Expediente no encontrado', 'error'); return; }
  const modal = document.getElementById('modal-detalle');
  if (!modal) return;
  document.getElementById('det-codigo').textContent = a.codigo;
  document.getElementById('det-nombre').textContent = a.nombreFicticio;
  document.getElementById('det-editar-btn').onclick = function () { cerrarModal('modal-detalle'); Expedientes.abrirEditar(a.codigo); };
  // tabs content
  llenarTabsDetalle(a);
  // show first tab
  mostrarTabDetalle('general');
  abrirModal('modal-detalle');
}

function mostrarTabDetalle(tab) {
  document.querySelectorAll('#modal-detalle .tab').forEach(function (t) {
    t.classList.toggle('active', t.getAttribute('data-tab') === tab);
  });
  document.querySelectorAll('#modal-detalle .tab-panel').forEach(function (p) {
    p.classList.toggle('active', p.id === 'panel-' + tab);
  });
}

function llenarTabsDetalle(a) {
  // General
  const g = document.getElementById('panel-general');
  if (g) {
    g.innerHTML =
      '<div class="ficha-grid">' +
        '<div class="ficha-avatar"><img src="' + escaparHTML(a.avatar || 'assets/images/placeholder.svg') + '" alt="avatar"></div>' +
        '<div class="ficha-info">' +
          '<dl class="kv-list">' +
            '<dt>Código interno</dt><dd>' + escaparHTML(a.codigo) + '</dd>' +
            '<dt>Nombre ficticio</dt><dd>' + escaparHTML(a.nombreFicticio) + '</dd>' +
            '<dt>Fecha de nacimiento</dt><dd>' + window.Utils.formatFecha(a.fechaNacimiento) + ' (' + window.Utils.edadDesdeFechaNac(a.fechaNacimiento) + ' años)</dd>' +
            '<dt>Sexo</dt><dd>' + escaparHTML(a.sexo || '-') + '</dd>' +
            '<dt>Fecha de ingreso</dt><dd>' + window.Utils.formatFechaHora(a.fechaIngreso) + '</dd>' +
            '<dt>Estado del expediente</dt><dd>' + escaparHTML(a.estado) + '</dd>' +
            '<dt>Centro asignado</dt><dd>' + escaparHTML(a.centro) + '</dd>' +
            '<dt>Responsable</dt><dd>' + escaparHTML(a.responsable) + '</dd>' +
            '<dt>Situación actual</dt><dd>' + escaparHTML(a.situacionActual) + '</dd>' +
          '</dl>' +
        '</div>' +
      '</div>';
  }
  // Juridico
  const j = a.juridico || {};
  const pj = document.getElementById('panel-juridico');
  if (pj) {
    pj.innerHTML = '<dl class="kv-list">' +
      '<dt>Código de referencia judicial</dt><dd>' + escaparHTML(j.codigoRef) + '</dd>' +
      '<dt>Autoridad / unidad judicial</dt><dd>' + escaparHTML(j.autoridad) + '</dd>' +
      '<dt>Fecha de resolución</dt><dd>' + window.Utils.formatFecha(j.fechaResolucion) + '</dd>' +
      '<dt>Clasificación general</dt><dd>' + escaparHTML(j.clasificacion) + '</dd>' +
      '<dt>Estado procesal / administrativo</dt><dd>' + escaparHTML(j.estadoProcesal) + '</dd>' +
      '<dt>Medida socioeducativa</dt><dd>' + escaparHTML(j.medida) + '</dd>' +
      '<dt>Fecha de inicio</dt><dd>' + window.Utils.formatFecha(j.fechaInicio) + '</dd>' +
      '<dt>Finalización prevista</dt><dd>' + window.Utils.formatFecha(j.fechaFinPrevista) + '</dd>' +
      '<dt>Próxima revisión</dt><dd>' + window.Utils.formatFecha(j.proximaRevision) + '</dd>' +
      '<dt>Observaciones</dt><dd>' + escaparHTML(j.observaciones) + '</dd>' +
    '</dl>' +
    '<p style="font-size:12px;color:#6B7280;margin-top:12px;">Nota: clasificación general de demostración. No se presenta como sentencia ni condena.</p>';
  }
  // Movimientos
  const pm = document.getElementById('panel-movimientos');
  if (pm) {
    if (!a.movimientos.length) pm.innerHTML = '<div class="empty-state"><div class="icon">🔀</div>Sin movimientos</div>';
    else {
      let html = '<table><thead><tr><th>Fecha y hora</th><th>Tipo</th><th>Referencia</th><th>Motivo</th><th>Usuario</th><th>Validación</th><th>Observaciones</th></tr></thead><tbody>';
      a.movimientos.forEach(function (m) {
        html += '<tr><td>' + window.Utils.formatFechaHora(m.fecha) + '</td><td>' + escaparHTML(m.tipo) + '</td><td>' + escaparHTML(m.referencia) + '</td><td>' + escaparHTML(m.motivo) + '</td><td>' + escaparHTML(m.usuario) + '</td><td>' + escaparHTML(m.estadoValidacion) + '</td><td>' + escaparHTML(m.observaciones) + '</td></tr>';
      });
      html += '</tbody></table>';
      pm.innerHTML = html;
    }
  }
  // Seguimiento
  const ps = document.getElementById('panel-seguimiento');
  if (ps) {
    if (!a.seguimientos.length) ps.innerHTML = '<div class="empty-state"><div class="icon">📝</div>Sin seguimientos</div>';
    else {
      let html = '<table><thead><tr><th>Código</th><th>Tipo</th><th>Fecha</th><th>Objetivo</th><th>Resultado</th><th>Próx. revisión</th><th>Estado</th></tr></thead><tbody>';
      a.seguimientos.forEach(function (s) {
        html += '<tr><td>' + escaparHTML(s.codigo) + '</td><td>' + escaparHTML(s.tipo) + '</td><td>' + window.Utils.formatFecha(s.fecha) + '</td><td>' + escaparHTML(s.objetivo) + '</td><td>' + escaparHTML(s.resultado) + '</td><td>' + window.Utils.formatFecha(s.proximaRevision) + '</td><td>' + escaparHTML(s.estado) + '</td></tr>';
      });
      html += '</tbody></table>';
      ps.innerHTML = html;
    }
  }
  // Incidentes
  const pi = document.getElementById('panel-incidentes');
  if (pi) {
    if (!a.incidentes.length) pi.innerHTML = '<div class="empty-state"><div class="icon">⚠️</div>Sin incidentes</div>';
    else {
      let html = '<table><thead><tr><th>Código</th><th>Fecha</th><th>Categoría</th><th>Descripción</th><th>Medidas</th><th>Estado</th><th>Responsable</th></tr></thead><tbody>';
      a.incidentes.forEach(function (inc) {
        html += '<tr><td>' + escaparHTML(inc.codigo) + '</td><td>' + window.Utils.formatFechaHora(inc.fecha) + '</td><td>' + escaparHTML(inc.categoria) + '</td><td>' + escaparHTML(inc.descripcion) + '</td><td>' + escaparHTML(inc.medidas) + '</td><td>' + escaparHTML(inc.estadoRevision) + '</td><td>' + escaparHTML(inc.responsable) + '</td></tr>';
      });
      html += '</tbody></table>';
      pi.innerHTML = html;
    }
  }
  // Documentos
  const pd = document.getElementById('panel-documentos');
  if (pd) {
    if (!a.documentos.length) pd.innerHTML = '<div class="empty-state"><div class="icon">📄</div>Sin documentos</div>';
    else {
      let html = '<table><thead><tr><th>Nombre</th><th>Categoría</th><th>Fecha</th><th>Usuario</th><th>Estado</th></tr></thead><tbody>';
      a.documentos.forEach(function (d) {
        html += '<tr><td>' + escaparHTML(d.nombre) + '</td><td>' + escaparHTML(d.categoria) + '</td><td>' + window.Utils.formatFecha(d.fecha) + '</td><td>' + escaparHTML(d.usuario) + '</td><td>' + escaparHTML(d.estado) + '</td></tr>';
      });
      html += '</tbody></table>';
      pd.innerHTML = html;
    }
  }
  // Historial
  const ph = document.getElementById('panel-historial');
  if (ph) {
    if (!a.historial.length) ph.innerHTML = '<div class="empty-state"><div class="icon">🕒</div>Sin historial</div>';
    else {
      let html = '<table><thead><tr><th>Fecha y hora</th><th>Usuario</th><th>Operación</th><th>Registro</th><th>Descripción</th></tr></thead><tbody>';
      a.historial.forEach(function (h) {
        html += '<tr><td>' + window.Utils.formatFechaHora(h.fecha) + '</td><td>' + escaparHTML(h.usuario) + '</td><td>' + escaparHTML(h.operacion) + '</td><td>' + escaparHTML(h.registro) + '</td><td>' + escaparHTML(h.descripcion) + '</td></tr>';
      });
      html += '</tbody></table>';
      ph.innerHTML = html;
    }
  }
}

function abrirModalCrearExpediente() {
  resetFormExpediente();
  document.getElementById('exp-form-modo').value = 'crear';
  document.getElementById('exp-form-codigo').disabled = false;
  document.getElementById('modal-expediente-titulo').textContent = 'Registrar nuevo expediente ficticio';
  abrirModal('modal-expediente');
}

function abrirEditarExpediente(codigo) {
  const a = window.Storage.obtenerAdolescentes().find(function (x) { return x.codigo === codigo; });
  if (!a) { notificar('Expediente no encontrado', 'error'); return; }
  resetFormExpediente();
  document.getElementById('exp-form-modo').value = 'editar:' + codigo;
  document.getElementById('exp-form-codigo').value = a.codigo;
  document.getElementById('exp-form-codigo').disabled = true;
  document.getElementById('exp-form-nombre').value = a.nombreFicticio;
  document.getElementById('exp-form-nacimiento').value = a.fechaNacimiento;
  document.getElementById('exp-form-sexo').value = a.sexo || 'Masculino';
  document.getElementById('exp-form-ingreso').value = a.fechaIngreso ? a.fechaIngreso.slice(0, 16) : '';
  document.getElementById('exp-form-estado').value = a.estado;
  document.getElementById('exp-form-situacion').value = a.situacionActual;
  document.getElementById('exp-form-centro').value = a.centro;
  document.getElementById('exp-form-responsable').value = a.responsable;
  // juridico
  const j = a.juridico || {};
  document.getElementById('exp-form-ref').value = j.codigoRef || '';
  document.getElementById('exp-form-autoridad').value = j.autoridad || '';
  document.getElementById('exp-form-clasif').value = j.clasificacion || '';
  document.getElementById('exp-form-medida').value = j.medida || '';
  document.getElementById('exp-form-proxima').value = j.proximaRevision || '';
  document.getElementById('modal-expediente-titulo').textContent = 'Editar expediente ficticio';
  abrirModal('modal-expediente');
}

function resetFormExpediente() {
  ['exp-form-modo','exp-form-codigo','exp-form-nombre','exp-form-nacimiento','exp-form-ingreso','exp-form-centro','exp-form-responsable','exp-form-ref','exp-form-autoridad','exp-form-clasif','exp-form-medida','exp-form-proxima'].forEach(function (id) {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  setSel('exp-form-sexo', 'Masculino');
  setSel('exp-form-estado', 'Activo');
  setSel('exp-form-situacion', 'Bajo custodia');
  // clear errors
  document.querySelectorAll('#modal-expediente .form-error').forEach(function (e) { e.textContent = ''; });
  document.querySelectorAll('#modal-expediente .invalid').forEach(function (e) { e.classList.remove('invalid'); });
}
function setSel(id, v) { const el = document.getElementById(id); if (el) el.value = v; }

function guardarExpediente() {
  const modo = document.getElementById('exp-form-modo').value;
  const codigo = document.getElementById('exp-form-codigo').value.trim().toUpperCase();
  const nombre = document.getElementById('exp-form-nombre').value.trim();
  const nac = document.getElementById('exp-form-nacimiento').value;
  const sexo = document.getElementById('exp-form-sexo').value;
  const ingreso = document.getElementById('exp-form-ingreso').value;
  const estado = document.getElementById('exp-form-estado').value;
  const situacion = document.getElementById('exp-form-situacion').value;
  const centro = document.getElementById('exp-form-centro').value.trim();
  const responsable = document.getElementById('exp-form-responsable').value.trim();
  const ref = document.getElementById('exp-form-ref').value.trim();
  const autoridad = document.getElementById('exp-form-autoridad').value.trim();
  const clasif = document.getElementById('exp-form-clasif').value.trim();
  const medida = document.getElementById('exp-form-medida').value.trim();
  const proxima = document.getElementById('exp-form-proxima').value;

  let ok = true;
  function marcar(id, mensaje) {
    const el = document.getElementById(id);
    if (el) el.classList.add('invalid');
    const err = document.querySelector('[data-err="' + id + '"]');
    if (err) err.textContent = mensaje;
    ok = false;
  }
  function limpiar(id) {
    const el = document.getElementById(id); if (el) el.classList.remove('invalid');
    const err = document.querySelector('[data-err="' + id + '"]'); if (err) err.textContent = '';
  }

  // validate
  if (!window.Validation.requerido(codigo)) marcar('exp-form-codigo', 'Código obligatorio');
  else limpiar('exp-form-codigo');
  if (!window.Validation.requerido(nombre)) marcar('exp-form-nombre', 'Nombre obligatorio');
  else limpiar('exp-form-nombre');
  if (!window.Validation.fechaValida(nac)) marcar('exp-form-nacimiento', 'Fecha inválida');
  else if (!window.Validation.fechaAnteriorHoy(nac)) marcar('exp-form-nacimiento', 'Debe ser anterior a hoy');
  else limpiar('exp-form-nacimiento');
  if (!window.Validation.fechaValida(ingreso)) marcar('exp-form-ingreso', 'Fecha de ingreso inválida');
  else limpiar('exp-form-ingreso');
  if (!window.Validation.requerido(centro)) marcar('exp-form-centro', 'Centro obligatorio');
  else limpiar('exp-form-centro');
  if (!window.Validation.requerido(responsable)) marcar('exp-form-responsable', 'Responsable obligatorio');
  else limpiar('exp-form-responsable');

  // unique code on create
  if (modo === 'crear') {
    const existentes = window.Storage.obtenerAdolescentes().map(function (x) { return x.codigo; });
    if (!window.Validation.codigoUnico(codigo, existentes)) {
      marcar('exp-form-codigo', 'Código duplicado');
    }
  }

  if (!ok) { notificar('Corrige los errores del formulario', 'warning'); return; }

  const adols = window.Storage.obtenerAdolescentes();
  if (modo === 'crear') {
    const nuevo = {
      codigo: codigo,
      nombreFicticio: nombre,
      fechaNacimiento: nac,
      sexo: sexo,
      fechaIngreso: new Date(ingreso).toISOString(),
      estado: estado,
      situacionActual: situacion,
      centro: centro,
      responsable: responsable,
      avatar: 'assets/images/placeholder.svg',
      juridico: {
        codigoRef: ref || ('REF-J-' + codigo),
        autoridad: autoridad || 'Unidad Judicial de Ejemplo',
        fechaResolucion: '',
        clasificacion: clasif || 'Clasificación general (demostración)',
        estadoProcesal: 'En instrucción fiscal',
        medida: medida || 'Medida socioeducativa (demostración)',
        fechaInicio: ingreso.slice(0,10),
        fechaFinPrevista: '',
        proximaRevision: proxima || '',
        observaciones: 'Expediente creado en demostración.'
      },
      movimientos: [{
        codigo: 'MOV-' + codigo,
        tipo: 'Ingreso',
        fecha: new Date(ingreso).toISOString(),
        referencia: 'ADM-' + codigo,
        motivo: 'Recepción de expediente',
        usuario: (window.Storage.obtenerUsuarioActual() || {}).nombre || 'Sistema demo',
        estadoValidacion: 'Pendiente',
        observaciones: 'Movimiento generado automáticamente (demostración)'
      }],
      seguimientos: [],
      incidentes: [],
      documentos: [],
      historial: [{
        fecha: new Date().toISOString(),
        usuario: (window.Storage.obtenerUsuarioActual() || {}).nombre || 'Sistema demo',
        operacion: 'Creación',
        registro: codigo,
        descripcion: 'Apertura de expediente ficticio'
      }]
    };
    adols.push(nuevo);
    // sync flat seguimientos? not needed
    window.Storage.guardarDatos();
    notificar('Expediente ' + codigo + ' creado correctamente', 'success');
  } else {
    const editCode = modo.split(':')[1];
    const a = adols.find(function (x) { return x.codigo === editCode; });
    if (!a) { notificar('No se encontró el expediente', 'error'); return; }
    a.nombreFicticio = nombre;
    a.fechaNacimiento = nac;
    a.sexo = sexo;
    a.estado = estado;
    a.situacionActual = situacion;
    a.centro = centro;
    a.responsable = responsable;
    a.juridico = a.juridico || {};
    a.juridico.codigoRef = ref || a.juridico.codigoRef;
    a.juridico.autoridad = autoridad || a.juridico.autoridad;
    a.juridico.clasificacion = clasif || a.juridico.clasificacion;
    a.juridico.medida = medida || a.juridico.medida;
    a.juridico.proximaRevision = proxima || a.juridico.proximaRevision;
    a.historial = a.historial || [];
    a.historial.push({
      fecha: new Date().toISOString(),
      usuario: (window.Storage.obtenerUsuarioActual() || {}).nombre || 'Sistema demo',
      operacion: 'Actualización',
      registro: a.codigo,
      descripcion: 'Edición de expediente ficticio'
    });
    window.Storage.guardarDatos();
    notificar('Expediente ' + a.codigo + ' actualizado', 'success');
  }
  cerrarModal('modal-expediente');
  renderExpedientes();
  renderDashboardSafe();
}

function renderDashboardSafe() {
  if (typeof Dashboard !== 'undefined' && Dashboard.render) Dashboard.render();
}

function abrirModal(id) { const m = document.getElementById(id); if (m) m.classList.add('open'); }
function cerrarModal(id) { const m = document.getElementById(id); if (m) m.classList.remove('open'); }

window.Expedientes = {
  state: ExpedientesState,
  render: renderExpedientes,
  abrirDetalle: abrirDetalleExpediente,
  abrirCrear: abrirModalCrearExpediente,
  abrirEditar: abrirEditarExpediente,
  guardar: guardarExpediente,
  limpiarFiltros: limpiarFiltrosExpedientes,
  aplicarFiltros: aplicarFiltrosDesdeUI,
  ordenar: ordenarExpedientes,
  irPagina: irPaginaExpedientes,
  abrirModal: abrirModal,
  cerrarModal: cerrarModal
};
