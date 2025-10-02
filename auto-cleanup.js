// === SISTEMA DE LIMPEZA AUTOMÁTICA S.A.G.A. ===
// Remove automaticamente atividades vencidas e atualiza status

class AutoCleanup {
    constructor() {
        this.db = null;
        this.init();
    }

    init() {
        // Aguarda o Firebase estar disponível
        if (typeof getDatabase !== 'undefined') {
            this.db = getDatabase();
            this.startCleanup();
        } else {
            // Aguarda o Firebase carregar
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    if (typeof getDatabase !== 'undefined') {
                        this.db = getDatabase();
                        this.startCleanup();
                    }
                }, 1000);
            });
        }
    }

    startCleanup() {
        // Executa limpeza imediatamente
        this.cleanupExpiredActivities();
        
        // Executa limpeza a cada 30 minutos
        setInterval(() => {
            this.cleanupExpiredActivities();
        }, 30 * 60 * 1000);
        
        // Executa limpeza diária às 00:00
        this.scheduleDailyCleanup();
    }

    async cleanupExpiredActivities() {
        if (!this.db) return;

        try {
            const { ref, get, remove, update } = await import('https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js');
            
            const atividadesRef = ref(this.db, 'atividades');
            const snapshot = await get(atividadesRef);
            
            if (!snapshot.exists()) return;

            const atividades = snapshot.val();
            const hoje = new Date();
            const atividadesParaRemover = [];
            const atividadesParaAtualizar = {};

            Object.entries(atividades).forEach(([key, atividade]) => {
                const prazo = new Date(atividade.prazo);
                const diasVencido = Math.floor((hoje - prazo) / (1000 * 60 * 60 * 24));

                // Remove atividades vencidas há mais de 7 dias
                if (diasVencido > 7) {
                    atividadesParaRemover.push(key);
                }
                // Marca como vencida atividades vencidas há menos de 7 dias
                else if (diasVencido > 0 && !atividade.vencida) {
                    atividadesParaAtualizar[key] = {
                        ...atividade,
                        vencida: true,
                        dataVencimento: hoje.toISOString()
                    };
                }
            });

            // Remove atividades antigas
            for (const key of atividadesParaRemover) {
                await remove(ref(this.db, `atividades/${key}`));
                console.log(`Atividade removida: ${key}`);
            }

            // Atualiza atividades vencidas
            for (const [key, atividade] of Object.entries(atividadesParaAtualizar)) {
                await update(ref(this.db, `atividades/${key}`), atividade);
                console.log(`Atividade marcada como vencida: ${key}`);
            }

            if (atividadesParaRemover.length > 0 || Object.keys(atividadesParaAtualizar).length > 0) {
                console.log(`Limpeza concluída: ${atividadesParaRemover.length} removidas, ${Object.keys(atividadesParaAtualizar).length} atualizadas`);
            }

        } catch (error) {
            console.error('Erro na limpeza automática:', error);
        }
    }

    scheduleDailyCleanup() {
        const agora = new Date();
        const proximaMeiaNoite = new Date();
        proximaMeiaNoite.setHours(24, 0, 0, 0);
        
        const tempoParaMeiaNoite = proximaMeiaNoite.getTime() - agora.getTime();
        
        setTimeout(() => {
            this.cleanupExpiredActivities();
            // Agenda para o próximo dia
            setInterval(() => {
                this.cleanupExpiredActivities();
            }, 24 * 60 * 60 * 1000);
        }, tempoParaMeiaNoite);
    }

    // Método para marcar comunicado como lido
    async markComunicadoAsRead(comunicadoId, userId) {
        if (!this.db) return;

        try {
            const { ref, update } = await import('https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js');
            
            const comunicadoRef = ref(this.db, `comunicados/${comunicadoId}/lido/${userId}`);
            await update(comunicadoRef, {
                lido: true,
                dataLeitura: new Date().toISOString()
            });
            
            console.log(`Comunicado ${comunicadoId} marcado como lido pelo usuário ${userId}`);
        } catch (error) {
            console.error('Erro ao marcar comunicado como lido:', error);
        }
    }

    // Método para marcar atividade como vista
    async markAtividadeAsSeen(atividadeId, userId) {
        if (!this.db) return;

        try {
            const { ref, update } = await import('https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js');
            
            const atividadeRef = ref(this.db, `atividades/${atividadeId}/visto/${userId}`);
            await update(atividadeRef, {
                visto: true,
                dataVisualizacao: new Date().toISOString()
            });
            
            console.log(`Atividade ${atividadeId} marcada como vista pelo usuário ${userId}`);
        } catch (error) {
            console.error('Erro ao marcar atividade como vista:', error);
        }
    }
}

// Inicializa o sistema de limpeza
document.addEventListener('DOMContentLoaded', () => {
    window.autoCleanup = new AutoCleanup();
});

// Funções globais para uso em outras páginas
window.markComunicadoAsRead = (comunicadoId, userId) => {
    if (window.autoCleanup) {
        window.autoCleanup.markComunicadoAsRead(comunicadoId, userId);
    }
};

window.markAtividadeAsSeen = (atividadeId, userId) => {
    if (window.autoCleanup) {
        window.autoCleanup.markAtividadeAsSeen(atividadeId, userId);
    }
};
