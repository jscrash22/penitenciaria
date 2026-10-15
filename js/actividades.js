const ActividadesState = { vista: 'lista', mesOffset: 0 };

function actividadesFiltradas() {
  return window.Storage.obtenerActividades().slice().sort(function (a, b) {
    if (a.fecha !== b.fecha) return a.fecha < b.fecha ? -1 : 1;
    return (a.horaInicio || '').localeCompare(b.horaInicio || '');
  });
}

function renderActividades() {
  const cont = document.getElementById('act-contenido');
  if (!cont) return;
  if (ActividadesState.vista === 'lista') renderActividadesLista(cont);
  else renderActividadesCalendario(cont);
}

function renderActividadesLista(cont) {
  const datos = actividadesFiltradas();
  if (!datos.length) {
    cont.innerHTML = '<div class="empty-state"><div class="icon">📅</div>Sin actividades</div>';
    return;
  }
  let html = '<table><thead><tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Fecha</th><th>Inicio</th><th>Fin</th><th>Responsable</th><th>Capacidad</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>';
  datos.forEach(function (a) {
    html += '<tr>' +
      '<td>' + escaparHTML(a.codigo) + '</td>' +
      '<td>' + escaparHTML(a.nombre) + '</td>' +
      '<td>' + escaparHTML(a.categoria) + '</td>' +
      '<td>' + window.Utils.formatFecha(a.fecha) + '</td>' +
      '<td>' + escaparHTML(a.horaInicio) + '</td>' +
      '<td>' + escaparHTML(a.horaFin) + '</td>' +
      '<td>' + escaparHTML(a.responsable) + '</td>' +
      '<td>' + escaparHTML(a.capacidad) + '</td>' +
      '<td>' + escaparHTML(a.estado) + '</td>' +
      '<td><button class="btn small" onclick="Actividades.editar(\'' + a.codigo + '\')">Editar</button> ' +
          (a.estado !== 'Cancelada' ? '<button class="btn small danger" onclick="Actividades.cancelar(\'' + a.codigo + '\')">Cancelar</button>' : '') +
      '</td></tr>';
  });
  html += '</tbody></table>';
  cont.innerHTML = html;
}

function renderActividadesCalendario(cont) {
  const hoy = new Date();
  const base = new Date(hoy.getFullYear(), hoy.getMonth() + ActividadesState.mesOffset, 1);
  const year = base.getFullYear(), month = base.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0 dom
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const acts = window.Storage.obtenerActividades();
  const byDate = {};
  acts.forEach(function (a) {
    const d = new Date(a.fecha + 'T00:00:00');
    if (d.getFullYear() === year && d.getMonth() === month) {
      (byDate[d.getDate()] = byDate[d.getDate()] || []).push(a);
    }
  });
  const monthName = base.toLocaleDateString('es-EC', { month: 'long', year: 'numeric' });
  let html = '<div class="calendar">' +
    '<div class="cal-header"><button class="btn small" onclick="Actividades.mesAnterior()">◀</button><strong>' + escaparHTML(monthName) + '</strong><button class="btn small" onclick="Actividades.mesSiguiente()">▶</button></div>' +
    '<div class="cal-grid">';
  ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].forEach(function (d) { html += '<div class="cal-dayname">' + d + '</div>'; });
  let cell = 0;
  const totalCells = firstDay + daysInMonth;
  const rows = Math.ceil(totalCells / 7);
  let day = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < 7; c++) {
      const idx = r * 7 + c;
      if (idx < firstDay || day > daysInMonth) {
        html += '<div class="cal-cell other-month"></div>';
      } else {
        const evs = byDate[day] || [];
        let evHtml = '<div class="num">' + day + '</div>';
        evs.forEach(function (e) {
          evHtml += '<div class="cal-event" title="' + escaparHTML(e.nombre) + '">' + escaparHTML(e.nombre) + '</div>';
        });
        html += '<div class="cal-cell">' + evHtml + '</div>';
        day++;
      }
    }
  }
  html += '</div></div>';
  // list upcoming below
  html += '<h4 style="margin-top:12px;color:#1F3864">Próximas actividades</h4>';
  const prox = window.Storage.actividadesProximas(14);
  if (!prox.length) html += '<div class="empty-state"><div class="icon">📅</div>Sin actividades próximas</div>';
  else {
    prox.forEach(function (a) {
      html += '<div class="list-item"><div class="title">' + escaparHTML(a.nombre) + '</div><div class="meta">' + window.Utils.formatFecha(a.fecha) + ' · ' + escaparHTML(a.horaInicio) + '–' + escaparHTML(a.horaFin) + ' · ' + escaparHTML(a.responsable) + ' · ' + escaparHTML(a.estado) + '</div></div>';
    });
  }
  cont.innerHTML = html;
}

function abrirCrearActividad() {
  resetActForm();
  document.getElementById('act-form-modo').value = 'crear';
  document.getElementById('act-form-codigo').disabled = false;
  document.getElementById('modal-actividad-titulo').textContent = 'Programar actividad';
  abrirModal('modal-actividad');
}
function editarActividad(codigo) {
  const a = window.Storage.obtenerActividades().find(function (x){ return x.codigo === codigo; });
  if (!a) return;
  resetActForm();
  document.getElementById('act-form-modo').value = 'editar:' + codigo;
  document.getElementById('act-form-codigo').value = a.codigo; document.getElementById('act-form-codigo').disabled = true;
  document.getElementById('act-form-nombre').value = a.nombre;
  document.getElementById('act-form-categoria').value = a.categoria;
  document.getElementById('act-form-fecha').value = a.fecha;
  document.getElementById('act-form-inicio').value = a.horaInicio;
  document.getElementById('act-form-fin').value = a.horaFin;
  document.getElementById('act-form-responsable').value = a.responsable;
  document.getElementById('act-form-descripcion').value = a.descripcion;
  document.getElementById('act-form-capacidad').value = a.capacidad;
  document.getElementById('act-form-estado').value = a.estado;
  document.getElementById('modal-actividad-titulo').textContent = 'Editar actividad';
  abrirModal('modal-actividad');
}
function resetActForm() {
  ['act-form-modo','act-form-codigo','act-form-nombre','act-form-fecha','act-form-inicio','act-form-fin','act-form-responsable','act-form-descripcion','act-form-capacidad'].forEach(function (id){ const e=document.getElementById(id); if(e) e.value=''; });
  setVal('act-form-categoria', 'Talleres formativos');
  setVal('act-form-estado', 'Programada');
  const c = document.getElementById('act-form-codigo'); if (c) c.value = 'ACT-' + (window.Storage.obtenerActividades().length + 1).toString().padStart(4,'0');
}

function guardarActividad() {
  const modo = document.getElementById('act-form-modo').value;
  const codigo = document.getElementById('act-form-codigo').value.trim().toUpperCase();
  const nombre = document.getElementById('act-form-nombre').value.trim();
  const categoria = document.getElementById('act-form-categoria').value;
  const fecha = document.getElementById('act-form-fecha').value;
  const inicio = document.getElementById('act-form-inicio').value;
  const fin = document.getElementById('act-form-fin').value;
  const responsable = document.getElementById('act-form-responsable').value.trim();
  const descripcion = document.getElementById('act-form-descripcion').value.trim();
  const capacidad = document.getElementById('act-form-capacidad').value;
  const estado = document.getElementById('act-form-estado').value;

  if (!codigo || !nombre || !fecha || !inicio || !fin) { notificar('Complete los campos obligatorios', 'warning'); return; }
  if (!window.Validation.horaPosterior(inicio, fin)) { notificar('La hora de finalización debe ser posterior', 'warning'); return; }
  const acts = window.Storage.obtenerActividades();
  if (modo === 'crear') {
    if (acts.find(function (x){ return x.codigo === codigo; })) { notificar('Código duplicado', 'warning'); return; }
    acts.push({ codigo, nombre, categoria, fecha, horaInicio: inicio, horaFin: fin, responsable, descripcion, capacidad: capacidad || null, estado });
  } else {
    const editCode = modo.split(':')[1];
    const a = acts.find(function (x){ return x.codigo === editCode; });
    if (!a) { notificar('No encontrada', 'error'); return; }
    Object.assign(a, { nombre, categoria, fecha, horaInicio: inicio, horaFin: fin, responsable, descripcion, capacidad: capacidad || null, estado });
  }
  window.Storage.guardarDatos();
  notificar('Actividad guardada', 'success');
  cerrarModal('modal-actividad');
  renderActividades();
  if (typeof Dashboard !== 'undefined') Dashboard.render();
}

function cancelarActividad(codigo) {
  if (!confirm('¿Anular/cancelar esta actividad?')) return;
  const a = window.Storage.obtenerActividades().find(function (x){ return x.codigo === codigo; });
  if (!a) return;
  a.estado = 'Cancelada';
  window.Storage.guardarDatos();
  notificar('Actividad cancelada', 'info');
  renderActividades();
}

function cambiarVistaActividades(v) {
  ActividadesState.vista = v;
  document.querySelectorAll('.act-view-btn').forEach(function (b) {
    b.classList.toggle('active', b.getAttribute('data-view') === v);
  });
  renderActividades();
}

window.Actividades = {
  render: renderActividades,
  crear: abrirCrearActividad,
  editar: editarActividad,
  guardar: guardarActividad,
  cancelar: cancelarActividad,
  cambiarVista: cambiarVistaActividades,
  mesAnterior: function(){ ActividadesState.mesOffset--; renderActividades(); },
  mesSiguiente: function(){ ActividadesState.mesOffset++; renderActividades(); }
};
