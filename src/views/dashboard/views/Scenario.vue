<template>
    <boto-scenario-editor v-if="!contentIsLoading" />
    <boto-loader v-else />
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import BotoScenarioEditor from "@/components/dashboard/scenario/Builder.vue"
import BotoLoader from "@/components/dashboard/Loader.vue";
import { useStore } from 'vuex';

export default defineComponent({
    components: {
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