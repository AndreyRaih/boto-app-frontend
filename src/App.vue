<template>
  <metainfo>
    <template v-slot:title="{ content }">Boto App {{ content }}</template>
  </metainfo>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-dialog-provider>
        <router-view />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script>
import { defineComponent, onBeforeMount, onMounted, computed } from '@vue/runtime-core'
import { NConfigProvider, NMessageProvider, NDialogProvider } from 'naive-ui'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useMeta } from "vue-meta";
import { ROUTER } from './common/constants';
import BotoLocalStorageManager from './common/localStorageManager';

export default defineComponent({
  name: "BotoApp",
  components: { NConfigProvider, NMessageProvider, NDialogProvider },
  setup() {
    const store = useStore();
    const router = useRouter();
    const storage = new BotoLocalStorageManager();

    const computedMeta = computed(() => ({
      title: `| ${ROUTER.TITLE_MAP[router.currentRoute.value.name]}`
    }))

    useMeta(computedMeta)

    onBeforeMount(() => {
      if (storage.has('app:auth')) {
        const storedData = storage.get('app:auth');
        storedData && store.commit('SET_USER_DATA', storedData.userData)
      }
    })

    onMounted(() => {
      store.dispatch('getBotListById', store.getters.userId)
    })

    router.beforeEach((to) => {
      if (to.meta.requiredAuth && !store.state.auth.userData) router.push({ name: ROUTER.ROUTE_NAMES.LOGIN });
    });

    return {
      themeOverrides: {
        common: {
          primaryColor: '#396182',
          primaryColorHover: '#6B88A1',
          primaryColorPressed: '#2C4A64',
          primaryColorSuppl: '#396182'
        }
      }
    }
  }
});
</script>