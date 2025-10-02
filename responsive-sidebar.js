// === SIDEBAR RESPONSIVO SAGA ===

class ResponsiveSidebar {
    constructor() {
        this.isOpen = true;
        this.init();
    }
    
    init() {
        this.createToggleButton();
        this.addEventListeners();
        this.updateSidebarState();
        this.loadUserData();
    }
    
    createToggleButton() {
        // Adiciona botão toggle no header
        const header = document.querySelector('.top-header');
        if (!header) return;
        
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'sidebar-toggle';
        toggleBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
        `;
        
        // Insere o botão no início do header
        header.insertBefore(toggleBtn, header.firstChild);
        
        // Adiciona estilos CSS
        this.addToggleStyles();
    }
    
    addToggleStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .sidebar-toggle {
                display: none;
                background: transparent;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                width: 44px;
                height: 44px;
                cursor: pointer;
                color: var(--text-primary);
                transition: all 0.3s ease;
                margin-right: 1rem;
            }
            
            .sidebar-toggle:hover {
                background: var(--bg-secondary);
                border-color: var(--highlight-color);
            }
            
            .sidebar-collapsed {
                transform: translateX(-280px);
            }
            
            .main-content-expanded {
                margin-left: 0;
            }
            
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
            
            /* Responsivo */
            @media (max-width: 1024px) {
                .sidebar-toggle {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .sidebar {
                    transform: translateX(-280px);
                    transition: transform 0.3s ease;
                    z-index: 1001;
                }
                
                .sidebar.mobile-open {
                    transform: translateX(0);
                }
                
                .main-content {
                    margin-left: 0;
                }
                
                .top-header h1 {
                    font-size: 1.5rem;
                }
                
                .header-info {
                    display: none;
                }
            }
            
            @media (max-width: 768px) {
                .dashboard-grid {
                    grid-template-columns: 1fr;
                    padding: 1rem;
                }
                
                .top-header {
                    padding: 1rem;
                }
                
                .top-header h1 {
                    font-size: 1.25rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    addEventListeners() {
        // Toggle button
        document.addEventListener('click', (e) => {
            if (e.target.closest('.sidebar-toggle')) {
                this.toggle();
            }
        });
        
        // Overlay click (mobile)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('sidebar-overlay')) {
                this.close();
            }
        });
        
        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && window.innerWidth <= 1024) {
                this.close();
            }
        });
        
        // Resize window
        window.addEventListener('resize', () => {
            this.handleResize();
        });
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
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        const overlay = document.querySelector('.sidebar-overlay') || this.createOverlay();
        
        if (!sidebar || !mainContent) return;
        
        if (window.innerWidth <= 1024) {
            // Mobile behavior
            sidebar.classList.toggle('mobile-open', this.isOpen);
            overlay.classList.toggle('active', this.isOpen);
        } else {
            // Desktop behavior
            sidebar.classList.toggle('sidebar-collapsed', !this.isOpen);
            mainContent.classList.toggle('main-content-expanded', !this.isOpen);
        }
    }
    
    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
        return overlay;
    }
    
    handleResize() {
        if (window.innerWidth > 1024) {
            this.isOpen = true;
        }
        this.updateSidebarState();
    }
    
    loadUserData() {
        // Carrega dados do usuário atual
        const currentUser = window.SagaData?.getCurrentUser();
        if (!currentUser || !window.SagaData) return;
        
        const userData = window.SagaData.usuarios[currentUser];
        if (!userData) return;
        
        // Atualiza nome do usuário no header
        const userName = document.querySelector('.user-name');
        const userClass = document.querySelector('.user-class');
        
        if (userName) userName.textContent = userData.nome;
        if (userClass) {
            if (userData.tipo === 'aluno') {
                userClass.textContent = userData.turma;
            } else {
                userClass.textContent = `${userData.disciplina} - ${userData.turmas[0]}`;
            }
        }
        
        // Atualiza dados específicos da página
        this.updatePageData(currentUser, userData);
    }
    
    updatePageData(currentUser, userData) {
        const path = window.location.pathname;
        
        if (path.includes('alunoinicio.html')) {
            this.updateAlunoHub(currentUser);
        } else if (path.includes('professordash.html')) {
            this.updateProfessorDash(currentUser);
        }
    }
    
    updateAlunoHub(emailAluno) {
        const stats = window.SagaData?.getEstatisticasAluno(emailAluno);
        if (!stats) return;
        
        // Atualiza KPIs
        const pendingValue = document.querySelector('#pending-activities-value');
        const unreadValue = document.querySelector('#unread-comms-value');
        const gradeValue = document.querySelector('#average-grade-value');
        const attendanceValue = document.querySelector('#attendance-value');
        
        if (pendingValue) pendingValue.textContent = stats.atividadesPendentes;
        if (unreadValue) unreadValue.textContent = stats.comunicadosNaoLidos;
        if (gradeValue) gradeValue.textContent = stats.mediaGeral;
        if (attendanceValue) attendanceValue.textContent = `${stats.presenca}%`;
        
        // Atualiza próximo evento
        if (stats.proximaAtividade) {
            const nextEvent = document.querySelector('#next-event-content');
            if (nextEvent) {
                nextEvent.innerHTML = `
                    <div class="event-item">
                        <h4>${stats.proximaAtividade.titulo}</h4>
                        <p><strong>${stats.proximaAtividade.disciplina}</strong></p>
                        <p class="event-date">${formatarDataEntrega(stats.proximaAtividade.dataEntrega)}</p>
                    </div>
                `;
            }
        }
    }
    
    updateProfessorDash(emailProfessor) {
        const stats = window.SagaData?.getEstatisticasProfessor(emailProfessor);
        if (!stats) return;
        
        // Atualiza KPIs do professor
        const createdValue = document.querySelector('#created-activities-value');
        const activeValue = document.querySelector('#active-activities-value');
        const viewsValue = document.querySelector('#total-views-value');
        const submissionsValue = document.querySelector('#total-submissions-value');
        
        if (createdValue) createdValue.textContent = stats.atividadesCriadas;
        if (activeValue) activeValue.textContent = stats.atividadesAtivas;
        if (viewsValue) viewsValue.textContent = stats.totalVisualizacoes;
        if (submissionsValue) submissionsValue.textContent = stats.totalEntregas;
    }
}

// Inicializa quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Aguarda um pouco para garantir que outros scripts carregaram
    setTimeout(() => {
        window.responsiveSidebar = new ResponsiveSidebar();
    }, 100);
});

// Função para navegar entre páginas
window.navigateToPage = function(url) {
    if (window.navigateWithVinheta) {
        window.navigateWithVinheta(url);
    } else {
        window.location.href = url;
    }
};
