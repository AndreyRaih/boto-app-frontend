<template>
    <n-space :item-style="loaderStyle" :class="$style.container" vertical>
        <template v-if="!loading">
            <n-space justify="space-between">
                <n-h1 prefix="bar" align-text>
                    <n-text>{{ currentStageData.title }}</n-text>
                </n-h1>
                <n-space>
                    <n-button @click="onStageNext" v-show="showSkipButton">Пропустить</n-button>
                    <n-button @click="onStageBack" v-show="showBackButton">Назад</n-button>
                </n-space>
            </n-space>
            <boto-builder-stage
                v-model:step="currentStep"
                :steps="currentStageData.steps"
                @boto-builder-stage:complete-stage="onStageNext"
                @boto-builder-stage:update-form="onUpdateForm"
            />
        </template>
        <boto-loader v-else />
    </n-space>
</template>

<script>
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import BotoBuilderStage from './Stage.vue';
import { NH1, NText, NSpace, NButton } from 'naive-ui';
import { STORAGE } from '@/common/constants';
import BotoLocalStorageManager from '@/common/localStorageManager';
import BotoLoader from "@/components/dashboard/Loader.vue"

export default defineComponent({
    name: "BotoBuilder",
    components: {
        BotoBuilderStage, NH1, NText, NSpace, NButton, BotoLoader
    },
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        stages: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    emits: ["boto-builder:building-complete"],
    setup(props, { emit }) {
        // Data
        const currentStage = ref(1);
        const currentStep = ref(1);
        const storage = new BotoLocalStorageManager();
        const data = ref([])

        const currentStageData = computed(() => props.stages[currentStage.value - 1] || { steps: [] });
        const showBackButton = computed(() => currentStage.value > 1)
        const showSkipButton = computed(() => !currentStageData.value.required)
        const loaderStyle = computed(() => props.loading ? 'height: 100%' : '');

        watch(() => currentStep.value, () => storeBuilderState())

        onMounted(() => restoreBuilderState())

        // Methods

        function restoreBuilderState() {
            const state = storage.get(STORAGE.BUILDER);
            if (state) {
                const { currentStage: stage, currentStep: step, data: storedData } = state;
                currentStage.value = stage;
                currentStep.value = step;
                data.value = storedData;
            }
        }

        function storeBuilderState() {
            const state = {
                currentStage: currentStage.value,
                currentStep: currentStep.value,
                data: data.value
            };
            storage.set(STORAGE.BUILDER, state, 3600);
        }

        function onBuildingComplete() {
            emit("boto-builder:building-complete", data.value);
            storage.remove(STORAGE.BUILDER);
            currentStage.value = 1
        }

        function onStageNext() {
            currentStep.value = 1
            if (currentStage.value < props.stages.length) {
                currentStage.value++;
            } else {
                onBuildingComplete();
            }
        }

        function onStageBack() {
            currentStep.value = 1
            if (currentStage.value > 1) currentStage.value--;
        }

        function onUpdateForm(value) {
            data.value.push(value);
        }

        return {
            currentStep,
            currentStageData,
            loaderStyle,
            showBackButton,
            showSkipButton,
            onStageNext,
            onStageBack,
            onUpdateForm
        }
    },
})
</script>

<style lang="stylus" module>
    .container {
        height: 100%;
    }
</style>