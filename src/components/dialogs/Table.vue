<template>
  <div :class="$style.tableControls">
    <div>
      <n-popselect placement="bottom-start" v-model:value="selectedEventsForFilter" multiple :options="eventsForFilter">
        <n-button
          :disabled="!eventsForFilter.length"
          :style="{ marginRight: '16px' }"
        >{{ (Array.isArray(selectedEventsForFilter) && selectedEventsForFilter.length) ? `Выбрано ${selectedEventsForFilter.length} событий` : 'Фильтр по событиям' }}</n-button>
      </n-popselect>
      <n-button :disabled="!checkedRowKeysRef.length" @click="collapsed = !collapsed">Написать всем</n-button>
    </div>
    <n-collapse-transition :style="{ width: '100%', marginTop: '8px' }" :collapsed="collapsed">
      <boto-message-input @boto-dialog-message:send="sendToAllDialogs" />
    </n-collapse-transition>
  </div>
  <n-data-table
    :row-key="row => JSON.stringify({ from: row.botId, to: row.id })"
    @update:checked-row-keys="handleCheck"
    :columns="columns"
    :data="data"
  >
    <template #empty>
      <n-empty description="Нет активных диалогов" />
    </template>
  </n-data-table>
  <boto-inbox-dialog-modal
    :dialogId="currentDialogId"
    @boto-dialog-modal:send-message="onSendMessage"
    v-model:show="showModal"
  />
</template>

<style lang="stylus" module>
.tableControls {
  display: flex;
  flex-direction: column
  margin-bottom: 16px;
}
</style>
  
<script>
import { h, defineComponent, ref, computed, watch } from 'vue'
import { NTag, NButton, NDataTable, NEmpty, NPopselect, NCollapseTransition } from 'naive-ui'
import BotoInboxDialogModal from '../dialogs/dialog/DialogModal.vue';
import BotoMessageInput from '../dialogs/dialog/Message.vue';
import { useStore } from 'vuex';

const createColumns = ({ onAction }) => {
  return [
    {
      type: 'selection',
    },
    {
      title: 'Последнее Сообщение',
      key: 'lastMessage',
      render(row) {
        return row.lastMessage ? `${!row.lastMessage.isBot ? 'Пользователь' : 'Бот'}: ${row.lastMessage.text}` : '-'
      }
    },
    {
      title: 'События',
      key: 'events',
      render(row) {
        return row.events.length ? row.events.map((event) => h(
          NTag,
          {
            type: 'info',
            style: {
              marginRight: '4px'
            }
          },
          {
            default: () => `${event.value}${event.label ? `: ${event.label}` : ''}`
          }
        )) : '-';
      },
      width: 250
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
    NDataTable, NButton, NEmpty, NPopselect, BotoInboxDialogModal, NCollapseTransition, BotoMessageInput
  },
  setup() {
    const checkedRowKeysRef = ref([])
    const selectedEventsForFilter = ref([])
    const store = useStore();

    const data = computed(() => store.state.dialogs.dialogList.map(({ botId, id, history }, key) => ({
        key,
        botId,
        id,
        history,
        events: Array.from(new Set([...history.filter(({ event }) => event && event.value).map(({ event }) => event)])),
        lastMessage: [...history].reverse()[0] || null
      }))
      .filter(dialog => {
        if (!selectedEventsForFilter.value.length) return true;
        return dialog.events.some(({ value }) => selectedEventsForFilter.value.some(selectedEvent => selectedEvent === value))
      })
    );

    const eventsForFilter = computed(() => {
      const eventList = [];
      for (const dialog of store.state.dialogs.dialogList) {
        dialog.history.forEach(({ event }) => {
          if (event && (event.label || event.value) && !eventList.some(({ value }) => value === (event.value || event))) eventList.push({ label: event.value, value: event.value })
        })
      }
      return eventList;
    });

    const showModal = ref(false)
    const collapsed = ref(false)
    const currentDialogId = ref(null);

    const sendToAllDialogs = (message) => checkedRowKeysRef.value.forEach((data) => store.dispatch('sendMessageToDialog', {
      ...JSON.parse(data),
      message
    }));

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
      onSendMessage,
      checkedRowKeysRef,
      handleCheck(rowKeys) {
        if (!rowKeys.length) collapsed.value = false
        checkedRowKeysRef.value = rowKeys
      },
      collapsed,
      sendToAllDialogs,
      selectedEventsForFilter,
      eventsForFilter
    }
  }
})
</script>