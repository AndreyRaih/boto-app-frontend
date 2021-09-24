<template>
  <boto-builder-create-form 
    :stages="stages"
    :loading="loading"
    @boto-builder:building-complete="onBotCreate"
  />
</template>

<script>
import { defineComponent, ref } from 'vue'
import BotoBuilderCreateForm from '@/components/dashboard/builder/Builder.vue'
import { stages } from '@/common/builder';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ROUTER } from '@/common/constants';

export default defineComponent({
  name: "BotoBuilderMainView",
  components: {
    BotoBuilderCreateForm
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
      stages,
      loading,
      onBotCreate
    }
  }
})
</script>
