<template>
  <n-data-table :columns="columns" :data="data">
    <template #empty>
      <n-empty description="Нет активных диалогов" />
    </template>
  </n-data-table>
  <boto-inbox-dialog-modal :dialogId="currentDialogId" @boto-dialog-modal:send-message="onSendMessage" v-model:show="showModal" />
</template>
  
  <script>
import { h, defineComponent, ref, computed, watch } from 'vue'
import { NTag, NButton, NDataTable, NEmpty } from 'naive-ui'
import BotoInboxDialogModal from './dialog/DialogModal.vue';
import { useStore } from 'vuex';

const createColumns = ({ onAction }) => {
  return [
    {
      title: 'ID Чата',
      key: 'id'
    },
    {
      title: 'Последнее Сообщение',
      key: 'lastMessage',
      render(row) {
        return row.lastMessage ? `${!row.lastMessage.isBot ? 'Пользователь' : 'Бот'}: ${row.lastMessage.text}` : '-'
      }
    },
    {
      title: 'Последнее событие',
      key: 'lastEvent',
      render(row) {
        return row.lastEvent ? h(
          NTag,
          {

            type: 'info'
          },
          {
            default: () => `${row.lastEvent.label}${row.lastEvent.value ? `: ${row.lastEvent.value}` : ''}`
          }
        ) : '-'
      }
    },
    {
      title: 'Действия',
      key: 'actions',
      render(row) {
        return [h(
          NButton,
          {
            size: 'small',
            onClick: () => onAction(`${row.botId}:${row.id.toString()}`)
          },
          { default: () => 'Перейти к диалогу' }
        ),]
      }
    }
  ]
}

export default defineComponent({
  name: "BotoDialogsTable",
  components: {
    NDataTable, NEmpty, BotoInboxDialogModal
  },
  setup() {
    const store = useStore();

    const data = computed(() => store.state.dialogs.dialogList.map(({ botId, id, history }, key) => ({
      key,
      botId,
      id,
      history,
      lastEvent: history.filter(({ event }) => event && event.label).reverse()[0] ? history.filter(({ event }) => event && event.label).reverse()[0].event : null,
      lastMessage: history.reverse()[0] || null
    })));

    const showModal = ref(false)
    const currentDialogId = ref(null);

    const onSendMessage = (message) => {
      const { botId: from, id: to } = store.state.dialogs.dialogList.find(({ id }) => store.state.dialogs.dialog.id === id);
      store.dispatch('sendMessageToDialog', {
        from,
        to,
        message
      })
    }

    watch(() => showModal.value, (val) => !val && (currentDialogId.value = null))

    return {
      data,
      columns: createColumns({
        onAction(dialogId) {
          showModal.value = !showModal.value,
          currentDialogId.value = dialogId;
        }
      }),
      showModal,
      currentDialogId,
      onSendMessage
    }
  }
})
</script>