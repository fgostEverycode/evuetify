import { resolveDirective as _resolveDirective, withDirectives as _withDirectives, mergeProps as _mergeProps, vModelDynamic as _vModelDynamic, createVNode as _createVNode } from "vue";
// Styles
import "./VSelectionControl.css"; // Components

import { VIcon } from "../VIcon/index.mjs";
import { VLabel } from "../VLabel/index.mjs";
import { VSelectionControlGroupSymbol } from "../VSelectionControlGroup/VSelectionControlGroup.mjs"; // Directives

import { Ripple } from "../../directives/ripple/index.mjs"; // Composables

import { IconValue } from "../../composables/icons.mjs";
import { makeDensityProps, useDensity } from "../../composables/density.mjs";
import { makeThemeProps } from "../../composables/theme.mjs";
import { useProxiedModel } from "../../composables/proxiedModel.mjs";
import { useTextColor } from "../../composables/color.mjs"; // Utilities

import { computed, inject, ref } from 'vue';
import { deepEqual, filterInputAttrs, genericComponent, getUid, pick, propsFactory, SUPPORTS_FOCUS_VISIBLE, useRender, wrapInArray } from "../../util/index.mjs"; // Types

export const makeSelectionControlProps = propsFactory({
  color: String,
  disabled: Boolean,
  error: Boolean,
  id: String,
  inline: Boolean,
  label: String,
  falseIcon: IconValue,
  trueIcon: IconValue,
  ripple: {
    type: Boolean,
    default: true
  },
  multiple: {
    type: Boolean,
    default: null
  },
  name: String,
  readonly: Boolean,
  trueValue: null,
  falseValue: null,
  modelValue: null,
  type: String,
  value: null,
  valueComparator: {
    type: Function,
    default: deepEqual
  },
  ...makeThemeProps(),
  ...makeDensityProps()
});
export function useSelectionControl(props) {
  const group = inject(VSelectionControlGroupSymbol, undefined);
  const {
    densityClasses
  } = useDensity(props);
  const modelValue = useProxiedModel(props, 'modelValue');
  const trueValue = computed(() => props.trueValue !== undefined ? props.trueValue : props.value !== undefined ? props.value : true);
  const falseValue = computed(() => props.falseValue !== undefined ? props.falseValue : false);
  const isMultiple = computed(() => (group == null ? void 0 : group.multiple.value) || !!props.multiple || props.multiple == null && Array.isArray(modelValue.value));
  const model = computed({
    get() {
      const val = group ? group.modelValue.value : modelValue.value;
      return isMultiple.value ? val.some(v => props.valueComparator(v, trueValue.value)) : props.valueComparator(val, trueValue.value);
    },

    set(val) {
      if (props.readonly) return;
      const currentValue = val ? trueValue.value : falseValue.value;
      let newVal = currentValue;

      if (isMultiple.value) {
        newVal = val ? [...wrapInArray(modelValue.value), currentValue] : wrapInArray(modelValue.value).filter(item => !props.valueComparator(item, trueValue.value));
      }

      if (group) {
        group.modelValue.value = newVal;
      } else {
        modelValue.value = newVal;
      }
    }

  });
  const {
    textColorClasses,
    textColorStyles
  } = useTextColor(computed(() => {
    return model.value && !props.error && !props.disabled ? props.color : undefined;
  }));
  const icon = computed(() => {
    var _group$trueIcon$value, _group$falseIcon$valu;

    return model.value ? (_group$trueIcon$value = group == null ? void 0 : group.trueIcon.value) != null ? _group$trueIcon$value : props.trueIcon : (_group$falseIcon$valu = group == null ? void 0 : group.falseIcon.value) != null ? _group$falseIcon$valu : props.falseIcon;
  });
  return {
    group,
    densityClasses,
    trueValue,
    falseValue,
    model,
    textColorClasses,
    textColorStyles,
    icon
  };
}
export const VSelectionControl = genericComponent()({
  name: 'VSelectionControl',
  directives: {
    Ripple
  },
  inheritAttrs: false,
  props: makeSelectionControlProps(),
  emits: {
    'update:modelValue': val => true
  },

  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      densityClasses,
      group,
      icon,
      model,
      textColorClasses,
      textColorStyles,
      trueValue
    } = useSelectionControl(props);
    const uid = getUid();
    const id = computed(() => props.id || `input-${uid}`);
    const isFocused = ref(false);
    const isFocusVisible = ref(false);
    const input = ref();

    function onFocus(e) {
      isFocused.value = true;

      if (!SUPPORTS_FOCUS_VISIBLE || SUPPORTS_FOCUS_VISIBLE && e.target.matches(':focus-visible')) {
        isFocusVisible.value = true;
      }
    }

    function onBlur() {
      isFocused.value = false;
      isFocusVisible.value = false;
    }

    useRender(() => {
      var _group$type$value, _slots$default, _group$name$value, _slots$input;

      const label = slots.label ? slots.label({
        label: props.label,
        props: {
          for: id.value
        }
      }) : props.label;
      const type = (_group$type$value = group == null ? void 0 : group.type.value) != null ? _group$type$value : props.type;
      const [rootAttrs, inputAttrs] = filterInputAttrs(attrs);
      return _createVNode("div", _mergeProps({
        "class": ['v-selection-control', {
          'v-selection-control--dirty': model.value,
          'v-selection-control--disabled': props.disabled,
          'v-selection-control--error': props.error,
          'v-selection-control--focused': isFocused.value,
          'v-selection-control--focus-visible': isFocusVisible.value,
          'v-selection-control--inline': (group == null ? void 0 : group.inline.value) || props.inline
        }, densityClasses.value]
      }, rootAttrs), [_createVNode("div", {
        "class": ['v-selection-control__wrapper', textColorClasses.value],
        "style": textColorStyles.value
      }, [(_slots$default = slots.default) == null ? void 0 : _slots$default.call(slots), _withDirectives(_createVNode("div", {
        "class": ['v-selection-control__input']
      }, [icon.value && _createVNode(VIcon, {
        "key": "icon",
        "icon": icon.value
      }, null), _withDirectives(_createVNode("input", _mergeProps({
        "onUpdate:modelValue": $event => model.value = $event,
        "ref": input,
        "disabled": props.disabled,
        "id": id.value,
        "onBlur": onBlur,
        "onFocus": onFocus,
        "aria-readonly": props.readonly,
        "type": type,
        "value": trueValue.value,
        "name": (_group$name$value = group == null ? void 0 : group.name.value) != null ? _group$name$value : props.name,
        "aria-checked": type === 'checkbox' ? model.value : undefined
      }, inputAttrs), null), [[_vModelDynamic, model.value]]), (_slots$input = slots.input) == null ? void 0 : _slots$input.call(slots, {
        model,
        textColorClasses,
        props: {
          onFocus,
          onBlur,
          id: id.value
        }
      })]), [[_resolveDirective("ripple"), props.ripple && [!props.disabled && !props.readonly, null, ['center', 'circle']]]])]), label && _createVNode(VLabel, {
        "for": id.value
      }, {
        default: () => [label]
      })]);
    });
    return {
      isFocused,
      input
    };
  }

});
export function filterControlProps(props) {
  return pick(props, Object.keys(VSelectionControl.props));
}
//# sourceMappingURL=VSelectionControl.mjs.map