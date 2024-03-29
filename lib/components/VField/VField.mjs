import { mergeProps as _mergeProps, Fragment as _Fragment, withDirectives as _withDirectives, vShow as _vShow, resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
// Styles
import "./VField.css"; // Components

import { VExpandXTransition } from "../transitions/index.mjs";
import { VFieldLabel } from "./VFieldLabel.mjs";
import { VIcon } from "../VIcon/index.mjs"; // Composables

import { IconValue } from "../../composables/icons.mjs";
import { LoaderSlot, makeLoaderProps, useLoader } from "../../composables/loader.mjs";
import { makeFocusProps, useFocus } from "../../composables/focus.mjs";
import { makeThemeProps, provideTheme } from "../../composables/theme.mjs";
import { useBackgroundColor, useTextColor } from "../../composables/color.mjs"; // Utilities

import { computed, ref, toRef, watch } from 'vue';
import { convertToUnit, genericComponent, getUid, nullifyTransforms, pick, propsFactory, standardEasing, useRender } from "../../util/index.mjs"; // Types

const allowedVariants = ['underlined', 'outlined', 'filled', 'solo', 'plain'];
export const makeVFieldProps = propsFactory({
  appendInnerIcon: IconValue,
  bgColor: String,
  clearable: Boolean,
  clearIcon: {
    type: IconValue,
    default: '$clear'
  },
  active: Boolean,
  color: String,
  dirty: Boolean,
  disabled: Boolean,
  error: Boolean,
  label: String,
  persistentClear: Boolean,
  prependInnerIcon: IconValue,
  reverse: Boolean,
  singleLine: Boolean,
  variant: {
    type: String,
    default: 'filled',
    validator: v => allowedVariants.includes(v)
  },
  ...makeThemeProps(),
  ...makeLoaderProps()
}, 'v-field');
export const VField = genericComponent()({
  name: 'VField',
  inheritAttrs: false,
  props: {
    id: String,
    ...makeFocusProps(),
    ...makeVFieldProps()
  },
  emits: {
    'click:clear': e => true,
    'click:control': e => true,
    'update:focused': focused => true,
    'update:modelValue': val => true
  },

  setup(props, _ref) {
    let {
      attrs,
      emit,
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      loaderClasses
    } = useLoader(props);
    const {
      focusClasses,
      isFocused,
      focus,
      blur
    } = useFocus(props);
    const isActive = computed(() => props.dirty || props.active);
    const hasLabel = computed(() => !props.singleLine && !!(props.label || slots.label));
    const uid = getUid();
    const id = computed(() => props.id || `input-${uid}`);
    const labelRef = ref();
    const floatingLabelRef = ref();
    const controlRef = ref();
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, 'bgColor'));
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(computed(() => {
      return isActive.value && isFocused.value && !props.error && !props.disabled ? props.color : undefined;
    }));
    watch(isActive, val => {
      if (hasLabel.value) {
        const el = labelRef.value.$el;
        const targetEl = floatingLabelRef.value.$el;
        const rect = nullifyTransforms(el);
        const targetRect = targetEl.getBoundingClientRect();
        const x = targetRect.x - rect.x;
        const y = targetRect.y - rect.y - (rect.height / 2 - targetRect.height / 2);
        const targetWidth = targetRect.width / 0.75;
        const width = Math.abs(targetWidth - rect.width) > 1 ? {
          maxWidth: convertToUnit(targetWidth)
        } : undefined;
        const duration = parseFloat(getComputedStyle(el).transitionDuration) * 1000;
        const scale = parseFloat(getComputedStyle(targetEl).getPropertyValue('--v-field-label-scale'));
        el.style.visibility = 'visible';
        targetEl.style.visibility = 'hidden';
        el.animate([{
          transform: 'translate(0)'
        }, {
          transform: `translate(${x}px, ${y}px) scale(${scale})`,
          ...width
        }], {
          duration,
          easing: standardEasing,
          direction: val ? 'normal' : 'reverse'
        }).finished.then(() => {
          el.style.removeProperty('visibility');
          targetEl.style.removeProperty('visibility');
        });
      }
    }, {
      flush: 'post'
    });
    const slotProps = computed(() => ({
      isActive,
      isFocused,
      controlRef,
      blur,
      focus
    }));

    function onClick(e) {
      if (e.target !== document.activeElement) {
        e.preventDefault();
      }

      emit('click:control', e);
    }

    useRender(() => {
      var _slots$prependInner, _slots$default, _slots$appendInner;

      const isOutlined = props.variant === 'outlined';
      const hasPrepend = slots['prepend-inner'] || props.prependInnerIcon;
      const hasClear = !!(props.clearable || slots.clear);
      const hasAppend = !!(slots['append-inner'] || props.appendInnerIcon || hasClear);
      const label = slots.label ? slots.label({
        label: props.label,
        props: {
          for: id.value
        }
      }) : props.label;
      return _createVNode("div", _mergeProps({
        "class": ['v-field', {
          'v-field--active': isActive.value,
          'v-field--appended': hasAppend,
          'v-field--disabled': props.disabled,
          'v-field--dirty': props.dirty,
          'v-field--error': props.error,
          'v-field--has-background': !!props.bgColor,
          'v-field--persistent-clear': props.persistentClear,
          'v-field--prepended': hasPrepend,
          'v-field--reverse': props.reverse,
          'v-field--single-line': props.singleLine,
          'v-field--has-label': !!label,
          [`v-field--variant-${props.variant}`]: true
        }, themeClasses.value, backgroundColorClasses.value, focusClasses.value, loaderClasses.value],
        "style": [backgroundColorStyles.value, textColorStyles.value],
        "onClick": onClick
      }, attrs), [_createVNode("div", {
        "class": "v-field__overlay"
      }, null), _createVNode(LoaderSlot, {
        "name": "v-field",
        "active": props.loading,
        "color": props.error ? 'error' : props.color
      }, {
        default: slots.loader
      }), hasPrepend && _createVNode("div", {
        "key": "prepend",
        "class": "v-field__prepend-inner"
      }, [props.prependInnerIcon && _createVNode(VIcon, {
        "key": "prepend-icon",
        "onClick": attrs['onClick:prependInner'],
        "icon": props.prependInnerIcon
      }, null), (_slots$prependInner = slots['prepend-inner']) == null ? void 0 : _slots$prependInner.call(slots, slotProps.value)]), _createVNode("div", {
        "class": "v-field__field",
        "data-no-activator": ""
      }, [['solo', 'filled'].includes(props.variant) && hasLabel.value && _createVNode(VFieldLabel, {
        "key": "floating-label",
        "ref": floatingLabelRef,
        "class": [textColorClasses.value],
        "floating": true
      }, {
        default: () => [label]
      }), _createVNode(VFieldLabel, {
        "ref": labelRef,
        "for": id.value
      }, {
        default: () => [label]
      }), (_slots$default = slots.default) == null ? void 0 : _slots$default.call(slots, { ...slotProps.value,
        props: {
          id: id.value,
          class: 'v-field__input'
        },
        focus,
        blur
      })]), hasClear && _createVNode(VExpandXTransition, {
        "key": "clear"
      }, {
        default: () => [_withDirectives(_createVNode("div", {
          "class": "v-field__clearable"
        }, [slots.clear ? slots.clear() : _createVNode(VIcon, {
          "onClick": e => emit('click:clear', e),
          "icon": props.clearIcon
        }, null)]), [[_vShow, props.dirty]])]
      }), hasAppend && _createVNode("div", {
        "key": "append",
        "class": "v-field__append-inner"
      }, [(_slots$appendInner = slots['append-inner']) == null ? void 0 : _slots$appendInner.call(slots, slotProps.value), props.appendInnerIcon && _createVNode(VIcon, {
        "key": "append-icon",
        "onClick": attrs['onClick:appendInner'],
        "icon": props.appendInnerIcon
      }, null)]), _createVNode("div", {
        "class": ['v-field__outline', textColorClasses.value]
      }, [isOutlined && _createVNode(_Fragment, null, [_createVNode("div", {
        "class": "v-field__outline__start"
      }, null), hasLabel.value && _createVNode("div", {
        "class": "v-field__outline__notch"
      }, [_createVNode(VFieldLabel, {
        "ref": floatingLabelRef,
        "floating": true
      }, {
        default: () => [label]
      })]), _createVNode("div", {
        "class": "v-field__outline__end"
      }, null)]), ['plain', 'underlined'].includes(props.variant) && hasLabel.value && _createVNode(VFieldLabel, {
        "ref": floatingLabelRef,
        "floating": true
      }, {
        default: () => [label]
      })])]);
    });
    return {
      controlRef
    };
  }

});
// TODO: this is kinda slow, might be better to implicitly inherit props instead
export function filterFieldProps(attrs) {
  return pick(attrs, Object.keys(VField.props));
}
//# sourceMappingURL=VField.mjs.map