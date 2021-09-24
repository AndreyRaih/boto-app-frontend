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
      title: 'Имя',
      key: 'name'
    },
    {
      title: 'Телефон',
      key: 'phone'
    },
    {
      title: 'Адресс',
      key: 'address'
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
            default: () => `${row.lastEvent.name}${row.lastEvent.payload ? `: ${row.lastEvent.payload}` : ''}`
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
            onClick: () => onAction(row.id.toString())
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

    const data = computed(() => store.state.dialogs.dialogList.map(({ id, contactData, history, lastEvent }, key) => ({
      key,
      id,
      ...contactData,
      history,
      lastEvent
    })));

    const showModal = ref(false)
    const currentDialogId = ref(null);

    const onSendMessage = (sendingData) => store.dispatch('sendMessageToDialog', sendingData)

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