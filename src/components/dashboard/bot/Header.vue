<template>
  <n-space item-style="align-self: center" justify="space-between">
    <div :class="$style.info">
      <n-h2 :class="$style.name" prefix="bar" align-text>
        <n-text>{{ name }}</n-text>
      </n-h2>
      <n-button @click="copyBotLink">
        <template #icon>
          <n-icon>
            <share-icon />
          </n-icon>
        </template>
        Скопировать ссылку
      </n-button>
    </div>
    <div :class="$style.buttons">
      <n-button @click="showModal = true" circle>
        <template #icon>
          <n-icon>
            <edit-icon />
          </n-icon>
        </template>
      </n-button>
      <n-modal v-model:show="showModal" style="width: 350px;">
        <n-card title="Редактирование бота" :bordered="false" size="huge">
          <div style="margin-bottom: 16px">Перейти в чат с
            <n-a href="https://telegram.me/BotFather" target="_blank">@BotFather</n-a>:
          </div>
          <n-list bordered>
            <n-list-item>
              <strong>/setuserpic</strong> - добавление фото
            </n-list-item>
            <n-list-item>
              <strong>/setabouttext</strong> - добавление описания
            </n-list-item>
          </n-list>
        </n-card>
      </n-modal>

      <n-button @click="$emit('boto-bot-header:delete-bot')" type="error" circle>
        <template #icon>
          <n-icon>
            <trash-icon />
          </n-icon>
        </template>
      </n-button>
    </div>
  </n-space>
</template>

<style lang="stylus" module>
  .info {
    display flex;
    flex-direction row;
  }
  .additional {
    display: flex
    (local):first-child {
      margin-right: 4px;
    }
  }
  .name {
    margin-bottom: 0;
    margin-right: 16px;
  }
  .status {
    font-size 12px
  }
  .buttons {
    display flex;
    align-items center;
    (local):first-child {
      margin-right: 8px;
    }
  }
</style>

<script>
import { defineComponent, ref, computed } from "vue";
import { NH2, NText, NSpace, NButton, NIcon, NModal, NCard, useMessage, NA, NList, NListItem } from "naive-ui"
import { Trash as TrashIcon, EditCircle as EditIcon, Share as ShareIcon } from '@vicons/tabler'
import { copyText } from 'vue3-clipboard';

export default defineComponent({
  name: "BotoBotHeader",
  components: {
    NH2, NText, NA, NSpace, NButton, NIcon, TrashIcon, EditIcon, NModal, NCard, ShareIcon, NList, NListItem
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    scenario: {
      type: String,
      default: 'Нет данных'
    },
    state: {
      type: String,
      default: 'unknown'
    }
  },
  emits: ["boto-bot-header:delete-bot"],
  setup(props) {
    const messages = useMessage();
    const tgBotLink = computed(() => `t.me/${props.name}`)
    const copyBotLink = () => copyText(tgBotLink.value, undefined, (error) => {
      if (error) {
        messages.error('Во время копирования произошла ошибка, повторите попытку позже')
      } else {
        messages.success('Ссылка на бота в Telegram успешно скопирована')
      }
    });
    return {
      showModal: ref(false),
      copyBotLink
    }
  }
});
</script>