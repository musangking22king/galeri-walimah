// Token rawak yang disimpan pada peranti tetamu. Digunakan untuk tahu gambar mana milik peranti ini.
window.guestToken = (function () {
  const make = () => Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, '0')).join('');
  try {
    let t = localStorage.getItem('guestToken');
    if (!t) { t = make(); localStorage.setItem('guestToken', t); }
    return t;
  } catch { return make(); }
})();
