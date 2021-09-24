<template>
    <div :class="$style.container">
        <div v-for="(msg, index) in messages" :key="`chat-message-${index}`" :class="[$style.messageWrapper, msg.isBot && $style.bot]">
            <div :class="$style.title">
                {{ msg.name }}
            </div>
            <div :class="$style.message">
                <span>{{ msg.text }}</span>
                <span :class="$style.subtext">{{ msg.date }}</span>
            </div>
            <div v-if="msg.event" :class="$style.subtext" v-html="`${msg.event.name}${msg.event.payload ? `: ${msg.event.payload}` : ''}`">
            </div>
        </div>
    </div>
</template>

<style lang="stylus" module>
.container {
    display: flex;
    flex-direction: column
}
.messageWrapper {
    margin-bottom: 8px;
}

.bot {
    margin-left: auto;
    .message, .title, .subtext {
        align-items: end;
        text-align: right;
    }
}

.title {
    color: #396182;
    font-weight: 600;
    margin-bottom: 4px
}

.message {
    background: rgb(239, 239, 245);
    border-radius: 12px;
    padding: 8px 16px;
    display: flex;
    flex-direction: column;
    width: fit-content;
    margin-bottom: 4px
}

.subtext {
    opacity: 0.7;
    font-size: 10px;
}
</style>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: "BotoDialogChat",
    props: {
        messages: {
            type: Array,
            default: () => []
        }
    }
})
</script>
