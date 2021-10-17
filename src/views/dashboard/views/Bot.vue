<template>
<div :style="{ padding: '48px' }">
  <template v-if="dataIsLoaded">
    <boto-bot-header
      :name="headerData.name"
      :state="headerData.state"
      :scenario="headerData.scenario"
      @boto-bot-header:delete-bot="onDeleteBot"
    />
    <n-divider />
    <boto-bot-statistic :data="analyticData" />
  </template>
  <boto-loader v-else />
</div>
</template>

<style lang="stylus" module>
  .content {
    width: 100%;
  }
</style>

<script>
import { computed, defineComponent } from 'vue'
import BotoBotHeader from "@/components/dashboard/bot/Header.vue";
import BotoBotStatistic from "@/components/dashboard/bot/StatisticMain.vue";
import BotoLoader from "@/components/dashboard/Loader.vue";
import { NDivider, useDialog } from "naive-ui";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ROUTER } from '@/common/constants';

export default defineComponent({
  name: "BotoBotMainView",
    components: {
      BotoBotHeader,
      BotoBotStatistic,
      NDivider,
      BotoLoader
    },
    setup() {

      const store = useStore();
      const router = useRouter();
      const dialog = useDialog();

      const dataIsLoaded = computed(() => Boolean(store.state.bots.currentBot))

      const headerData = computed(() => store.state.bots.currentBot ? ({
        name: store.state.bots.currentBot.name,
        state: store.state.bots.currentBot.state,
        scenario: store.state.bots.currentBot.activeScenario ? store.state.bots.currentBot.activeScenario.label : null
      }) : {});
      const analyticData = computed(() => store.state.bots.currentBot && store.state.bots.currentBot.analytic ? store.state.bots.currentBot.analytic : {})

      const onDeleteBot = (id) => dialog.warning({
          title: 'Удаление бота',
          content: 'Вы действительно хотите удалить бота из Boto?',
          positiveText: 'Удалить',
          negativeText: 'Отмена',
          onPositiveClick: () => store.dispatch('deleteBot', id).then(() => router.push({ name: ROUTER.ROUTE_NAMES.BOT, params: { id: store.state.bots.currentBot.id }})),
        })

      return {
        headerData,
        analyticData,
        dataIsLoaded,
        onDeleteBot,
      }
    }
})
</script>
