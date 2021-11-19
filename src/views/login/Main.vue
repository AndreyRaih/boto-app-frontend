<template>
  <login-layout>
    <template #left>
      <lottie :options="defaultOptions" />
    </template>
    <template #right>
      <login-form />
    </template>
  </login-layout>
</template>

<script>
import { defineComponent, onBeforeMount } from 'vue'
import LoginLayout from '@/components/login/Layout.vue';
import LoginForm from '@/components/login/Form.vue';
import { useStore } from 'vuex';
import Lottie from "vue-lottie/src/lottie.vue";
// @ts-ignore
import animationData from '@/assets/animation/login_lottie_animation.json';

export default defineComponent({
  components: {
    LoginLayout,
    LoginForm,
    Lottie
  },
  setup() {
    const store = useStore();
    onBeforeMount(() => store.dispatch('signOut'));
    return {
      defaultOptions: {
        animationData
      },
    }
  }
})
</script>
