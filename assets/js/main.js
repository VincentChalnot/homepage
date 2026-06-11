console.log(
  "%c👋 Hey! Since you're here, check out my PCB background generator I created especially for my website background:\n%chttps://vincent-chalnot.pages.dev/tools/pcb-generator %chave fun!",
  "font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #00ff88;",
  "font-size: 13px; color: #aaa;",
  "font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #00ff88;"
);

document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .section-container > *').forEach(el => observer.observe(el));
});
