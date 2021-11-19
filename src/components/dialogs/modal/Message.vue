<template>
  <n-upload
    :key="media ? media.length : 0"
    :default-file-list="media"
    accept="image/*, video/mp4"
    @before-upload="onAddFile"
    @remove="onRemoveFile"
    abstract
  >
    <editable-input
      :class="$style.input"
      placeholder="Введите текст сообщения..."
      v-model:value="text"
      @keypress.enter.shift="onSendMessage"
    >
      <template #actions>
        <div :class="$style.actions">
          <n-button @click="onSendMessage" circle>
            <template #icon>
              <n-icon>
                <send-icon />
              </n-icon>
            </template>
          </n-button>
          <n-upload-trigger #="{ handleClick }" abstract>
            <n-button @click="handleClick" circle>
              <n-icon>
                <file-icon />
              </n-icon>
            </n-button>
          </n-upload-trigger>
        </div>
      </template>
    </editable-input>
    <n-text :depth="3">Для отправки: Enter+Shift</n-text>
    <n-upload-file-list />
  </n-upload>
</template>

<style lang="stylus" module>
.actions {
  display: flex
  & > * {
    margin-left: 8px;
  }
}
</style>

<script>
import { defineComponent, ref } from "vue";
import { NButton, NIcon, NText, NUpload, NUploadTrigger, NUploadFileList } from "naive-ui"
import { Send as SendIcon, File as FileIcon } from '@vicons/tabler'
import EditableInput from "../../shared/EditableInput.vue";

export default defineComponent({
  name: "BotoDialogMessage",
  components: {
    NButton,
    NIcon,
    SendIcon,
    NText,
    EditableInput,
    NUpload, NUploadTrigger, NUploadFileList, FileIcon
  },
  emits: ['boto-dialog-message:send'],
  setup(props, { emit }) {
    const text = ref(null);
    const media = ref([]);

    function onSendMessage() {
      emit('boto-dialog-message:send', { text: text.value, media: media.value })
    }

    return {
      text,
      media,
      onAddFile: ({ file }) => media.value.push({ status: 'finished', isUploaded: false, id: file.id, name: file.name, file: file.file, url: file.url, type: file.type }),
      onRemoveFile: ({ file }) => {
        const pos = media.value.findIndex((item) => item.id === file.id)
        media.value.splice(pos, 1);
      },
      onSendMessage
    }
  }
})
</script>
