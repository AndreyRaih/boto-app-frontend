<template>
  <div :class="$style.container">
  <div :class="$style.left">
    <slot name="left"></slot></div>
    <slot name="right"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'LoginLayout',
    setup() {},
})
</script>


<style lang="stylus" module>
.container {
    height: 100vh;
    width 100vw;
    display: flex;
    flex-direction row;
    justify-content center;
    align-items center;
}

.left {
  margin-right: 48px
}
</style>