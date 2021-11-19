import * as Vue from 'vue';
import {
    ref
} from "vue";
import Drawflow from "drawflow";
import {
    v4
} from "uuid";
import Node, {
    BOTO_SCENARIO_BUILDER_DELETE_NODE_EVENT
} from "../Node.vue";
const emitter = require('tiny-emitter/instance');

export default function useDrawflowBuilder() {
    const editor = ref(null);

    const syncNodeId = ref(1)
    const nodes = ref([]);

    const listeners = ref([]);

    const buildDefaultStage = (title, index, parentId = null) => ({
        id: v4(),
        name: `node-${index}`,
        title,
        event: null,
        triggers: [],
        text: null,
        parentId
    })

    function start() {
        const id = document.getElementById("boto-drawflow")
        editor.value = new Drawflow(id, Vue);
        editor.value.draggable_inputs = false;
        editor.value.start();
    }

    function set(data) {
        convertStagesToNodes(!data.length ? [buildDefaultStage('Начало', syncNodeId.value)] : data)
    }

    function setModule(data) {
        set(data);
        emit('update', [nodes.value])
    }

    function clear() {
        nodes.value = [];
        editor.value.clear()
        editor.value.noderegister = {};
        editor.value.nodeId = 1;
        syncNodeId.value = 1;
    }

    function on(action, callback) {
        listeners.value[action] = callback;
    }

    function emit(action, arg = []) {
        if (listeners.value[action]) listeners.value[action](...arg);
    }

    function convertStagesToNodes(stages) {
        const bindings = []
        for (const node of stages) {
            const data = {
                ...node,
                name: `node-${syncNodeId.value}`
            };
            bindings.push({
                nodeId: syncNodeId.value,
                id: data.id,
                triggers: data.triggers
            })
            if (syncNodeId.value > 1) {
                const parent = stages.find(({
                    triggers
                }) => triggers.some(trigger => trigger.destinationId === node.id))
                if (parent) {
                    const parentIndex = stages.findIndex(({
                        triggers
                    }) => triggers.some(trigger => trigger.destinationId === node.id))
                    const childIndex = parent.triggers.findIndex(trigger => trigger.destinationId === node.id);
                    const {
                        pos_x,
                        pos_y
                    } = editor.value.getNodeFromId(parentIndex + 1);
                    createNode(syncNodeId.value, data, {
                        x: pos_x + 360,
                        y: pos_y + (childIndex * 400)
                    })
                }
            } else {
                createNode(syncNodeId.value, data)
            }
        }
        for (const node of bindings) {
            node.triggers.forEach((trigger) => {
                const bindedNode = bindings.find(({
                    id
                }) => trigger.destinationId === id);
                bindNodes(node.nodeId, bindedNode.nodeId);
            })
        }
    }

    function createNode(index, node, {
        x,
        y
    } = {
        x: 24,
        y: 24
    }) {
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

    function bindNodes(parent, child) {
        editor.value.addNodeInput(child)
        editor.value.addConnection(parent, child, 'output_1', 'input_1')
    }

    function deleteNode({
        id,
        name,
        triggers
    }) {
        for (const child of triggers) {
            const data = nodes.value.find(({
                id
            }) => id === child.destinationId);
            if (data) deleteNode(data);
        }

        const parent = nodes.value.find(node => node.triggers.some(trigger => trigger.destinationId === id ));
        
        if (parent) {
            emitter.emit(BOTO_SCENARIO_BUILDER_DELETE_NODE_EVENT, id)
            const deletePos = parent.triggers.findIndex(trigger => trigger.destinationId === id);
            parent.triggers.splice(deletePos, 1);
        }

        const pos = nodes.value.findIndex((node) => id === node.id);
        nodes.value.splice(pos, 1);
        editor.value.removeNodeId(name);
        editor.value.removeConnectionNodeId(name);
    }

    function updateNode(node) {
        const pos = nodes.value.findIndex(({
            id
        }) => id === node.id);
        nodes.value[pos] = node;
    }

    function addNodeTrigger(index, node) {
        const nextIndex = syncNodeId.value;
        const trigger = node.triggers[node.triggers.length - 1];
        const newNode = buildDefaultStage(trigger.text, nextIndex, node.id);
        trigger.destinationId = newNode.id;
        const {
            pos_x,
            pos_y
        } = editor.value.getNodeFromId(node.name.slice(5));

        updateNode(node);
        createNode(nextIndex, newNode, {
            x: pos_x + 360,
            y: (pos_y + ((node.triggers.length - 1) * 400))
        });

        bindNodes(index, nextIndex);
    }

    function handleNodeUpdating(node) {
        if (node) updateNode(node);
        emit('update', [nodes.value]);
    }

    function handleTriggerAdding(index, node) {
        addNodeTrigger(index, node);
        emit('add', [nodes.value]);
    }

    function handleNodeRemoving(node) {
        if (!node) {
            return;
        }

        deleteNode(node);

        emit('remove', [nodes.value]);
    }

    return {
        start,
        clear,
        set,
        setModule,
        on,
        zoomIn: () => editor.value.zoom_in(),
        zoomOut: () => editor.value.zoom_out(),
    }
}