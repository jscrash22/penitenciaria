function escaparHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function notificar(mensaje, tipo) {
  tipo = tipo || 'info';
  const el = document.createElement('div');
  el.className = 'notification ' + tipo;
  el.textContent = mensaje;
  document.body.appendChild(el);
  setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 3200);
}

function formatFecha(fecha) {
  if (!fecha) return '-';
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return String(fecha);
  return d.toLocaleDateString('es-EC', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function formatFechaHora(fecha) {
  if (!fecha) return '-';
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return String(fecha);
  return d.toLocaleString('es-EC', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function edadDesdeFechaNac(fechaNac) {
  if (!fechaNac) return '-';
  const n = new Date(fechaNac);
  const hoy = new Date();
  let edad = hoy.getFullYear() - n.getFullYear();
  const m = hoy.getMonth() - n.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < n.getDate())) edad--;
  return edad;
}

function descargarArchivo(contenido, nombre, tipo) {
  const blob = new Blob([contenido], { type: tipo || 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = nombre;
  document.body.appendChild(a); a.click();
  setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
}

function leerArchivo(file) {
  return new Promise(function (resolve, reject) {
    const r = new FileReader();
    r.onload = function (e) { resolve(e.target.result); };
    r.onerror = function () { reject(new Error('No se pudo leer el archivo.')); };
    r.readAsText(file);
  });
}

function uid(prefix) {
  return (prefix || '') + Date.now().toString(36) + Math.random().toString(36).slice(2, 7).toUpperCase();
}

window.Utils = { escaparHTML, notificar, formatFecha, formatFechaHora, edadDesdeFechaNac, descargarArchivo, leerArchivo, uid };
