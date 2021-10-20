<template>
    <n-card title="Проблемные шаги" hoverable>
        <n-empty description="Данные временно не доступны">
        </n-empty>
    </n-card>
</template>
  
<script>
  import { defineComponent } from 'vue'
  import { NCard, NEmpty } from "naive-ui";
  
  export default defineComponent({
    components: {
        NCard, NEmpty
    },
    props: {
        metrics: {
            type: Object,
            default: () => ({
                step: null
            })
        }
    }
  })
  </script>