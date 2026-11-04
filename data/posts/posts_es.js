/**
 * Day 1 Blog Post (ES - Spanish)
 * Staggered daily rollout. Archive of future posts stored in data/blog_archive/
 */
export const POSTS_ES = [
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
