<template>
    <boto-scenario-builder-select />
    <n-tree
        :class="$style.tree"
        :selectable="false"
        block-line
        :data="treeData"
        v-if="treeData.length > 0"
    />
    <n-button @click="addTreeNode()" v-else>Добавить</n-button>
    <boto-stage-modal
        v-model:show="showStageEditModal"
        :root="!treeData.length"
        :is-loading="isStageEditModalLoading"
        @boto-stage-editor:create-stage="handleStageCreating"
    />
</template>

<style lang="stylus" module>
    .tree {
        :global .n-tree-node {
            align-items center;
            margin: 4px 0
            padding: 4px 0
        }
    }
</style>

<script>
import { computed, defineComponent, h, ref, watch } from "vue"
import { NTree, NButton, NSpace, NIcon, NTooltip, useMessage } from "naive-ui";
import { Trash as TrashIcon, Plus as PlusIcon, Bulb as TriggerIcon, Photo as HasPhotoIcon, PhotoOff as NoPhotoIcon } from '@vicons/tabler';
import BotoScenarioBuilderSelect from "./ScenarioSelect.vue";
import BotoStageModal from "./edit/Stage.vue";
import { v4 as uuid } from 'uuid';
import { useStore } from "vuex";

export default defineComponent({
    name: "BotoScenarioBuilder",
    components: {
        NTree, NButton, BotoScenarioBuilderSelect, BotoStageModal
    },
    setup() {
        const messages = useMessage();

        const store = useStore();
        const stages = ref([]);
        const processedItemId = ref(null);

        const treeData = computed(() => buildTree(stages.value))

        const showStageEditModal = ref(false);
        const isStageEditModalLoading = ref(false);

        watch(() => store.state.scenarios.currentScenario, (value) => value && (stages.value = value.stages), { deep: true, immediate: true })

        const elemRef = {
            parent: null,
            id: null
        };

        const buildTree = (list, parent) => {
            const tree = [];
            const getActionsComponent = (item) => () => h(NSpace, { align: 'center' }, [
                h(NIcon, { size: '16px', depth: '3' }, h(item.images.length ? HasPhotoIcon : NoPhotoIcon)),
                h(NTooltip,
                    { placement: 'top', trigger: 'click' },
                    {
                        trigger: () => h(NButton,
                            { circle: true, size: 'small', disabled: !item.parentId },
                            { icon: () => h(TriggerIcon) }
                        ),
                        default: () => h('span',
                            {}, `Тип: ${item.trigger.type === 'button' ? 'Кнопка' : 'Ввод'},\n Описание: ${item.trigger.description}`
                        )
                    }),
                h(NButton, { circle: true, size: 'small', onClick: () => addTreeNode(item.key) }, { icon: () => h(PlusIcon) }),
                h(NButton, { circle: true, loading: item.key === processedItemId.value, size: 'small', onClick: () => removeTreeNode(item.key) }, { icon: () => h(TrashIcon) })
            ]);

            const filteredList = [...list].filter(child => child.parentId === parent).map(child => ({ ...child, children: undefined }));

            for (let i = 0; i < filteredList.length; i++) {
                const item = filteredList[i];
                item.label = item.text;
                item.suffix = getActionsComponent(item, i);
                if (list.some(child => child.parentId === item.key)) item.children = buildTree(list, item.key)
                tree.push(item);
            }
            return tree;
        }

        const addTreeNode = (parentId) => {
            elemRef.parent = parentId;
            showStageEditModal.value = true;
        }

        const removeTreeNode = (id) => {
            processedItemId.value = id;
            store.dispatch('deleteScenarioStage', id)
                .then(() => {
                    messages.info("Сценарий обновлен")
                    stages.value = [...stages.value].filter(item => item.key !== id && item.parentId !== id)
                    processedItemId.value = null;
                });
        };

        const handleStageCreating = (updates) => {
            isStageEditModalLoading.value = true;
            const stage = {
                key: uuid(),
                parentId: elemRef.parent,
                ...updates
            }
            store.dispatch('updateScenario', stage)
                .then(() => messages.info("Сценарий обновлен"))
                .finally(() => {
                    elemRef.id = null;
                    elemRef.parent = null;
                    showStageEditModal.value = false;
                    isStageEditModalLoading.value = false;
                    stages.value.push(stage)
                })
        }

        return {
            showStageEditModal,
            treeData,
            handleStageCreating,
            addTreeNode,
            isStageEditModalLoading
        }
    }
})
</script>