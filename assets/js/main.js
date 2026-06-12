console.log(
  "%c👋 Hey! Since you're here, check out my PCB background generator I created especially for my website background:\n%c" + location.origin + "/tools/pcb-generator %chave fun!",
  "font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #00ff88;",
  "font-size: 13px; color: #aaa;",
  "font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #00ff88;"
);

document.addEventListener('click', function (e) {
  const link = e.target.closest('a[href*="#"]');
  if (!link) return;

  const url = new URL(link.href, location.href);

  if (url.pathname !== location.pathname) return;

  e.preventDefault();

  const hash = url.hash;
  if (!hash) return;

  history.pushState(null, '', hash);

  const target = document.querySelector(hash);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
});
