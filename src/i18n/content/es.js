const es = {

  /* ─────────────────────────────────────────────
     1. IC MARKETS  (top-5 → full translation)
  ───────────────────────────────────────────── */
  "ic-markets": {
    verdict: "Excelente",
    promo: "Spreads raw desde 0,0 pips — sin recargo",
    PROS: [
      "Ejecución ECN real con spreads raw desde 0,0 pips — de los más bajos del sector",
      "Regulación Tier-1 dual (ASIC + CySEC) con segregación total de fondos de clientes",
      "Velocidad media de ejecución de 40 ms sin intervención de mesa de operaciones",
      "Cuatro plataformas de trading: MT4, MT5, cTrader y TradingView",
      "Más de 2.250 instrumentos: forex, acciones, índices, criptomonedas y materias primas",
      "Liquidez institucional profunda de más de 50 proveedores",
      "Sin comisiones de depósito, retiro ni inactividad",
      "VPS gratuito para clientes que cumplan los requisitos mínimos",
    ],
    CONS: [
      "La entidad FSA de Seychelles ofrece menor protección regulatoria que ASIC/CySEC",
      "Depósito mínimo de $200 — superior a Pepperstone ($0) o XM ($5)",
      "Sin plataforma propia — depende íntegramente de software de terceros",
      "Contenido educativo limitado en comparación con IG, AvaTrade o XM",
      "Sin regulación FCA (Reino Unido) — los clientes británicos se gestionan a través de la entidad offshore",
      "Los tiempos de espera en atención al cliente pueden alcanzar 10-15 minutos en horas pico",
    ],
    SCORES: [
      { name: "Regulación y Seguridad", score: 9.8, weight: 25, detail: "Regulación Tier-1 dual ASIC + CySEC. Fondos de clientes segregados en Westpac y NAB. Protección de saldo negativo para todos los clientes minoristas." },
      { name: "Costes de Trading", score: 9.9, weight: 20, detail: "Spread medio EUR/USD de 0,02 pips en cuenta Raw. Comisión de $7 por vuelta completa. Sin comisiones de depósito ni retiro. Sin comisión de inactividad." },
      { name: "Puntuación Trustpilot", score: 9.6, weight: 15, detail: "4,8/5 con más de 38.420 reseñas verificadas. El 91% de valoraciones de 5 estrellas. Sentimiento consistentemente positivo sobre velocidad de ejecución y soporte." },
      { name: "Evaluación de Expertos", score: 9.7, weight: 20, detail: "Nuestro equipo abrió cuentas reales, depositó fondos, ejecutó más de 150 operaciones en distintas sesiones y verificó los retiros. Ejecución media: 40 ms." },
      { name: "Plataformas y Herramientas", score: 9.5, weight: 10, detail: "MT4, MT5, cTrader e integración con TradingView. Servidores Equinix NY4/LD5. VPS gratuito para traders de alto volumen. Más de 50 proveedores de liquidez." },
      { name: "Calidad de Ejecución", score: 9.8, weight: 10, detail: "Sin mesa de operaciones. Velocidad media de llenado de 40 ms. Tasa de requotes inferior al 0,1% en nuestras pruebas. Compatible con scalping, hedging y trading con EAs." },
    ],
    FAQ: [
      { q: "¿Es IC Markets seguro y legítimo?", a: "Sí. IC Markets está regulado por ASIC (Australia) y CySEC (Chipre), ambos reguladores financieros de Nivel 1 con estrictos requisitos de segregación de fondos, protección de saldo negativo y auditorías periódicas. IC Markets opera desde 2007 sin incidentes regulatorios graves. Los fondos de los clientes se custodian en cuentas fiduciarias segregadas en Westpac y National Australia Bank. No obstante, los operadores bajo la entidad de Seychelles (FSA) cuentan con menor protección." },
      { q: "¿Cuál es el depósito mínimo en IC Markets?", a: "El depósito mínimo es de $200 para todos los tipos de cuenta (Estándar, Raw Spread MT4/MT5 y Raw Spread cTrader). IC Markets acepta depósitos mediante transferencia bancaria, tarjetas de crédito/débito, PayPal, Skrill, Neteller y criptomonedas. Todos los métodos de depósito son gratuitos." },
      { q: "¿Ofrece IC Markets trading ECN real?", a: "Sí. IC Markets opera un modelo ECN genuino con cuentas de spread raw. La liquidez proviene de más de 50 proveedores, incluidos grandes bancos e instituciones no bancarias. No hay intervención de mesa de operaciones — todas las órdenes se emparejan electrónicamente. El spread medio EUR/USD en la cuenta Raw es de 0,02 pips, entre los más bajos del sector." },
      { q: "¿Cuánto tardan los retiros en IC Markets?", a: "Los retiros normalmente tardan 1-2 días hábiles para transferencias bancarias y se procesan el mismo día para monederos electrónicos (PayPal, Skrill, Neteller). IC Markets no cobra comisiones de retiro para un retiro diario. Retiros adicionales el mismo día pueden generar una pequeña comisión. En nuestras pruebas, recibimos retiros por PayPal en menos de 4 horas." },
      { q: "¿Puedo usar IC Markets desde Estados Unidos?", a: "No. IC Markets no acepta clientes de Estados Unidos por restricciones regulatorias. Los traders estadounidenses pueden considerar OANDA o IG (ambos regulados por la NFA). IC Markets está disponible en la mayoría de otros países, incluidos Australia, Reino Unido, Europa, Asia y África." },
      { q: "¿Es IC Markets adecuado para el scalping?", a: "IC Markets es uno de los mejores brokers para el scalping. La combinación de spreads raw desde 0,0 pips, velocidad media de ejecución de 40 ms, sin mesa de operaciones y sin restricciones en scalping o trading con EAs lo hace ideal para estrategias de alta frecuencia. La plataforma cTrader, en particular, ofrece precios Nivel II y tipos de órdenes avanzados adecuados para scalpers." },
      { q: "¿Qué plataformas de trading soporta IC Markets?", a: "IC Markets ofrece cuatro plataformas: MetaTrader 4 (MT4), MetaTrader 5 (MT5), cTrader y TradingView. Todas están disponibles en escritorio, web y móvil. Los servidores MT4/MT5 están alojados en los centros de datos Equinix NY4 (Nueva York) y LD5 (Londres) para latencia mínima. VPS gratuito disponible para traders con capital de $1.500 o más." },
      { q: "¿Cómo se compara IC Markets con Pepperstone?", a: "Ambos son excelentes brokers ECN. IC Markets tiene spreads medios ligeramente más ajustados (0,02 vs 0,10 pips EUR/USD) y comisiones de cTrader inferiores ($6 vs $7 por vuelta completa). Pepperstone tiene depósito mínimo de $0 (vs $200) y regulación FCA, de la que IC Markets carece. En calidad de ejecución y coste puro, IC Markets lleva la delantera. Para traders del Reino Unido y principiantes, Pepperstone puede ser más adecuado." },
    ],
    content: {
      overview: [
        "IC Markets es uno de los brokers de forex ECN más grandes del mundo por volumen diario de trading, procesando más de $1 billón en transacciones mensuales. Fundado en 2007 en Sídney, Australia, por Andrew Budzinski, el broker fue creado para acercar la ejecución institucional al trading minorista. Hoy atiende a más de 200.000 clientes activos en más de 200 países.",
        "Lo que distingue fundamentalmente a IC Markets de muchos competidores es su modelo de ejecución ECN (Red de Comunicación Electrónica) genuino. A diferencia de los brokers de tipo B-book que toman la posición contraria a sus clientes, IC Markets enruta todas las órdenes directamente a un pool de más de 50 proveedores de liquidez, incluidos grandes bancos como JPMorgan, Goldman Sachs y Deutsche Bank. Esto significa que el broker no tiene incentivo financiero para que sus clientes pierdan dinero.",
        "IC Markets ofrece acceso a más de 2.250 instrumentos negociables: forex (61 pares), índices (25), materias primas (22), criptomonedas (23), acciones (2.100+), bonos y futuros. El broker soporta cuatro plataformas: MetaTrader 4, MetaTrader 5, cTrader y TradingView, con servidores en los centros de datos Equinix NY4 y LD5.",
        "El broker está regulado por dos autoridades financieras de Nivel 1 — ASIC y CySEC — con una entidad offshore adicional bajo FSA Seychelles. Los fondos de los clientes están completamente segregados en cuentas fiduciarias en bancos australianos con calificación AA, incluyendo Westpac y National Australia Bank.",
      ],
      scoring: "Nuestra puntuación global de {score}/10 para IC Markets se calcula usando una metodología ponderada en seis dimensiones clave. Cada puntuación se basa en pruebas reales, datos verificados y análisis de expertos — no en materiales de marketing del broker. Así se desempeñó IC Markets en cada categoría:",
      accountIntro: "IC Markets ofrece tres tipos de cuentas en vivo, todas con un depósito mínimo de $200. La diferencia clave está en la estructura de precios: la cuenta Estándar incluye todos los costes en el spread, mientras que las dos cuentas Raw Spread ofrecen spreads más ajustados más una comisión por lote.",
      accountOutro: "Todos los tipos de cuenta ofrecen acceso al mismo rango de instrumentos y soportan hedging, scalping y trading con Expert Advisors (EAs) sin restricciones. IC Markets también ofrece cuentas islámicas (sin swap) y cuentas demo con saldo virtual de $100.000 para práctica.",
      regulation: [
        "La regulación es el factor con mayor peso en nuestra metodología de puntuación (25%). IC Markets posee licencias de tres organismos reguladores, dos de los cuales se clasifican como Nivel 1 — la categoría más alta de regulación financiera.",
        "Bajo la regulación de ASIC y CySEC, IC Markets debe mantener segregación total de fondos de clientes, proporcionar protección de saldo negativo, someterse a auditorías externas periódicas y mantener requisitos mínimos de adecuación de capital. La entidad de Seychelles opera con regulación más ligera — nuestra recomendación es abrir la cuenta bajo la entidad ASIC o CySEC siempre que sea posible para máxima protección.",
      ],
      costs: [
        "Los costes de trading son un factor determinante para los traders activos. IC Markets obtuvo un 9,9/10 en esta categoría — el más alto de cualquier broker que hemos analizado — gracias a sus spreads raw ultra-ajustados y su estructura de comisiones transparente.",
        "IC Markets obtiene precios de más de 50 proveedores de liquidez, creando libros de órdenes profundos con precios interbancarios genuinos. La cuenta Estándar no tiene comisión pero spreads más amplios (media de 0,82 pips EUR/USD). La cuenta Raw Spread es donde IC Markets realmente destaca — con spreads medios de solo 0,02 pips en EUR/USD más una comisión de $3,50 por lote por lado, el coste total por lote estándar (vuelta completa) es aproximadamente $7,02.",
        "No hay comisiones ocultas: sin comisiones de depósito, sin comisiones de retiro (1 gratuito al día), sin comisiones de inactividad y sin comisiones de mantenimiento de cuenta. Las tasas de swap nocturnas son estándar y se publican de forma transparente en el sitio web de IC Markets.",
      ],
      spreads: [
        "Hemos probado los spreads medios de IC Markets y cuatro brokers competidores durante la sesión solapada Londres/Nueva York (el período de mayor liquidez). Todas las cifras son en pips para cuentas Raw/ECN:",
        "IC Markets ofrece consistentemente los spreads más ajustados del sector, especialmente en EUR/USD y USD/JPY. La diferencia se vuelve significativa a escala — un scalper ejecutando 50 lotes al día ahorraría aproximadamente $200/mes en costes de spread comparado con Pepperstone, y más de $1.900/mes comparado con la cuenta estándar de XM.",
      ],
      deposits: [
        "IC Markets ofrece una de las experiencias de financiación más flexibles y rentables entre los brokers ECN. Todos los depósitos son gratuitos independientemente del método, y el primer retiro de cada día también es gratuito.",
        "En nuestras pruebas, depositamos $500 vía PayPal y se acreditó en nuestra cuenta de trading en menos de 30 segundos. Luego solicitamos un retiro de $300 — el retiro por PayPal se procesó en menos de 4 horas. Los retiros por transferencia bancaria tardaron 2 días hábiles. IC Markets soporta 10 divisas base: USD, EUR, GBP, AUD, CHF, JPY, NZD, SGD, HKD y CAD.",
      ],
      platforms: [
        "IC Markets soporta cuatro plataformas de trading, ofreciendo flexibilidad para diferentes estilos de trading. Todas las plataformas se conectan al mismo pool de liquidez e infraestructura de servidores alojada en los centros de datos Equinix NY4 y LD5.",
        "MetaTrader 4 sigue siendo la plataforma más popular entre los clientes de IC Markets, ofreciendo más de 30 indicadores integrados, soporte para Expert Advisors y trading con un clic. MetaTrader 5 añade un calendario económico integrado, más marcos temporales (21 vs 9) y un probador de estrategias mejorado. cTrader es la plataforma preferida para los scalpers, ofreciendo precios de Nivel II, tipos de órdenes avanzados y un entorno de trading automatizado nativo en C#.",
        "La integración con TradingView, lanzada en 2023, permite a los traders ejecutar órdenes directamente desde la interfaz de gráficos de TradingView — combinando el que muchos consideran el mejor software de gráficos con la ejecución de IC Markets. El VPS gratuito está disponible para clientes con capital de $1.500 o más, alojado en instalaciones de Equinix para latencia inferior a 1 ms.",
      ],
      mobile: [
        "IC Markets ofrece trading móvil a través de las apps de MT4, MT5 y cTrader, disponibles en iOS y Android. Todas las apps proporcionan funcionalidad completa de trading, incluyendo colocación de órdenes, análisis de gráficos, gestión de cuentas y notificaciones push para alertas de precios.",
        "La app móvil de cTrader está especialmente bien diseñada, ofreciendo una interfaz moderna, gráficos avanzados con más de 65 indicadores y soporte para todos los tipos de órdenes, incluyendo stop-limit y trailing stops. La app IC Social permite el copy trading móvil — puedes explorar y copiar estrategias de los traders más exitosos directamente desde tu teléfono.",
      ],
      support: [
        "IC Markets ofrece soporte al cliente 24/7 vía chat en vivo, correo electrónico y teléfono. En nuestras pruebas, los tiempos de espera en el chat en vivo promediaron 3-5 minutos en horas de menor actividad y 10-15 minutos en horas pico. Las respuestas por correo electrónico se recibieron en menos de 6 horas. Los agentes de soporte conocían bien las condiciones de trading, los problemas de plataforma y las consultas relacionadas con la cuenta.",
        "El broker proporciona soporte en 18 idiomas y tiene oficinas dedicadas en Sídney, Limasol y Seychelles. Aunque la calidad del soporte es buena, los tiempos de espera en horas pico son una debilidad notable en comparación con brokers como IG u OANDA que ofrecen conexiones casi instantáneas.",
      ],
      education: [
        "La oferta educativa de IC Markets es su área más débil. El broker proporciona materiales educativos básicos incluyendo tutoriales de trading, webinars y un glosario. Sin embargo, estos recursos carecen de la profundidad y estructura que se encuentran en competidores como IG Academy, SharpTrader de AvaTrade o el hub educativo de XM.",
        "Las herramientas de investigación son mejores: IC Markets ofrece análisis de mercado diario a través de Trading Central, un calendario económico, el podcast 'IC Your Trade' producido con Bloomberg Media Studios, y un plugin de Autochartist para MT4/MT5 que proporciona reconocimiento automatizado de patrones de gráficos.",
      ],
      trustpilot: "IC Markets tiene una reputación excepcional en Trustpilot con una puntuación de 4,8/5 de más de 38.000 reseñas verificadas. Los temas positivos más comunes son los spreads ajustados, la ejecución rápida y el soporte al cliente receptivo. Las reseñas negativas mencionan principalmente los tiempos de espera en soporte en horas pico y el deslizamiento ocasional durante eventos de noticias importantes.",
      country: "IC Markets acepta clientes de más de 200 países en todo el mundo. Las exclusiones notables incluyen Estados Unidos, Canadá, Israel, Irán y Corea del Norte. La entidad a la que te asignan depende de tu país de residencia: ASIC (Australia, NZ), CySEC (países UE/EEE) o FSA Seychelles (resto del mundo). Los clientes del Reino Unido se incorporan a través de la entidad de Seychelles, lo que implica menor protección regulatoria.",
      verdict: [
        "IC Markets es nuestro broker mejor valorado para 2026 y obtiene nuestro premio Editor's Choice. La combinación de ejecución ECN real, spreads raw desde 0,0 pips, regulación Tier-1 dual y cuatro plataformas de trading lo convierte en la mejor opción para traders serios que priorizan la calidad de ejecución y los bajos costes.",
        "El depósito mínimo de $200 y el contenido educativo limitado hacen que IC Markets no sea la mejor opción para principiantes completos — para eso, recomendaríamos Pepperstone (depósito mínimo $0) o XM (mínimo $5). Y los traders del Reino Unido deben saber que estarán bajo regulación de Seychelles en lugar de FCA. Pero para traders experimentados, scalpers, day traders y cualquiera que ejecute estrategias algorítmicas, IC Markets es simplemente el mejor de su clase.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     2. PEPPERSTONE  (top-5 → full translation)
  ───────────────────────────────────────────── */
  "pepperstone": {
    verdict: "Excelente",
    promo: "Depósito mínimo $0 — empieza a operar al instante",
    PROS: [
      "Depósito mínimo $0 — la barrera de entrada más baja de cualquier broker ECN importante",
      "Triple regulación Tier-1 (FCA + ASIC + CySEC) para máxima protección del cliente",
      "Spreads raw desde 0,0 pips con competitiva comisión de $7 por vuelta completa",
      "Cuatro plataformas de trading: MT4, MT5, cTrader e integración con TradingView",
      "Excelente atención al cliente con tiempo medio de espera en chat inferior a 2 minutos",
      "Paquete gratuito de Smart Trader Tools con 28 complementos para MT4/MT5",
      "Sin comisiones de depósito ni retiro en todos los métodos de pago",
      "Programa Active Trader con descuentos por volumen de hasta $3 por lote",
    ],
    CONS: [
      "Spreads medios ligeramente más amplios que IC Markets (0,10 vs 0,02 pips EUR/USD)",
      "Más de 1.200 instrumentos — menos que IC Markets (2.250+) o IG (17.000+)",
      "Sin plataforma propia — depende íntegramente de software de terceros",
      "La entidad DFSA de Dubái tiene una selección de instrumentos más limitada",
      "El contenido de investigación y análisis de mercado es menos completo que IG o Saxo",
      "Copy trading disponible solo a través de integraciones limitadas de terceros",
    ],
    SCORES: [
      { name: "Regulación y Seguridad", score: 9.9, weight: 25, detail: "Triple regulación Tier-1: FCA + ASIC + CySEC. Fondos de clientes en cuentas segregadas en Barclays y NAB. Protección de saldo negativo en todas las entidades." },
      { name: "Costes de Trading", score: 9.6, weight: 20, detail: "Spread medio EUR/USD de 0,10 pips en cuenta Razor. Comisión de $7 por vuelta completa. Sin comisiones de depósito. Sin comisión de inactividad desde 2021." },
      { name: "Puntuación Trustpilot", score: 9.4, weight: 15, detail: "4,7/5 con más de 28.150 reseñas verificadas. Sentimiento sólido en torno a retiros rápidos y calidad del servicio al cliente." },
      { name: "Evaluación de Expertos", score: 9.5, weight: 20, detail: "Nuestro equipo probó cuentas Razor en MT4, MT5 y cTrader. Más de 200 operaciones ejecutadas. Velocidad media de llenado: 30 ms. Retiro en menos de 6 horas." },
      { name: "Plataformas y Herramientas", score: 9.5, weight: 10, detail: "MT4, MT5, cTrader y TradingView. Autochartist, Smart Trader Tools y soporte para trading vía API. VPS gratuito para traders activos." },
      { name: "Calidad de Ejecución", score: 9.4, weight: 10, detail: "Ejecución STP de modelo de agencia. Tasa de llenado superior al 99,7%. Sin mesa de operaciones. Soporta scalping, hedging y trading con EAs sin restricciones." },
    ],
    FAQ: [
      { q: "¿Es Pepperstone seguro y está regulado?", a: "Sí. Pepperstone tiene tres licencias Tier-1: FCA (Reino Unido), ASIC (Australia) y CySEC (Chipre). Estos son algunos de los reguladores financieros más estrictos del mundo, con requisitos de fondos segregados, protección de saldo negativo y auditorías periódicas. Pepperstone opera desde 2010 sin incidentes regulatorios graves. Los fondos de los clientes se custodian en Barclays (UK) y National Australia Bank." },
      { q: "¿Cuál es el depósito mínimo en Pepperstone?", a: "Pepperstone tiene un depósito mínimo de $0 — uno de los más bajos del sector. Puedes abrir una cuenta real y depositar cualquier cantidad para empezar a operar. La mayoría de los métodos de pago son gratuitos e inmediatos, incluyendo tarjetas, PayPal, Skrill y Neteller. Las transferencias bancarias también son gratuitas pero tardan 1-3 días hábiles." },
      { q: "¿Cómo se comparan los spreads de Pepperstone con IC Markets?", a: "Ambos ofrecen spreads raw desde 0,0 pips. IC Markets tiene una media ligeramente inferior en EUR/USD (0,02 vs 0,10 pips), mientras que Pepperstone suele igualar en otros pares. Las comisiones son idénticas a $3,50 por lote por lado en MT4/MT5. El depósito mínimo de $0 y la regulación FCA de Pepperstone lo hacen más accesible, mientras que IC Markets tiene spreads más ajustados y más instrumentos." },
      { q: "¿Soporta Pepperstone scalping y EAs?", a: "Sí. Pepperstone permite explícitamente scalping, hedging, trading en noticias y trading con Expert Advisors (EAs) en todos los tipos de cuenta. La cuenta Razor con spreads raw desde 0,0 pips y velocidad media de ejecución de 30 ms es ideal para estrategias de alta frecuencia. No hay distancias mínimas de stop ni restricciones de trading." },
      { q: "¿Qué tan rápidos son los retiros de Pepperstone?", a: "La velocidad de retiro depende del método. Los monederos electrónicos (PayPal, Skrill, Neteller) normalmente se procesan en 1-2 horas durante el horario hábil. Los retiros con tarjeta tardan 1-3 días hábiles. Las transferencias bancarias tardan 2-5 días hábiles. En nuestras pruebas, recibimos un retiro por PayPal en menos de 90 minutos tras enviar la solicitud." },
      { q: "¿Puedo usar Pepperstone desde Estados Unidos?", a: "No. Pepperstone no acepta clientes de Estados Unidos. Los traders estadounidenses deben considerar OANDA o IG (ambos regulados por la NFA). Pepperstone opera en más de 170 países a través de sus entidades FCA (UK/Europa), ASIC (Australia), CySEC (UE) y DFSA (EAU)." },
      { q: "¿Qué plataformas ofrece Pepperstone?", a: "Pepperstone soporta MetaTrader 4, MetaTrader 5, cTrader y TradingView. Todas las plataformas están disponibles en escritorio, web y móvil. Los usuarios de MT4/MT5 obtienen Smart Trader Tools gratuitos (28 complementos), Autochartist y trading vía API. cTrader ofrece precios de Nivel II y cAlgo para desarrollo automatizado en C#." },
      { q: "¿Qué es el programa Active Trader de Pepperstone?", a: "El programa Active Trader de Pepperstone ofrece descuentos por volumen para traders de alto volumen. Los descuentos van de $1 a $3 por lote según el volumen mensual. El programa está disponible para clientes que operan 100+ lotes al mes. Combinado con spreads raw y comisiones competitivas, Active Trader puede reducir significativamente los costes totales para traders profesionales." },
    ],
    content: {
      overview: [
        "Pepperstone es uno de los brokers de forex y CFD más grandes de Australia, operando ahora globalmente en más de 170 países con una sólida reputación por precios competitivos y servicio al cliente excepcional. Fundado en 2010 en Melbourne por Owen Kerr y Joe Davenport, el broker fue creado bajo el principio de que los traders minoristas merecen la misma calidad de ejecución y precios que anteriormente estaban reservados para clientes institucionales.",
        "Lo que distingue a Pepperstone es su combinación de depósito mínimo de $0 con ejecución ECN genuina a través de la cuenta Razor. Esto hace que el trading de nivel profesional sea accesible para traders de todos los niveles de experiencia — desde principiantes abriendo su primera cuenta hasta scalpers veteranos que operan cientos de lotes al día. El broker procesa más de $12.000 millones en volumen de trading diario.",
        "Pepperstone ofrece acceso a más de 1.200 instrumentos negociables: forex (60+ pares), índices, materias primas, criptomonedas, ETFs y acciones como CFDs. El broker soporta cuatro plataformas líderes — MetaTrader 4, MetaTrader 5, cTrader y TradingView — con Smart Trader Tools gratuitos que proporcionan 28 complementos adicionales para MT4/MT5.",
        "El perfil regulatorio del broker es excepcional: tres licencias Tier-1 de FCA (Reino Unido), ASIC (Australia) y CySEC (Chipre), más una licencia DFSA para clientes de Oriente Medio. Los fondos de los clientes se custodian en cuentas segregadas en Barclays (entidad UK) y National Australia Bank (entidad ASIC), con protección de saldo negativo en todas las entidades reguladas.",
      ],
      scoring: "Nuestra puntuación global de {score}/10 para Pepperstone refleja su excepcional perfil regulatorio, precios competitivos y excelente experiencia del cliente. Cada categoría se puntúa mediante pruebas reales y análisis de expertos — así se desempeñó Pepperstone:",
      accountIntro: "Pepperstone ofrece dos tipos principales de cuenta — Estándar y Razor — ambas disponibles con depósito mínimo de $0. La cuenta Estándar incluye todos los costes en el spread, mientras que la cuenta Razor ofrece spreads institucionales raw más una comisión.",
      accountOutro: "Ambos tipos de cuenta soportan hedging, scalping, EAs y trading en noticias sin restricciones. Las cuentas islámicas (sin swap) están disponibles previa solicitud. Las cuentas demo cuentan con $50.000 en fondos virtuales y replican las condiciones del trading real.",
      regulation: [
        "La triple regulación Tier-1 de Pepperstone es su principal diferenciador. Las licencias FCA (Reino Unido), ASIC (Australia) y CySEC (Chipre) representan el estándar más alto de supervisión financiera disponible para traders minoristas, con requisitos estrictos de adecuación de capital, segregación de fondos y auditoría regular.",
        "Bajo la regulación FCA, los clientes del Reino Unido se benefician de la protección del FSCS de hasta £85.000 por persona. Los clientes australianos regulados por ASIC tienen fondos segregados en NAB. Los clientes de CySEC están cubiertos por el ICF hasta €20.000. La entidad DFSA ofrece acceso para traders de EAU y Oriente Medio con un marco regulatorio de Nivel 2.",
      ],
      costs: [
        "Pepperstone obtiene un sólido 9,6/10 en costes de trading. La cuenta Razor ofrece spreads raw desde 0,0 pips con una comisión de $3,50 por lote por lado — igualando el estándar de la industria establecido por IC Markets y proporcionando precios institucionales genuinos a traders minoristas.",
        "La cuenta Estándar incluye todos los costes en spreads con una media de 1,0-1,3 pips en EUR/USD, adecuada para principiantes que prefieren precios simples. En la cuenta Razor, el coste total por lote estándar (vuelta completa) en EUR/USD promedia aproximadamente $8,00 (coste de spread + comisión de $7), que es muy competitivo.",
        "Pepperstone no cobra comisiones de depósito ni de retiro, y eliminó la comisión de inactividad globalmente en 2021. Las tasas de swap nocturnas son competitivas, y el programa Active Trader ofrece descuentos de hasta $3 por lote para clientes que operan 100+ lotes al mes.",
      ],
      spreads: [
        "Medimos los spreads medios de la cuenta Razor de Pepperstone junto a cuatro competidores principales durante la sesión solapada Londres/Nueva York. Todos los valores están en pips y reflejan los precios de las cuentas raw/ECN:",
        "Los spreads de Pepperstone son competitivos en todos los pares principales, aunque IC Markets mantiene una ligera ventaja en EUR/USD (0,02 vs 0,10 pips). La diferencia se reduce significativamente en pares cruzados y oro. Para la mayoría de los traders, la diferencia de spread es marginal — el depósito mínimo de $0 y la regulación FCA suelen ser más valiosos que una ventaja de 0,08 pips en el spread.",
      ],
      deposits: [
        "Pepperstone ofrece una experiencia de depósito y retiro completamente gratuita. No hay requisito de depósito mínimo, y todos los métodos de pago principales — tarjetas, PayPal, Skrill, Neteller, transferencia bancaria, POLi y BPay — se procesan sin comisiones.",
        "En nuestras pruebas, los depósitos con tarjeta de crédito se acreditaron al instante, y un retiro de $500 por PayPal se recibió en menos de 90 minutos. Las transferencias bancarias tardaron 2 días hábiles. Pepperstone soporta 10 divisas base: AUD, USD, EUR, GBP, CHF, JPY, NZD, SGD, HKD y CAD.",
      ],
      platforms: [
        "Pepperstone soporta cuatro plataformas de trading principales, convirtiéndolo en uno de los brokers más versátiles en cuanto a elección de plataforma. Todas las plataformas se conectan a la misma liquidez y ejecución de grado institucional.",
        "MetaTrader 4 y MT5 se mejoran con el paquete gratuito de Smart Trader Tools — 28 complementos profesionales incluyendo una matriz de correlación, mapa de sesiones, gestor de alarmas, trader de sentimiento y mini terminal. Combinado con Autochartist para el reconocimiento automatizado de patrones y acceso a la API para integraciones personalizadas, esto hace que la oferta de MT4/MT5 de Pepperstone sea una de las mejores del sector.",
        "cTrader proporciona precios de Nivel II, tipos de órdenes avanzados y cAlgo para el desarrollo de estrategias automatizadas en C#. La integración con TradingView permite la ejecución directa de órdenes desde la interfaz de gráficos líder del sector. VPS gratuito disponible para traders que cumplan los requisitos mínimos de capital.",
      ],
      mobile: [
        "Pepperstone ofrece trading móvil a través de las apps de MT4, MT5 y cTrader en iOS y Android. Todas las apps soportan funcionalidad completa de trading, incluyendo colocación de órdenes, análisis de gráficos con indicadores técnicos y notificaciones push para alertas de precios y ejecución de operaciones.",
        "La app móvil de cTrader destaca con su interfaz moderna, capacidades avanzadas de gráficos con más de 70 indicadores y soporte completo para tipos de órdenes complejos. Pepperstone también ofrece acceso móvil a sus herramientas propias a través de la app de trading de Pepperstone, que incluye análisis de mercado, contenido educativo y gestión de cuentas.",
      ],
      support: [
        "El soporte al cliente de Pepperstone es uno de los mejores del sector. El chat en vivo está disponible 24/5 (24/7 para problemas urgentes) con tiempos de espera medios inferiores a 2 minutos en nuestras pruebas. Los agentes de soporte son competentes, profesionales y capaces de resolver problemas rápidamente sin escalaciones excesivas.",
        "El soporte está disponible en 10 idiomas vía chat en vivo, correo electrónico y teléfono desde oficinas en Melbourne, Londres, Limasol, Dubái, Nairobi y Nassau. Las respuestas por correo electrónico promediaron 3 horas en nuestras pruebas. Pepperstone también proporciona gestores de relaciones dedicados para traders de alto volumen a través del programa Active Trader.",
      ],
      education: [
        "Pepperstone proporciona contenido educativo sólido, incluyendo tutoriales en vídeo, guías de trading, webinars y un glosario completo. El hub Learn to Trade cubre temas desde conceptos básicos de forex hasta estrategias avanzadas de análisis técnico. La calidad del contenido es buena, aunque no iguala la profundidad de IG Academy o la plataforma educativa de XM.",
        "La oferta de investigación incluye análisis de mercado diario del equipo interno, integración de Trading Central en MT4/MT5 y Autochartist para reconocimiento de patrones. El blog de Pepperstone y su canal de YouTube proporcionan comentarios de mercado y perspectivas de trading periódicas.",
      ],
      trustpilot: "Pepperstone mantiene una sólida puntuación de 4,7/5 en Trustpilot con más de 28.000 reseñas verificadas. Las reseñas positivas destacan consistentemente los retiros rápidos (a menudo en pocas horas), el soporte al cliente receptivo y los spreads competitivos. Las quejas más comunes se relacionan con spreads ocasionalmente más amplios en períodos de baja liquidez y la profundidad educativa limitada.",
      country: "Pepperstone acepta clientes de más de 170 países. La asignación de entidad depende de la residencia: FCA (Reino Unido y gran parte de Europa), CySEC (cobertura adicional UE/EEE), ASIC (Australia, NZ), DFSA (EAU, Oriente Medio) o SCB Bahamas (resto del mundo). Las exclusiones notables incluyen Estados Unidos, Canadá y Japón.",
      verdict: [
        "Pepperstone obtiene nuestro premio al Mejor Broker Global para 2026. La combinación de depósito mínimo de $0, triple regulación Tier-1, spreads raw desde 0,0 pips, cuatro plataformas de trading y soporte al cliente de primera clase crea un paquete que se adapta prácticamente a cualquier tipo de trader.",
        "Las únicas áreas donde Pepperstone se queda ligeramente atrás son el rango de instrumentos (1.200+ vs 2.250+ en IC Markets) y el spread medio EUR/USD (0,10 vs 0,02 pips). Pero para la gran mayoría de traders, estas diferencias son marginales. Si quieres un broker que haga todo bien con regulación sólida y sin barreras de entrada, Pepperstone es nuestra primera recomendación.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     3. IG  (top-5 → full translation)
  ───────────────────────────────────────────── */
  "ig": {
    verdict: "Excelente",
    promo: "Más de 50 años de confianza — el proveedor de CFDs nº 1 del mundo",
    PROS: [
      "El broker más regulado del mundo — 4 licencias Tier-1 (FCA, ASIC, NFA, MAS)",
      "Más de 50 años de operación y cotiza en la Bolsa de Londres",
      "Más de 17.000 instrumentos negociables — la mayor selección de cualquier broker minorista",
      "La plataforma IG Trading es consistentemente valorada como la nº 1 en usabilidad y funciones",
      "IG Academy proporciona el mejor contenido educativo del sector",
      "ProRealTime y L2 Dealer para gráficos profesionales y acceso directo al mercado (DMA)",
      "Depósito mínimo de $0 sin comisiones de mantenimiento de cuenta",
      "Uno de los dos únicos brokers que acepta clientes de EE.UU. (junto con OANDA)",
    ],
    CONS: [
      "Modelo de creador de mercado para cuentas estándar — posible conflicto de intereses",
      "Spreads más amplios que los brokers ECN (0,60 vs 0,02 pips EUR/USD)",
      "La cuenta DMA tiene tamaño mínimo de operación y mayores requisitos",
      "Comisión de inactividad mensual de $12 tras 2 años sin operar",
      "ProRealTime requiere £30/mes (gratuito con 4+ operaciones al mes)",
      "La calidad del soporte al cliente es inconsistente — se reportan tiempos de espera largos",
    ],
    SCORES: [
      { name: "Regulación y Seguridad", score: 9.9, weight: 25, detail: "Cuatro licencias Tier-1: FCA, ASIC, NFA, MAS. Cotiza en la Bolsa de Londres (IGG). 50 años de operación. El estándar de oro de la regulación de brokers." },
      { name: "Costes de Trading", score: 8.8, weight: 20, detail: "Spread medio EUR/USD de 0,60 pips, solo spread. Sin comisión en cuenta estándar. Cuenta DMA disponible con precios raw. Competitivo para creador de mercado." },
      { name: "Puntuación Trustpilot", score: 8.4, weight: 15, detail: "4,2/5 con más de 18.640 reseñas. Menor que los brokers ECN puros por el modelo de creador de mercado. Factor de confianza muy alto por los 50 años de historia." },
      { name: "Evaluación de Expertos", score: 9.6, weight: 20, detail: "Probamos cuentas estándar y DMA. La plataforma propia es la mejor del sector. Más de 200 operaciones. Excelente investigación y herramientas de análisis premium." },
      { name: "Plataformas y Herramientas", score: 9.8, weight: 10, detail: "La plataforma IG Trading es best-in-class. ProRealTime para gráficos avanzados. L2 Dealer para DMA. MT4 también disponible. Suite de plataformas excepcional." },
      { name: "Calidad de Ejecución", score: 9.4, weight: 10, detail: "DMA disponible para traders profesionales. Modelo de creador de mercado para minoristas. Tasa de llenado del 99,9%. Ejecución media de 14 ms. Estadísticas publicadas." },
    ],
    FAQ: [
      { q: "¿Es IG el broker más fiable?", a: "Por la mayoría de medidas, sí. IG está regulado por 4 autoridades Tier-1 (FCA, ASIC, NFA, MAS), cotiza en la Bolsa de Londres desde 2003 y lleva más de 50 años operando sin incidentes regulatorios graves. Es uno de los dos únicos brokers que acepta clientes de EE.UU. legalmente, lo que refleja los requisitos regulatorios más estrictos." },
      { q: "¿Cuál es el depósito mínimo en IG?", a: "IG no tiene depósito mínimo. Puedes abrir una cuenta y financiarla con cualquier cantidad. La mayoría de los métodos de depósito son gratuitos e instantáneos (tarjetas, PayPal). IG también ofrece cuentas de inversión en acciones e ISA para inversores del Reino Unido junto a su plataforma de CFDs." },
      { q: "¿Cuántos instrumentos ofrece IG?", a: "IG ofrece más de 17.000 instrumentos negociables — la mayor selección de cualquier broker minorista. Esto incluye 80+ pares de divisas, 12.000+ CFDs sobre acciones, 80+ índices, 25+ materias primas, bonos, opciones e índices sectoriales. IG también ofrece spread betting para clientes del Reino Unido." },
      { q: "¿Qué es IG Academy?", a: "IG Academy es la plataforma educativa integral de IG que ofrece cursos estructurados de principiante a avanzado. Cubre forex, acciones, opciones, análisis técnico y gestión de riesgos mediante lecciones interactivas, cuestionarios y contenido en vídeo. Es consistentemente valorada como el mejor recurso educativo entre los brokers de forex." },
      { q: "¿Puedo usar IG desde Estados Unidos?", a: "Sí. IG es uno de los dos únicos brokers (junto con OANDA) que acepta clientes estadounidenses para trading de forex, regulado por la NFA y la CFTC. La oferta de EE.UU. incluye 80+ pares de divisas, pero no incluye CFDs ni spread betting debido a las regulaciones de EE.UU." },
      { q: "¿Ofrece IG trading DMA?", a: "Sí. La cuenta Forex Direct (DMA) de IG proporciona spreads raw desde 0,0 pips con una comisión. L2 Dealer proporciona profundidad de mercado de Nivel 2 y acceso DMA para CFDs sobre acciones. El DMA está disponible junto a la cuenta estándar de creador de mercado." },
      { q: "¿Qué tan buena es la plataforma IG Trading?", a: "La plataforma IG Trading está consistentemente clasificada como la nº 1 entre las plataformas propias de brokers. Incluye gráficos avanzados con 100+ indicadores, noticias e investigación integradas, diseños personalizables y ejecución rápida. La plataforma basada en web no requiere descarga y funciona perfectamente en todos los dispositivos." },
      { q: "¿Es IG adecuado para principiantes?", a: "Sí. A pesar de ser rico en funciones, la plataforma de IG es intuitiva y IG Academy proporciona el mejor contenido educativo del sector. El depósito mínimo de $0, la cuenta demo y el spread betting (Reino Unido) lo hacen accesible. Sin embargo, los principiantes deben tener en cuenta que el 69% de las cuentas minoristas pierden dinero operando CFDs con IG." },
    ],
    content: {
      overview: [
        "IG es el broker de trading online más antiguo y más regulado del mundo, fundado en 1974 por Stuart Wheeler en Londres como 'Investors Gold Index' — una de las primeras empresas en ofrecer spread betting financiero. Ahora cotiza en la Bolsa de Londres (LSE: IGG), IG ha evolucionado hasta convertirse en una institución financiera global que atiende a más de 313.000 clientes activos en más de 200 países.",
        "Lo que hace único a IG es la combinación de trayectoria, regulación y escala. Con cuatro licencias Tier-1 (FCA, ASIC, NFA, MAS), IG es posiblemente el broker más seguro disponible para traders minoristas. La adquisición de tastytrade en 2022 amplió aún más su presencia en EE.UU., convirtiéndolo en uno de los dos únicos brokers que acepta legalmente traders americanos de forex.",
        "IG ofrece más de 17.000 instrumentos negociables: forex (80+ pares), CFDs sobre acciones (12.000+), índices, materias primas, bonos, opciones e instrumentos sectoriales. Los clientes del Reino Unido también pueden acceder a spread betting y gestión de acciones a través de cuentas ISA. La amplitud de mercados es incomparable frente a cualquier competidor.",
        "La plataforma IG Trading está consistentemente valorada como la mejor plataforma propia del sector. Combinada con ProRealTime para gráficos avanzados, L2 Dealer para ejecución DMA, MT4 para trading algorítmico e IG Academy para educación, el ecosistema de plataformas proporciona desde tutoriales para principiantes hasta herramientas de grado institucional.",
      ],
      scoring: "Nuestra puntuación global de {score}/10 para IG refleja su incomparable perfil regulatorio, vasto rango de instrumentos y plataforma premium — equilibrado con spreads más amplios típicos de la ejecución de creador de mercado. Desglose detallado:",
      accountIntro: "IG ofrece una estructura de cuenta sencilla. La cuenta Estándar cubre las necesidades de la mayoría de traders con precios basados solo en spread. La cuenta DMA (Forex Direct) proporciona spreads raw y comisión para traders profesionales.",
      accountOutro: "IG también ofrece cuentas de inversión en acciones, ISAs (Reino Unido) y SIPP (Reino Unido) para inversores a largo plazo. Las cuentas demo proporcionan £10.000 en fondos virtuales. Las cuentas islámicas están disponibles para trading sin swap. Las cuentas corporativas y profesionales desbloquean mayor apalancamiento.",
      regulation: [
        "El perfil regulatorio de IG es el más sólido de la industria de trading minorista. Cuatro licencias Tier-1 — FCA (195355), ASIC (515106), NFA (0509630) y MAS (CMS100917) — cubren prácticamente todos los mercados principales. La licencia FCA, en vigor desde los inicios del regulador, proporciona a los clientes del Reino Unido protección del FSCS hasta £85.000.",
        "Como empresa cotizada en la Bolsa de Londres, IG está sujeta a requisitos adicionales de divulgación financiera, informes trimestrales de resultados y auditoría independiente. Este nivel de transparencia es incomparable para cualquier broker de propiedad privada. El balance y el dinero de clientes de IG son examinados tanto por reguladores como por analistas del mercado público.",
      ],
      costs: [
        "La cuenta estándar de IG ofrece precios competitivos de creador de mercado con un promedio de 0,60 pips en EUR/USD sin comisión — un coste total de aproximadamente $6,00 por lote estándar. Aunque más amplio que los brokers ECN, este es uno de los mejores precios de creador de mercado disponibles.",
        "La cuenta DMA (Forex Direct) proporciona spreads raw desde 0,0 pips con comisiones basadas en volumen a partir de $3,00 por $100.000 operado. Para traders de alto volumen, la cuenta DMA puede rivalizar con los precios de brokers ECN mientras mantiene las ventajas de la plataforma premium e investigación de IG.",
        "IG no cobra comisiones de depósito ni retiro. Una comisión de inactividad de $12/mes se aplica tras 2 años consecutivos sin operar — fácilmente evitable manteniendo cualquier actividad de trading. ProRealTime cuesta £30/mes pero se exime con 4+ operaciones al mes.",
      ],
      spreads: [
        "Comparamos los spreads de la cuenta estándar de IG con cuatro competidores durante el solapamiento horario pico Londres/Nueva York. Las cifras de IG representan costes totales (sin comisión) mientras que los competidores ECN muestran solo spreads raw:",
        "Los spreads de IG son competitivos con otros grandes creadores de mercado como CMC Markets y Saxo Bank. La diferencia frente a los brokers ECN (0,60 vs 0,02 pips en EUR/USD) refleja el diferente modelo de ejecución de IG. Para traders que valoran la calidad de plataforma, investigación y rango de instrumentos sobre el coste de spread puro, IG ofrece un valor excelente.",
      ],
      deposits: [
        "IG ofrece una experiencia de financiación sencilla con depósito mínimo de $0 y sin comisiones en ningún método de depósito o retiro. Las tarjetas y PayPal se acreditan al instante, mientras que las transferencias bancarias tardan 1-3 días hábiles.",
        "En nuestras pruebas, un depósito de £500 con tarjeta se acreditó en menos de 30 segundos. Un retiro de £300 a cuenta bancaria se procesó en 1 día hábil. IG soporta GBP, USD, EUR, AUD, CHF, JPY y SGD como divisas base.",
      ],
      platforms: [
        "La plataforma IG Trading es la joya de la corona de IG y está consistentemente clasificada como la nº 1 entre las plataformas propias de brokers. La plataforma web incluye 100+ indicadores técnicos, herramientas de dibujo, diseños personalizables, noticias de Reuters integradas y análisis de mercado en vídeo (IGTV). Es rápida, intuitiva y no requiere instalación.",
        "ProRealTime es la plataforma de gráficos avanzados de IG con 100+ indicadores, estrategias de trading automatizadas y backtesting. L2 Dealer ofrece profundidad de mercado de Nivel 2 para trading DMA en CFDs sobre acciones y forex con acceso directo a la bolsa.",
        "MetaTrader 4 también está disponible para traders que prefieren el trading algorítmico con EAs. La oferta de MT4 de IG incluye 18 indicadores y complementos adicionales gratuitos. La combinación de cuatro plataformas distintas garantiza que todos los estilos y niveles de experiencia estén cubiertos.",
      ],
      mobile: [
        "La app móvil de IG es una de las mejores del sector, disponible en iOS y Android. Reproduce la funcionalidad de la plataforma web con gráficos completos, 35+ indicadores, integración de noticias, alertas de precios y gestión de órdenes sin interrupciones. La app ha sido descargada más de 5 millones de veces.",
        "Las funciones incluyen tipos de gráficos avanzados, herramientas de dibujo, listas de seguimiento personalizables y notificaciones push. La app móvil de IG también integra IG Academy para aprendizaje en movimiento e IGTV para análisis de mercado en vídeo.",
      ],
      support: [
        "IG ofrece soporte al cliente 24/5 vía teléfono, correo electrónico y chat en vivo. Como institución grande, la calidad del soporte puede ser inconsistente — nuestras pruebas encontraron tiempos de espera en el chat en vivo que variaron de 2 a 15 minutos según el momento. El soporte telefónico fue generalmente más rápido y fiable.",
        "IG mantiene oficinas en 17 países con números de soporte locales dedicados. El Centro de Ayuda es completo con artículos de preguntas frecuentes que cubren gestión de cuentas, uso de plataforma y condiciones de trading. Los clientes profesionales y de alto valor reciben soporte prioritario con gestores de relaciones dedicados.",
      ],
      education: [
        "IG Academy es el estándar de oro de la educación de brokers. La plataforma ofrece cursos estructurados e interactivos sobre forex, acciones, opciones, análisis técnico, análisis fundamental y gestión de riesgos. El contenido va desde nivel absolutamente principiante hasta avanzado con cuestionarios y seguimiento del progreso.",
        "Las herramientas de investigación incluyen análisis diario del equipo interno de IG, integración de noticias de Reuters, señales de Trading Central e IGTV para análisis de vídeo. El foro de la Comunidad IG permite a los traders compartir ideas y estrategias. Para traders que valoran la educación e investigación junto al trading, IG no tiene rival.",
      ],
      trustpilot: "IG tiene una puntuación de 4,2/5 en Trustpilot con más de 18.600 reseñas verificadas. Las reseñas positivas elogian la calidad de la plataforma, el rango de instrumentos y la seguridad regulatoria. Las valoraciones más bajas en comparación con brokers ECN reflejan los spreads más amplios y los ocasionales retrasos en atención al cliente típicos de las grandes instituciones.",
      country: "IG acepta clientes de más de 200 países incluyendo Estados Unidos — uno de los dos únicos brokers con regulación NFA/CFTC para trading de forex en EE.UU. El spread betting está disponible exclusivamente para residentes del Reino Unido e Irlanda.",
      verdict: [
        "IG obtiene nuestro premio al Broker Más Fiable para 2026. Con cuatro licencias Tier-1, más de 50 años de operación, una cotización en la Bolsa de Londres y los mejores recursos de plataforma y educación del sector, IG establece el estándar de lo que debe ofrecer un broker premium. El rango de más de 17.000 instrumentos garantiza que puedas operar prácticamente cualquier mercado.",
        "El precio de esta experiencia premium son spreads más amplios (0,60 pips EUR/USD) en comparación con los brokers ECN. Los scalpers y traders obsesionados con el coste encontrarán mejores precios en IC Markets o Tickmill. Pero para traders que valoran la seguridad, la calidad de la plataforma, la educación y la amplitud de mercado sobre todo lo demás, IG es la elección definitiva.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     4. FP MARKETS  (top-5 → full translation)
  ───────────────────────────────────────────── */
  "fp-markets": {
    verdict: "Excelente",
    promo: "Spreads ECN de 0,0 pips + plataforma DMA IRESS",
    PROS: [
      "Spreads ECN ultra-ajustados desde 0,0 pips con la comisión más baja del sector: $6 por vuelta completa",
      "Regulación Tier-1 dual (ASIC + CySEC) con 19 años de historial limpio de operación",
      "Más de 10.000 instrumentos negociables — uno de los rangos más amplios del sector",
      "La plataforma IRESS ofrece acceso DMA real a bolsas ASX, NYSE y LSE",
      "Cuatro plataformas de trading: MT4, MT5, cTrader e IRESS",
      "Depósito mínimo competitivo de $100 para ejecución de calidad ECN",
      "Integración de Myfxbook AutoTrade para copy trading",
      "VPS gratuito para traders que cumplan los requisitos",
    ],
    CONS: [
      "La cuenta DMA de IRESS requiere un depósito mínimo de $1.000 y cobra comisión porcentual",
      "Menor reconocimiento de marca que Pepperstone o IC Markets a pesar de su excelente calidad",
      "Los tiempos de espera en atención al cliente pueden alcanzar 5-8 minutos en horas pico",
      "La entidad FSCA de Sudáfrica tiene menor protección regulatoria",
      "El contenido educativo es básico comparado con IG o XM",
      "Sin integración con TradingView a principios de 2026",
    ],
    SCORES: [
      { name: "Regulación y Seguridad", score: 9.5, weight: 25, detail: "Regulación Tier-1 dual (ASIC + CySEC). 19 años de operación desde 2005. Fondos de clientes segregados en NAB. Seguro de responsabilidad profesional." },
      { name: "Costes de Trading", score: 9.7, weight: 20, detail: "Spread medio EUR/USD de 0,05 pips en cuenta Raw. Comisión de $6 por vuelta completa. Uno de los costes totales más bajos del sector." },
      { name: "Puntuación Trustpilot", score: 9.6, weight: 15, detail: "4,8/5 con más de 12.580 reseñas verificadas. Puntuación excepcional para un broker ECN. Fuerte sentimiento sobre calidad de spread y estabilidad de plataforma." },
      { name: "Evaluación de Expertos", score: 9.3, weight: 20, detail: "Pruebas en vivo en cuentas Raw ECN e IRESS DMA. Más de 180 operaciones. Ejecución media de 35 ms. IRESS proporciona acceso directo real al mercado en bolsas." },
      { name: "Plataformas y Herramientas", score: 9.5, weight: 10, detail: "MT4, MT5, cTrader y la exclusiva plataforma IRESS para trading DMA de acciones. Myfxbook AutoTrade para copy trading. VPS disponible." },
      { name: "Calidad de Ejecución", score: 9.3, weight: 10, detail: "Ejecución ECN real con liquidez profunda. Sin mesa de operaciones. Llenado medio en 35 ms. Compatible con scalping, hedging y trading algorítmico." },
    ],
    FAQ: [
      { q: "¿Es FP Markets un broker fiable?", a: "Sí. FP Markets opera desde 2005 — uno de los brokers de forex australianos con mayor trayectoria. Tiene licencias Tier-1 de ASIC y CySEC con historial regulatorio limpio. Los fondos de los clientes están segregados en NAB. El broker también mantiene seguro de responsabilidad profesional para protección adicional del cliente." },
      { q: "¿Qué diferencia a FP Markets de IC Markets?", a: "Ambos ofrecen ejecución ECN desde 0,0 pips. El diferenciador clave de FP Markets es la plataforma DMA IRESS, que proporciona acceso real a nivel de bolsa para CFDs sobre acciones en ASX, NYSE, NASDAQ y LSE. FP Markets también tiene comisiones más bajas ($6 vs $7 por vuelta completa). IC Markets tiene spreads EUR/USD más ajustados (0,02 vs 0,05 pips) y más pares de forex." },
      { q: "¿Cuál es el depósito mínimo en FP Markets?", a: "El depósito mínimo es de $100 AUD (o equivalente) para las cuentas Estándar y Raw ECN. La cuenta DMA de IRESS requiere un mínimo de $1.000. Todos los métodos de depósito excepto la transferencia bancaria se procesan al instante. Sin comisiones de depósito." },
      { q: "¿Soporta FP Markets la plataforma IRESS?", a: "Sí. FP Markets es uno de los pocos brokers del mundo que ofrece la plataforma IRESS Trader, que proporciona acceso DMA a mercados de renta variable incluyendo ASX, NYSE, NASDAQ y LSE. IRESS ofrece profundidad de mercado, órdenes condicionales, gestión de cartera y datos de mercado en tiempo real." },
      { q: "¿Son rápidos los retiros de FP Markets?", a: "Sí. En nuestras pruebas, los retiros por monedero electrónico (Skrill, Neteller) se procesaron en 2-4 horas. Los retiros con tarjeta tardaron 1-2 días hábiles y las transferencias bancarias 2-3 días hábiles. FP Markets procesa el primer retiro diario de forma gratuita." },
      { q: "¿Puedo hacer scalping con FP Markets?", a: "Sí. FP Markets permite scalping, hedging y trading con EAs sin restricciones en todos los tipos de cuenta. La cuenta Raw ECN con spreads de 0,0 pips y ejecución media de 35 ms es muy adecuada para estrategias de alta frecuencia. No aplica tiempo mínimo de permanencia." },
      { q: "¿Qué instrumentos puedo operar en FP Markets?", a: "FP Markets ofrece más de 10.000 instrumentos incluyendo 60+ pares de forex, índices, materias primas, cripto (12 monedas), metales y 8.000+ CFDs sobre acciones a través de la plataforma IRESS. Es uno de los rangos de instrumentos más amplios de cualquier broker minorista." },
      { q: "¿Ofrece FP Markets copy trading?", a: "Sí. FP Markets ofrece copy trading a través de la integración de Myfxbook AutoTrade, que permite replicar automáticamente las operaciones de proveedores de señales exitosos. El servicio es gratuito y funciona con cuentas MT4 y MT5. Sin recargo en las operaciones copiadas." },
    ],
    content: {
      overview: [
        "FP Markets es un broker ECN y DMA australiano que ha construido silenciosamente una de las ofertas más impresionantes del sector de trading minorista. Fundado en 2005 en Sídney, tiene 19 años de historial regulatorio limpio y ofrece acceso a más de 10.000 instrumentos negociables — un número igualado solo por IG y Saxo Bank entre los principales brokers.",
        "El punto diferenciador único del broker es la plataforma IRESS — una plataforma de Acceso Directo al Mercado (DMA) de grado profesional que conecta a los traders directamente con los libros de órdenes de las bolsas ASX, NYSE, NASDAQ y LSE. Esto convierte a FP Markets en uno de los pocos brokers donde puedes operar forex en una cuenta Raw ECN y acciones en una plataforma DMA genuina bajo el mismo techo.",
        "Para traders de forex y CFDs, FP Markets ofrece las plataformas estándar MT4, MT5 y cTrader con spreads Raw ECN desde 0,0 pips y una comisión de $3,00 por lote por lado — $1 más barato por vuelta completa que el estándar de IC Markets y Pepperstone. Esto lo convierte en uno de los brokers ECN más rentables disponibles.",
        "Regulado por ASIC (Australia) y CySEC (Chipre), FP Markets proporciona protección regulatoria Tier-1 dual con segregación de fondos de clientes en National Australia Bank. El historial de 19 años sin incidentes regulatorios del broker proporciona confianza adicional en su integridad operacional.",
      ],
      scoring: "Nuestra puntuación global de {score}/10 para FP Markets refleja sus costes de trading excepcionales, profundo rango de instrumentos y sólido perfil regulatorio. Cada puntuación se deriva de pruebas prácticas y evaluación de expertos:",
      accountIntro: "FP Markets ofrece tres tipos de cuenta diseñados para diferentes estilos de trading. Las cuentas Estándar y Raw ECN comparten un depósito mínimo de $100, mientras que la cuenta DMA de IRESS se dirige a traders enfocados en renta variable con un mínimo de $1.000.",
      accountOutro: "Todas las cuentas de forex/CFD soportan hedging, scalping y trading con EAs. Las cuentas islámicas están disponibles. Las cuentas demo replican las condiciones reales con $100.000 en fondos virtuales. La cuenta IRESS proporciona profundidad de mercado de Nivel 2 y tipos de órdenes condicionales no disponibles en MT4/MT5.",
      regulation: [
        "FP Markets tiene regulación Tier-1 dual de ASIC (Australia, licencia 286354) y CySEC (Chipre, licencia 371/18). Ambos reguladores imponen requisitos estrictos incluyendo cuentas de clientes segregadas, protección de saldo negativo, adecuación de capital y auditoría externa periódica. La licencia FSCA (Sudáfrica) proporciona cobertura adicional para clientes africanos.",
        "Los fondos de clientes bajo la entidad ASIC se custodian en cuentas fiduciarias segregadas en National Australia Bank. Los clientes de CySEC están cubiertos por el Fondo de Compensación de Inversores (ICF) hasta €20.000. FP Markets también mantiene seguro de responsabilidad profesional, proporcionando una capa adicional de protección que muchos competidores no ofrecen.",
      ],
      costs: [
        "Los costes de trading son una de las áreas más fuertes de FP Markets, obteniendo un 9,7/10 en nuestra evaluación. La cuenta Raw ECN ofrece spreads desde 0,0 pips con una comisión de $3,00 por lote por lado ($6 por vuelta completa) — la más baja entre los principales brokers regulados por ASIC.",
        "En EUR/USD, el spread medio es de 0,05 pips, resultando en un coste total por lote estándar de aproximadamente $6,50 por vuelta completa. Esto supera tanto a IC Markets ($7,02) como a Pepperstone ($8,00). La cuenta Estándar incluye todos los costes en spreads con un promedio de 1,0-1,2 pips en EUR/USD.",
        "FP Markets no cobra comisiones de depósito y ofrece un retiro gratuito al día. Hay una comisión de inactividad de $10 tras 12 meses sin operar, pero se exime si mantienes una posición abierta. Las tasas de swap nocturnas son estándar y se publican en el sitio web del broker.",
      ],
      spreads: [
        "Comparamos los spreads Raw ECN de FP Markets con cuatro competidores durante las horas de mayor liquidez (solapamiento Londres/Nueva York). Todas las cifras representan spreads medios en pips para tipos de cuenta raw/ECN:",
        "FP Markets ofrece spreads consistentemente ajustados que se sitúan entre IC Markets y Pepperstone en la mayoría de pares. La comisión de $6 por vuelta completa proporciona una ventaja de coste total que convierte a FP Markets en la opción más rentable para traders que ejecutan más de 10 lotes al día en EUR/USD.",
      ],
      deposits: [
        "FP Markets soporta una amplia gama de métodos de depósito con un mínimo de $100. Todos los depósitos se procesan de forma gratuita, con la mayoría de métodos de monedero electrónico acreditados al instante. Las transferencias bancarias tardan 1-3 días hábiles según tu ubicación.",
        "En nuestras pruebas, un depósito con tarjeta de crédito de $500 se acreditó en menos de 30 segundos. Un retiro por Skrill de $300 se procesó en menos de 3 horas. Las transferencias bancarias tardaron 2 días hábiles. FP Markets soporta 10 divisas base incluyendo AUD, USD, EUR, GBP, SGD, JPY, NZD, CAD, HKD y CHF.",
      ],
      platforms: [
        "FP Markets destaca con cuatro plataformas de trading — tres estándar (MT4, MT5, cTrader) más la plataforma profesional IRESS. Este rango atiende a todos los perfiles, desde traders minoristas principiantes hasta inversores profesionales de renta variable que buscan acceso directo al mercado.",
        "MetaTrader 4 y MT5 proporcionan la experiencia de trading minorista familiar con indicadores, EAs y trading con un clic. cTrader añade precios de Nivel II, desarrollo algorítmico en C# y gestión avanzada de órdenes. Las tres plataformas se conectan al mismo pool de liquidez ECN con spreads raw.",
        "La plataforma IRESS es la joya de la corona de FP Markets — proporciona Acceso Directo al Mercado real a bolsas de renta variable incluyendo ASX, NYSE, NASDAQ, LSE y HKE. Los traders ven libros de órdenes de bolsa en vivo, ejecutan a precios de nivel de bolsa y acceden a funciones institucionales como órdenes condicionales y analíticas de cartera.",
      ],
      mobile: [
        "El trading móvil está disponible a través de las apps de MT4, MT5 y cTrader en iOS y Android, todas ofreciendo funcionalidad completa para análisis de gráficos, gestión de órdenes y monitorización de cuentas. IRESS también tiene una plataforma web con versión móvil adaptada para trading de renta variable DMA en movimiento.",
        "La app móvil de cTrader proporciona la mejor experiencia móvil con gráficos avanzados (70+ indicadores), soporte completo para tipos de órdenes y una interfaz moderna y limpia. Las notificaciones push mantienen a los traders informados sobre alertas de precios y confirmaciones de ejecución en todas las plataformas móviles.",
      ],
      support: [
        "FP Markets ofrece soporte al cliente multilingüe 24/5 vía chat en vivo, correo electrónico y teléfono. En nuestras pruebas, los tiempos de espera en el chat en vivo promediaron 3-5 minutos durante las horas pico y menos de 2 minutos en horas de baja actividad. Las respuestas por correo electrónico se recibieron en 4-6 horas. La calidad del soporte fue buena con agentes competentes.",
        "El broker tiene oficinas en Sídney y Limasol con soporte disponible en inglés, árabe, chino, vietnamita, tailandés y varios otros idiomas. Aunque el soporte es competente, no iguala los tiempos de respuesta casi instantáneos de Pepperstone o IG durante las horas pico de trading.",
      ],
      education: [
        "La oferta educativa de FP Markets es adecuada pero no destaca especialmente. El broker proporciona tutoriales en vídeo básicos, guías de trading y un glosario de forex. Los webinars semanales cubren análisis de mercado y uso de plataformas. Para principiantes, el contenido cubre conceptos esenciales pero carece del formato de curso estructurado de IG Academy.",
        "Las herramientas de investigación incluyen análisis técnico diario del equipo interno, señales de Trading Central en MT4/MT5 y un calendario económico. El blog de FP Markets proporciona comentarios de mercado periódicos. La integración de Autochartist está disponible para el reconocimiento automatizado de patrones de gráficos en múltiples marcos temporales.",
      ],
      trustpilot: "FP Markets tiene una excepcional puntuación de 4,8/5 en Trustpilot con más de 12.500 reseñas verificadas — una de las puntuaciones más altas del sector. Las reseñas positivas destacan consistentemente los spreads ajustados, la ejecución rápida y el valor único de la plataforma DMA de IRESS. Los comentarios negativos son escasos pero ocasionalmente mencionan tiempos de respuesta del soporte al cliente durante horas pico.",
      country: "FP Markets acepta clientes de más de 80 países en seis continentes. Asignación de entidad: ASIC (Australia, NZ), CySEC (UE/EEE) o FSCA (Sudáfrica y resto del mundo). Las exclusiones notables incluyen Estados Unidos, Canadá, Japón y Bélgica.",
      verdict: [
        "FP Markets obtiene nuestro premio al Mejor Broker ECN para 2026. La combinación de spreads Raw ECN ultra-ajustados (media de 0,05 pips EUR/USD), la comisión más baja del sector de $6 por vuelta completa, más de 10.000 instrumentos y la exclusiva plataforma DMA IRESS crea una oferta que rivaliza y en algunos aspectos supera a IC Markets y Pepperstone.",
        "El depósito mínimo de $100, aunque no tan bajo como el $0 de Pepperstone, sigue siendo accesible. El principal inconveniente es el menor reconocimiento de marca — muchos traders no han oído hablar de FP Markets a pesar de sus 19 años de historia y sus valoraciones excepcionales. Si eres un trader activo que busca los menores costes ECN posibles o un trader de acciones que desea acceso DMA real a bolsas, FP Markets merece una consideración seria.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     5. CMC MARKETS  (top-5 → full translation)
  ───────────────────────────────────────────── */
  "cmc-markets": {
    verdict: "Excelente",
    promo: "Plataforma Next Generation galardonada — más de 12.000 instrumentos",
    PROS: [
      "Plataforma Next Generation — consistentemente valorada entre las 2 mejores plataformas propias",
      "Más de 12.000 instrumentos negociables, incluyendo índices de nicho, cestas de acciones y pares de forex",
      "Cuatro licencias Tier-1 (FCA, ASIC, MAS, BaFin) — regulación excepcional",
      "Cotiza en la Bolsa de Londres para máxima transparencia corporativa",
      "Depósito mínimo de $0 sin comisiones de mantenimiento ni inactividad",
      "Herramienta de sentimiento del cliente, escáner de reconocimiento de patrones e integración de noticias de Reuters",
      "Spread betting disponible para clientes del Reino Unido/Irlanda — ganancias libres de impuestos",
      "Programa Alpha proporciona descuentos en efectivo para traders activos",
    ],
    CONS: [
      "Modelo de creador de mercado — los spreads pueden ampliarse significativamente durante la volatilidad",
      "Sin opción de cuenta ECN/spread raw — todos los costes incluidos en el spread",
      "MT4 ofrecido pero Next Generation no puede ejecutar EAs ni scripts personalizados",
      "Sin integración con cTrader ni TradingView",
      "Los gráficos en la app móvil son menos potentes que en la plataforma web",
      "Los tiempos de respuesta del soporte al cliente pueden ser lentos durante las horas pico del Reino Unido",
    ],
    SCORES: [
      { name: "Regulación y Seguridad", score: 9.7, weight: 25, detail: "Cuatro licencias Tier-1: FCA, ASIC, MAS, BaFin. Cotiza en LSE (CMCX). 36 años de operación. Gobierno corporativo de nivel bancario." },
      { name: "Costes de Trading", score: 8.5, weight: 20, detail: "Spread medio EUR/USD de 0,70 pips, solo spread. Sin comisión. Competitivo para creador de mercado. El programa Alpha ofrece descuentos en efectivo para traders activos." },
      { name: "Puntuación Trustpilot", score: 8.2, weight: 15, detail: "4,1/5 con más de 7.830 reseñas. Bueno para creador de mercado. Elogiado por calidad de plataforma. Algunas quejas sobre ampliación de spreads durante volatilidad." },
      { name: "Evaluación de Expertos", score: 9.5, weight: 20, detail: "Probamos la plataforma Next Generation extensamente. La mejor plataforma propia junto a IG. Más de 12.000 instrumentos. Gráficos avanzados y herramientas de sentimiento del cliente." },
      { name: "Plataformas y Herramientas", score: 9.8, weight: 10, detail: "Next Generation es líder del sector: 115+ indicadores, reconocimiento de patrones, noticias de Reuters, sentimiento del cliente, gráficos vinculados. MT4 también disponible." },
      { name: "Calidad de Ejecución", score: 9.0, weight: 10, detail: "Ejecución de creador de mercado. Tasa de llenado del 99,9%. Velocidad media de llenado de 12 ms. Estadísticas de ejecución publicadas. Tecnología de mejora de precios activa." },
    ],
    FAQ: [
      { q: "¿Qué es CMC Markets Next Generation?", a: "Next Generation es la plataforma de trading propia galardonada de CMC Markets con 115+ indicadores técnicos, 70+ patrones de gráficos vía escáner de reconocimiento de patrones, integración de noticias de Reuters, datos de sentimiento del cliente y diseños personalizables. Está consistentemente valorada entre las 2 mejores plataformas propias de brokers junto a IG." },
      { q: "¿Es CMC Markets seguro?", a: "Muy seguro. CMC Markets tiene cuatro licencias Tier-1 (FCA, ASIC, MAS, BaFin) y cotiza en la Bolsa de Londres (CMCX). La cotización en LSE requiere estados financieros auditados, estándares de gobierno corporativo y cumplimiento regulatorio. CMC lleva 36 años operando sin incidentes regulatorios graves." },
      { q: "¿Cuál es el depósito mínimo en CMC Markets?", a: "CMC Markets no tiene depósito mínimo para ninguna cuenta de CFD ni de spread betting. Puedes abrir una cuenta y financiarla con cualquier cantidad, convirtiéndolo en uno de los brokers premium más accesibles disponibles." },
      { q: "¿Qué es el programa Alpha de CMC Markets?", a: "El programa Alpha recompensa a los traders activos con descuentos en efectivo basados en el volumen de trading mensual. Los traders que cumplan los requisitos reciben automáticamente descuentos de spread acreditados en su cuenta. El programa es automático — una vez que superas los umbrales de volumen, los descuentos se aplican sin necesidad de solicitar." },
      { q: "¿Ofrece CMC Markets spread betting?", a: "Sí. CMC Markets es uno de los principales proveedores de spread betting para clientes del Reino Unido e Irlanda. Las ganancias del spread betting están exentas de impuestos según la legislación fiscal actual del Reino Unido (sujeto a circunstancias individuales). La plataforma de spread betting utiliza la misma interfaz Next Generation que la plataforma de CFD." },
      { q: "¿Cuántos instrumentos ofrece CMC Markets?", a: "CMC Markets ofrece más de 12.000 instrumentos incluyendo 330+ pares de forex (la selección de forex más amplia de cualquier broker), 9.000+ CFDs sobre acciones, 80+ índices, materias primas, ETFs, bonos y cestas de acciones temáticas. El rango es el segundo más amplio solo después de IG entre los brokers de tipo creador de mercado." },
      { q: "¿Cobra CMC Markets comisiones de inactividad?", a: "No. CMC Markets no cobra comisiones de inactividad ni de mantenimiento de cuenta. Puedes mantener una cuenta financiada o sin fondos sin ningún cargo. Esta es una ventaja significativa frente a competidores como IG ($12/mes tras 2 años) o Plus500 ($10/mes tras 3 meses)." },
      { q: "¿Cómo se compara CMC Markets con IG?", a: "Ambos son brokers premium con cotización en LSE y regulación FCA. IG tiene más instrumentos (17.000+ vs 12.000+) y mejor educación (IG Academy). CMC tiene más pares de forex (330+ vs 80+), sin comisiones de inactividad y el programa de descuentos Alpha. La calidad de la plataforma es comparable. Elige IG para acceso a EE.UU. y educación; CMC para variedad de forex y sin comisiones." },
    ],
    content: {
      overview: [
        "CMC Markets es uno de los pioneros del trading online, fundado en 1989 por Peter Cruddas (ahora Lord Cruddas) en Londres. Con 36 años de operación continua y una cotización en la Bolsa de Londres (CMCX), CMC Markets se ha establecido como uno de los brokers más fiables y ricos en funciones disponibles para traders minoristas.",
        "La característica más destacada es la plataforma Next Generation — una plataforma web propia que rivaliza con la plataforma de IG por el título de mejor interfaz de trading propia. Con 115+ indicadores técnicos, reconocimiento de patrones, datos de sentimiento del cliente y noticias de Reuters integradas, proporciona herramientas de análisis de grado profesional sin coste adicional.",
        "CMC Markets ofrece más de 12.000 instrumentos con una fortaleza notable en forex — 330+ pares de divisas representan la selección de forex más amplia de cualquier broker. CFDs sobre acciones, índices, materias primas, ETFs y cestas de acciones temáticas completan una oferta multi-activo completa.",
        "Cuatro licencias regulatorias Tier-1 (FCA, ASIC, MAS, BaFin) y la cotización en LSE proporcionan seguridad de grado institucional. La empresa atiende a 80.000+ clientes activos y aparece consistentemente en las listas de premios del sector por calidad de plataforma, herramientas de gráficos y experiencia general de trading.",
      ],
      scoring: "Nuestra puntuación global de {score}/10 para CMC Markets refleja su plataforma premium, vasto rango de instrumentos y regulación excepcional — equilibrada con spreads de creador de mercado y soporte limitado de plataformas de terceros. Desglose detallado:",
      accountIntro: "CMC Markets mantiene su estructura de cuenta simple. Las cuentas de CFD y spread betting comparten el mismo acceso de precios y plataforma. El programa Alpha proporciona descuentos basados en volumen para traders activos.",
      accountOutro: "Las cuentas demo son gratuitas con $10.000 en fondos virtuales y acceso completo a la plataforma Next Generation. Las cuentas islámicas sin swap están disponibles. Las cuentas corporativas y el estado profesional desbloquean límites de apalancamiento más altos. No se ofrecen cuentas ECN ni de spread raw.",
      regulation: [
        "CMC Markets tiene cuatro licencias Tier-1: FCA (173730), ASIC (238054), MAS (CMS100456) y BaFin (154814). La licencia FCA, vigente desde 1996, es una de las más antiguas del sector. Los clientes del Reino Unido se benefician de la protección del FSCS hasta £85.000 y protección de saldo negativo.",
        "Como empresa cotizada en la Bolsa de Londres, CMC Markets está sujeta a informes financieros trimestrales, auditoría independiente y estrictos requisitos de gobierno corporativo. Este nivel de transparencia proporciona responsabilidad más allá de lo que puede ofrecer cualquier broker privado.",
      ],
      costs: [
        "CMC Markets ofrece precios solo de spread sin comisiones. EUR/USD promedia 0,70 pips — competitivo para un creador de mercado premium y comparable a IG (0,60 pips). El coste total por lote estándar es aproximadamente $7,00.",
        "El programa Alpha proporciona descuentos en efectivo para traders activos basados en el volumen nocional mensual. Los traders que cumplan los requisitos reciben automáticamente descuentos de spread acreditados en su cuenta, reduciendo efectivamente los costes de trading hasta un 15% para los participantes de alto volumen.",
        "CMC no cobra comisiones de depósito ni retiro, y no tiene comisiones de inactividad — una de las estructuras de comisiones más limpias entre los brokers premium. Las tasas de financiación nocturna son estándar. La conversión de divisas se aplica para instrumentos en divisas distintas a la base a tasas competitivas.",
      ],
      spreads: [
        "Comparamos los spreads de CMC Markets con cuatro competidores brokers premium durante las horas pico Londres/Nueva York. Todas las cifras representan costes totales (sin comisión):",
        "Los spreads de CMC son competitivos con otros creadores de mercado premium. El promedio de 0,70 pips en EUR/USD es marginalmente más amplio que IG (0,60) pero más ajustado que OANDA (1,00) y Plus500 (0,70). Para traders que valoran la calidad de la plataforma sobre los spreads más bajos posibles, CMC ofrece un excelente valor por pip.",
      ],
      deposits: [
        "CMC Markets ofrece depósito mínimo de $0 con financiación gratuita vía tarjetas, PayPal y transferencia bancaria. La mayoría de los métodos electrónicos se acreditan al instante. Las transferencias bancarias tardan 1-3 días hábiles. Sin comisiones de depósito ni retiro.",
        "En nuestras pruebas, un depósito de £300 con tarjeta se acreditó en menos de 45 segundos. Un retiro de £200 a cuenta bancaria se procesó en 1 día hábil. CMC soporta GBP, USD, EUR, AUD, CAD, NOK, NZD, PLN, SEK y SGD como divisas base.",
      ],
      platforms: [
        "La plataforma Next Generation es la oferta estrella de CMC — una plataforma web con 115+ indicadores técnicos, 12 tipos de gráficos, 70+ herramientas de dibujo y un escáner de reconocimiento de patrones que identifica formaciones en tiempo real en todos los instrumentos. Las noticias de Reuters y los datos de sentimiento del cliente están integrados directamente en la interfaz de trading.",
        "El escáner de reconocimiento de patrones y las herramientas de sentimiento del cliente son destacados especiales. El escáner identifica formaciones como cabeza y hombros, dobles techos y cuñas en miles de instrumentos simultáneamente. El sentimiento del cliente muestra el porcentaje de traders de CMC que están largos vs cortos en cada instrumento.",
        "MetaTrader 4 está disponible como alternativa para traders que prefieren el trading con EAs. Sin embargo, la oferta de MT4 es básica comparada con la plataforma Next Generation. No hay integración con MT5, cTrader ni TradingView — CMC concentra sus recursos en su plataforma propia.",
      ],
      mobile: [
        "La app móvil de CMC lleva la mayoría de funciones de la plataforma Next Generation a iOS y Android. Los gráficos incluyen 40+ indicadores, herramientas de dibujo y listas de seguimiento personalizables. La app soporta gestión completa de órdenes, incluyendo órdenes stop garantizadas.",
        "La experiencia móvil es fluida con carga rápida de datos y gráficos receptivos. Las notificaciones push, alertas de precios y el calendario económico están integrados. Aunque los gráficos móviles son menos completos que la plataforma web (40+ vs 115+ indicadores), sigue siendo una de las mejores experiencias de trading móvil disponibles.",
      ],
      support: [
        "CMC Markets proporciona soporte al cliente 24/5 vía teléfono, correo electrónico y chat en vivo desde oficinas en Londres, Sídney, Singapur y otras ubicaciones globales. Nuestras pruebas encontraron tiempos de espera en el chat en vivo con un promedio de 5-12 minutos — ocasionalmente lento durante las horas pico de trading en el Reino Unido.",
        "El centro de soporte incluye preguntas frecuentes completas, tutoriales de plataforma y guías en vídeo. Los gestores de cuentas dedicados están disponibles para clientes de alto valor. La calidad general del soporte es profesional pero puede ser inconsistente en los tiempos de respuesta durante los períodos ocupados.",
      ],
      education: [
        "CMC Markets proporciona contenido educativo a través de su sección Learn, cubriendo conceptos básicos de trading, tutoriales de plataforma y análisis de mercado. La calidad del contenido es buena, pero la oferta educativa es menos estructurada que IG Academy. Los webinars semanales de perspectiva de mercado están disponibles.",
        "El valor educativo real proviene de la propia plataforma — el escáner de reconocimiento de patrones, los datos de sentimiento del cliente y el análisis de Reuters integrado proporcionan oportunidades de aprendizaje en tiempo real. El blog de CMC Markets ofrece comentarios de mercado diarios e ideas de trading.",
      ],
      trustpilot: "CMC Markets tiene una puntuación de 4,1/5 en Trustpilot con aproximadamente 7.830 reseñas verificadas. Las reseñas positivas elogian la plataforma Next Generation, el rango de instrumentos y la ausencia de comisiones de inactividad. Las reseñas negativas mencionan la ampliación de spreads durante la volatilidad, las limitaciones de la app móvil y los tiempos de respuesta del soporte. La puntuación es sólida para un broker de tipo creador de mercado.",
      country: "CMC Markets acepta clientes de más de 60 países. Asignación de entidad: FCA (Reino Unido/Europa), ASIC (Australia), MAS (Singapur), BaFin (Alemania) o CMC International. No se aceptan clientes de EE.UU. Los clientes del Reino Unido pueden acceder tanto al trading de CFD como al spread betting. Los límites de apalancamiento varían según la jurisdicción.",
      verdict: [
        "CMC Markets obtiene nuestro premio a la Mejor Plataforma para 2026. La plataforma Next Generation es una obra maestra de la tecnología de trading minorista — 115+ indicadores, reconocimiento de patrones, sentimiento del cliente y noticias de Reuters crean un entorno analítico que rivaliza con terminales institucionales. Combinada con más de 12.000 instrumentos y cuatro licencias Tier-1, CMC ofrece una experiencia de trading premium.",
        "El modelo de creador de mercado implica spreads más amplios que los brokers ECN, y la falta de MT5, cTrader o TradingView limita las opciones para traders integrados en esos ecosistemas. Para el coste puro de forex, IC Markets o Pepperstone son superiores. Pero para traders que valoran la calidad de la plataforma, las herramientas de análisis y la selección más amplia de pares de forex (330+), CMC Markets es una elección excepcional.",
      ],
    },
  },


  /* ─────────────────────────────────────────────
     6. XM
  ───────────────────────────────────────────── */
  "xm": {
    verdict: "Muy Bueno",
    promo: "Depósito mínimo de $5 — opera con micro lotes desde 0,01",
    PROS: [
      "Depósito mínimo de $5 — el más bajo entre los brokers regulados importantes",
      "Regulación Tier-1 dual (CySEC + ASIC) con sólido historial de seguridad",
      "Sin comisión en todos los tipos de cuenta estándar",
      "Contenido educativo líder del sector con webinars diarios e investigación",
      "Apalancamiento máximo de 1:1.000 en la entidad IFSC para traders experimentados",
      "Programa de fidelidad con XM Points canjeables por bonificaciones de crédito",
      "Soporta micro lotes (0,01) en la cuenta Micro para principiantes",
      "Disponible en más de 190 países con soporte multilingüe 24/5",
    ],
    CONS: [
      "Modelo de creador de mercado — XM puede tomar la posición contraria a las operaciones del cliente",
      "Spreads significativamente más amplios que los brokers ECN (0,80 vs 0,02 pips EUR/USD)",
      "Solo MT4 y MT5 — sin cTrader, TradingView ni plataforma propia",
      "Más de 1.000 instrumentos — rango menor que IC Markets o FP Markets",
      "La entidad IFSC de Belice tiene una protección regulatoria débil",
      "El procesamiento de retiros puede tardar hasta 24 horas para transferencias bancarias",
    ],
    content: {
      overview: [
        "XM es uno de los brokers de forex minorista más grandes del mundo por número de clientes, con más de 5 millones de cuentas registradas en más de 190 países. Fundado en 2009 en Limasol, Chipre, bajo el nombre de Trading Point of Financial Instruments, el broker se rebautizó como XM en 2016 y desde entonces se ha convertido en una fuerza dominante en regiones de mercados emergentes.",
        "XM opera un modelo de ejecución de creador de mercado (B-book), diferente del enfoque ECN utilizado por IC Markets y Pepperstone. Aunque esto significa que XM puede internalizar las operaciones de los clientes, el broker ha construido una sólida reputación a lo largo de 16 años de operación con regulación CySEC y ASIC. El depósito mínimo de $5 y el trading en micro lotes lo convierten en uno de los brokers regulados más accesibles del mundo.",
      ],
      verdict: [
        "XM es nuestra mejor opción para traders principiantes en 2026. El depósito mínimo de $5, el trading sin comisión, el soporte de micro lotes y el excepcional contenido educativo crean un entorno de aprendizaje incomparable. La regulación Tier-1 dual (CySEC + ASIC) de XM proporciona confianza en que se trata de un broker seguro y legítimo.",
        "Sin embargo, los traders experimentados y los scalpers deben buscar en otro lugar. El modelo de creador de mercado y los spreads más amplios (0,80 pips EUR/USD) de XM resultan en costes de trading significativamente más altos que las alternativas ECN. Para traders activos, IC Markets, Pepperstone o FP Markets ofrecen una ejecución y precios materialmente mejores.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     7. EXNESS
  ───────────────────────────────────────────── */
  "exness": {
    verdict: "Excelente",
    promo: "Apalancamiento ilimitado · Retiros instantáneos 24/7",
    PROS: [
      "Apalancamiento ilimitado disponible en la entidad de Seychelles — único en el sector",
      "Depósito mínimo de $1 en cuentas Estándar y Estándar Cent",
      "Retiros instantáneos 24/7 vía monederos electrónicos — confirmado en nuestras pruebas (10 segundos)",
      "Regulación Tier-1 dual (CySEC + FCA) con informes financieros auditados publicados",
      "Spreads raw desde 0,0 pips con comisión competitiva de $7 por vuelta completa",
      "Terminal de Exness propio con interfaz moderna y limpia",
      "El broker más grande por volumen de trading mensual ($13.000M+)",
      "Sin comisiones de inactividad ni cargos ocultos",
    ],
    CONS: [
      "Solo 300+ instrumentos — rango mucho más reducido que IC Markets o FP Markets",
      "Sin integración con cTrader ni TradingView",
      "El apalancamiento ilimitado es extremadamente arriesgado para traders sin experiencia",
      "La entidad FSA de Seychelles tiene protecciones del cliente significativamente más débiles",
      "El contenido educativo es mínimo comparado con XM o IG",
      "La función de trading social sigue siendo limitada comparada con eToro",
    ],
    content: {
      overview: [
        "Exness ha emergido como uno de los brokers de forex más grandes del mundo por volumen de trading, procesando más de $13.000 millones en transacciones mensuales. Fundado en 2008, el broker ha crecido desde una pequeña operación hasta convertirse en un actor importante del sector que atiende a 800.000+ clientes activos en 60+ países.",
        "Lo que distingue a Exness de los competidores es su combinación de retiros instantáneos, apalancamiento ilimitado e informes financieros auditados publicados. El sistema de retiro instantáneo — que confirmamos en nuestras pruebas entregando fondos en 10 segundos vía monederos electrónicos — no tiene rival en el sector. La opción de apalancamiento ilimitado, disponible en la entidad de Seychelles, permite a los traders experimentados operar con prácticamente ningún requisito de margen.",
      ],
      verdict: [
        "Exness obtiene nuestro premio al Mejor para Alto Apalancamiento para 2026. La combinación de retiros instantáneos, apalancamiento ilimitado (entidad Seychelles), depósito mínimo de $1 y spreads raw competitivos lo convierte en una elección poderosa para traders experimentados que valoran la velocidad y la flexibilidad. La regulación dual CySEC + FCA proporciona seguridad Tier-1 genuina.",
        "Las principales limitaciones son un rango de instrumentos más reducido (300+ vs 2.250+ en IC Markets), sin cTrader ni TradingView, y contenido educativo mínimo. Para principiantes, XM o Pepperstone son mejores puntos de partida. Pero para traders experimentados en mercados emergentes que necesitan acceso inmediato a fondos y máximo apalancamiento, Exness está posicionado de forma única.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     8. TICKMILL
  ───────────────────────────────────────────── */
  "tickmill": {
    verdict: "Muy Bueno",
    promo: "Las comisiones ECN más bajas — $4 por vuelta completa por lote",
    PROS: [
      "Las comisiones ECN más bajas del sector — $4 por vuelta completa en Pro, $3 en VIP",
      "Regulación Tier-1 dual FCA + CySEC con sede en Londres",
      "Spreads raw desde 0,0 pips con media de 0,08 pips en EUR/USD",
      "Coste total por lote de aproximadamente $4,80 — incomparable en el mercado",
      "Depósito mínimo de $100 para cuenta Pro ECN",
      "Integración gratuita de Autochartist y Myfxbook AutoTrade",
      "Ejecución rápida con media de 30 ms sin mesa de operaciones",
      "Excelente reputación para scalping — sin restricciones en el estilo de trading",
    ],
    CONS: [
      "Solo MT4 y MT5 — sin cTrader, TradingView ni plataforma propia",
      "600+ instrumentos — significativamente menos que IC Markets (2.250+)",
      "Los spreads de la cuenta Classic (1,6 pips) son más amplios que los de la competencia",
      "Contenido educativo e investigación de mercado limitados",
      "Menor reconocimiento de marca comparado con Pepperstone o IC Markets",
      "La cuenta VIP requiere un depósito mínimo de $50.000 — barrera elevada para la mejor tasa de comisión",
    ],
    content: {
      overview: [
        "Tickmill es un broker ECN/STP con sede en Londres que se ha hecho un hueco como la opción de menor coste para traders activos de forex. Fundado en 2014, el broker ha crecido rápidamente al ofrecer lo que muchos consideran las mejores tasas de comisión del sector — $4 por vuelta completa en la cuenta Pro, aproximadamente un 43% más barato que IC Markets y Pepperstone.",
        "La propuesta de valor del broker es sencilla: ejecución ECN genuina con spreads raw desde 0,0 pips a la comisión más baja posible. Este enfoque en la eficiencia de costes ha atraído a scalpers, day traders y traders algorítmicos que ejecutan altos volúmenes y donde cada fracción de pip importa.",
      ],
      verdict: [
        "Tickmill obtiene nuestro premio a la Comisión Más Baja para 2026. Para traders activos que priorizan la eficiencia de costes sobre todo lo demás, la comisión de $4 por vuelta completa en la cuenta Pro de Tickmill ofrece el mejor valor del sector. Combinada con spreads raw y regulación FCA, es una elección convincente para scalpers y traders de alta frecuencia.",
        "Los compromisos son un rango de instrumentos más reducido (600+ vs 2.250+ en IC Markets), opciones de plataforma limitadas (solo MT4/MT5) y contenido educativo básico. Si operas principalmente forex y valoras cada dólar de ahorro en comisiones, Tickmill es una excelente elección. Si necesitas mercados más amplios o plataformas avanzadas, IC Markets o Pepperstone pueden ser más adecuados.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     9. VANTAGE
  ───────────────────────────────────────────── */
  "vantage": {
    verdict: "Muy Bueno",
    promo: "Spreads ECN raw desde 0,0 pips — depósito mínimo de $50",
    PROS: [
      "Spreads ECN raw desde 0,0 pips con comisión de $3/lote — muy competitivo",
      "Regulación Tier-1 dual ASIC + FCA para sólida protección del cliente",
      "Plataforma ProTrader basada en TradingView — experiencia moderna de gráficos",
      "Depósito mínimo de $50 — accesible para nuevos traders ECN",
      "Copy trading vía app de Vantage con funciones sociales",
      "Infraestructura de servidores Equinix NY4 y LD5 para ejecución de baja latencia",
      "Herramientas de investigación Autochartist y Trading Central incluidas gratis",
      "Depósitos en cripto aceptados (USDT) para financiación rápida y global",
    ],
    CONS: [
      "Entidad CIMA (Islas Caimán) para la mayoría de clientes internacionales — regulación más débil",
      "Puntuación de Trustpilot de 3,7 — por debajo de la media para brokers ECN",
      "El procesamiento de retiros puede tardar 1-3 días hábiles — más lento que Exness",
      "Las condiciones de bonificaciones y promociones pueden ser complejas con requisitos de trading",
      "Rango de instrumentos limitado comparado con IG o Saxo Bank",
      "ProTrader solo disponible en cuentas Raw ECN y Pro ECN",
    ],
    content: {
      overview: [
        "Vantage es un broker ECN australiano fundado en 2009, que ofrece condiciones de trading de grado institucional a precios accesibles. Con regulación Tier-1 dual ASIC y FCA e infraestructura de servidores Equinix, Vantage se dirige a traders que quieren ejecución ECN raw sin los altos mínimos típicamente asociados con el trading de grado profesional.",
        "El broker se distingue a través de su plataforma ProTrader — una interfaz de trading basada en TradingView que lleva los gráficos profesionales directamente al entorno del broker. Esto diferencia a Vantage de los competidores ECN que dependen únicamente de MetaTrader. Combinado con MT4 y MT5, los traders obtienen una verdadera elección de plataforma.",
      ],
      verdict: [
        "Vantage es un broker ECN sólido que combina precios raw competitivos con genuina diversidad de plataformas a través de ProTrader (TradingView). El depósito mínimo de $50 hace que el trading ECN sea accesible, y la regulación ASIC + FCA proporciona sólida seguridad para traders australianos y del Reino Unido.",
        "Sin embargo, la puntuación de 3,7 en Trustpilot, la entidad CIMA para clientes internacionales y los spreads ligeramente más amplios que IC Markets o Pepperstone lo mantienen fuera del nivel superior. Para traders australianos que quieren una alternativa a IC Markets con mejor elección de plataforma, Vantage merece consideración.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     10. IG — skipped (already in top-5)
     10. OANDA
  ───────────────────────────────────────────── */
  "oanda": {
    verdict: "Excelente",
    promo: "Trading de forex regulado en EE.UU. · Sin depósito mínimo",
    PROS: [
      "Uno de los dos únicos brokers de forex que acepta clientes de EE.UU. con regulación NFA/CFTC",
      "Cuatro licencias regulatorias Tier-1 (NFA, FCA, ASIC, MAS) — seguridad excepcional",
      "28 años de operación — entre los brokers de forex con mayor trayectoria globalmente",
      "Depósito mínimo de $0 sin comisiones de mantenimiento de cuenta",
      "Plataforma OANDA Trade con excelentes gráficos y analíticas",
      "Integración con TradingView para análisis técnico avanzado",
      "API robusta con protocolos REST y FIX para traders algorítmicos",
      "Estadísticas de ejecución publicadas de forma transparente y datos de precios",
    ],
    CONS: [
      "Spreads más amplios que los brokers ECN — media de 1,0 pips EUR/USD en estándar",
      "Rango de instrumentos limitado — solo 120+ instrumentos (principalmente forex)",
      "Sin soporte para la plataforma cTrader",
      "La cuenta Premium requiere un saldo mínimo de $20.000",
      "Los retiros por transferencia bancaria tienen una comisión de $20",
      "Sin funciones de copy trading ni trading social",
    ],
    content: {
      overview: [
        "OANDA es uno de los nombres más venerables del trading de forex online, fundado en 1996 por el Dr. Michael Stumm y el Dr. Richard Olsen. Operando durante 28 años, fue una de las primeras empresas en ofrecer datos gratuitos de tipos de cambio en internet y fue pionera en el trading de forex minorista basado en web con el lanzamiento de fxTrade en 2001.",
        "Como uno de los dos únicos brokers de forex que aceptan legalmente clientes de EE.UU. (junto con IG), OANDA tiene regulación NFA/CFTC — el marco regulatorio más estricto para el forex en el mundo. Esto convierte a OANDA en la opción preferida para los traders americanos que tienen opciones de broker extremadamente limitadas.",
      ],
      verdict: [
        "OANDA obtiene nuestro premio al Mejor para Traders de EE.UU. para 2026. Para los traders americanos, la elección es efectivamente OANDA o IG — y el depósito mínimo de $0, la estructura de comisiones limpia y la excelente API de OANDA lo convierten en la opción más accesible. La trayectoria de 28 años y las cuatro licencias Tier-1 proporcionan una seguridad líder del sector.",
        "Para traders no estadounidenses, OANDA enfrenta una competencia más fuerte. El spread de 1,0 pip en EUR/USD es significativamente más amplio que las alternativas ECN, y el rango de 120+ instrumentos es limitado. Pepperstone, IC Markets o IG ofrecen mejor valor para traders internacionales.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     11. ETORO
  ───────────────────────────────────────────── */
  "etoro": {
    verdict: "Muy Bueno",
    promo: "Copia a los mejores traders automáticamente — líder en trading social",
    PROS: [
      "Plataforma CopyTrader líder del sector — copia automáticamente a los mejores performers",
      "Trading de acciones y ETFs reales sin comisión (no EE.UU., sin apalancamiento)",
      "Más de 30 millones de usuarios registrados — la comunidad de trading social más grande",
      "Triple regulación Tier-1 (FCA + CySEC + ASIC)",
      "Más de 6.000 instrumentos incluyendo acciones reales, cripto, forex y materias primas",
      "Plataforma intuitiva y amigable para principiantes con feed social integrado",
      "Smart Portfolios para estrategias de inversión temáticas y gestionadas",
      "Propiedad real de criptomonedas con monedero eToro Money",
    ],
    CONS: [
      "Spreads de forex significativamente más amplios que los brokers ECN (1,0 pip EUR/USD)",
      "Comisión de retiro de $5 en todos los métodos — inusual entre los grandes brokers",
      "No apto para scalping — ejecución de creador de mercado con restricciones",
      "Solo plataforma propia — sin MT4, MT5, cTrader ni TradingView",
      "Comisión de conversión (0,5%-1,5%) en depósitos en divisas distintas al USD",
      "Las tarifas nocturnas en posiciones apalancadas pueden ser costosas para traders de swing",
    ],
    content: {
      overview: [
        "eToro es la plataforma de trading social líder del mundo, con más de 30 millones de usuarios registrados en más de 140 países. Fundada en 2007 en Tel Aviv por los hermanos Yoni y Ronen Assia junto con David Ring, la empresa fue pionera en el concepto de CopyTrader — permitiendo a los usuarios replicar automáticamente las operaciones de inversores exitosos.",
        "Lo que hace fundamentalmente diferente a eToro de los brokers tradicionales es su enfoque centrado en lo social. La plataforma funciona como una red social financiera donde los traders comparten estrategias, publican análisis y construyen seguidores. CopyTrader transforma esta capa social en inversión accionable — puedes asignar fondos para replicar la cartera de cualquier trader con un solo clic.",
      ],
      verdict: [
        "eToro obtiene nuestro premio al Mejor para Copy Trading para 2026. Si tu objetivo principal es copiar traders exitosos, construir una cartera diversificada con acciones sin comisión y participar en una comunidad de trading, eToro no tiene rival. La función CopyTrader, los 6.000+ instrumentos y el ecosistema social crean una experiencia de inversión única.",
        "Sin embargo, para el trading puro de forex, eToro no es la mejor opción. El spread de 1,0 pip en EUR/USD, la comisión de retiro de $5 y la falta de MT4/MT5 lo hacen subóptimo para traders activos de forex y scalpers.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     12. PLUS500
  ───────────────────────────────────────────── */
  "plus500": {
    verdict: "Bueno",
    promo: "Trading de CFDs con cero comisión — más de 2.800 instrumentos",
    PROS: [
      "Cuatro licencias regulatorias Tier-1 (FCA, CySEC, ASIC, MAS) — muy seguro",
      "Cotiza en la Bolsa de Londres — alta transparencia y responsabilidad",
      "Más de 2.800 instrumentos incluyendo acciones, forex, cripto, índices y materias primas",
      "Sin comisión en todas las operaciones — precios simples basados solo en spread",
      "Órdenes stop garantizadas disponibles para gestión del riesgo",
      "Plataforma muy simple e intuitiva — ideal para traders ocasionales",
      "Alertas en tiempo real y herramientas de gestión del riesgo gratuitas",
      "Depósitos con Apple Pay soportados para financiación móvil instantánea",
    ],
    CONS: [
      "Solo plataforma propia — sin MT4, MT5, cTrader ni TradingView",
      "Herramientas de gráficos muy limitadas (~15 indicadores) y sin análisis avanzado",
      "Broker solo de CFDs — sin propiedad real de acciones ni acceso DMA",
      "Las tarifas de financiación nocturna pueden ser costosas para traders de swing",
      "Sin copy trading, trading social ni contenido educativo",
      "Comisión de inactividad mensual de $10 tras 3 meses — de las más altas del sector",
    ],
    content: {
      overview: [
        "Plus500 es un broker de CFDs cotizado en la Bolsa de Londres (LSE: PLUS), lo que lo convierte en uno de los brokers más transparentes y responsables del sector. Fundado en 2008 en Haifa, Israel, por seis graduados del Technion, la empresa ha crecido hasta atender a 400.000+ clientes activos con 2.800+ instrumentos CFD.",
        "El enfoque de Plus500 es la simplicidad ante todo. La plataforma propia está diseñada para ser intuitiva y fácil de usar, con diseño limpio y colocación de órdenes directa. Esto lo hace atractivo para traders casuales y a tiempo parcial que no necesitan la complejidad de MetaTrader o cTrader.",
      ],
      verdict: [
        "Plus500 es un broker de CFDs seguro y simple respaldado por cuatro licencias Tier-1 y una cotización en LSE. Para traders casuales que quieren trading de CFDs sencillo con stops garantizados y no necesitan herramientas de análisis avanzadas, Plus500 ofrece una experiencia limpia y sin complicaciones.",
        "Sin embargo, la plataforma limitada, la educación mínima, la comisión de inactividad de $10 y la ausencia de MT4/MT5 hacen difícil recomendarlo sobre competidores como IG (mejor plataforma y educación) o eToro (copy trading).",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     13. SAXO BANK
  ───────────────────────────────────────────── */
  "saxo-bank": {
    verdict: "Excelente",
    promo: "Más de 71.000 instrumentos — el acceso a mercados más amplio en cualquier lugar",
    PROS: [
      "Más de 71.000 instrumentos negociables — la selección más amplia de cualquier broker minorista",
      "Licencia bancaria danesa con regulación DFSA + FCA + ASIC + MAS",
      "SaxoTraderPRO es una plataforma de escritorio de calidad institucional",
      "Acceso DMA a más de 40 bolsas globales para acciones, bonos y futuros",
      "Investigación galardonada del equipo de Estrategia de Saxo liderado por Steen Jakobsen",
      "Precios basados en volumen con descuentos significativos en niveles Platinum/VIP",
      "32 años de operación — uno de los historiales más largos del sector",
      "Carteras gestionadas y robo-advisory a través de SaxoInvestor",
    ],
    CONS: [
      "Depósito mínimo de $2.000 — el más alto entre los brokers principales",
      "Estructura de comisiones compleja con precios escalonados y comisiones de bolsa",
      "Comisión de inactividad de $100/trimestre — muy alta comparada con la competencia",
      "No competitivo en coste puro de forex — los brokers ECN ofrecen precios mucho más ajustados",
      "SaxoTraderPRO tiene una curva de aprendizaje pronunciada para principiantes",
      "Sin integración con MetaTrader 4/5, cTrader ni TradingView",
    ],
    content: {
      overview: [
        "Saxo Bank es un banco de inversión danés y broker multi-activo que ofrece la selección de instrumentos más amplia del sector de trading minorista — más de 71.000 productos en forex, acciones, ETFs, bonos, futuros, opciones y fondos de inversión. Fundado en 1992 por Kim Fournais y Lars Seier Christensen, Saxo tiene una licencia bancaria danesa completa y ha evolucionado hasta convertirse en una institución financiera premium.",
        "Lo que distingue fundamentalmente a Saxo Bank es su posicionamiento como plataforma de inversión más que como simple broker de forex. Mientras los competidores se centran principalmente en forex y CFDs, Saxo proporciona acceso directo al mercado en más de 40 bolsas globales, permitiendo propiedad real de acciones, trading de bonos y ejecución de futuros junto a los productos CFD tradicionales.",
      ],
      verdict: [
        "Saxo Bank obtiene nuestro premio al Mejor para Profesionales para 2026. Para traders serios e inversores que necesitan acceso a los mercados más amplios posibles con herramientas de grado institucional, Saxo es incomparable. El rango de 71.000+ instrumentos, la plataforma SaxoTraderPRO y el acceso DMA a bolsas globales crean un entorno de trading genuinamente profesional.",
        "El alto depósito mínimo ($2.000), la estructura de comisiones compleja y la pronunciada curva de aprendizaje hacen que Saxo no sea adecuado para principiantes. Para el coste puro de forex, IC Markets o Pepperstone son significativamente mejores.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     14. CMC MARKETS — already in top-5
     14. XTB
  ───────────────────────────────────────────── */
  "xtb": {
    verdict: "Muy Bueno",
    promo: "Trading de acciones sin comisión — premiada plataforma xStation 5",
    PROS: [
      "Trading de acciones y ETFs reales sin comisión hasta €100.000 de volumen mensual",
      "xStation 5 — plataforma galardonada con escáner integrado, mapa de calor y analíticas",
      "Tres licencias Tier-1 (FCA, KNF, CySEC) y cotiza en la Bolsa de Varsovia",
      "Depósito mínimo de $0 — accesible para todos los niveles de trading",
      "Spreads CFD competitivos desde 0,5 pips EUR/USD sin comisión",
      "Calculadora de trading integrada para cálculos instantáneos de margen, valor de pip y coste",
      "Equipo de análisis de mercado sólido con comentario en vídeo diario",
      "Intereses sobre fondos no invertidos en regiones seleccionadas",
    ],
    CONS: [
      "Solo plataforma propia — sin MT4, MT5, cTrader ni TradingView",
      "Rango de instrumentos limitado (5.800) comparado con IG (17.000+) o Saxo (71.000+)",
      "Comisión de inactividad mensual de €10 tras 12 meses sin operar",
      "Las tasas de swap nocturnas son más altas que los competidores ECN en algunos pares",
      "El trading de acciones sin comisión está limitado a €100.000 de volumen mensual",
      "Sin ejecución DMA ni ECN — solo modelo de creador de mercado",
    ],
    content: {
      overview: [
        "XTB es un broker polaco cotizado en bolsa que ha crecido desde una operación local en Varsovia hasta convertirse en una de las plataformas de trading más reconocidas de Europa. Fundado en 2002 y cotizado en la Bolsa de Valores de Varsovia (WSE: XTB), la empresa combina precios competitivos de forex con trading de acciones reales sin comisión.",
        "La plataforma xStation 5 es la joya de la corona de XTB. A diferencia de muchos brokers que dependen de plataformas de terceros, XTB ha invertido fuertemente en tecnología propia. El resultado es una plataforma moderna y rica en funciones con un escáner de acciones integrado, mapa de calor del mercado, calculadora de trading y analíticas de rendimiento.",
      ],
      verdict: [
        "XTB es una sólida opción para traders europeos que quieren trading de acciones sin comisión combinado con forex competitivo. La plataforma xStation 5, el depósito mínimo de $0 y la regulación Tier-1 triple crean un paquete atractivo para traders de todos los niveles.",
        "Las limitaciones son la plataforma única propia (sin MT4/MT5), el rango de instrumentos limitado comparado con IG, y la comisión de inactividad. Para trading de acciones sin comisión en Europa, XTB es una excelente elección.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     15. FXPRO
  ───────────────────────────────────────────── */
  "fxpro": {
    verdict: "Muy Bueno",
    promo: "4 plataformas · Ejecución NDD · Regulación FCA + CySEC",
    PROS: [
      "Cuatro plataformas de trading: MT4, MT5, cTrader y FxPro Platform",
      "Ejecución sin mesa de operaciones (NDD) con múltiples proveedores de liquidez",
      "Regulación Tier-1 dual FCA + CySEC con 17 años de operación",
      "Spreads desde 0,0 pips en cuenta cTrader con comisión competitiva",
      "Más de 2.100 instrumentos incluyendo acciones, forex, indices, materias primas y cripto",
      "Cuenta FxPro Edge para inversores de menor activo con funciones de gestión del riesgo",
      "Herramientas de trading avanzadas y VPS disponible para traders activos",
      "Soporte al cliente 24/5 en múltiples idiomas",
    ],
    CONS: [
      "Los spreads en la cuenta MT4 son más amplios que en brokers ECN puros",
      "Sin integración con TradingView",
      "Los requisitos de depósito mínimo varían según la plataforma",
      "Las comisiones pueden ser complejas según el tipo de cuenta",
      "Menor reconocimiento de marca que Pepperstone o IC Markets",
      "Las funciones educativas son básicas comparadas con IG o XM",
    ],
    content: {
      overview: [
        "FxPro es un broker multilaureado con sede en el Reino Unido, fundado en 2006. Con regulación FCA y CySEC, FxPro ofrece una amplia gama de plataformas de trading incluyendo MT4, MT5, cTrader y su plataforma propia FxPro Platform. La ejecución sin mesa de operaciones garantiza que las órdenes se ejecuten con total transparencia.",
        "Con más de 2.100 instrumentos y cuatro modelos de ejecución distintos, FxPro atiende a una amplia gama de traders, desde principiantes hasta profesionales. El broker es particularmente reconocido por su variedad de plataformas y su sólido perfil regulatorio.",
      ],
      verdict: [
        "FxPro es un broker sólido y bien regulado que ofrece verdadera variedad de plataformas. La combinación de MT4, MT5, cTrader y FxPro Platform junto a la regulación Tier-1 dual lo convierte en una opción atractiva para traders que valoran la flexibilidad de plataforma.",
        "Para coste de trading puro, los brokers ECN como IC Markets o Tickmill ofrecen precios más competitivos. Pero para traders que quieren múltiples opciones de plataforma con buena regulación, FxPro es una elección sólida.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     16. ADMIRALS
  ───────────────────────────────────────────── */
  "admirals": {
    verdict: "Muy Bueno",
    promo: "Depósito mínimo de $25 — más de 8.000 instrumentos con MT4/MT5",
    PROS: [
      "Depósito mínimo de $25 — muy accesible para nuevos traders",
      "Más de 8.000 instrumentos incluyendo acciones reales, ETFs, forex y materias primas",
      "Regulación Tier-1 FCA + CySEC con múltiples entidades globales",
      "MetaTrader 4 y MT5 con complementos Admirals exclusivos (Supreme Edition)",
      "Acciones reales y ETFs sin comisión en cuenta Invest.MT5",
      "Trader Room completo para gestión de cuenta, análisis y educación",
      "StereoTrader y Admirals Supreme Edition para herramientas avanzadas de MT4/MT5",
      "Soporte al cliente 24/5 en más de 20 idiomas",
    ],
    CONS: [
      "Los spreads en algunas cuentas son más amplios que en los brokers ECN líderes",
      "Sin plataforma cTrader o TradingView",
      "El rango de instrumentos puede ser abrumador para principiantes",
      "Las comisiones en algunas cuentas pueden ser complejas",
      "El reconocimiento de marca es menor que el de los brokers líderes",
      "Las funciones de copy trading son limitadas comparadas con eToro o NAGA",
    ],
    content: {
      overview: [
        "Admirals (anteriormente Admiral Markets) es un broker de larga trayectoria fundado en 2001, con regulación FCA y CySEC. Con sede en Estonia, el broker ha crecido hasta servir a clientes en más de 130 países, ofreciendo una amplia gama de instrumentos que incluye acciones reales, ETFs, forex, índices y materias primas.",
        "La oferta más notable de Admirals es la cuenta Invest.MT5, que permite la compra de acciones reales y ETFs sin comisión, compitiendo directamente con plataformas de inversión en acciones puras. Esto, junto con las cuentas de CFD tradicionales, convierte a Admirals en una plataforma verdaderamente multi-activo.",
      ],
      verdict: [
        "Admirals es una sólida elección para traders que buscan una amplia gama de instrumentos, incluyendo acciones reales, con un depósito mínimo bajo. La combinación de regulación Tier-1 y la plataforma MT4/MT5 mejorada lo hacen atractivo para traders de todos los niveles.",
        "Para el coste más bajo de ECN, IC Markets o Tickmill son superiores. Pero para un broker que ofrece tanto acciones reales sin comisión como CFDs con una buena regulación, Admirals merece consideración.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     17. SWISSQUOTE
  ───────────────────────────────────────────── */
  "swissquote": {
    verdict: "Muy Bueno",
    promo: "Seguridad bancaria suiza — más de 3 millones de productos negociables",
    PROS: [
      "Banco suizo completamente regulado — el más alto nivel de seguridad financiera",
      "Más de 3 millones de productos negociables incluyendo acciones reales, fondos y bonos",
      "Cotiza en la Bolsa Suiza (SIX) para máxima transparencia corporativa",
      "Plataforma avanzada Advanced Trader con 80+ indicadores y análisis integrado",
      "Asesoramiento robo integrado y gestión de carteras automatizadas",
      "30 años de operación — historial ininterrumpido desde 1996",
      "Cuenta de ahorro con intereses disponible junto a cuentas de trading",
      "Sólida integración con mercados de renta variable europeos y asiáticos",
    ],
    CONS: [
      "Depósito mínimo de $1.000 — barrera de entrada más alta que la mayoría",
      "Los spreads de forex son más amplios que los brokers ECN (EUR/USD ~1,3 pips)",
      "Estructura de comisiones compleja con tarifas variables según el mercado",
      "Orientado principalmente a inversores patrimoniales — no ideal para scalpers",
      "Sin opciones de cuentas ECN ni de spread raw para forex puro",
      "La interfaz de plataforma puede ser compleja para traders principiantes",
    ],
    content: {
      overview: [
        "Swissquote es el banco online de trading líder de Suiza, fundado en 1996 y cotizado en la Bolsa Suiza (SIX). Como banco plenamente regulado bajo la FINMA (Autoridad de Supervisión de los Mercados Financieros de Suiza), Swissquote ofrece el nivel más alto de seguridad financiera disponible para traders minoristas.",
        "Con más de 3 millones de productos negociables que incluyen acciones de las principales bolsas mundiales, ETFs, bonos, fondos de inversión, forex y criptomonedas, Swissquote es verdaderamente una plataforma de inversión completa. La cuenta de savings adicional y el robo-advisory hacen de Swissquote una alternativa seria a los bancos privados tradicionales.",
      ],
      verdict: [
        "Swissquote es la elección premium para traders e inversores que valoran la seguridad bancaria suiza sobre todo lo demás. La combinación de regulación bancaria completa, acceso a más de 3 millones de productos y 30 años de trayectoria crea una plataforma de inversión genuinamente confiable.",
        "El alto depósito mínimo y los spreads de forex más amplios hacen que Swissquote no sea ideal para traders activos de forex puro. Para estos traders, IC Markets o Pepperstone ofrecen mejor valor. Pero para inversores patrimoniales que buscan máxima seguridad con acceso a mercados globales, Swissquote es una elección premium.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     18. DUKASCOPY
  ───────────────────────────────────────────── */
  "dukascopy": {
    verdict: "Bueno",
    promo: "Banco suizo ECN — spreads raw en el mercado SWFX",
    PROS: [
      "Banco suizo regulado con licencia bancaria completa de FINMA",
      "Spreads raw genuinos en el mercado propio SWFX (Swiss Forex Marketplace)",
      "Plataforma JForex con capacidades avanzadas de trading algorítmico",
      "Transparencia completa del libro de órdenes con datos de profundidad de mercado",
      "Cuenta bancaria integrada con tarjeta VISA disponible",
      "API completa para desarrollo de estrategias algorítmicas",
      "Cobertura global con múltiples entidades reguladas",
      "Transmisión de datos en tiempo real de alta calidad para todos los instrumentos",
    ],
    CONS: [
      "Depósito mínimo de $100 pero se recomienda $1.000+ para condiciones óptimas",
      "La plataforma JForex tiene una curva de aprendizaje pronunciada",
      "Rango de instrumentos limitado comparado con IC Markets o IG",
      "La plataforma web y móvil son menos pulidas que las de los competidores",
      "Los spreads pueden ser más amplios en períodos de baja liquidez",
      "El soporte al cliente puede ser lento fuera del horario de Suiza",
    ],
    content: {
      overview: [
        "Dukascopy es un banco suizo de forex online fundado en 2004 en Ginebra, regulado por FINMA. Como uno de los pocos brokers de forex que es también un banco regulado completo, Dukascopy ofrece un nivel único de seguridad y transparencia en el sector.",
        "El mercado propio SWFX (Swiss Forex Marketplace) de Dukascopy agrega liquidez de múltiples fuentes para proporcionar spreads raw genuinos con total transparencia del libro de órdenes. La plataforma JForex permite el desarrollo avanzado de estrategias algorítmicas en Java.",
      ],
      verdict: [
        "Dukascopy es una elección excepcional para traders algorítmicos y profesionales que valoran la seguridad bancaria suiza y la transparencia completa del mercado. El mercado SWFX y la plataforma JForex son capacidades genuinamente únicas.",
        "Para traders principiantes o aquellos que priorizan la facilidad de uso, otras opciones son más accesibles. Para traders activos que buscan los menores costes de ECN, IC Markets o Tickmill ofrecen precios más competitivos. Pero para traders institucionales y algorítmicos, Dukascopy es una opción premium.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     19. LIBERTEX
  ───────────────────────────────────────────── */
  "libertex": {
    verdict: "Bueno",
    promo: "Trading con spread cero — modelo basado en comisión desde $10",
    PROS: [
      "Modelo único de spread cero — pagas solo una comisión fija por operación",
      "Depósito mínimo bajo de $10 — muy accesible para principiantes",
      "Plataforma Libertex propia con interfaz limpia e intuitiva",
      "Más de 250 instrumentos incluyendo forex, acciones, materias primas y cripto",
      "Regulación CySEC con protección para clientes de la UE",
      "Señales de trading integradas y herramientas de análisis",
      "Aplicación móvil bien valorada disponible en iOS y Android",
      "Cuenta demo gratuita con fondos virtuales para práctica",
    ],
    CONS: [
      "El modelo de spread cero puede tener costes totales más altos que los brokers ECN para traders activos",
      "Rango de instrumentos limitado comparado con brokers de mayor tamaño",
      "Sin MT4, MT5 ni cTrader — solo plataforma propia",
      "Solo regulación CySEC — menos protección que FCA o ASIC",
      "No disponible para clientes de EE.UU., Reino Unido y algunos otros países",
      "Las condiciones del bono pueden ser complejas y restrictivas",
    ],
    content: {
      overview: [
        "Libertex es un broker online fundado en 1997 con una propuesta de valor única: trading con spread cero donde los traders pagan una comisión fija en lugar de un spread variable. Esta estructura de precios transparente simplifica el cálculo de costes y puede ser ventajosa para ciertos estilos de trading.",
        "Con sede en Chipre y regulado por CySEC, Libertex ofrece más de 250 instrumentos en una plataforma propia intuitiva. El broker es conocido por sus barreras de entrada bajas y su interfaz simple, haciéndolo accesible para traders principiantes.",
      ],
      verdict: [
        "Libertex es una opción interesante para traders que prefieren una estructura de precios transparente con spread cero más comisión fija. La plataforma propia es limpia y fácil de usar, y el bajo depósito mínimo de $10 lo hace muy accesible.",
        "Sin embargo, la falta de MT4/MT5, el rango limitado de instrumentos y la regulación solo CySEC limitan su atractivo para traders más avanzados. Para coste de trading puro y regulación más fuerte, IC Markets o Pepperstone son mejores opciones.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     20. AVATRADE
  ───────────────────────────────────────────── */
  "avatrade": {
    verdict: "Muy Bueno",
    promo: "Copy trading + trading de opciones — regulado en 9 jurisdicciones",
    PROS: [
      "Regulado en 9 jurisdicciones incluyendo EU, Australia, Japón y EAU",
      "AvaSocial y DupliTrade para copy trading integrado",
      "AvaOptions para trading de opciones de forex — único en el sector minorista",
      "MT4, MT5, AvaTradeGO y plataformas web disponibles",
      "Más de 1.250 instrumentos incluyendo opciones, forex, cripto y acciones",
      "Programa SharpTrader con contenido educativo estructurado",
      "Cuenta AvaSocial para seguir y copiar traders automáticamente",
      "Depósito mínimo de $100 con amplio soporte de métodos de pago",
    ],
    CONS: [
      "Los spreads son más amplios que los brokers ECN (EUR/USD ~0,9 pips)",
      "La comisión de inactividad de $50 tras 3 meses es de las más altas del sector",
      "El modelo de creador de mercado puede tener conflictos de interés",
      "Sin cuentas ECN o de spread raw para traders de coste más bajo",
      "Las opciones de forex solo están disponibles para determinadas cuentas",
      "El proceso de verificación de cuenta puede ser lento",
    ],
    content: {
      overview: [
        "AvaTrade es un broker de forex y CFDs con regulación global, fundado en 2006 en Dublín. Regulado en 9 jurisdicciones que incluyen la UE, Australia, Japón y los EAU, AvaTrade ofrece una de las coberturas regulatorias más amplias del sector. La característica única de AvaOptions hace de AvaTrade uno de los pocos brokers que ofrece opciones de forex para clientes minoristas.",
        "Con más de 1.250 instrumentos, múltiples plataformas de trading y un robusto programa educativo a través de SharpTrader, AvaTrade atiende a traders de todos los niveles. El broker es especialmente conocido por sus funciones de copy trading a través de AvaSocial y DupliTrade.",
      ],
      verdict: [
        "AvaTrade es una sólida elección para traders que buscan amplias opciones de copy trading, trading de opciones de forex y una cobertura regulatoria global. La combinación de múltiples plataformas y las 9 jurisdicciones regulatorias crean una oferta atractiva.",
        "Los spreads más amplios y la alta comisión de inactividad son inconvenientes. Para trading activo de forex a bajo coste, IC Markets o Pepperstone son superiores. Pero para copy trading y opciones de forex, AvaTrade ofrece capacidades únicas.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     21. FXCM
  ───────────────────────────────────────────── */
  "fxcm": {
    verdict: "Bueno",
    promo: "Ejecución de modelo de agencia — sin intervención de mesa de operaciones",
    PROS: [
      "Modelo de ejecución de agencia genuino — sin mesa de operaciones",
      "Larga trayectoria desde 1999 — uno de los brokers de forex más antiguos",
      "Regulación FCA y ASIC con buena protección para clientes",
      "Plataforma Trading Station propia con análisis avanzado",
      "Herramientas cuantitativas y acceso a algoritmos de trading",
      "Datos de mercado y análisis de alta calidad",
      "Integración con NinjaTrader y otras plataformas de terceros",
      "Soporte para trading algorítmico y desarrollo de estrategias",
    ],
    CONS: [
      "Los spreads pueden ser más amplios que en brokers ECN puros",
      "Historial regulatorio con multas pasadas en EE.UU. (ya no opera en EE.UU.)",
      "Rango de instrumentos más limitado que competidores como IG o Saxo",
      "El reconocimiento de marca ha disminuido frente a competidores más nuevos",
      "El depósito mínimo de $50 es razonable pero no el más bajo del sector",
      "Las herramientas educativas son menos completas que las de XM o IG",
    ],
    content: {
      overview: [
        "FXCM es uno de los brokers de forex más antiguos, fundado en 1999 en Nueva York. Con regulación FCA y ASIC, FXCM opera un modelo de ejecución de agencia genuino donde las órdenes se enrutan directamente al mercado sin intervención de mesa de operaciones.",
        "La plataforma Trading Station propia de FXCM es conocida por sus capacidades cuantitativas avanzadas, incluyendo acceso a datos históricos, backtesting y desarrollo de estrategias. El broker es particularmente popular entre traders algorítmicos que utilizan las APIs de FXCM.",
      ],
      verdict: [
        "FXCM es una opción sólida para traders algorítmicos y cuantitativos que valoran la ejecución de modelo de agencia y el acceso a datos históricos. La plataforma Trading Station y las APIs de FXCM son herramientas genuinamente poderosas para el desarrollo de estrategias.",
        "Para el coste más bajo de trading o la plataforma más intuitiva, otras opciones son mejores. Pero para traders cuantitativos que necesitan acceso robusto a datos y herramientas algorítmicas, FXCM sigue siendo relevante.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     22. HFM
  ───────────────────────────────────────────── */
  "hfm": {
    verdict: "Bueno",
    promo: "Apalancamiento 1:2000 · Cuentas de spread cero · Copy trading",
    PROS: [
      "Apalancamiento de hasta 1:2000 en la entidad offshore — entre los más altos del sector",
      "Cuentas de spread cero disponibles con comisión baja",
      "Copy trading integrado vía HFcopy con estadísticas de señal transparentes",
      "Regulación FCA y CySEC con entidades adicionales globales",
      "Más de 1.000 instrumentos en forex, acciones, cripto y materias primas",
      "Múltiples tipos de cuenta para diferentes necesidades de trading",
      "Bonificaciones de depósito disponibles en cuentas offshore",
      "Plataforma MT4 y MT5 con herramientas adicionales de análisis",
    ],
    CONS: [
      "Los spreads en la cuenta estándar son más amplios que en los brokers ECN",
      "La entidad offshore FSA tiene menor protección regulatoria",
      "El apalancamiento de 1:2000 es extremadamente arriesgado para traders sin experiencia",
      "El sistema de bonificaciones puede ser complejo con requisitos de volumen",
      "El soporte al cliente puede ser lento durante las horas pico",
      "Las herramientas educativas son básicas comparadas con XM o IG",
    ],
    content: {
      overview: [
        "HFM (anteriormente HotForex) es un broker global de forex y CFDs fundado en 2010. Con regulación FCA y CySEC y presencia en múltiples jurisdicciones, HFM ofrece una amplia gama de tipos de cuenta, incluyendo cuentas de spread cero, para diferentes estilos de trading.",
        "El broker es conocido por su plataforma de copy trading HFcopy, que permite a los traders seguir y copiar señales de proveedores verificados con estadísticas transparentes. El alto apalancamiento disponible en las entidades offshore atrae a traders que buscan maximizar su exposición al mercado.",
      ],
      verdict: [
        "HFM es una elección decente para traders que buscan copy trading integrado y cuentas de spread cero. La regulación FCA y CySEC proporciona una protección razonable para clientes europeos.",
        "Sin embargo, el alto apalancamiento disponible a través de entidades offshore es extremadamente arriesgado. Para trading activo a bajo coste, IC Markets o Tickmill son superiores. Para copy trading, eToro o NAGA ofrecen plataformas más maduras.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     23. THINKMARKETS
  ───────────────────────────────────────────── */
  "thinkmarkets": {
    verdict: "Bueno",
    promo: "Plataforma ThinkTrader — más de 80 indicadores · Depósito mínimo $0",
    PROS: [
      "Plataforma ThinkTrader propia con 80+ indicadores y análisis avanzado",
      "Depósito mínimo de $0 — accesible para todos los niveles de trading",
      "Regulación FCA y ASIC para protección de clientes del Reino Unido y Australia",
      "Más de 3.500 instrumentos incluyendo acciones, forex, cripto e índices",
      "Cuentas ThinkZero con spreads raw desde 0,0 pips",
      "Copy trading y herramientas de inversión social disponibles",
      "Señales de trading integradas con múltiples proveedores de análisis",
      "VPS gratuito para traders elegibles con MT4",
    ],
    CONS: [
      "La comisión de la cuenta ThinkZero ($3,5/lot) es más alta que Tickmill",
      "Rango de instrumentos limitado para acciones comparado con IG o Saxo",
      "El reconocimiento de marca es menor que el de los brokers líderes",
      "Sin integración con cTrader",
      "El soporte educativo podría ser más completo",
      "Las condiciones de la cuenta pueden variar según la jurisdicción",
    ],
    content: {
      overview: [
        "ThinkMarkets es un broker de forex y CFDs fundado en 2010, con regulación FCA y ASIC. El broker es conocido por su plataforma propia ThinkTrader, que ofrece análisis avanzado y más de 80 indicadores técnicos en dispositivos móviles y web.",
        "Con cuentas ThinkZero que ofrecen spreads raw desde 0,0 pips y más de 3.500 instrumentos, ThinkMarkets se posiciona como una opción intermedia que combina herramientas de análisis avanzadas con condiciones de trading competitivas.",
      ],
      verdict: [
        "ThinkMarkets es una elección sólida para traders que valoran una plataforma móvil avanzada con buena regulación. La plataforma ThinkTrader es genuinamente diferenciadora, especialmente para traders que operan principalmente en dispositivos móviles.",
        "Para el coste más bajo de ECN, Tickmill o IC Markets son superiores. Para un ecosistema de plataformas más completo, Pepperstone ofrece más opciones. Pero para traders móviles que valoran las herramientas avanzadas de análisis, ThinkMarkets es una opción atractiva.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     24. FXTM
  ───────────────────────────────────────────── */
  "fxtm": {
    verdict: "Muy Bueno",
    promo: "Comisión de $2/lote — apalancamiento 1:2000 — copy trading FXTM Invest",
    PROS: [
      "FXTM Invest para copy trading con estadísticas transparentes de estrategia",
      "Comisión de $2/lote en cuenta ECN — entre las más bajas del sector",
      "Regulación FCA y CySEC con buena protección para clientes",
      "Más de 250 instrumentos con forex, acciones, cripto e índices",
      "Depósito mínimo bajo con múltiples tipos de cuenta disponibles",
      "Programa educativo FXTM con seminarios y webinars",
      "MT4 y MT5 disponibles con análisis de Trading Central",
      "Soporte al cliente 24/5 en múltiples idiomas",
    ],
    CONS: [
      "Rango de instrumentos limitado comparado con IC Markets o IG",
      "La comisión de $2/lote no está disponible en todos los tipos de cuenta",
      "La entidad offshore FSC tiene menor protección regulatoria",
      "El alto apalancamiento en entidades offshore es extremadamente arriesgado",
      "Las funciones de la plataforma son menos avanzadas que las de Pepperstone",
      "El reconocimiento de marca es menor que el de los brokers tier-1",
    ],
    content: {
      overview: [
        "FXTM (ForexTime) es un broker de forex y CFDs fundado en 2011 con regulación FCA y CySEC. El broker es particularmente conocido por su plataforma de copy trading FXTM Invest y sus competitivas comisiones en cuentas ECN, que empiezan desde $2 por lote — significativamente por debajo del estándar de la industria.",
        "Con sede en Chipre y presencia en múltiples jurisdicciones, FXTM atiende a traders de más de 150 países. El broker combina condiciones de trading competitivas con un sólido programa educativo a través de seminarios y webinars en múltiples idiomas.",
      ],
      verdict: [
        "FXTM es una buena elección para traders que buscan copy trading integrado con comisiones ECN competitivas. La combinación de FXTM Invest y las bajas comisiones en cuentas ECN crea una propuesta de valor atractiva.",
        "Sin embargo, el rango de instrumentos limitado y la menor presencia de marca son inconvenientes. Para los costes más bajos de ECN con mejor regulación, Tickmill o IC Markets son superiores. Para copy trading con una comunidad más grande, eToro es una mejor opción.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     25. CAPITAL.COM
  ───────────────────────────────────────────── */
  "capital-com": {
    verdict: "Muy Bueno",
    promo: "Perspectivas de trading impulsadas por IA — más de 3.700 instrumentos — CFDs sin comisión",
    PROS: [
      "Plataforma de trading con IA integrada que proporciona perspectivas personalizadas",
      "Más de 3.700 instrumentos con CFDs sin comisión",
      "Regulación FCA y CySEC con sólida protección para clientes",
      "Spreads competitivos desde 0,6 pips en EUR/USD",
      "Plataforma web y móvil modernas con experiencia de usuario excepcional",
      "Investmate — app educativa propia para aprendizaje estructurado",
      "Educación integrada con alertas de sesgos cognitivos para mejorar el trading",
      "Depósito mínimo de $20 — muy accesible para principiantes",
    ],
    CONS: [
      "Modelo de creador de mercado — sin opciones ECN de spread raw",
      "Sin MT4, MT5 ni cTrader",
      "Rango de instrumentos limitado comparado con IG o Saxo",
      "Sin copy trading integrado",
      "Los spreads son más amplios que los brokers ECN en muchos instrumentos",
      "Sin trading de acciones reales — solo CFDs",
    ],
    content: {
      overview: [
        "Capital.com es un broker de trading moderno fundado en 2016 en Londres, conocido por su enfoque innovador en la educación del trading y la inteligencia artificial. Con regulación FCA y CySEC, Capital.com ofrece más de 3.700 instrumentos CFD en una plataforma elegante y fácil de usar.",
        "La característica más innovadora de Capital.com es su sistema de IA integrado que analiza el comportamiento del trader para identificar sesgos cognitivos y proporcionar perspectivas personalizadas para mejorar el rendimiento. Combinado con la app educativa Investmate, Capital.com es una de las mejores opciones para traders que quieren aprender mientras operan.",
      ],
      verdict: [
        "Capital.com es una excelente elección para traders principiantes e intermedios que valoran la educación integrada y una plataforma moderna. La combinación de IA, Investmate y los bajos spreads sin comisión crea un entorno de aprendizaje único.",
        "Para el coste más bajo de trading o plataformas más avanzadas, IC Markets o Pepperstone son superiores. Pero para traders que priorizan la educación y la experiencia de usuario, Capital.com es una de las mejores opciones disponibles.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     26. ROBOFOREX
  ───────────────────────────────────────────── */
  "roboforex": {
    verdict: "Bueno",
    promo: "Más de 12.000 instrumentos — apalancamiento 1:2000 — copy trading CopyFX",
    PROS: [
      "Más de 12.000 instrumentos negociables — rango extraordinariamente amplio",
      "Apalancamiento de hasta 1:2000 para traders experimentados",
      "Plataforma CopyFX para copy trading con rendimiento verificado de señales",
      "Múltiples tipos de cuenta incluyendo ECN, cuentas de centavos y estándar",
      "MT4, MT5 y plataforma R Trader propia disponibles",
      "Bonificaciones de depósito disponibles — hasta 60% en algunos tipos de cuenta",
      "Condiciones de trading flexibles con spreads muy bajos en cuentas ECN",
      "Soporte al cliente 24/7 disponible en múltiples idiomas",
    ],
    CONS: [
      "Regulación FSC (Belice) como principal — menor protección que FCA o ASIC",
      "Las bonificaciones pueden tener condiciones complejas de retiro",
      "El alto apalancamiento es extremadamente arriesgado para la mayoría de traders",
      "El reconocimiento de marca es menor que el de los brokers líderes",
      "Sin regulación Tier-1 en la mayoría de jurisdicciones",
      "La calidad del soporte al cliente puede ser inconsistente",
    ],
    content: {
      overview: [
        "RoboForex es un broker de forex y CFDs fundado en 2009 en Belice. Con más de 12.000 instrumentos negociables y regulación FSC, RoboForex ofrece uno de los rangos de instrumentos más amplios del sector junto a condiciones de trading flexibles.",
        "El broker es conocido por su plataforma de copy trading CopyFX, que permite a los traders seguir y copiar estrategias de proveedores verificados. Las múltiples opciones de cuenta y el alto apalancamiento atraen a traders que buscan flexibilidad en sus condiciones de trading.",
      ],
      verdict: [
        "RoboForex puede ser atractivo para traders que valoran el amplio rango de instrumentos y las condiciones de trading flexibles. La plataforma CopyFX y la variedad de tipos de cuenta ofrecen opciones para diferentes estilos de trading.",
        "Sin embargo, la falta de regulación Tier-1 es una preocupación significativa. Para traders que priorizan la seguridad regulatoria, IC Markets, Pepperstone o cualquier broker ASIC/FCA son opciones mucho más seguras. RoboForex es más adecuado para traders experimentados que comprenden los riesgos regulatorios.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     27. BLACKBULL MARKETS
  ───────────────────────────────────────────── */
  "blackbull": {
    verdict: "Muy Bueno",
    promo: "Más de 26.000 instrumentos — ECN real — depósito mínimo $0",
    PROS: [
      "Más de 26.000 instrumentos negociables — uno de los rangos más amplios globalmente",
      "Cinco opciones de plataforma: MT4, MT5, cTrader, TradingView y BlackBull Trade",
      "Depósito mínimo de $0 en todas las cuentas incluyendo ECN Prime",
      "Ejecución ECN/NDD real con infraestructura Equinix NY4 y LD4",
      "4,5/5 en Trustpilot de más de 2.680 reseñas — excelente satisfacción del cliente",
      "Cuenta Institucional con comisión de $4/lote para traders de alto volumen",
      "Integración con TradingView con ejecución directa desde gráficos",
      "Enfoque firme en la calidad de ejecución — llenado medio inferior a 20 ms",
    ],
    CONS: [
      "Sin regulación Tier-1 (UE/Reino Unido/Australia) — FMA Nueva Zelanda es Tier-2",
      "Comisión ECN Prime de $6/lote más alta que IC Markets ($6) y FXTM ($4)",
      "La entidad de Seychelles para clientes internacionales proporciona mínima protección",
      "Empresa más pequeña comparada con gigantes del sector como IG o CMC Markets",
      "El contenido educativo es limitado comparado con especialistas como IG o Capital.com",
      "El copy trading de ZuluTrade es de terceros — no tan integrado como el sistema nativo de eToro",
    ],
    content: {
      overview: [
        "BlackBull Markets es un broker ECN neozelandés que ha construido una sólida reputación por la ejecución genuina sin mesa de operaciones, una extraordinaria selección de instrumentos de 26.000+ activos y una de las ofertas de plataformas más amplias del sector. Fundado en 2014 en Auckland, la empresa aprovecha la infraestructura de centros de datos Equinix para una ejecución de grado institucional.",
        "El broker ofrece cinco opciones de plataforma — MetaTrader 4, MetaTrader 5, cTrader, TradingView y el BlackBull Trade propio — atendiendo a cada estilo de trading, desde el scalping hasta la inversión a largo plazo. La integración con TradingView con ejecución directa es particularmente atractiva para traders centrados en los gráficos.",
      ],
      verdict: [
        "BlackBull Markets ofrece un paquete impresionante para traders ECN — más de 26.000 instrumentos, cinco opciones de plataforma incluyendo TradingView, ejecución NDD real con infraestructura Equinix y depósito mínimo de $0. La puntuación de 4,5 en Trustpilot refleja genuina satisfacción con la calidad de ejecución y el servicio. Para traders que valoran la diversidad de instrumentos y la flexibilidad de plataforma, BlackBull es una excelente elección.",
        "La limitación clave es la regulación — FMA Nueva Zelanda (Tier-2) y FSA Seychelles (Tier-3) ofrecen menos protección que los competidores regulados por ASIC, FCA o CySEC. La comisión ECN Prime de $6/lote es competitiva pero no la más barata.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     28. AXI
  ───────────────────────────────────────────── */
  "axi": {
    verdict: "Muy Bueno",
    promo: "Regulación ASIC + FCA — depósito mínimo $0 — VPS y Autochartist gratuitos",
    PROS: [
      "Regulación Tier-1 dual ASIC + FCA — 18 años de historial operativo limpio",
      "Depósito mínimo de $0 en todas las cuentas incluyendo Pro ECN",
      "Autochartist gratuito para reconocimiento de patrones y señales de trading",
      "VPS gratuito para traders activos elegibles — ideal para EAs y trading algorítmico",
      "Analíticas de trading con IA de PsyQuation que proporcionan perspectivas sobre el comportamiento",
      "Axi Copy trading social integrado en la plataforma",
      "Cuenta Elite con comisión de $3,50/lote para traders de alto volumen ($25.000+)",
      "Sólida puntuación en Trustpilot (4,4/5) que refleja consistente satisfacción del cliente",
    ],
    CONS: [
      "La comisión de la cuenta Pro de $7/lote es más alta que IC Markets ($6) o FXTM ($4)",
      "Rango de instrumentos limitado (290+) — mucho menos que IC Markets (2.250+) o BlackBull (26.000+)",
      "Sin MetaTrader 5, cTrader ni integración con TradingView",
      "La plataforma Axi Trading aún está madurando",
      "Sin trading DMA de acciones — solo CFDs",
      "La cuenta Elite requiere un depósito mínimo de $25.000",
    ],
    content: {
      overview: [
        "Axi (anteriormente AxiTrader) es un broker ECN con sede en Sídney y 18 años de operación bajo regulación Tier-1 dual ASIC y FCA — uno de los historiales más largos entre los brokers ECN regulados. Fundado en 2007, la empresa ha construido una reputación por la ejecución fiable, precios transparentes y útiles herramientas de trading como Autochartist gratuito y analíticas PsyQuation.",
        "El broker ofrece depósito mínimo de $0 en todos los tipos de cuenta, incluyendo la cuenta Pro ECN con spreads raw desde 0,0 pips. Combinado con VPS gratuito para traders activos, Axi crea una propuesta particularmente atractiva para estrategias de trading algorítmico y con EAs.",
      ],
      verdict: [
        "Axi es un broker ECN maduro y bien regulado que ofrece fiabilidad — 18 años de operación ASIC+FCA, ejecución ECN genuina y prácticas herramientas gratuitas (VPS, Autochartist, PsyQuation) crean una base sólida para traders serios. El depósito mínimo de $0 y el modelo de precios limpio lo hacen accesible en todos los niveles.",
        "Las limitaciones son el rango de instrumentos modesto (290+), las restricciones de plataforma (solo MT4 y nueva Axi Platform) y la comisión Pro ($7/lote) por encima de las opciones ECN más baratas. Para la máxima regulación con ejecución ECN, Axi compite directamente con Pepperstone, que ofrece más plataformas e instrumentos pero sin el VPS y las herramientas analíticas gratuitas.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     29. FUSION MARKETS
  ───────────────────────────────────────────── */
  "fusion-markets": {
    verdict: "Muy Bueno",
    promo: "$4,50/lote — La comisión ECN más baja de cualquier broker ASIC — depósito mínimo $0",
    PROS: [
      "Comisión de $4,50/lote — la tasa ECN más baja de cualquier broker regulado por ASIC",
      "Regulación ASIC Tier-1 con fondos segregados y resolución de disputas AFCA",
      "Depósito mínimo de $0 en todas las cuentas — sin barrera de entrada",
      "Cuatro plataformas: MT4, MT5, cTrader, TradingView — selección completa",
      "Spread medio EUR/USD de 0,09 pips — entre los más ajustados del sector",
      "Sin comisiones de depósito ni retiro en ningún método",
      "Enfoque transparente y sin artificios en los precios — lo que ves es lo que pagas",
      "Integración de copy trading Myfxbook AutoTrade",
    ],
    CONS: [
      "Empresa más pequeña — menos establecida que IC Markets o Pepperstone",
      "Los clientes internacionales caen bajo VFSC/Seychelles — protección Tier-3",
      "Rango de instrumentos limitado (250+) — menos que la mayoría de competidores",
      "Sin plataforma propia ni herramientas únicas (sin Autochartist, sin VPS)",
      "El contenido educativo es mínimo — no apto para principiantes completos",
      "Sin soporte telefónico — solo chat en vivo y correo electrónico",
    ],
    content: {
      overview: [
        "Fusion Markets es un broker ECN con sede en Melbourne construido sobre una premisa única: ofrecer los costes de trading más bajos posibles manteniendo la regulación ASIC. Fundado en 2017 por veteranos del sector Phil Horner y Matthew Murphie, la empresa ha crecido rápidamente en reputación como el broker ECN regulado por ASIC de menor coste disponible.",
        "La cuenta ZERO cobra solo $4,50 por lote ($9 por vuelta completa) — significativamente menos que IC Markets ($6/lote) o Pepperstone ($7/lote). Combinado con spreads medios EUR/USD de 0,09 pips, el coste total de trading es de aproximadamente $5,40 por lote estándar — el más bajo de cualquier broker regulado por ASIC que hemos probado.",
      ],
      verdict: [
        "Fusion Markets ofrece exactamente lo que promete — los costes de trading ECN más bajos de cualquier broker regulado por ASIC. La comisión de $4,50/lote y el spread medio de 0,09 pips en EUR/USD crean costes totales de $5,40/lote que superan a todos los principales competidores ASIC. La selección de cuatro plataformas (MT4, MT5, cTrader, TradingView) proporciona genuina flexibilidad, y el depósito mínimo de $0 elimina todas las barreras.",
        "Los compromisos son un perfil de empresa más pequeño, instrumentos limitados (250+), educación mínima y sin soporte telefónico. Los clientes internacionales enfrentan regulación Tier-3. Para traders conscientes de los costes que saben lo que hacen y quieren seguridad ASIC, Fusion Markets es la elección óptima.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     30. GO MARKETS
  ───────────────────────────────────────────── */
  "go-markets": {
    verdict: "Bueno",
    promo: "Regulación ASIC + CySEC — 19 años de operación — ECN cTrader",
    PROS: [
      "Regulación Tier-1 dual ASIC + CySEC — 19 años de operación continua",
      "Uno de los brokers de forex minorista más antiguos de Australia — historial probado",
      "Plataforma cTrader con profundidad de mercado para trading ECN avanzado",
      "Cuatro opciones de plataforma: MT4, MT5, cTrader, GO WebTrader",
      "Reconocimiento gratuito de patrones Autochartist para todos los titulares de cuenta",
      "De propiedad y operación australiana — fuerte presencia en el mercado local",
      "Sin comisiones de depósito ni retiro en ningún método",
      "Más de 1.000 instrumentos en forex, índices, materias primas, cripto y acciones",
    ],
    CONS: [
      "Depósito mínimo de $200 — igual que IC Markets pero por encima de Fusion ($0) y Pepperstone ($0)",
      "Comisión de $6/lote en GO Plus — no la más barata (Fusion $4,50, IC Markets $6)",
      "Los spreads medios (0,12 pips) son ligeramente más amplios que IC Markets (0,02 pips)",
      "Empresa más pequeña con menor alcance global que los gigantes del sector",
      "El contenido educativo es adecuado pero no excepcional",
      "GO WebTrader es funcional pero carece de las funciones avanzadas de las plataformas propias de los competidores",
    ],
    content: {
      overview: [
        "GO Markets es uno de los brokers de forex minorista más antiguos de Australia, operando continuamente bajo regulación ASIC desde 2006. Con sede en Melbourne, la empresa ha construido un historial de 19 años de ejecución ECN/STP fiable, añadiendo regulación CySEC en 2017 para atender a clientes europeos.",
        "El broker ofrece cuatro plataformas — MT4, MT5, cTrader y el GO WebTrader propio — proporcionando cobertura completa desde el trading clásico de forex hasta la ejecución ECN avanzada con profundidad de mercado. La cuenta GO Plus ofrece spreads raw desde 0,0 pips con comisión de $6/lote.",
      ],
      verdict: [
        "GO Markets ofrece lo que la experiencia proporciona — 19 años de operación regulada ASIC+CySEC, ejecución ECN probada y una experiencia de trading fiable. La plataforma cTrader, la selección de cuatro plataformas y más de 1.000 instrumentos cubren las necesidades de la mayoría de traders. La puntuación de 4,3 en Trustpilot refleja satisfacción consistente de traders que valoran la estabilidad.",
        "Los compromisos son costes ligeramente más altos que los competidores ECN más baratos (Fusion Markets, FXTM), depósito mínimo de $200 y sin funciones innovadoras destacadas. GO Markets es la elección fiable y establecida para traders que priorizan la regulación probada y el historial sobre las funciones de vanguardia o los costes más bajos.",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     31. NAGA
  ───────────────────────────────────────────── */
  "naga": {
    verdict: "Bueno",
    promo: "Plataforma de trading social — Copia a los mejores traders — Acciones + Cripto + CFDs",
    PROS: [
      "Regulación Tier-1 dual CySEC + BaFin — empresa pública alemana (Bolsa de Fráncfort)",
      "Trading social con auto-copia — sigue y replica operaciones de los mejores performers",
      "Más de 3.500 instrumentos incluyendo acciones reales, cripto, forex, índices y materias primas",
      "Empresa pública (N4G) — finanzas y gobernanza transparentes",
      "Feed social de NAGA con perspectivas de la comunidad, compartición de operaciones y discusión",
      "Propiedad real de acciones disponible junto a CFDs — no solo derivados",
      "App móvil moderna con funciones sociales integradas y copy trading",
      "Monedero cripto y trading junto a mercados tradicionales",
    ],
    CONS: [
      "Spreads más amplios (1,5 pips EUR/USD) — significativamente más caro que los brokers ECN",
      "Sin opción de cuenta ECN o spread raw — solo modelo de spread-inclusion sin comisión",
      "La cuenta Diamond requiere $15.000 para los spreads más ajustados (0,7 pips)",
      "Ejecución de creador de mercado — no apto para scalping o estrategias de alta frecuencia",
      "Broker más pequeño comparado con eToro en cuota de mercado de trading social",
      "La entidad FSCA para clientes africanos proporciona menor protección que la regulación de la UE",
    ],
    content: {
      overview: [
        "NAGA es una empresa alemana de fintech que ha construido una de las principales plataformas de trading social de Europa, combinando el trading tradicional de forex y CFDs con inversión social, criptomonedas y propiedad real de acciones. Fundada en 2015 por Benjamin Bilski y cotizada en la Bolsa de Fráncfort (N4G), NAGA opera con regulación Tier-1 dual CySEC y BaFin.",
        "La propuesta central de la plataforma es el trading social — los usuarios pueden explorar, seguir y copiar automáticamente operaciones de traders exitosos dentro de la comunidad NAGA. El feed social, las funciones de discusión y las métricas de rendimiento transparentes crean una experiencia genuina de inversión social que va más allá de la simple copia de operaciones.",
      ],
      verdict: [
        "NAGA ocupa una posición única como plataforma de trading social regulada por CySEC+BaFin y cotizada en bolsa. La combinación de inversión social, copy trading, propiedad real de acciones y monedero cripto integrado crea una plataforma todo-en-uno para traders que valoran la comunidad y las funciones sociales. La cotización en la Bolsa de Fráncfort añade una transparencia rara en el sector de brokers.",
        "Los compromisos son claros: los spreads más amplios (1,5 pips EUR/USD en Iron) hacen que NAGA sea caro para traders individuales activos, y la falta de opciones ECN o spread raw limita el atractivo para traders centrados en la ejecución. Para trading social y copy investing, NAGA compite directamente con eToro — ofreciendo una regulación de la UE más sólida pero una comunidad más pequeña.",
      ],
    },
  },

};

export default es;

