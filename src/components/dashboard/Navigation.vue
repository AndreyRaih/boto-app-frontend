<template>
    <n-menu
        default-expand-all
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menu"
        :value="currentRoute"
        @update:value="changeRoute"
    />
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { NMenu } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
    name: 'BotoNavigationMenu',
    components: {
        NMenu
    },
    props: {
        menu: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const changeRoute = (key, { value }) => router.push(value)
        const currentRoute = ref(route.fullPath);

        watch(
            () => route.fullPath,
            (url) => {
                currentRoute.value = url;
            }
        )


        return {
            currentRoute,
            changeRoute
        }
    }
})
</script>