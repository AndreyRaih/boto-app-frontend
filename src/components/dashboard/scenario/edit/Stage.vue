<template>
    <n-modal
        class="custom-card"
        :show="show"
        preset="card"
        :style="{ maxWidth: '600px', margin: '48px auto' }"
        :title="title"
        bordered
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
                <n-form-item label="Описание" required :rule="triggerDescriptionRule">
                    <n-input
                        placeholder="Введите описание"
                        v-model:value="updates.trigger.description"
                    />
                </n-form-item>
            </n-space>
            <n-form-item
                v-show="updates.trigger.type === 'button'"
                label="Текст кнопки"
                required
                :rule="triggerRule"
            >
                <n-input placeholder="Введите описание" v-model:value="updates.trigger.text" />
            </n-form-item>
            <template v-if="updates.trigger.type === 'input'">
                <n-form-item label="Валидация ввода">
                    <n-select
                        placeholder="Выберите валидацию"
                        :options="validators"
                        v-model:value="updates.trigger.validation"
                    />
                </n-form-item>
                <n-space
                    v-show="updates.trigger.validation === 'word'"
                    :item-style="{ width: '45%' }"
                    justify="space-between"
                    align="center"
                >
                    <n-form-item label="Текст">
                        <n-input
                            placeholder="Выберите текст"
                            v-model:value="updates.trigger.matchString"
                        />
                    </n-form-item>
                    <n-switch size="small" v-model:value="updates.trigger.inputNeedMatch">
                        <template #checked>Полное совпадение</template>
                        <template #unchecked>Частичное совпадение</template>
                    </n-switch>
                </n-space>
            </template>
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
            v-if="isNeedCustomEvent"
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
                <n-button
                    :disabled="isFormInvalid"
                    :loading="isLoading"
                    @click="onSubmitChanges"
                    type="primary"
                >Изменить</n-button>
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
import { NFormItem, NInput, NUpload, NModal, NH4, NButton, NUploadDragger, NText, NIcon, NSpace, NDivider, NRadioGroup, NRadioButton, NSelect, NCheckbox, NSwitch } from "naive-ui";
import { Archive as ArchiveIcon } from '@vicons/tabler'
import { FORM_CONTENT } from "@/common/formContent";
export default defineComponent({
    name: "BotoEditStage",
    components: {
        NFormItem, NInput, NUpload, NModal, NButton, NUploadDragger, NText, NH4, NIcon, ArchiveIcon, NSpace, NDivider, NRadioGroup, NRadioButton, NSelect, NCheckbox, NSwitch
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
        const types = ref(FORM_CONTENT.triggerTypes)
        const validators = ref(FORM_CONTENT.validations)
        const updates = ref({
            text: null,
            images: [],
            trigger: { ...FORM_CONTENT.defaults.trigger },
            event: { ...FORM_CONTENT.defaults.event },
        })
        const isNeedCustomEvent = ref(false);

        const isFormInvalid = computed(() => {
            const noStageText = !updates.value.text;
            const noTrigger = !props.root && (!updates.value.trigger.description || (updates.value.trigger.type === 'button' && !updates.value.trigger.text));
            return Boolean(noStageText || noTrigger)
        })

        watch(() => props.show, (showVal) => !showVal && cleanForm());

        const cleanForm = () => {
            updates.value = {
                text: null,
                images: [],
                trigger: { ...FORM_CONTENT.defaults.trigger },
                event: { ...FORM_CONTENT.defaults.event },
            };
            isNeedCustomEvent.value = false;
        }

        const onSubmitChanges = () => emit('boto-stage-editor:create-stage', updates.value);

        return {
            title: computed(() => props.isNew ? 'Добавление нового шага' : 'Редактирование шага'),
            types,
            validators,
            updates,
            isNeedCustomEvent,
            labelRule: {
                ...FORM_CONTENT.rules.labelRule,
                validator: () => Boolean(updates.value.text)
            },
            triggerRule: {
                ...FORM_CONTENT.rules.triggerRule,
                validator: () => updates.value.trigger.type === 'button' ? Boolean(updates.value.trigger.text) : true
            },
            triggerDescriptionRule: {
                ...FORM_CONTENT.rules.triggerDescriptionRule,
                validator: () => Boolean(updates.value.trigger.description)
            },
            onAddFile: ({ file }) => updates.value.images.push({ id: file.id, file: file.file }),
            onRemoveFile: ({ file }) => {
                const pos = updates.value.images.findIndex((item) => item.id === file.id)
                updates.value.images.splice(pos, 1);
            },
            isFormInvalid,
            onSubmitChanges
        }
    }
})
</script>