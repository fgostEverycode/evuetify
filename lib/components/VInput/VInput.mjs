import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
// Styles
import "./VInput.css"; // Components

import { VIcon } from "../VIcon/index.mjs";
import { VMessages } from "../VMessages/index.mjs"; // Composables

import { IconValue } from "../../composables/icons.mjs";
import { makeDensityProps, useDensity } from "../../composables/density.mjs";
import { makeValidationProps, useValidation } from "../../composables/validation.mjs"; // Utilities

import { computed } from 'vue';
import { genericComponent, getUid, pick, propsFactory, useRender } from "../../util/index.mjs"; // Types

export const makeVInputProps = propsFactory({
  id: String,
  appendIcon: IconValue,
  prependIcon: IconValue,
  hideDetails: [Boolean, String],
  messages: {
    type: [Array, String],
    default: () => []
  },
  direction: {
    type: String,
    default: 'horizontal',
    validator: v => ['horizontal', 'vertical'].includes(v)
  },
  ...makeDensityProps(),
  ...makeValidationProps()
});
export const VInput = genericComponent()({
  name: 'VInput',
  props: { ...makeVInputProps()
  },
  emits: {
    'update:modelValue': val => true
  },

  setup(props, _ref) {
    let {
      attrs,
      slots,
      emit
    } = _ref;
    const {
      densityClasses
    } = useDensity(props);
    const uid = getUid();
    const id = computed(() => props.id || `input-${uid}`);
    const {
      errorMessages,
      isDirty,
      isDisabled,
      isReadonly,
      isPristine,
      isValid,
      isValidating,
      reset,
      resetValidation,
      validate,
      validationClasses
    } = useValidation(props, 'v-input', id);
    const slotProps = computed(() => ({
      id,
      isDirty,
      isDisabled,
      isReadonly,
      isPristine,
      isValid,
      isValidating,
      reset,
      resetValidation,
      validate
    }));
    useRender(() => {
      var _props$messages, _slots$prepend, _slots$default, _slots$append, _slots$details;

      const hasPrepend = !!(slots.prepend || props.prependIcon);
      const hasAppend = !!(slots.append || props.appendIcon);
      const hasMessages = !!((_props$messages = props.messages) != null && _props$messages.length || errorMessages.value.length);
      const hasDetails = !props.hideDetails || props.hideDetails === 'auto' && hasMessages;
      return _createVNode("div", {
        "class": ['v-input', `v-input--${props.direction}`, densityClasses.value, validationClasses.value]
      }, [hasPrepend && _createVNode("div", {
        "key": "prepend",
        "class": "v-input__prepend"
      }, [props.prependIcon && _createVNode(VIcon, {
        "key": "prepend-icon",
        "onClick": attrs['onClick:prepend'],
        "icon": props.prependIcon
      }, null), (_slots$prepend = slots.prepend) == null ? void 0 : _slots$prepend.call(slots, slotProps.value)]), slots.default && _createVNode("div", {
        "class": "v-input__control"
      }, [(_slots$default = slots.default) == null ? void 0 : _slots$default.call(slots, slotProps.value)]), hasAppend && _createVNode("div", {
        "key": "append",
        "class": "v-input__append"
      }, [(_slots$append = slots.append) == null ? void 0 : _slots$append.call(slots, slotProps.value), props.appendIcon && _createVNode(VIcon, {
        "key": "append-icon",
        "onClick": attrs['onClick:append'],
        "icon": props.appendIcon
      }, null)]), hasDetails && _createVNode("div", {
        "class": "v-input__details"
      }, [_createVNode(VMessages, {
        "active": hasMessages,
        "messages": errorMessages.value.length > 0 ? errorMessages.value : props.messages
      }, {
        message: slots.message
      }), (_slots$details = slots.details) == null ? void 0 : _slots$details.call(slots, slotProps.value)])]);
    });
    return {
      reset,
      resetValidation,
      validate
    };
  }

});
export function filterInputProps(props) {
  return pick(props, Object.keys(VInput.props));
}
//# sourceMappingURL=VInput.mjs.map