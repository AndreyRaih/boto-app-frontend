<template>
    <n-steps :class="$style.container" :current="step">
        <n-step
            v-for="(step, index) in innerSteps"
            :internal-index="index + 1"
            :key="index"
            :title="step.title"
        >
            <div :class="$style.text" v-html="step.content"></div>
            <n-space :class="$style.input" v-if="Boolean(step.form)">
                <n-form-item
                    v-for="(input, inputIndex) in step.form"
                    :class="$style.item"
                    :label="input.label"
                    :key="`input-${inputIndex}`"
                    :validation-status="input.hasError ? 'error' : 'success'"
                    :feedback="input.errorMsg"
                    :show-feedback="input.hasError"
                >
                    <n-input
                        :placeholder="input.label"
                        @change="(value) => onFormInput(value, input)"
                    />
                </n-form-item>
            </n-space>
            <n-space>
                <n-button
                    @click="getActionHandlerByIndex(index)"
                    :disabled="getDisabledStateByIndex(index)"
                    type="primary"
                >{{ getActionTextByIndex(index) }}</n-button>
                <n-button
                    @click="onPrevStep"
                    :disabled="getDisabledStateByIndex(index)"
                    v-show="index > 0"
                >Назад</n-button>
            </n-space>
        </n-step>
    </n-steps>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { NSteps, NStep, NSpace, NButton, NInput, NFormItem } from 'naive-ui';

export default defineComponent({
    name: "BotoBuilderStage",
    components: {
        NSteps, NStep, NSpace, NButton, NInput, NFormItem
    },
    props: {
        step: {
            type: Number,
            default: 1
        },
        steps: {
            type: Array,
            default: () => []
        }
    },
    emits: ["boto-builder-stage:complete-stage", "boto-builder-stage:update-form", "update:step"],
    setup(props, { emit }) {
        const innerSteps = ref([])
        watch(() => props.steps, (val) => innerSteps.value = val, { deep: true, immediate: true })
        const onNextStep = () => emit("update:step", props.step + 1);
        const onPrevStep = () => emit("update:step", props.step - 1);
        const onComplete = () => emit("boto-builder-stage:complete-stage");
        const onFormInput = (value, input) => {
            if (input.validator) input.hasError = !input.validator(value)
            if (!input.hasError) {
                const { field: key } = input
                emit("boto-builder-stage:update-form", { key, value })
            }
        };

        const getDisabledStateByIndex = (index) => index + 1 !== props.step;
        const getActionTextByIndex = (index) => index + 1 < props.steps.length ? 'Далее' : 'Завершить';
        const getActionHandlerByIndex = (index) => index + 1 < props.steps.length ? onNextStep() : onComplete();

        return {
            innerSteps,
            onNextStep,
            onPrevStep,
            onFormInput,
            getDisabledStateByIndex,
            getActionTextByIndex,
            getActionHandlerByIndex
        }
    },
})
</script>

<style lang="stylus" module>
    .container {
        margin 24px 0;
    }

    .text, .input {
        padding-bottom 18px
    }
    .item {
        max-width: 20vw
    }
</style>
