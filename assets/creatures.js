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
  // Nombres documentados del DRS. La lista es cerrada en la creación.
  var CATEGORIAS = ['Aberrante','Alimaña','Autómata','Bestia','Celestial',
    'Demonio','Dragón','Elemental','Fata','Gigante','Humanoide',
    'Monstruo','Muerto viviente','Limo','Reptil','Vegetal'];
  function saludMedia(nivel,ajuste) {
    if (!Number.isSafeInteger(nivel) || nivel < 0 || nivel > 100 ||
        !Number.isSafeInteger(ajuste))
      throw Error('Nivel o ajuste de Salud no válidos.');
    return (nivel * 4) + (ajuste * 4);
  }
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
  function normalizarFuenteDRS(registro) {
    var copia=JSON.parse(JSON.stringify(registro));
    var ficha=copia&&copia.ficha||copia;
    if(ficha&&ficha.origen&&ficha.origen.tipo==='drs_oficial' &&
       ficha.puntuaciones&&Number.isSafeInteger(ficha.puntuaciones.blindaje)&&
       ficha.puntuaciones.blindaje<0){
      ficha.saludAjuste=ficha.puntuaciones.blindaje;
      ficha.puntuaciones.blindaje=null;
      ficha.saludModo='manual';
    }
    return copia;
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
      // Opcionales dentro del JSON v1: los JSON antiguos mantienen su Salud literal.
      saludModo: d.saludModo === 'automatico' || d.saludModo === 'manual' ?
        d.saludModo : puntuaciones.salud == null ? 'automatico' : 'manual',
      saludAjuste: Number.isSafeInteger(d.saludAjuste) ? d.saludAjuste : 0,
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
    // Un JSON de versión 1 con propiedades desconocidas no puede editarse
    // sin perderlas: rechazarlo explícitamente antes de incorporarlo.
    function comprobarCampos(objeto, admitidos, prefijo) {
      if (!objeto || typeof objeto !== 'object' || Array.isArray(objeto)) return;
      Object.keys(objeto).forEach(function (clave) {
        if (admitidos.indexOf(clave) === -1)
          error(prefijo ? prefijo + '.' + clave : clave,
            'Campo JSON desconocido en la versión 1; no se ha descartado.');
      });
    }
    if (!c || typeof c !== 'object' || Array.isArray(c)) {
      error('', 'La criatura debe ser un objeto.');
      return {valida:false, errores:errores, advertencias:advertencias};
    }
    if (c.version !== VERSION) error('version', 'Versión de ficha desconocida.');
    if (c.sistema !== 'nd20') error('sistema', 'Sistema no admitido.');
    if (c.tipo !== 'criatura_usuario') error('tipo', 'Solo criaturas creadas por usuarios.');
    comprobarCampos(c, ['version','sistema','tipo','nombre','categoria',
      'subcategoria','subtipo','puntuaciones','ataques','talentos',
      'descripcion','notas','camposNoInterpretados','origen',
      'saludModo','saludAjuste'], '');
    if (c.saludModo !== undefined &&
        c.saludModo !== 'automatico' && c.saludModo !== 'manual')
      error('saludModo', 'Modo de Salud no admitido.');
    if (c.saludAjuste !== undefined && !Number.isSafeInteger(c.saludAjuste))
      error('saludAjuste', 'El ajuste de Salud debe ser un entero (puede ser negativo).');
    if (c.puntuaciones && Number.isSafeInteger(c.puntuaciones.nivel) &&
        c.puntuaciones.nivel > 100)
      error('puntuaciones.nivel', 'El límite documentado para adversarios es Nivel 100.');
    ['nombre','categoria','subcategoria','subtipo','descripcion','notas'].forEach(function (k) {
      if (typeof c[k] !== 'string') error(k, 'Debe ser texto.');
    });
    if (opciones.paraExportar && !texto(c.nombre).trim())
      error('nombre', 'La criatura necesita un nombre para exportarse.');

    if (!c.puntuaciones || typeof c.puntuaciones !== 'object' ||
        Array.isArray(c.puntuaciones)) {
      error('puntuaciones', 'Faltan las puntuaciones.');
    } else {
      comprobarCampos(c.puntuaciones, PUNTUACIONES, 'puntuaciones');
      PUNTUACIONES.forEach(function (k) {
        var v = c.puntuaciones[k];
        if (v !== null && v !== undefined && (!Number.isSafeInteger(v) || v < 0))
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
        comprobarCampos(a, ['id','conectorAnterior','cantidad','nombre',
          'danoLiteral','danoNumerico','notas','segmentoOriginal',
          'talentoRelacionado'], p);
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
        if (!Number.isSafeInteger(a.cantidad) || a.cantidad < 1)
          error(p + '.cantidad', 'La cantidad debe ser un entero positivo.');
        ['id','nombre','danoLiteral','notas','segmentoOriginal'].forEach(function (k) {
          if (typeof a[k] !== 'string') error(p + '.' + k, 'Debe ser texto.');
        });
        if (a.danoNumerico !== null && a.danoNumerico !== undefined &&
            (!Number.isSafeInteger(a.danoNumerico) || a.danoNumerico < 0))
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
      comprobarCampos(t, ['nombre','descripcion','textoOriginal','referencia'], p);
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
    comprobarCampos(c.origen, ['tipo','textoOriginal'], 'origen');
    if (!c.origen || typeof c.origen.tipo !== 'string' ||
        typeof c.origen.textoOriginal !== 'string')
      error('origen', 'Hay que conservar la procedencia y el original.');
    return {valida:errores.length === 0, errores:errores, advertencias:advertencias};
  }
  return {VERSION:VERSION, CONECTORES:CONECTORES.slice(),
    CATEGORIAS:CATEGORIAS.slice(),saludMedia:saludMedia,
    normalizarFuenteDRS:normalizarFuenteDRS,
    PUNTUACIONES:PUNTUACIONES.slice(), nuevaCriatura:nuevaCriatura,
    ataque:ataque, talento:talento, revisar:revisar};
});
