<template>
    <n-modal
        class="custom-card"
        :show="show"
        preset="card"
        :style="{ maxWidth: '600px' }"
        :title="title"
        :bordered="false"
        @update:show="(val) => $emit('update:show', val)"
        size="huge"
        :segmented="{
            content: 'soft',
            footer: 'soft'
        }"
    >
    <template v-if="!root">
            <n-h4>Настройки триггера</n-h4>
            <n-space :item-style="{ width: '45%' }" justify="space-between">
                <n-form-item label="Тип">
                    <n-radio-group v-model:value="updates.trigger.type" name="radiobuttongroup1">
                        <n-radio-button
                            v-for="item in types"
                            :key="item.value"
                            :value="item.value"
                        >{{ item.label }}</n-radio-button>
                    </n-radio-group>
                </n-form-item>
                <n-form-item label="Описание" required :rule="triggerDescriptionRule" >
                    <n-input
                        placeholder="Введите описание"
                        v-model:value="updates.trigger.description"
                    />
                </n-form-item>
            </n-space>
            <n-form-item v-show="updates.trigger.type === 'button'" label="Текст кнопки" required :rule="triggerRule" >
                <n-input placeholder="Введите описание" v-model:value="updates.trigger.text" />
            </n-form-item>
            <n-space
                :item-style="{ width: '45%' }"
                justify="space-between"
                v-show="updates.trigger.type === 'input'"
            >
                <n-form-item v-show="updates.trigger.type === 'input'" label="Валидация ввода">
                    <n-select
                        placeholder="Выберите валидацию"
                        :options="validators"
                        v-model:value="updates.trigger.validation"
                    />
                </n-form-item>
                <n-form-item v-show="updates.trigger.validation === 'word'" label="Теги">
                    <n-input placeholder="Выберите валидацию" v-model:value="updates.trigger.text" />
                </n-form-item>
            </n-space>
            <n-divider />
        </template>
        <n-h4>Настройки сообщения</n-h4>
        <n-form-item label="Загрузка изображения">
            <n-upload
                :class="$style.uploader"
                multiple
                accept="image/*"
                @before-upload="onAddFile"
                @remove="onRemoveFile"
            >
                <n-upload-dragger>
                    <div style="margin-bottom: 12px;">
                        <n-icon size="48" :depth="3">
                            <archive-icon />
                        </n-icon>
                    </div>
                    <n-text style="font-size: 16px;">Кликните или перетащите сюда файл для загрузки</n-text>
                </n-upload-dragger>
            </n-upload>
        </n-form-item>
        <n-form-item required :rule="labelRule" label="Текст">
            <n-input type="textarea" placeholder="Текст для шага..." v-model:value="updates.text" />
        </n-form-item>
        <n-divider />
        <n-h4>Добавить событие</n-h4>
        <n-checkbox v-model:checked="isNeedCustomEvent">Добавить событие</n-checkbox>
        <n-space
            v-show="isNeedCustomEvent"
            :item-style="{ marginTop: '8px', width: '45%' }"
            justify="space-between"
        >
            <n-form-item label="Идентификатор">
                <n-input placeholder="Введите ID событие" v-model:value="updates.event.value" />
            </n-form-item>
            <n-form-item label="Название">
                <n-input placeholder="Введите название" v-model:value="updates.event.label" />
            </n-form-item>
        </n-space>
        <template #footer>
            <n-space justify="end">
                <n-button :loading="isLoading" @click="onChange" type="primary">Изменить</n-button>
            </n-space>
        </template>
    </n-modal>
</template>

<style lang="stylus" module>
.uploader {
    width: 100%
}
</style>

<script>
import { computed, defineComponent, ref, watch } from "vue";
import { NFormItem, NInput, NUpload, NModal, NH4, NButton, NUploadDragger, NText, NIcon, NSpace, NDivider, NRadioGroup, NRadioButton, NSelect, NCheckbox } from "naive-ui";
import { Archive as ArchiveIcon } from '@vicons/tabler'
export default defineComponent({
    name: "BotoEditStage",
    components: {
        NFormItem, NInput, NUpload, NModal, NButton, NUploadDragger, NText, NH4, NIcon, ArchiveIcon, NSpace, NDivider, NRadioGroup, NRadioButton, NSelect, NCheckbox
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        isLoading: {
            type: Boolean,
            default: false
        },
        root: {
            type: Boolean,
            default: false
        }
    },
    emits: ["boto-stage-editor:create-stage", "update:show"],
    setup(props, { emit }) {
        const types = ref([
            {
                label: 'Кнопка',
                value: 'button'
            },
            {
                label: 'Ввод',
                value: 'input'
            }
        ])
        const validators = ref([
            {
                label: 'Email',
                value: 'email'
            },
            {
                label: 'Телефон',
                value: 'phone'
            },
            {
                label: 'Адрес',
                value: 'address'
            },
            {
                label: 'Сумма',
                value: 'price'
            },
            {
                label: 'Возраст',
                value: 'age'
            },
            {
                label: 'Теги',
                value: 'word'
            }
        ])
        const formRef = ref(null)
        const updates = ref({
            text: null,
            images: [],
            trigger: {
                type: 'button',
                description: null,
                text: null,
                validation: null
            },
            event: {
                label: null,
                value: null
            }
        })

        const isNeedCustomEvent = ref(false);

        const cleanForm = () => {
            updates.value = {
                text: null,
                image: [],
                trigger: {
                    type: null,
                    description: null,
                    text: null,
                    validation: null
                },
                event: {
                    label: null,
                    value: null
                }
            };
            isNeedCustomEvent.value = false
        }

        watch(() => props.show, (showVal) => !showVal && cleanForm());
        const onChange = () => {
            if (!updates.value.text || (!props.root && (!updates.value.trigger.description || updates.value.trigger.type === 'button' && !updates.value.trigger.text))) return;
            return emit('boto-stage-editor:create-stage', updates.value);
        }
        return {
            formRef,
            title: computed(() => props.isNew ? 'Добавление нового шага' : 'Редактирование шага'),
            types,
            validators,
            updates,
            onChange,
            isNeedCustomEvent,
            labelRule: {
                required: true,
                validator: () => Boolean(updates.value.text),
                message: 'Текст сообщения обязателен!',
                trigger: 'blur'
            },
            triggerRule: {
                required: true,
                validator: () => updates.value.trigger.type === 'button' ? Boolean(updates.value.trigger.text) : true,
                message: 'Текст триггера обязателен!',
                trigger: 'blur'
            },
            triggerDescriptionRule: {
                required: true,
                validator: () => Boolean(updates.value.trigger.description),
                message: 'Описание триггера обязательно!',
                trigger: 'blur'
            },
            onAddFile: ({ file }) => updates.value.images.push({ id: file.id, file: file.file }),
            onRemoveFile: ({ file }) => {
                const pos = updates.value.images.findIndex((item) => item.id === file.id)
                updates.value.images.splice(pos, 1);
            }
        }
    }
})
</script>