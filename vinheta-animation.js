// === ANIMAÇÃO DE VINHETA UNIVERSAL S.A.G.A. ===
// Sistema de transição de páginas com vinheta de abertura e fechamento

class VinhetaAnimation {
    constructor() {
        this.overlay = null;
        this.isAnimating = false;
        this.init();
    }

    init() {
        // Cria o overlay de vinheta se não existir
        this.createOverlay();
        
        // Adiciona listeners para navegação
        this.setupNavigationListeners();
        
        // Mostra vinheta de entrada na página atual
        this.showEntryVinheta();
    }

    createOverlay() {
        if (document.getElementById('vinheta-overlay')) return;

        this.overlay = document.createElement('div');
        this.overlay.id = 'vinheta-overlay';
        this.overlay.innerHTML = `
            <div class="vinheta-content">
                <div class="vinheta-logo">
                    <span class="vinheta-letter" style="animation-delay: 0.1s;">S</span>
                    <span class="vinheta-letter" style="animation-delay: 0.2s;">A</span>
                    <span class="vinheta-letter" style="animation-delay: 0.3s;">G</span>
                    <span class="vinheta-letter" style="animation-delay: 0.4s;">A</span>
                </div>
                <div class="vinheta-subtitle">Sistema Acadêmico de Gestão Avançada</div>
            </div>
        `;

        // Adiciona estilos inline para garantir funcionamento
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
            z-index: 99999;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.6s ease-in-out;
        `;

        const style = document.createElement('style');
        style.textContent = `
            .vinheta-content {
                text-align: center;
                color: white;
            }
            .vinheta-logo {
                font-size: 4rem;
                font-weight: 700;
                margin-bottom: 1rem;
                letter-spacing: 0.2em;
            }
            .vinheta-letter {
                display: inline-block;
                opacity: 0;
                transform: translateY(30px) scale(0.8);
                animation: vinhetaLetterIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
            }
            .vinheta-subtitle {
                font-size: 1rem;
                opacity: 0;
                transform: translateY(20px);
                animation: vinhetaSubtitleIn 0.6s ease-out forwards;
                animation-delay: 0.8s;
                color: rgba(255, 255, 255, 0.8);
                font-weight: 300;
                letter-spacing: 0.1em;
            }
            @keyframes vinhetaLetterIn {
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            @keyframes vinhetaSubtitleIn {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .vinheta-overlay.active {
                opacity: 1;
                pointer-events: all;
            }
            .vinheta-overlay.fade-out {
                opacity: 0;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(this.overlay);
    }

    setupNavigationListeners() {
        // Intercepta cliques em links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && !link.href.startsWith('javascript:') && !link.href.startsWith('#')) {
                e.preventDefault();
                this.navigateWithVinheta(link.href);
            }
        });

        // Intercepta navegação programática
        const originalLocation = window.location;
        Object.defineProperty(window, 'location', {
            get: () => originalLocation,
            set: (url) => {
                if (typeof url === 'string') {
                    this.navigateWithVinheta(url);
                } else {
                    originalLocation.href = url;
                }
            }
        });
    }

    showEntryVinheta() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.overlay.classList.add('active');
        
        // Remove a vinheta após a animação de entrada
        setTimeout(() => {
            this.overlay.classList.add('fade-out');
            setTimeout(() => {
                this.overlay.classList.remove('active', 'fade-out');
                this.isAnimating = false;
            }, 600);
        }, 1500);
    }

    navigateWithVinheta(url) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.overlay.classList.add('active');
        
        // Navega após a animação de saída
        // Mostra barra de progresso personalizada
        if (window.showProgress) {
            window.showProgress();
        }
        
        setTimeout(() => {
            window.location.href = url;
        }, 1200);
    }

    // Método para navegação programática
    static navigate(url) {
        if (window.vinhetaInstance) {
            window.vinhetaInstance.navigateWithVinheta(url);
        } else {
            window.location.href = url;
        }
    }
}

// Inicializa a animação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.vinhetaInstance = new VinhetaAnimation();
});

// Função global para navegação com vinheta
window.navigateWithVinheta = VinhetaAnimation.navigate;
