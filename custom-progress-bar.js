// === BARRA DE PROGRESSO PERSONALIZADA S.A.G.A. ===
// Substitui a barra de progresso padrão do navegador

class CustomProgressBar {
    constructor() {
        this.progressBar = null;
        this.isVisible = false;
        this.init();
    }

    init() {
        this.createProgressBar();
        this.setupEventListeners();
    }

    createProgressBar() {
        if (document.getElementById('custom-progress-bar')) return;

        // Cria o container da barra de progresso
        this.progressBar = document.createElement('div');
        this.progressBar.id = 'custom-progress-bar';
        this.progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: transparent;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        `;

        // Cria a barra de progresso
        const progressFill = document.createElement('div');
        progressFill.id = 'progress-fill';
        progressFill.style.cssText = `
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, #007AFF, #00D4FF, #007AFF);
            background-size: 200% 100%;
            animation: progressShimmer 2s ease-in-out infinite;
            border-radius: 0 2px 2px 0;
            transition: width 0.3s ease;
        `;

        // Adiciona estilos CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes progressShimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            #custom-progress-bar.show {
                opacity: 1;
                visibility: visible;
            }
            #custom-progress-bar.complete {
                opacity: 0;
                visibility: hidden;
                transition-delay: 0.5s;
            }
        `;
        document.head.appendChild(style);

        this.progressBar.appendChild(progressFill);
        document.body.appendChild(this.progressBar);
    }

    setupEventListeners() {
        // Intercepta navegações
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = (...args) => {
            this.show();
            return originalPushState.apply(history, args);
        };

        history.replaceState = (...args) => {
            this.show();
            return originalReplaceState.apply(history, args);
        };

        // Intercepta cliques em links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && !link.href.startsWith('javascript:')) {
                this.show();
            }
        });

        // Intercepta o evento de carregamento da página
        window.addEventListener('beforeunload', () => {
            this.show();
        });

        // Intercepta o evento de carregamento completo
        window.addEventListener('load', () => {
            this.complete();
        });

        // Intercepta mudanças de hash
        window.addEventListener('hashchange', () => {
            this.show();
            setTimeout(() => this.complete(), 500);
        });
    }

    show() {
        if (!this.progressBar) return;
        
        this.isVisible = true;
        this.progressBar.classList.remove('complete');
        this.progressBar.classList.add('show');
        
        // Simula progresso
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 90) progress = 90;
            
            const fill = this.progressBar.querySelector('#progress-fill');
            if (fill) {
                fill.style.width = progress + '%';
            }
            
            if (progress >= 90) {
                clearInterval(interval);
            }
        }, 100);
    }

    complete() {
        if (!this.progressBar || !this.isVisible) return;
        
        const fill = this.progressBar.querySelector('#progress-fill');
        if (fill) {
            fill.style.width = '100%';
        }
        
        setTimeout(() => {
            this.progressBar.classList.add('complete');
            this.isVisible = false;
        }, 300);
    }

    hide() {
        if (!this.progressBar) return;
        
        this.progressBar.classList.add('complete');
        this.isVisible = false;
    }
}

// Inicializa a barra de progresso personalizada
document.addEventListener('DOMContentLoaded', () => {
    window.customProgressBar = new CustomProgressBar();
});

// Função global para mostrar progresso
window.showProgress = () => {
    if (window.customProgressBar) {
        window.customProgressBar.show();
    }
};

// Função global para completar progresso
window.completeProgress = () => {
    if (window.customProgressBar) {
        window.customProgressBar.complete();
    }
};
