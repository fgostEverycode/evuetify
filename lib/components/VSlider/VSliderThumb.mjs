import { vShow as _vShow, withDirectives as _withDirectives, resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
// Styles
import "./VSliderThumb.css"; // Components

import { VScaleTransition } from "../transitions/index.mjs";
import { VSliderSymbol } from "./slider.mjs"; // Directives

import Ripple from "../../directives/ripple/index.mjs"; // Composables

import { useElevation } from "../../composables/elevation.mjs";
import { useTextColor } from "../../composables/color.mjs"; // Utilities

import { computed, inject } from 'vue';
import { convertToUnit, defineComponent, keyValues, useRender } from "../../util/index.mjs";
export const VSliderThumb = defineComponent({
  name: 'VSliderThumb',
  directives: {
    Ripple
  },
  props: {
    focused: Boolean,
    max: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      required: true
    },
    modelValue: {
      type: Number,
      required: true
    },
    position: {
      type: Number,
      required: true
    }
  },
  emits: {
    'update:modelValue': v => true
  },

  setup(props, _ref) {
    let {
      slots,
      emit
    } = _ref;
    const slider = inject(VSliderSymbol);
    if (!slider) throw new Error('[Vuetify] v-slider-thumb must be used inside v-slider or v-range-slider');
    const {
      thumbColor,
      step,
      vertical,
      disabled,
      thumbSize,
      thumbLabel,
      direction,
      readonly,
      elevation,
      isReversed,
      horizontalDirection,
      mousePressed,
      decimals
    } = slider;
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(thumbColor);
    const {
      pageup,
      pagedown,
      end,
      home,
      left,
      right,
      down,
      up
    } = keyValues;
    const relevantKeys = [pageup, pagedown, end, home, left, right, down, up];
    const multipliers = computed(() => {
      if (step.value) return [1, 2, 3];else return [1, 5, 10];
    });

    function parseKeydown(e, value) {
      if (!relevantKeys.includes(e.key)) return;
      e.preventDefault();

      const _step = step.value || 0.1;

      const steps = (props.max - props.min) / _step;

      if ([left, right, down, up].includes(e.key)) {
        const increase = isReversed.value ? [left, up] : [right, up];
        const direction = increase.includes(e.key) ? 1 : -1;
        const multiplier = e.shiftKey ? 2 : e.ctrlKey ? 1 : 0;
        value = value + direction * _step * multipliers.value[multiplier];
      } else if (e.key === home) {
        value = props.min;
      } else if (e.key === end) {
        value = props.max;
      } else {
        const direction = e.key === pagedown ? 1 : -1;
        value = value - direction * _step * (steps > 100 ? steps / 10 : 10);
      }

      return Math.max(props.min, Math.min(props.max, value));
    }

    function onKeydown(e) {
      const newValue = parseKeydown(e, props.modelValue);
      newValue != null && emit('update:modelValue', newValue);
    }

    useRender(() => {
      var _slots$thumbLabel, _slots$thumbLabel2;

      const positionPercentage = convertToUnit(vertical.value ? 100 - props.position : props.position, '%');
      const inset = vertical.value ? 'block' : 'inline';
      const {
        elevationClasses
      } = useElevation(computed(() => !disabled.value ? elevation.value : undefined));
      return _createVNode("div", {
        "class": ['v-slider-thumb', {
          'v-slider-thumb--focused': props.focused,
          'v-slider-thumb--pressed': props.focused && mousePressed.value
        }],
        "style": {
          [`inset-${inset}-start`]: `calc(${positionPercentage} - var(--v-slider-thumb-size) / 2)`,
          '--v-slider-thumb-size': convertToUnit(thumbSize.value),
          direction: !vertical.value ? horizontalDirection.value : undefined
        },
        "role": "slider",
        "tabindex": disabled.value ? -1 : 0,
        "aria-valuemin": props.min,
        "aria-valuemax": props.max,
        "aria-valuenow": props.modelValue,
        "aria-readonly": readonly.value,
        "aria-orientation": direction.value,
        "onKeydown": !readonly.value ? onKeydown : undefined
      }, [_createVNode("div", {
        "class": ['v-slider-thumb__surface', textColorClasses.value, elevationClasses.value],
        "style": { ...textColorStyles.value
        }
      }, null), _withDirectives(_createVNode("div", {
        "class": ['v-slider-thumb__ripple', textColorClasses.value],
        "style": textColorStyles.value
      }, null), [[_resolveDirective("ripple"), true, null, {
        circle: true,
        center: true
      }]]), _createVNode(VScaleTransition, {
        "origin": "bottom center"
      }, {
        default: () => [_withDirectives(_createVNode("div", {
          "class": "v-slider-thumb__label-container"
        }, [_createVNode("div", {
          "class": ['v-slider-thumb__label']
        }, [_createVNode("div", null, [(_slots$thumbLabel = (_slots$thumbLabel2 = slots['thumb-label']) == null ? void 0 : _slots$thumbLabel2.call(slots, {
          modelValue: props.modelValue
        })) != null ? _slots$thumbLabel : props.modelValue.toFixed(step.value ? decimals.value : 1)])])]), [[_vShow, thumbLabel.value && props.focused || thumbLabel.value === 'always']])]
      })]);
    });
    return {};
  }

});
//# sourceMappingURL=VSliderThumb.mjs.map