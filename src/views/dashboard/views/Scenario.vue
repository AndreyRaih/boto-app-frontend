<template>
    <n-h1 prefix="bar">Сценарии</n-h1>
    <n-divider />
    <boto-scenario-editor v-if="!contentIsLoading" />
    <boto-loader v-else />
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { NH1, NDivider } from "naive-ui";
import BotoScenarioEditor from "@/components/dashboard/scenario/Builder.vue"
import BotoLoader from "@/components/dashboard/Loader.vue";
import { useStore } from 'vuex';

export default defineComponent({
    components: {
        NH1,
        NDivider,
        BotoLoader,
        BotoScenarioEditor
    },
    setup() {
        const contentIsLoading = ref(true);
        const store = useStore();
        onMounted(() => store.dispatch('getScenarioList', store.getters.userId).finally(() => contentIsLoading.value = false))
        return {
            contentIsLoading
        }
    }
})
</script>