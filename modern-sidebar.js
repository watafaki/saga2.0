// === MENU LATERAL MODERNO S.A.G.A. ===
// Menu lateral responsivo com scroll personalizado e animações modernas

class ModernSidebar {
    constructor() {
        this.sidebar = null;
        this.overlay = null;
        this.isOpen = false;
        this.menuButton = null;
        this.init();
    }

    init() {
        this.createMenuButton();
        this.createSidebar();
        this.setupEventListeners();
        this.injectStyles();
    }

    createMenuButton() {
        // Remove botões existentes se houver
        const existingButtons = document.querySelectorAll('#menu-toggle-btn, .modern-menu-button');
        existingButtons.forEach(btn => btn.remove());

        // Cria o botão hambúrguer
        this.menuButton = document.createElement('button');
        this.menuButton.id = 'menu-toggle-btn';
        this.menuButton.className = 'modern-menu-button';
        this.menuButton.innerHTML = `
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        `;

        // Adiciona o botão ao início dos user-controls
        const userControls = document.querySelector('.user-controls');
        if (userControls) {
            // Remove botões de tema antigos se existirem
            const oldThemeButtons = userControls.querySelectorAll('#theme-toggle-dark, #theme-toggle-light');
            oldThemeButtons.forEach(btn => btn.remove());
            
            userControls.insertBefore(this.menuButton, userControls.firstChild);
        }
    }

    createSidebar() {
        if (document.getElementById('modern-sidebar')) return;

        // Cria o overlay
        this.overlay = document.createElement('div');
        this.overlay.id = 'modern-sidebar-overlay';
        this.overlay.className = 'modern-sidebar-overlay';

        // Cria a sidebar
        this.sidebar = document.createElement('div');
        this.sidebar.id = 'modern-sidebar';
        this.sidebar.className = 'modern-sidebar';

        // Determina o tipo de usuário
        const isProfessor = window.location.pathname.includes('professor');
        const navItems = isProfessor ? this.getProfessorNavItems() : this.getAlunoNavItems();
        const currentPage = window.location.pathname.split('/').pop();

        this.sidebar.innerHTML = `
            <div class="sidebar-header">
                <div class="sidebar-logo">
                    <img src="${isProfessor ? '../' : ''}logo.png" alt="Saga Logo" class="sidebar-logo-img">
                    <span class="sidebar-logo-text">SAGA</span>
                </div>
                <button class="sidebar-close-btn" id="sidebar-close-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            
            <div class="sidebar-content">
                <nav class="sidebar-nav">
                    ${navItems.map(item => `
                        <div class="sidebar-nav-item ${currentPage === item.href ? 'active' : ''}" data-href="${item.href}">
                            <div class="nav-item-icon">${item.icon}</div>
                            <div class="nav-item-content">
                                <div class="nav-item-title">${item.text}</div>
                                <div class="nav-item-description">${item.description}</div>
                            </div>
                            <div class="nav-item-arrow">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="9,18 15,12 9,6"></polyline>
                                </svg>
                            </div>
                        </div>
                    `).join('')}
                </nav>
                
                <div class="sidebar-footer">
                    <div class="sidebar-user-info">
                        <div class="user-avatar">
                            <span id="sidebar-user-initial">U</span>
                        </div>
                        <div class="user-details">
                            <div class="user-name" id="sidebar-user-name">Usuário</div>
                            <div class="user-role">${isProfessor ? 'Professor' : 'Aluno'}</div>
                        </div>
                    </div>
                    
                    <div class="sidebar-actions">
                        <button class="sidebar-action-btn" onclick="window.logout()" title="Sair">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16,17 21,12 16,7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                        </button>
                        <button class="sidebar-action-btn theme-toggle-sidebar" onclick="this.toggleTheme()" title="Alternar Tema">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Adiciona ao body
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.sidebar);
    }

    getAlunoNavItems() {
        return [
            {
                icon: '🏠',
                text: 'Hub Principal',
                description: 'Dashboard e resumo',
                href: 'alunoinicio.html'
            },
            {
                icon: '📊',
                text: 'Dashboard',
                description: 'Análises e métricas',
                href: 'alunodash.html'
            },
            {
                icon: '📝',
                text: 'Atividades',
                description: 'Suas tarefas e exercícios',
                href: 'alunoatvi.html'
            },
            {
                icon: '💬',
                text: 'Chat',
                description: 'Conversas e suporte',
                href: 'alunochat.html'
            },
            {
                icon: '📢',
                text: 'Comunicados',
                description: 'Avisos e notícias',
                href: 'alunocomu.html'
            },
            {
                icon: '📅',
                text: 'Cronograma',
                description: 'Horários e eventos',
                href: 'alunocrono.html'
            },
            {
                icon: '✍️',
                text: 'Exercícios',
                description: 'Gerador de quizzes',
                href: 'alunoexercicios.html'
            },
            {
                icon: '🤖',
                text: 'Nexus AI',
                description: 'Assistente inteligente',
                href: 'alunonexus.html'
            },
            {
                icon: '❓',
                text: 'Suporte',
                description: 'Ajuda e contato',
                href: 'alunosuporte.html'
            }
        ];
    }

    getProfessorNavItems() {
        return [
            {
                icon: '🏠',
                text: 'Dashboard',
                description: 'Painel principal',
                href: 'professordash.html'
            },
            {
                icon: '📚',
                text: 'Atividades',
                description: 'Gerenciar tarefas',
                href: 'professoratividades.html'
            },
            {
                icon: '📢',
                text: 'Comunicados',
                description: 'Enviar avisos',
                href: 'professorcomunicados.html'
            },
            {
                icon: '📊',
                text: 'Relatórios',
                description: 'Análises e dados',
                href: '#'
            },
            {
                icon: '👥',
                text: 'Alunos',
                description: 'Gerenciar estudantes',
                href: '#'
            },
            {
                icon: '⚙️',
                text: 'Configurações',
                description: 'Preferências',
                href: '#'
            }
        ];
    }

    injectStyles() {
        if (document.getElementById('modern-sidebar-styles')) return;

        const style = document.createElement('style');
        style.id = 'modern-sidebar-styles';
        style.textContent = `
            /* Botão do menu */
            .modern-menu-button {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 36px;
                height: 36px;
                background: var(--surface-color);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                padding: 0;
                gap: 3px;
            }

            .modern-menu-button:hover {
                border-color: var(--highlight-color);
                transform: scale(1.05);
            }

            .hamburger-line {
                width: 18px;
                height: 2px;
                background: var(--text-primary);
                border-radius: 1px;
                transition: all 0.3s ease;
            }

            .modern-menu-button.active .hamburger-line:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }

            .modern-menu-button.active .hamburger-line:nth-child(2) {
                opacity: 0;
            }

            .modern-menu-button.active .hamburger-line:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }

            /* Overlay */
            .modern-sidebar-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(8px);
                z-index: 999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .modern-sidebar-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            /* Sidebar */
            .modern-sidebar {
                position: fixed;
                top: 0;
                left: -320px;
                width: 320px;
                height: 100vh;
                background: var(--surface-color);
                border-right: 1px solid var(--border-color);
                z-index: 1000;
                transition: left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                display: flex;
                flex-direction: column;
                box-shadow: 4px 0 20px var(--shadow-color);
            }

            .modern-sidebar.active {
                left: 0;
            }

            /* Header da sidebar */
            .sidebar-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem 1.5rem 1rem 1.5rem;
                border-bottom: 1px solid var(--border-color);
                background: var(--bg-primary);
            }

            .sidebar-logo {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .sidebar-logo-img {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                object-fit: contain;
            }

            .sidebar-logo-text {
                font-size: 1.25rem;
                font-weight: 700;
                color: var(--text-primary);
            }

            .sidebar-close-btn {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 8px;
                transition: all 0.2s ease;
            }

            .sidebar-close-btn:hover {
                color: var(--text-primary);
                background: var(--shadow-color);
            }

            /* Conteúdo da sidebar */
            .sidebar-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .sidebar-nav {
                flex: 1;
                padding: 1rem 0;
                overflow-y: auto;
                /* Scroll personalizado */
                scrollbar-width: thin;
                scrollbar-color: var(--border-color) transparent;
            }

            .sidebar-nav::-webkit-scrollbar {
                width: 6px;
            }

            .sidebar-nav::-webkit-scrollbar-track {
                background: transparent;
            }

            .sidebar-nav::-webkit-scrollbar-thumb {
                background: var(--border-color);
                border-radius: 3px;
                transition: background 0.2s ease;
            }

            .sidebar-nav::-webkit-scrollbar-thumb:hover {
                background: var(--text-secondary);
            }

            .sidebar-nav-item {
                display: flex;
                align-items: center;
                padding: 1rem 1.5rem;
                margin: 0 0.75rem 0.5rem 0.75rem;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .sidebar-nav-item::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                transition: left 0.5s ease;
            }

            .sidebar-nav-item:hover::before {
                left: 100%;
            }

            .sidebar-nav-item:hover {
                background: var(--bg-primary);
                transform: translateX(8px);
                border-left: 3px solid var(--highlight-color);
            }

            .sidebar-nav-item.active {
                background: var(--highlight-color);
                color: var(--bg-primary);
                transform: translateX(8px);
                border-left: 3px solid var(--bg-primary);
            }

            .sidebar-nav-item.active .nav-item-icon,
            .sidebar-nav-item.active .nav-item-title,
            .sidebar-nav-item.active .nav-item-description,
            .sidebar-nav-item.active .nav-item-arrow {
                color: var(--bg-primary);
            }

            .nav-item-icon {
                font-size: 1.5rem;
                width: 40px;
                text-align: center;
                margin-right: 0.75rem;
            }

            .nav-item-content {
                flex: 1;
            }

            .nav-item-title {
                font-weight: 600;
                font-size: 0.95rem;
                margin-bottom: 0.2rem;
                color: var(--text-primary);
            }

            .nav-item-description {
                font-size: 0.8rem;
                color: var(--text-secondary);
                opacity: 0.8;
            }

            .nav-item-arrow {
                color: var(--text-secondary);
                opacity: 0;
                transform: translateX(-10px);
                transition: all 0.3s ease;
            }

            .sidebar-nav-item:hover .nav-item-arrow {
                opacity: 1;
                transform: translateX(0);
            }

            /* Footer da sidebar */
            .sidebar-footer {
                border-top: 1px solid var(--border-color);
                padding: 1.5rem;
                background: var(--bg-primary);
            }

            .sidebar-user-info {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-bottom: 1rem;
            }

            .user-avatar {
                width: 40px;
                height: 40px;
                background: var(--highlight-color);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                color: var(--bg-primary);
            }

            .user-details {
                flex: 1;
            }

            .user-name {
                font-weight: 600;
                font-size: 0.9rem;
                color: var(--text-primary);
                margin-bottom: 0.2rem;
            }

            .user-role {
                font-size: 0.8rem;
                color: var(--text-secondary);
            }

            .sidebar-actions {
                display: flex;
                gap: 0.5rem;
            }

            .sidebar-action-btn {
                flex: 1;
                padding: 0.75rem;
                background: var(--surface-color);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                color: var(--text-secondary);
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .sidebar-action-btn:hover {
                color: var(--text-primary);
                border-color: var(--highlight-color);
                background: var(--shadow-color);
            }

            /* Responsividade */
            @media (max-width: 768px) {
                .modern-sidebar {
                    width: 280px;
                    left: -280px;
                }
            }

            /* Animações */
            @keyframes slideInRight {
                from {
                    transform: translateX(-20px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            .sidebar-nav-item {
                animation: slideInRight 0.3s ease-out;
            }

            .sidebar-nav-item:nth-child(1) { animation-delay: 0.1s; }
            .sidebar-nav-item:nth-child(2) { animation-delay: 0.15s; }
            .sidebar-nav-item:nth-child(3) { animation-delay: 0.2s; }
            .sidebar-nav-item:nth-child(4) { animation-delay: 0.25s; }
            .sidebar-nav-item:nth-child(5) { animation-delay: 0.3s; }
            .sidebar-nav-item:nth-child(6) { animation-delay: 0.35s; }
            .sidebar-nav-item:nth-child(7) { animation-delay: 0.4s; }
            .sidebar-nav-item:nth-child(8) { animation-delay: 0.45s; }
            .sidebar-nav-item:nth-child(9) { animation-delay: 0.5s; }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Botão do menu
        if (this.menuButton) {
            this.menuButton.addEventListener('click', () => this.toggleSidebar());
        }

        // Botão de fechar
        const closeBtn = document.getElementById('sidebar-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeSidebar());
        }

        // Overlay
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeSidebar());
        }

        // Itens do menu
        const navItems = document.querySelectorAll('.sidebar-nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const href = item.dataset.href;
                if (href && href !== '#') {
                    this.closeSidebar();
                    setTimeout(() => {
                        if (window.navigateWithVinheta) {
                            window.navigateWithVinheta(href);
                        } else {
                            window.location.href = href;
                        }
                    }, 300);
                }
            });
        });

        // ESC key para fechar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeSidebar();
            }
        });
    }

    openSidebar() {
        this.isOpen = true;
        this.sidebar.classList.add('active');
        this.overlay.classList.add('active');
        this.menuButton.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Atualiza informações do usuário
        this.updateUserInfo();
    }

    closeSidebar() {
        this.isOpen = false;
        this.sidebar.classList.remove('active');
        this.overlay.classList.remove('active');
        this.menuButton.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggleSidebar() {
        if (this.isOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    updateUserInfo() {
        // Atualiza nome do usuário
        const usernameDisplay = document.getElementById('username-display');
        const sidebarUserName = document.getElementById('sidebar-user-name');
        const sidebarUserInitial = document.getElementById('sidebar-user-initial');

        if (usernameDisplay && sidebarUserName && sidebarUserInitial) {
            const username = usernameDisplay.textContent.replace('Olá, ', '').replace('Prof. ', '') || 'Usuário';
            sidebarUserName.textContent = username;
            sidebarUserInitial.textContent = username.charAt(0).toUpperCase();
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        if (window.applyTheme) {
            window.applyTheme(newTheme);
        } else {
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('saga-theme', newTheme);
        }
    }
}

// Inicializa o menu moderno
document.addEventListener('DOMContentLoaded', () => {
    // Aguarda um pouco para garantir que outros elementos foram carregados
    setTimeout(() => {
        window.modernSidebar = new ModernSidebar();
    }, 100);
});

// Função global para abrir o menu
window.openModernSidebar = () => {
    if (window.modernSidebar) {
        window.modernSidebar.openSidebar();
    }
};

// Função global para alternar tema
window.toggleSidebarTheme = () => {
    if (window.modernSidebar) {
        window.modernSidebar.toggleTheme();
    }
};
