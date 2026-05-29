/* =====================
   CURSOR PERSONALIZADO
   ===================== */
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
});

(function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
})();

document.querySelectorAll('a, button, .builder__option, .galeria__item').forEach(el => {
    el.addEventListener('mouseenter', () => cursorFollower.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hover'));
});

/* =====================
   NAV — SCROLL & MOBILE
   ===================== */
const nav      = document.getElementById('nav');
const menuBtn  = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* =====================
   PÉTALAS FLUTUANTES
   ===================== */
const petalsContainer = document.getElementById('petals');
const petalEmojis     = ['🌸', '🌺', '🌼', '🌷', '✿', '❀', '🌹'];

function createPetal() {
    const p = document.createElement('div');
    p.className   = 'petal';
    p.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
    p.style.left              = Math.random() * 100 + 'vw';
    p.style.animationDuration = (9 + Math.random() * 8) + 's';
    p.style.animationDelay    = (Math.random() * 3) + 's';
    p.style.fontSize          = (1 + Math.random() * 1.2) + 'rem';
    petalsContainer.appendChild(p);
    setTimeout(() => p.remove(), 18000);
}

for (let i = 0; i < 8; i++) setTimeout(createPetal, i * 300);
setInterval(createPetal, 900);

/* =====================
   SCROLL REVEAL
   ===================== */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add('revealed'), idx * 80);
        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* =====================
   MONTADOR DE BUQUÊ
   ===================== */
const WHATSAPP_NUMBER = '556184293798';

let currentStep = 1;
const TOTAL_STEPS = 4;

const state = { ocasiao: null, flores: [], cores: null, embalagem: null };

const progressFill = document.getElementById('progressFill');
const prevBtn      = document.getElementById('prevBtn');
const nextBtn      = document.getElementById('nextBtn');
const whatsappBtn  = document.getElementById('whatsappBtn');

function updateProgress() {
    const pct = (currentStep / TOTAL_STEPS) * 100;
    progressFill.style.width = pct + '%';

    document.querySelectorAll('.step-dot').forEach((dot, i) => {
        const s = i + 1;
        dot.classList.toggle('active',    s === currentStep);
        dot.classList.toggle('completed', s <  currentStep);
    });
}

function showStep(step) {
    document.querySelectorAll('.builder__step').forEach(s => s.classList.remove('active'));
    const target = document.querySelector(`.builder__step[data-step="${step}"]`);
    if (target) target.classList.add('active');

    prevBtn.style.display = step > 1 ? 'inline-flex' : 'none';

    if (step <= TOTAL_STEPS) {
        nextBtn.style.display    = 'inline-flex';
        nextBtn.textContent      = step === TOTAL_STEPS ? 'Ver Resumo →' : 'Próximo →';
        whatsappBtn.style.display = 'none';
    } else {
        nextBtn.style.display    = 'none';
        whatsappBtn.style.display = 'inline-flex';
        buildSummary();
    }

    updateProgress();
}

/* Seleção de opções */
document.querySelectorAll('.builder__option').forEach(opt => {
    opt.addEventListener('click', function () {
        const stepEl = this.closest('.builder__step');
        const stepNum = parseInt(stepEl.dataset.step);
        const isMulti = this.dataset.multi === 'true';

        if (isMulti) {
            this.classList.toggle('selected');
        } else {
            stepEl.querySelectorAll('.builder__option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
        }

        saveSelection(stepNum);
    });
});

function saveSelection(step) {
    const stepEl  = document.querySelector(`.builder__step[data-step="${step}"]`);
    const selected = stepEl.querySelectorAll('.builder__option.selected');

    if (step === 1) state.ocasiao  = selected.length ? selected[0].dataset.value : null;
    if (step === 2) state.flores   = Array.from(selected).map(o => o.dataset.value);
    if (step === 3) state.cores    = selected.length ? selected[0].dataset.value : null;
    if (step === 4) state.embalagem = selected.length ? selected[0].dataset.value : null;
}

function canProceed() {
    if (currentStep === 1) return !!state.ocasiao;
    if (currentStep === 2) return state.flores.length > 0;
    if (currentStep === 3) return !!state.cores;
    if (currentStep === 4) return !!state.embalagem;
    return true;
}

function shakeBtn() {
    const orig = nextBtn.textContent;
    nextBtn.textContent  = 'Selecione uma opção ⬆';
    nextBtn.style.background = '#e07066';
    setTimeout(() => {
        nextBtn.textContent  = orig;
        nextBtn.style.background = '';
    }, 1600);
}

nextBtn.addEventListener('click', () => {
    if (!canProceed()) { shakeBtn(); return; }
    currentStep++;
    showStep(currentStep);
    document.getElementById('monte-seu-buque')
        .scrollIntoView({ behavior: 'smooth', block: 'center' });
});

prevBtn.addEventListener('click', () => {
    currentStep--;
    showStep(currentStep);
});

function buildSummary() {
    const flores = state.flores.length ? state.flores.join(', ') : '-';
    const msg = encodeURIComponent(
        `Olá! Gostaria de montar um buquê personalizado na Beatriz Floricultura 🌸\n\n` +
        `🎉 Ocasião: ${state.ocasiao  || '-'}\n` +
        `🌺 Flores:  ${flores}\n` +
        `🎨 Cores:   ${state.cores    || '-'}\n` +
        `🎁 Embalagem: ${state.embalagem || '-'}\n\n` +
        `Aguardo o orçamento! 💕`
    );
    whatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;

    document.getElementById('builderSummary').innerHTML = `
        <span class="builder__summary-bounce">🌸</span>
        <h3 class="builder__summary-title">Seu Buquê Perfeito!</h3>
        <p class="builder__summary-sub">Aqui está o resumo das suas escolhas</p>
        <div class="builder__summary-items">
            <div class="summary-item">
                <span class="summary-item__label">🎉 Ocasião</span>
                <span class="summary-item__value">${state.ocasiao || '-'}</span>
            </div>
            <div class="summary-item">
                <span class="summary-item__label">🌺 Flores</span>
                <span class="summary-item__value">${flores}</span>
            </div>
            <div class="summary-item">
                <span class="summary-item__label">🎨 Cores</span>
                <span class="summary-item__value">${state.cores || '-'}</span>
            </div>
            <div class="summary-item">
                <span class="summary-item__label">🎁 Embalagem</span>
                <span class="summary-item__value">${state.embalagem || '-'}</span>
            </div>
        </div>
        <p class="builder__summary-note">
            Clique no botão abaixo para enviar suas escolhas pelo WhatsApp<br>
            e receber um orçamento personalizado rapidinho! 💚
        </p>
    `;
}

/* Inicializa */
showStep(1);

/* =====================
   SMOOTH SCROLL ÂNCORAS
   ===================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ── Barra de progresso
const scrollProg = document.getElementById('scroll-progress');
if (scrollProg) {
  window.addEventListener('scroll', () => {
    const s = document.documentElement.scrollTop;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    scrollProg.style.width = (h > 0 ? (s/h)*100 : 0) + '%';
  }, { passive: true });
}

// ── FAQ Flores
function toggleFf(id) {
  const el = document.getElementById(id);
  const isOpen = el.classList.contains('open');
  document.querySelectorAll('.faq-flores__item.open').forEach(x => x.classList.remove('open'));
  if (!isOpen) el.classList.add('open');
}

// ── Sticky bar mobile
const stickyMobile = document.getElementById('stickyMobile');
if (stickyMobile) {
  window.addEventListener('scroll', () => {
    stickyMobile.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });
}
