import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
// Styles
import "./VGrid.css"; // Composables

import { makeTagProps } from "../../composables/tag.mjs"; // Utilities

import { defineComponent, useRender } from "../../util/index.mjs";
export const VContainer = defineComponent({
  name: 'VContainer',
  props: {
    fluid: {
      type: Boolean,
      default: false
    },
    ...makeTagProps()
  },

  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useRender(() => _createVNode(props.tag, {
      "class": ['v-container', {
        'v-container--fluid': props.fluid
      }]
    }, slots));
    return {};
  }

});
//# sourceMappingURL=VContainer.mjs.map