<template>
    <n-layout :class="$style.container">
        <n-layout-header :class="$style.header" bordered>
            <slot name="header"></slot>
        </n-layout-header>
        <n-layout :class="$style.content" has-sider>
            <n-layout-sider
                bordered
                show-trigger
                collapse-mode="width"
                :collapsed-width="64"
                :collapsed="isCollapsed"
                @update-collapsed="isCollapsed=!isCollapsed"
                :width="240"
                :native-scrollbar="false"
            >
                <boto-navigation-menu :menu="sidebarMenu" />
            </n-layout-sider>
            <n-layout>
                <slot></slot>
            </n-layout>
        </n-layout>
        <n-layout-footer :class="$style.footer" bordered>
            <slot name="footer"></slot>
        </n-layout-footer>
    </n-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { NLayout, NLayoutFooter, NLayoutSider, NLayoutHeader } from 'naive-ui'
import BotoNavigationMenu from './Navigation.vue';

export default defineComponent({
    name: 'BotoDashboardLayout',
    components: {
        NLayout, NLayoutFooter, NLayoutSider, NLayoutHeader, BotoNavigationMenu
    },
    props: {
        sidebarMenu: {
            type: Array,
            default: () => []
        }
    },
    setup() {
        return {
            isCollapsed: ref(true)
        }
    }
})
</script>

<style lang="stylus" module>
.container {
    width 100vw;
    height 100vh;
}

.header {
    display flex;
    justify-content center
    align-items center
    padding: 4px
}

.content {
    height: calc(100% - 90px)
}

.view {
    padding: 48px;
}
</style>