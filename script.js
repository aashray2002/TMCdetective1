const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const menuToggle = $('.menu-toggle');
const nav = $('.nav');
menuToggle?.addEventListener('click', () => nav.classList.toggle('open'));
$$('.nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, {threshold:.12});
$$('.reveal').forEach(el => observer.observe(el));

const faqSlider = $('#faqSlider');
const moveFaqSlider = (direction = 1) => {
  if (!faqSlider) return;
  const card = faqSlider.querySelector('.faq-item');
  const distance = card ? card.getBoundingClientRect().width + 20 : 320;
  const atEnd = faqSlider.scrollLeft + faqSlider.clientWidth >= faqSlider.scrollWidth - 8;
  const atStart = faqSlider.scrollLeft <= 8;
  if ((direction > 0 && atEnd) || (direction < 0 && atStart)) {
    faqSlider.scrollTo({ left: direction > 0 ? 0 : faqSlider.scrollWidth, behavior: 'smooth' });
    return;
  }
  faqSlider.scrollBy({ left: direction * distance, behavior: 'smooth' });
};

$$('[data-faq-slide]').forEach(button => button.addEventListener('click', () => {
  moveFaqSlider(button.dataset.faqSlide === 'next' ? 1 : -1);
}));

if (faqSlider && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const cards = [...faqSlider.querySelectorAll('.faq-item')];
  const clonedCards = cards.map(card => {
    const copy = card.cloneNode(true);
    copy.classList.remove('reveal');
    copy.classList.add('visible');
    copy.setAttribute('aria-hidden', 'true');
    faqSlider.appendChild(copy);
    return copy;
  });

  let isFaqSliderHovered = false;
  let previousFrame;
  const scrollContinuously = timestamp => {
    if (previousFrame && !isFaqSliderHovered) {
      const elapsed = Math.min(timestamp - previousFrame, 50);
      faqSlider.scrollLeft += elapsed * 1;
      const loopWidth = clonedCards[0].offsetLeft - cards[0].offsetLeft;
      if (faqSlider.scrollLeft >= loopWidth) faqSlider.scrollLeft -= loopWidth;
    }
    previousFrame = timestamp;
    window.requestAnimationFrame(scrollContinuously);
  };

  faqSlider.addEventListener('mouseenter', () => { isFaqSliderHovered = true; });
  faqSlider.addEventListener('mouseleave', () => { isFaqSliderHovered = false; });
  window.requestAnimationFrame(scrollContinuously);
}

const glow = $('.cursor-glow');
window.addEventListener('pointermove', e => {
  document.documentElement.style.setProperty('--mx', e.clientX + 'px');
  document.documentElement.style.setProperty('--my', e.clientY + 'px');
});

$$('.service-card').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX-r.left)/r.width-.5)*8;
    const y = ((e.clientY-r.top)/r.height-.5)*-8;
    card.style.transform = `translateY(-7px) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('pointerleave', () => card.style.transform = '');
});

const form = $('#contactForm');
const serviceSelect = $('#serviceSelect');
const selectedService = $('#selectedService');
$$('[data-service]').forEach(link => link.addEventListener('click', () => {
  setTimeout(() => {
    serviceSelect.value = link.dataset.service;
    selectedService.value = link.dataset.service;
  }, 200);
}));

form?.addEventListener('submit', (e) => {
  const note = $('#formNote');
  const isStaticPreview = ['127.0.0.1', 'localhost'].includes(window.location.hostname) && window.location.port === '5500';

  if (isStaticPreview) {
    e.preventDefault();
    note.textContent = 'Email sending needs a PHP-enabled server. Live Server is only a static preview.';
    const title = $('#successTitle');
    const message = $('#successModal p');
    title.textContent = 'Preview mode active';
    message.textContent = 'Your form design is working, but Live Server cannot send emails. Run this project with PHP/XAMPP or deploy it to PHP hosting to receive enquiries at your email address.';
    openSuccessModal();
    return;
  }

  note.textContent = 'Sending your confidential enquiry securely...';
});

function closeSuccessModal() {
  const modal = $('#successModal');
  modal?.classList.remove('open');
  modal?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function openSuccessModal() {
  const modal = $('#successModal');
  modal?.classList.add('open');
  modal?.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

if (new URLSearchParams(window.location.search).get('sent') === '1') {
  openSuccessModal();
  window.history.replaceState({}, document.title, `${window.location.pathname}#contact`);
}

$$('[data-close-modal]').forEach(button => button.addEventListener('click', () => {
  closeSuccessModal();
}));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSuccessModal();
});

const launcher = $('#chatLauncher'), chatbot = $('#chatbot'), close = $('#chatClose');
launcher.addEventListener('click', () => { chatbot.classList.add('open'); chatbot.setAttribute('aria-hidden','false'); $('#chatInput').focus(); launcher.querySelector('i').style.display='none'; });
close.addEventListener('click', () => { chatbot.classList.remove('open'); chatbot.setAttribute('aria-hidden','true'); });

const messages = $('#chatMessages');
const input = $('#chatInput');
const chatForm = $('#chatForm');

const serviceNames = [
  'Address Verification','Employment Verification','Background Verification','Employee Verification',
  'Reference Verification','Pre-Matrimonial Investigation','Social / Online Verification','Document Verification',
  'Asset & Address Verification','Tenant Verification','Domestic Staff Verification','Digital Background Research'
];

function botReply(text){
  const t = text.toLowerCase();
  if (t.includes('service') || t.includes('what do')) {
    return 'We provide 12 core verification and investigation services, including background, employment, address, tenant, document, pre-matrimonial and digital background verification. You can view the full list in the Services section.';
  }
  if (t.includes('price') || t.includes('cost') || t.includes('charge')) {
    return 'Pricing depends on the service and case scope. Please request a confidential consultation and we can discuss the appropriate scope before proceeding.';
  }
  if (t.includes('contact') || t.includes('phone') || t.includes('whatsapp')) {
    return 'You can call +91 90414 12801, WhatsApp us, or email infor@triguna.org. For a private enquiry, the Contact section also has a form.';
  }
  if (t.includes('consult') || t.includes('investigation') || t.includes('help')) {
    return 'Absolutely. Start with a brief description of the situation—without highly sensitive details. We can then discuss the lawful scope and next steps privately.';
  }
  if (t.includes('location') || t.includes('mohali')) {
    return 'We handle enquiries remotely through phone, WhatsApp, email, or the confidential contact form.';
  }
  return 'I can help with services, consultation, contact details, or pricing questions. What would you like to know?';
}

function addMessage(text, who='bot'){
  const el = document.createElement('div');
  el.className = who === 'user' ? 'user-msg' : 'bot-msg';
  el.textContent = text;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}
function sendChat(text){
  if(!text.trim()) return;
  addMessage(text,'user');
  setTimeout(() => addMessage(botReply(text)), 350);
}
chatForm.addEventListener('submit', e => { e.preventDefault(); sendChat(input.value); input.value=''; });
$$('.chat-quick button').forEach(b => b.addEventListener('click', () => sendChat(b.dataset.q)));
