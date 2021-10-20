<template>
  <div :class="$style.container">
    <n-input
      type="textarea"
      :autosize="{
        minRows: 1
      }"
      @keypress.enter.shift="() => $emit('boto-dialog-message:send', text)"
      v-model:value="text"
      placeholder="Введите текст сообщения"
    />
    <n-button @click="() => $emit('boto-dialog-message:send', text)" circle>
      <template #icon>
        <n-icon>
          <send-icon />
        </n-icon>
      </template>
    </n-button>
  </div>
  <n-text :depth="3">Для отправки: Enter+Shift</n-text>
</template>

<style lang="stylus" module>
.container {
    display: flex;
    margin-bottom: 4px;
  > *:last-child {
    margin-left: 8px;
    min-width: 34px;
  }
}
</style>

<script>
import { defineComponent, ref } from "vue";
import { NInput, NButton, NIcon, NText } from "naive-ui"
import { Send as SendIcon } from '@vicons/tabler'

export default defineComponent({
  name: "BotoDialogMessage",
  components: {
    NInput, NButton, NIcon, SendIcon, NText
  },
  emits: ['boto-dialog-message:send'],
  setup() {
    const text = ref(null);
    return {
      text
    }
  }
})
</script>
