<template>
    <n-card title="Основное" hoverable>
        <n-space justify="space-between">
            <n-statistic label="Сообщения">{{ metrics.messages }}</n-statistic>
            <n-statistic label="Пользователи">{{ metrics.users }}</n-statistic>
            <n-statistic label="Эффективность">{{ `${(metrics.effectivity * 100).toString()}%` }}</n-statistic>
        </n-space>
    </n-card>
</template>
  
<script>
  import { defineComponent } from 'vue'
  import { NCard, NStatistic, NSpace } from "naive-ui";
  
  export default defineComponent({
    components: {
        NCard, NStatistic, NSpace
    },
    props: {
        metrics: {
            type: Object,
            default: () => ({
                messages: 0,
                users: 0,
                invoices: 0,
                effectivity: 0
            })
        }
    }
  })
  </script>