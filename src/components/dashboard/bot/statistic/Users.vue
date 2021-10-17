<template>
    <n-card title="Пользователи" hoverable>
        <div :class="$style.container">
            <n-space>
                <n-statistic label="Вовлеченные">
                    {{ lead.total }}
                    <n-text :class="$style.text" depth="1">(+{{ lead.new }})</n-text>
                </n-statistic>
                <n-statistic label="Активные">
                    {{ active.total }}
                    <n-text :class="$style.text" depth="1">(+{{ active.new }})</n-text>
                </n-statistic>
            </n-space>
            <n-progress
                :class="$style.progress"
                type="multiple-circle"
                :circle-gap="4"
                :percentage="[active.percentage, lead.percentage]"
            >
                <div>
                    <n-text :class="$style.text" depth="1">+{{ active.percentage }}%</n-text>
                    <n-divider :class="$style.separator" />
                    <n-text :class="$style.text" depth="1">+{{ lead.percentage }}%</n-text>
                </div>
            </n-progress>
        </div>
    </n-card>
</template>

<style lang="stylus" module>
.container {
    display: flex;
}
.progress {
    width: 90px!important
    margin: auto;
    text-align: center;
}
.text {
    font-size: 8px
}
.separator {
    margin-top: 0!important
    margin-bottom: 0!important
}
</style>
  
<script>
import { defineComponent, computed } from 'vue'
import { NCard, NProgress, NSpace, NText, NStatistic, NDivider } from "naive-ui";

export default defineComponent({
    components: {
        NCard, NText, NSpace, NProgress, NStatistic, NDivider
    },
    props: {
        metrics: {
            type: Object,
            default: () => ({
                total: 0,
                lead: 0,
                prev: {
                    lead: 0,
                    active: 0,
                }
            })
        }
    },
    setup(props) {
        const active = computed(() => ({
            total: props.metrics.active,
            new: props.metrics.active - props.metrics.prev.active,
            percentage: props.metrics.active > 0 && props.metrics.total > 0 ? ((props.metrics.active / props.metrics.total) * 100).toFixed(2) : 0
        }));

        const lead = computed(() => ({
            total: props.metrics.lead,
            new: props.metrics.lead - props.metrics.prev.lead,
            percentage: props.metrics.lead > 0 && props.metrics.total > 0 ? ((props.metrics.lead / props.metrics.total) * 100).toFixed(2) : 0
        }));

        return {
            lead,
            active
        }
    }
})
</script>