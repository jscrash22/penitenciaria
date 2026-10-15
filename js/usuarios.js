window.Usuarios = (function () {
  function render() {
    const cont = document.getElementById('usuarios-contenido');
    if (!cont) return;
    const usuarios = window.Storage.obtenerUsuarios();
    const sel = document.getElementById('usuario-actual-select');
    if (sel) {
      const cur = (window.Storage.obtenerUsuarioActual() || {}).id;
      sel.innerHTML = usuarios.map(function (u){ return '<option value="' + u.id + '"' + (u.id === cur ? ' selected' : '') + '>' + escaparHTML(u.nombre) + ' — ' + escaparHTML(u.rol) + '</option>'; }).join('');
    }
    const permisos = ['gestionar_usuarios','ver_estadisticas','importar_exportar','configuracion','ver_juridico','registrar_referencias','ver_movimientos','registrar_seguimiento','consultar_datos_funcion','registrar_actividad','gestionar_registros','registrar_movimientos'];
    let html = '<div class="section-block"><div class="section-header"><h3>Matriz de permisos (simulación visual)</h3></div><div class="table-wrap"><table class="perm-matrix"><thead><tr><th>Rol / Permiso</th>';
    permisos.forEach(function (p){ html += '<th>' + escaparHTML(p.replace(/_/g,' ')) + '</th>'; });
    html += '</tr></thead><tbody>';
    const roles = {};
    usuarios.forEach(function (u){ if (!roles[u.rol]) roles[u.rol] = { rol: u.rol, perms: [] }; roles[u.rol].perms = roles[u.rol].perms.concat(u.permisos || []); });
    Object.keys(roles).forEach(function (r) {
      const rr = roles[r];
      html += '<tr><td class="role-name">' + escaparHTML(r) + '</td>';
      permisos.forEach(function (p) { html += '<td>' + (rr.perms.indexOf(p) !== -1 ? '✅' : '—') + '</td>'; });
      html += '</tr>';
    });
    html += '</tbody></table></div></div>';
    html += '<p style="font-size:12px;color:#6B7280;margin-top:8px;">Los roles son una simulación visual sin backend. El control de acceso real debe verificarse en backend y base de datos. No hay contraseñas reales.</p>';
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
function cambiarUsuarioActual(id) {
  if (window.Storage) window.Storage.establecerUsuarioActual(id);
  if (window.Usuarios) Usuarios.render();
  if (window.Dashboard) Dashboard.render();
}
