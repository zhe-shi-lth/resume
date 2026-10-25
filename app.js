const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reduced) {
  document.documentElement.classList.add('js');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
const roles = {
  ai: { label: 'AI', summary: '从 Agent 安全到业务协作，探索可控、可追溯的 AI 应用。' },
  java: { label: 'Java', summary: '聚焦事务一致性、多租户隔离与实时系统，关注后端工程的可靠性。' },
  fullstack: { label: '全栈', summary: '从前端交互到业务服务与 AI 协作，连接完整的产品交付链路。' }
};
document.querySelectorAll('[data-role]').forEach(button => button.addEventListener('click', () => {
  const role = button.dataset.role;
  document.querySelectorAll('[data-role]').forEach(item => {
    const active = item === button; item.classList.toggle('selected', active); item.setAttribute('aria-pressed', String(active));
  });
  document.querySelector('#role-summary').textContent = roles[role].summary;
  const link = document.querySelector('#resume-link');
  link.href = `assets/resume-${role}.pdf`;
  link.innerHTML = `下载 ${roles[role].label} 简历 <span>↓</span>`;
  document.querySelectorAll('.project').forEach(project => { project.hidden = !project.dataset.tags.split(' ').includes(role); });
}));
let scheduled = false;
function updateProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  document.querySelector('.progress').style.width = `${total > 0 ? window.scrollY / total * 100 : 0}%`;
  scheduled = false;
}
window.addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); } }, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#copy-wechat').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try { await navigator.clipboard.writeText('Shizhelth'); status.textContent = '微信号已复制：Shizhelth'; }
  catch { status.textContent = '微信号：Shizhelth，请长按或选中复制。'; }
});

const viewer = document.querySelector('#image-viewer');
let activeGallery = null;
const galleries = [];
document.querySelectorAll('.screenshot-gallery').forEach(gallery => {
  const slides = [...gallery.querySelectorAll('.gallery-slide')];
  const dots = [...gallery.querySelectorAll('[data-slide]')];
  let index = 0;
  function renderViewer() {
    const image = slides[index].querySelector('img');
    document.querySelector('#viewer-image').src = slides[index].getAttribute('href');
    document.querySelector('#viewer-image').alt = image.alt;
    document.querySelector('#viewer-caption').textContent = slides[index].dataset.caption;
    document.querySelector('#viewer-count').textContent = `${index + 1} / ${slides.length}`;
  }
  function show(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== index; });
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === index)));
    gallery.querySelector('.gallery-counter').textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    gallery.querySelector('.gallery-caption').textContent = slides[index].dataset.caption;
    if (viewer.open && activeGallery === controller) renderViewer();
  }
  const controller = { move: step => show(index + step) };
  galleries.push(controller);
  gallery.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => controller.move(Number(button.dataset.step))));
  dots.forEach(dot => dot.addEventListener('click', () => show(Number(dot.dataset.slide))));
  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); controller.move(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  let touchStart = null;
  let swipedUntil = 0;
  const viewport = gallery.querySelector('.gallery-viewport');
  viewport.addEventListener('touchstart', event => {
    touchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  }, { passive: true });
  viewport.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
  viewport.addEventListener('touchend', event => {
    if (!touchStart || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      controller.move(dx < 0 ? 1 : -1); swipedUntil = Date.now() + 500;
    }
    touchStart = null;
  }, { passive: true });
  slides.forEach(slide => slide.addEventListener('click', event => {
    if (Date.now() < swipedUntil) { event.preventDefault(); return; }
    if (event.ctrlKey || event.metaKey || event.shiftKey || !viewer.showModal) return;
    event.preventDefault(); activeGallery = controller; renderViewer(); viewer.showModal(); document.body.classList.add('viewer-open');
  }));
});
document.querySelector('#viewer-close').addEventListener('click', () => viewer.close());
document.querySelector('#viewer-prev').addEventListener('click', () => activeGallery?.move(-1));
document.querySelector('#viewer-next').addEventListener('click', () => activeGallery?.move(1));
viewer.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); activeGallery?.move(event.key === 'ArrowRight' ? 1 : -1); }
});
viewer.addEventListener('close', () => document.body.classList.remove('viewer-open'));
viewer.addEventListener('click', event => { if (event.target === viewer) { const r = viewer.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) viewer.close(); } });
