<template>
    <n-card title="Пользователи" hoverable>
        <div :class="$style.container">
            <n-space>
                <n-statistic label="Вовлеченные">
                    {{ ordered.total }}
                    <n-text :class="$style.text" depth="1">(+{{ ordered.new }})</n-text>
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
                :percentage="[active.percentage, ordered.percentage]"
            >
                <div>
                    <n-text :class="$style.text" depth="1">+{{ active.percentage }}%</n-text>
                    <n-divider :class="$style.separator" />
                    <n-text :class="$style.text" depth="1">+{{ ordered.percentage }}%</n-text>
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
}
.text {
    font-size: 10px
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
                ordered: 0,
                active: 0,
                prev: {
                    ordered: 0,
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

        const ordered = computed(() => ({
            total: props.metrics.ordered,
            new: props.metrics.ordered - props.metrics.prev.ordered,
            percentage: props.metrics.active > 0 && props.metrics.total > 0 ? ((props.metrics.ordered / props.metrics.total) * 100).toFixed(2) : 0
        }));

        return {
            ordered,
            active
        }
    }
})
</script>