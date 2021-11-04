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
                @update-collapsed="isCollapsed = !isCollapsed"
                :width="240"
                :native-scrollbar="false"
            >
                <boto-navigation-menu :menu="sidebarMenu" />
            </n-layout-sider>
            <n-layout>
                <slot></slot>
                <n-drawer v-model:show="drawerShow" :width="300" placement="right">
                    <n-drawer-content title="Обратная связь">
                        <n-space vertical>
                            <n-text
                                depth="3"
                            >Так как Boto находится в стадии beta-тестирования, мы будем признательны за любую обратную связь!</n-text>
                            <n-input placeholder="Введите текст сообщения..." v-model:value="feedbackMsg" type="textarea" />
                            <n-button @click="sendFeedback" :loading="feedbackLoading">Отправить</n-button>
                        </n-space>
                    </n-drawer-content>
                </n-drawer>
                <n-button
                    type="info"
                    size="large"
                    :class="$style.drawerBtn"
                    @click="drawerShow = !drawerShow"
                    circle
                >
                    <template #icon>
                        <n-icon>
                            <help-icon />
                        </n-icon>
                    </template>
                </n-button>
            </n-layout>
        </n-layout>
        <n-layout-footer :class="$style.footer" bordered>
            <slot name="footer"></slot>
        </n-layout-footer>
    </n-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { NLayout, NLayoutFooter, NLayoutSider, NLayoutHeader, NDrawer, NDrawerContent, NIcon, NSpace, NInput, NButton, NText, useMessage } from 'naive-ui'
import { QuestionMark as HelpIcon } from '@vicons/tabler';
import BotoNavigationMenu from './Navigation.vue';
import { useStore } from 'vuex';

export default defineComponent({
    name: 'BotoDashboardLayout',
    components: {
        NLayout, NLayoutFooter, NLayoutSider, NLayoutHeader, BotoNavigationMenu, NDrawer, NDrawerContent, NIcon, HelpIcon, NSpace, NInput, NButton, NText
    },
    props: {
        sidebarMenu: {
            type: Array,
            default: () => []
        }
    },
    setup() {
        const store = useStore();
        const messages = useMessage();
        const drawerShow = ref(false);
        const feedbackLoading = ref(false);
        const feedbackMsg = ref(null)
        const sendFeedback = () => {
            feedbackLoading.value = true;
            return store.dispatch('sendFeedback', feedbackMsg.value).then(() => messages.success('Ваш отзыв успешно отправлен!')).catch(() => messages.error('Во время отправки отзыва произошла ошибка')).finally(() => {
            feedbackLoading.value = false;
            feedbackMsg.value = null;
            drawerShow.value = false
        })
        }

        return {
            isCollapsed: ref(true),
            drawerShow,
            feedbackMsg,
            feedbackLoading,
            sendFeedback
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
.drawerBtn {
    position: fixed;
    z-index: 10;
    bottom: 50px
    right: 50px
    box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 8px 0px;
    }
</style>