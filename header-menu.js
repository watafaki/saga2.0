// === MENU HAMBÚRGUER UNIVERSAL S.A.G.A. ===
// Sistema de menu dropdown para header com tema e logout

class HeaderMenu {
    constructor() {
        this.menu = null;
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createMenu();
        this.setupEventListeners();
    }

    createMenu() {
        if (document.getElementById('header-menu')) {
            console.log('Menu já existe, pulando criação');
            return;
        }
        
        console.log('Criando menu hambúrguer...');

        // Cria o botão hambúrguer
        const menuButton = document.createElement('button');
        menuButton.id = 'menu-toggle';
        menuButton.innerHTML = '☰';
        menuButton.className = 'menu-toggle-btn';
        menuButton.style.cssText = `
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-color);
            padding: 0.5rem;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        `;

        // Cria o menu dropdown
        this.menu = document.createElement('div');
        this.menu.id = 'header-menu';
        this.menu.className = 'header-menu';
        this.menu.style.cssText = `
            position: absolute;
            top: calc(100% + 10px);
            right: 0;
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            box-shadow: 0 4px 12px var(--shadow-color);
            min-width: 200px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            z-index: 1000;
        `;

        this.menu.innerHTML = `
            <div class="menu-content" style="padding: 1rem;">
                <div class="menu-section">
                    <h4 style="margin: 0 0 0.5rem 0; color: var(--text-secondary); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Tema</h4>
                    <div class="theme-options" style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                        <button id="theme-dark-btn" class="theme-btn" data-theme="dark" style="
                            padding: 0.5rem 1rem; border: 1px solid var(--border-color); 
                            background: var(--bg-primary); color: var(--text-primary); 
                            border-radius: 6px; cursor: pointer; transition: all 0.3s ease;
                            font-size: 0.9rem;
                        ">🌙 Escuro</button>
                        <button id="theme-light-btn" class="theme-btn" data-theme="light" style="
                            padding: 0.5rem 1rem; border: 1px solid var(--border-color); 
                            background: var(--bg-primary); color: var(--text-primary); 
                            border-radius: 6px; cursor: pointer; transition: all 0.3s ease;
                            font-size: 0.9rem;
                        ">☀️ Claro</button>
                    </div>
                </div>
                <div class="menu-section">
                    <h4 style="margin: 0 0 0.5rem 0; color: var(--text-secondary); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Ações</h4>
                    <button id="logout-btn" class="logout-btn" style="
                        width: 100%; padding: 0.75rem; border: none; 
                        background: #dc3545; color: white; 
                        border-radius: 6px; cursor: pointer; font-weight: 500;
                        transition: all 0.3s ease; font-size: 0.9rem;
                    ">Sair</button>
                </div>
            </div>
        `;

        // Adiciona estilos CSS
        const style = document.createElement('style');
        style.textContent = `
            .menu-toggle-btn:hover {
                background: var(--shadow-color);
                border-color: var(--highlight-color);
                color: var(--highlight-color);
            }
            .header-menu.active {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            .theme-btn:hover {
                background: var(--shadow-color);
                border-color: var(--highlight-color);
            }
            .theme-btn.active {
                background: var(--highlight-color);
                color: var(--bg-primary);
                border-color: var(--highlight-color);
            }
            .logout-btn:hover {
                background: #c62828;
                transform: translateY(-1px);
            }
            .menu-section:not(:last-child) {
                border-bottom: 1px solid var(--border-color);
                margin-bottom: 1rem;
                padding-bottom: 1rem;
            }
        `;
        document.head.appendChild(style);

        // Insere o menu no header
        const header = document.querySelector('header');
        console.log('Header encontrado:', header);
        
        if (header) {
            header.style.position = 'relative';
            // Procura pelo container de controles do usuário
            const userControls = header.querySelector('.user-controls');
            console.log('User controls encontrado:', userControls);
            
            if (userControls) {
                userControls.appendChild(menuButton);
                userControls.appendChild(this.menu);
                console.log('Menu adicionado ao user-controls');
            } else {
                // Fallback: adiciona diretamente no header
                header.appendChild(menuButton);
                header.appendChild(this.menu);
                console.log('Menu adicionado diretamente ao header');
            }
        } else {
            console.error('Header não encontrado!');
        }
    }

    setupEventListeners() {
        const menuButton = document.getElementById('menu-toggle');
        const logoutBtn = document.getElementById('logout-btn');
        const themeDarkBtn = document.getElementById('theme-dark-btn');
        const themeLightBtn = document.getElementById('theme-light-btn');

        if (menuButton) {
            menuButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.closeMenu();
                if (window.logout) {
                    window.logout();
                }
            });
        }

        if (themeDarkBtn) {
            themeDarkBtn.addEventListener('click', () => {
                this.applyTheme('dark');
                this.updateThemeButtons('dark');
            });
        }

        if (themeLightBtn) {
            themeLightBtn.addEventListener('click', () => {
                this.applyTheme('light');
                this.updateThemeButtons('light');
            });
        }

        // Fecha o menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!this.menu.contains(e.target) && !e.target.closest('#menu-toggle')) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.menu.classList.add('active');
        } else {
            this.menu.classList.remove('active');
        }
    }

    closeMenu() {
        this.isOpen = false;
        this.menu.classList.remove('active');
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('saga-theme', theme);
        
        // Atualiza a logo baseada no tema
        const logo = document.querySelector('.logo');
        if (logo) {
            if (theme === 'light' || theme === 'claro') {
                logo.src = logo.src.replace('logo.png', 'logoinvertido.png');
            } else {
                logo.src = logo.src.replace('logoinvertido.png', 'logo.png');
            }
        }
    }

    updateThemeButtons(activeTheme) {
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === activeTheme) {
                btn.classList.add('active');
            }
        });
    }

    // Método para inicializar o tema salvo
    initTheme() {
        const savedTheme = localStorage.getItem('saga-theme') || 'dark';
        this.applyTheme(savedTheme);
        this.updateThemeButtons(savedTheme);
    }
}

// Inicializa o menu quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Aguarda um pouco para garantir que todos os elementos estejam carregados
    setTimeout(() => {
        window.headerMenu = new HeaderMenu();
        window.headerMenu.initTheme();
    }, 100);
});

// Também tenta inicializar após um tempo adicional
setTimeout(() => {
    if (!window.headerMenu) {
        window.headerMenu = new HeaderMenu();
        window.headerMenu.initTheme();
    }
}, 500);
