import { withDirectives as _withDirectives, createVNode as _createVNode, vShow as _vShow } from "vue";
// Styles
import "./VCounter.css"; // Components

import { VSlideYTransition } from "../transitions/index.mjs"; // Composables

import { makeTransitionProps, MaybeTransition } from "../../composables/transition.mjs"; // Utilities

import { computed } from 'vue';
import { defineComponent, useRender } from "../../util/index.mjs";
export const VCounter = defineComponent({
  name: 'VCounter',
  functional: true,
  props: {
    active: Boolean,
    max: [Number, String],
    value: {
      type: [Number, String],
      default: 0
    },
    ...makeTransitionProps({
      transition: {
        component: VSlideYTransition
      }
    })
  },

  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const counter = computed(() => {
      return props.max ? `${props.value} / ${props.max}` : String(props.value);
    });
    useRender(() => _createVNode(MaybeTransition, {
      "transition": props.transition
    }, {
      default: () => [_withDirectives(_createVNode("div", {
        "class": "v-counter"
      }, [slots.default ? slots.default({
        counter: counter.value,
        max: props.max,
        value: props.value
      }) : counter.value]), [[_vShow, props.active]])]
    }));
    return {};
  }

});
//# sourceMappingURL=VCounter.mjs.map