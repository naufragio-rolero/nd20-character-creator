/* Contrato de datos para criaturas creadas por usuarios de Naufragio d20.
 * Fase 1: sin bestiario, parser de fichas, tiradas ni automatización de combate. */
(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.NaufragioCriaturas = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  var VERSION = 1;
  var CONECTORES = ['Inicio', 'y', 'o', ','];
  var PUNTUACIONES = ['nivel', 'moral', 'salud', 'blindaje', 'movimiento', 'tamano'];

  function texto(v) { return typeof v === 'string' ? v : ''; }
  function opcional(v) { return v === undefined ? null : v; }
  function ataque(d) {
    d = d || {};
    return {
      id: texto(d.id),
      conectorAnterior: d.conectorAnterior === undefined ? 'Inicio' : d.conectorAnterior,
      cantidad: d.cantidad === undefined ? 1 : d.cantidad,
      nombre: texto(d.nombre),
      danoLiteral: texto(d.danoLiteral),
      danoNumerico: opcional(d.danoNumerico),
      notas: texto(d.notas),
      segmentoOriginal: texto(d.segmentoOriginal),
      talentoRelacionado: opcional(d.talentoRelacionado)
    };
  }
  function talento(d) {
    d = d || {};
    return {
      nombre: texto(d.nombre),
      descripcion: texto(d.descripcion),
      textoOriginal: texto(d.textoOriginal),
      referencia: opcional(d.referencia)
    };
  }
  function nuevaCriatura(d) {
    d = d || {};
    var puntuaciones = {};
    PUNTUACIONES.forEach(function (k) {
      puntuaciones[k] = opcional(d.puntuaciones && d.puntuaciones[k]);
    });
    return {
      version: VERSION,
      sistema: 'nd20',
      tipo: 'criatura_usuario',
      nombre: texto(d.nombre),
      categoria: texto(d.categoria),
      subcategoria: texto(d.subcategoria),
      subtipo: texto(d.subtipo),
      puntuaciones: puntuaciones,
      ataques: Array.isArray(d.ataques) ? d.ataques.map(ataque) : [],
      talentos: Array.isArray(d.talentos) ? d.talentos.map(talento) : [],
      descripcion: texto(d.descripcion),
      notas: texto(d.notas),
      camposNoInterpretados: Array.isArray(d.camposNoInterpretados) ?
        d.camposNoInterpretados.slice() : [],
      origen: {
        tipo: texto(d.origen && d.origen.tipo) || 'usuario',
        textoOriginal: texto(d.origen && d.origen.textoOriginal)
      }
    };
  }
  function revisar(c, opciones) {
    opciones = opciones || {};
    var errores = [], advertencias = [];
    function error(campo, mensaje) { errores.push({campo:campo, mensaje:mensaje}); }
    function aviso(campo, codigo, mensaje) {
      advertencias.push({campo:campo, codigo:codigo, mensaje:mensaje});
    }
    if (!c || typeof c !== 'object' || Array.isArray(c)) {
      error('', 'La criatura debe ser un objeto.');
      return {valida:false, errores:errores, advertencias:advertencias};
    }
    if (c.version !== VERSION) error('version', 'Versión de ficha desconocida.');
    if (c.sistema !== 'nd20') error('sistema', 'Sistema no admitido.');
    if (c.tipo !== 'criatura_usuario') error('tipo', 'Solo criaturas creadas por usuarios.');
    ['nombre','categoria','subcategoria','subtipo','descripcion','notas'].forEach(function (k) {
      if (typeof c[k] !== 'string') error(k, 'Debe ser texto.');
    });
    if (opciones.paraExportar && !texto(c.nombre).trim())
      error('nombre', 'La criatura necesita un nombre para exportarse.');

    if (!c.puntuaciones || typeof c.puntuaciones !== 'object' ||
        Array.isArray(c.puntuaciones)) {
      error('puntuaciones', 'Faltan las puntuaciones.');
    } else {
      PUNTUACIONES.forEach(function (k) {
        var v = c.puntuaciones[k];
        if (v !== null && v !== undefined && (!Number.isInteger(v) || v < 0))
          error('puntuaciones.' + k, 'Debe ser un entero no negativo o quedar sin indicar.');
      });
    }

    if (!Array.isArray(c.ataques)) error('ataques', 'Debe ser un array.');
    else {
      var tieneY = false, tieneO = false;
      c.ataques.forEach(function (a, i) {
        var p = 'ataques[' + i + ']';
        if (!a || typeof a !== 'object' || Array.isArray(a)) {
          error(p, 'El ataque debe ser un objeto.');
          return;
        }
        if (CONECTORES.indexOf(a.conectorAnterior) === -1)
          error(p + '.conectorAnterior', 'Conector desconocido.');
        if ((i === 0 && a.conectorAnterior !== 'Inicio') ||
            (i > 0 && a.conectorAnterior === 'Inicio'))
          error(p + '.conectorAnterior', 'Inicio solo es válido para el primer ataque.');
        if (a.conectorAnterior === 'y') tieneY = true;
        if (a.conectorAnterior === 'o') tieneO = true;
        if (a.conectorAnterior === ',')
          aviso(p + '.conectorAnterior', 'coma_por_revisar',
            'La coma no permite determinar la agrupación sin revisión.');
        if (!Number.isInteger(a.cantidad) || a.cantidad < 1)
          error(p + '.cantidad', 'La cantidad debe ser un entero positivo.');
        ['id','nombre','danoLiteral','notas','segmentoOriginal'].forEach(function (k) {
          if (typeof a[k] !== 'string') error(p + '.' + k, 'Debe ser texto.');
        });
        if (a.danoNumerico !== null && a.danoNumerico !== undefined &&
            (!Number.isInteger(a.danoNumerico) || a.danoNumerico < 0))
          error(p + '.danoNumerico', 'Debe ser un entero no negativo o nulo.');
        if (a.talentoRelacionado != null && typeof a.talentoRelacionado !== 'string')
          error(p + '.talentoRelacionado', 'Debe ser texto o nulo.');
        if (typeof a.danoLiteral === 'string') {
          if (/\bo\s+especial\b/i.test(a.danoLiteral))
            aviso(p + '.danoLiteral', 'dano_alternativo',
              'Hay dos modalidades literales de daño: conservar y revisar.');
          else if (a.danoNumerico == null)
            aviso(p + '.danoLiteral', 'dano_no_numerico',
              'No se asigna daño numérico cuando la fuente no lo indica.');
        }
      });
      if (tieneY && tieneO)
        aviso('ataques', 'agrupacion_por_revisar',
          'La mezcla de y/o requiere revisar la agrupación original.');
    }
    if (!Array.isArray(c.talentos)) error('talentos', 'Debe ser un array.');
    else c.talentos.forEach(function (t, i) {
      var p = 'talentos[' + i + ']';
      if (!t || typeof t !== 'object' || Array.isArray(t)) {
        error(p, 'Debe ser un objeto.');
        return;
      }
      ['nombre','descripcion','textoOriginal'].forEach(function (k) {
        if (typeof t[k] !== 'string') error(p + '.' + k, 'Debe ser texto.');
      });
      if (t.referencia != null && typeof t.referencia !== 'string')
        error(p + '.referencia', 'Debe ser texto o nulo.');
    });
    if (!Array.isArray(c.camposNoInterpretados) ||
        c.camposNoInterpretados.some(function (x) {return typeof x !== 'string';}))
      error('camposNoInterpretados', 'Deben conservarse como textos.');
    else if (c.camposNoInterpretados.length)
      aviso('camposNoInterpretados', 'contenido_pendiente',
        'Hay campos sin interpretar que necesitan revisión.');
    if (!c.origen || typeof c.origen.tipo !== 'string' ||
        typeof c.origen.textoOriginal !== 'string')
      error('origen', 'Hay que conservar la procedencia y el original.');
    return {valida:errores.length === 0, errores:errores, advertencias:advertencias};
  }
  return {VERSION:VERSION, CONECTORES:CONECTORES.slice(),
    PUNTUACIONES:PUNTUACIONES.slice(), nuevaCriatura:nuevaCriatura,
    ataque:ataque, talento:talento, revisar:revisar};
});
