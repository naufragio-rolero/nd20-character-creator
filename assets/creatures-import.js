/* Importador conservador de criaturas Nd20 a partir de texto pegado.
 * No incluye bestiario ni ejecuta acciones de combate. */
(function (root, factory) {
  var api = factory(typeof module !== 'undefined' && module.exports ?
    require('./creatures.js') : root.NaufragioCriaturas);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.NaufragioImportadorCriaturas = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (modelo) {
  'use strict';
  if (!modelo) throw Error('Falta el contrato de datos de criaturas.');

  function limpiar(linea) {
    return linea.replace(/\u00a0/g, ' ').trim()
      .replace(/^#{1,6}\s+/, '').replace(/^\*\*(.*?)\*\*$/, '$1').trim();
  }
  function advertir(lista, linea, codigo, mensaje) {
    lista.push({linea:linea, codigo:codigo, mensaje:mensaje});
  }
  function puntuacion(linea, clave) {
    var patron = new RegExp('(?:^|\\b)' + clave + '\\s*:?\\s*(\\d+)\\b', 'i');
    var coincidencia = linea.match(patron);
    return coincidencia ? Number(coincidencia[1]) : null;
  }
  function leerPuntuaciones(linea, ficha) {
    var encontro = false;
    var campos = [['nivel','Nivel'], ['moral','Moral'], ['salud','Salud'],
      ['blindaje','Blindaje'], ['movimiento','Movimiento'], ['tamano','Tamaño']];
    campos.forEach(function (par) {
      var valor = puntuacion(linea, par[1]);
      if (valor !== null) {
        ficha.puntuaciones[par[0]] = valor;
        encontro = true;
      }
    });
    return encontro;
  }
  function separarAtaques(literal) {
    var trozos = [], conector = 'Inicio', inicio = 0, profundidad = 0;
    var irregular = false;
    for (var i = 0; i < literal.length; i++) {
      var caracter = literal[i];
      if (caracter === '(') profundidad++;
      else if (caracter === ')') {
        profundidad--;
        if (profundidad < 0) { irregular = true; profundidad = 0; }
      }
      if (profundidad) continue;
      var conexion = null, fin = i + 1;
      if (caracter === ',' && (i === literal.length - 1 || /\s/.test(literal[i+1])))
        conexion = ',';
      else if (/\s/.test(caracter)) {
        var resto = literal.slice(i).match(/^\s+(y|o)\s+/i);
        if (resto) { conexion = resto[1].toLowerCase(); fin = i + resto[0].length; }
      }
      if (!conexion) continue;
      var pieza = literal.slice(inicio, i).trim();
      if (pieza) trozos.push({conectorAnterior:conector, literal:pieza});
      else irregular = true;
      conector = conexion;
      inicio = fin;
      i = fin - 1;
    }
    var ultima = literal.slice(inicio).trim();
    if (ultima) trozos.push({conectorAnterior:conector, literal:ultima});
    else irregular = true;
    if (profundidad) irregular = true;
    return {trozos:trozos, irregular:irregular};
  }
  function leerAtaques(literal, advertencias, numeroLinea) {
    var resultado = separarAtaques(literal);
    if (resultado.irregular)
      advertir(advertencias, numeroLinea, 'ataques_incompletos',
        'Los paréntesis o conectores de la línea de ataques necesitan revisión.');
    return resultado.trozos.map(function (pieza, indice) {
      var base = pieza.literal, cantidad = 1, nombre = base, dano = '';
      var partes = base.match(/^(.*?)\s*\(([^()]*)\)\s*$/);
      if (partes) { nombre = partes[1].trim(); dano = partes[2].trim(); }
      else if (base.includes('(') || base.includes(')'))
        advertir(advertencias, numeroLinea, 'segmento_complejo',
          'Un segmento contiene paréntesis que no se han interpretado.');
      var cantidadLiteral = nombre.match(/^(\d+)\s+(.+)$/);
      if (cantidadLiteral) {
        cantidad = Number(cantidadLiteral[1]); nombre = cantidadLiteral[2].trim();
      }
      if (!nombre || !Number.isSafeInteger(cantidad) || cantidad < 1) {
        advertir(advertencias, numeroLinea, 'ataque_pendiente',
          'Un ataque no ha podido descomponerse con seguridad.');
        nombre = base; cantidad = 1;
      }
      var numerico = null, exacto = dano.match(/^\d+$/);
      var alternativo = dano.match(/^(\d+)\s+o\s+especial$/i);
      if (exacto) numerico = Number(dano);
      else if (alternativo) numerico = Number(alternativo[1]);
      if (numerico !== null && !Number.isSafeInteger(numerico)) numerico = null;
      if (dano && numerico === null)
        advertir(advertencias, numeroLinea, 'dano_no_numerico',
          'Se conserva literalmente un daño sin valor numérico inequívoco.');
      return modelo.ataque({
        id:'ataque-' + (indice + 1),
        conectorAnterior:pieza.conectorAnterior,
        cantidad:cantidad,
        nombre:nombre,
        danoLiteral:dano,
        danoNumerico:numerico,
        segmentoOriginal:base
      });
    });
  }
  function extraerTexto(origen) {
    if (typeof origen !== 'string' || !origen.trim())
      throw Error('Pega el texto de una criatura antes de importarla.');
    if (origen.length > 120000)
      throw Error('El texto pegado es demasiado largo para una sola criatura.');
    return origen;
  }
  function descomponerTexto(origen) {
    var original = extraerTexto(origen);
    var lineas = original.split(/\r\n|\n|\r/);
    var limpias = lineas.map(limpiar);
    var advertencias = [];
    var ficha = modelo.nuevaCriatura({origen:{tipo:'texto_pegado', textoOriginal:original}});
    var primerIndice = limpias.findIndex(function (x) { return !!x; });
    var primera = limpias[primerIndice] || '';
    var nombreEtiquetado = primera.match(/^(?:Criatura|Nombre)\s*:\s*(.+)$/i);
    ficha.nombre = (nombreEtiquetado ? nombreEtiquetado[1] : primera).trim();
    var zona = 'inicial', huboEstadisticas = false, huboAtaques = false;
    var ultimaHabilidad = -1, descripcion = [];
    var seccion = '';
    for (var i = primerIndice + 1; i < lineas.length; i++) {
      var linea = limpias[i];
      if (!linea) continue;
      var lineaNum = i + 1;
      if (/^Estad[ií]sticas\s*:?$/i.test(linea)) {
        zona = 'estadisticas'; seccion = 'estadisticas';
        continue;
      }
      if (/^Habilidades especiales\s*:?$/i.test(linea) ||
          /^Talentos\s*:?$/i.test(linea)) {
        zona = 'estadisticas'; seccion = 'habilidades';
        continue;
      }
      if (/^Descripci[oó]n\s*:?$/i.test(linea)) {
        zona = 'descripcion'; seccion = 'descripcion';
        continue;
      }
      if (/^Or[ií]genes\s*:?$/i.test(linea) ||
          /^Historia\s*:?$/i.test(linea)) {
        zona = 'descripcion'; seccion = 'origenes';
        continue;
      }
      if (/^Etimolog[ií]a\s*:?$/i.test(linea) ||
          /^Mejoras de Nivel\s*:?$/i.test(linea)) {
        zona = 'metadata'; seccion = linea;
        ficha.camposNoInterpretados.push(lineas[i]);
        continue;
      }
      if (zona === 'metadata') {
        ficha.camposNoInterpretados.push(lineas[i]);
        continue;
      }
      var lineaAtaques = linea.match(/^Ataques?\s*:\s*(.*)$/i);
      if (lineaAtaques) {
        huboAtaques = true; huboEstadisticas = true;
        zona = 'estadisticas'; seccion = 'ataques';
        if (lineaAtaques[1].trim()) {
          var nuevos = leerAtaques(lineaAtaques[1], advertencias, lineaNum);
          nuevos.forEach(function (a) {
            a.id = 'ataque-' + (ficha.ataques.length + 1);
            if (ficha.ataques.length && a.conectorAnterior === 'Inicio') {
              advertir(advertencias, lineaNum, 'segunda_linea_ataques',
                'Más de una línea de ataques: revisar su relación.');
              a.conectorAnterior = ',';
            }
            ficha.ataques.push(a);
          });
        } else {
          ficha.camposNoInterpretados.push(lineas[i]);
          advertir(advertencias, lineaNum, 'ataques_vacios',
            'La cabecera de ataques no contiene opciones.');
        }
        continue;
      }
      var talentosEnLinea = linea.match(/^(?:Talentos|Habilidades especiales)\s*:\s*(.+)$/i);
      if (talentosEnLinea) {
        ficha.camposNoInterpretados.push(lineas[i]);
        advertir(advertencias, lineaNum, 'talentos_en_linea',
          'Revisar la lista de Talentos antes de asignar nombres o efectos.');
        continue;
      }
      var notasEnLinea = linea.match(/^(?:Notas|Observaciones)\s*:\s*(.+)$/i);
      if (notasEnLinea) {
        ficha.notas += (ficha.notas ? '\n' : '') + notasEnLinea[1];
        continue;
      }
      var descripcionEtiquetada = linea.match(/^Descripci[oó]n\s*:\s*(.+)$/i);
      if (descripcionEtiquetada) {
        zona = 'descripcion'; seccion = 'descripcion';
        descripcion.push(descripcionEtiquetada[1]);
        continue;
      }
      var categoriaEtiquetada = linea.match(/^Categor[ií]a\s*:\s*(.+)$/i);
      if (categoriaEtiquetada && !huboAtaques) {
        ficha.categoria = categoriaEtiquetada[1].trim();
        continue;
      }
      var reglaCabecera = /^(.+?)\s+de\s+Nivel\b/i.exec(linea);
      if (reglaCabecera && !huboAtaques) {
        ficha.categoria = reglaCabecera[1].trim();
        leerPuntuaciones(linea, ficha);
        huboEstadisticas = true; zona = 'estadisticas'; seccion = 'puntuaciones';
        continue;
      }
      var soloPuntuaciones = /^(?:Nivel|Salud|Moral|Movimiento|Blindaje|Tama[ñn]o)\s*:?\s*\d+\b/i.test(linea);
      if (soloPuntuaciones && (!huboAtaques || /^(?:Salud|Movimiento|Blindaje|Moral|Tama[ñn]o)\s*:?\s*\d+\s*$/i.test(linea))) {
        leerPuntuaciones(linea, ficha);
        huboEstadisticas = true;
        zona = 'estadisticas'; seccion = 'puntuaciones';
        continue;
      }
      var categoriaConTamano = /^(.+?)\s+(Diminuto|Pequeño|Mediano|Grande|Enorme|Gigantesco)\s+\((\d+)\)$/i.exec(linea);
      if (!huboAtaques && categoriaConTamano) {
        ficha.categoria = linea;
        ficha.puntuaciones.tamano = Number(categoriaConTamano[3]);
        advertir(advertencias, lineaNum, 'categoria_compuesta',
          'Categoría y tamaño se conservan literalmente; revisar su clasificación.');
        huboEstadisticas = true; zona = 'estadisticas'; seccion = 'categoria';
        continue;
      }
      if (zona === 'estadisticas' && (huboAtaques || seccion === 'habilidades')) {
        var habilidad = linea.match(/^([^:]{2,90}):\s*(.+)$/);
        if (habilidad) {
          ficha.talentos.push(modelo.talento({
            nombre:habilidad[1].trim(),
            descripcion:habilidad[2].trim(),
            textoOriginal:lineas[i]
          }));
          ultimaHabilidad = i;
          seccion = 'habilidades';
          continue;
        }
        if (ultimaHabilidad === i - 1 && /^(?:Si|Cuando|Adem[aá]s|Mientras|En caso de)\b/i.test(linea)) {
          ficha.camposNoInterpretados.push(lineas[i]);
          advertir(advertencias, lineaNum, 'continuacion_dudosa',
            'Este párrafo podría continuar una habilidad especial: revisarlo.');
          ultimaHabilidad = -1;
          continue;
        }
      }
      if (!huboEstadisticas && zona === 'inicial' &&
          /^([A-ZÁÉÍÓÚ][^.:]{2,75})$/.test(linea) &&
          i + 1 < lineas.length &&
          /^(?:Nivel\s*:?\s*\d+)/i.test(limpias[i+1])) {
        ficha.categoria = linea;
        zona = 'estadisticas';
        continue;
      }
      if (seccion === 'habilidades' && !huboAtaques) {
        ficha.camposNoInterpretados.push(lineas[i]);
        advertir(advertencias, lineaNum, 'habilidad_no_etiquetada',
          'No se puede separar nombre y descripción de esta habilidad.');
        continue;
      }
      if (/^(?:Inspiraci[oó]n|Fuente|Referencia)\s*:/i.test(linea)) {
        ficha.camposNoInterpretados.push(lineas[i]);
        continue;
      }
      zona = 'descripcion';
      seccion = 'descripcion';
      descripcion.push(linea);
    }
    ficha.descripcion = descripcion.join('\n').trim();
    if (!huboEstadisticas)
      advertir(advertencias, null, 'sin_puntuaciones',
        'No se ha reconocido una cabecera de estadísticas.');
    if (!huboAtaques)
      advertir(advertencias, null, 'sin_ataques',
        'No se ha encontrado una línea «Ataques:».');
    if (ficha.camposNoInterpretados.length)
      advertir(advertencias, null, 'fragmentos_pendientes',
        'Hay fragmentos preservados que no se han clasificado.');
    var revision = modelo.revisar(ficha);
    return {
      criatura:ficha,
      valida:revision.valida,
      errores:revision.errores,
      advertencias:advertencias.concat(revision.advertencias),
      detectado:{
        nombre:!!ficha.nombre,
        categoria:!!ficha.categoria,
        puntuaciones:Object.keys(ficha.puntuaciones).filter(function (k) {
          return ficha.puntuaciones[k] !== null;
        }),
        ataques:ficha.ataques.length,
        talentos:ficha.talentos.length,
        descripcion:!!ficha.descripcion,
        pendientes:ficha.camposNoInterpretados.length
      }
    };
  }
  return {
    descomponerTexto:descomponerTexto,
    separarAtaques:separarAtaques,
    leerAtaques:leerAtaques
  };
});
