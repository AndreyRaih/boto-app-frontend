import { h } from "vue";
import {
    Cardboards as BotIcon,
    Stairs as ScenarioIcon,
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
        label: 'Бот',
        key: ROUTER.ROUTE_PATHS.BOT,
        icon: renderIcon(BotIcon),
    },
    {
        label: 'Сценарий',
        icon: renderIcon(ScenarioIcon),
        key: ROUTER.ROUTE_PATHS.SCENARIO,
    },
    {
        label: 'Диалоги',
        icon: renderIcon(MessagesIcon),
        key: ROUTER.ROUTE_PATHS.DIALOGS,
    },
    {
        label: 'Выход',
        icon: renderIcon(ExitIcon),
        key: ROUTER.ROUTE_PATHS.LOGIN,
    }
]
