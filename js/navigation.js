const NAV_SECTIONS = [
  { id: 'dashboard', label: 'Panel principal', icon: '📊' },
  { group: 'Gestión' },
  { id: 'expedientes', label: 'Expedientes', icon: '📁' },
  { id: 'movimientos', label: 'Movimientos', icon: '🔀' },
  { id: 'seguimiento', label: 'Seguimiento', icon: '📝' },
  { id: 'actividades', label: 'Actividades', icon: '📅' },
  { group: 'Administración' },
  { id: 'usuarios', label: 'Usuarios y roles', icon: '👥' },
  { id: 'informes', label: 'Informes', icon: '📈' },
  { id: 'configuracion', label: 'Configuración', icon: '⚙️' }
];

function construirSidebar() {
  const sb = document.getElementById('sidebar');
  if (!sb) return;
  let html = '<div class="logo"><div class="mark">P</div><div><h1>Penitenciaría</h1><small>Centro de adolescentes · Demo</small></div></div>';
  NAV_SECTIONS.forEach(function (s) {
    if (s.group) { html += '<div class="nav-group">' + escaparHTML(s.group) + '</div>'; return; }
    html += '<button class="nav-link" data-section="' + s.id + '"><span class="icon">' + s.icon + '</span>' + escaparHTML(s.label) + '</button>';
  });
  sb.innerHTML = html;
  sb.querySelectorAll('.nav-link').forEach(function (btn) {
    btn.addEventListener('click', function () { mostrarSeccion(btn.getAttribute('data-section')); });
  });
}

let seccionActual = 'dashboard';
function mostrarSeccion(id) {
  if (!id) return;
  seccionActual = id;
  document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });
  const p = document.getElementById('page-' + id);
  if (p) p.classList.add('active');
  document.querySelectorAll('.nav-link').forEach(function (n) {
    n.classList.toggle('active', n.getAttribute('data-section') === id);
  });
  const titles = {
    dashboard: 'Panel principal',
    expedientes: 'Expedientes individuales',
    movimientos: 'Ingresos, egresos y movimientos',
    seguimiento: 'Seguimiento socioeducativo',
    actividades: 'Actividades y calendario',
    usuarios: 'Usuarios y roles de demostración',
    informes: 'Informes y estadísticas',
    configuracion: 'Configuración y gestión de datos'
  };
  const t = document.getElementById('page-title');
  if (t) t.textContent = titles[id] || id;
  // close mobile sidebar
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.remove('open');
  // hook
  if (typeof window.onSeccionMostrada === 'function') window.onSeccionMostrada(id);
}

function alternarSidebar() {
  const sb = document.getElementById('sidebar');
  if (sb) sb.classList.toggle('open');
}

window.Navigation = { construirSidebar, mostrarSeccion, alternarSidebar, seccionActual: function(){ return seccionActual; } };
window.mostrarSeccion = mostrarSeccion;
