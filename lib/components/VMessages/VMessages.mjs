import { createVNode as _createVNode } from "vue";
// Styles
import "./VMessages.css"; // Components

import { VSlideYTransition } from "../transitions/index.mjs"; // Composables

import { makeTransitionProps, MaybeTransition } from "../../composables/transition.mjs";
import { useTextColor } from "../../composables/color.mjs"; // Utilities

import { computed } from 'vue';
import { defineComponent, useRender, wrapInArray } from "../../util/index.mjs"; // Types

export const VMessages = defineComponent({
  name: 'VMessages',
  props: {
    active: Boolean,
    color: String,
    messages: {
      type: [Array, String],
      default: () => []
    },
    ...makeTransitionProps({
      transition: {
        component: VSlideYTransition,
        leaveAbsolute: true,
        group: true
      }
    })
  },

  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const messages = computed(() => wrapInArray(props.messages));
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(computed(() => props.color));
    useRender(() => _createVNode(MaybeTransition, {
      "transition": props.transition,
      "tag": "div",
      "class": ['v-messages', textColorClasses.value],
      "style": textColorStyles.value
    }, {
      default: () => [props.active && messages.value.map((message, i) => _createVNode("div", {
        "class": "v-messages__message",
        "key": `${i}-${messages.value}`
      }, [slots.message ? slots.message({
        message
      }) : message]))]
    }));
    return {};
  }

});
//# sourceMappingURL=VMessages.mjs.map