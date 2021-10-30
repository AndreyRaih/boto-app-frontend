<template>
    <div class="boto-drawflow-container">
        <div id="boto-drawflow"></div>
        <div class="boto-drawflow-controls">
            <n-popselect
                trigger="click"
                :options="options"
                @update:value="onSelectModule"
                placement="left-start"
            >
                <n-button circle>
                    <template #icon>
                        <n-icon>
                            <apps />
                        </n-icon>
                    </template>
                </n-button>
            </n-popselect>
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
import * as Vue from 'vue';
import { defineComponent, ref, onMounted, onUnmounted, computed, watch } from "vue";
import Drawflow from 'drawflow'
import "drawflow/dist/drawflow.min.css";
import Node, { BOTO_SCENARIO_BUILDER_DELETE_NODE_EVENT } from "./Node.vue";
import { NButton, NIcon, NPopselect, useMessage } from "naive-ui";
import { Minus, Plus, Apps } from "@vicons/tabler"
import { useStore } from 'vuex';
import { v4 } from 'uuid';
const emitter = require('tiny-emitter/instance');

export default defineComponent({
    name: "BotoScenarioVisualEditor",
    components: { NButton, NIcon, NPopselect, Minus, Plus, Apps },
    setup() {
        const store = useStore();
        const message = useMessage();
        const editor = ref(null);
        const stages = computed(() => store.state.scenarios.currentScenario ? store.state.scenarios.currentScenario.stages : [])
        const showProgressIndicator = computed(() => store.state.scenarios.editInProgress)
        const syncNodeId = ref(1)
        const nodes = ref([]);

        watch(() => showProgressIndicator.value, (value) => value ? showIndicator() : hideIndicator())

        onMounted(() => initEditor())
        onUnmounted(() => store.dispatch('stopSync'))

        function showIndicator() {
            message.loading(
                'Сохранение...',
                { duration: 7000 }
            )
        }

        function hideIndicator() {
            message.success('Успешно сохранено', { duration: 3000 })
        }

        const buildDefaultStage = (title) => ({
            id: v4(),
            title,
            event: null,
            triggers: [],
            text: null
        })

        function initEditor() {
            const id = document.getElementById("boto-drawflow")
            editor.value = new Drawflow(id, Vue);
            editor.value.start();

            if (!stages.value.length) {
                createNode(1, buildDefaultStage('Начало'));
            } else {
                convertStagesToNodes(stages.value)
            }
            store.dispatch('runSync')
        }

        const convertStagesToNodes = (stages) => {
            const bindings = []
            for (const node of stages) {
                const data = { ...node, name: `node-${syncNodeId.value}` };
                bindings.push({ nodeId: syncNodeId.value, id: data.id, triggers: data.triggers })
                if (syncNodeId.value > 1) {
                    const parent = stages.find(({ triggers }) => triggers.some(trigger => trigger.destinationId === node.id))
                    if (parent) {
                        const parentIndex = stages.findIndex(({ triggers }) => triggers.some(trigger => trigger.destinationId === node.id))
                        const childIndex = parent.triggers.findIndex(trigger => trigger.destinationId === node.id);
                        const { pos_x, pos_y } = editor.value.getNodeFromId(parentIndex + 1);
                        createNode(syncNodeId.value, data, { x: pos_x + 360, y: pos_y + (childIndex * 400) })
                    }
                } else {
                    createNode(syncNodeId.value, data)
                }
            }
            for (const node of bindings) {
                node.triggers.forEach((trigger) => {
                    const bindedNode = bindings.find(({ id }) => trigger.destinationId === id);
                    bindNodes(node.nodeId, bindedNode.nodeId);
                })
            }
        }

        const createNode = (index, node, { x, y } = { x: 24, y: 24 }) => {
            editor.value.registerNode(node.name, Node, {
                node,
                isRoot: index === 1,
                onUpdateNode: handleNodeUpdating,
                onAddTrigger: (node) => handleTriggerAdding(index, node),
                onRemoveNode: () => handleNodeRemoving(node)
            });
            editor.value.addNode('node', 0, 1, x, y, 'boto-node', {}, node.name, 'vue');
            nodes.value.push(node)
            syncNodeId.value += 1;
        }

        const bindNodes = (parent, child) => {
            editor.value.addNodeInput(child)
            editor.value.addConnection(parent, child, 'output_1', 'input_1')
        }

        const deleteNode = ({ id, name }) => {
            store.dispatch('deleteScenarioStage', id)
            editor.value.removeNodeId(name);
            editor.value.removeConnectionNodeId(name)
        }

        const handleNodeUpdating = (node) => store.dispatch('updateScenario', node);

        const handleTriggerAdding = (index, node) => {
            const nextIndex = syncNodeId.value
            const trigger = node.triggers[node.triggers.length - 1];
            const newNode = { ...buildDefaultStage(trigger.text), name: `node-${nextIndex}`, parentId: node.id };
            trigger.destinationId = newNode.id;
            const { pos_x, pos_y } = editor.value.getNodeFromId(node.name.slice(5));
            createNode(nextIndex, newNode, { x: pos_x + 360, y: (pos_y + ((node.triggers.length - 1) * 400)) })
            bindNodes(index, nextIndex);
            handleNodeUpdating(node)
            handleNodeUpdating(newNode)
        }

        const handleNodeRemoving = (node) => {
            if (!node) return;
            for (const child of node.triggers) {
                const data = nodes.value.find(({ id }) => id === child.destinationId);
                if (data) handleNodeRemoving(data);
            }
            deleteNode(node)
            emitter.emit(BOTO_SCENARIO_BUILDER_DELETE_NODE_EVENT, node.id)
        }

        const onSelectModule = (type) => {
            let nodes = []
            switch (type) {
                case 'add_segment':
                    nodes = createSegmentationModule();
                    break;
                case 'new_funnel':
                    nodes = createFunnelModule();
                    break;
                case 'new_quize':
                    nodes = createQuizModule();
                    break;
                default:
                    break;
            }
        
            editor.value.clear()
            editor.value.noderegister = {};
            editor.value.nodeId = 1;
            syncNodeId.value = 1;
            setTimeout(() => {
                convertStagesToNodes(nodes)
            }, 0);
        }

        function createSegmentationModule() {
            const segmentation = [
                {
                    id: v4(),
                    title: 'Начало',
                    event: {
                        label: 'Начало'
                    },
                    triggers: [createChild(v4(), '1'), createChild(v4(), '2'), createChild(v4(), '3')],
                    text: 'Начало диалога, расскажите немного о себе, придумайте вопрос, определяющий к какому сегменту отнести клиента.'
                }
            ];
            function createChild(id, segmentName) {
                setTimeout(() => segmentation.push({
                    id,
                    title: `Ветка для сегмента "${segmentName}"`,
                    event: {
                        label: `Сегмент: ${segmentName}`
                    },
                    triggers: [],
                    text: `Ветка диалога для клиентов из сегмента ${segmentName}. Введите свой текст...`
                }), 0);
                return { destinationId: id, text: `Ветка для сегмента "${segmentName}"` }
            }
            return segmentation;
        }

        function createFunnelModule() {
            const addingQueue = [];
            const funnel = [
                {
                    id: v4(),
                    title: 'Начало',
                    event: {
                        label: 'Автоворонка: лид-магнит'
                    },
                    triggers: [createChild(v4(), {
                        title: 'Автоворонка: презентация',
                        event: {
                            label: 'Автоворонка: презентация'
                        },
                        triggers: [createChild(v4(), {
                            title: 'Автоворонка: действие',
                            event: {
                                label: 'Автоворонка: действие'
                            },
                            triggers: [],
                            text: 'Шаг с целевым действием. Затем мы задаем вопрос, мотивирующий пользователя на дальнейшее действие. Например, зовем на консультацию, встречу, предлагаем пообщаться с менеджером — в зависимости от специфики услуги.'
                        })],
                        text: 'Шаг с презентацией. Это знакомство, которое мягко посвящает получателя в курс дела — чем вы можете быть ему полезны.'
                    })],
                    text: 'Начало диалога. Здесь могут быть бесплатные полезные материалы: чеклисты, руководства, шаблоны, которые пользователь получит в обмен на оставленный контакт.'
                }
            ];
            function createChild(id, node) {
                addingQueue.unshift({ ...node, id });
                return { destinationId: id, text: node.title }
            }
            for (const item of addingQueue) {
                funnel.push(item);
            }
            return funnel;
        }

        function createQuizModule() {
            const addingQueue = [];
            const quiz = [
                {
                    id: v4(),
                    title: 'Вопрос 1 - Начало',
                    event: {
                        label: 'Квиз: Начало'
                    },
                    triggers: [createChild(v4(), {
                        title: 'Вопрос 1 - Ответ 1',
                        event: {
                            label: 'Квиз: Вопрос 1 - Ответ 1'
                        },
                        triggers: [createChild(v4(), {
                            title: 'Вопрос 2 - Ответ 1',
                            event: {
                                label: 'Квиз: Вопрос 2 - Ответ 1'
                            },
                            triggers: [],
                            text: 'Шаг с предложением решения.'
                        })],
                        text: 'Вопрос для соответствующего сегмента. Здесь может быть выявление потребностей.'
                    }),
                    createChild(v4(), {
                        title: 'Вопрос 1 - Ответ 2',
                        event: {
                            label: 'Квиз: Вопрос 1 - Ответ 2'
                        },
                        triggers: [createChild(v4(), {
                            title: 'Вопрос 2 - Ответ 1',
                            event: {
                                label: 'Квиз: Вопрос 2 - Ответ 1'
                            },
                            triggers: [],
                            text: 'Шаг с предложением решения.'
                        })],
                        text: 'Вопрос для соответствующего сегмента. Здесь может быть выявление потребностей.'
                    })],
                    text: 'Начало диалога. Здесь может быть вопрос, сегментирующий аудиторию'
                }
            ];
            function createChild(id, node) {
                addingQueue.unshift({ ...node, id });
                return { destinationId: id, text: node.title }
            }
            for (const item of addingQueue) {
                quiz.push(item);
            }
            return quiz;
        }

        return {
            onZoomIn: () => editor.value.zoom_in(),
            onZoomOut: () => editor.value.zoom_out(),
            onSelectModule,
            options: [
                {
                    label: 'Сегментация',
                    value: 'add_segment',
                },
                {
                    label: 'Автоворонка',
                    value: 'new_funnel',
                },
                {
                    label: 'Квиз',
                    value: 'new_quize',
                },
            ]
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
