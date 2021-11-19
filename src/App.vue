<template>
  <metainfo>
    <template v-slot:title="{ content }">Boto App {{ content }}</template>
  </metainfo>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider placement="top-right">
      <n-dialog-provider>
        <router-view v-if="!isLoaded" />
        <boto-loader :style="{ height: '90vh' }" v-else />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script>
import { defineComponent, onBeforeMount, onMounted, computed, ref } from '@vue/runtime-core'
import { NConfigProvider, NMessageProvider, NDialogProvider } from 'naive-ui'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useMeta } from "vue-meta";
import { ROUTER } from './common/constants';
import BotoLocalStorageManager from './common/localStorageManager';
import BotoLoader from './components/dashboard/shared/Loader.vue';

export default defineComponent({
  name: "BotoApp",
  components: { NConfigProvider, NMessageProvider, NDialogProvider, BotoLoader },
  setup() {
    const store = useStore();
    const router = useRouter();
    const storage = new BotoLocalStorageManager();
    const isLoaded = ref(false);

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
      isLoaded.value = true;
      store.dispatch('getBotListById', store.getters.userId)
        .then(() => {
          if (store.state.bots.botList.length) {
            store.dispatch('getFullBotDataById', store.state.bots.botList[0].id);
            router.push({ name: ROUTER.ROUTE_NAMES.SCENARIO });
          } else {
            router.push({ name: ROUTER.ROUTE_NAMES.BUILDER });
          }
        })
        .finally(() => isLoaded.value = false);
    })

    router.beforeEach((to) => {
      if (to.meta.requiredAuth && !store.state.auth.userData) router.push({ name: ROUTER.ROUTE_NAMES.LOGIN });
    });

    return {
      isLoaded,
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