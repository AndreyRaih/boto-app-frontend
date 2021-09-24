<template>
  <n-modal
    class="custom-card"
    :show="show"
    preset="card"
    :style="{ maxWidth: '600px' }"
    title="Диалог с пользователем"
    :bordered="false"
    @update:show="(val) => $emit('update:show', val)"
    size="huge"
    :segmented="{
      content: 'soft',
      footer: 'soft'
    }"
  >
    <boto-dialog-chat v-if="history" :messages="history" />
    <n-spin v-else />
    <template #footer>
      <boto-dialog-message @boto-dialog-message:send="onSendMessage" />
    </template>
  </n-modal>
</template>

<script>
import { defineComponent, watch, computed } from "vue";
import { NModal, NSpin } from "naive-ui"
import { useStore } from "vuex";
import BotoDialogChat from './Chat.vue';
import BotoDialogMessage from './Message.vue';

export default defineComponent({
  name: "BotoInboxDialogModal",
  components: {
    NModal, NSpin, BotoDialogChat, BotoDialogMessage
  },
  props: {
    dialogId: {
      type: String,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['boto-dialog-modal:send-message', 'update:show'],
  setup(props, { emit }) {
    const store = useStore();
    let observerTimer = null;

    const history = computed(() => store.state.dialogs.dialog ? store.state.dialogs.dialog.history : []);

    const runDialogsObserver = () => {
      store.dispatch('getDialogById', props.dialogId)
      observerTimer = setInterval(() => store.dispatch('getDialogById', props.dialogId), 10000)
    }
    const stopDialogsObserver = () => clearInterval(observerTimer);

    const onSendMessage = (msg) => emit('boto-dialog-modal:send-message', msg);

    watch(() => props.show, (val) => val ? runDialogsObserver() : stopDialogsObserver());

    return {
      history,
      onSendMessage
    }
  }
})
</script>
