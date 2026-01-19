// SPA Router для Telegram Mini App
console.log('SPA Router loaded');

const router = {
  currentPage: 'home',
  isTelegramMiniApp: false,
  pageCache: {},

  init() {
    console.log('Router init started');

    const root = document.getElementById('root');
    if (root && !window.homeContent) {
      window.homeContent = root.innerHTML;
    }

    // Предзагрузка страниц для мгновенного переключения
    this.preloadPages();

    this.isTelegramMiniApp = !!(window.Telegram && window.Telegram.WebApp);

    if (this.isTelegramMiniApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }

    this.setupNavHandlers();
    this.setupPopstateHandler();
    this.checkCurrentUrl();
    
    console.log('Router init completed');
  },

  async preloadPages() {
    const pages = [
      { name: 'tasks', url: './talks/talks.html' },
      { name: 'profile', url: './profile/profile.html' }
    ];

    pages.forEach(async (page) => {
      try {
        const response = await fetch(page.url);
        if (response.ok) {
          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const content = Array.from(doc.body.children)
            .filter(el => el.tagName !== 'SCRIPT')
            .map(el => el.outerHTML)
            .join('');
          this.pageCache[page.name] = content;
          console.log(`Page ${page.name} preloaded`);
        }
      } catch (e) {
        console.error(`Failed to preload ${page.name}`, e);
      }
    });
  },

  setupNavHandlers() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('nav button');
      if (!btn) return;

      const h4 = btn.querySelector('h4');
      if (!h4) return;

      const text = h4.textContent.trim();
      e.preventDefault();

      if (text === 'Задания') this.navigate('/tasks');
      else if (text === 'Профиль') this.navigate('/profile');
      else if (text === 'VPN') this.navigate('/');
    });
  },

  navigate(path) {
    const targetPage = path === '/' ? 'home' : path.replace('/', '');
    if (this.currentPage === targetPage) return;

    if (path === '/tasks') {
      history.pushState({ page: 'tasks' }, 'Задания', '/tasks');
      this.showPage('tasks');
    } else if (path === '/profile') {
      history.pushState({ page: 'profile' }, 'Профиль', '/profile');
      this.showPage('profile');
    } else if (path === '/') {
      history.pushState({ page: 'home' }, 'Home', '/');
      this.showPage('home');
    }
  },

  async showPage(pageName) {
    this.currentPage = pageName;
    const root = document.getElementById('root');
    if (!root) return;

    let content = '';
    if (pageName === 'home') {
      content = window.homeContent;
    } else {
      content = this.pageCache[pageName];
      if (!content) {
        const url = pageName === 'tasks' ? './talks/talks.html' : './profile/profile.html';
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        content = Array.from(doc.body.children)
          .filter(el => el.tagName !== 'SCRIPT')
          .map(el => el.outerHTML)
          .join('');
        this.pageCache[pageName] = content;
      }
    }

    if (content) {
      root.innerHTML = content;
      this.fixPaths();
      this.updateActiveTab(pageName === 'home' ? 'VPN' : (pageName === 'tasks' ? 'Задания' : 'Профиль'));
      
      if (pageName === 'profile' && !document.querySelector('link[href*="profile.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './profile/profile.css';
        document.head.appendChild(link);
      }
      
      window.scrollTo(0, 0);
    }
  },

  updateActiveTab(tabName) {
    const navButtons = document.querySelectorAll('nav button');
    navButtons.forEach((button) => {
      const h4 = button.querySelector('h4');
      if (h4 && h4.textContent.trim() === tabName) {
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
        const svgPath = button.querySelector('svg path');
        if (svgPath) svgPath.setAttribute('fill', '#0091FF');
      } else {
        button.classList.remove('active');
        button.setAttribute('aria-selected', 'false');
        const svgPath = button.querySelector('svg path');
        if (svgPath) svgPath.setAttribute('fill', 'white');
      }
    });
  },

  setupPopstateHandler() {
    window.addEventListener('popstate', (e) => {
      const page = (e.state && e.state.page) || 'home';
      this.showPage(page);
    });
  },

  checkCurrentUrl() {
    const path = window.location.pathname;
    if (path === '/tasks') this.showPage('tasks');
    else if (path === '/profile') this.showPage('profile');
    else this.showPage('home');
  },

  fixPaths() {
    const elements = document.querySelectorAll('img, link[rel="stylesheet"], source');
    elements.forEach(el => {
      const attr = el.tagName === 'LINK' ? 'href' : 'src';
      let val = el.getAttribute(attr);
      if (val && val.startsWith('/') && !val.startsWith('//')) {
        el.setAttribute(attr, '.' + val);
      }
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => router.init());
} else {
  router.init();
}
