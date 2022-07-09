import { createVNode as _createVNode } from "vue";
// Styles
import "./VLabel.css"; // Composables

import { makeThemeProps } from "../../composables/theme.mjs"; // Utilities

import { defineComponent } from "../../util/index.mjs";
export const VLabel = defineComponent({
  name: 'VLabel',
  props: {
    text: String,
    ...makeThemeProps()
  },

  setup(props, _ref) {
    let {
      slots
    } = _ref;
    return () => {
      var _slots$default;

      return _createVNode("label", {
        "class": "v-label"
      }, [props.text, (_slots$default = slots.default) == null ? void 0 : _slots$default.call(slots)]);
    };
  }

});
//# sourceMappingURL=VLabel.mjs.map