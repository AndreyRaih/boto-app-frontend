<template>
  <template v-if="dataIsLoaded">
    <boto-bot-header
      :name="headerData.name"
      :state="headerData.state"
      :scenario="headerData.scenario"
      @boto-bot-header:delete-bot="onDeleteBot"
    />
    <n-divider />
    <n-grid responsive="self" x-gap="12" :cols="4">
      <n-gi :span="3">
        <boto-bot-statistic :data="analyticData" />
      </n-gi>
      <n-gi>
        <boto-bot-admin-list 
          :list="adminsData" 
          @boto-bot-admins:add-new="onAddAdmin"
          @boto-bot-admins:delete-admin="onDeleteAdmin"
        />
      </n-gi>
    </n-grid>
    <boto-bot-admin-add-modal v-model:show="showAddAdminModal" />
  </template>
  <boto-loader v-else />
</template>

<style lang="stylus" module>
  .content {
    & > *:not(:last-of-type) {
      margin-right: 24px!important
    }
    & > *:first-of-type {
      width: 100%;
    }
  }
</style>

<script>
import { computed, defineComponent, ref, watch } from 'vue'
import BotoBotHeader from "@/components/dashboard/bot/Header.vue";
import BotoBotStatistic from "@/components/dashboard/bot/statistic/Main.vue";
import BotoBotAdminList from "@/components/dashboard/bot/admins/List.vue";
import BotoBotAdminAddModal from "@/components/dashboard/bot/admins/AddModal.vue";
import BotoLoader from "@/components/dashboard/Loader.vue";
import { NDivider, useDialog, NGrid, NGi } from "naive-ui";
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ROUTER } from '@/common/constants';

export default defineComponent({
  name: "BotoBotMainView",
    components: {
      BotoBotHeader,
      BotoBotStatistic,
      BotoBotAdminList,
      BotoBotAdminAddModal,
      NDivider,
      BotoLoader,
      NGrid,
      NGi
    },
    setup() {

      const store = useStore();
      const route = useRoute();
      const router = useRouter();
      const dialog = useDialog();

      const dataIsLoaded = computed(() => Boolean(store.state.bots.currentBot))

      const headerData = computed(() => store.state.bots.currentBot ? ({
        name: store.state.bots.currentBot.name,
        state: store.state.bots.currentBot.state,
        scenario: store.state.bots.currentBot.activeScenario ? store.state.bots.currentBot.activeScenario.label : null
      }) : {});
      const analyticData = computed(() => store.state.bots.currentBot && store.state.bots.currentBot.analytic ? store.state.bots.currentBot.analytic : {})
      const adminsData = computed(() => store.state.bots.currentBot ? store.state.bots.currentBot.admins : []);

      const showAddAdminModal = ref(false)

      watch(() => route.params.id, (id) => {
        store.dispatch('getFullBotDataById', id)
      }, { immediate: true })

      const onDeleteBot = (id) => dialog.warning({
          title: 'Удаление бота',
          content: 'Вы действительно хотите удалить бота из Boto?',
          positiveText: 'Удалить',
          negativeText: 'Отмена',
          onPositiveClick: () => store.dispatch('deleteBot', id).then(() => router.push({ name: ROUTER.ROUTE_NAMES.BOT, params: { id: store.state.bots.currentBot.id }})),
        })

      const onDeleteAdmin = (id) => store.dispatch('deleteBotAdmin', id)

      const onAddAdmin = () => {
        showAddAdminModal.value = true;
      }

      return {
        headerData,
        analyticData,
        adminsData,
        showAddAdminModal,
        dataIsLoaded,
        onDeleteBot,
        onAddAdmin,
        onDeleteAdmin
      }
    }
})
</script>
