'use strict';
/* QR Radionica — generator QR kodova. Sve se računa lokalno u pregledniku. */

// QR biblioteka po zadanom ne zna UTF-8 (č, ć, š, ž…) — dajemo joj prave bajtove
qrcode.stringToBytes = s => Array.from(new TextEncoder().encode(s));

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const r3 = n => Math.round(n * 1000) / 1000;
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const svgUrl = s => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);

// ============================================================
//  Ikone
// ============================================================
const IK = {
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  tekst: '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  tel: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>',
  sms: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/>',
  chat: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>',
  kartica: '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5 16c.5-1.4 1.7-2 3-2s2.5.6 3 2M14 10h5M14 14h4"/>',
  osoba: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>',
  pin: '<path d="M12 21s-7-6.3-7-12a7 7 0 0 1 14 0c0 5.7-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  wifi: '<path d="M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16.1a5 5 0 0 1 7 0"/><path d="M12 20h.01"/>',
  kal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  kripto: '<circle cx="12" cy="12" r="9.5"/><path d="M9.5 7.5h3.8a2.2 2.2 0 0 1 0 4.5H9.5zm0 4.5h4.3a2.2 2.2 0 0 1 0 4.5H9.5zM11 6v1.5M11 16.5V18M9.5 7.5v9"/>',
  fb: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  x: '<path d="M4 4l16 16M20 4 4 20"/>',
  play: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>',
  srce: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
  zvijezda: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  kosarica: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v.01M14 21h7v-4"/>',
  preuzmi: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  kopiraj: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  nema: '<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>',
  kvacica: '<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>',
  oprez: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/>',
  lokacija: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="7"/>',
};
const ikona = k => `<svg class="ik" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IK[k]}</svg>`;

// ============================================================
//  Vrste sadržaja i kako se pretvaraju u tekst QR koda
// ============================================================
const enc = encodeURIComponent;
const upit = o => {
  const q = Object.entries(o).filter(([, v]) => v).map(([k, v]) => `${k}=${enc(v)}`).join('&');
  return q ? '?' + q : '';
};
const normUrl = u => {
  u = String(u ?? '').trim();
  if (u && !/^[a-z][a-z0-9+.-]*:/i.test(u) && u.includes('.')) u = 'https://' + u;
  return u;
};
const broj = v => parseFloat(String(v ?? '').trim().replace(',', '.'));
const brojTel = s => String(s ?? '').replace(/[^\d+]/g, '');
const waBroj = s => {
  s = String(s ?? '').trim();
  const d = s.replace(/\D/g, '');
  if (!d) return '';
  if (s.startsWith('+')) return d;
  if (d.startsWith('00')) return d.slice(2);
  if (d.startsWith('0')) return '385' + d.slice(1);   // 091… → 38591…
  return d;
};
const escWifi = s => String(s ?? '').replace(/([\\;,:"])/g, '\\$1');
const escVc = s => String(s ?? '').replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/([,;])/g, '\\$1');
const escMe = s => String(s ?? '').replace(/\r?\n/g, ' ').replace(/([\\;,:])/g, '\\$1');
const icsDatum = v => v ? v.replace(/[-:]/g, '').slice(0, 13) + '00' : '';
const imaNesto = (d, kljucevi) => kljucevi.some(k => String(d[k] ?? '').trim());

const TIPOVI = {
  url: {
    naziv: 'URL', ik: 'link',
    polja: [{ k: 'url', l: 'Adresa web stranice', t: 'url', ph: 'https://www.primjer.hr' }],
    zadano: { url: 'https://app-bonic.github.io/qr-radionica/' },
    enc: d => normUrl(d.url),
  },
  tekst: {
    naziv: 'Tekst', ik: 'tekst',
    polja: [{ k: 't', l: 'Tekst', t: 'textarea', ph: 'Upiši bilo kakav tekst…' }],
    enc: d => d.t || '',
  },
  email: {
    naziv: 'E-mail', ik: 'mail',
    polja: [
      { k: 'to', l: 'E-mail adresa primatelja', t: 'email', ph: 'ime@primjer.hr' },
      { k: 'sub', l: 'Naslov poruke' },
      { k: 'body', l: 'Poruka', t: 'textarea' },
    ],
    enc: d => (d.to || '').trim() ? `mailto:${d.to.trim()}${upit({ subject: d.sub, body: d.body })}` : '',
  },
  tel: {
    naziv: 'Telefon', ik: 'tel',
    polja: [{ k: 'n', l: 'Broj telefona', t: 'tel', ph: '+385 91 234 5678' }],
    enc: d => brojTel(d.n) ? 'tel:' + brojTel(d.n) : '',
  },
  sms: {
    naziv: 'SMS', ik: 'sms',
    polja: [
      { k: 'n', l: 'Broj telefona', t: 'tel', ph: '+385 91 234 5678' },
      { k: 'm', l: 'Poruka', t: 'textarea' },
    ],
    enc: d => brojTel(d.n) ? `SMSTO:${brojTel(d.n)}:${d.m || ''}` : '',
  },
  whatsapp: {
    naziv: 'WhatsApp', ik: 'chat',
    polja: [
      { k: 'n', l: 'Broj mobitela', t: 'tel', ph: '091 234 5678 ili +385 91 234 5678' },
      { k: 'm', l: 'Početna poruka (neobavezno)', t: 'textarea' },
    ],
    napomena: 'Broj koji počinje s 0 smatra se hrvatskim (+385).',
    enc: d => waBroj(d.n) ? `https://wa.me/${waBroj(d.n)}${upit({ text: d.m })}` : '',
  },
  vcard: {
    naziv: 'vCard', ik: 'kartica',
    polja: [
      { k: 'ime', l: 'Ime', pola: 1 }, { k: 'prezime', l: 'Prezime', pola: 1 },
      { k: 'tvrtka', l: 'Tvrtka', pola: 1 }, { k: 'pozicija', l: 'Radno mjesto', pola: 1 },
      { k: 'mob', l: 'Mobitel', t: 'tel', pola: 1 }, { k: 'telPosao', l: 'Telefon (posao)', t: 'tel', pola: 1 },
      { k: 'email', l: 'E-mail', t: 'email', pola: 1 }, { k: 'web', l: 'Web stranica', t: 'url', pola: 1 },
      { k: 'ulica', l: 'Ulica i broj' },
      { k: 'pbr', l: 'Poštanski broj', pola: 1 }, { k: 'grad', l: 'Grad', pola: 1 },
      { k: 'drzava', l: 'Država', ph: 'Hrvatska' },
      { k: 'napomena', l: 'Napomena', t: 'textarea' },
    ],
    enc: d => {
      if (!imaNesto(d, ['ime', 'prezime', 'tvrtka', 'mob', 'telPosao', 'email'])) return '';
      const ime = [d.ime, d.prezime].map(s => (s || '').trim()).filter(Boolean).join(' ') || d.tvrtka || '';
      const L = ['BEGIN:VCARD', 'VERSION:3.0', `N:${escVc(d.prezime)};${escVc(d.ime)};;;`, 'FN:' + escVc(ime)];
      if (d.tvrtka) L.push('ORG:' + escVc(d.tvrtka));
      if (d.pozicija) L.push('TITLE:' + escVc(d.pozicija));
      if (brojTel(d.mob)) L.push('TEL;TYPE=CELL:' + brojTel(d.mob));
      if (brojTel(d.telPosao)) L.push('TEL;TYPE=WORK,VOICE:' + brojTel(d.telPosao));
      if ((d.email || '').trim()) L.push('EMAIL:' + d.email.trim());
      if ((d.web || '').trim()) L.push('URL:' + normUrl(d.web));
      if (imaNesto(d, ['ulica', 'grad', 'pbr', 'drzava']))
        L.push(`ADR;TYPE=WORK:;;${escVc(d.ulica)};${escVc(d.grad)};;${escVc(d.pbr)};${escVc(d.drzava)}`);
      if (d.napomena) L.push('NOTE:' + escVc(d.napomena));
      L.push('END:VCARD');
      return L.join('\n');
    },
  },
  mecard: {
    naziv: 'MeCard', ik: 'osoba',
    polja: [
      { k: 'ime', l: 'Ime', pola: 1 }, { k: 'prezime', l: 'Prezime', pola: 1 },
      { k: 'nadimak', l: 'Nadimak', pola: 1 }, { k: 'rodjendan', l: 'Rođendan', t: 'date', pola: 1 },
      { k: 'tel1', l: 'Telefon', t: 'tel', pola: 1 }, { k: 'tel2', l: 'Drugi telefon', t: 'tel', pola: 1 },
      { k: 'email', l: 'E-mail', t: 'email', pola: 1 }, { k: 'web', l: 'Web stranica', t: 'url', pola: 1 },
      { k: 'adresa', l: 'Adresa' },
      { k: 'biljeska', l: 'Bilješka', t: 'textarea' },
    ],
    napomena: 'MeCard je kraći od vCarda pa daje manji, lakše čitljiv kod.',
    enc: d => {
      if (!imaNesto(d, ['ime', 'prezime'])) return '';
      let s = `MECARD:N:${escMe(d.prezime)},${escMe(d.ime)};`;
      if (d.nadimak) s += `NICKNAME:${escMe(d.nadimak)};`;
      for (const t of [d.tel1, d.tel2]) if (brojTel(t)) s += `TEL:${brojTel(t)};`;
      if ((d.email || '').trim()) s += `EMAIL:${escMe(d.email.trim())};`;
      if ((d.web || '').trim()) s += `URL:${escMe(normUrl(d.web))};`;
      if (d.rodjendan) s += `BDAY:${d.rodjendan.replace(/-/g, '')};`;
      if (d.adresa) s += `ADR:${escMe(d.adresa)};`;
      if (d.biljeska) s += `NOTE:${escMe(d.biljeska)};`;
      return s + ';';
    },
  },
  lokacija: {
    naziv: 'Lokacija', ik: 'pin',
    polja: [
      { k: 'adr', l: 'Adresa ili naziv mjesta', ph: 'Trg bana Jelačića, Zagreb' },
      { k: 'lat', l: 'Geografska širina', ph: '45.8131', pola: 1 },
      { k: 'lng', l: 'Geografska dužina', ph: '15.9772', pola: 1 },
      { k: 'fmt', l: 'Kod otvara', t: 'select', op: [['google', 'Google Karte (radi na svim mobitelima)'], ['geo', 'Aplikaciju za karte (geo:, Android)']] },
    ],
    zadano: { fmt: 'google' },
    napomena: 'Koordinate imaju prednost pred adresom. Na Google Kartama desni klik na mjesto → klik na koordinate (kopiraju se) → zalijepi u polje „Geografska širina”.',
    gumb: { ik: 'lokacija', l: 'Uzmi moju trenutnu lokaciju', fn: mojaLokacija },
    naUnos: (d, k) => {
      const m = k === 'lat' && String(d.lat).match(/^\s*(-?\d+\.\d+)\s*[,;\s]\s*(-?\d+\.\d+)\s*$/);
      if (!m) return false;
      d.lat = m[1]; d.lng = m[2];
      return true;
    },
    enc: d => {
      const la = broj(d.lat), lo = broj(d.lng), adr = (d.adr || '').trim();
      if (!isNaN(la) && !isNaN(lo)) {
        if (d.fmt === 'geo') return `geo:${la},${lo}` + (adr ? `?q=${la},${lo}(${enc(adr)})` : '');
        return `https://www.google.com/maps?q=${la},${lo}`;
      }
      if (adr) return d.fmt === 'geo' ? `geo:0,0?q=${enc(adr)}` : `https://www.google.com/maps/search/?api=1&query=${enc(adr)}`;
      return '';
    },
  },
  wifi: {
    naziv: 'WiFi', ik: 'wifi',
    polja: [
      { k: 'ssid', l: 'Naziv mreže (SSID)', ph: 'MojaMreza' },
      { k: 'enk', l: 'Zaštita', t: 'select', op: [['WPA', 'WPA / WPA2 / WPA3'], ['WEP', 'WEP (stara)'], ['nopass', 'Bez lozinke']] },
      { k: 'lozinka', l: 'Lozinka', kad: d => d.enk !== 'nopass' },
      { k: 'skrivena', l: 'Skrivena mreža (ne prikazuje se na popisu mreža)', t: 'check' },
    ],
    zadano: { enk: 'WPA' },
    napomena: 'Skeniranjem se mobitel spaja na mrežu bez upisivanja lozinke.',
    enc: d => (d.ssid || '') ? `WIFI:T:${d.enk || 'WPA'};S:${escWifi(d.ssid)};${d.enk !== 'nopass' ? `P:${escWifi(d.lozinka)};` : ''}${d.skrivena ? 'H:true;' : ''};` : '',
  },
  dogadjaj: {
    naziv: 'Događaj', ik: 'kal',
    polja: [
      { k: 'naslov', l: 'Naziv događaja', ph: 'Godišnja skupština' },
      { k: 'mjesto', l: 'Mjesto' },
      { k: 'pocetak', l: 'Početak', t: 'datetime-local', pola: 1 },
      { k: 'kraj', l: 'Završetak', t: 'datetime-local', pola: 1 },
      { k: 'opis', l: 'Opis', t: 'textarea' },
    ],
    napomena: 'Naziv i početak su obavezni. Skeniranjem se događaj dodaje u kalendar.',
    enc: d => {
      if (!(d.naslov || '').trim() || !d.pocetak) return '';
      const L = ['BEGIN:VEVENT', 'SUMMARY:' + escVc(d.naslov.trim())];
      if (d.mjesto) L.push('LOCATION:' + escVc(d.mjesto));
      L.push('DTSTART:' + icsDatum(d.pocetak));
      if (d.kraj) L.push('DTEND:' + icsDatum(d.kraj));
      if (d.opis) L.push('DESCRIPTION:' + escVc(d.opis));
      L.push('END:VEVENT');
      return L.join('\n');
    },
  },
  kripto: {
    naziv: 'Kripto', ik: 'kripto',
    polja: [
      { k: 'valuta', l: 'Valuta', t: 'select', op: [['bitcoin', 'Bitcoin (BTC)'], ['bitcoincash', 'Bitcoin Cash (BCH)'], ['ethereum', 'Ethereum (ETH)'], ['litecoin', 'Litecoin (LTC)'], ['dash', 'Dash']] },
      { k: 'adresa', l: 'Adresa novčanika' },
      { k: 'iznos', l: 'Iznos (neobavezno)', ph: '0.001', pola: 1 },
      { k: 'poruka', l: 'Poruka (neobavezno)', pola: 1, kad: d => d.valuta !== 'ethereum' },
    ],
    zadano: { valuta: 'bitcoin' },
    enc: d => {
      const a = (d.adresa || '').trim();
      if (!a) return '';
      const v = d.valuta || 'bitcoin', iz = broj(d.iznos), adr = a.includes(':') ? a.split(':').pop() : a;
      if (v === 'ethereum') return `ethereum:${adr}${iz > 0 ? `?value=${iz}e18` : ''}`;
      return `${v}:${adr}${upit({ amount: iz > 0 ? String(iz) : '', message: d.poruka })}`;
    },
  },
  facebook: {
    naziv: 'Facebook', ik: 'fb',
    polja: [
      { k: 'url', l: 'Adresa Facebook stranice ili objave', t: 'url', ph: 'https://www.facebook.com/…' },
      { k: 'dijeli', l: 'Otvori prozor za dijeljenje (Share) umjesto same stranice', t: 'check' },
    ],
    enc: d => {
      const u = normUrl(d.url);
      if (!u) return '';
      return d.dijeli ? 'https://www.facebook.com/sharer/sharer.php?u=' + enc(u) : u;
    },
  },
  x: {
    naziv: 'X (Twitter)', ik: 'x',
    polja: [
      { k: 'nacin', l: 'Što kod radi', t: 'select', op: [['objava', 'Otvara novu objavu s mojim tekstom'], ['profil', 'Otvara profil']] },
      { k: 'tekst', l: 'Tekst objave', t: 'textarea', kad: d => d.nacin !== 'profil' },
      { k: 'link', l: 'Link u objavi (neobavezno)', t: 'url', kad: d => d.nacin !== 'profil' },
      { k: 'profil', l: 'Korisničko ime ili adresa profila', ph: '@korisnik', kad: d => d.nacin === 'profil' },
    ],
    zadano: { nacin: 'objava' },
    enc: d => {
      if (d.nacin === 'profil') {
        const p = (d.profil || '').trim();
        if (!p) return '';
        return /^@?[A-Za-z0-9_]{1,15}$/.test(p) ? 'https://x.com/' + p.replace('@', '') : normUrl(p);
      }
      return imaNesto(d, ['tekst', 'link']) ? 'https://twitter.com/intent/tweet' + upit({ text: d.tekst, url: normUrl(d.link) }) : '';
    },
  },
  youtube: {
    naziv: 'YouTube', ik: 'play',
    polja: [{ k: 'url', l: 'Adresa videa ili kanala', t: 'url', ph: 'https://www.youtube.com/watch?v=…' }],
    enc: d => {
      const u = (d.url || '').trim();
      return /^[\w-]{11}$/.test(u) ? 'https://youtu.be/' + u : normUrl(u);
    },
  },
};

// ============================================================
//  Oblici: tijelo koda, okvir oka, zjenica oka
// ============================================================
const rect = (x, y, w, h) => `M${r3(x)} ${r3(y)}h${r3(w)}v${r3(h)}h${r3(-w)}z`;
// zaobljeni pravokutnik; radijusi redom: gore-lijevo, gore-desno, dolje-desno, dolje-lijevo
function rr(x, y, w, h, [a, b, c, d]) {
  if (!a && !b && !c && !d) return rect(x, y, w, h);
  const n = r3;
  return `M${n(x + a)} ${n(y)}H${n(x + w - b)}` + (b ? `A${b} ${b} 0 0 1 ${n(x + w)} ${n(y + b)}` : '') +
    `V${n(y + h - c)}` + (c ? `A${c} ${c} 0 0 1 ${n(x + w - c)} ${n(y + h)}` : '') +
    `H${n(x + d)}` + (d ? `A${d} ${d} 0 0 1 ${n(x)} ${n(y + h - d)}` : '') +
    `V${n(y + a)}` + (a ? `A${a} ${a} 0 0 1 ${n(x + a)} ${n(y)}` : '') + 'Z';
}
const krug = (cx, cy, r) => `M${r3(cx - r)} ${r3(cy)}a${r} ${r} 0 1 1 ${r3(2 * r)} 0a${r} ${r} 0 1 1 ${r3(-2 * r)} 0z`;
const sve = r => [r, r, r, r];
// okretanje kutova za k × 90° u smjeru kazaljke (oči u gornjem desnom i donjem lijevom kutu su "zrcaljene")
const okreni = (a, k) => { a = [...a]; for (let i = 0; i < k; i++) a.unshift(a.pop()); return a; };

const TIJELA = {
  square: { naziv: 'Kvadrati', fn: (x, y) => rect(x, y, 1, 1) },
  small: { naziv: 'Mali kvadrati', fn: (x, y) => rect(x + .12, y + .12, .76, .76) },
  dots: { naziv: 'Točke', fn: (x, y) => krug(x + .5, y + .5, .46) },
  rounded: { naziv: 'Zaobljeno', fn: (x, y, s) => { const R = .36; return rr(x, y, 1, 1, [!s.u && !s.l ? R : 0, !s.u && !s.r ? R : 0, !s.dn && !s.r ? R : 0, !s.dn && !s.l ? R : 0]); } },
  extra: { naziv: 'Jako zaobljeno', fn: (x, y, s) => { const R = .5; return rr(x, y, 1, 1, [!s.u && !s.l ? R : 0, !s.u && !s.r ? R : 0, !s.dn && !s.r ? R : 0, !s.dn && !s.l ? R : 0]); } },
  classy: { naziv: 'Elegantno', fn: (x, y, s) => rr(x, y, 1, 1, [!s.u && !s.l ? .5 : 0, 0, !s.dn && !s.r ? .5 : 0, 0]) },
  diamond: { naziv: 'Rombovi', fn: (x, y) => `M${r3(x + .5)} ${y}L${x + 1} ${r3(y + .5)}L${r3(x + .5)} ${y + 1}L${x} ${r3(y + .5)}Z` },
  vertical: { naziv: 'Okomite linije', fn: (x, y, s) => { const R = .38; return rr(x + .12, y, .76, 1, [s.u ? 0 : R, s.u ? 0 : R, s.dn ? 0 : R, s.dn ? 0 : R]); } },
  horizontal: { naziv: 'Vodoravne linije', fn: (x, y, s) => { const R = .38; return rr(x, y + .12, 1, .76, [s.l ? 0 : R, s.r ? 0 : R, s.r ? 0 : R, s.l ? 0 : R]); } },
};

const OKVIRI = {
  square: { naziv: 'Kvadrat', fn: (x, y) => rect(x, y, 7, 7) + rect(x + 1, y + 1, 5, 5) },
  soft: { naziv: 'Blago zaobljen', fn: (x, y) => rr(x, y, 7, 7, sve(1.4)) + rr(x + 1, y + 1, 5, 5, sve(.5)) },
  rounded: { naziv: 'Zaobljen', fn: (x, y) => rr(x, y, 7, 7, sve(2.6)) + rr(x + 1, y + 1, 5, 5, sve(1.6)) },
  circle: { naziv: 'Krug', fn: (x, y) => krug(x + 3.5, y + 3.5, 3.5) + krug(x + 3.5, y + 3.5, 2.5) },
  leaf: { naziv: 'List', fn: (x, y, k) => rr(x, y, 7, 7, okreni([3.3, 0, 3.3, 0], k)) + rr(x + 1, y + 1, 5, 5, okreni([2.3, 0, 2.3, 0], k)) },
  corner: { naziv: 'Jedan obli kut', fn: (x, y, k) => rr(x, y, 7, 7, okreni([3.3, 0, 0, 0], k)) + rr(x + 1, y + 1, 5, 5, okreni([2.3, 0, 0, 0], k)) },
  dotted: {
    naziv: 'Točkasti', fn: (x, y) => {
      let p = '';
      for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) if (i === 0 || j === 0 || i === 6 || j === 6) p += krug(x + j + .5, y + i + .5, .45);
      return p;
    },
  },
};

const ZJENICE = {
  square: { naziv: 'Kvadrat', fn: (x, y) => rect(x + 2, y + 2, 3, 3) },
  rounded: { naziv: 'Zaobljena', fn: (x, y) => rr(x + 2, y + 2, 3, 3, sve(.9)) },
  circle: { naziv: 'Krug', fn: (x, y) => krug(x + 3.5, y + 3.5, 1.5) },
  diamond: { naziv: 'Romb', fn: (x, y) => { const c = x + 3.5, d = y + 3.5; return `M${c} ${r3(d - 1.8)}L${r3(c + 1.8)} ${d}L${c} ${r3(d + 1.8)}L${r3(c - 1.8)} ${d}Z`; } },
  leaf: { naziv: 'List', fn: (x, y, k) => rr(x + 2, y + 2, 3, 3, okreni([1.5, 0, 1.5, 0], k)) },
  corner: { naziv: 'Jedan obli kut', fn: (x, y, k) => rr(x + 2, y + 2, 3, 3, okreni([1.5, 0, 0, 0], k)) },
  dots: {
    naziv: 'Točkice', fn: (x, y) => {
      let p = '';
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) p += krug(x + 2.5 + j, y + 2.5 + i, .45);
      return p;
    },
  },
  star: {
    naziv: 'Zvijezda', fn: (x, y) => {
      const c = x + 3.5, d = y + 3.5, R = 2, q = .72, n = r3;
      return `M${c} ${n(d - R)}Q${n(c + q)} ${n(d - q)} ${n(c + R)} ${d}Q${n(c + q)} ${n(d + q)} ${c} ${n(d + R)}Q${n(c - q)} ${n(d + q)} ${n(c - R)} ${d}Q${n(c - q)} ${n(d - q)} ${c} ${n(d - R)}Z`;
    },
  },
};

// ============================================================
//  Izrada SVG-a
// ============================================================
function izgradiSvg(tekst, st, px) {
  const qr = qrcode(0, st.ecc);
  qr.addData(tekst);
  qr.make();
  const n = qr.getModuleCount(), m = st.rub, U = n + 2 * m;
  const oko = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);

  // logo: kvadrat u sredini, L modula širok, počinje na a
  const L = st.logo ? n * st.logoVel / 100 : 0, a = (n - L) / 2;
  const ispodLoga = (r, c) => L && st.logoOcisti && c + 1 > a && c < a + L && r + 1 > a && r < a + L;
  const dio = (r, c) => r >= 0 && c >= 0 && r < n && c < n && qr.isDark(r, c) && !oko(r, c) && !ispodLoga(r, c);

  const T = (TIJELA[st.tijelo] || TIJELA.square).fn;
  let tijelo = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (dio(r, c)) tijelo += T(c + m, r + m, { u: dio(r - 1, c), dn: dio(r + 1, c), l: dio(r, c - 1), r: dio(r, c + 1) });
  }

  let defs = '', boja = st.boja1;
  if (st.bojaNacin === 'grad') {
    const c = U / 2, stops = `<stop offset="0" stop-color="${st.boja1}"/><stop offset="1" stop-color="${st.boja2}"/>`;
    if (st.gradTip === 'radial') {
      defs = `<radialGradient id="g" gradientUnits="userSpaceOnUse" cx="${c}" cy="${c}" r="${r3(n * .72)}">${stops}</radialGradient>`;
    } else {
      const k = st.gradKut * Math.PI / 180, cos = Math.cos(k), sin = Math.sin(k);
      const h = n / 2 * (Math.abs(cos) + Math.abs(sin));
      defs = `<linearGradient id="g" gradientUnits="userSpaceOnUse" x1="${r3(c - cos * h)}" y1="${r3(c - sin * h)}" x2="${r3(c + cos * h)}" y2="${r3(c + sin * h)}">${stops}</linearGradient>`;
    }
    boja = 'url(#g)';
  }
  const bojaOkvira = st.okoPosebno ? st.bojaOkvira : boja, bojaZjenice = st.okoPosebno ? st.bojaZjenice : boja;

  const O = (OKVIRI[st.okvir] || OKVIRI.square).fn, Z = (ZJENICE[st.zjenica] || ZJENICE.square).fn;
  let okviri = '', zjenice = '';
  for (const [r, c, k] of [[0, 0, 0], [0, n - 7, 1], [n - 7, 0, 3]]) {
    okviri += O(c + m, r + m, k);
    zjenice += Z(c + m, r + m, k);
  }

  let logo = '';
  if (L) {
    const u = st.logoOcisti ? .35 : 0, x = r3(m + a + u), w = r3(L - 2 * u);
    logo = `<image x="${x}" y="${x}" width="${w}" height="${w}" preserveAspectRatio="xMidYMid meet" xlink:href="${st.logo}"/>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${px}" height="${px}" viewBox="0 0 ${U} ${U}">` +
    (defs ? `<defs>${defs}</defs>` : '') +
    (st.prozirno ? '' : `<rect width="${U}" height="${U}" fill="${st.pozadina}"/>`) +
    `<path d="${tijelo}" fill="${boja}"/>` +
    `<path d="${okviri}" fill="${bojaOkvira}" fill-rule="evenodd"/>` +
    `<path d="${zjenice}" fill="${bojaZjenice}"/>` +
    logo + '</svg>';
  return { svg, n, verzija: (n - 17) / 4, bajtova: new TextEncoder().encode(tekst).length };
}

function rasteriziraj(svg, vel, bijelaPozadina, rubPx = 0) {
  return new Promise((ok, ne) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = c.height = vel + 2 * rubPx;
      const x = c.getContext('2d', { willReadFrequently: true });
      if (bijelaPozadina || rubPx) { x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); }
      x.drawImage(img, rubPx, rubPx, vel, vel);
      ok(c);
    };
    img.onerror = () => ne(new Error('Slika se nije mogla iscrtati.'));
    img.src = svgUrl(svg);
  });
}

// PDF s jednom stranicom (veličina koda pri 300 dpi) i JPEG slikom unutra
function pdfIzPlatna(c) {
  const bin = atob(c.toDataURL('image/jpeg', .95).split(',')[1]);
  const jpg = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) jpg[i] = bin.charCodeAt(i);
  const w = c.width, h = c.height, pw = r3(w * 72 / 300), ph = r3(h * 72 / 300);
  const te = new TextEncoder(), dijelovi = [], pomak = [];
  let duz = 0;
  const dodaj = x => { const u = typeof x === 'string' ? te.encode(x) : x; dijelovi.push(u); duz += u.length; };
  const obj = (i, s) => { pomak[i] = duz; dodaj(`${i} 0 obj\n${s}\nendobj\n`); };
  dodaj('%PDF-1.4\n');
  obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
  obj(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  obj(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pw} ${ph}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
  pomak[4] = duz;
  dodaj(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`);
  dodaj(jpg);
  dodaj('\nendstream\nendobj\n');
  const sadrzaj = `q ${pw} 0 0 ${ph} 0 0 cm /Im0 Do Q`;
  obj(5, `<< /Length ${sadrzaj.length} >>\nstream\n${sadrzaj}\nendstream`);
  const xref = duz;
  let x = 'xref\n0 6\n0000000000 65535 f \n';
  for (let i = 1; i <= 5; i++) x += String(pomak[i]).padStart(10, '0') + ' 00000 n \n';
  dodaj(x + `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(dijelovi, { type: 'application/pdf' });
}

// ============================================================
//  Stanje
// ============================================================
const ZADANO = {
  tip: 'url', sadrzaj: {},
  ecc: 'M', rub: 3, velicina: 1000,
  tijelo: 'square', okvir: 'square', zjenica: 'square',
  bojaNacin: 'jedna', boja1: '#111111', boja2: '#0f766e', gradTip: 'linear', gradKut: 45,
  pozadina: '#ffffff', prozirno: false,
  okoPosebno: false, bojaOkvira: '#111111', bojaZjenice: '#0f766e',
  logo: null, logoId: null, logoVel: 22, logoOcisti: true,
};
const DIZAJN = Object.keys(ZADANO).filter(k => k !== 'tip' && k !== 'sadrzaj');
const KLJUC = 'qr-radionica-v1';

function ocisti(o) {
  const s = structuredClone(ZADANO);
  if (!o || typeof o !== 'object') return s;
  const boja = v => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v);
  for (const k of Object.keys(ZADANO)) {
    const v = o[k], z = ZADANO[k];
    if (v === undefined) continue;
    if (k === 'logo') { if (v === null || (typeof v === 'string' && v.startsWith('data:image/'))) s.logo = v; continue; }
    if (k === 'logoId') { if (v === null || typeof v === 'string') s.logoId = v; continue; }
    if (k === 'sadrzaj') { if (v && typeof v === 'object') s.sadrzaj = v; continue; }
    if (typeof z === 'number') { if (Number.isFinite(+v)) s[k] = +v; continue; }
    if (typeof z === 'boolean') { s[k] = !!v; continue; }
    if (z && z.startsWith?.('#')) { if (boja(v)) s[k] = v.toLowerCase(); continue; }
    if (typeof v === 'string') s[k] = v;
  }
  if (!TIPOVI[s.tip]) s.tip = 'url';
  if (!TIJELA[s.tijelo]) s.tijelo = 'square';
  if (!OKVIRI[s.okvir]) s.okvir = 'square';
  if (!ZJENICE[s.zjenica]) s.zjenica = 'square';
  if (!'LMQH'.includes(s.ecc) || s.ecc.length !== 1) s.ecc = 'M';
  s.rub = Math.min(8, Math.max(0, Math.round(s.rub)));
  s.velicina = Math.min(2000, Math.max(200, s.velicina));
  s.logoVel = Math.min(32, Math.max(10, s.logoVel));
  return s;
}
function ucitajLokalno() {
  try { const t = localStorage.getItem(KLJUC); return t ? ocisti(JSON.parse(t)) : null; } catch { return null; }
}
let tajmerSpremanja;
function spremiLokalno() {
  clearTimeout(tajmerSpremanja);
  tajmerSpremanja = setTimeout(() => { try { localStorage.setItem(KLJUC, JSON.stringify(S)); } catch { /* pun ili blokiran */ } }, 300);
}

let S = ucitajLokalno() || structuredClone(ZADANO);
let zadnji = null;

const podaci = () => {
  const t = TIPOVI[S.tip];
  return S.sadrzaj[S.tip] ||= { ...(t.zadano || {}) };
};
const trenutniTekst = () => TIPOVI[S.tip].enc(podaci());

// ============================================================
//  Sučelje: vrste i obrazac
// ============================================================
function izgradiTipove() {
  $('#tipovi').innerHTML = Object.entries(TIPOVI).map(([k, t]) =>
    `<button type="button" role="tab" data-tip="${k}" aria-selected="${k === S.tip}">${ikona(t.ik)}<span>${t.naziv}</span></button>`).join('');
}

function izgradiFormu(fokus) {
  const t = TIPOVI[S.tip], d = podaci();
  const html = t.polja.filter(p => !p.kad || p.kad(d)).map(p => {
    const id = 'f-' + p.k, v = d[p.k] ?? '';
    if (p.t === 'check') return `<label class="kvacica puno"><input type="checkbox" data-f="${p.k}"${v ? ' checked' : ''}><span>${p.l}</span></label>`;
    let inp;
    if (p.t === 'textarea') inp = `<textarea id="${id}" data-f="${p.k}" rows="4" placeholder="${esc(p.ph)}">${esc(v)}</textarea>`;
    else if (p.t === 'select') inp = `<select id="${id}" data-f="${p.k}">${p.op.map(([a, b]) => `<option value="${a}"${a === v ? ' selected' : ''}>${b}</option>`).join('')}</select>`;
    else inp = `<input id="${id}" data-f="${p.k}" type="${p.t || 'text'}" value="${esc(v)}" placeholder="${esc(p.ph)}" autocomplete="off"${['url', 'email'].includes(p.t) ? ' spellcheck="false" autocapitalize="off"' : ''}>`;
    return `<div class="polje ${p.pola ? 'pola' : 'puno'}"><label for="${id}">${p.l}</label>${inp}</div>`;
  }).join('');
  $('#forma').innerHTML = html +
    (t.gumb ? `<div class="puno"><button type="button" class="gumb sporedni" id="f-gumb">${ikona(t.gumb.ik)} ${t.gumb.l}</button></div>` : '') +
    (t.napomena ? `<p class="napomena puno">${t.napomena}</p>` : '');
  if (t.gumb) $('#f-gumb').onclick = () => t.gumb.fn(d);
  if (fokus) $(`#forma [data-f="${fokus}"]`)?.focus();
}

function mojaLokacija(d) {
  if (!navigator.geolocation) return obavijest('Preglednik ne podržava lokaciju.');
  obavijest('Tražim lokaciju…');
  navigator.geolocation.getCurrentPosition(p => {
    d.lat = p.coords.latitude.toFixed(6);
    d.lng = p.coords.longitude.toFixed(6);
    izgradiFormu();
    osvjezi();
    obavijest('Lokacija upisana.');
  }, e => obavijest('Lokacija nije dostupna: ' + (e.code === 1 ? 'pristup nije dopušten.' : e.message)), { enableHighAccuracy: true, timeout: 15000 });
}

// ============================================================
//  Sučelje: dizajn
// ============================================================
const UZORAK = ['110110', '101011', '111001', '001101', '110111', '011010'];
function slicicaTijela(k) {
  const fn = TIJELA[k].fn, d = (r, c) => UZORAK[r]?.[c] === '1';
  let p = '';
  for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) if (d(r, c)) p += fn(c, r, { u: d(r - 1, c), dn: d(r + 1, c), l: d(r, c - 1), r: d(r, c + 1) });
  return `<svg viewBox="-.3 -.3 6.6 6.6"><path d="${p}" fill="currentColor"/></svg>`;
}
const slicicaOkvira = k => `<svg viewBox="-.4 -.4 7.8 7.8"><path d="${OKVIRI[k].fn(0, 0, 0)}" fill="currentColor" fill-rule="evenodd"/><path d="${ZJENICE.square.fn(0, 0)}" fill="currentColor" opacity=".3"/></svg>`;
const slicicaZjenice = k => `<svg viewBox="-.4 -.4 7.8 7.8"><path d="${OKVIRI.square.fn(0, 0)}" fill="currentColor" fill-rule="evenodd" opacity=".25"/><path d="${ZJENICE[k].fn(0, 0, 0)}" fill="currentColor"/></svg>`;

function izgradiBirace() {
  const izvori = { tijelo: [TIJELA, slicicaTijela], okvir: [OKVIRI, slicicaOkvira], zjenica: [ZJENICE, slicicaZjenice] };
  for (const el of $$('.biraci')) {
    const g = el.dataset.grupa, [def, sl] = izvori[g];
    el.innerHTML = Object.entries(def).map(([k, o]) =>
      `<button type="button" class="oblik" data-g="${g}" data-v="${k}" title="${o.naziv}" aria-label="${o.naziv}" aria-pressed="false">${sl(k)}</button>`).join('');
  }
}

const LOGO_IKONE = [
  ['link', '#2563eb'], ['wifi', '#0f766e'], ['mail', '#ea580c'], ['tel', '#16a34a'], ['pin', '#dc2626'], ['kal', '#7c3aed'],
  ['chat', '#22a352'], ['play', '#e11d2a'], ['srce', '#e11d48'], ['zvijezda', '#f59e0b'], ['kosarica', '#0891b2'], ['info', '#475569'],
];
const logoIkona = (k, b) => 'data:image/svg+xml;base64,' + btoa(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="13" fill="${b}"/>` +
  `<g transform="translate(11 11) scale(1.08)" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${IK[k]}</g></svg>`);

function izgradiLogoGaleriju() {
  $('#logoGalerija').innerHTML =
    `<button type="button" data-logo="" title="Bez loga" aria-label="Bez loga">${ikona('nema')}</button>` +
    LOGO_IKONE.map(([k, b]) => `<button type="button" data-logo="${k}" title="Ikona" aria-label="Ikona ${k}"><img src="${logoIkona(k, b)}" alt=""></button>`).join('') +
    (S.logoId === 'vlastiti' && S.logo ? `<button type="button" data-logo="vlastiti" title="Tvoj logo" aria-label="Tvoj logo"><img src="${S.logo}" alt=""></button>` : '');
  oznaciLogo();
}
const oznaciLogo = () => $$('#logoGalerija [data-logo]').forEach(b => b.setAttribute('aria-pressed', (b.dataset.logo || null) === (S.logo ? S.logoId : null)));

function postaviLogo(url, id) {
  S.logo = url; S.logoId = id;
  if (url && S.ecc !== 'H') { S.ecc = 'H'; }
  postaviKontrole();
  osvjezi();
}

const PREDLOSCI = [
  { naziv: 'Klasični', s: { tijelo: 'square', okvir: 'square', zjenica: 'square', boja1: '#111111' } },
  { naziv: 'Meki', s: { tijelo: 'rounded', okvir: 'rounded', zjenica: 'rounded', boja1: '#1e3a8a' } },
  { naziv: 'Točkice', s: { tijelo: 'dots', okvir: 'circle', zjenica: 'circle', bojaNacin: 'grad', gradTip: 'radial', boja1: '#6d28d9', boja2: '#db2777' } },
  { naziv: 'Elegantni', s: { tijelo: 'classy', okvir: 'leaf', zjenica: 'leaf', boja1: '#115e59', okoPosebno: true, bojaOkvira: '#134e4a', bojaZjenice: '#d97706' } },
  { naziv: 'Rombovi', s: { tijelo: 'diamond', okvir: 'soft', zjenica: 'diamond', bojaNacin: 'grad', gradTip: 'linear', gradKut: 135, boja1: '#0369a1', boja2: '#0f766e' } },
  { naziv: 'Linije', s: { tijelo: 'vertical', okvir: 'rounded', zjenica: 'circle', boja1: '#18181b', okoPosebno: true, bojaOkvira: '#dc2626', bojaZjenice: '#18181b' } },
  { naziv: 'Mjehurići', s: { tijelo: 'extra', okvir: 'circle', zjenica: 'dots', bojaNacin: 'grad', gradTip: 'linear', gradKut: 90, boja1: '#c2410c', boja2: '#be123c' } },
  { naziv: 'Pikseli', s: { tijelo: 'small', okvir: 'dotted', zjenica: 'square', boja1: '#1f2937' } },
  { naziv: 'Zvjezdani', s: { tijelo: 'horizontal', okvir: 'corner', zjenica: 'star', boja1: '#1e293b', okoPosebno: true, bojaOkvira: '#1e293b', bojaZjenice: '#ca8a04' } },
];
const PREDLOZAK_BAZA = { bojaNacin: 'jedna', okoPosebno: false, pozadina: '#ffffff', prozirno: false };

let kljucPredlozaka = '';
function osvjeziPredloske(tekst) {
  const t = tekst || 'QR Radionica';
  const kljuc = [t, S.logo, S.logoVel, S.logoOcisti, S.ecc].join('|');
  if (kljuc === kljucPredlozaka) return;
  kljucPredlozaka = kljuc;
  $('#predlosci').innerHTML = PREDLOSCI.map((p, i) => {
    let src = '';
    try { src = svgUrl(izgradiSvg(t, { ...S, ...PREDLOZAK_BAZA, ...p.s, rub: 2 }, 200).svg); } catch { /* predugo */ }
    return `<button type="button" data-predlozak="${i}">${src ? `<img src="${src}" alt="">` : ''}<span>${p.naziv}</span></button>`;
  }).join('');
}

// ============================================================
//  Povezivanje kontrola sa stanjem
// ============================================================
function postaviKontrole() {
  for (const el of $$('[data-k]')) {
    const v = S[el.dataset.k];
    if (el.type === 'radio') el.checked = el.value === v;
    else if (el.type === 'checkbox') el.checked = !!v;
    else el.value = v;
  }
  $$('.oblik').forEach(b => b.setAttribute('aria-pressed', S[b.dataset.g] === b.dataset.v));
  $$('#tipovi [data-tip]').forEach(b => b.setAttribute('aria-selected', b.dataset.tip === S.tip));
  oznaciLogo();
  prikaziVrijednosti();
}
function prikaziVrijednosti() {
  $$('output[data-o]').forEach(o => { o.textContent = S[o.dataset.o] + (o.dataset.j || ''); });
  $$('[data-hex]').forEach(s => { s.textContent = S[s.dataset.hex].toUpperCase(); });
  const b = document.body.classList;
  b.toggle('s-grad', S.bojaNacin === 'grad');
  b.toggle('s-lin', S.gradTip === 'linear');
  b.toggle('s-oko', S.okoPosebno);
  b.toggle('s-logo', !!S.logo);
}

// ============================================================
//  Crtanje, provjera čitljivosti, kontrast
// ============================================================
let tajmerCrtanja, tajmerProvjere;
const osvjezi = () => { clearTimeout(tajmerCrtanja); tajmerCrtanja = setTimeout(nacrtaj, 50); };

function nacrtaj() {
  prikaziVrijednosti();
  spremiLokalno();
  const tekst = trenutniTekst(), box = $('#pregled');
  osvjeziPredloske(tekst);
  zadnji = null;
  box.classList.remove('sah');
  if (!tekst) {
    box.innerHTML = `<div class="prazno">${ikona('qr')}<p>Upiši sadržaj i ovdje će se pojaviti QR kod.</p></div>`;
    return zavrsi('');
  }
  try {
    zadnji = izgradiSvg(tekst, S, S.velicina);
  } catch {
    box.innerHTML = `<div class="prazno greska">${ikona('oprez')}<p>Previše sadržaja za jedan QR kod. Skrati tekst ili smanji korekciju pogreške.</p></div>`;
    return zavrsi('');
  }
  const url = svgUrl(zadnji.svg);
  box.innerHTML = `<img src="${url}" alt="QR kod">`;
  box.classList.toggle('sah', S.prozirno);
  $('#mini img').src = url;
  zavrsi(`Verzija ${zadnji.verzija} · ${zadnji.n}×${zadnji.n} modula · ${zadnji.bajtova} B podataka`);
  provjeriKontrast();
  postaviStatus('provjera', 'Provjeravam čitljivost…');
  clearTimeout(tajmerProvjere);
  const r = zadnji;
  tajmerProvjere = setTimeout(() => provjeriCitljivost(r), 250);
}
function zavrsi(info) {
  $('#info').textContent = info;
  $$('[data-fmt]').forEach(b => { b.disabled = !zadnji; });
  if (!zadnji) { postaviStatus('', ''); $('#kontrast').hidden = true; $('#mini').classList.remove('vidljiv'); }
  else azurirajMini();
}

function postaviStatus(vrsta, tekst) {
  const el = $('#status');
  el.className = 'status ' + vrsta;
  el.innerHTML = tekst ? (vrsta === 'ok' ? ikona('kvacica') : vrsta === 'upoz' ? ikona('oprez') : '') + `<span>${tekst}</span>` : '';
}

// Skener se pokušava na nekoliko rezolucija i uz blago zamućenje (kao kamera mobitela),
// jer točkasti oblici bez toga zbune jsQR iako ih mobiteli čitaju.
const PROLAZI = [[5, 0], [4, .3], [6, .15], [3, .3], [8, .3]];
async function skeniraj(svg, U) {
  for (const [ppm, blur] of PROLAZI) {
    const vel = Math.round(U * ppm), rub = Math.round(vel * .06);
    const c0 = await rasteriziraj(svg, vel, true, rub);
    const c = document.createElement('canvas');
    c.width = c.height = c0.width;
    const x = c.getContext('2d', { willReadFrequently: true });
    if (blur) x.filter = `blur(${blur * ppm}px)`;
    x.drawImage(c0, 0, 0);
    const im = x.getImageData(0, 0, c.width, c.height);
    if (jsQR(im.data, c.width, c.height, { inversionAttempts: 'attemptBoth' })) return true;
  }
  return false;
}

async function provjeriCitljivost(r) {
  if (typeof jsQR !== 'function') return postaviStatus('', '');
  try {
    const rez = await skeniraj(r.svg, r.n + 2 * S.rub);
    if (r !== zadnji) return;
    if (rez) postaviStatus('ok', 'Kod je čitljiv — provjereno skenerom.');
    else postaviStatus('upoz', 'Skener ga ne uspijeva pročitati. Pojačaj kontrast, smanji logo, odaberi jednostavniji oblik ili povećaj korekciju pogreške.');
  } catch {
    postaviStatus('', '');
  }
}

function svjetlina(hex) {
  const v = parseInt(hex.slice(1), 16);
  const k = [v >> 16 & 255, v >> 8 & 255, v & 255].map(c => { c /= 255; return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; });
  return .2126 * k[0] + .7152 * k[1] + .0722 * k[2];
}
function provjeriKontrast() {
  const Lp = svjetlina(S.prozirno ? '#ffffff' : S.pozadina);
  const boje = [S.boja1];
  if (S.bojaNacin === 'grad') boje.push(S.boja2);
  if (S.okoPosebno) boje.push(S.bojaOkvira, S.bojaZjenice);
  let poruka = '';
  for (const b of boje) {
    const Lk = svjetlina(b);
    if (Lk > Lp) { poruka = 'Kod je svjetliji od pozadine — mnogi mobiteli takav (inverzni) kod ne čitaju. Za tisak koristi taman kod na svijetloj pozadini.'; break; }
    if ((Lp + .05) / (Lk + .05) < 3) poruka = 'Premali kontrast između koda i pozadine — kod bi mogao biti teško čitljiv.';
  }
  if (S.prozirno && !poruka && svjetlina(S.boja1) > .5) poruka = 'Svijetli kod na prozirnoj pozadini vidi se samo na tamnoj podlozi.';
  const el = $('#kontrast');
  el.textContent = poruka;
  el.hidden = !poruka;
}

// mali pregled u kutu na mobitelu dok se uređuju boje i oblici
let pregledVidljiv = true;
const azurirajMini = () => $('#mini').classList.toggle('vidljiv', !pregledVidljiv && !!zadnji && matchMedia('(max-width: 899px)').matches);

// ============================================================
//  Preuzimanje
// ============================================================
function spremiBlob(blob, ime) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = ime;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
const uBlob = (c, tip, kv) => new Promise(ok => c.toBlob(ok, tip, kv));

async function preuzmi(fmt) {
  const tekst = trenutniTekst();
  if (!tekst) return obavijest('Najprije upiši sadržaj.');
  let r;
  try { r = izgradiSvg(tekst, S, S.velicina); } catch { return obavijest('Previše sadržaja za QR kod.'); }
  const ime = 'qr-' + S.tip;
  try {
    if (fmt === 'svg') return spremiBlob(new Blob([r.svg], { type: 'image/svg+xml' }), ime + '.svg');
    if (fmt === 'kopiraj') {
      if (!navigator.clipboard || typeof ClipboardItem === 'undefined') return obavijest('Preglednik ne dopušta kopiranje slike — preuzmi PNG.');
      const c = await rasteriziraj(r.svg, S.velicina, false);
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': uBlob(c, 'image/png') })]);
      return obavijest('Slika je kopirana — zalijepi je s Ctrl+V.');
    }
    const c = await rasteriziraj(r.svg, S.velicina, fmt !== 'png');
    if (fmt === 'png') spremiBlob(await uBlob(c, 'image/png'), ime + '.png');
    if (fmt === 'jpg') spremiBlob(await uBlob(c, 'image/jpeg', .95), ime + '.jpg');
    if (fmt === 'pdf') spremiBlob(pdfIzPlatna(c), ime + '.pdf');
  } catch (e) {
    obavijest('Nije uspjelo: ' + e.message);
  }
}

let tajmerObavijesti;
function obavijest(t) {
  const el = $('#obavijest');
  el.textContent = t;
  el.classList.add('vidljiv');
  clearTimeout(tajmerObavijesti);
  tajmerObavijesti = setTimeout(() => el.classList.remove('vidljiv'), 2600);
}

// ============================================================
//  Logo iz datoteke, spremanje/učitavanje dizajna
// ============================================================
function ucitajLogo(dat) {
  if (!dat) return;
  if (dat.size > 2 * 1024 * 1024) return obavijest('Logo je veći od 2 MB.');
  if (!/^image\/(png|jpeg|gif|webp|svg\+xml)$/.test(dat.type)) return obavijest('Podržani su PNG, JPG, GIF, WEBP i SVG.');
  const fr = new FileReader();
  fr.onload = () => {
    if (dat.type === 'image/svg+xml') return gotovLogo(fr.result);
    // rastersku sliku smanji na najviše 600 px da SVG ne bude golem
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, 600 / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(img.width * k));
      c.height = Math.max(1, Math.round(img.height * k));
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      gotovLogo(c.toDataURL('image/png'));
    };
    img.onerror = () => obavijest('Slika se ne može otvoriti.');
    img.src = fr.result;
  };
  fr.readAsDataURL(dat);
}
function gotovLogo(url) {
  S.logoId = 'vlastiti';
  S.logo = url;
  izgradiLogoGaleriju();
  postaviLogo(url, 'vlastiti');
  obavijest('Logo je dodan.');
}

function spremiDizajn() {
  const o = { program: 'QR Radionica', verzija: 1 };
  for (const k of DIZAJN) o[k] = S[k];
  spremiBlob(new Blob([JSON.stringify(o, null, 2)], { type: 'application/json' }), 'qr-dizajn.json');
}
function ucitajDizajn(dat) {
  if (!dat) return;
  const fr = new FileReader();
  fr.onload = () => {
    try {
      const o = ocisti(JSON.parse(fr.result));
      for (const k of DIZAJN) S[k] = o[k];
      izgradiLogoGaleriju();
      postaviKontrole();
      osvjezi();
      obavijest('Dizajn je učitan.');
    } catch {
      obavijest('Datoteka nije ispravan dizajn.');
    }
  };
  fr.readAsText(dat);
}

// ============================================================
//  Pokretanje
// ============================================================
function pokreni() {
  $$('.ik-mjesto').forEach(s => { s.outerHTML = ikona(s.dataset.ik); });
  izgradiTipove();
  izgradiBirace();
  izgradiLogoGaleriju();
  izgradiFormu();
  postaviKontrole();

  $('#tipovi').addEventListener('click', e => {
    const b = e.target.closest('[data-tip]');
    if (!b) return;
    S.tip = b.dataset.tip;
    $$('#tipovi [data-tip]').forEach(x => x.setAttribute('aria-selected', x === b));
    izgradiFormu();
    osvjezi();
  });

  $('#forma').addEventListener('input', e => {
    const el = e.target.closest('[data-f]');
    if (!el) return;
    const d = podaci(), k = el.dataset.f, t = TIPOVI[S.tip];
    d[k] = el.type === 'checkbox' ? el.checked : el.value;
    if (t.naUnos?.(d, k)) izgradiFormu(k);
    else if (el.tagName === 'SELECT' || el.type === 'checkbox') izgradiFormu();
    osvjezi();
  });

  for (const el of $$('[data-k]')) {
    el.addEventListener('input', () => {
      const k = el.dataset.k;
      if (el.type === 'radio') { if (!el.checked) return; S[k] = el.value; }
      else if (el.type === 'checkbox') S[k] = el.checked;
      else if (el.type === 'range') S[k] = +el.value;
      else S[k] = el.value;
      osvjezi();
    });
  }

  document.addEventListener('click', e => {
    const o = e.target.closest('.oblik');
    if (o) {
      S[o.dataset.g] = o.dataset.v;
      $$(`.oblik[data-g="${o.dataset.g}"]`).forEach(b => b.setAttribute('aria-pressed', b === o));
      return osvjezi();
    }
    const l = e.target.closest('[data-logo]');
    if (l) {
      const id = l.dataset.logo;
      if (!id) return postaviLogo(null, null);
      if (id === 'vlastiti') return postaviLogo(l.querySelector('img').src, 'vlastiti');
      const [, b] = LOGO_IKONE.find(([k]) => k === id);
      return postaviLogo(logoIkona(id, b), id);
    }
    const p = e.target.closest('[data-predlozak]');
    if (p) {
      Object.assign(S, PREDLOZAK_BAZA, PREDLOSCI[+p.dataset.predlozak].s);
      postaviKontrole();
      osvjezi();
      return obavijest('Predložak „' + PREDLOSCI[+p.dataset.predlozak].naziv + '” primijenjen.');
    }
    const f = e.target.closest('[data-fmt]');
    if (f) preuzmi(f.dataset.fmt);
  });

  $('#zamijeni').onclick = () => {
    [S.boja1, S.pozadina] = [S.pozadina, S.boja1];
    S.prozirno = false;
    postaviKontrole();
    osvjezi();
  };
  $('#logoDat').addEventListener('change', e => { ucitajLogo(e.target.files[0]); e.target.value = ''; });
  $('#spremiDizajn').onclick = spremiDizajn;
  $('#ucitajDizajn').addEventListener('change', e => { ucitajDizajn(e.target.files[0]); e.target.value = ''; });
  $('#vratiZadano').onclick = () => {
    const sadrzaj = S.sadrzaj, tip = S.tip;
    S = { ...structuredClone(ZADANO), sadrzaj, tip };
    izgradiLogoGaleriju();
    postaviKontrole();
    osvjezi();
    obavijest('Dizajn je vraćen na zadano.');
  };

  new IntersectionObserver(([u]) => { pregledVidljiv = u.isIntersecting; azurirajMini(); }).observe($('#pregled'));
  $('#mini').onclick = () => $('#pregledKartica').scrollIntoView({ behavior: 'smooth', block: 'start' });

  nacrtaj();
}

pokreni();
