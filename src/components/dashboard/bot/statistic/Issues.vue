<template>
    <n-card title="Проблемные шаги" hoverable>
        <n-empty></n-empty>
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