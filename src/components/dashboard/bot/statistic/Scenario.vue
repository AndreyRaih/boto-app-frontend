<template>
    <n-card title="Сценарий" hoverable>
        <div :class="$style.container">
            <n-statistic :class="$style.select" label="Событие">
                <n-select
                    placeholder="Выбрать событие"
                    v-model:value="selectedEvent"
                    :options="events"
                >
                    <template #empty>
                        <n-text :class="$style.text" depth="3">Список событий пуст</n-text>
                    </template>
                </n-select>
            </n-statistic>
            <n-progress
                :class="$style.progress"
                type="circle"
                :percentage="percentage"
            >
                <n-text :class="$style.text" depth="3">{{ progressString }}</n-text>
            </n-progress>
        </div>
    </n-card>
</template>

<style lang="stylus" module>
.container {
    display: flex
}
.select {
    width: 45%!important
}
.progress {
    width: 90px!important
    margin: auto;
}
.text {
    font-size: 10px
}  
</style>
  
<script>
  import { defineComponent, ref, computed, watch } from 'vue'
  import { NCard, NStatistic, NSelect, NProgress, NText } from "naive-ui";
  
  export default defineComponent({
    components: {
        NCard, NStatistic, NSelect, NProgress, NText
    },
    props: {
        metrics: {
            type: Object,
            default: () => ({
                events: []
            })
        }
    },
    setup(props) {
        const events = ref([]);
        watch(() => props.metrics.events, (value) => events.value = value, { immediate: true, deep: true })
        const selectedEvent = ref(null);
        const currentEvent = computed(() => events.value.find(event => event.value === selectedEvent.value) || { fires: 0 });
        const total = computed(() => events.value.reduce((acc, item) => acc = acc + item.fires, 0))
        const percentage = computed(() => currentEvent.value && currentEvent.value.fires > 0 && total.value > 0 ? ((currentEvent.value.fires / total.value) * 100) : 0)
        const progressString = computed(() => selectedEvent.value ? `${currentEvent.value.fires}/${total.value}` : total.value)
        return {
            selectedEvent,
            percentage,
            events,
            progressString
        }
    }
  })
  </script>