// ── ELEMENTOS ──
const themeToggle = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');
const styleBtn = document.getElementById('styleBtn');
const stylePanel = document.getElementById('stylePanel');
const colorOpts = document.querySelectorAll('.color-opt');
const fontSelect = document.getElementById('fontSelect');
const customColorPicker = document.getElementById('customColorPicker');
const customColorContainer = document.getElementById('customColorContainer');
const cursor = document.getElementById('cursor');
const cursorOutline = document.getElementById('cursorOutline');

// ── CURSOR PERSONALIZADO ──
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorOutline.style.left = e.clientX + 'px';
    cursorOutline.style.top = e.clientY + 'px';
  });

  const interactiveElements = document.querySelectorAll('a, button, .color-opt, select, input');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
      cursorOutline.classList.add('cursor-outline-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      cursorOutline.classList.remove('cursor-outline-hover');
    });
  });
}

// ── ESTADO INICIAL / LOCALSTORAGE ──
const PRESETS = ['#2f80ff', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b'];
const config = JSON.parse(localStorage.getItem('portfolio-style-config')) || {
  theme: 'dark',
  primaryColor: '#8b5cf6',
  fontFamily: "'Plus Jakarta Sans', sans-serif"
};

function setAccent(color) {
  const root = document.documentElement.style;
  root.setProperty('--primary-color', color);
  root.setProperty('--accent', color);
  root.setProperty('--glow-color', `${color}26`); // 15% de opacidade
}

// ── APLICAR CONFIGURAÇÃO INICIAL ──
function applyConfig() {
  if (config.theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeToggle.checked = true;
    themeLabel.innerText = 'Modo Escuro';
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeToggle.checked = false;
    themeLabel.innerText = 'Modo Claro';
  }

  setAccent(config.primaryColor);

  colorOpts.forEach(opt => {
    opt.classList.remove('active');
    if (opt.dataset.color === config.primaryColor) {
      opt.classList.add('active');
    } else if (opt.dataset.color === 'custom' && !PRESETS.includes(config.primaryColor)) {
      opt.classList.add('active');
      customColorContainer.style.display = 'flex';
      customColorPicker.value = config.primaryColor;
    }
  });

  document.documentElement.style.setProperty('--main-font', config.fontFamily);
  fontSelect.value = config.fontFamily;
}

function saveConfig() {
  localStorage.setItem('portfolio-style-config', JSON.stringify(config));
}

// ── EVENTOS ──
styleBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  stylePanel.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (!stylePanel.contains(e.target) && e.target !== styleBtn) {
    stylePanel.classList.remove('active');
  }
});

themeToggle.addEventListener('change', () => {
  if (themeToggle.checked) {
    document.documentElement.setAttribute('data-theme', 'light');
    themeLabel.innerText = 'Modo Escuro';
    config.theme = 'light';
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeLabel.innerText = 'Modo Claro';
    config.theme = 'dark';
  }
  saveConfig();
});

colorOpts.forEach(opt => {
  opt.addEventListener('click', () => {
    const color = opt.dataset.color;
    colorOpts.forEach(o => o.classList.remove('active'));
    opt.classList.add('active');

    if (color === 'custom') {
      customColorContainer.style.display = 'flex';
      updatePrimaryColor(customColorPicker.value);
    } else {
      customColorContainer.style.display = 'none';
      updatePrimaryColor(color);
    }
  });
});

customColorPicker.addEventListener('input', (e) => updatePrimaryColor(e.target.value));

function updatePrimaryColor(color) {
  config.primaryColor = color;
  setAccent(color);
  saveConfig();
}

fontSelect.addEventListener('change', (e) => {
  config.fontFamily = e.target.value;
  document.documentElement.style.setProperty('--main-font', e.target.value);
  saveConfig();
});

// ── Hover Glow nos cards ──
document.querySelectorAll('.glow-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  });
});

// ── Animação de entrada ao rolar ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.05 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

applyConfig();
