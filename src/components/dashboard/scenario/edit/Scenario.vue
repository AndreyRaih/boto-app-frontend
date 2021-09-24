<template>
    <n-modal
        class="custom-card"
        :show="show"
        preset="card"
        :style="{ maxWidth: '600px' }"
        title="Добавление нового сценария"
        :bordered="false"
        @update:show="(val) => $emit('update:show', val)"
        size="huge"
        :segmented="{
          content: 'soft',
          footer: 'soft'
        }"
    >
        <n-form-item label="Введите название сценария">
            <n-input v-model:value="scenarioLabel" placeholder="Введите название сценария..." />
        </n-form-item>
        <template #footer> 
          <n-space justify="flex-end">
            <n-button
            @click="onAddNew"
            type="primary">Создать</n-button>
          </n-space>
        </template>
    </n-modal>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { NModal, NSpace, NButton, NFormItem, NInput } from "naive-ui";

export default defineComponent({
    name: "BotoAddingScenarioModal",
    components: {
        NModal, NSpace, NButton, NFormItem, NInput
    },
    props: {
        show: {
            type:Boolean,
            default: true
        }
    },
    emits: ["update:show", "boto-scenario-edit-modal:add"],
    setup(props, { emit }) {
        const scenarioLabel = ref(null);

        const onAddNew = () => {
            emit('boto-scenario-edit-modal:add', { label: scenarioLabel.value })
            emit('update:show', false)
        }

        watch(() => props.show, () => scenarioLabel.value = null)

        return {
            scenarioLabel,
            onAddNew
        }
    }
})
</script>