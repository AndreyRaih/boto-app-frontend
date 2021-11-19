import { h } from "vue";
import {
    ChartPie as BotIcon,
    Artboard as ScenarioIcon,
    DeviceMobileMessage as MessagesIcon,
    Logout as ExitIcon,

} from '@vicons/tabler'
import { NIcon } from "naive-ui";
import { ROUTER } from '@/common/constants';

function renderIcon(icon) {
    return () => h(NIcon, null, { default: () => h(icon) })
}

export const defaultMenu = [
    {
        label: 'Сценарий',
        children: [
            {
                label: 'Текущий сценарий',
                value: { path: ROUTER.ROUTE_PATHS.SCENARIO },
                key: ROUTER.ROUTE_PATHS.SCENARIO,
            },
            {
                type: 'group',
                label: 'Шаблоны',
                children: [
                    {
                        label: 'Сегментирование',
                        value: { path: ROUTER.ROUTE_PATHS.SCENARIO, query: { module: 'add_segment' } },
                        key: `${ROUTER.ROUTE_PATHS.SCENARIO}?module=add_segment`,
                    },
                    {
                        label: 'Автоворонка',
                        value: { path: ROUTER.ROUTE_PATHS.SCENARIO, query: { module: 'new_funnel' } },
                        key: `${ROUTER.ROUTE_PATHS.SCENARIO}?module=new_funnel`,
                    },
                    {
                        label: 'Квиз',
                        value: { path: ROUTER.ROUTE_PATHS.SCENARIO, query: { module: 'new_quize' } },
                        key: `${ROUTER.ROUTE_PATHS.SCENARIO}?module=new_quize`,
                    },
                ]
              },
        ],
        icon: renderIcon(ScenarioIcon),
        key: ROUTER.ROUTE_PATHS.SCENARIO,
        value: { path: ROUTER.ROUTE_PATHS.SCENARIO }
    },
    {
        label: 'Диалоги',
        icon: renderIcon(MessagesIcon),
        key: ROUTER.ROUTE_PATHS.DIALOGS,
        value: { path: ROUTER.ROUTE_PATHS.DIALOGS }
    },
    {
        label: 'Аналитика',
        key: ROUTER.ROUTE_PATHS.BOT,
        icon: renderIcon(BotIcon),
        value: { path: ROUTER.ROUTE_PATHS.BOT }
    },
    {
        label: 'Выход',
        icon: renderIcon(ExitIcon),
        key: ROUTER.ROUTE_PATHS.LOGIN,
        value: { path: ROUTER.ROUTE_PATHS.LOGIN }
    }
]
