const STORAGE_KEY = 'penitenciaria_data_v1';

let estado = null;
let usuarioActualId = null;

function clonar(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function normalizarEstado() {
  if (!estado || typeof estado !== 'object') estado = {};
  if (!Array.isArray(estado.adolescentes)) estado.adolescentes = [];
  if (!Array.isArray(estado.actividades)) estado.actividades = [];
  if (!Array.isArray(estado.usuarios)) estado.usuarios = [];
  estado.adolescentes.forEach(function (a) {
    a.movimientos = Array.isArray(a.movimientos) ? a.movimientos : [];
    a.seguimientos = Array.isArray(a.seguimientos) ? a.seguimientos : [];
    a.incidentes = Array.isArray(a.incidentes) ? a.incidentes : [];
    a.documentos = Array.isArray(a.documentos) ? a.documentos : [];
    a.historial = Array.isArray(a.historial) ? a.historial : [];
  });
}

function cargarDatos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      estado = JSON.parse(raw);
      normalizarEstado();
      return estado;
    }
  } catch (e) {
    console.error('Error al leer datos locales', e);
  }
  estado = clonar(window.SEED_DATA || { adolescentes: [], actividades: [], usuarios: [] });
  normalizarEstado();
  try { guardarDatos(); } catch (e) { console.error(e); }
  return estado;
}

function guardarDatos() {
  if (!estado) return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
    return true;
  } catch (e) {
    console.error('Error al guardar datos', e);
    return false;
  }
}

function restaurarOriginales() {
  estado = clonar(window.SEED_DATA || { adolescentes: [], actividades: [], usuarios: [] });
  normalizarEstado();
  guardarDatos();
  return estado;
}

function obtenerEstado() { return estado; }
function obtenerAdolescentes() { return estado ? estado.adolescentes : []; }
function obtenerActividades() { return estado ? estado.actividades : []; }
function obtenerUsuarios() { return estado ? estado.usuarios : []; }
function obtenerUsuarioActual() {
  const usuarios = obtenerUsuarios();
  if (!usuarioActualId && usuarios.length) usuarioActualId = usuarios[0].id;
  return usuarios.find(function (u) { return u.id === usuarioActualId; }) || (usuarios[0] || null);
}
function establecerUsuarioActual(id) { usuarioActualId = id; }
function obtenerSeguimientosTotales() {
  let total = 0;
  obtenerAdolescentes().forEach(function (a) { total += (a.seguimientos || []).length; });
  return total;
}
function obtenerMovimientosTotales() {
  let total = 0;
  obtenerAdolescentes().forEach(function (a) { total += (a.movimientos || []).length; });
  return total;
}
function contarPorEstadoAdolescentes() {
  const r = { total: 0, custodia: 0, recientes: 0, egresos: 0, pendientes: 0, revision: 0 };
  const hoy = new Date();
  const hace30 = new Date(); hace30.setDate(hace30.getDate() - 30);
  obtenerAdolescentes().forEach(function (a) {
    r.total++;
    if (a.situacionActual === 'Bajo custodia') r.custodia++;
    if (a.situacionActual === 'Egreso') r.egresos++;
    const fi = new Date(a.fechaIngreso);
    if (fi >= hace30) r.recientes++;
    (a.seguimientos || []).forEach(function (s) { if (s.estado === 'Pendiente') r.pendientes++; });
    if (a.estado === 'En revisión') r.revision++;
  });
  return r;
}

function actividadesProximas(dias) {
  dias = dias || 7;
  const hoy = new Date(); hoy.setHours(0,0,0,0);
  const limite = new Date(hoy); limite.setDate(limite.getDate() + dias);
  return obtenerActividades().filter(function (a) {
    const f = new Date(a.fecha + 'T00:00:00');
    return f >= hoy && f <= limite && a.estado !== 'Cancelada' && a.estado !== 'Realizada';
  }).sort(function (x, y) { return new Date(x.fecha) - new Date(y.fecha); });
}

function permisosDeUsuario(u) {
  return (u && Array.isArray(u.permisos)) ? u.permisos : [];
}
function tienePermiso(permiso) {
  const u = obtenerUsuarioActual();
  return permisosDeUsuario(u).indexOf(permiso) !== -1;
}

function exportarDatosJSON() {
  const payload = {
    adolescentes: obtenerAdolescentes(),
    actividades: obtenerActividades(),
    usuarios: obtenerUsuarios()
  };
  return JSON.stringify(payload, null, 2);
}

function validarEstructuraImportacion(obj) {
  if (!obj || typeof obj !== 'object') return 'El archivo no contiene un objeto JSON válido.';
  if (!Array.isArray(obj.adolescentes)) return 'Falta el arreglo "adolescentes".';
  if (!Array.isArray(obj.actividades)) return 'Falta el arreglo "actividades".';
  if (!Array.isArray(obj.usuarios)) return 'Falta el arreglo "usuarios".';
  // validacion de campos minimos
  for (let i = 0; i < obj.adolescentes.length; i++) {
    const a = obj.adolescentes[i];
    if (!a || typeof a !== 'object') return 'Adolescente inválido en posición ' + i;
    if (!a.codigo || typeof a.codigo !== 'string') return 'Falta código en adolescente ' + i;
    if (!a.nombreFicticio || typeof a.nombreFicticio !== 'string') return 'Falta nombre ficticio en ' + a.codigo;
  }
  for (let i = 0; i < obj.actividades.length; i++) {
    const a = obj.actividades[i];
    if (!a || typeof a !== 'object') return 'Actividad inválida en posición ' + i;
    if (!a.codigo || !a.nombre || !a.fecha) return 'Actividad incompleta en posición ' + i;
  }
  return null;
}

function importarDatosJSON(texto) {
  let obj;
  try { obj = JSON.parse(texto); }
  catch (e) { return { ok: false, error: 'El archivo no es un JSON válido.' }; }
  const err = validarEstructuraImportacion(obj);
  if (err) return { ok: false, error: err };
  estado = clonar(obj);
  normalizarEstado();
  guardarDatos();
  return { ok: true };
}

// expose
window.Storage = {
  cargarDatos, guardarDatos, restaurarOriginales, obtenerEstado,
  obtenerAdolescentes, obtenerActividades, obtenerUsuarios, obtenerUsuarioActual,
  establecerUsuarioActual, obtenerSeguimientosTotales, obtenerMovimientosTotales,
  contarPorEstadoAdolescentes, actividadesProximas, tienePermiso,
  exportarDatosJSON, importarDatosJSON, validarEstructuraImportacion
};
