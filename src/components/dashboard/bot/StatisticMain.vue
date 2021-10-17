<template>
  <n-h3>Статистика</n-h3>
  <n-grid x-gap="12" y-gap="8" :cols="hasData ? 2 : 1">
    <n-empty description="Нет данных для аналитики" v-if="!hasData" />
    <template v-else>
      <n-gi>
        <boto-statistic-basic :metrics="data.basic" :class="$style.card" />
      </n-gi>
      <n-gi>
        <boto-statistic-users :metrics="data.users" :class="$style.card" />
      </n-gi>
      <n-gi>
        <boto-statistic-scenario :metrics="{ ...data.timings, ...data.scenario }" :class="$style.card" />
      </n-gi>
      <n-gi>
        <boto-statistic-issues :class="$style.card" />
      </n-gi>
    </template>
  </n-grid>
</template>

<style lang="stylus" module>
  .card {
    height: 25vh
  }
</style>

<script>
import { defineComponent, computed } from 'vue'
import { NGrid, NGi, NH3, NEmpty } from "naive-ui";

import BotoStatisticBasic from "./statistic/Basic.vue";
import BotoStatisticUsers from "./statistic/Users.vue";
import BotoStatisticScenario from "./statistic/Scenario.vue";
import BotoStatisticIssues from "./statistic/Issues.vue";

export default defineComponent({
  components: {
    NGrid, NGi, NH3, NEmpty, BotoStatisticBasic, BotoStatisticUsers, BotoStatisticIssues, BotoStatisticScenario
  },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => null
    }
  },
  setup(props) {
    return {
      hasData: computed(() => Boolean(props.data))
    }
  }
})
</script>