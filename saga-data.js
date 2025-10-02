// === SISTEMA DE DADOS SAGA ===
// Base de dados simulada para sincronização

window.SagaData = {
    
    // Dados dos usuários
    usuarios: {
        'joao.silva@escola.com': {
            nome: 'João Silva',
            tipo: 'aluno',
            turma: '3º Ano - Ensino Médio',
            foto: '../logo.png',
            presenca: 94,
            mediaGeral: 8.7,
            atividadesLidas: ['ativ-1', 'ativ-3'],
            comunicadosLidos: ['com-1']
        },
        'maria.santos@escola.com': {
            nome: 'Prof. Maria Santos',
            tipo: 'professor',
            disciplina: 'Matemática',
            turmas: ['3º Ano - Ensino Médio', '2º Ano - Ensino Médio'],
            foto: '../logo.png'
        }
    },
    
    // Atividades criadas pelos professores
    atividades: [
        {
            id: 'ativ-1',
            titulo: 'Redação - "Meio Ambiente"',
            descricao: 'Escrever uma redação de 30 linhas sobre sustentabilidade',
            professor: 'maria.santos@escola.com',
            disciplina: 'Português',
            turma: '3º Ano - Ensino Médio',
            dataEntrega: '2025-09-21T23:59:00',
            dataCriacao: '2025-09-18T10:00:00',
            status: 'ativa',
            alunosQueViram: ['joao.silva@escola.com'],
            alunosQueEntregaram: [],
            totalAlunos: 28
        },
        {
            id: 'ativ-2',
            titulo: 'Exercícios de Matemática',
            descricao: 'Lista de exercícios do capítulo 8 - Funções',
            professor: 'maria.santos@escola.com',
            disciplina: 'Matemática',
            turma: '3º Ano - Ensino Médio',
            dataEntrega: '2025-09-22T23:59:00',
            dataCriacao: '2025-09-19T14:30:00',
            status: 'ativa',
            alunosQueViram: [],
            alunosQueEntregaram: [],
            totalAlunos: 28
        },
        {
            id: 'ativ-3',
            titulo: 'Relatório de Química',
            descricao: 'Relatório sobre o experimento de reações químicas',
            professor: 'carlos.oliveira@escola.com',
            disciplina: 'Química',
            turma: '3º Ano - Ensino Médio',
            dataEntrega: '2025-09-20T23:59:00',
            dataCriacao: '2025-09-15T09:00:00',
            status: 'encerrada',
            alunosQueViram: ['joao.silva@escola.com'],
            alunosQueEntregaram: ['joao.silva@escola.com'],
            totalAlunos: 28
        }
    ],
    
    // Comunicados da escola
    comunicados: [
        {
            id: 'com-1',
            titulo: 'Feira de Ciências 2025',
            conteudo: 'A Feira de Ciências acontecerá no dia 28 de setembro. Todos os alunos devem participar com seus projetos.',
            autor: 'Direção',
            dataPublicacao: '2025-09-18T08:00:00',
            prioridade: 'alta',
            alunosQueViram: ['joao.silva@escola.com'],
            totalAlunos: 28
        },
        {
            id: 'com-2',
            titulo: 'Mudança no horário da biblioteca',
            conteudo: 'A partir da próxima semana, a biblioteca funcionará das 7h às 17h.',
            autor: 'Bibliotecária',
            dataPublicacao: '2025-09-19T12:00:00',
            prioridade: 'media',
            alunosQueViram: [],
            totalAlunos: 28
        },
        {
            id: 'com-3',
            titulo: 'Reunião de Pais - 3º Ano',
            conteudo: 'Reunião de pais do 3º ano marcada para o dia 30 de setembro às 19h no auditório.',
            autor: 'Coordenação',
            dataPublicacao: '2025-09-20T16:00:00',
            prioridade: 'alta',
            alunosQueViram: [],
            totalAlunos: 28
        }
    ],
    
    // Métodos para calcular estatísticas
    
    // Estatísticas para o aluno
    getEstatisticasAluno: function(emailAluno) {
        const usuario = this.usuarios[emailAluno];
        if (!usuario || usuario.tipo !== 'aluno') return null;
        
        const atividadesParaAluno = this.atividades.filter(ativ => 
            ativ.turma === usuario.turma && ativ.status === 'ativa'
        );
        
        const comunicadosNaoLidos = this.comunicados.filter(com => 
            !com.alunosQueViram.includes(emailAluno)
        );
        
        const proximaAtividade = atividadesParaAluno
            .filter(ativ => !ativ.alunosQueEntregaram.includes(emailAluno))
            .sort((a, b) => new Date(a.dataEntrega) - new Date(b.dataEntrega))[0];
        
        return {
            atividadesPendentes: atividadesParaAluno.filter(ativ => 
                !ativ.alunosQueEntregaram.includes(emailAluno)
            ).length,
            comunicadosNaoLidos: comunicadosNaoLidos.length,
            mediaGeral: usuario.mediaGeral,
            presenca: usuario.presenca,
            proximaAtividade: proximaAtividade ? {
                titulo: proximaAtividade.titulo,
                disciplina: proximaAtividade.disciplina,
                dataEntrega: proximaAtividade.dataEntrega
            } : null,
            atividadesRecentes: atividadesParaAluno.slice(0, 3).map(ativ => ({
                titulo: ativ.titulo,
                disciplina: ativ.disciplina,
                dataEntrega: ativ.dataEntrega,
                status: ativ.alunosQueEntregaram.includes(emailAluno) ? 'entregue' : 
                       (new Date() > new Date(ativ.dataEntrega) ? 'atrasada' : 'pendente')
            }))
        };
    },
    
    // Estatísticas para o professor
    getEstatisticasProfessor: function(emailProfessor) {
        const usuario = this.usuarios[emailProfessor];
        if (!usuario || usuario.tipo !== 'professor') return null;
        
        const atividadesCriadas = this.atividades.filter(ativ => 
            ativ.professor === emailProfessor
        );
        
        const comunicadosTotal = this.comunicados.length;
        
        const totalVisualizacoes = atividadesCriadas.reduce((total, ativ) => 
            total + ativ.alunosQueViram.length, 0
        );
        
        const totalEntregas = atividadesCriadas.reduce((total, ativ) => 
            total + ativ.alunosQueEntregaram.length, 0
        );
        
        return {
            atividadesCriadas: atividadesCriadas.length,
            atividadesAtivas: atividadesCriadas.filter(ativ => ativ.status === 'ativa').length,
            totalVisualizacoes: totalVisualizacoes,
            totalEntregas: totalEntregas,
            comunicadosPublicados: comunicadosTotal,
            atividadesRecentes: atividadesCriadas.slice(0, 3).map(ativ => ({
                titulo: ativ.titulo,
                disciplina: ativ.disciplina,
                visualizacoes: ativ.alunosQueViram.length,
                entregas: ativ.alunosQueEntregaram.length,
                totalAlunos: ativ.totalAlunos,
                dataEntrega: ativ.dataEntrega
            }))
        };
    },
    
    // Marcar atividade como vista
    marcarAtividadeVista: function(emailAluno, atividadeId) {
        const atividade = this.atividades.find(ativ => ativ.id === atividadeId);
        if (atividade && !atividade.alunosQueViram.includes(emailAluno)) {
            atividade.alunosQueViram.push(emailAluno);
        }
    },
    
    // Marcar comunicado como lido
    marcarComunicadoLido: function(emailAluno, comunicadoId) {
        const comunicado = this.comunicados.find(com => com.id === comunicadoId);
        if (comunicado && !comunicado.alunosQueViram.includes(emailAluno)) {
            comunicado.alunosQueViram.push(emailAluno);
        }
    },
    
    // Entregar atividade
    entregarAtividade: function(emailAluno, atividadeId) {
        const atividade = this.atividades.find(ativ => ativ.id === atividadeId);
        if (atividade && !atividade.alunosQueEntregaram.includes(emailAluno)) {
            atividade.alunosQueEntregaram.push(emailAluno);
            this.marcarAtividadeVista(emailAluno, atividadeId);
        }
    },
    
    // Função para simular usuário atual (seria obtido do sistema de auth)
    getCurrentUser: function() {
        // Simula usuário logado baseado na página atual
        const path = window.location.pathname;
        if (path.includes('/aluno/')) {
            return 'joao.silva@escola.com';
        } else if (path.includes('/professor/')) {
            return 'maria.santos@escola.com';
        }
        return null;
    }
};

// Função para formatar datas
window.formatarData = function(dataString) {
    const data = new Date(dataString);
    const agora = new Date();
    const diff = agora - data;
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (dias === 0) return 'Hoje';
    if (dias === 1) return 'Ontem';
    if (dias < 7) return `${dias} dias atrás`;
    
    return data.toLocaleDateString('pt-BR');
};

// Função para formatar data de entrega
window.formatarDataEntrega = function(dataString) {
    const data = new Date(dataString);
    const agora = new Date();
    
    if (data < agora) return 'Atrasada';
    
    const diff = data - agora;
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (dias === 0) {
        if (horas <= 1) return 'Entrega hoje!';
        return `Entrega hoje às ${data.getHours()}:${data.getMinutes().toString().padStart(2, '0')}h`;
    }
    if (dias === 1) return 'Entrega amanhã';
    
    return `${dias} dias restantes`;
};
