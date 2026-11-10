'use strict';
/* Vales Rebeca · solicitud de vale nuevo por WhatsApp. Dinero en centavos enteros. */
const WA_NUMBER = '528441030708'; // México (+52)
const fmt = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

/** "$1,950.50" -> 195050 | null si no es un importe válido */
function toCents(s) {
  s = String(s).replace(/[$,\s]/g, '');
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return null;
  const [a, b = ''] = s.split('.');
  return parseInt(a, 10) * 100 + parseInt((b + '00').slice(0, 2), 10);
}

const $ = id => document.getElementById(id);
const setErr = (id, msg) => { $(id + '-err').textContent = msg; $(id).setAttribute('aria-invalid', msg ? 'true' : 'false'); };
const shop = $('shop'), other = $('shop-other'), want = $('want'), st = $('req-status');

want.addEventListener('blur', () => { const c = toCents(want.value); if (c) want.value = fmt.format(c / 100); });
shop.addEventListener('change', () => { other.hidden = shop.value !== 'otra'; if (!other.hidden) other.focus(); });

$('req-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = shop.value === 'otra' ? other.value.trim() : shop.value, amt = toCents(want.value);
  setErr('shop', name ? '' : 'Elige o escribe la tienda que te interesa.');
  setErr('want', amt && amt > 0 ? '' : 'Escribe una cantidad válida, por ejemplo $3,000.');
  if (!name || !amt) return;
  const text = `Hola, Vales Rebeca. Me interesa solicitar un vale nuevo.\n\nTienda deseada: ${name}\nCantidad aproximada: ${fmt.format(amt / 100)}\n\nMe gustaría recibir más información. ¡Gracias!`;
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener');
  // Solo se abrió WhatsApp: el cliente debe confirmar el envío desde su app.
  st.hidden = false;
  st.innerHTML = `Abrimos WhatsApp con tu mensaje listo. <strong>Tu solicitud aún no se ha enviado:</strong> toca “Enviar” en WhatsApp para completarla. ¿No se abrió? <a href="${url}" target="_blank" rel="noopener">Toca aquí</a>.`;
});
