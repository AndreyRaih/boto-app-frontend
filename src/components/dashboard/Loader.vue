<template>
    <n-space :class="$style.loader" :align="'center'" :justify="'center'" size="large">
        <n-spin size="large" />
    </n-space>
</template>

<style lang="stylus" module>
.loader {
    width: 100%;
    height: calc(100% - 90px);
}
</style>

<script>
import { defineComponent } from 'vue';
import { NSpin, NSpace } from "naive-ui";

export default defineComponent({
    name: "BotoLoader",
    components: {
        NSpin, NSpace
    }
})
</script>