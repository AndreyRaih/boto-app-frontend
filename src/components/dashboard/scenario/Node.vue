<template>
    <div class="boto-node">
        <n-space justify="space-between">
            <n-h5 prefix="bar">
                <div>{{ node.title || 'Шаг' }}</div>
                <n-text>
                    Событие:
                    <n-text
                        :type="event && event.label ? 'success' : 'default'"
                    >{{ event && event.label ? event.label : 'пусто' }}</n-text>
                </n-text>
            </n-h5>
            <n-space justify="end">
                <n-popover trigger="manual" :show="showEventPopover" raw>
                    <template #trigger>
                        <n-button @click="showEventPopover=!showEventPopover" text style="font-size: 24px;">
                            <n-icon>
                                <flare-icon />
                            </n-icon>
                        </n-button>
                    </template>
                    <n-input-group class="boto-node__event-create-form">
                        <n-input
                            placeholder="Событие"
                            v-model:value="newEventText"
                            type="text"
                            size="small"
                            :style="{ width: '75%' }"
                            @keyup.enter="addEvent"
                        />
                        <n-button :disabled="!newEventText || newEventText.length < 3" size="small" type="primary" @click="addEvent">Создать</n-button>
                    </n-input-group>
                </n-popover>
                <n-button v-show="!isRoot" @click="removeNode" text style="font-size: 24px;">
                    <n-icon>
                        <trash-icon />
                    </n-icon>
                </n-button>
            </n-space>
        </n-space>
        <n-text>Изображения</n-text>
        <n-upload
            :key="fileList ? fileList.length : 0"
            :default-file-list="fileList"
            accept="image/*"
            list-type="image-card"
            @before-upload="onAddFile"
            @remove="onRemoveFile"
        >Upload</n-upload>
        <n-divider />
        <n-text>Текст</n-text>
        <n-input
            type="textarea"
            placeholder="Введите текст сообщения"
            v-model:value="text"
            @blur="updateNode"
            clearable
            :autosize="{
                minRows: 1
            }"
        />
        <n-text :depth="3">Доступные действия:</n-text>
        <div class="boto-node__actions">
            <n-popover v-for="trigger in triggers" :key="trigger.text" trigger="manual" :show="trigger.visible" raw>
                <template #trigger>
                    <n-button @click="trigger.visible = !trigger.visible" >{{ trigger.text }}</n-button>
                </template>
                <n-input-group class="boto-node__action-create-form">
                    <n-input
                        v-model:value="trigger.text"
                        type="text"
                        size="small"
                        placeholder="Введите текст кнопки"
                        clearable
                        @keyup.enter="updateNode"
                        :style="{ width: '75%' }"
                    />
                    <n-button :disabled="!trigger.text" size="small" type="primary" @click="updateNode">Добавить</n-button>
                </n-input-group>
            </n-popover>
            <n-popover trigger="manual" :show="showActionPopover" raw>
                <template #trigger>
                    <n-button @click="showActionPopover = !showActionPopover" dashed>Добавить</n-button>
                </template>
                <n-input-group class="boto-node__action-create-form">
                    <n-input
                        v-model:value="newActionText"
                        type="text"
                        size="small"
                        placeholder="Введите текст кнопки"
                        clearable
                        @keyup.enter="addAction"
                        :style="{ width: '75%' }"
                    />
                    <n-button :disabled="!newActionText || newActionText.length < 3" size="small" type="primary" @click="addAction">Добавить</n-button>
                </n-input-group>
            </n-popover>
        </div>
    </div>
</template>

<style lang="stylus">
.boto-node {
    h4 {
        margin-bottom: 12px;
    }
    h5 {
        margin-top: 0px;
        margin-bottom: 8px;
    }
    .n-divider {
        margin: 8px 0px;
    }
    .n-text {
        font-size: 10px;
    }
    &__actions {
        display: flex;
        flex-direction: column;
        * {
            margin: 2px 0px
        }
    }
    &__action-create-form, &__event-create-form {
        display: flex
        padding: 8px;
        background: #fff
        border-radius: 4px;
    }
    .n-upload-file-list--grid {
        display: flex;
    }
    .n-upload-file-list .n-upload-file.n-upload-file--image-card-type, .n-upload-trigger.n-upload-trigger--image-card {
        width: 50px;
        height: 50px;
        font-size: 12px;
    }
    .n-upload-file-list .n-upload-file.n-upload-file--image-card-type i {
        font-size: 12px;
    }
    .n-upload-file-list .n-upload-file .n-upload-file-info .n-upload-file-info__action .n-button {
        margin-right: 0
    }
    .n-upload-file--info-status {
        display: none!important
    }
}
</style>

<script>
import { NUpload, NDivider, NInput, NButton, NH5, NText, NPopover, NInputGroup, NSpace, NIcon } from 'naive-ui'
import { Trash as TrashIcon, Flare as FlareIcon } from "@vicons/tabler"
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'
var emitter = require('tiny-emitter/instance');

export const BOTO_SCENARIO_BUILDER_DELETE_NODE_EVENT = 'BOTO-BUILDER:NODE-REMOVE'

export default defineComponent({
    components: {
        NUpload, NDivider, NInput, NButton, NPopover, NH5, NText, NInputGroup, NSpace, NIcon, TrashIcon, FlareIcon
    },
    props: {
        node: {
            type: Object,
            required: true,
            default: () => ({})
        },
        isRoot: {
            type: Boolean,
            default: false
        }
    },
    emits: ['updateNode', 'addTrigger', 'removeNode'],
    setup(props, { emit }) {
        const text = ref(props.node.text);
        const event = ref(props.node.event);
        const triggers = ref(props.node.triggers.map(
            trigger => ({
                ...trigger,
                visible: false
            })
        ));
        const fileList = ref(props.node.images && props.node.images.map((image) => {
            if (typeof image === 'string') {
                return { status: 'finished', isUploaded: true, id: image, name: image, file: null, url: image }
            } else {
                return image;
            }
        }));
        const newActionText = ref(null);
        const newEventText = ref(null);
        const showActionPopover = ref(false);
        const showEventPopover = ref(false);

        onMounted(() => {
            emitter.on(BOTO_SCENARIO_BUILDER_DELETE_NODE_EVENT, (id) => {
                triggers.value = triggers.value.filter(({ destinationId}) => destinationId !== id);
            });
        })
        onUnmounted(() => emitter.off(BOTO_SCENARIO_BUILDER_DELETE_NODE_EVENT))

        const updatedNode = computed(() => ({
                ...props.node,
                text: text.value,
                images: fileList.value,
                event: Object.assign({}, props.node.event, event.value),
                triggers: triggers.value  
        }));

        function updateNode() {
            emit('updateNode', updatedNode.value)
        }

        function addAction() {
            const trigger = { text: newActionText.value };
            triggers.value.push(trigger)
            emit('addTrigger', updatedNode.value)
            newActionText.value = null;
            showActionPopover.value = false;
        }

        function addEvent() {
            event.value = { label: newEventText.value }
            updateNode();
            newEventText.value = null
        }

        function removeNode() {
            emit('removeNode');
        }

        return {
            newActionText,
            newEventText,
            triggers,
            text,
            addAction,
            addEvent,
            removeNode,
            updateNode,
            event,
            showActionPopover,
            showEventPopover,
            onAddFile: ({ file }) => {
                fileList.value.push({ status: 'finished', isUploaded: false, id: file.id, name: file.name, file: file.file, url: file.url });
                if (!props.node.images.some(({ id }) => id === file.id)) updateNode()
            },
            onRemoveFile: ({ file }) => {
                const pos = fileList.value.findIndex((item) => item.id === file.id)
                fileList.value.splice(pos, 1);
                updateNode()
            },
            fileList
        }
    }
})
</script>