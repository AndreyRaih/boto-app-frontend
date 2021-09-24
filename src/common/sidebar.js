import { h } from "vue";
import {
    Plus as CreateIcon,
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
        label: 'Создать бота',
        key: ROUTER.ROUTE_PATHS.BUILDER,
        icon: renderIcon(CreateIcon)
    },
    {
        label: 'Боты',
        key: ROUTER.ROUTE_PATHS.BOT,
        icon: renderIcon(BotIcon),
    },
    {
        label: 'Сценарии',
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
