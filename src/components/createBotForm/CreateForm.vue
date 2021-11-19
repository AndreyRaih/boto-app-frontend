<template>
    <n-card :class="$style.card" title="Создание Telegram бота">
        <n-list>
            <n-list-item>
                <n-text>
                    Перейдите к диалогу к 
                    <n-a href="https://t.me/botfather" target="_blank">@BotFather</n-a> и введите команду -
                    <strong>/newbot</strong>
                </n-text>
            </n-list-item>
            <n-list-item>
                <n-text>
                    Выберите имя для бота. Должно оканчиваться на Bot или bot -
                    <strong>AnyBot</strong> или
                    <strong>any_bot</strong>
                </n-text>
            </n-list-item>
            <n-list-item>
                <n-text>Скопируйте полученный токен (выделен красным) и имя бота, и вставьте в форму ниже.</n-text>
            </n-list-item>
        </n-list>

      <img :class="$style.img" src="@/assets/example_img.png" />
            <n-input-group>
                <n-input placeholder="Имя бота" v-model:value="name" @blur="() => validateName()" :style="{ width: '40%' }" />
                <n-input placeholder="API Токен" v-model:value="token" @blur="() => validateToken()" :style="{ width: '40%' }" />
                <n-button @click="onCreateEvent" :disabled="formInvalid" :loading="loading" type="primary">Создать</n-button>
            </n-input-group>
    </n-card>
</template>

<style lang="stylus" module>
.card {
  width: 400px;
}
.img {
    width: 100%;
    height: 200px;
}
</style>

<script>
import { defineComponent, ref, computed } from 'vue';
import { NCard, NList, NListItem, NInputGroup, NInput, NButton, NText, NA } from "naive-ui";

export default defineComponent({
    components: {
        NCard, NList, NListItem, NInputGroup, NInput, NButton, NText, NA
    },
    props: ['loading'],
    emits: ['create'],
    setup(props, { emit }) {
        const name = ref(null);
        const token = ref(null);
        const nameInvalid = ref(false)
        const tokenInvalid = ref(false)
        const formInvalid = computed(() => (!name.value || !token.value) || nameInvalid.value || tokenInvalid.value)

        const validateName = () => nameInvalid.value = !new RegExp(/\w*(Bot|bot)\b/).test(name.value);

        /* eslint-disable */
        const validateToken = () => tokenInvalid.value = !new RegExp(/\d+\:.+/).test(token.value);

        return {
            name,
            token,
            nameInvalid,
            tokenInvalid,
            validateToken,
            validateName,
            formInvalid,
            onCreateEvent: () => emit('create', [{ key: 'name', value: name.value }, { key: 'token', value: token.value }])
        }
    }
})
</script>