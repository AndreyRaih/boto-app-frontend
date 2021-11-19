<template>
    <div class="boto-drawflow-container">
        <div id="boto-drawflow"></div>
        <div class="boto-drawflow-controls">
            <n-button @click="onZoomIn" circle>
                <template #icon>
                    <n-icon>
                        <plus />
                    </n-icon>
                </template>
            </n-button>
            <n-button @click="onZoomOut" circle>
                <template #icon>
                    <n-icon>
                        <minus />
                    </n-icon>
                </template>
            </n-button>
        </div>
    </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, watch, reactive } from "vue";
import "drawflow/dist/drawflow.min.css";
import { NButton, NIcon, useMessage } from "naive-ui";
import { Minus, Plus } from "@vicons/tabler"
import { useStore } from 'vuex';
import useDrawflowBuilder from './hooks/useDrawflowBuilder';
import useBuiltInPatterns from './hooks/useBuiltInPatterns';
import { useRoute } from "vue-router";

export default defineComponent({
    name: "BotoScenarioVisualEditor",
    components: { NButton, NIcon, Minus, Plus },
    setup() {
        const store = useStore();
        const messages = useMessage();
        const route = useRoute();
        let messageReactive = reactive(null)

        const drawflow = useDrawflowBuilder();
        const builtInPatterns = useBuiltInPatterns()

        watch(() => store.state.scenarios.editInProgress, handleIndicatorState)
        watch(() => route.query, (value) => value && value.module && onSelectModule(value.module))

        onMounted(start)
        onUnmounted(stop)

        drawflow.on('add', onUpdateData);
        drawflow.on('update', onUpdateData);
        drawflow.on('remove', onUpdateData)

        function handleIndicatorState(state) {
            if (state) {
                messageReactive = messages.loading(
                    'Сохранение...',
                    { duration: 0 }
                )
            } else {
                messageReactive.destroy()
                messageReactive = null
                messages.success('Успешно сохранено', { duration: 3000 })
            }
        }

        function start() {
            drawflow.start()
            drawflow.set(store.state.scenarios.currentScenario ? store.state.scenarios.currentScenario.stages : []);
            store.dispatch('runSync')
        }

        function stop() {
            if (messageReactive) {
                messageReactive.destroy()
                messageReactive = null
            }
            drawflow.clear()
            store.dispatch('stopSync')
        }

        function onUpdateData (updates) {
            store.dispatch('updateScenario', updates);
        }

        const onSelectModule = (type) => {
            const module = builtInPatterns.getPatternByType(type)
            drawflow.clear()
            setTimeout(() => {
                drawflow.setModule(module)
            }, 0);
        }

        return {
            onZoomIn: () => drawflow.zoomIn(),
            onZoomOut: () => drawflow.zoomOut()
        }
    }
})
</script>

<style lang="stylus">
.boto-drawflow-container {
    position relative
    width: 100%;
    height: 100%;
    .boto-drawflow-controls {
        position absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        top: 24px;
        right: 24px
        & > *:not(:last-of-type) {
            margin-bottom: 4px;
        }
    }
}
#boto-drawflow {
    width: 100%;
    height: 100%;
    .drawflow-node {
        display: flex;
        align-items: center;
        position: absolute;
        background: #fff;
        min-height: 40px;
        min-width: 280px;
        max-width: 280px;
        width: auto;
        border-radius: 4px;
        border: 1px solid #eee;
        box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, .1);
        color: #000;
        z-index: 2;
        padding: 15px;
    }
    .parent-node .drawflow-delete {
        right: -10px;
        top: -10px;
    }
    .drawflow-delete {
        display: none;
    }
    .drawflow-node .input {
        background: #fff;
    }
    .drawflow-node .input, .drawflow-node .output {
        position: relative;
        width: 24px;
        height: 24px;
        background: #fff;
        border-radius: 50%;
        border: 1px solid #eee;
        box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, .1);
        cursor: crosshair;
        z-index: 1;
        margin-bottom: 5px;
    }
}
</style>
