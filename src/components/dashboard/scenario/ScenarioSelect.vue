<template>
    <n-space justify="space-between">
        <n-h2>{{ currentScenario ? currentScenario.label :  'Сценарий не выбран'}}</n-h2>
            <div :class="$style.actions">
            <n-form-item label="Связанные боты:" label-placement="left">
                <n-select
                    placeholder="Связать с ботом"
                    :class="$style.select"
                    :value="selectedBot"
                    @update:value="onSelectBot"
                    :options="bots"
                />
                </n-form-item>
                <n-form-item label="Выбрать сценарий:" label-placement="left">
                <n-select
                    placeholder="Выбрать сценарий"
                    :class="$style.select"
                    :value="selectedScenario"
                    @update:value="onSelectScenario"
                    :options="scenaries"
                />
                <n-button @click="showScenarioEditModal = !showScenarioEditModal">Добавить сценарий</n-button>
                </n-form-item>
            </div>
        </n-space>
    <boto-scenario-modal @boto-scenario-edit-modal:add="onAddNewScenario" v-model:show="showScenarioEditModal" />
</template>

<style lang="stylus" module>
    .actions
        display flex
        align-items center

    .select 
        min-width 180px
        margin-right: 16px

</style>

<script>
import { computed, defineComponent, ref } from "vue"
import { NButton, NSpace, NH2, NSelect, NFormItem, useMessage } from "naive-ui";
import BotoScenarioModal from "./edit/Scenario.vue";
import { useStore } from "vuex";

export default defineComponent({
    name: "BotoScenarioBuilderSelect",
    components: {
        NButton, NSpace, NH2, NSelect, NFormItem, BotoScenarioModal
    },
    setup() {
        const messages = useMessage();
        const store = useStore();

        const showScenarioEditModal = ref(false);
        const currentScenario = computed(() => store.state.scenarios.currentScenario);

        const scenaries = computed(() => store.state.scenarios.scenarios.map(({ label, id: value}) => ({ label, value })));
        const bots = computed(() => store.state.bots.botList.map(({ name: label, id: value}) => ({ label, value })));
        const selectedBot = computed(() => currentScenario.value ? currentScenario.value.bot : [])
        const selectedScenario = computed(() => currentScenario.value ? currentScenario.value.id : null)

        const onSelectScenario = (value) => store.commit('SET_CURRENT_SCENARIO', store.state.scenarios.scenarios.find(({ id }) => id === value))
        const onSelectBot = (value) => store.dispatch('bindBotToScenario', value).then(() => messages.info("Информация о боте обновлена"))
        const onAddNewScenario = ({ label }) => store.dispatch('createScenario', { name: label, creatorId: store.getters.userId });

        return {
            currentScenario,
            scenaries,
            bots,
            showScenarioEditModal,
            selectedScenario,
            selectedBot,
            onSelectScenario,
            onSelectBot,
            onAddNewScenario
        }
    }
})
</script>