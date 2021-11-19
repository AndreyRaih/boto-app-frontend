<template>
    <div :class="$style.inputContainer">
        <div
            id="editor"
            :class="$style.input"
            :placeholder="placeholder"
            contenteditable="true"
            v-html="innerText"
            @blur="updateValue"
            @focus="saveCaretPos"
            @input="saveCaretPos"
        ></div>
        <div :class="$style.actions">
            <slot name="actions"></slot>
        </div>
    </div>
    <div :class="$style.textActions">
        <div :class="$style.text">
            <n-button
                @click="action.handler"
                v-for="(action, index) in actions"
                :key="index"
                text
                :class="$style.action"
            >
                <n-icon>
                    <component :is="action.icon" />
                </n-icon>
            </n-button>
        </div>
        <n-popover placement="bottom-end" trigger="click">
            <template #trigger>
                <n-button text :class="$style.action">
                    <n-icon>
                        <emodji-icon />
                    </n-icon>
                </n-button>
            </template>
            <VuemojiPicker @emojiClick="handleEmojiClick" />
        </n-popover>
    </div>
</template>

<style lang="stylus" module>
    .inputContainer {
        display: flex;
    }
    .input {
        cursor: text;
        padding: 4px 8px;
        caret-color: #18a058;
        border: 1px solid rgb(224, 224, 230);
        outline: none;
        border-radius: 3px;
        transition: .3s cubic-bezier(0.4, 0, 0.2, 1)
        width: 100%
        &:focus {
            transition: .3s cubic-bezier(0.4, 0, 0.2, 1)
            border: 1px solid #36ad6a;
        }
    }
    .textActions {
        display: flex
        justify-content: space-between
        margin-top: 8px;
        .action {
            font-size: 16px
            font-weight: 600;
            svg {
                left: 0
            }
    }
    }
    .text {
        & > * {
            margin-right: 8px
        }
    }
    
    :global {
        [contenteditable=true]:empty:before{
        content: attr(placeholder);
        pointer-events: none;
        color: #c2c2c2;
        display: block; /* For Firefox */
        }
    }
</style>

<script>
import { defineComponent, ref, watch } from "vue";
import { NButton, NIcon, NPopover } from "naive-ui";
import { Bold as BoldIcon, Italic as ItalicIcon, Underline as UnderlineIcon, MoodSmile as EmodjiIcon } from "@vicons/tabler"
import { VuemojiPicker } from 'vuemoji-picker';
export default defineComponent({
    name: "BotoEditableInput",
    components: {
        NButton, NIcon, NPopover, EmodjiIcon, VuemojiPicker
    },
    props: ['value', 'placeholder'],
    emits: ['update:value'],
    setup(props, { emit }) {
        const innerText = ref(props.value);
        const saved = ref([])
        const empty = ref(false)
        watch(() => props.value, (val) => empty.value = !val, { immediate: true })

        function transformText(type, value = null) {
            return document.execCommand(type, false, value)
        }

        function restoreCaretPos() {
            document.getElementById('editor').focus();
            document.getSelection().collapse(saved.value[0], saved.value[1]);
        }

        function saveCaretPos() {
            saved.value = [document.getSelection().focusNode, document.getSelection().focusOffset];
        }
        return {
            innerText,
            updateValue: (e) => emit('update:value', e.target.innerHTML),
            empty,
            saveCaretPos,
            actions: [
                {
                    icon: BoldIcon,
                    handler: () => transformText('bold')
                },
                {
                    icon: ItalicIcon,
                    handler: () => transformText('italic')
                },
                {
                    icon: UnderlineIcon,
                    handler: () => transformText('underline')
                }
            ],
            handleEmojiClick: (detail) => {
                restoreCaretPos();
                transformText('insertText', detail.unicode);
            }
        }
    }
})
</script>