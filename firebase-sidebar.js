// === SIDEBAR RETRÁTIL COM FIREBASE REAL ===

// Configuração Firebase (v9)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, onValue, push, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDhHGoe7GDJhMOjYSTbgqC7DHE2Dc_RR0M",
  authDomain: "saga-1d4e2.firebaseapp.com",
  databaseURL: "https://saga-1d4e2-default-rtdb.firebaseio.com",
  projectId: "saga-1d4e2",
  storageBucket: "saga-1d4e2.firebasestorage.app",
  messagingSenderId: "419315470764",
  appId: "1:419315470764:web:4e3fd28ca21f935bc52a09",
  measurementId: "G-SSBL21VWE3"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

class FirebaseSidebar {
    constructor() {
        this.isOpen = window.innerWidth > 1024; // Aberto em desktop, fechado em mobile
        this.currentUser = null;
        this.userData = null;
        this.init();
    }
    
    init() {
        this.createSidebarStructure();
        this.addStyles();
        this.addEventListeners();
        this.setupAuth();
    }
    
    createSidebarStructure() {
        // Verifica se já existe sidebar
        const existingSidebar = document.querySelector('.firebase-sidebar');
        if (existingSidebar) {
            existingSidebar.remove();
        }
        
        // Cria estrutura do sidebar
        const sidebar = document.createElement('nav');
        sidebar.className = 'firebase-sidebar';
        sidebar.innerHTML = `
            <div class="sidebar-header">
                <img src="../logo.png" alt="Saga Logo" class="sidebar-logo">
                <h2 class="sidebar-title">S.A.G.A</h2>
            </div>
            
            <div class="sidebar-menu" id="sidebar-menu">
                <!-- Menu será carregado dinamicamente -->
            </div>
            
            <div class="sidebar-footer">
                <div class="user-info" id="user-info">
                    <div class="user-avatar">👤</div>
                    <div class="user-details">
                        <span class="user-name">Carregando...</span>
                        <span class="user-role">...</span>
                    </div>
                </div>
                <button class="logout-btn" onclick="window.firebaseSidebar.logout()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16,17 21,12 16,7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    <span>Sair</span>
                </button>
            </div>
        `;
        
        // Adiciona botão toggle no header principal
        this.createToggleButton();
        
        // Insere sidebar no início do body
        document.body.insertBefore(sidebar, document.body.firstChild);
        
        // Cria overlay para mobile
        this.createOverlay();
        
        // Ajusta main content
        this.adjustMainContent();
    }
    
    createToggleButton() {
        const existingToggle = document.querySelector('.sidebar-toggle-btn');
        if (existingToggle) {
            existingToggle.remove();
        }
        
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'sidebar-toggle-btn';
        toggleBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
        `;
        
        // Procura por header existente
        const header = document.querySelector('.top-header, header');
        if (header) {
            header.insertBefore(toggleBtn, header.firstChild);
        }
    }
    
    createOverlay() {
        const existingOverlay = document.querySelector('.sidebar-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }
    
    adjustMainContent() {
        const mainContent = document.querySelector('.main-content, .container, main');
        if (mainContent && !mainContent.classList.contains('firebase-adjusted')) {
            mainContent.classList.add('firebase-adjusted');
        }
    }
    
    addStyles() {
        const existingStyles = document.querySelector('#firebase-sidebar-styles');
        if (existingStyles) {
            existingStyles.remove();
        }
        
        const style = document.createElement('style');
        style.id = 'firebase-sidebar-styles';
        style.textContent = `
            /* Sidebar Styles */
            .firebase-sidebar {
                position: fixed;
                left: 0;
                top: 0;
                width: 280px;
                height: 100vh;
                background: var(--surface-color, #1a1a1a);
                border-right: 1px solid var(--border-color, #2e2e2e);
                display: flex;
                flex-direction: column;
                z-index: 1000;
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
            }
            
            .firebase-sidebar.collapsed {
                transform: translateX(-280px);
            }
            
            .sidebar-header {
                padding: 2rem;
                border-bottom: 1px solid var(--border-color, #2e2e2e);
                display: flex;
                align-items: center;
                gap: 1rem;
                min-height: 80px;
            }
            
            .sidebar-logo {
                width: 40px;
                height: 40px;
                object-fit: contain;
                border-radius: 8px;
            }
            
            .sidebar-title {
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--text-primary, #f0f0f0);
                margin: 0;
            }
            
            .sidebar-menu {
                flex: 1;
                padding: 1rem 0;
                overflow-y: auto;
            }
            
            .menu-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem 2rem;
                color: var(--text-secondary, #a0a0a0);
                text-decoration: none;
                transition: all 0.3s ease;
                border-left: 3px solid transparent;
                cursor: pointer;
            }
            
            .menu-item:hover {
                background: var(--bg-secondary, #141414);
                color: var(--text-primary, #f0f0f0);
                border-left-color: var(--highlight-color, #ffffff);
            }
            
            .menu-item.active {
                background: var(--bg-secondary, #141414);
                color: var(--text-primary, #f0f0f0);
                border-left-color: #4CAF50;
                font-weight: 600;
            }
            
            .menu-item svg {
                flex-shrink: 0;
                width: 20px;
                height: 20px;
            }
            
            .sidebar-footer {
                padding: 1.5rem;
                border-top: 1px solid var(--border-color, #2e2e2e);
            }
            
            .user-info {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: var(--bg-secondary, #141414);
                border-radius: 12px;
                margin-bottom: 1rem;
            }
            
            .user-avatar {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #4CAF50, #45a049);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
            }
            
            .user-details {
                flex: 1;
                min-width: 0;
            }
            
            .user-name {
                display: block;
                font-weight: 600;
                color: var(--text-primary, #f0f0f0);
                font-size: 0.9rem;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .user-role {
                display: block;
                color: var(--text-secondary, #a0a0a0);
                font-size: 0.8rem;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .logout-btn {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                width: 100%;
                padding: 1rem;
                background: transparent;
                border: 1px solid var(--border-color, #2e2e2e);
                border-radius: 8px;
                color: var(--text-secondary, #a0a0a0);
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.9rem;
            }
            
            .logout-btn:hover {
                background: #ff4757;
                color: white;
                border-color: #ff4757;
            }
            
            /* Toggle Button */
            .sidebar-toggle-btn {
                display: none;
                background: transparent;
                border: 1px solid var(--border-color, #2e2e2e);
                border-radius: 8px;
                width: 44px;
                height: 44px;
                cursor: pointer;
                color: var(--text-primary, #f0f0f0);
                transition: all 0.3s ease;
                margin-right: 1rem;
                align-items: center;
                justify-content: center;
            }
            
            .sidebar-toggle-btn:hover {
                background: var(--bg-secondary, #141414);
                border-color: var(--highlight-color, #ffffff);
            }
            
            /* Overlay */
            .sidebar-overlay {
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
            }
            
            .sidebar-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            
            /* Main Content Adjustment */
            .firebase-adjusted {
                margin-left: 280px;
                transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .firebase-adjusted.expanded {
                margin-left: 0;
            }
            
            /* Responsive */
            @media (max-width: 1024px) {
                .sidebar-toggle-btn {
                    display: flex;
                }
                
                .firebase-sidebar {
                    transform: translateX(-280px);
                }
                
                .firebase-sidebar.mobile-open {
                    transform: translateX(0);
                }
                
                .firebase-adjusted {
                    margin-left: 0;
                }
            }
            
            @media (max-width: 768px) {
                .firebase-sidebar {
                    width: 100vw;
                }
                
                .firebase-sidebar.mobile-open {
                    transform: translateX(0);
                }
                
                .sidebar-header {
                    padding: 1.5rem;
                }
                
                .sidebar-title {
                    font-size: 1.25rem;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    addEventListeners() {
        // Toggle button
        document.addEventListener('click', (e) => {
            if (e.target.closest('.sidebar-toggle-btn')) {
                this.toggle();
            }
        });
        
        // Overlay click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('sidebar-overlay')) {
                this.close();
            }
        });
        
        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen && window.innerWidth <= 1024) {
                this.close();
            }
        });
        
        // Resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Menu items
        document.addEventListener('click', (e) => {
            const menuItem = e.target.closest('.menu-item');
            if (menuItem && menuItem.dataset.page) {
                this.navigateToPage(menuItem.dataset.page);
            }
        });
    }
    
    setupAuth() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.currentUser = user;
                this.loadUserData();
            } else {
                this.redirectToLogin();
            }
        });
    }
    
    loadUserData() {
        if (!this.currentUser) return;
        
        const userRef = ref(database, `users/${this.currentUser.uid}`);
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                this.userData = data;
                this.updateUserInfo();
                this.loadMenu();
                this.loadPageData();
            }
        });
    }
    
    updateUserInfo() {
        const userInfo = document.getElementById('user-info');
        if (!userInfo || !this.userData) return;
        
        const userName = userInfo.querySelector('.user-name');
        const userRole = userInfo.querySelector('.user-role');
        
        if (userName) userName.textContent = this.userData.nome || this.currentUser.email;
        if (userRole) {
            if (this.userData.tipo === 'professor') {
                userRole.textContent = `${this.userData.disciplina || 'Professor'}`;
            } else {
                userRole.textContent = this.userData.turma || 'Aluno';
            }
        }
    }
    
    loadMenu() {
        const menuContainer = document.getElementById('sidebar-menu');
        if (!menuContainer || !this.userData) return;
        
        const currentPage = this.getCurrentPage();
        let menuItems = [];
        
        if (this.userData.tipo === 'aluno') {
            menuItems = [
                { icon: 'home', text: 'Hub', page: 'alunoinicio.html' },
                { icon: 'dashboard', text: 'Dashboard', page: 'alunodash.html' },
                { icon: 'tasks', text: 'Atividades', page: 'alunoatvi.html' },
                { icon: 'messages', text: 'Comunicados', page: 'alunocomu.html' }
            ];
        } else if (this.userData.tipo === 'professor') {
            menuItems = [
                { icon: 'dashboard', text: 'Dashboard', page: 'professordash.html' },
                { icon: 'tasks', text: 'Atividades', page: 'professoratividades.html' },
                { icon: 'messages', text: 'Comunicados', page: 'professorcomunicados.html' },
                { icon: 'users', text: 'Alunos', page: 'professoralunos.html' }
            ];
        }
        
        const menuHTML = menuItems.map(item => `
            <a class="menu-item ${currentPage === item.page ? 'active' : ''}" data-page="${item.page}">
                ${this.getIconSVG(item.icon)}
                <span>${item.text}</span>
            </a>
        `).join('');
        
        menuContainer.innerHTML = menuHTML;
    }
    
    getIconSVG(iconName) {
        const icons = {
            home: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>',
            dashboard: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/></svg>',
            tasks: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
            messages: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
            users: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
        };
        return icons[iconName] || icons.dashboard;
    }
    
    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        return filename || 'index.html';
    }
    
    loadPageData() {
        const currentPage = this.getCurrentPage();
        
        if (currentPage === 'alunoinicio.html') {
            this.loadAlunoHub();
        } else if (currentPage === 'professordash.html') {
            this.loadProfessorDash();
        } else if (currentPage === 'alunoatvi.html') {
            this.loadAtividades();
        } else if (currentPage === 'alunocomu.html') {
            this.loadComunicados();
        }
    }
    
    loadAlunoHub() {
        if (this.userData?.tipo !== 'aluno') return;
        
        // Carrega atividades pendentes
        const atividadesRef = ref(database, 'atividades');
        onValue(atividadesRef, (snapshot) => {
            const atividades = snapshot.val() || {};
            const atividadesPendentes = Object.values(atividades).filter(ativ => 
                ativ.turma === this.userData.turma && 
                ativ.status === 'ativa' &&
                !ativ.alunosQueEntregaram?.includes(this.currentUser.uid)
            ).length;
            
            const pendingElement = document.querySelector('#pending-activities-value');
            if (pendingElement) {
                pendingElement.textContent = atividadesPendentes;
            }
        });
        
        // Carrega comunicados não lidos
        const comunicadosRef = ref(database, 'comunicados');
        onValue(comunicadosRef, (snapshot) => {
            const comunicados = snapshot.val() || {};
            const naoLidos = Object.values(comunicados).filter(com => 
                !com.alunosQueViram?.includes(this.currentUser.uid)
            ).length;
            
            const unreadElement = document.querySelector('#unread-comms-value');
            if (unreadElement) {
                unreadElement.textContent = naoLidos;
            }
        });
    }
    
    loadProfessorDash() {
        if (this.userData?.tipo !== 'professor') return;
        
        // Carrega estatísticas do professor
        const atividadesRef = ref(database, 'atividades');
        onValue(atividadesRef, (snapshot) => {
            const atividades = snapshot.val() || {};
            const minhasAtividades = Object.values(atividades).filter(ativ => 
                ativ.professorId === this.currentUser.uid
            );
            
            const createdElement = document.querySelector('#created-activities-value');
            const activeElement = document.querySelector('#active-activities-value');
            
            if (createdElement) {
                createdElement.textContent = minhasAtividades.length;
            }
            if (activeElement) {
                activeElement.textContent = minhasAtividades.filter(a => a.status === 'ativa').length;
            }
        });
    }
    
    loadAtividades() {
        if (this.userData?.tipo !== 'aluno') return;
        
        const container = document.getElementById('atividades-container');
        if (!container) return;
        
        const atividadesRef = ref(database, 'atividades');
        onValue(atividadesRef, (snapshot) => {
            const atividades = snapshot.val() || {};
            const minhasAtividades = Object.entries(atividades).filter(([id, ativ]) => 
                ativ.turma === this.userData.turma
            );
            
            container.innerHTML = '';
            
            if (minhasAtividades.length === 0) {
                container.innerHTML = `
                    <div class="no-activities">
                        <h3>Nenhuma atividade encontrada</h3>
                        <p>Você está em dia com suas tarefas!</p>
                    </div>
                `;
                return;
            }
            
            minhasAtividades.forEach(([id, atividade]) => {
                const card = this.createAtividadeCard(id, atividade);
                container.appendChild(card);
            });
        });
    }
    
    createAtividadeCard(id, atividade) {
        const jaViu = atividade.alunosQueViram?.includes(this.currentUser.uid) || false;
        const jaEntregou = atividade.alunosQueEntregaram?.includes(this.currentUser.uid) || false;
        
        const card = document.createElement('div');
        card.className = 'atividade-card';
        card.innerHTML = `
            <div class="atividade-header">
                <h3>${atividade.titulo || 'Sem título'}</h3>
                <span class="atividade-status ${jaEntregou ? 'entregue' : 'pendente'}">
                    ${jaEntregou ? '✅ Entregue' : '⏳ Pendente'}
                </span>
            </div>
            <p class="atividade-descricao">${atividade.descricao || 'Sem descrição'}</p>
            <div class="atividade-meta">
                <span class="atividade-professor">👨‍🏫 ${atividade.professor || 'Professor'}</span>
                <span class="atividade-data">📅 ${atividade.dataEntrega ? new Date(atividade.dataEntrega).toLocaleDateString('pt-BR') : 'Sem data'}</span>
            </div>
            <div class="atividade-actions">
                ${!jaViu ? `<button onclick="window.firebaseSidebar.marcarComoVisto('${id}')">👁️ Marcar como visto</button>` : '<span class="ja-visto">✅ Já visualizada</span>'}
                ${!jaEntregou ? `<button onclick="window.firebaseSidebar.entregarAtividade('${id}')">📤 Entregar</button>` : ''}
            </div>
        `;
        return card;
    }
    
    marcarComoVisto(atividadeId) {
        const atividadeRef = ref(database, `atividades/${atividadeId}/alunosQueViram`);
        const currentViews = [];
        
        onValue(atividadeRef, (snapshot) => {
            const views = snapshot.val() || [];
            if (!views.includes(this.currentUser.uid)) {
                views.push(this.currentUser.uid);
                set(atividadeRef, views);
            }
        }, { onlyOnce: true });
    }
    
    entregarAtividade(atividadeId) {
        if (confirm('Confirma a entrega desta atividade?')) {
            const atividadeRef = ref(database, `atividades/${atividadeId}/alunosQueEntregaram`);
            
            onValue(atividadeRef, (snapshot) => {
                const entregas = snapshot.val() || [];
                if (!entregas.includes(this.currentUser.uid)) {
                    entregas.push(this.currentUser.uid);
                    set(atividadeRef, entregas);
                    alert('Atividade entregue com sucesso!');
                }
            }, { onlyOnce: true });
        }
    }
    
    toggle() {
        this.isOpen = !this.isOpen;
        this.updateSidebarState();
    }
    
    open() {
        this.isOpen = true;
        this.updateSidebarState();
    }
    
    close() {
        this.isOpen = false;
        this.updateSidebarState();
    }
    
    updateSidebarState() {
        const sidebar = document.querySelector('.firebase-sidebar');
        const mainContent = document.querySelector('.firebase-adjusted');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (!sidebar) return;
        
        if (window.innerWidth <= 1024) {
            // Mobile behavior
            sidebar.classList.toggle('mobile-open', this.isOpen);
            if (overlay) overlay.classList.toggle('active', this.isOpen);
        } else {
            // Desktop behavior
            sidebar.classList.toggle('collapsed', !this.isOpen);
            if (mainContent) mainContent.classList.toggle('expanded', !this.isOpen);
        }
    }
    
    handleResize() {
        if (window.innerWidth > 1024) {
            this.isOpen = true;
        } else {
            this.isOpen = false;
        }
        this.updateSidebarState();
    }
    
    navigateToPage(page) {
        if (window.navigateWithVinheta) {
            window.navigateWithVinheta(page);
        } else {
            window.location.href = page;
        }
        
        // Fecha sidebar em mobile após navegação
        if (window.innerWidth <= 1024) {
            this.close();
        }
    }
    
    logout() {
        if (confirm('Deseja realmente sair?')) {
            auth.signOut().then(() => {
                window.location.href = '../login.html';
            });
        }
    }
    
    redirectToLogin() {
        const currentPath = window.location.pathname;
        if (!currentPath.includes('login.html')) {
            const loginPath = currentPath.includes('/aluno/') || currentPath.includes('/professor/') ? 
                '../login.html' : 'login.html';
            window.location.href = loginPath;
        }
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.firebaseSidebar = new FirebaseSidebar();
    }, 100);
});

export { FirebaseSidebar };
