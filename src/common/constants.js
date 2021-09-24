export const ROUTER = {
    ROUTE_NAMES: {
        DASHBOARD: 'dashboard',
        BOT: 'dashboard/bot',
        BUILDER: 'dashboard/builder',
        LOGIN: 'login-form',
        SCENARIO: 'scenario',
        DIALOGS: 'dialogs',
        ANALYTIC: 'analytic'
    },
    ROUTE_PATHS: {
        DASHBOARD: '/',
        BOT: 'bot/:id',
        BUILDER: '/builder',
        LOGIN: '/login',
        SCENARIO: '/scenario',
        DIALOGS: '/dialogs',
        ANALYTIC: '/analytic'
    },
    TITLE_MAP: {
        'dashboard': 'Дашборд',
        'dashboard/bot': 'Бот',
        'dashboard/builder': 'Создание бота',
        'login-form': 'Логин',
        'scenario': 'Сценарии',
        'dialogs': 'Диалоги'
    }
}

export const STORAGE = {
    BUILDER: 'boto:builder:state'
}