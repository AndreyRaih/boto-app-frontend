<template>
    <n-modal
        class="custom-card"
        :show="show"
        preset="card"
        :style="{ maxWidth: '750px' }"
        title="Добавление нового администратора"
        :bordered="false"
        @update:show="(val) => $emit('update:show', val)"
        size="huge"
    >
        <n-h4>
            Ссылка для добавления администратора
        </n-h4>
        <n-space justify="start" v-if="command">
                {{ command }}
                <n-button size="tiny">Скопировать</n-button>
        </n-space>
        <n-space justify="start" v-else>
            <n-button type="primary" @click="onRefresh">Получить токен</n-button> 
        </n-space>
        <n-text :class="$style.text" depth="3">Отправьте скопированный текст в сообщении вашему боту - <n-a :href="link" target="_blank"> {{ name }} </n-a></n-text>
    </n-modal>
</template>

<style lang="stylus" module>
    .text {
        display: block;
        margin-top: 16px;
    }
</style>

<script>
import { computed, defineComponent, watch } from "vue";
import { NA, NModal, NH4, NButton, NSpace, NText } from "naive-ui";
import { useStore } from "vuex";
export default defineComponent({
    name: "BotoAdminAddModal",
    components: {
        NModal, NButton, NA, NH4,NSpace, NText
    },
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    emits: ["update:show"],
    setup(props) {
        const store = useStore();
        const name = computed(() => `@${store.state.bots.currentBot.name}`);
        const link = computed(() => `https://telegram.me/${store.state.bots.currentBot.name}`);
        const command = computed(() => store.state.bots.editToken ? `/add_admin token=${store.state.bots.editToken}` : null);

        watch(() => props.show, (value) => {
            if (value) store.dispatch('addBotAdmin')
        }, { immediate: true })

        const onRefresh = () => store.dispatch('addBotAdmin');

        return {
            name,
            link,
            command,
            onRefresh
        }
    }
})
</script>