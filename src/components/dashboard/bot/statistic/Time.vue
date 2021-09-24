<template>
    <n-card title="Сессия" hoverable>
        <n-space justify="space-between">
            <n-statistic label="Cр. время сессии">{{ avarageSessionDuration }}</n-statistic>
            <n-statistic label="Ср. кол-во шагов">{{ steps }}</n-statistic>
        </n-space>
    </n-card>
</template>
  
<script>
  import { computed, defineComponent } from 'vue'
  import { NCard, NStatistic, NSpace } from "naive-ui";
  
  export default defineComponent({
    components: {
        NCard, NStatistic, NSpace
    },
    props: {
        metrics: {
            type: Object,
            default: () => ({
                session: 0,
                steps: 0
            })
        }
    },
    setup(props) {
        
        return {
            avarageSessionDuration: computed(() => `${Math.floor(props.metrics.session / 60)} мин ${Math.ceil(props.metrics.session % 60)} сек`),
            steps: computed(() => props.metrics.steps.toString())
        }
    }
  })
  </script>