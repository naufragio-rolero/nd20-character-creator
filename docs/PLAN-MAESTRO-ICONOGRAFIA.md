# Forja — Plan maestro de iconografía propia

**Estado:** documento editorial de diseño. **No modifica reglas ni autoriza publicaciones.**

## 1. Objetivo

Sustituir progresivamente los **35 iconos** actuales de la Forja por una familia de pictogramas originales que priorice claridad a tamaños reducidos y una identidad visual consistente. Los SVG procedentes de Game-icons.net **siguen en producción como solución provisional** hasta que se apruebe y pruebe cada sustitución. No se retiran sus créditos mientras se sigan distribuyendo obras derivadas.

El documento define **qué representa cada icono**, qué relaciones visuales debe conservar y cómo se revisarán los nuevos diseños. Los significados de especies y recursos vienen del generador y no añaden capacidades ni reglas.

## 2. Especificaciones comunes

- **Archivo final:** SVG autónomo, transparente, monocromo, sin fuentes, imágenes incrustadas, scripts ni recursos externos.
- **Lienzo:** `viewBox="0 0 24 24"`, proporción 1:1, manteniendo el ID exacto `assets/icons/<id>.svg`.
- **Diseño efectivo:** reconocer la silueta a **16 px**; comprobar 16, 24 y 48 px, además de una ampliación para editar.
- **Contraste:** formas sólidas y espacios negativos suficientemente abiertos; evitar filigranas, rayados, ojos pequeños o efectos que desaparezcan.
- **Homogeneidad:** peso, escala, márgenes y lenguaje gráfico compartidos. La interfaz aplica el color por máscara CSS, por lo que el dibujo no depende de colores propios.
- **Uso:** iconos de Especies/Ocupaciones pueden tener mayor expresividad al mostrarse en selectores grandes; Equipo, Recursos y ajustes exigen máxima síntesis.
- **Accesibilidad:** los SVG son decorativos; los nombres y descripciones accesibles siguen en el HTML.
- **Pruebas:** además del SVG válido y la URL de máscara resuelta correctamente, revisar **legibilidad real**, no solamente la presencia del elemento o una respuesta HTTP 200.
- **Derechos:** registrar autoría y procedencia de cada sustitución. Si se conserva cualquier obra derivada de Game-icons.net, mantener el crédito CC BY 3.0 correspondiente.

## 3. Regla fundamental: especies organizadas por familias

**Las especies NO se ilustran como 8 retratos independientes.** Se diseña un sistema de **familias visuales** y se derivan sus miembros relacionados. Esto es un convenio de iconografía, no una nueva clasificación reglamentaria ni una afirmación adicional sobre el canon.

### 3.1. Familias matrices

| Matriz | ID de la Forja | Rasgos gráficos de reconocimiento |
|---|---|---|
| Humana | `esp-humano` | Rostro neutro, orejas redondeadas, mandíbula equilibrada |
| Élfica | `esp-elfo` | Dos orejas puntiagudas, cabeza más afinada |
| Orca | `esp-orco` | Mandíbula ancha y maciza, colmillos |
| Enana | `esp-enano` | Identidad propia, silueta compacta y barba simplificada |
| Mediana | `esp-mediano` | Identidad propia, diferenciada de humano y gnomo |
| Gnómica | `esp-gnomo` | Identidad propia, diferenciada del mediano |
| Goblin | **Reservada** | Icono propio futuro; **no asignar a semiorcos** ni añadir actualmente una especie al DRS |

Las tres matrices de desarrollo inicial son **humano, elfo y orco**. Enano, mediano y gnomo tienen diseños independientes, pero respetan el mismo lenguaje y medidas.

### 3.2. Mestizajes: composición de matrices, no iconos aislados

- **Semielfo = humano + elfo**. El icono `esp-semielfo` debe reutilizar la estructura humana con un rasgo élfico inequívoco (por ejemplo, una oreja redondeada y otra puntiaguda), sin añadir ornamentación.
- **Semiorco = humano + orco**. El icono `esp-semiorco` debe mantener la base humana y añadir una señal orca reconocible (mandíbula, colmillo o rasgo equivalente); **nunca** reutilizar la cabeza de goblin.
- **Otros mestizos futuros:** aplicar exactamente la misma lógica desde las dos matrices que correspondan. **No crear nuevas especies ni incorporarlas a la interfaz sin respaldo documental y decisión editorial.**
- **Proporción e identidad:** el híbrido debe identificarse con ambas familias sin ser una copia de una de ellas, ni un collage recargado. Las piezas compartidas se derivan de la misma geometría para que el parentesco sea evidente.

**Secuencia de diseño:** 1. Humano → 2. Elfo → 3. Orco → 4. Semielfo → 5. Semiorco. Los cuatro primeros tienen bocetos v1 en esta conversación; **ninguno está aprobado ni sustituye todavía a los iconos de LIVE**.

### 3.3. Criterios de rechazo

Descartar un diseño si el humano parece un monstruo, si el semielfo no conserva suficientes rasgos humanos, si el semiorco se confunde con un goblin, si los familiares parecen de colecciones gráficas distintas o si los detalles esenciales desaparecen a 16 px.

## 4. Inventario completo de los 35 identificadores

### Especies — 8
| ID | Especie que representa | Directriz |
|---|---|---|
| `esp-humano` | Humano común | Matriz humana neutra |
| `esp-elfo` | Elfo agreste | Matriz élfica |
| `esp-orco` | Orco común | Matriz orca |
| `esp-semielfo` | Semielfo | Derivado humano + elfo |
| `esp-semiorco` | Semiorco | Derivado humano + orco, nunca goblin |
| `esp-enano` | Enano montañés | Familia enana robusta |
| `esp-mediano` | Mediano amable | Familia mediana reconocible |
| `esp-gnomo` | Gnomo urbano | Familia gnómica diferenciada |

### Ocupaciones — 4
| ID | Representa | Concepto de silueta |
|---|---|---|
| `ocu-clerigo` | Clérigo | Devoción/autoridad espiritual |
| `ocu-guerrero` | Guerrero | Combate marcial |
| `ocu-mago` | Mago | Conocimiento arcano |
| `ocu-ladron` | Ladrón | Sigilo y precisión |

### Poderes — 2
| ID | Representa | Concepto de silueta |
|---|---|---|
| `ico-conjuro` | Conjuro | Manifestación mágica |
| `ico-tecnica` | Técnica | Habilidad/maniobra, distinta del conjuro |

### Recursos — 6
| ID | Representa | Concepto de silueta |
|---|---|---|
| `recurso-salud` | Salud | Vida/corazón |
| `recurso-esfuerzo` | Esfuerzo | Energía física aplicada |
| `recurso-movimiento` | Movimiento | Desplazamiento |
| `recurso-potencia` | Potencia | Intensidad/fuerza |
| `recurso-esencia` | Esencia | Reserva sobrenatural/interior |
| `recurso-blindaje` | Blindaje | Defensa/protección |

### Equipo — 11
| ID | Representa | Concepto de silueta |
|---|---|---|
| `equipo-espada` | Armas cuerpo a cuerpo | Hoja/arma de mano |
| `equipo-arco` | Armas a distancia | Arco/proyectil |
| `equipo-varita` | Varita | Canalizador mágico |
| `equipo-bolsa` | Bolsa / genérico | Contenedor pequeño; **evitar su repetición indiscriminada** |
| `equipo-caballo` | Monturas | Caballo |
| `equipo-mochila` | Mochila | Carga personal |
| `equipo-orbe` | Orbe | Esfera mística |
| `equipo-libro` | Libro | Libro/tomo |
| `equipo-armadura` | Armadura | Protección corporal |
| `equipo-escudo` | Escudo | Defensa activa |
| `equipo-municion` | Munición | Flechas/virotes/proyectiles |

**Importante:** la identificación del Equipo sigue correspondiendo al catálogo documentado. No deducir competencias, propiedades ni categorías nuevas a partir del icono. Un inventario saturado de bolsas idénticas puede mejorar mostrando menos iconos, no inventando tipos de objetos.

### Interfaz y sexo — 4
| ID | Representa | Concepto de silueta |
|---|---|---|
| `ico-configurar` | Configurar creación | Ajuste claro a 16 px |
| `sexo-masculino` | Masculino | Símbolo inequívoco |
| `sexo-femenino` | Femenino | Símbolo inequívoco |
| `sexo-indeterminado` | Indeterminado/no indicado | Neutralidad sin apariencia de error |

**Total: 8 + 4 + 2 + 6 + 11 + 4 = 35.**

## 5. Prioridades tras la familia inicial

- **Primero:** las tres matrices humano/elfo/orco, los híbridos semielfo/semiorco y las demás especies.
- **Problemas inmediatos de UI:** `ico-configurar`, `recurso-esfuerzo`, `recurso-potencia`, `recurso-blindaje`, `recurso-esencia`, `equipo-bolsa`, `sexo-indeterminado`.
- **Después:** completar Recursos, Ocupaciones, Poderes y Equipo con el mismo lenguaje visual.

## 6. Proceso de producción y control

1. **Definición:** concepto, familia, rasgos compartidos y diferencias obligatorias; sin reglas inventadas.
2. **Boceto SVG:** archivo autónomo en 24×24 y vista ampliada.
3. **Contraste:** comparar juntos sus familiares a 16/24/48 px; comprobar forma, proporción, huecos y lectura.
4. **Aprobación:** únicamente la versión revisada pasa de *borrador* a *aprobado*.
5. **Integración:** sustituir `assets/icons/<id>.svg` manteniendo el ID y su función; documentar autoría/cambios.
6. **Seguridad:** pruebas de Chrome, Firefox/WebKit, URLs de máscaras y paquete DRS aislado; publicar LIVE solo mediante flujo protegido y promoción explícita de SHA.

**Estado inicial:** 35 iconos provisionales visibles en LIVE; 0 diseños originales aprobados; 4 bocetos SVG iniciales en revisión (humano, elfo, orco, semielfo).
