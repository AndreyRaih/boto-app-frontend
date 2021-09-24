<template>
    <n-menu
        default-expand-all
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :inverted="inverted"
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
        },
        inverted: {
            type: Boolean,
            default: false
        }
    },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const changeRoute = (key) => router.push({ path: key })
        const currentRoute = ref(route.path);

        watch(
            () => route.path,
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