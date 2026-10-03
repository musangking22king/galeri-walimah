(function () {
  const NS = 'http://www.w3.org/2000/svg';

  // --- simbol bunga & daun ---
  let petals = '', inner = '';
  for (let i = 0; i < 8; i++) {
    petals += `<ellipse cx="50" cy="26" rx="12" ry="24" transform="rotate(${i * 45} 50 50)" opacity=".92"/>`;
    inner  += `<ellipse cx="50" cy="35" rx="8" ry="15" transform="rotate(${i * 45 + 22.5} 50 50)" fill="#fff" opacity=".38"/>`;
  }
  const defs = `
  <symbol id="flower" viewBox="0 0 100 100">
    <g fill="currentColor">${petals}</g>${inner}
    <circle cx="50" cy="50" r="9" fill="#c9a24b"/>
    <circle cx="50" cy="50" r="4.5" fill="#f1d489"/>
  </symbol>
  <symbol id="leaf" viewBox="0 0 30 52">
    <path d="M15 52 C2 38 2 16 15 1 C28 16 28 38 15 52Z" fill="currentColor"/>
    <path d="M15 50 L15 8" stroke="#fff" stroke-opacity=".35" stroke-width="1" fill="none"/>
  </symbol>`;

  const leaf = (x, y, a, s = 1, c = '#8fae8b') =>
    `<use href="#leaf" x="-15" y="-52" width="30" height="52" transform="translate(${x} ${y}) rotate(${a}) scale(${s})" style="color:${c}"/>`;
  const fl = (x, y, s, c) =>
    `<use href="#flower" x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}" style="color:${c}"/>`;

  const corner = `
  <symbol id="corner" viewBox="0 0 320 320">
    <path d="M-5 235 C 25 165 55 112 125 80 S 235 32 305 -5" stroke="#7a9d7e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M-5 150 C 20 110 45 80 85 60" stroke="#8fae8b" stroke-width="2" fill="none" stroke-linecap="round"/>
    ${leaf(18, 210, -20, 1.1)}  ${leaf(30, 200, 70, 1)}
    ${leaf(52, 150, -35, 1.1, '#7a9d7e')} ${leaf(60, 140, 60, 1)}
    ${leaf(98, 108, -40, 1.2)} ${leaf(108, 100, 55, 1.1, '#7a9d7e')}
    ${leaf(155, 74, -30, 1.1)} ${leaf(165, 68, 60, 1)}
    ${leaf(215, 42, -30, 1)}   ${leaf(225, 36, 65, .9, '#7a9d7e')}
    ${leaf(270, 14, -20, .9)}
    ${fl(72, 72, 128, '#e48fa6')}
    ${fl(190, 36, 84, '#f4c3cd')}
    ${fl(34, 192, 84, '#f4c3cd')}
    ${fl(128, 122, 56, '#f2b99a')}
    ${fl(262, 22, 42, '#fbe3e8')}
    ${fl(20, 262, 42, '#fbe3e8')}
    <circle cx="150" cy="30" r="5" fill="#c9a24b"/><circle cx="26" cy="146" r="5" fill="#c9a24b"/>
    <circle cx="112" cy="190" r="4" fill="#c9a24b" opacity=".8"/><circle cx="195" cy="108" r="4" fill="#c9a24b" opacity=".8"/>
  </symbol>`;

  const holder = document.createElementNS(NS, 'svg');
  holder.setAttribute('width', '0'); holder.setAttribute('height', '0');
  holder.style.position = 'absolute';
  holder.innerHTML = `<defs>${defs}${corner}</defs>`;
  document.body.prepend(holder);

  // --- penjuru ---
  ['tl', 'tr', 'bl', 'br'].forEach(pos => {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('class', 'corner ' + pos);
    s.setAttribute('viewBox', '0 0 320 320');
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = '<use href="#corner"/>';
    document.body.prepend(s);
  });

  // --- kelopak gugur ---
  if (document.body.dataset.petals) {
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('span');
      p.className = 'petal';
      const size = 10 + Math.random() * 10;
      p.style.cssText = `left:${Math.random() * 100}vw;width:${size}px;height:${size}px;` +
        `animation-duration:${14 + Math.random() * 12}s;animation-delay:-${Math.random() * 20}s;`;
      document.body.appendChild(p);
    }
  }

  // --- teks dari config.js ---
  const W = window.WEDDING || {};
  document.querySelectorAll('[data-w]').forEach(el => {
    const v = W[el.dataset.w];
    if (v) el.textContent = v; else el.style.display = 'none';
  });
  if (W.title) document.title = W.title;
})();
