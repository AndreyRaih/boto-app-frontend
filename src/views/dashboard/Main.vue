<template>
  <boto-dashboard-layout :sidebarMenu="menu">
    <template #header>
        <n-gradient-text
          :class="$style.logo"
          size="24px"
          :gradient="{
            from: 'rgb(85, 85, 85)',
            to: 'rgb(170, 170, 170)'
          }"
          color="primary"
        >
          Boto
        </n-gradient-text>
    </template>
    <router-view />
  </boto-dashboard-layout>
</template>

<style lang="stylus" module>
  .logo
    margin-left: 20px
</style>

<script>
import { computed, defineComponent } from 'vue'
import BotoDashboardLayout from '@/components/dashboard/Layout.vue';
import { defaultMenu } from "../../common/sidebar.js";
import { NGradientText } from "naive-ui";
import { useStore } from 'vuex';

export default defineComponent({
  name: "BotoDashboardMain",
  components: {
    BotoDashboardLayout, NGradientText
  },
  setup() {
    const store = useStore();
    const hasBot = computed(() => store.state.bots.currentBot)
    const menu = computed(() => defaultMenu.map(item => ({
      ...item,
      disabled: !hasBot.value
    })))
    return {
      menu
    }
  }
})
</script>
