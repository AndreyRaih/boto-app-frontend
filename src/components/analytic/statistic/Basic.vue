<template>
    <n-card title="Основное" hoverable>
        <n-space justify="space-between">
            <n-statistic label="Сообщения">{{ metrics.messages.toString() }}</n-statistic>
            <n-statistic label="Пользователи">{{ metrics.users.toString() }}</n-statistic>
            <n-statistic label="Лиды">{{ metrics.leads.toString() }}</n-statistic>
            <n-statistic label="Эффективность">{{ `${metrics.effectivity ? parseInt(metrics.effectivity) : '0'}%` }}</n-statistic>
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
                leads: 0,
                effectivity: 0
            })
        }
    }
  })
  </script>