/* Cabecera común de IPSO: tema claro/oscuro e idiomas (ES/EN/CAT). */
export const PAL = {
  dark:  { fg: '#F4F6F3', dim: '#9CA39A', line: '#262924' },
  light: { fg: '#0B0C0A', dim: '#5A605C', line: '#D2D5CF' }
};

const LIGHT_MAP = {
  '244,246,243': '11,12,10',
  '0,0,0': '255,255,255',
  '255,255,255': '0,0,0',
  '156,163,154': '90,96,92',
  '139,145,138': '110,116,110',
  '173,179,171': '90,96,92',
  '183,189,181': '90,96,92',
  '210,214,207': '63,68,63',
  '226,229,222': '48,52,48',
  '118,123,117': '110,116,110',
  '167,173,165': '110,116,110',
  '94,99,92': '138,144,138',
  '195,199,192': '63,68,63',
  '195,200,191': '63,68,63',
  '22,24,21': '230,232,228',
  '26,28,25': '227,229,224',
  '38,41,36': '210,213,207',
  '58,62,56': '183,187,180',
  '74,79,71': '154,160,152',
  '6,20,26': '233,251,255'
};
const ACCENT_TEXT = { '43,231,255': '10,124,147', '132,240,255': '14,156,184' };

function toLight(prop, value) {
  return value.replace(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/g, function (m, r, g, bl, al) {
    const key = r + ',' + g + ',' + bl;
    const alpha = al === undefined ? 1 : parseFloat(al);
    let out = null;
    if ((prop === 'color' || prop === 'caret-color') && ACCENT_TEXT[key]) out = ACCENT_TEXT[key];
    else if (key === '255,255,255') { if (alpha === 1) out = LIGHT_MAP[key]; }
    else if (LIGHT_MAP[key]) out = LIGHT_MAP[key];
    if (!out) return m;
    return al === undefined ? 'rgb(' + out.split(',').join(', ') + ')' : 'rgba(' + out.split(',').join(', ') + ', ' + al + ')';
  });
}

const LIGHT_CSS = [
  'html { background: #FFFFFF; }',
  'body { color: #0B0C0A !important; }',
  'a:not([style]) { color: #0A7C93 !important; }',
  'a:not([style]):hover { color: #0E9CB8 !important; }',
  'details[open] summary [data-plus] { color: #0A7C93 !important; }',
  '[data-word] { filter: invert(1); }',
  '[data-paymark] { filter: invert(1); }'
].join('\n');

export function applyTheme(theme) {
  const light = theme === 'light';
  let tag = document.getElementById('ipso-theme');
  if (!tag) { tag = document.createElement('style'); tag.id = 'ipso-theme'; document.head.appendChild(tag); }
  tag.textContent = light ? LIGHT_CSS : '';
  document.querySelectorAll('[style]').forEach(function (el) {
    const now = el.getAttribute('style') || '';
    if (now !== el.__ours) el.__base = now;
    const base = el.__base === undefined ? now : el.__base;
    let v = base;
    if (light) {
      v = base.split(';').map(function (decl) {
        const k = decl.indexOf(':');
        if (k < 0) return decl;
        const prop = decl.slice(0, k).trim();
        const raw = decl.slice(k + 1);
        const bang = /!\s*important\s*$/.test(raw);
        const val = raw.replace(/!\s*important\s*$/, '').trim();
        const lit = toLight(prop.toLowerCase(), val);
        if (lit === val) return decl;
        return decl.slice(0, k) + ': ' + lit + (bang ? ' !important' : '');
      }).join(';');
    }
    if (v !== now) el.setAttribute('style', v);
    el.__ours = v;
  });
  document.documentElement.style.background = light ? '#FFFFFF' : '#000000';
  document.body.style.background = 'transparent';
}

/* Textos comunes de las fichas de solución. */
const EN_PAIRS = [
  ['Soluciones', 'Solutions'], ['Cómo funciona', 'How it works'], ['Precios', 'Prices'], ['Contacto', 'Contact'], ['Dudas', 'FAQ'],
  ['Oscuro', 'Dark'], ['Claro', 'Light'], 
  ['pago único, + IVA', 'one-off, + VAT'], ['Con IVA:', 'With VAT:'], ['pago único', 'one-off'], ['Programación incluida · Garantía comercial 30 días', 'Programming included · 30-day commercial guarantee'],
  ['Lo quiero', 'I want it'], ['Añadir a la cesta', 'Add to basket'],
  ['Envío', 'Shipping'], ['gratuito', 'free'], ['dentro de España y garantía de reembolso de tu dinero en hasta', 'within Spain and money-back guarantee within'], ['30 días', '30 days'],
  ['Programación incluida.', 'Programming included.'], ['Programación personalizada', 'Custom programming'], ['Primer mes de panel y estadísticas', 'First month of dashboard and statistics'],
  ['No, pago único. Incluye el primer mes de panel y estadísticas.', 'No, a one-off payment. It includes the first month of dashboard and statistics.'], ['Caja de madera', 'Wooden block'],
  ['Sin app', 'No app'], ['Funciona en cualquier móvil', 'Works on any phone'], ['iPhone y Android', 'iPhone and Android'],
  ['Paga tu pedido con tarjeta o móvil', 'Pay your order by card or phone'],
  ['2ª unidad a mitad de precio', 'Second unit at half price'], ['Agotado por ahora.', 'Sold out for now.'], ['Qué incluye', 'What is included'], ['Especificaciones', 'Specifications'],
  ['Elige tu pedido', 'Choose your order'], ['Tipo', 'Type'], ['Cantidad', 'Quantity'], ['¿Más mesas? Añade placas', 'More tables? Add plates'],
  ['1 unidad', '1 unit'], ['Pack 4', 'Pack of 4'], ['Pack 8', 'Pack of 8'],
  ['Tu pedido', 'Your order'], ['Pago único, + IVA · Programación incluida · Garantía comercial 30 días', 'One-off payment, + VAT · Programming included · 30-day commercial guarantee'],
  ['Cambios ilimitados y tus estadísticas de esta solución.', 'Unlimited changes and your statistics for this solution.'],
  ['Opcional, cancela cuando quieras.', 'Optional, cancel whenever you want.'],
  ['También en el IPSO HUB', 'Also in the IPSO HUB'], ['Volver a la home →', 'Back to home →'],
  ['WiFi', 'Wi-Fi'], ['Deja de deletrear la contraseña del WiFi.', 'Stop spelling out your Wi-Fi password.'],
  ['Reseñas Google', 'Google Reviews'], ['Más reseñas en Google, sin pedirlas a mano.', 'More Google reviews, without asking one by one.'],
  ['Reservas', 'Bookings'], ['Que reserven antes de salir del local.', 'Let them book before they leave.'],
  ['Menú', 'Menu'], ['Tu carta, desde la mesa. Cambias un precio y está cambiado.', 'Your menu, from the table. Change a price and it is changed.'], ['¿Quieres que además recomiende y atienda en su idioma? Eso es el IPSO HUB →', 'Want it to also recommend and serve in their language? That is the IPSO HUB →'],
  ['Stand blanco', 'White stand'], ['Stand negro', 'Black stand'], ['Plate', 'Plate'],
  ['Programamos tu red', 'We programme your network'], ['Con tu nombre de red y tu clave.', 'With your network name and password.'],
  ['Lo pones en mesa o barra', 'You place it on a table or the bar'], ['Donde la gente se sienta y saca el móvil.', 'Where people sit down and take out their phone.'],
  ['Tocan o escanean, copian y dentro', 'They tap or scan, copy and they are in'], ['La clave se copia sola. Funciona en todos los iPhone y Android.', 'The password copies itself. Works on every iPhone and Android.'],
  ['Punto NFC de WiFi programado', 'Wi-Fi contact point, programmed'], ['Programación personalizada', 'Custom programming'],
  ['Cambio de clave cuando quieras', 'Password changes whenever you want'], ['Código de respaldo para escanear', 'Backup code to scan'], ['Garantía comercial 30 días', '30-day commercial guarantee'],
  ['Lo conectamos a tu ficha', 'We connect it to your listing'], ['Llega programado con tu negocio. Tú no configuras nada.', 'It arrives programmed with your business. You configure nothing.'],
  ['Lo pones donde se paga', 'You place it where people pay'], ['Mostrador, barra o recepción. Ocupa lo que un vaso.', 'Counter, bar or reception. It takes up as much room as a glass.'],
  ['Tocan y publican', 'They tap and post'], ['Se abre tu ficha oficial de Google con la reseña lista.', 'Your official Google listing opens with the review ready.'],
  ['Stand o plate programado', 'Stand or plate, programmed'], ['Ficha de Google conectada', 'Google listing connected'], ['Cambios y ajustes el primer año', 'Changes and adjustments for the first year'],
  ['Conectamos tu agenda', 'We connect your calendar'], ['Con el calendario que ya usas, con tus horarios reales.', 'With the calendar you already use and your real opening hours.'],
  ['Pegamos el sticker en la puerta', 'We stick it on the door'], ['Por fuera, visible desde la calle y resistente al agua.', 'Outside, visible from the street and waterproof.'],
  ['Tocan y reservan', 'They tap and book'], ['Reciben confirmación de su reserva.', 'They get a confirmation of their booking.'],
  ['Sticker de puerta programado', 'Door sticker, programmed'], ['Conexión con tu agenda', 'Connection to your calendar'], ['Automatic reminder for the customer'],
  ['Montamos tu carta', 'We build your menu'], ['Con tus platos, precios, alérgenos y fotos.', 'With your dishes, prices, allergens and photos.'],
  ['Colocamos las placas', 'We fit the plates'], ['Una por mesa, fijas y resistentes a la limpieza.', 'One per table, fixed and cleaning-resistant.'],
  ['Tocan y ven la carta', 'They tap and see the menu'], ['Con fotos, alérgenos y precios siempre al día.', 'With photos, allergens and prices always up to date.'],
  ['Carta digital montada por nosotros', 'Digital menu built by us'], ['Cuatro placas de mesa', 'Four table plates'], ['Cambios de carta ilimitados el primer año', 'Unlimited menu changes for the first year'],
  ['NFC (acercar el móvil) → funciona en Android.', 'NFC (tap the phone) → works on Android.'],
  ['QR → funciona en iPhone y Android.', 'QR → works on iPhone and Android.'],
  ['Así lo usa cualquier cliente, tenga el móvil que tenga.', 'That way any customer can use it, whatever phone they carry.'],
  ['Conexión con tu agenda: el calendario que ya usas.', 'Connection to your calendar: the one you already use.'],
  ['Recordatorio automático al cliente.', 'Automatic reminder for the customer.'],
  ['NFC (Android) y QR (iPhone y Android): funciona en cualquier móvil.', 'NFC (Android) and QR (iPhone and Android): it works on any phone.'],
  ['Incluye 4 placas de mesa. Los packs añaden placas o locales.', 'Includes 4 table plates. Packs add plates or venues.'],
  ['¿Necesito una app?', 'Do I need an app?'], ['No. Ni tú ni tus clientes. Acercan el móvil y se abre lo que hayamos configurado.', 'No. Neither you nor your customers. They tap their phone and whatever we configured opens.'],
  ['No. Ni tú ni tus clientes. Acercan el móvil y se abre tu ficha.', 'No. Neither you nor your customers. They tap their phone and your listing opens.'],
  ['No. El cliente acerca el móvil y se abre tu carta en el navegador.', 'No. The customer taps their phone and your menu opens in the browser.'],
  ['¿Hay cuota mensual?', 'Is there a monthly fee?'], ['No, pago único. IPSO+ es opcional, 1 €/mes, y se cancela cuando quieras.', 'No, a one-off payment. IPSO+ is optional, 1 €/month, and can be cancelled whenever you want.'],
  ['¿Puedo cambiar la clave del WiFi?', 'Can I change the Wi-Fi password?'], ['Sí. Nos lo dices y lo reprogramamos sin cambiar el soporte.', 'Yes. Tell us and we reprogram it without changing the device.'],
  ['¿Esto está permitido por Google?', 'Is this allowed by Google?'], ['Sí. Abre el mismo enlace oficial de reseñas de Google que podrías enviar por correo. Nunca filtramos ni bloqueamos reseñas.', 'Yes. It opens the same official Google review link you could send by email. We never filter or block reviews.'],
  ['¿Funciona con el local cerrado?', 'Does it work when the venue is closed?'], ['Sí. Está por fuera, así que pueden reservar a cualquier hora.', 'Yes. It is outside, so they can book at any time.'],
  ['¿Con qué agenda funciona?', 'Which calendar does it work with?'], ['Lo conectamos con el calendario que ya usas y con tus horarios reales.', 'We connect it to the calendar you already use and your real opening hours.'],
  ['¿Puedo cambiar la carta?', 'Can I change the menu?'], ['Sí. El primer año los cambios están incluidos; luego, con IPSO+ los haces tú.', 'Yes. Changes are included in the first year; after that, with IPSO+ you make them yourself.'],
  ['¿Cuántas placas incluye?', 'How many plates are included?'], ['Cuatro placas de mesa. Si tienes más mesas, añade un pack.', 'Four table plates. If you have more tables, add a pack.']
];

const CA_PAIRS = [
  ['Soluciones', 'Solucions'], ['Cómo funciona', 'Com funciona'], ['Precios', 'Preus'], ['Contacto', 'Contacte'], ['Dudas', 'Dubtes'],
  ['Oscuro', 'Fosc'], ['Claro', 'Clar'], 
  ['pago único, + IVA', 'pagament únic, + IVA'], ['Con IVA:', 'Amb IVA:'], ['pago único', 'pagament únic'], ['Programación incluida · Garantía comercial 30 días', 'Programació inclosa · Garantia comercial 30 dies'],
  ['Lo quiero', 'El vull'], ['Añadir a la cesta', 'Afegir a la cistella'],
  ['Envío', 'Enviament'], ['gratuito', 'gratuït'], ['dentro de España y garantía de reembolso de tu dinero en hasta', 'dins d\u2019Espanya i garantia de devolució dels teus diners fins a'], ['30 días', '30 dies'],
  ['Programación incluida.', 'Programació inclosa.'], ['Programación personalizada', 'Programació personalitzada'], ['Primer mes de panel y estadísticas', 'Primer mes de panell i estadístiques'],
  ['No, pago único. Incluye el primer mes de panel y estadísticas.', 'No, pagament únic. Inclou el primer mes de panell i estadístiques.'], ['Caja de madera', 'Caixa de fusta'],
  ['Sin app', 'Sense app'], ['Funciona en cualquier móvil', 'Funciona a qualsevol mòbil'], ['iPhone y Android', 'iPhone i Android'],
  ['Paga tu pedido con tarjeta o móvil', 'Paga la teva comanda amb targeta o mòbil'],
  ['2ª unidad a mitad de precio', 'Segona unitat a meitat de preu'], ['Agotado por ahora.', 'Exhaurit per ara.'], ['Qué incluye', 'Què inclou'], ['Especificaciones', 'Especificacions'],
  ['Elige tu pedido', 'Tria la teva comanda'], ['Tipo', 'Tipus'], ['Cantidad', 'Quantitat'], ['¿Más mesas? Añade placas', 'Més taules? Afegeix plaques'],
  ['1 unidad', '1 unitat'], ['Pack 4', 'Pack 4'], ['Pack 8', 'Pack 8'],
  ['Tu pedido', 'La teva comanda'], ['Pago único, + IVA · Programación incluida · Garantía comercial 30 días', 'Pagament únic, + IVA · Programació inclosa · Garantia comercial 30 dies'],
  ['Cambios ilimitados y tus estadísticas de esta solución.', 'Canvis il·limitats i les teves estadístiques d\u2019aquesta solució.'],
  ['Opcional, cancela cuando quieras.', 'Opcional, cancel·la quan vulguis.'],
  ['También en el IPSO HUB', 'També a l\u2019IPSO HUB'], ['Volver a la home →', 'Tornar a la home →'],
  ['Deja de deletrear la contraseña del WiFi.', 'Deixa de lletrejar la contrasenya del WiFi.'],
  ['Reseñas Google', 'Ressenyes Google'], ['Más reseñas en Google, sin pedirlas a mano.', 'Més ressenyes a Google, sense demanar-les una a una.'],
  ['Reservas', 'Reserves'], ['Que reserven antes de salir del local.', 'Que reservin abans de sortir del local.'],
  ['Menú', 'Menú'], ['Tu carta, desde la mesa. Cambias un precio y está cambiado.', 'La teva carta, des de la taula. Canvies un preu i està canviat.'], ['¿Quieres que además recomiende y atienda en su idioma? Eso es el IPSO HUB →', 'Vols que a més recomani i atengui en el seu idioma? Això és l\u2019IPSO HUB →'],
  ['Stand blanco', 'Stand blanc'], ['Stand negro', 'Stand negre'], ['Plate', 'Plate'],
  ['Programamos tu red', 'Programem la teva xarxa'], ['Con tu nombre de red y tu clave.', 'Amb el nom de la teva xarxa i la clau.'],
  ['Lo pones en mesa o barra', 'El poses a taula o barra'], ['Donde la gente se sienta y saca el móvil.', 'On la gent s\u2019asseu i treu el mòbil.'],
  ['Tocan o escanean, copian y dentro', 'Toquen o escanegen, copien i dins'], ['La clave se copia sola. Funciona en todos los iPhone y Android.', 'La clau es copia sola. Funciona a tots els iPhone i Android.'],
  ['Punto NFC de WiFi programado', 'Punt NFC de WiFi programat'], ['Programación personalizada', 'Programació personalitzada'],
  ['Cambio de clave cuando quieras', 'Canvi de clau quan vulguis'], ['Código de respaldo para escanear', 'Codi de reserva per escanejar'], ['Garantía comercial 30 días', 'Garantia comercial 30 dies'],
  ['Lo conectamos a tu ficha', 'El connectem a la teva fitxa'], ['Llega programado con tu negocio. Tú no configuras nada.', 'Arriba programat amb el teu negoci. Tu no configures res.'],
  ['Lo pones donde se paga', 'El poses on es paga'], ['Mostrador, barra o recepción. Ocupa lo que un vaso.', 'Taulell, barra o recepció. Ocupa el que un got.'],
  ['Tocan y publican', 'Toquen i publiquen'], ['Se abre tu ficha oficial de Google con la reseña lista.', 'S\u2019obre la teva fitxa oficial de Google amb la ressenya a punt.'],
  ['Stand o plate programado', 'Stand o plate programat'], ['Ficha de Google conectada', 'Fitxa de Google connectada'], ['Cambios y ajustes el primer año', 'Canvis i ajustos el primer any'],
  ['Conectamos tu agenda', 'Connectem la teva agenda'], ['Con el calendario que ya usas, con tus horarios reales.', 'Amb el calendari que ja fas servir i els teus horaris reals.'],
  ['Pegamos el sticker en la puerta', 'Enganxem l\u2019adhesiu a la porta'], ['Por fuera, visible desde la calle y resistente al agua.', 'Per fora, visible des del carrer i resistent a l\u2019aigua.'],
  ['Tocan y reservan', 'Toquen i reserven'], ['Reciben confirmación de su reserva.', 'Reben confirmació de la seva reserva.'],
  ['Sticker de puerta programado', 'Adhesiu de porta programat'], ['Conexión con tu agenda', 'Connexió amb la teva agenda'], ['Recordatori automàtic al client'],
  ['Montamos tu carta', 'Muntem la teva carta'], ['Con tus platos, precios, alérgenos y fotos.', 'Amb els teus plats, preus, al·lèrgens i fotos.'],
  ['Colocamos las placas', 'Col·loquem les plaques'], ['Una por mesa, fijas y resistentes a la limpieza.', 'Una per taula, fixes i resistents a la neteja.'],
  ['Tocan y ven la carta', 'Toquen i veuen la carta'], ['Con fotos, alérgenos y precios siempre al día.', 'Amb fotos, al·lèrgens i preus sempre al dia.'],
  ['Carta digital montada por nosotros', 'Carta digital muntada per nosaltres'], ['Cuatro placas de mesa', 'Quatre plaques de taula'], ['Cambios de carta ilimitados el primer año', 'Canvis de carta il·limitats el primer any'],
  ['NFC (acercar el móvil) → funciona en Android.', 'NFC (acostar el mòbil) → funciona a Android.'],
  ['QR → funciona en iPhone y Android.', 'QR → funciona a iPhone i Android.'],
  ['Así lo usa cualquier cliente, tenga el móvil que tenga.', 'Així el pot fer servir qualsevol client, tingui el mòbil que tingui.'],
  ['Conexión con tu agenda: el calendario que ya usas.', 'Connexió amb la teva agenda: el calendari que ja fas servir.'],
  ['Recordatorio automático al cliente.', 'Recordatori automàtic al client.'],
  ['NFC (Android) y QR (iPhone y Android): funciona en cualquier móvil.', 'NFC (Android) i QR (iPhone i Android): funciona a qualsevol mòbil.'],
  ['Incluye 4 placas de mesa. Los packs añaden placas o locales.', 'Inclou 4 plaques de taula. Els packs afegeixen plaques o locals.'],
  ['¿Necesito una app?', 'Necessito una app?'], ['No. Ni tú ni tus clientes. Acercan el móvil y se abre lo que hayamos configurado.', 'No. Ni tu ni els teus clients. Acosten el mòbil i s\u2019obre el que hàgim configurat.'],
  ['No. Ni tú ni tus clientes. Acercan el móvil y se abre tu ficha.', 'No. Ni tu ni els teus clients. Acosten el mòbil i s\u2019obre la teva fitxa.'],
  ['No. El cliente acerca el móvil y se abre tu carta en el navegador.', 'No. El client acosta el mòbil i s\u2019obre la teva carta al navegador.'],
  ['¿Hay cuota mensual?', 'Hi ha quota mensual?'], ['No, pago único. IPSO+ es opcional, 1 €/mes, y se cancela cuando quieras.', 'No, pagament únic. IPSO+ és opcional, 1 €/mes, i es cancel·la quan vulguis.'],
  ['¿Puedo cambiar la clave del WiFi?', 'Puc canviar la clau del WiFi?'], ['Sí. Nos lo dices y lo reprogramamos sin cambiar el soporte.', 'Sí. Ens ho dius i el reprogramem sense canviar el suport.'],
  ['¿Esto está permitido por Google?', 'Això ho permet Google?'], ['Sí. Abre el mismo enlace oficial de reseñas de Google que podrías enviar por correo. Nunca filtramos ni bloqueamos reseñas.', 'Sí. Obre el mateix enllaç oficial de ressenyes de Google que podries enviar per correu. Mai filtrem ni bloquegem ressenyes.'],
  ['¿Funciona con el local cerrado?', 'Funciona amb el local tancat?'], ['Sí. Está por fuera, así que pueden reservar a cualquier hora.', 'Sí. És a fora, així que poden reservar a qualsevol hora.'],
  ['¿Con qué agenda funciona?', 'Amb quina agenda funciona?'], ['Lo conectamos con el calendario que ya usas y con tus horarios reales.', 'El connectem amb el calendari que ja fas servir i amb els teus horaris reals.'],
  ['¿Puedo cambiar la carta?', 'Puc canviar la carta?'], ['Sí. El primer año los cambios están incluidos; luego, con IPSO+ los haces tú.', 'Sí. El primer any els canvis estan inclosos; després, amb IPSO+ els fas tu.'],
  ['¿Cuántas placas incluye?', 'Quantes plaques inclou?'], ['Cuatro placas de mesa. Si tienes más mesas, añade un pack.', 'Quatre plaques de taula. Si tens més taules, afegeix un pack.']
];

export const DICTS = { es: null, en: {}, ca: {} };
export const REV = { es: null, en: {}, ca: {} };
EN_PAIRS.forEach(function (p) { DICTS.en[p[0]] = p[1]; REV.en[p[1]] = p[0]; });
CA_PAIRS.forEach(function (p) { DICTS.ca[p[0]] = p[1]; REV.ca[p[1]] = p[0]; });

function swap(map) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(function (n) {
    const raw = n.nodeValue, key = raw.trim();
    if (key && map[key]) n.nodeValue = raw.replace(key, map[key]);
  });
}

export function applyLang(from, lang) {
  if (REV[from]) swap(REV[from]);
  if (DICTS[lang]) swap(DICTS[lang]);
  document.documentElement.lang = lang;
}
