<template>
    <div :class="$style.form">
        <n-gradient-text
            size="48px"
            :gradient="{
                from: 'rgb(85, 85, 85)',
                to: 'rgb(170, 170, 170)'
            }"
            color="primary"
        >Boto</n-gradient-text>
        <n-card :class="$style.container" size="large" :title="formTitle">
            <n-form-item label="Email">
                <n-input placeholder="Введите email" v-model:value="username" />
            </n-form-item>
            <n-form-item label="Пароль">
                <n-input placeholder="Введите пароль" type="password" show-password-toggle v-model:value="password" />
            </n-form-item>
            <n-form-item v-show="isRegistration" label="Повторите пароль">
                <n-input placeholder="Повторите пароль" type="password" show-password-toggle v-model:value="confirmPassword" />
            </n-form-item>
            <div v-show="!isRegistration" :class="$style.actions">
                <n-button :loading="loading" @click="onSignIn" type="primary">Вход</n-button>
                <n-button @click="isRegistration = !isRegistration" ghost>Зарегистрироваться</n-button>
            </div>
            <div v-show="isRegistration" :class="$style.actions">
                <n-button :loading="loading" @click="onSignUp" type="primary">Зарегистрироваться</n-button>
                <n-button @click="isRegistration = !isRegistration" ghost>Назад</n-button>
            </div>
        </n-card>
    </div>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
import { NCard, NInput, NButton, NFormItem, NGradientText, useMessage } from "naive-ui";
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ROUTER } from '@/common/constants';

export default defineComponent({
    name: 'LoginLayout',
    components: {
        NCard, NInput, NButton, NFormItem, NGradientText
    },
    setup() {
        const store = useStore();
        const router = useRouter();
        const isRegistration = ref(false);
        const username = ref(null);
        const password = ref(null);
        const confirmPassword = ref(null);
        const formTitle = computed(() => isRegistration.value ? 'Новый пользователь' : 'Добро пожаловать!')
        const loading = ref(false);
        const messages = useMessage()

        const onSignIn = () => {
            loading.value = true;
            store.dispatch('signIn', { email: username.value, password: password.value })
                .then(() => router.push({ name: ROUTER.ROUTE_NAMES.BUILDER }))
                .catch(() => messages.error("Во время авторизации прозошла ошибка. Попробуйте еще раз"))
                .finally(() => loading.value = false)
        };
        const onSignUp = () => {
            loading.value = true;
            store.dispatch('signUp', { email: username.value, password: password.value })
                .then(() => router.push({ name: ROUTER.ROUTE_NAMES.BUILDER }))
                .catch(() => messages.error("Во время регистрации прозошла ошибка. Попробуйте еще раз"))
                .finally(() => loading.value = false)
        };

        return {
            username,
            password,
            confirmPassword,
            isRegistration,
            formTitle,
            onSignIn,
            onSignUp,
            loading
        }
    },
})
</script>

<style lang="stylus" module>
.form {
    display: flex;
    flex-direction: column
}
.container {
    max-width 25vw
    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08), 0 3px 6px 0 rgba(0, 0, 0, 0.06), 0 5px 12px 4px rgba(0, 0, 0, 0.04);
}
.actions
        & > *
            width: 100%
            &:not(:last-of-type) {
                margin-bottom: 8px
            }
</style>