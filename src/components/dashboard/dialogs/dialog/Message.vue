<template>
  <div :class="$style.container">
    <n-input v-model:value="text" round placeholder="Введите текст сообщения" />
    <n-button @click="() => $emit('boto-dialog-message:send', text)" circle>
      <template #icon>
        <n-icon><send-icon /></n-icon>
      </template>
    </n-button>
  </div>
</template>

<style lang="stylus" module>
.container {
    display: flex;
  > *:last-child {
    margin-left: 8px;
    min-width: 34px;
  }
}
</style>

<script>
import { defineComponent, ref } from "vue";
import { NInput, NButton, NIcon } from "naive-ui"
import { Send as SendIcon } from '@vicons/tabler'

export default defineComponent({
  name: "BotoDialogMessage",
  components: {
    NInput, NButton, NIcon, SendIcon
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
