document.addEventListener('DOMContentLoaded', () => {
  const bgLayer = document.getElementById('bg-layer');
  if (!bgLayer) return;

  const particleData = Array.from({ length: 48 }, (_, i) => ({
    x:       (i * 37.3 + 11) % 100,
    y:       (i * 19.7 + 7)  % 100,
    size:    ((i * 7 + 3) % 15) / 10 + 0.5,
    drift:   (((i % 5) - 2) * 0.018) * 3,
    opacity: ((i * 11 + 5) % 35) / 100 + 0.08,
  }));

  const animated = [];

  // Generate particles
  particleData.forEach(p => {
    const el = document.createElement('div');
    el.className = 'particle';
    el.style.cssText = `left:${p.x}%;top:${p.y}%;width:${p.size*3}px;height:${p.size*3}px;opacity:${p.opacity};`;
    bgLayer.appendChild(el);
    animated.push({ el, drift: p.drift, rotate: '' });
  });

  // Generate background vertical lines
  [{ x:25, drift:0.036 }, { x:75, drift:-0.027 }, { x:8, drift:0.018 }, { x:92, drift:-0.042 }].forEach(l => {
    const el = document.createElement('div');
    el.className = 'bg-line';
    el.style.left = l.x + '%';
    bgLayer.appendChild(el);
    animated.push({ el, drift: l.drift, rotate: '' });
  });

  // Generate circles
  [
    { w:600, h:600, right:-180, top:'5%',  drift:-0.06,  color:'rgba(65,105,255,0.10)' },
    { w:900, h:900, right:-330, top:'2%',  drift:-0.03,  color:'rgba(255,255,255,0.04)' },
    { w:500, h:500, left:-160,  top:'55%', drift: 0.045, color:'rgba(65,105,255,0.08)' },
  ].forEach(c => {
    const el = document.createElement('div');
    el.className = 'bg-circle';
    el.style.width = c.w + 'px'; el.style.height = c.h + 'px'; el.style.top = c.top; el.style.borderColor = c.color;
    if (c.right !== undefined) el.style.right = c.right + 'px';
    if (c.left  !== undefined) el.style.left  = c.left  + 'px';
    bgLayer.appendChild(el);
    animated.push({ el, drift: c.drift, rotate: '' });
  });

  // Generate diagonals
  [
    { top:'20%', left:'88%', height:'50vh', opacity:0.15, rotate:'rotate(15deg)',  drift:-0.06 },
    { top:'60%', left:'15%', height:'35vh', opacity:0.10, rotate:'rotate(-12deg)', drift: 0.054 },
  ].forEach(d => {
    const el = document.createElement('div');
    el.className = 'bg-diag';
    el.style.cssText = `top:${d.top};left:${d.left};height:${d.height};background:var(--primary);opacity:${d.opacity};transform-origin:top;`;
    bgLayer.appendChild(el);
    animated.push({ el, drift: d.drift, rotate: d.rotate });
  });

  // Animation Loop setup
  const blob = document.getElementById('blob');
  const rawMouse = { x: -500, y: -500 };
  const smMouse = { x: -500, y: -500 };
  let rawScroll = 0;
  let smScroll = 0;

  window.addEventListener('mousemove', e => { 
    rawMouse.x = e.clientX; 
    rawMouse.y = e.clientY; 
  });

  window.addEventListener('scroll', () => {
    rawScroll = window.scrollY;
  }, { passive: true });

  (function loop() {
    // Mouse blob smoothing
    smMouse.x += (rawMouse.x - smMouse.x) * 0.07;
    smMouse.y += (rawMouse.y - smMouse.y) * 0.07;
    if (blob) {
      blob.style.left = (smMouse.x - 240) + 'px';
      blob.style.top  = (smMouse.y - 240) + 'px';
    }

    // Scroll parallax dynamic drift
    smScroll += (rawScroll - smScroll) * 0.08;
    for (const { el, drift, rotate } of animated) {
      el.style.transform = `translateX(${smScroll * drift}px)${rotate ? ' ' + rotate : ''}`;
    }
    requestAnimationFrame(loop);
  })();
});