/**
 * Day 1 Blog Post (ES - Spanish)
 * Staggered daily rollout. Archive of future posts stored in data/blog_archive/
 */
export const POSTS_ES = [
{
  "slug": "data_harvesting_warning_a9e5b7",
  "title": "Qué le ocurre a tus fotos después de pulsar \"Subir\"",
  "description": "Las herramientas gratuitas monetizan las fotos de formas que la mayoría no percibe: cláusulas de retención, datos derivados, entrenamiento de IA y riesgo de filtraciones. Una guía práctica para leer la letra pequeña y eliminar este riesgo.",
  "tags": [
    "Privacidad",
    "Seguridad",
    "Industria"
  ],
  "date": "2026-11-07",
  "author": "El equipo de Pixelify",
  "cover": "/blogs/home-hero.jpg",
  "coverAlt": "Página principal de Pixelify destacando el procesamiento local sin subidas a la nube",
  "blocks": [
    {
      "type": "p",
      "text": "El acuerdo parece justo a simple vista: obtienes una herramienta potente gratis y, a cambio, entregas una imagen. Te imaginas una máquina procesando el archivo y olvidándolo de inmediato, como lo haría una fotocopiadora. Ese modelo mental es erróneo en casi todos los detalles, y en esa distancia entre lo que se asume y lo que ocurre en realidad es donde reside el riesgo. Este artículo trata sobre esa distancia: en qué se transforman las imágenes subidas y cómo evaluar cualquier herramienta en menos de cinco minutos."
    },
    {
      "type": "h2",
      "text": "El modelo de negocio detrás de lo \"gratuito\""
    },
    {
      "type": "p",
      "text": "El cómputo cuesta dinero. La capacidad de los servidores, el ancho de banda y la inferencia de modelos generan facturas reales, y una herramienta que procesa imágenes para millones de usuarios sin cobrarles está siendo financiada por alguien más. Las opciones son incómodas: publicidad que necesita datos de comportamiento, corredores de datos donde tus subidas alimentan perfiles comerciales, entrenamiento de modelos donde tus fotos mejoran el producto de otros o captación de usuarios para monetizarlos tras una venta corporativa."
    },
    {
      "type": "p",
      "text": "Los términos de servicio suelen admitir todo esto con palabras ordinarias. Cláusulas amplias para \"usar, copiar, modificar y crear obras derivadas del contenido subido\" no son entusiasmo legal; son la base jurídica para el entrenamiento de modelos, la redistribución en conjuntos de datos y la analítica de producto. Las cláusulas de \"datos agregados y anonimizados\" abarcan la extracción de hábitos a partir de tus registros (qué imágenes editas, con qué frecuencia y en qué resoluciones). Y \"podemos retener contenido para mejorar el servicio\" es la cláusula de entrenamiento en su sentido más literal."
    },
    {
      "type": "h2",
      "text": "Qué es realmente una imagen subida"
    },
    {
      "type": "p",
      "text": "La gente evalúa el riesgo únicamente por lo que ve en la fotografía. El objeto real de evaluación debe ser el archivo completo. Una foto incluye metadatos EXIF: el modelo de dispositivo, la fecha y hora exactas y, frecuentemente, coordenadas GPS: un registro de dónde estabas y cuándo, adherido al contenido visual. Más allá de los metadatos, los propios píxeles filtran información: documentos visibles en una mesa, pantallas de fondo, pizarras, tarjetas de identificación, reflejos en espejos o ventanas y rostros de personas que nunca consintieron ser compartidas."
    },
    {
      "type": "ul",
      "items": [
        "Metadatos EXIF: dispositivo, hora y ubicación a menudo exacta, recopilados automáticamente al subir.",
        "Información contextual de fondo: escritorios, pantallas, documentos y acreditaciones legibles en resoluciones modernas.",
        "Terceros en el encuadre: cada rostro en una foto grupal es una persona cuyos datos acabas de compartir sin su consentimiento.",
        "Patrones de comportamiento: qué editas, con qué frecuencia y en qué resoluciones conforma un perfil de uso completo."
      ]
    },
    {
      "type": "h2",
      "text": "Retención: la promesa que sobrevive a tu sesión"
    },
    {
      "type": "p",
      "text": "Una promesa de eliminación es un proceso manual o programado por humanos, no una propiedad intrínseca del sistema. \"Eliminado tras 24 horas\" describe una intención de comportamiento; durante esas 24 horas el archivo estuvo en algún servidor, tiempo suficiente para una filtración, una orden judicial, una copia interna o una venta de la empresa. Las copias de seguridad lo complican todo: un registro eliminado de la base de datos puede persistir durante semanas en respaldos que nadie recuerda. El único archivo que no puede filtrarse, ser reclamado judicialmente o ser transferido a terceros es el que nunca se envió."
    },
    {
      "type": "h2",
      "text": "El cálculo de filtraciones que nadie hace"
    },
    {
      "type": "p",
      "text": "Asume que cualquier servicio que almacene tus imágenes tarde o temprano sufrirá una filtración, no por mala fe, sino por mera probabilidad estadística en la industria. Hazte la pregunta decisiva: ¿cuál es el peor escenario realista? Para una foto de vacaciones, nada grave. Para el documento escaneado de un familiar, riesgo de robo de identidad. Para el diseño inédito de un cliente, un incumplimiento de contrato con daños reales. Para imágenes médicas o legales, un perjuicio irreparable. La decisión de subir un archivo no es \"foto frente a no foto\", sino asumir un riesgo máximo con total lucidez."
    },
    {
      "type": "h2",
      "text": "La auditoría en cinco minutos"
    },
    {
      "type": "p",
      "text": "No necesitas un abogado para evaluar una herramienta; basta con leer la política real en vez de los lemas promocionales. Cuatro preguntas prácticas te dan casi todas las respuestas necesarias. El objetivo no es la certeza absoluta, sino identificar patrones claros en los servicios que usas a diario."
    },
    {
      "type": "ol",
      "items": [
        "¿Qué derechos exige la política sobre el contenido subido? Las licencias amplias para crear obras derivadas y entrenar IA son una alerta roja; el compromiso explícito de no retención ni entrenamiento es la señal verde.",
        "¿Cuál es el periodo de retención declarado y el borrado es automático? Un borrado automático e inmediato es radicalmente diferente a \"podemos retener contenido\".",
        "¿Dónde se realiza el procesamiento? Una política que oculta dónde se ejecutan los cálculos suele indicar que todo se envía a sus propios servidores.",
        "¿Existe un modelo de negocio visible que no dependa de tus datos? Precios claros que cubran los costes son la mejor prueba de que tus fotos no son el producto."
      ]
    },
    {
      "type": "h2",
      "text": "Hábitos defensivos que funcionan en cualquier caso"
    },
    {
      "type": "p",
      "text": "Hay precauciones que merece la pena adoptar siempre, porque no cuestan nada y no exigen confiar en nadie. Limpia los metadatos antes de compartir cualquier foto: un borrado rápido elimina el registro de ubicación por completo. Recorta antes de subir: si la herramienta solo necesita un objeto, el fondo nunca debe transmitirse. Y mantén una regla estricta por categorías: ciertos tipos de imágenes simplemente jamás deben subirse a formularios web."
    },
    {
      "type": "callout",
      "title": "La regla de exclusión",
      "text": "Imágenes médicas, documentos legales, proyectos no publicados, fotos de menores y cualquier cosa que no mostrarías a un desconocido en la calle: nunca las subas a herramientas gratuitas en la nube. Esta simple regla elimina la inmensa mayoría de los peores escenarios."
    },
    {
      "type": "h2",
      "text": "La solución estructural: eliminar el paso de subida por completo"
    },
    {
      "type": "p",
      "text": "Todos los consejos anteriores son medidas paliativas que reducen la exposición dentro de una arquitectura que exige exponerse. La alternativa estructural es una arquitectura que no lo requiera. Cuando el procesamiento se ejecuta en tu propio equipo, no hay subida que auditar, ni cláusula de retención que interpretar, ni filtración que temer, ni canal de entrenamiento que rechazar. El archivo se queda donde nació y la herramienta cumple su función."
    },
    {
      "type": "p",
      "text": "Esto no es una utopía; es una realidad de ingeniería de software. La misma tarjeta gráfica que dibuja tu pantalla puede ejecutar las redes neuronales que procesan imágenes, y los navegadores actuales ya ofrecen esa capacidad a todo el mundo sin necesidad de instalaciones complejas. El estándar de la industria ha sido enviar tus datos hacia el procesamiento. El estándar superior es llevar el procesamiento hacia tus datos. En 2026, esto ya no es un experimento de laboratorio: es un botón, en este sitio web, ejecutándose en tu ordenador ahora mismo."
    }
  ]
},

{
  "slug": "pixelify_privacy_first_a7f3d9",
  "title": "Pixelify: Por qué creamos un editor de imágenes que nunca ve tus fotos",
  "description": "Todas las demás herramientas de imagen exigen primero tu subida y prometen privacidad después. Pixelify se diseñó de forma opuesta: la IA se ejecuta dentro de la pestaña de tu navegador, por lo que tus fotos nunca salen de tu dispositivo.",
  "tags": [
    "Privacidad",
    "IA Local",
    "Producto"
  ],
  "date": "2026-11-06",
  "author": "El equipo de Pixelify",
  "cover": "/blogs/story-page.jpg",
  "coverAlt": "Página de historia de Pixelify mostrando las palabras PIXELIFY IA LOCAL PARA TUS",
  "blocks": [
    {
      "type": "p",
      "text": "Tienes una foto que quieres retocar. Tal vez sea una captura de pantalla que no encaja bien en una presentación, un retrato familiar escaneado de los años noventa o la foto de un producto con un fondo desordenado. Buscas \"escalar imagen con IA\" en la web, haces clic en el primer resultado gratuito y pulsas subir. En cuestión de segundos, la foto está en un servidor del que nunca has oído hablar, propiedad de una empresa que no conoces, bajo una política de privacidad que no leíste. En ese instante, la foto dejó de ser completamente tuya."
    },
    {
      "type": "p",
      "text": "No tiene por qué ser así. Pixelify se construyó sobre una idea simple y firme: el procesamiento de imágenes es matemática, y la matemática puede ejecutarse en tu propio equipo. Cuando el procesamiento ocurre dentro de la pestaña de tu navegador, la \"privacidad\" deja de ser un párrafo en un documento legal y se convierte en una propiedad técnica del sistema. No hay paso de subida porque no hay ningún servidor al que subir nada. La foto que arrastras a la página es la misma que se mejora, y nunca viaja por la red para lograrlo."
    },
    {
      "type": "h2",
      "text": "El hábito de subir archivos es una decisión de privacidad que nunca tomaste conscientemente"
    },
    {
      "type": "p",
      "text": "Las herramientas gratuitas en la nube no son gratuitas porque el procesamiento sea barato. Son gratuitas porque tus subidas están subvencionadas por otra cosa: publicidad, enriquecimiento de datos, entrenamiento de modelos o captación de una base de usuarios monetizable en el futuro. Nada de esto es hipotético. Las cláusulas de términos de servicio que reclaman amplios derechos para procesar, almacenar y derivar datos del contenido subido son comunes en la industria, y que \"tus datos estén cifrados en tránsito\" no te dice nada sobre lo que ocurre cuando llegan al servidor."
    },
    {
      "type": "p",
      "text": "Hay un segundo costo más silencioso. Una foto contiene metadatos: la hora a la que se tomó, el dispositivo utilizado, a menudo las coordenadas geográficas exactas. Puede contener rostros, documentos olvidados en un escritorio al fondo, una pizarra con notas internas o un menor que no puede consentir convertirse en datos de entrenamiento. La gente comprende intuitivamente que un pasaporte es sensible; pocos se dan cuenta de que una foto casual de una pantalla puede filtrar una clave de API visible en una consola de comandos."
    },
    {
      "type": "ul",
      "items": [
        "Una subida es una copia, y las copias sobreviven a tu sesión. \"Borramos los archivos tras 24 horas\" es una promesa, no un mecanismo técnico verificable.",
        "Los servidores sufren brechas de seguridad. La brecha peligrosa es aquella donde tus fotos originales y sin editar quedaron archivadas para \"mejorar el servicio\".",
        "La eliminación de cuentas y la eliminación de datos son procesos distintos. Uno borra tu acceso; el otro a menudo ni siquiera está implementado.",
        "Una herramienta que recibe tus fotos puede ser intervenida, requerida judicialmente o vendida a terceros. Una herramienta que nunca las recibe es inmune a todo ello."
      ]
    },
    {
      "type": "h2",
      "text": "Pixelify invierte el flujo de trabajo"
    },
    {
      "type": "p",
      "text": "En una arquitectura en la nube, tu foto es la entrada para el programa de otra persona. En Pixelify, el programa es la entrada para tu propio dispositivo. Cuando abres el escalador o el eliminador de fondos, tu navegador descarga la red neuronal en sí -los algoritmos matemáticos que hacen el trabajo- y la almacena localmente en caché. A partir de ese momento, cada imagen que procesas se multiplica, segmenta y reconstruye en tu propia memoria RAM y GPU, bajo tu control exclusivo."
    },
    {
      "type": "img",
      "src": "/blogs/home-hero.jpg",
      "alt": "Portada de Pixelify con el lema Escala, restaura y transforma tus imágenes localmente",
      "caption": "Nuestra promesa fundamental: procesamiento 100% local, sin subidas, sin servidores en la nube."
    },
    {
      "type": "p",
      "text": "Esto no es una reinterpretación de marketing con un logotipo bonito. Abre el inspector de red de tu navegador mientras Pixelify procesa una imagen y compruébalo tú mismo: el único tráfico es la carga inicial de la página y la descarga de los pesos del modelo. Arrastra una imagen, escálala, descarga el resultado: los bytes de tu foto nunca abandonan la pestaña. Puedes desconectar el Wi-Fi tras cargar la web y las herramientas siguen funcionando perfectamente. Esa es la prueba que la mayoría de herramientas \"privadas\" no superan."
    },
    {
      "type": "h2",
      "text": "La privacidad no es la única ventaja; es la que hace posible todo lo demás"
    },
    {
      "type": "p",
      "text": "El procesamiento local transforma por completo la agilidad del servicio. No hay colas de espera, porque no hay un servidor compartido con otros usuarios; tu GPU trabaja exclusivamente para ti. No hay tiempos muertos de subida: una foto de 4 MB que tardaría segundos en enviarse mediante una conexión móvil empieza a procesarse en el instante exacto en que la sueltas. No hay recompresión destructiva donde un servidor reduce tu archivo a un JPEG genérico para ahorrar ancho de banda; obtienes exactamente la resolución y formato solicitados."
    },
    {
      "type": "p",
      "text": "La latencia se acumula. Una herramienta en la nube gasta segundos subiendo, segundos en cola, segundos procesando y segundos descargando. Una herramienta local invierte esos mismos segundos exclusivamente en procesamiento; y en un equipo moderno con aceleración por hardware WebGPU, el procesamiento suele ser el paso más rápido. Para una sola foto, la diferencia es agilidad instantánea. Para un lote de cincuenta fotos de catálogo, es la diferencia entre terminar antes del almuerzo o abandonar la pestaña por frustración."
    },
    {
      "type": "callout",
      "title": "La prueba offline",
      "text": "Carga Pixelify una vez y desconecta internet. Todas las funciones siguen operativas. Esta sencilla prueba distingue el procesamiento verdaderamente local del teatro de la privacidad con mucha más fiabilidad que cualquier página de políticas."
    },
    {
      "type": "h2",
      "text": "Qué significa realmente \"ejecutarse localmente\": la explicación honesta"
    },
    {
      "type": "p",
      "text": "La honestidad es más valiosa que las promesas vacías, así que explicamos con precisión lo que sucede. Las redes neuronales son archivos con millones de coeficientes matemáticos. Tu navegador descarga ese archivo una sola vez, igual que descarga un recurso multimedia, y lo guarda en su caché local. Cuando editas una foto, el navegador pasa tus píxeles a través de esas matrices numéricas utilizando tu hardware gráfico. En dispositivos compatibles con WebGPU, este cálculo intensivo se ejecuta directamente en la GPU, permitiendo resultados en cuestión de segundos."
    },
    {
      "type": "p",
      "text": "Lo que nunca ocurre: tu foto no se transmite a ningún lugar, no se almacena ninguna copia y no se registra ninguna huella de tus imágenes. El modelo nunca te identifica; es un conjunto fijo de instrucciones que se ejecuta de forma idéntica para todos, sin canales para enviar datos al exterior. Además, la arquitectura se adapta con elegancia: en equipos más antiguos recurre a WebAssembly (CPU) en lugar de negarse a funcionar."
    },
    {
      "type": "h2",
      "text": "Los compromisos que aceptamos deliberadamente"
    },
    {
      "type": "p",
      "text": "Un diseño enfocado en lo local implica retos reales, y fingir lo contrario iría en contra de nuestros principios. En la primera visita, los usuarios esperan mientras se descargan los archivos del modelo (generalmente unas decenas de megabytes). La velocidad depende de tu equipo: un teléfono de hace cinco años será más lento que un ordenador con tarjeta gráfica dedicada. Las imágenes gigantes están limitadas por la memoria de tu dispositivo y no por la de un centro de datos. Y mientras los servicios cloud actualizan modelos de un día para otro, nosotros los lanzamos cuando están rigurosamente probados y optimizados."
    },
    {
      "type": "p",
      "text": "Aceptamos estos compromisos porque la alternativa cambia una pequeña espera inicial por una exposición de privacidad ilimitada en el tiempo, y porque la brecha de hardware se reduce cada año. Los navegadores actuales ofrecen capacidades de cómputo gráfico que hace cinco años eran exclusivas del software de escritorio nativo. La evolución del hardware beneficia al enfoque local haciéndolo cada vez más rápido, mientras que el modelo en la nube siempre estará limitado por el ancho de banda."
    },
    {
      "type": "h2",
      "text": "Para quién está pensado realmente"
    },
    {
      "type": "p",
      "text": "Fotógrafos que editan material bajo acuerdos de confidencialidad (NDA). Agencias que manejan imágenes de productos antes de su lanzamiento oficial. Periodistas que procesan fotografías de fuentes sensibles. Profesores y familias que mejoran fotos escolares de sus hijos. Y cualquier persona que alguna vez haya dudado frente al botón de subir una foto con una corazonada incómoda. Esa duda es racional. Pixelify fue creado para que esa duda nunca vuelva a ser necesaria."
    },
    {
      "type": "p",
      "text": "Esa es toda nuestra filosofía de producto. No se trata de decirte \"tus datos están seguros con nosotros\", sino \"nosotros no tenemos tus datos\". No es tener una mejor política, sino no necesitar ninguna. Suelta una imagen en la página, observa cómo mejora, descárgala, cierra la pestaña y ten la certeza absoluta de que la historia de esa foto nunca salió del lugar donde fue tomada. En 2026 esto no debería parecer radical. Construimos Pixelify porque todavía lo es."
    }
  ]
},

{
  "slug": "enable_webgpu_guide_b5c9e8",
  "title": "Habilitar WebGPU: El cambio de dos minutos que acelera enormemente la IA en el navegador",
  "description": "WebGPU permite que la IA basada en navegador se ejecute en tu chip gráfico en lugar de la CPU, a menudo 5–10× más rápido. Una guía paso a paso por navegador para activarlo, más cómo verificar que funcione usando el indicador de motor en la configuración.",
  "tags": [
    "WebGPU",
    "Guía",
    "Rendimiento"
  ],
  "date": "2026-11-05",
  "author": "El equipo de Pixelify",
  "cover": "/blogs/settings-engine.jpg",
  "coverAlt": "Panel desplegable de configuración de Pixelify mostrando los indicadores de estado del motor en vivo",
  "blocks": [
    {
      "type": "p",
      "text": "Aquí tienes una tarea de dos minutos con una recompensa inmediata y medible. La IA basada en el navegador se ejecuta en una de dos rutas: una ruta de CPU que funciona en todas partes pero es lenta, o una ruta de GPU (WebGPU) que aprovecha tu chip gráfico y completa la misma tarea varias veces más rápido. Muchos navegadores incluyen WebGPU disponible pero no obvio, a veces detrás de una bandera (flag), a veces simplemente nunca revisado. Activarlo y confirmar que la herramienta realmente cambió a él es el cambio de configuración de mayor rendimiento que puedes hacer."
    },
    {
      "type": "h2",
      "text": "Qué es WebGPU, en un solo párrafo"
    },
    {
      "type": "p",
      "text": "WebGPU es la interfaz moderna del navegador con el hardware gráfico, la sucesora de la antigua generación WebGL, rediseñada tanto para computación como para renderizado. Este rediseño es fundamental para la IA: la pila anterior fue diseñada para dibujar triángulos, y ejecutar cargas de trabajo matemáticas en ella requería contorsiones que limitaban el rendimiento. WebGPU expone el cómputo de forma adecuada, por lo que las redes neuronales, al ser aritmética puramente paralela, obtienen ganancias desproporcionadas cuando está disponible."
    },
    {
      "type": "h2",
      "text": "Comprueba si ya lo tienes activado"
    },
    {
      "type": "p",
      "text": "Antes de cambiar nada, la forma más rápida suele ser descubrir que ya lo tienes listo. Abre el panel de configuración de la app (el icono de engranaje en la barra de navegación superior) y observa la fila de soporte de WebGPU. Si dice Disponible con una insignia verde, tu navegador ya lo está utilizando y no necesitas tocar ninguna configuración interna."
    },
    {
      "type": "callout",
      "title": "Configuración (icono de engranaje) → insignias de motor",
      "text": "Cada herramienta reporta su motor activo en tiempo real. Si ves GPU (WebGPU), ya estás funcionando a la máxima velocidad posible en tu hardware."
    },
    {
      "type": "h2",
      "text": "Google Chrome y Microsoft Edge"
    },
    {
      "type": "p",
      "text": "Si tu navegador está utilizando una alternativa de CPU en lugar de WebGPU, el problema más común es que la aceleración de hardware no está forzada o la GPU se encuentra en la lista de bloqueo de compatibilidad. Sigue estos pasos para forzar su activación:"
    },
    {
      "type": "img",
      "src": "/blogs/how-to-webgpu-chrome.png",
      "alt": "Página de experimentos de Chrome mostrando la configuración de flags de WebGPU",
      "caption": "Activar la opción 'Unsafe WebGPU' o 'Force enable WebGPU' en chrome://flags"
    },
    {
      "type": "h3",
      "text": "Paso 1: Abre la página de flags del navegador"
    },
    {
      "type": "p",
      "text": "Inicia Google Chrome o Microsoft Edge en tu escritorio. En la barra de direcciones superior, escribe chrome://flags (o edge://flags para Microsoft Edge) y presiona Enter."
    },
    {
      "type": "h3",
      "text": "Paso 2: Busca WebGPU"
    },
    {
      "type": "p",
      "text": "Una vez que se abra la página de Experimentos, localiza el cuadro de búsqueda en la parte superior y escribe WebGPU. La lista de flags se filtrará automáticamente para mostrarte todas las preferencias relacionadas."
    },
    {
      "type": "h3",
      "text": "Paso 3: Activa el Flag de WebGPU"
    },
    {
      "type": "p",
      "text": "Busca la opción 'Enforce WebGPU interop' o 'Unsafe WebGPU / WebGPU Developer Features'. Haz clic en el menú desplegable junto a ella y cámbialo de 'Default' a 'Enabled'."
    },
    {
      "type": "p",
      "text": "Este flag es relevante para configuraciones de hardware que Chrome considera no probadas o en sistemas con chips integrados más antiguos donde Chrome desactiva la API de forma preventiva."
    },
    {
      "type": "h3",
      "text": "Paso 4: Reinicia el navegador"
    },
    {
      "type": "p",
      "text": "Después de cambiar el flag, haz clic en el botón azul 'Relaunch' (Reiniciar) que aparece en la esquina inferior derecha de la ventana para aplicar los cambios de manera efectiva."
    },
    {
      "type": "h3",
      "text": "Paso 5: Verifica la funcionalidad de WebGPU"
    },
    {
      "type": "p",
      "text": "Tras reiniciar, vuelve a abrir tu aplicación Pixelify y consulta el menú de configuración. El motor de procesamiento debería mostrar 'WebGPU' en verde brillante."
    },
    {
      "type": "h3",
      "text": "¿Qué pasa si WebGPU sigue sin funcionar?"
    },
    {
      "type": "p",
      "text": "Si el navegador sigue recurriendo a la CPU, abre la configuración de Chrome, ve a 'Sistema' y asegúrate de que la opción 'Usar aceleración gráfica cuando esté disponible' esté activada. También verifica que los controladores de tu tarjeta gráfica estén actualizados."
    },
    {
      "type": "callout",
      "title": "WebGPU está habilitado por defecto en versiones recientes",
      "text": "En Chrome 113+ en Windows, macOS y ChromeOS, WebGPU suele estar activo de forma predeterminada a menos que el hardware esté en lista negra."
    },
    {
      "type": "h2",
      "text": "Mozilla Firefox"
    },
    {
      "type": "p",
      "text": "Firefox incluye soporte para WebGPU en sus versiones modernas, aunque a veces requiere activación manual mediante flags de configuración en sistemas Linux o GPUs específicas."
    },
    {
      "type": "h3",
      "text": "Paso 1: Abre la página de configuración avanzada"
    },
    {
      "type": "p",
      "text": "Inicia Firefox en tu ordenador, escribe about:config en la barra de direcciones y presiona Enter."
    },
    {
      "type": "h3",
      "text": "Paso 2: Acepta la advertencia y continúa"
    },
    {
      "type": "p",
      "text": "Firefox te mostrará un aviso que dice 'Proceda con precaución'. Haz clic en 'Aceptar el riesgo y continuar'."
    },
    {
      "type": "h3",
      "text": "Paso 3: Busca las preferencias de WebGPU"
    },
    {
      "type": "p",
      "text": "En el cuadro de búsqueda en la parte superior, escribe dom.webgpu.enabled."
    },
    {
      "type": "h3",
      "text": "Paso 4: Cambia el valor a True"
    },
    {
      "type": "p",
      "text": "Haz doble clic en dom.webgpu.enabled (o haz clic en el botón de alternancia en el extremo derecho) para cambiar su valor a true."
    },
    {
      "type": "h3",
      "text": "Paso 5: Reinicia Firefox y verifica"
    },
    {
      "type": "p",
      "text": "Cierra completamente y vuelve a abrir Firefox para que la nueva preferencia surta efecto. Vuelve a Pixelify y confirma que el motor ahora indica WebGPU."
    },
    {
      "type": "h3",
      "text": "Solución de problemas en Firefox"
    },
    {
      "type": "p",
      "text": "Firefox en Linux requiere controladores Vulkan actualizados y bibliotecas del sistema compatibles. Si persiste en CPU, asegúrate de tener instalado el paquete 'vulkan-tools'."
    },
    {
      "type": "h2",
      "text": "Navegador Brave"
    },
    {
      "type": "p",
      "text": "Brave se basa en Chromium, lo que le otorga el mismo motor de alto rendimiento que Chrome, pero sus protecciones de privacidad (Brave Shields) a veces bloquean la detección de hardware."
    },
    {
      "type": "h3",
      "text": "Paso 1: Abre la página de flags de Brave"
    },
    {
      "type": "p",
      "text": "Inicia Brave Browser en tu equipo. En la barra de direcciones, escribe brave://flags y pulsa Enter."
    },
    {
      "type": "h3",
      "text": "Paso 2: Busca WebGPU"
    },
    {
      "type": "p",
      "text": "En el cuadro de búsqueda en la parte superior de Experimentos, escribe WebGPU."
    },
    {
      "type": "h3",
      "text": "Paso 3: Activa los flags de WebGPU"
    },
    {
      "type": "p",
      "text": "Localiza 'Unsafe WebGPU' o 'WebGPU Developer Features' y cambia la opción a 'Enabled'."
    },
    {
      "type": "h3",
      "text": "Paso 4: Revisa la protección contra huellas digitales de Brave Shields"
    },
    {
      "type": "p",
      "text": "Brave Shields bloquea las técnicas de huella digital por defecto, lo que en ocasiones enmascara los adaptadores de GPU para las páginas web. Si Pixelify no detecta tu GPU, haz clic en el icono del león de Brave en la barra de direcciones para este sitio y desactiva el bloqueo agresivo de huella digital."
    },
    {
      "type": "h3",
      "text": "Paso 5: Reinicia Brave y comprueba"
    },
    {
      "type": "p",
      "text": "Haz clic en el botón 'Relaunch' en la parte inferior para reiniciar Brave y vuelve a cargar Pixelify."
    },
    {
      "type": "h3",
      "text": "Solución de problemas en Brave"
    },
    {
      "type": "p",
      "text": "Si Brave continúa en CPU, abre brave://settings/system y confirma que 'Usar aceleración de hardware cuando esté disponible' se encuentre activado."
    },
    {
      "type": "h2",
      "text": "Safari en macOS"
    },
    {
      "type": "p",
      "text": "Safari activó el soporte para WebGPU a partir de las versiones recientes de macOS (Sonoma y Sequoia) mediante la arquitectura Metal de Apple."
    },
    {
      "type": "h3",
      "text": "Paso 1: Activa el menú Desarrollo"
    },
    {
      "type": "p",
      "text": "Abre Safari en macOS. En la barra de menús superior, ve a Safari → Ajustes (o Preferencias) → pestaña 'Avanzado', y marca 'Mostrar menú Desarrollo en la barra de menús'."
    },
    {
      "type": "h3",
      "text": "Paso 2: Abre las Feature Flags"
    },
    {
      "type": "p",
      "text": "Haz clic en el menú 'Desarrollo' en la barra superior de tu pantalla y dirígete al submenú 'Feature Flags' o 'Funciones experimentales'."
    },
    {
      "type": "h3",
      "text": "Paso 3: Activa WebGPU"
    },
    {
      "type": "p",
      "text": "En el filtro de búsqueda escribe 'WebGPU'. Localiza la casilla de verificación de WebGPU y asegúrate de que esté marcada."
    },
    {
      "type": "h3",
      "text": "Paso 4: Reinicia Safari y comprueba"
    },
    {
      "type": "p",
      "text": "Cierra Safari por completo y vuelve a abrirlo. Carga Pixelify y el motor mostrará WebGPU respaldado por Metal en los chips Apple Silicon."
    },
    {
      "type": "h2",
      "text": "Android e iOS"
    },
    {
      "type": "p",
      "text": "En Android, la disponibilidad de WebGPU depende tanto del navegador como de la GPU del teléfono. Chrome en Android admite WebGPU en chips Snapdragon y MediaTek recientes cuando se activa chrome://flags#enable-unsafe-webgpu."
    },
    {
      "type": "img",
      "src": "/blogs/home-mobile.jpg",
      "alt": "Pixelify ejecutándose en un teléfono móvil con IA acelerada en dispositivo",
      "caption": "Los dispositivos móviles modernos procesan recortes y mejoras en segundos sin subir datos a la nube"
    },
    {
      "type": "h2",
      "text": "Confirmar que realmente funcionó"
    },
    {
      "type": "p",
      "text": "Este es el paso que muchas personas omiten, y es el más importante. Abre Pixelify, despliega el menú de configuración y observa los indicadores de motor. Si dice 'WebGPU' o 'GPU' en verde brillante para el Upscaler o el Eliminador de Fondo, tu navegador está acelerando la inferencia en hardware con éxito."
    },
    {
      "type": "h2",
      "text": "Qué esperar tras la activación"
    },
    {
      "type": "p",
      "text": "Expectativas realistas: imágenes que en CPU tardaban 15 a 20 segundos pasarán a procesarse en solo 1 a 3 segundos. El recorte con Diablo matting procesará bordes de cabello finos al instante y el ventilador de tu ordenador no se acelerará, ya que la GPU maneja la carga de trabajo en paralelo de forma eficiente."
    },
    {
      "type": "h2",
      "text": "Dos datos más que vale la pena conocer"
    },
    {
      "type": "p",
      "text": "El primero es que WebGPU es una plataforma abierta compartida, no un acelerador propietario exclusivo de una sola empresa. Activarlo en tu navegador beneficia a todas las herramientas de IA locales que uses, hoy y en el futuro, sin instalar software adicional."
    },
    {
      "type": "p",
      "text": "El segundo es que la primera ejecución siempre descarga los pesos neuronales en la caché local del navegador (unos pocos megabytes). A partir de la segunda imagen, el modelo se carga al instante desde el almacenamiento local."
    },
    {
      "type": "p",
      "text": "Una última nota sobre por qué esto importa más allá de la velocidad: no hay subida de datos a servidores, no hay cuotas ni suscripciones obligatorias, y tus fotos nunca salen de la habitación en la que fueron tomadas. Dos minutos de configuración cambian la IA en el navegador de 'curiosa' a 'genuinamente rápida y profesional'."
    }
  ]
}
];
