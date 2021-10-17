<template>
  <div :class="$style.conatiner">
    <n-card :class="$style.card" title="Создание Telegram бота">
      
    </n-card>
  </div>
</template>

<style lang="stylus" module>
.conatiner {
  height: calc(100vh - 90px);
  display: flex;
  justify-content center;
  align-items center;
}
.card {
  width: 600px;
}
</style>

<script>
import { defineComponent, ref } from 'vue'
import { NCard } from "naive-ui";
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ROUTER } from '@/common/constants';

export default defineComponent({
  name: "BotoBuilderMainView",
  components: {
    NCard
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const name = ref(null);
    const token = ref(null);
    const loading = ref(false);

    function onBotCreate(fields) {
      loading.value = true;
      const data = {
        userId: store.getters.userId
      };
      for (const field of fields) {
        data[field.key] = field.value
      }
      store.dispatch('createBot', data)
        .then(() => router.push({ name: ROUTER.ROUTE_NAMES.BOT, params: { id: store.state.bots.currentBot.id } }))
        .finally(() => loading.value = false)
    }

    return {
      name,
      token,
      loading,
      onBotCreate
    }
  }
})
</script>
