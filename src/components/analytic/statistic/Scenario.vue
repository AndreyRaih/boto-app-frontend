<template>
    <n-card title="Сценарий" hoverable>
    <div :class="$style.container">
        <n-statistic :class="$style.item" label="Cр. время сессии">{{ avarageSessionDuration }}</n-statistic>
        <n-statistic :class="[$style.item, $style.select]" label="Событие">
            <n-select placeholder="Выбрать событие" v-model:value="selectedEvent" :options="events">
                <template #empty>
                    <n-text :class="$style.text" depth="3">Список событий пуст</n-text>
                </template>
            </n-select>
        </n-statistic>
        <n-progress :class="$style.progress" type="circle" :percentage="percentage">
            <n-text :class="$style.text" depth="3">{{ progressString }}</n-text>
        </n-progress>
        </div>
    </n-card>
</template>
  
<style lang="stylus" module>
.container {
    display: flex
    align-items center
}
.item {
    padding-right: 24px;
}
.select {
    width: 45%!important
}
.progress {
    width: 80px !important;
    height: 80px;
}
.text {
    font-size: 10px
}  
</style>

<script>
import { computed, defineComponent, ref } from 'vue'
import { NCard, NStatistic, NSelect, NProgress, NText } from "naive-ui";

export default defineComponent({
    components: {
        NCard, NStatistic, NSelect, NProgress, NText
    },
    props: {
        metrics: {
            type: Object,
            default: () => ({
                average: 0, events: []
            })
        }
    },
    setup(props) {
        const events = computed(() => {
            const result = [];
            for (const event of props.metrics.events) {
                if (!result.some(item => item.value === event.value)) result.push({ ...event, fires: props.metrics.events.filter(item => item.value === event.value).length })
            }
            return result;
        });
        const selectedEvent = ref(null);
        const currentEvent = computed(() => events.value.find(event => event.value === selectedEvent.value) || { fires: 0 });
        const total = computed(() => events.value.reduce((acc, item) => acc = acc + item.fires, 0))
        const percentage = computed(() => currentEvent.value && currentEvent.value.fires > 0 && total.value > 0 ? ((currentEvent.value.fires / total.value) * 100) : 0)
        const progressString = computed(() => selectedEvent.value ? `${currentEvent.value.fires}/${total.value}` : total.value)
        return {
            avarageSessionDuration: computed(() => {
                const sec = props.metrics.average / 1000;
                return `${Math.ceil(sec / 60)} мин ${Math.ceil(sec % 60)} сек`;
            }),
            selectedEvent,
            percentage,
            events,
            progressString
        }
    }
})
</script>