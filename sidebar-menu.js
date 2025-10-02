// === MENU LATERAL (SIDEBAR) S.A.G.A. ===
// Menu lateral com acesso rápido a todas as funcionalidades

class SidebarMenu {
    constructor() {
        this.sidebar = null;
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createSidebar();
        this.setupEventListeners();
    }

    createSidebar() {
        if (document.getElementById('sidebar-menu')) return;

        console.log('Criando menu lateral...');

        // Cria o overlay
        const overlay = document.createElement('div');
        overlay.id = 'sidebar-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        `;

        // Cria a sidebar
        this.sidebar = document.createElement('div');
        this.sidebar.id = 'sidebar-menu';
        this.sidebar.style.cssText = `
            position: fixed;
            top: 0;
            left: -300px;
            width: 300px;
            height: 100vh;
            background: var(--surface-color);
            border-right: 1px solid var(--border-color);
            z-index: 1000;
            transition: left 0.3s ease;
            overflow-y: auto;
            box-shadow: 2px 0 10px var(--shadow-color);
        `;

        // Determina o tipo de usuário
        const isProfessor = window.location.pathname.includes('professor');
        const navItems = isProfessor ? this.getProfessorNavItems() : this.getAlunoNavItems();

        this.sidebar.innerHTML = `
            <div style="padding: 2rem 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2 style="margin: 0; font-size: 1.5rem; font-weight: 700;">Menu</h2>
                    <button id="close-sidebar" style="
                        background: none; border: none; font-size: 1.5rem; 
                        cursor: pointer; color: var(--text-secondary);
                        padding: 0.5rem; border-radius: 50%;
                        transition: all 0.3s ease;
                    ">×</button>
                </div>
                
                <nav>
                    ${navItems.map(item => `
                        <div class="sidebar-item" data-href="${item.href}" style="
                            display: flex; align-items: center; gap: 1rem;
                            padding: 1rem; margin-bottom: 0.5rem;
                            border-radius: 8px; cursor: pointer;
                            transition: all 0.3s ease;
                            border: 1px solid transparent;
                        ">
                            <span style="font-size: 1.5rem;">${item.icon}</span>
                            <div>
                                <div style="font-weight: 600; margin-bottom: 0.25rem;">${item.text}</div>
                                <div style="font-size: 0.8rem; color: var(--text-secondary);">${item.description}</div>
                            </div>
                        </div>
                    `).join('')}
                </nav>
            </div>
        `;

        // Adiciona estilos CSS
        const style = document.createElement('style');
        style.textContent = `
            .sidebar-item:hover {
                background: var(--bg-primary) !important;
                border-color: var(--highlight-color) !important;
                transform: translateX(5px);
            }
            #close-sidebar:hover {
                background: var(--shadow-color);
                color: var(--text-primary);
            }
            .sidebar-item.active {
                background: var(--highlight-color) !important;
                color: var(--bg-primary) !important;
            }
        `;
        document.head.appendChild(style);

        // Adiciona ao body
        document.body.appendChild(overlay);
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

    setupEventListeners() {
        // Botão de fechar
        const closeBtn = document.getElementById('close-sidebar');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeSidebar());
        }

        // Overlay
        const overlay = document.getElementById('sidebar-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeSidebar());
        }

        // Itens do menu
        const items = document.querySelectorAll('.sidebar-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                const href = item.dataset.href;
                if (href && href !== '#') {
                    if (window.navigateWithVinheta) {
                        window.navigateWithVinheta(href);
                    } else {
                        window.location.href = href;
                    }
                }
            });
        });
    }

    openSidebar() {
        this.isOpen = true;
        this.sidebar.style.left = '0';
        document.getElementById('sidebar-overlay').style.opacity = '1';
        document.getElementById('sidebar-overlay').style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
    }

    closeSidebar() {
        this.isOpen = false;
        this.sidebar.style.left = '-300px';
        document.getElementById('sidebar-overlay').style.opacity = '0';
        document.getElementById('sidebar-overlay').style.visibility = 'hidden';
        document.body.style.overflow = '';
    }

    toggleSidebar() {
        if (this.isOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }
}

// Inicializa o menu lateral
document.addEventListener('DOMContentLoaded', () => {
    window.sidebarMenu = new SidebarMenu();
});

// Função global para abrir o menu
window.openSidebar = () => {
    if (window.sidebarMenu) {
        window.sidebarMenu.openSidebar();
    }
};
