import { createVNode as _createVNode } from "vue";
// Styles
import "./VColorPicker.css"; // Components

import { VColorPickerCanvas } from "./VColorPickerCanvas.mjs";
import { VColorPickerEdit } from "./VColorPickerEdit.mjs";
import { VColorPickerPreview } from "./VColorPickerPreview.mjs";
import { VColorPickerSwatches } from "./VColorPickerSwatches.mjs";
import { VSheet } from "../VSheet/index.mjs"; // Composables

import { makeElevationProps } from "../../composables/elevation.mjs";
import { makeRoundedProps } from "../../composables/rounded.mjs";
import { makeThemeProps } from "../../composables/theme.mjs";
import { useProxiedModel } from "../../composables/proxiedModel.mjs"; // Utilities

import { defineComponent, HSVAtoCSS, useRender } from "../../util/index.mjs";
import { extractColor, modes, nullColor, parseColor } from "./util/index.mjs";
import { onMounted, ref } from 'vue'; // Types

export const VColorPicker = defineComponent({
  name: 'VColorPicker',
  inheritAttrs: false,
  props: {
    canvasHeight: {
      type: [String, Number],
      default: 150
    },
    disabled: Boolean,
    dotSize: {
      type: [Number, String],
      default: 10
    },
    hideCanvas: Boolean,
    hideSliders: Boolean,
    hideInputs: Boolean,
    mode: {
      type: String,
      default: 'rgba',
      validator: v => Object.keys(modes).includes(v)
    },
    modes: {
      type: Array,
      default: () => Object.keys(modes),
      validator: v => Array.isArray(v) && v.every(m => Object.keys(modes).includes(m))
    },
    showSwatches: Boolean,
    swatches: Array,
    swatchesMaxHeight: {
      type: [Number, String],
      default: 150
    },
    modelValue: {
      type: [Object, String]
    },
    width: {
      type: [Number, String],
      default: 300
    },
    ...makeElevationProps(),
    ...makeRoundedProps(),
    ...makeThemeProps()
  },
  emits: {
    'update:modelValue': color => true,
    'update:mode': mode => true
  },

  setup(props) {
    const mode = useProxiedModel(props, 'mode');
    const lastPickedColor = ref(null);
    const currentColor = useProxiedModel(props, 'modelValue', undefined, v => {
      let c = parseColor(v);
      if (!c) return null;

      if (lastPickedColor.value) {
        c = { ...c,
          h: lastPickedColor.value.h
        };
        lastPickedColor.value = null;
      }

      return c;
    }, v => {
      if (!v) return null;
      return extractColor(v, props.modelValue);
    });

    const updateColor = hsva => {
      currentColor.value = hsva;
      lastPickedColor.value = hsva;
    };

    onMounted(() => {
      if (!props.modes.includes(mode.value)) mode.value = props.modes[0];
    });
    useRender(() => {
      var _currentColor$value;

      return _createVNode(VSheet, {
        "rounded": props.rounded,
        "elevation": props.elevation,
        "theme": props.theme,
        "class": ['v-color-picker'],
        "style": {
          '--v-color-picker-color-hsv': HSVAtoCSS({ ...((_currentColor$value = currentColor.value) != null ? _currentColor$value : nullColor),
            a: 1
          })
        },
        "maxWidth": props.width
      }, {
        default: () => [!props.hideCanvas && _createVNode(VColorPickerCanvas, {
          "key": "canvas",
          "color": currentColor.value,
          "onUpdate:color": updateColor,
          "disabled": props.disabled,
          "dotSize": props.dotSize,
          "width": props.width,
          "height": props.canvasHeight
        }, null), (!props.hideSliders || !props.hideInputs) && _createVNode("div", {
          "key": "controls",
          "class": "v-color-picker__controls"
        }, [!props.hideSliders && _createVNode(VColorPickerPreview, {
          "key": "preview",
          "color": currentColor.value,
          "onUpdate:color": updateColor,
          "hideAlpha": !mode.value.endsWith('a'),
          "disabled": props.disabled
        }, null), !props.hideInputs && _createVNode(VColorPickerEdit, {
          "key": "edit",
          "modes": props.modes,
          "mode": mode.value,
          "onUpdate:mode": m => mode.value = m,
          "color": currentColor.value,
          "onUpdate:color": updateColor,
          "disabled": props.disabled
        }, null)]), props.showSwatches && _createVNode(VColorPickerSwatches, {
          "key": "swatches",
          "color": currentColor.value,
          "onUpdate:color": updateColor,
          "maxHeight": props.swatchesMaxHeight,
          "swatches": props.swatches,
          "disabled": props.disabled
        }, null)]
      });
    });
    return {};
  }

});
//# sourceMappingURL=VColorPicker.mjs.map