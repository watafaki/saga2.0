/* === SAGA COMPONENTS SYSTEM 1.0 === */
/* Sistema de componentes moderno para máxima reutilização e organização */

class SagaComponents {
    constructor() {
        this.sidebar = null;
        this.overlay = null;
        this.currentUser = null;
        this.currentTheme = 'dark';
        this.isMobile = window.innerWidth <= 1024;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeTheme();
        this.createComponents();
        this.initializeAuth();
    }

    /* === GERENCIAMENTO DE TEMA === */
    initializeTheme() {
        const savedTheme = localStorage.getItem('saga-theme') || 'dark';
        this.applyTheme(savedTheme);
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('saga-theme', theme);
        
        // Atualizar logo baseada no tema
        const logos = document.querySelectorAll('.sidebar-logo, .saga-logo');
        logos.forEach(logo => {
            if (theme === 'light') {
                logo.src = logo.src.includes('aluno/') ? '../logoinvertido.png' : 
                          logo.src.includes('professor/') ? '../logoinvertido.png' : 'logoinvertido.png';
            } else {
                logo.src = logo.src.includes('aluno/') ? '../logo.png' : 
                          logo.src.includes('professor/') ? '../logo.png' : 'logo.png';
            }
        });

        // Atualizar botões de tema
        this.updateThemeButtons();
        
        // Salvar no Firebase se usuário logado
        if (this.currentUser) {
            this.saveUserPreference('theme', theme);
        }
    }

    updateThemeButtons() {
        const darkBtn = document.getElementById('theme-toggle-dark');
        const lightBtn = document.getElementById('theme-toggle-light');
        
        if (darkBtn && lightBtn) {
            darkBtn.classList.toggle('active', this.currentTheme === 'dark');
            lightBtn.classList.toggle('active', this.currentTheme === 'light');
        }
    }

    /* === GERENCIAMENTO DA SIDEBAR === */
    createSidebar() {
        const existingSidebar = document.querySelector('.saga-sidebar');
        if (existingSidebar) return;

        const sidebarHTML = this.getSidebarHTML();
        document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
        
        this.sidebar = document.querySelector('.saga-sidebar');
        this.setupSidebarEvents();
        this.loadUserInfo();
    }

    getSidebarHTML() {
        const currentPage = window.location.pathname;
        const isStudent = currentPage.includes('/aluno/');
        const isTeacher = currentPage.includes('/professor/');
        
        const logoPath = isStudent || isTeacher ? '../logo.png' : 'logo.png';
        const menuItems = isStudent ? this.getStudentMenuItems() : 
                         isTeacher ? this.getTeacherMenuItems() : 
                         this.getDefaultMenuItems();

        return `
            <div class="saga-overlay" id="saga-overlay"></div>
            <nav class="saga-sidebar" id="saga-sidebar">
                <div class="sidebar-header">
                    <img src="${logoPath}" alt="Saga Logo" class="sidebar-logo">
                    <span class="sidebar-logo-text">S.A.G.A</span>
                    <button class="sidebar-toggle" id="sidebar-toggle" aria-label="Toggle sidebar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                </div>
                
                <div class="sidebar-menu">
                    ${menuItems}
                </div>
                
                <div class="sidebar-footer">
                    <div class="sidebar-user">
                        <div class="sidebar-user-avatar" id="user-avatar">👤</div>
                        <div class="sidebar-user-info">
                            <div class="sidebar-user-name sidebar-text" id="user-name">Carregando...</div>
                            <div class="sidebar-user-role sidebar-text" id="user-role">...</div>
                        </div>
                    </div>
                    <button class="saga-button ghost" onclick="sagaComponents.logout()" style="width: 100%;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16,17 21,12 16,7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        <span class="sidebar-text">Sair</span>
                    </button>
                </div>
            </nav>
        `;
    }

    getStudentMenuItems() {
        const currentPage = window.location.pathname;
        return `
            <div class="sidebar-menu-section">
                <div class="sidebar-menu-title sidebar-text">Principal</div>
                <a href="alunoinicio.html" class="sidebar-menu-item ${currentPage.includes('alunoinicio') ? 'active' : ''}" data-tooltip="Início">
                    <svg class="sidebar-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9,22 9,12 15,12 15,22"/>
                    </svg>
                    <span class="sidebar-text">Início</span>
                </a>
                <a href="alunodash.html" class="sidebar-menu-item ${currentPage.includes('alunodash') ? 'active' : ''}" data-tooltip="Notas">
                    <svg class="sidebar-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                    </svg>
                    <span class="sidebar-text">Notas</span>
                </a>
            </div>
            <div class="sidebar-menu-section">
                <div class="sidebar-menu-title sidebar-text">Atividades</div>
                <a href="alunoatvi.html" class="sidebar-menu-item ${currentPage.includes('alunoatvi') ? 'active' : ''}" data-tooltip="Atividades">
                    <svg class="sidebar-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10,9 9,9 8,9"/>
                    </svg>
                    <span class="sidebar-text">Atividades</span>
                </a>
                <a href="alunoexercicios.html" class="sidebar-menu-item ${currentPage.includes('alunoexercicios') ? 'active' : ''}" data-tooltip="Exercícios">
                    <svg class="sidebar-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="16 18 22 12 16 6"/>
                        <polyline points="8 6 2 12 8 18"/>
                    </svg>
                    <span class="sidebar-text">Exercícios</span>
                </a>
                <a href="alunocrono.html" class="sidebar-menu-item ${currentPage.includes('alunocrono') ? 'active' : ''}" data-tooltip="Calendário">
                    <svg class="sidebar-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span class="sidebar-text">Calendário</span>
                </a>
            </div>
            <div class="sidebar-menu-section">
                <div class="sidebar-menu-title sidebar-text">Comunicação</div>
                <a href="alunocomu.html" class="sidebar-menu-item ${currentPage.includes('alunocomu') ? 'active' : ''}" data-tooltip="Comunicados">
                    <svg class="sidebar-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <span class="sidebar-text">Comunicados</span>
                </a>
                <a href="alunochat.html" class="sidebar-menu-item ${currentPage.includes('alunochat') ? 'active' : ''}" data-tooltip="Chat">
                    <svg class="sidebar-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                    <span class="sidebar-text">Chat</span>
                </a>
                <a href="alunosuporte.html" class="sidebar-menu-item ${currentPage.includes('alunosuporte') ? 'active' : ''}" data-tooltip="Suporte">
                    <svg class="sidebar-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    <span class="sidebar-text">Suporte</span>
                </a>
            </div>
            <div class="sidebar-menu-section">
                <div class="sidebar-menu-title sidebar-text">Especial</div>
                <a href="alunonexus.html" class="sidebar-menu-item ${currentPage.includes('alunonexus') ? 'active' : ''}" data-tooltip="Nexus AI">
                    <svg class="sidebar-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
                    </svg>
                    <span class="sidebar-text">Nexus AI</span>
                </a>
            </div>
        `;
    }

    getTeacherMenuItems() {
        const currentPage = window.location.pathname;
        return `
            <div class="sidebar-menu-section">
                <div class="sidebar-menu-title sidebar-text">Principal</div>
                <a href="professordash.html" class="sidebar-menu-item ${currentPage.includes('professordash') ? 'active' : ''}" data-tooltip="Dashboard">
                    <svg class="sidebar-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9,22 9,12 15,12 15,22"/>
                    </svg>
                    <span class="sidebar-text">Dashboard</span>
                </a>
            </div>
            <div class="sidebar-menu-section">
                <div class="sidebar-menu-title sidebar-text">Gestão</div>
                <a href="professoratividades.html" class="sidebar-menu-item ${currentPage.includes('professoratividades') ? 'active' : ''}" data-tooltip="Atividades">
                    <svg class="sidebar-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10,9 9,9 8,9"/>
                    </svg>
                    <span class="sidebar-text">Atividades</span>
                </a>
                <a href="professorcomunicados.html" class="sidebar-menu-item ${currentPage.includes('professorcomunicados') ? 'active' : ''}" data-tooltip="Comunicados">
                    <svg class="sidebar-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <span class="sidebar-text">Comunicados</span>
                </a>
                <a href="professoralunos.html" class="sidebar-menu-item ${currentPage.includes('professoralunos') ? 'active' : ''}" data-tooltip="Alunos">
                    <svg class="sidebar-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span class="sidebar-text">Alunos</span>
                </a>
            </div>
        `;
    }

    getDefaultMenuItems() {
        return `
            <div class="sidebar-menu-section">
                <div class="sidebar-menu-title sidebar-text">Principal</div>
                <a href="#" class="sidebar-menu-item active">
                    <svg class="sidebar-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9,22 9,12 15,12 15,22"/>
                    </svg>
                    <span class="sidebar-text">Início</span>
                </a>
            </div>
        `;
    }

    setupSidebarEvents() {
        const toggleBtn = document.getElementById('sidebar-toggle');
        const overlay = document.getElementById('saga-overlay');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleSidebar());
        }
        
        if (overlay) {
            overlay.addEventListener('click', () => this.closeSidebar());
        }
        
        // Fechar sidebar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSidebar();
            }
        });
        
        // Responsividade
        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 1024;
            
            if (wasMobile !== this.isMobile) {
                this.handleResponsiveChange();
            }
        });
    }

    toggleSidebar() {
        if (this.isMobile) {
            this.sidebar.classList.toggle('mobile-open');
            document.getElementById('saga-overlay').classList.toggle('active');
        } else {
            this.sidebar.classList.toggle('collapsed');
            const main = document.querySelector('.saga-main');
            if (main) main.classList.toggle('expanded');
        }
    }

    closeSidebar() {
        if (this.isMobile) {
            this.sidebar.classList.remove('mobile-open');
            document.getElementById('saga-overlay').classList.remove('active');
        }
    }

    handleResponsiveChange() {
        if (!this.isMobile) {
            // Desktop: limpar classes mobile
            this.sidebar.classList.remove('mobile-open');
            document.getElementById('saga-overlay').classList.remove('active');
        } else {
            // Mobile: limpar classes desktop
            this.sidebar.classList.remove('collapsed');
            const main = document.querySelector('.saga-main');
            if (main) main.classList.remove('expanded');
        }
    }

    /* === GERENCIAMENTO DE HEADER === */
    createHeader() {
        const existingHeader = document.querySelector('.saga-header');
        if (existingHeader) return;

        const currentPage = window.location.pathname;
        const pageName = this.getPageName(currentPage);
        
        const headerHTML = `
            <header class="saga-header">
                <div class="saga-header-left">
                    <div>
                        <h1 class="saga-header-title">${pageName.title}</h1>
                        ${pageName.subtitle ? `<p class="saga-header-subtitle">${pageName.subtitle}</p>` : ''}
                    </div>
                </div>
                <div class="saga-header-right">
                    <span id="current-user-display" class="saga-text-secondary"></span>
                    <button class="saga-button icon-only ghost" id="theme-toggle-dark" title="Tema Escuro">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                    </button>
                    <button class="saga-button icon-only ghost" id="theme-toggle-light" title="Tema Claro">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="5"/>
                            <line x1="12" y1="1" x2="12" y2="3"/>
                            <line x1="12" y1="21" x2="12" y2="23"/>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                            <line x1="1" y1="12" x2="3" y2="12"/>
                            <line x1="21" y1="12" x2="23" y2="12"/>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                        </svg>
                    </button>
                </div>
            </header>
        `;

        const main = document.querySelector('.saga-main');
        if (main) {
            main.insertAdjacentHTML('afterbegin', headerHTML);
        }

        this.setupHeaderEvents();
    }

    setupHeaderEvents() {
        const darkBtn = document.getElementById('theme-toggle-dark');
        const lightBtn = document.getElementById('theme-toggle-light');
        
        if (darkBtn) darkBtn.addEventListener('click', () => this.applyTheme('dark'));
        if (lightBtn) lightBtn.addEventListener('click', () => this.applyTheme('light'));
    }

    getPageName(currentPage) {
        const pageNames = {
            'alunoinicio': { title: 'Dashboard', subtitle: 'Bem-vindo ao seu espaço de aprendizagem' },
            'alunodash': { title: 'Notas', subtitle: 'Acompanhe seu desempenho acadêmico' },
            'alunoatvi': { title: 'Atividades', subtitle: 'Suas atividades e tarefas' },
            'alunoexercicios': { title: 'Exercícios', subtitle: 'Pratique e aprenda' },
            'alunocrono': { title: 'Calendário', subtitle: 'Organize seus estudos' },
            'alunocomu': { title: 'Comunicados', subtitle: 'Informações importantes' },
            'alunochat': { title: 'Chat', subtitle: 'Converse com colegas e professores' },
            'alunosuporte': { title: 'Suporte', subtitle: 'Estamos aqui para ajudar' },
            'alunonexus': { title: 'Nexus AI', subtitle: 'Seu assistente de estudos inteligente' },
            
            'professordash': { title: 'Dashboard', subtitle: 'Painel de controle do professor' },
            'professoratividades': { title: 'Atividades', subtitle: 'Gerencie atividades e tarefas' },
            'professorcomunicados': { title: 'Comunicados', subtitle: 'Comunique-se com os alunos' },
            'professoralunos': { title: 'Alunos', subtitle: 'Acompanhe o progresso dos alunos' },
        };

        for (const [page, info] of Object.entries(pageNames)) {
            if (currentPage.includes(page)) {
                return info;
            }
        }

        return { title: 'SAGA', subtitle: 'Sistema Avançado de Gestão Acadêmica' };
    }

    /* === COMPONENTES UTILITÁRIOS === */
    createComponents() {
        // Verificar se já existe o layout principal
        if (!document.querySelector('.saga-layout')) {
            document.body.classList.add('saga-layout');
        }

        // Criar sidebar
        this.createSidebar();
        
        // Criar/atualizar main content
        this.createMainContent();
        
        // Criar header
        this.createHeader();
    }

    createMainContent() {
        let main = document.querySelector('.saga-main');
        if (!main) {
            main = document.createElement('main');
            main.className = 'saga-main';
            
            // Mover todo o conteúdo existente para dentro do main
            const bodyChildren = Array.from(document.body.children);
            bodyChildren.forEach(child => {
                if (!child.classList.contains('saga-sidebar') && 
                    !child.classList.contains('saga-overlay')) {
                    main.appendChild(child);
                }
            });
            
            document.body.appendChild(main);
        }
    }

    /* === AUTENTICAÇÃO E USUÁRIO === */
    initializeAuth() {
        // Configuração Firebase será feita externamente
        // Este método apenas prepara a estrutura
        this.setupAuthStateListener();
    }

    setupAuthStateListener() {
        // Aguardar Firebase estar disponível
        if (typeof firebase !== 'undefined' && firebase.auth) {
            firebase.auth().onAuthStateChanged((user) => {
                this.currentUser = user;
                this.loadUserInfo();
                if (user) {
                    this.loadUserPreferences();
                }
            });
        }
    }

    loadUserInfo() {
        if (!this.currentUser) return;

        const userNameElement = document.getElementById('user-name');
        const userRoleElement = document.getElementById('user-role');
        const userAvatarElement = document.getElementById('user-avatar');
        const currentUserDisplay = document.getElementById('current-user-display');

        if (this.currentUser.email) {
            const emailPrefix = this.currentUser.email.split('@')[0];
            const isTeacher = this.currentUser.email.includes('professor');
            
            const displayName = isTeacher ? `Prof. ${emailPrefix}` : emailPrefix;
            const role = isTeacher ? 'Professor' : 'Aluno';
            const avatar = isTeacher ? '👨‍🏫' : '👨‍🎓';

            if (userNameElement) userNameElement.textContent = displayName;
            if (userRoleElement) userRoleElement.textContent = role;
            if (userAvatarElement) userAvatarElement.textContent = avatar;
            if (currentUserDisplay) currentUserDisplay.textContent = displayName;
        }
    }

    loadUserPreferences() {
        if (!this.currentUser || !firebase.database) return;

        const userRef = firebase.database().ref(`users/${this.currentUser.uid}/preferences`);
        userRef.once('value').then((snapshot) => {
            const prefs = snapshot.val();
            if (prefs && prefs.theme) {
                this.applyTheme(prefs.theme);
            }
        }).catch((error) => {
            console.warn('Erro ao carregar preferências:', error);
        });
    }

    saveUserPreference(key, value) {
        if (!this.currentUser || !firebase.database) return;

        const userRef = firebase.database().ref(`users/${this.currentUser.uid}/preferences`);
        userRef.update({
            [key]: value,
            lastUpdated: firebase.database.ServerValue.TIMESTAMP
        }).catch((error) => {
            console.warn('Erro ao salvar preferência:', error);
        });
    }

    logout() {
        if (confirm('Deseja realmente sair?')) {
            if (firebase && firebase.auth) {
                firebase.auth().signOut().then(() => {
                    window.location.href = window.location.pathname.includes('/aluno/') || 
                                         window.location.pathname.includes('/professor/') ? 
                                         '../login.html' : 'login.html';
                });
            }
        }
    }

    /* === UTILITÁRIOS === */
    setupEventListeners() {
        // Eventos globais
        document.addEventListener('DOMContentLoaded', () => {
            this.createComponents();
        });
    }

    /* === MÉTODOS PÚBLICOS PARA COMPONENTES === */
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `saga-toast saga-toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Animação de entrada
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remover automaticamente
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    createModal(title, content, actions = []) {
        const modal = document.createElement('div');
        modal.className = 'saga-modal-backdrop';
        modal.innerHTML = `
            <div class="saga-modal">
                <div class="saga-modal-header">
                    <h3>${title}</h3>
                    <button class="saga-modal-close" onclick="this.closest('.saga-modal-backdrop').remove()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="saga-modal-content">${content}</div>
                <div class="saga-modal-actions">
                    ${actions.map(action => `<button class="saga-button ${action.type || 'secondary'}" onclick="${action.onclick}">${action.text}</button>`).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 100);
        
        return modal;
    }
}

// Inicializar automaticamente
let sagaComponents;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        sagaComponents = new SagaComponents();
    });
} else {
    sagaComponents = new SagaComponents();
}

// Expor globalmente para compatibilidade
window.sagaComponents = sagaComponents;
