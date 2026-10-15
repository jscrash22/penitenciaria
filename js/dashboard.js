function renderDashboard() {
  const stats = window.Storage.contarPorEstadoAdolescentes();
  const indicadores = [
    { label: 'Total adolescentes', value: stats.total, hint: 'Registros demostracion' },
    { label: 'Bajo custodia', value: stats.custodia, hint: 'Situacion actual' },
    { label: 'Ingresos recientes', value: stats.recientes, hint: 'Ultimos 30 dias' },
    { label: 'Egresos registrados', value: stats.egresos, hint: 'Situacion egreso' },
    { label: 'Seguimientos pendientes', value: stats.pendientes, hint: 'Por completar' },
    { label: 'Actividades proximas', value: window.Storage.actividadesProximas(7).length, hint: 'Proximos 7 dias' },
    { label: 'Registros en revision', value: stats.revision, hint: 'Estado en revision' },
    { label: 'Movimientos totales', value: window.Storage.obtenerMovimientosTotales(), hint: 'Historial' }
  ];
  const cont = document.getElementById('dash-indicadores');
  if (cont) {
    cont.innerHTML = indicadores.map(function (i) {
      return '<div class="card"><div class="card-label">' + escaparHTML(i.label) + '</div><div class="card-value">' + i.value + '</div><div class="card-hint">' + escaparHTML(i.hint) + '</div></div>';
    }).join('');
  }

  const tbl = document.getElementById('dash-ingresos');
  if (tbl) {
    const recientes = window.Storage.obtenerAdolescentes()
      .slice().sort(function (a, b) { return new Date(b.fechaIngreso) - new Date(a.fechaIngreso); }).slice(0, 6);
    if (!recientes.length) { tbl.innerHTML = '<tr><td colspan="5"><div class="empty-state"><div class="icon">📋</div>Sin ingresos registrados</div></td></tr>'; }
    else {
      tbl.innerHTML = recientes.map(function (a) {
        return '<tr>' +
          '<td>' + escaparHTML(a.codigo) + '</td>' +
          '<td>' + escaparHTML(a.nombreFicticio) + '</td>' +
          '<td>' + escaparHTML(window.Utils.formatFecha(a.fechaIngreso)) + '</td>' +
          '<td><span class="badge ' + estadoBadge(a.estado) + '">' + escaparHTML(a.estado) + '</span></td>' +
          '<td>' + escaparHTML(a.situacionActual) + '</td>' +
        '</tr>';
      }).join('');
    }
  }

  const act = document.getElementById('dash-actividades');
  if (act) {
    const prox = window.Storage.actividadesProximas(7);
    if (!prox.length) { act.innerHTML = '<div class="empty-state"><div class="icon">📅</div>Sin actividades proximas</div>'; }
    else {
      act.innerHTML = prox.map(function (a) {
        return '<div class="list-item"><div class="title">' + escaparHTML(a.nombre) + '</div><div class="meta">' + escaparHTML(window.Utils.formatFecha(a.fecha)) + ' · ' + escaparHTML(a.horaInicio) + '–' + escaparHTML(a.horaFin) + ' · ' + escaparHTML(a.responsable) + '</div></div>';
      }).join('');
    }
  }
}

function estadoBadge(estado) {
  const e = (estado || '').toLowerCase();
  if (e === 'activo') return 'activo';
  if (e === 'archivado') return 'archivado';
  if (e === 'en revision') return 'revision';
  return '';
}

window.Dashboard = { render: renderDashboard };