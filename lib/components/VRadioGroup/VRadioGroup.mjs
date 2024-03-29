import { mergeProps as _mergeProps, resolveDirective as _resolveDirective, createVNode as _createVNode, Fragment as _Fragment } from "vue";
// Styles
import "./VRadioGroup.css"; // Components

import { filterControlProps, makeSelectionControlProps } from "../VSelectionControl/VSelectionControl.mjs";
import { filterInputProps, makeVInputProps, VInput } from "../VInput/VInput.mjs";
import { VLabel } from "../VLabel/index.mjs";
import { VSelectionControlGroup } from "../VSelectionControlGroup/index.mjs"; // Composables

import { IconValue } from "../../composables/icons.mjs"; // Utilities

import { computed } from 'vue';
import { defineComponent, filterInputAttrs, getUid, useRender } from "../../util/index.mjs";
export const VRadioGroup = defineComponent({
  name: 'VRadioGroup',
  inheritAttrs: false,
  props: {
    height: {
      type: [Number, String],
      default: 'auto'
    },
    ...makeVInputProps(),
    ...makeSelectionControlProps(),
    trueIcon: {
      type: IconValue,
      default: '$radioOn'
    },
    falseIcon: {
      type: IconValue,
      default: '$radioOff'
    },
    type: {
      type: String,
      default: 'radio'
    }
  },

  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const uid = getUid();
    const id = computed(() => props.id || `radio-group-${uid}`);
    useRender(() => {
      const [inputAttrs, controlAttrs] = filterInputAttrs(attrs);
      const [inputProps, _1] = filterInputProps(props);
      const [controlProps, _2] = filterControlProps(props);
      const label = slots.label ? slots.label({
        label: props.label,
        props: {
          for: id.value
        }
      }) : props.label;
      return _createVNode(VInput, _mergeProps({
        "class": "v-radio-group"
      }, inputAttrs, inputProps, {
        "id": id.value
      }), { ...slots,
        default: _ref2 => {
          let {
            id,
            isDisabled,
            isReadonly
          } = _ref2;
          return _createVNode(_Fragment, null, [label && _createVNode(VLabel, {
            "for": id.value
          }, {
            default: () => [label]
          }), _createVNode(VSelectionControlGroup, _mergeProps(controlProps, {
            "id": id.value,
            "trueIcon": props.trueIcon,
            "falseIcon": props.falseIcon,
            "type": props.type,
            "disabled": isDisabled.value,
            "readonly": isReadonly.value
          }, controlAttrs), slots)]);
        }
      });
    });
    return {};
  }

});
//# sourceMappingURL=VRadioGroup.mjs.map