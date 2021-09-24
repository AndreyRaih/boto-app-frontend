<template>
  <n-space item-style="align-self: center" justify="space-between">
    <div :class="$style.info">
      <n-h2 :class="$style.name" prefix="bar" align-text>
        <n-text>{{ name }}</n-text>
      </n-h2>
      <div :class="$style.additional">

        <n-text :class="$style.status">
        Статус: <n-gradient-text :type="status.color"> {{ status.text }} </n-gradient-text>
      </n-text>
      <n-text :class="$style.status">Cценарий: {{ scenario || 'Нет данных' }}</n-text>
      </div>
    </div>
  <div :class="$style.buttons">
    <n-button @click="showModal = true" circle>
      <template #icon>
        <n-icon><edit-icon /></n-icon>
      </template>
    </n-button>
    <n-modal
      v-model:show="showModal"
      style="width: 600px;"
    >
      <n-card title="Редактирование бота" :bordered="false" size="huge">
        <n-thing>
          <template #avatar>
            <n-avatar>
            <n-icon>
              <camera-icon />
            </n-icon>
          </n-avatar>
          </template>
          <template #header>
            Добавление фото
          </template>
          - Перейти в чат с <a href="https://telegram.me/BotFather" target="_blank">@BotFather</a><br/>
          - После ввести команду - <strong>/setuserpic</strong><br />
          - Прислать фото в следующем сообщении<br/>
        </n-thing>
        <n-divider />
        <n-thing>
          <template #avatar>
            <n-avatar>
            <n-icon>
              <info-icon />
            </n-icon>
          </n-avatar>
          </template>
          <template #header>
            Добавление описания
          </template>
          - Перейти в чат с <a href="https://telegram.me/BotFather" target="_blank">@BotFather</a><br/>
          - После ввести команду - <strong>/setabouttext</strong><br />
          - Прислать текст в следующем сообщении
        </n-thing>
      </n-card>
    </n-modal>

    <n-button @click="$emit('boto-bot-header:delete-bot')" type="error" circle>
      <template #icon>
        <n-icon><trash-icon /></n-icon>
      </template>
    </n-button>
  </div>
  </n-space>
</template>

<style lang="stylus" module>
  .info {
    display flex;
    flex-direction column;
    height: 45px;
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
import { computed, defineComponent, ref } from "vue";
import { NH2, NText, NGradientText, NSpace, NButton, NIcon, NModal, NCard, NThing, NDivider, NAvatar } from "naive-ui"
import { Trash as TrashIcon , EditCircle as EditIcon, Camera as CameraIcon, InfoCircle as InfoIcon } from '@vicons/tabler'
export default defineComponent({
  name: "BotoBotHeader",
  components: {
    NH2, NText, NGradientText, NSpace, NButton, NIcon, TrashIcon, EditIcon, NModal, NCard, NThing, NDivider, CameraIcon, InfoIcon, NAvatar
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
    const status = computed(() => {
      switch (props.state) {
        case 'online':
          return {
            text: 'Он-лайн',
            color: 'success'
          }
        case 'offline':
          return {
            text: 'Офф-лайн',
            color: 'error'
          }
        default:
          return {
            text: 'Неизвестно'
          }
      }
    })
    return {
      status,
      showModal: ref(false)
    }
  }
});
</script>