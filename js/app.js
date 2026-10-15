// ===== Hook de sección =====
window.onSeccionMostrada = function (id) {
  switch (id) {
    case 'dashboard': if (window.Dashboard) Dashboard.render(); break;
    case 'expedientes': if (window.Expedientes) Expedientes.render(); break;
    case 'movimientos': renderMovimientos(); break;
    case 'seguimiento': if (window.Seguimiento) Seguimiento.render(); break;
    case 'actividades': if (window.Actividades) Actividades.render(); break;
    case 'usuarios': if (window.Usuarios) Usuarios.render(); break;
    case 'informes': renderInformes(); break;
    case 'configuracion': renderConfiguracion(); break;
  }
};

// ===== Movimientos =====
const MovState = { texto: '', tipo: '', estado: '' };

function todosMovimientos() {
  const list = [];
  window.Storage.obtenerAdolescentes().forEach(function (a) {
    (a.movimientos || []).forEach(function (m) {
      list.push(Object.assign({}, m, { expediente: a.codigo, nombre: a.nombreFicticio }));
    });
  });
  return list;
}

function renderMovimientos() {
  const tbody = document.getElementById('tbl-movimientos-body');
  if (!tbody) return;
  const t = MovState.texto.toLowerCase().trim();
  const datos = todosMovimientos().filter(function (m) {
    if (MovState.tipo && m.tipo !== MovState.tipo) return false;
    if (MovState.estado && m.estadoValidacion !== MovState.estado) return false;
    if (t && !(m.codigo.toLowerCase().includes(t) || m.expediente.toLowerCase().includes(t) || (m.referencia || '').toLowerCase().includes(t))) return false;
    return true;
  }).sort(function (a, b) { return new Date(b.fecha) - new Date(a.fecha); });
  if (!datos.length) {
    tbody.innerHTML = '<tr><td colspan="9"><div class="empty-state"><div class="icon">🔀</div>Sin movimientos</div></td></tr>';
    return;
  }
  tbody.innerHTML = datos.map(function (m) {
    return '<tr>' +
      '<td>' + escaparHTML(m.codigo) + '</td>' +
      '<td>' + escaparHTML(m.expediente) + '</td>' +
      '<td>' + escaparHTML(m.tipo) + '</td>' +
      '<td>' + window.Utils.formatFechaHora(m.fecha) + '</td>' +
      '<td>' + escaparHTML(m.referencia) + '</td>' +
      '<td>' + escaparHTML(m.motivo) + '</td>' +
      '<td>' + escaparHTML(m.usuario) + '</td>' +
      '<td>' + escaparHTML(m.estadoValidacion) + '</td>' +
      '<td>' +
        (m.estadoValidacion !== 'Anulado' ? '<button class="btn small danger" onclick="anularMovimiento(\'' + m.codigo + '\',\'' + m.expediente + '\')">Anular</button>' : '<span class="badge">Anulado</span>') +
      '</td>' +
    '</tr>';
  }).join('');
  poblarSelectExpedientes('mov-form-expediente');
}

function abrirCrearMovimiento() {
  resetMovForm();
  poblarSelectExpedientes('mov-form-expediente');
  abrirModal('modal-movimiento');
}
function resetMovForm() {
  ['mov-form-codigo','mov-form-fecha','mov-form-referencia','mov-form-motivo','mov-form-observaciones'].forEach(function (id){ const e=document.getElementById(id); if (e) e.value=''; });
  setVal('mov-form-tipo', 'Ingreso');
  setVal('mov-form-estado', 'Pendiente');
  const c = document.getElementById('mov-form-codigo'); if (c) c.value = 'MOV-' + (todosMovimientos().length + 1).toString().padStart(4,'0');
  const f = document.getElementById('mov-form-fecha'); if (f && !f.value) f.value = new Date().toISOString().slice(0,16);
}
function guardarMovimiento() {
  const codigo = document.getElementById('mov-form-codigo').value.trim().toUpperCase();
  const expediente = document.getElementById('mov-form-expediente').value;
  const tipo = document.getElementById('mov-form-tipo').value;
  const fecha = document.getElementById('mov-form-fecha').value;
  const referencia = document.getElementById('mov-form-referencia').value.trim();
  const motivo = document.getElementById('mov-form-motivo').value.trim();
  const estado = document.getElementById('mov-form-estado').value;
  const obs = document.getElementById('mov-form-observaciones').value.trim();

  if (!codigo || !expediente || !fecha) { notificar('Complete código, expediente y fecha', 'warning'); return; }
  const existentes = todosMovimientos().map(function (m){ return m.codigo; });
  if (existentes.indexOf(codigo) !== -1) { notificar('Código duplicado', 'warning'); return; }
  const a = window.Storage.obtenerAdolescentes().find(function (x){ return x.codigo === expediente; });
  if (!a) { notificar('Expediente no encontrado', 'error'); return; }
  a.movimientos = a.movimientos || [];
  a.movimientos.push({
    codigo: codigo, tipo: tipo, fecha: new Date(fecha).toISOString(),
    referencia: referencia || ('ADM-' + codigo), motivo: motivo || 'Movimiento administrativo',
    usuario: (window.Storage.obtenerUsuarioActual() || {}).nombre || 'Sistema demo',
    estadoValidacion: estado, observaciones: obs
  });
  a.historial = a.historial || [];
  a.historial.push({
    fecha: new Date().toISOString(),
    usuario: (window.Storage.obtenerUsuarioActual() || {}).nombre || 'Sistema demo',
    operacion: 'Creación', registro: codigo, descripcion: 'Registro de movimiento'
  });
  window.Storage.guardarDatos();
  notificar('Movimiento ' + codigo + ' registrado', 'success');
  cerrarModal('modal-movimiento');
  renderMovimientos();
  if (typeof Dashboard !== 'undefined') Dashboard.render();
}

function anularMovimiento(codigo, expediente) {
  if (!confirm('¿Anular este movimiento? Se conservará el registro original y se documentará la anulación.')) return;
  const a = window.Storage.obtenerAdolescentes().find(function (x){ return x.codigo === expediente; });
  if (!a) return;
  const m = (a.movimientos || []).find(function (x){ return x.codigo === codigo; });
  if (!m) return;
  if (m.estadoValidacion === 'Anulado') return;
  m.estadoValidacion = 'Anulado';
  m.observaciones = (m.observaciones ? m.observaciones + ' | ' : '') + 'ANULADO el ' + new Date().toLocaleString('es-EC');
  a.historial = a.historial || [];
  a.historial.push({
    fecha: new Date().toISOString(),
    usuario: (window.Storage.obtenerUsuarioActual() || {}).nombre || 'Sistema demo',
    operacion: 'Anulación', registro: codigo,
    descripcion: 'Anulación controlada de movimiento. Registro original conservado.'
  });
  window.Storage.guardarDatos();
  notificar('Movimiento anulado (registro conservado)', 'info');
  renderMovimientos();
}

// ===== Informes =====
function renderInformes() {
  const cont = document.getElementById('informes-contenido');
  if (!cont) return;
  const adoles = window.Storage.obtenerAdolescentes();
  const acts = window.Storage.obtenerActividades();
  const desde = (document.getElementById('rep-desde') || {}).value || '';
  const hasta = (document.getElementById('rep-hasta') || {}).value || '';
  function inRange(fecha) {
    const d = new Date(fecha);
    if (desde && d < new Date(desde)) return false;
    if (hasta && d > new Date(hasta + 'T23:59:59')) return false;
    return true;
  }
  const activos = adoles.filter(function (a){ return a.estado === 'Activo'; }).length;
  const archiv = adoles.filter(function (a){ return a.estado === 'Archivado'; }).length;
  const movs = todosMovimientos().filter(function (m){ return inRange(m.fecha); });
  const ingresos = movs.filter(function (m){ return m.tipo === 'Ingreso'; }).length;
  const egresos = movs.filter(function (m){ return m.tipo === 'Egreso'; }).length;
  const actsRango = acts.filter(function (a){ return inRange(a.fecha); });
  const actsProg = actsRango.filter(function (a){ return a.estado === 'Programada'; }).length;
  const actsReal = actsRango.filter(function (a){ return a.estado === 'Realizada'; }).length;
  const segsPend = window.Storage.obtenerSeguimientosTotales(); // total
  // distribucion categorias
  const catCount = {};
  acts.forEach(function (a){ catCount[a.categoria] = (catCount[a.categoria] || 0) + 1; });

  let html = '<div class="cards-grid">';
  html += card('Registros activos', activos);
  html += card('Registros archivados', archiv);
  html += card('Ingresos en rango', ingresos);
  html += card('Egresos en rango', egresos);
  html += card('Actividades programadas', actsProg);
  html += card('Actividades realizadas', actsReal);
  html += card('Seguimientos totales', segsPend);
  html += '</div>';

  // chart categorias
  html += '<div class="section-block"><div class="section-header"><h3>Distribución de actividades por categoría</h3></div>';
  const max = Math.max(1, Math.max.apply(null, Object.values(catCount).concat([1])));
  html += '<div class="stats-chart">';
  Object.keys(catCount).forEach(function (k) {
    const h = Math.round((catCount[k] / max) * 150);
    html += '<div class="stats-bar" style="height:' + h + 'px"><span class="val">' + catCount[k] + '</span><span>' + escaparHTML(k) + '</span></div>';
  });
  html += '</div></div>';

  html += '<div style="display:flex;gap:8px;margin-top:8px;">' +
    '<button class="btn primary" onclick="exportarInformeJSON()">Exportar JSON</button>' +
    '<button class="btn" onclick="exportarInformeCSV()">Exportar CSV</button>' +
  '</div>';
  cont.innerHTML = html;
}
function card(label, value) { return '<div class="card"><div class="card-label">' + escaparHTML(label) + '</div><div class="card-value">' + value + '</div></div>'; }

function exportarInformeJSON() {
  const adoles = window.Storage.obtenerAdolescentes().map(function (a) {
    return { codigo: a.codigo, estado: a.estado, situacion: a.situacionActual, ingreso: a.fechaIngreso };
  });
  const payload = { generado: new Date().toISOString(), registros: adoles, actividades: window.Storage.obtenerActividades() };
  window.Utils.descargarArchivo(JSON.stringify(payload, null, 2), 'informe-demo.json', 'application/json');
}
function exportarInformeCSV() {
  const adoles = window.Storage.obtenerAdolescentes();
  let csv = 'Codigo,Estado,Situacion,FechaIngreso\n';
  adoles.forEach(function (a) {
    csv += [a.codigo, a.estado, a.situacionActual, a.fechaIngreso].map(function (v){ return '"' + String(v||'').replace(/"/g,'""') + '"'; }).join(',') + '\n';
  });
  window.Utils.descargarArchivo(csv, 'informe-demo.csv', 'text/csv');
}

// ===== Usuarios =====
window.Usuarios = (function () {
  function render() {
    const cont = document.getElementById('usuarios-contenido');
    if (!cont) return;
    const usuarios = window.Storage.obtenerUsuarios();
    // selector usuario actual
    const sel = document.getElementById('usuario-actual-select');
    if (sel) {
      const cur = (window.Storage.obtenerUsuarioActual() || {}).id;
      sel.innerHTML = usuarios.map(function (u){ return '<option value="' + u.id + '"' + (u.id === cur ? ' selected' : '') + '>' + escaparHTML(u.nombre) + ' — ' + escaparHTML(u.rol) + '</option>'; }).join('');
    }
    // matrix
    const permisos = ['gestionar_usuarios','ver_estadisticas','importar_exportar','configuracion','ver_juridico','registrar_referencias','ver_movimientos','registrar_seguimiento','consultar_datos_funcion','registrar_actividad','gestionar_registros','registrar_movimientos'];
    let html = '<div class="section-block"><div class="section-header"><h3>Matriz de permisos (simulación visual)</h3></div><div class="table-wrap"><table class="perm-matrix"><thead><tr><th>Rol / Permiso</th>';
    permisos.forEach(function (p){ html += '<th>' + escaparHTML(p.replace(/_/g,' ')) + '</th>'; });
    html += '</tr></thead><tbody>';
    // group by rol
    const roles = {};
    usuarios.forEach(function (u){ if (!roles[u.rol]) roles[u.rol] = { rol: u.rol, perms: [] }; roles[u.rol].perms = roles[u.rol].perms.concat(u.permisos || []); });
    Object.keys(roles).forEach(function (r) {
      const rr = roles[r];
      html += '<tr><td class="role-name">' + escaparHTML(r) + '</td>';
      permisos.forEach(function (p) {
        html += '<td>' + (rr.perms.indexOf(p) !== -1 ? '✅' : '—') + '</td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table></div></div>';
    html += '<p style="font-size:12px;color:#6B7280;margin-top:8px;">Los roles son una simulación visual sin backend. El control de acceso real debe verificarse en backend y base de datos. No hay contraseñas reales.</p>';
    // descriptions
    html += '<div class="cards-grid" style="margin-top:12px;">';
    html += cardDesc('Administrador', 'Gestiona configuración de demostración, consulta estadísticas administrativas, administra usuarios ficticios.');
    html += cardDesc('Personal jurídico autorizado', 'Consulta información jurídica correspondiente, registra referencias judiciales ficticias, consulta movimientos autorizados.');
    html += cardDesc('Personal socioeducativo', 'Registra actividades y seguimientos, consulta únicamente los datos necesarios para su función.');
    html += cardDesc('Personal administrativo', 'Gestiona registros administrativos y movimientos conforme a permisos.');
    html += '</div>';
    cont.innerHTML = html;
  }
  function cardDesc(tit, desc) {
    return '<div class="card"><div class="card-label">' + escaparHTML(tit) + '</div><div style="font-size:13px;margin-top:6px;">' + escaparHTML(desc) + '</div></div>';
  }
  return { render: render };
})();

// ===== Configuración =====
function renderConfiguracion() {
  const cont = document.getElementById('config-contenido');
  if (!cont) return;
  const e = window.Storage.obtenerEstado();
  const nAdol = (e.adolescentes || []).length;
  const nAct = (e.actividades || []).length;
  const nSeg = window.Storage.obtenerSeguimientosTotales();
  const nMov = window.Storage.obtenerMovimientosTotales();
  let html = '<div class="section-block"><div class="section-header"><h3>Registros almacenados</h3></div>';
  html += '<p>Adolescentes: <strong>' + nAdol + '</strong> · Actividades: <strong>' + nAct + '</strong> · Seguimientos: <strong>' + nSeg + '</strong> · Movimientos: <strong>' + nMov + '</strong></p></div>';

  html += '<div class="section-block"><div class="section-header"><h3>Restaurar datos ficticios</h3></div>';
  html += '<p>Recupera los datos de prueba originales, reemplazando los cambios actuales (se pedirá confirmación).</p>';
  html += '<button class="btn danger" onclick="restaurarDatos()">Restaurar originales</button></div>';

  html += '<div class="section-block"><div class="section-header"><h3>Exportar datos de demostración</h3></div>';
  html += '<button class="btn primary" onclick="exportarDatos()">Exportar JSON</button></div>';

  html += '<div class="section-block"><div class="section-header"><h3>Importar archivo JSON de demostración</h3></div>';
  html += '<input type="file" id="import-file" accept="application/json,.json" />';
  html += '<div style="margin-top:8px;"><button class="btn" onclick="importarDatos()">Importar y validar</button></div>';
  html += '<p style="font-size:12px;color:#6B7280;margin-top:8px;">Nunca se ejecuta código del JSON. Se valida la estructura con lista permitida de campos. Se pedirá confirmación antes de reemplazar.</p></div>';

  html += '<div class="section-block"><div class="section-header"><h3>Limitaciones de seguridad y privacidad</h3></div>';
  html += '<p style="font-size:13px;">Prototipo sin backend. Los datos se guardan en el navegador (LocalStorage). No apto para expedientes reales. El control de acceso real debe verificarse en backend y base de datos. No hay contraseñas reales.</p></div>';

  cont.innerHTML = html;
}
function restaurarDatos() {
  if (!confirm('¿Restaurar los datos ficticios originales? Se perderán los cambios.')) return;
  window.Storage.restaurarOriginales();
  notificar('Datos originales restaurados', 'success');
  renderConfiguracion();
  if (typeof Dashboard !== 'undefined') Dashboard.render();
}
function exportarDatos() {
  const json = window.Storage.exportarDatosJSON();
  window.Utils.descargarArchivo(json, 'penitenciaria-demo.json', 'application/json');
  notificar('Datos exportados', 'success');
}
function importarDatos() {
  const input = document.getElementById('import-file');
  if (!input || !input.files || !input.files.length) { notificar('Seleccione un archivo JSON', 'warning'); return; }
  const file = input.files[0];
  window.Utils.leerArchivo(file).then(function (texto) {
    let obj;
    try { obj = JSON.parse(texto); } catch (e) { notificar('El archivo no es un JSON válido.', 'error'); return; }
    const err = window.Storage.validarEstructuraImportacion(obj);
    if (err) { notificar(err, 'error'); return; }
    if (!confirm('El archivo es válido. ¿Reemplazar los datos actuales de demostración?')) return;
    const res = window.Storage.importarDatosJSON(texto);
    if (!res.ok) { notificar(res.error, 'error'); return; }
    notificar('Datos importados correctamente', 'success');
    renderConfiguracion();
    if (typeof Dashboard !== 'undefined') Dashboard.render();
  }).catch(function (e) {
    notificar(e.message || 'Error al importar', 'error');
  });
}

// ===== Búsqueda global =====
function busquedaGlobal(term) {
  const results = document.getElementById('global-search-results');
  if (!results) return;
  const t = (term || '').trim().toLowerCase();
  if (t.length < 2) { results.innerHTML = ''; results.style.display = 'none'; return; }
  const grupos = [];
  // expedientes
  const exps = window.Storage.obtenerAdolescentes().filter(function (a) {
    return a.codigo.toLowerCase().includes(t) || a.nombreFicticio.toLowerCase().includes(t) || (a.estado || '').toLowerCase().includes(t);
  });
  if (exps.length) {
    grupos.push({ title: 'Expedientes', items: exps.map(function (a) {
      return { label: a.codigo + ' · ' + a.nombreFicticio, sub: a.estado + ' · ' + a.situacionActual, action: function () { mostrarSeccion('expedientes'); setTimeout(function(){ Expedientes.abrirDetalle(a.codigo); }, 50); } };
    })});
  }
  // seguimientos
  const segs = todosSeguimientos().filter(function (s) {
    return s.codigo.toLowerCase().includes(t) || (s.expediente || '').toLowerCase().includes(t);
  });
  if (segs.length) {
    grupos.push({ title: 'Seguimientos', items: segs.map(function (s) {
      return { label: s.codigo + ' · ' + s.tipo, sub: s.expediente + ' · ' + s.estado, action: function () { mostrarSeccion('seguimiento'); } };
    })});
  }
  // movimientos
  const movs = todosMovimientos().filter(function (m) {
    return m.codigo.toLowerCase().includes(t);
  });
  if (movs.length) {
    grupos.push({ title: 'Movimientos', items: movs.map(function (m) {
      return { label: m.codigo + ' · ' + m.tipo, sub: m.expediente + ' · ' + window.Utils.formatFecha(m.fecha), action: function () { mostrarSeccion('movimientos'); } };
    })});
  }
  if (!grupos.length) {
    results.innerHTML = '<div class="item">Sin resultados</div>';
    results.style.display = 'block';
    return;
  }
  let html = '';
  grupos.forEach(function (g) {
    html += '<div class="group">' + escaparHTML(g.title) + '</div>';
    g.items.slice(0, 6).forEach(function (it, idx) {
      html += '<div class="item" data-g="' + grupos.indexOf(g) + '" data-i="' + idx + '">' +
        '<div>' + escaparHTML(it.label) + '</div>' +
        '<div style="font-size:12px;color:#6B7280;">' + escaparHTML(it.sub) + '</div>' +
      '</div>';
    });
  });
  results.innerHTML = html;
  results.style.display = 'block';
  // attach handlers
  let flat = [];
  grupos.forEach(function (g) { g.items.slice(0,6).forEach(function (it){ flat.push(it); }); });
  Array.from(results.querySelectorAll('.item[data-g]')).forEach(function (el, idx) {
    el.addEventListener('click', function () { flat[idx].action(); results.style.display = 'none'; document.getElementById('global-search-input').value = ''; });
  });
}

// ===== Usuarios select =====
function cambiarUsuarioActual(id) {
  window.Storage.establecerUsuarioActual(id);
  if (typeof Dashboard !== 'undefined') Dashboard.render();
}

// ===== Conexión =====
function actualizarEstadoConexion() {
  const pill = document.getElementById('status-pill');
  if (!pill) return;
  if (navigator.onLine) { pill.textContent = 'En línea'; pill.classList.remove('offline'); }
  else { pill.textContent = 'Sin conexión'; pill.classList.add('offline'); }
}

// ===== Init =====
function initApp() {
  window.Storage.cargarDatos();
  if (window.Navigation) Navigation.construirSidebar();
  // user select
  const sel = document.getElementById('usuario-actual-select');
  // puede estar en usuarios page; header select different
  const headerUser = document.getElementById('header-user-select');
  if (headerUser) {
    headerUser.innerHTML = window.Storage.obtenerUsuarios().map(function (u){ return '<option value="' + u.id + '">' + escaparHTML(u.nombre) + '</option>'; }).join('');
    headerUser.value = (window.Storage.obtenerUsuarioActual() || {}).id || '';
    headerUser.addEventListener('change', function(){ cambiarUsuarioActual(headerUser.value); notificar('Usuario de demostración cambiado', 'info'); });
  }
  // events
  const searchInput = document.getElementById('global-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function(){ busquedaGlobal(searchInput.value); });
    searchInput.addEventListener('blur', function(){ setTimeout(function(){ const r=document.getElementById('global-search-results'); if(r) r.style.display='none'; }, 200); });
  }
  // movimientos filters
  hook('mov-buscar', 'input', function(){ MovState.texto = this.value; renderMovimientos(); });
  hook('mov-filtro-tipo', 'change', function(){ MovState.tipo = this.value; renderMovimientos(); });
  hook('mov-filtro-estado', 'change', function(){ MovState.estado = this.value; renderMovimientos(); });
  // expedientes filters
  ['exp-buscar','exp-edad-min','exp-edad-max','exp-situacion','exp-estado','exp-fecha-desde','exp-fecha-hasta'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', function(){ Expedientes.aplicarFiltros(); });
  });
  // sort headers
  document.querySelectorAll('#tbl-expedientes thead th[data-sort]').forEach(function (th) {
    th.addEventListener('click', function(){ Expedientes.ordenar(th.getAttribute('data-sort')); });
  });
  // seguimiento filters
  ['seg-buscar','seg-filtro-fecha','seg-filtro-tipo','seg-filtro-estado'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', function(){ Seguimiento.aplicarFiltros(); });
  });
  // informes filtros
  ['rep-desde','rep-hasta'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', function(){ renderInformes(); });
  });

  // modal close buttons
  document.querySelectorAll('[data-close]').forEach(function (b) {
    b.addEventListener('click', function(){ cerrarModal(b.getAttribute('data-close')); });
  });
  // backdrop click close
  document.querySelectorAll('.modal-backdrop').forEach(function (mb) {
    mb.addEventListener('click', function (e) { if (e.target === mb) mb.classList.remove('open'); });
  });

  // mobile menu
  const mt = document.getElementById('menu-toggle');
  if (mt) mt.addEventListener('click', function(){ Navigation.alternarSidebar(); });

  actualizarEstadoConexion();
  window.addEventListener('online', actualizarEstadoConexion);
  window.addEventListener('offline', actualizarEstadoConexion);

  // default section
  mostrarSeccion('dashboard');

  // service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(function (e) { console.warn('SW no registrado:', e); });
  }
}

function hook(id, evt, fn) {
  const el = document.getElementById(id);
  if (el) el.addEventListener(evt, fn.bind(el));
}

// helpers exposed globally for onclick
window.abrirModal = function (id){ const m=document.getElementById(id); if(m) m.classList.add('open'); };
window.cerrarModal = function (id){ const m=document.getElementById(id); if(m) m.classList.remove('open'); };
window.notificar = window.Utils.notificar;

window.abrirCrearMovimiento = abrirCrearMovimiento;
window.guardarMovimiento = guardarMovimiento;
window.anularMovimiento = anularMovimiento;
window.renderMovimientos = renderMovimientos;
window.renderInformes = renderInformes;
window.exportarInformeJSON = exportarInformeJSON;
window.exportarInformeCSV = exportarInformeCSV;
window.restaurarDatos = restaurarDatos;
window.exportarDatos = exportarDatos;
window.importarDatos = importarDatos;

document.addEventListener('DOMContentLoaded', initApp);
