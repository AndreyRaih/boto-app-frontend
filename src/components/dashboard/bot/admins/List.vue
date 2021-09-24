<template>
  <n-h3>Администраторы</n-h3>
  <n-card :content-style="{ maxHeight: '40vh', overflowX: 'auto' }" hoverable>
    <n-empty description="Список пуст" v-show="!list.length" />
    <n-list>
      <n-list-item v-for="admin in list" :key="admin.id">
        <template #suffix>
          <n-button @click="$emit('boto-bot-admins:delete-admin', admin.id)" size="tiny" circle>
            <template #icon>
              <n-icon><trash-icon /></n-icon>
            </template>
          </n-button>
        </template>
        <n-text>
          {{ admin.contactData.name }}
        </n-text>
      </n-list-item>
    </n-list>
    <template #action>
      <n-button @click="$emit('boto-bot-admins:add-new')">
          Добавить
          <template #icon>
            <n-icon><plus-icon /></n-icon>
          </template>
      </n-button>
    </template>
  </n-card>
</template>

<script>
import { defineComponent } from 'vue'
import { NCard, NList, NListItem, NButton, NText, NIcon, NH3, NEmpty } from "naive-ui";
import { Trash as TrashIcon, Plus as PlusIcon } from '@vicons/tabler';

export default defineComponent({
  name: "BotoBotAdministratorsList",
  components: {
    NCard, NList, NListItem, NButton, NText, NIcon, TrashIcon, NH3, NEmpty, PlusIcon
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  emits: ["boto-bot-admins:add-new", "boto-bot-admins:delete-admin"]
})
</script>