<template>
<div :style="{ padding: '48px' }">
    <n-h1 prefix="bar">Диалоги</n-h1>
    <n-divider />
    <boto-dialogs-table v-if="!contentIsLoading" />
    <boto-loader v-else />
    </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { NH1, NDivider } from "naive-ui";
import BotoDialogsTable from "@/components/dialogs/Table.vue";
import BotoLoader from "@/components/shared/Loader.vue";
import { useStore } from "vuex";

export default defineComponent({
    components: {
        NH1,
        NDivider,
        BotoLoader,
        BotoDialogsTable
    },
    setup() {
        const contentIsLoading = ref(true);
        const store = useStore();
        onMounted(() => store.dispatch('getDialogListByIds', store.getters.botIds).finally(() => contentIsLoading.value = false))
        return {
            contentIsLoading
        }
    }
})
</script>