<template>
  <div :class="$style.conatiner">
    <boto-create-bot-form :loading="loading" @create="onBotCreate" />
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
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ROUTER } from '@/common/constants';
import BotoCreateBotForm from '@/components/dashboard/bot/CreateForm.vue';

export default defineComponent({
  name: "BotoBuilderMainView",
  components: {
    BotoCreateBotForm
  },
  setup() {
    const store = useStore();
    const router = useRouter();
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
      onBotCreate
    }
  }
})
</script>
