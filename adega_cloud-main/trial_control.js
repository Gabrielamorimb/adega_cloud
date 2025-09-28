// trial_control.js

const TrialControl = {
    /**
     * Verifica o status do trial do usuário com base nos dados do perfil.
     * @param {object} profile - O objeto de perfil do Supabase.
     * @returns {object} - Um objeto com o status e os dias restantes.
     */
    checkTrialStatus: function(profile) {
        // Se não houver dados do perfil, considera como inativo.
        if (!profile) {
            return { status: 'inactive', daysRemaining: 0 };
        }

        // Se o usuário já for premium, o trial não se aplica.
        if (profile.subscription_status === 'premium') {
            return { status: 'premium', daysRemaining: 0 };
        }

        // Se não houver data de término do trial, considera como inativo.
        if (!profile.trial_ends_at) {
            return { status: 'inactive', daysRemaining: 0 };
        }

        const now = new Date();
        const trialEndDate = new Date(profile.trial_ends_at);
        const diffTime = trialEndDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Se a diferença de dias for negativa, o trial expirou.
        if (diffDays <= 0) {
            return { status: 'expired', daysRemaining: 0 };
        }

        // Se faltarem 3 dias ou menos, é um aviso.
        if (diffDays <= 3) {
            return { status: 'warning', daysRemaining: diffDays };
        }

        // Caso contrário, o trial está ativo.
        return { status: 'active', daysRemaining: diffDays };
    },

    /**
     * Formata as mensagens e ícones para a barra de alerta com base no status do trial.
     * @param {object} trialStatus - O objeto retornado por checkTrialStatus.
     * @returns {object} - Um objeto com título, mensagem e ícone formatados.
     */
    formatTrialMessages: function(trialStatus) {
        const { status, daysRemaining } = trialStatus;

        switch (status) {
            case 'premium':
                return {
                    title: 'Plano Premium Ativo',
                    message: 'Você tem acesso a todos os recursos. Obrigado!',
                    icon: 'fas fa-star'
                };
            case 'expired':
                return {
                    title: 'Período de Teste Expirado',
                    message: 'Seu período de teste de 7 dias terminou.',
                    icon: 'fas fa-exclamation-circle'
                };
            case 'warning':
                return {
                    title: 'Seu Período de Teste está Acabando!',
                    message: `Restam apenas ${daysRemaining} dia(s) para aproveitar.`,
                    icon: 'fas fa-exclamation-triangle'
                };
            case 'active':
                return {
                    title: 'Período de Teste',
                    message: `Você tem ${daysRemaining} dia(s) restantes.`,
                    icon: 'fas fa-clock'
                };
            default:
                return {
                    title: 'Informação do Plano',
                    message: 'Não foi possível verificar o status do seu plano.',
                    icon: 'fas fa-info-circle'
                };
        }
    },

    /**
     * Função para exibir o modal de upgrade.
     * FOI INTENCIONALMENTE DEIXADA VAZIA PARA NÃO FAZER NADA.
     */
    showUpgradeModal: function(reason = 'generic') {
        console.log(`Tentativa de exibir modal de upgrade (motivo: ${reason}). Ação bloqueada conforme solicitado.`);
        // A função está vazia, então nenhuma tela de upgrade será exibida.
    }
};

// Disponibiliza o objeto globalmente se estiver em um navegador.
if (typeof window !== 'undefined') {
    window.TrialControl = TrialControl;
}

