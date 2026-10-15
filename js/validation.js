const Validation = {
  requerido: function (v) { return v !== null && v !== undefined && String(v).trim() !== ''; },
  longitudMax: function (v, max) { return String(v || '').trim().length <= max; },
  fechaValida: function (v) { if (!v) return false; const d = new Date(v); return !isNaN(d.getTime()); },
  fechaAnteriorHoy: function (v) { if (!v) return false; const d = new Date(v); const hoy = new Date(); hoy.setHours(23,59,59,999); return d <= hoy; },
  fechaPosterior: function (a, b) { if (!a || !b) return true; return new Date(a) >= new Date(b); },
  rangoEdad: function (edad) { const n = parseInt(edad, 10); return !isNaN(n) && n >= 12 && n <= 25; },
  codigoUnico: function (codigo, existentes) {
    if (!codigo) return false;
    const c = String(codigo).trim().toUpperCase();
    return existentes.map(function (x) { return String(x).trim().toUpperCase(); }).indexOf(c) === -1;
  },
  horaPosterior: function (ini, fin) { if (!ini || !fin) return true; return fin > ini; },
  seleccionPermitida: function (v, opciones) { return opciones.indexOf(v) !== -1; }
};
window.Validation = Validation;
