// === MENU HAMBÚRGUER SIMPLIFICADO S.A.G.A. ===
// Versão simplificada que funciona de forma mais direta

function createSimpleMenu() {
    console.log('Inicializando menu simplificado...');
    
    // Aguarda o DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMenu);
    } else {
        initMenu();
    }
}

function initMenu() {
    // Verifica se já existe
    if (document.getElementById('simple-menu-toggle')) {
        console.log('Menu já existe');
        return;
    }
    
    console.log('Criando menu simplificado...');
    
    // Cria o botão do menu lateral (lado esquerdo)
    const sidebarButton = document.createElement('button');
    sidebarButton.id = 'sidebar-toggle';
    sidebarButton.innerHTML = '☰';
    sidebarButton.title = 'Menu Principal';
    sidebarButton.style.cssText = `
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        font-size: 1.2rem;
        cursor: pointer;
        color: var(--text-color);
        padding: 0.5rem;
        border-radius: 8px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        margin-right: 1rem;
        box-shadow: 0 2px 4px var(--shadow-color);
    `;

    // Cria o botão do menu de configurações (lado direito)
    const menuButton = document.createElement('button');
    menuButton.id = 'simple-menu-toggle';
    menuButton.innerHTML = '⚙️';
    menuButton.title = 'Configurações';
    menuButton.style.cssText = `
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        font-size: 1.2rem;
        cursor: pointer;
        color: var(--text-color);
        padding: 0.5rem;
        border-radius: 8px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        margin-left: 1rem;
        box-shadow: 0 2px 4px var(--shadow-color);
    `;
    
    // Cria o menu
    const menu = document.createElement('div');
    menu.id = 'simple-menu';
    menu.style.cssText = `
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        box-shadow: 0 8px 24px var(--shadow-color);
        min-width: 220px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        z-index: 1000;
        padding: 1.5rem;
        backdrop-filter: blur(10px);
    `;
    
    menu.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.5rem; min-width: 200px;">
            <button id="theme-dark-simple" style="
                padding: 0.75rem 1rem; border: 1px solid var(--border-color); 
                background: var(--bg-primary); color: var(--text-primary); 
                border-radius: 8px; cursor: pointer; font-size: 0.9rem;
                display: flex; align-items: center; gap: 0.75rem;
                transition: all 0.3s ease; text-align: left;
            ">
                <span style="font-size: 1.2rem;">🌙</span>
                <span>Tema Escuro</span>
            </button>
            <button id="theme-light-simple" style="
                padding: 0.75rem 1rem; border: 1px solid var(--border-color); 
                background: var(--bg-primary); color: var(--text-primary); 
                border-radius: 8px; cursor: pointer; font-size: 0.9rem;
                display: flex; align-items: center; gap: 0.75rem;
                transition: all 0.3s ease; text-align: left;
            ">
                <span style="font-size: 1.2rem;">☀️</span>
                <span>Tema Claro</span>
            </button>
            <button id="logout-simple" style="
                padding: 0.75rem 1rem; border: none; 
                background: #dc3545; color: white; 
                border-radius: 8px; cursor: pointer; font-size: 0.9rem;
                display: flex; align-items: center; gap: 0.75rem;
                transition: all 0.3s ease; text-align: left;
            ">
                <span style="font-size: 1.2rem;">🚪</span>
                <span>Sair</span>
            </button>
        </div>
    `;
    
    // Encontra o header
    const header = document.querySelector('header');
    if (!header) {
        console.error('Header não encontrado!');
        return;
    }
    
    // Encontra o user-controls
    const userControls = header.querySelector('.user-controls');
    if (!userControls) {
        console.error('User controls não encontrado!');
        return;
    }
    
    // Adiciona os botões (menu lateral à esquerda, configurações à direita)
    userControls.insertBefore(sidebarButton, userControls.firstChild);
    userControls.appendChild(menuButton);
    userControls.appendChild(menu);
    
    // Adiciona eventos
    sidebarButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.openSidebar) {
            window.openSidebar();
        }
    });
    
    menuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu(menu);
    });
    
    document.getElementById('theme-dark-simple').addEventListener('click', () => {
        applyTheme('dark');
        closeMenu(menu);
    });
    
    document.getElementById('theme-light-simple').addEventListener('click', () => {
        applyTheme('light');
        closeMenu(menu);
    });
    
    document.getElementById('logout-simple').addEventListener('click', () => {
        if (window.logout) {
            window.logout();
        }
        closeMenu(menu);
    });
    
    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !menuButton.contains(e.target)) {
            closeMenu(menu);
        }
    });
    
    // Adiciona hover effects
    const buttons = menu.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.1)';
            btn.style.boxShadow = '0 4px 8px var(--shadow-color)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = 'none';
        });
    });
    
    console.log('Menu simplificado criado com sucesso!');
}

function toggleMenu(menu) {
    const isOpen = menu.style.opacity === '1';
    if (isOpen) {
        closeMenu(menu);
    } else {
        openMenu(menu);
    }
}

function openMenu(menu) {
    menu.style.opacity = '1';
    menu.style.visibility = 'visible';
    menu.style.transform = 'translateY(0)';
}

function closeMenu(menu) {
    menu.style.opacity = '0';
    menu.style.visibility = 'hidden';
    menu.style.transform = 'translateY(-10px)';
}

function applyTheme(theme) {
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

// Inicializa o menu
createSimpleMenu();
