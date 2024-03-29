import { createVNode as _createVNode } from "vue";
// Styles
import "./VAlert.css"; // Components

import { VAlertTitle } from "./VAlertTitle.mjs";
import { VDefaultsProvider } from "../VDefaultsProvider/index.mjs";
import { VIcon } from "../VIcon/index.mjs"; // Composables

import { genOverlays, makeVariantProps, useVariant } from "../../composables/variant.mjs";
import { makeDensityProps, useDensity } from "../../composables/density.mjs";
import { makeDimensionProps, useDimension } from "../../composables/dimensions.mjs";
import { makeElevationProps, useElevation } from "../../composables/elevation.mjs";
import { makeLocationProps, useLocation } from "../../composables/location.mjs";
import { makePositionProps, usePosition } from "../../composables/position.mjs";
import { makeRoundedProps, useRounded } from "../../composables/rounded.mjs";
import { makeTagProps } from "../../composables/tag.mjs";
import { makeThemeProps, provideTheme } from "../../composables/theme.mjs";
import { useProxiedModel } from "../../composables/proxiedModel.mjs";
import { useTextColor } from "../../composables/color.mjs";
import { IconValue } from "../../composables/icons.mjs"; // Utilities

import { computed, toRef } from 'vue';
import { defineComponent } from "../../util/index.mjs"; // Types

const allowedTypes = ['success', 'info', 'warning', 'error'];
export const VAlert = defineComponent({
  name: 'VAlert',
  props: {
    border: {
      type: [Boolean, String],
      validator: val => {
        return typeof val === 'boolean' || ['top', 'end', 'bottom', 'start'].includes(val);
      }
    },
    borderColor: String,
    closable: Boolean,
    closeIcon: {
      type: IconValue,
      default: '$close'
    },
    closeLabel: {
      type: String,
      default: '$vuetify.close'
    },
    icon: {
      type: [Boolean, String, Function, Object],
      default: null
    },
    modelValue: {
      type: Boolean,
      default: true
    },
    prominent: Boolean,
    title: String,
    text: String,
    type: {
      type: String,
      validator: val => allowedTypes.includes(val)
    },
    ...makeDensityProps(),
    ...makeDimensionProps(),
    ...makeElevationProps(),
    ...makeLocationProps(),
    ...makePositionProps(),
    ...makeRoundedProps(),
    ...makeTagProps(),
    ...makeThemeProps(),
    ...makeVariantProps({
      variant: 'flat'
    })
  },
  emits: {
    'update:modelValue': value => true
  },

  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const isActive = useProxiedModel(props, 'modelValue');
    const icon = computed(() => {
      var _props$icon;

      if (props.icon === false) return undefined;
      if (!props.type) return props.icon;
      return (_props$icon = props.icon) != null ? _props$icon : `$${props.type}`;
    });
    const variantProps = computed(() => {
      var _props$color;

      return {
        color: (_props$color = props.color) != null ? _props$color : props.type,
        variant: props.variant
      };
    });
    const {
      themeClasses
    } = provideTheme(props);
    const {
      colorClasses,
      colorStyles,
      variantClasses
    } = useVariant(variantProps);
    const {
      densityClasses
    } = useDensity(props);
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      locationStyles
    } = useLocation(props);
    const {
      positionClasses
    } = usePosition(props);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(toRef(props, 'borderColor'));

    function onCloseClick(e) {
      isActive.value = false;
    }

    return () => {
      var _slots$default;

      const hasPrepend = !!(slots.prepend || icon.value);
      const hasTitle = !!(slots.title || props.title);
      const hasText = !!(props.text || slots.text);
      const hasClose = !!(slots.close || props.closable);
      return isActive.value && _createVNode(props.tag, {
        "class": ['v-alert', props.border && {
          'v-alert--border': !!props.border,
          [`v-alert--border-${props.border === true ? 'start' : props.border}`]: true
        }, {
          'v-alert--prominent': props.prominent
        }, themeClasses.value, colorClasses.value, densityClasses.value, elevationClasses.value, positionClasses.value, roundedClasses.value, variantClasses.value],
        "style": [colorStyles.value, dimensionStyles.value, locationStyles.value],
        "role": "alert"
      }, {
        default: () => [genOverlays(false, 'v-alert'), props.border && _createVNode("div", {
          "key": "border",
          "class": ['v-alert__border', textColorClasses.value],
          "style": textColorStyles.value
        }, null), hasPrepend && _createVNode(VDefaultsProvider, {
          "key": "prepend",
          "defaults": {
            VIcon: {
              density: props.density,
              icon: icon.value,
              size: props.prominent ? 44 : 'default'
            }
          }
        }, {
          default: () => [_createVNode("div", {
            "class": "v-alert__prepend"
          }, [slots.prepend ? slots.prepend() : icon.value && _createVNode(VIcon, null, null)])]
        }), _createVNode("div", {
          "class": "v-alert__content"
        }, [hasTitle && _createVNode(VAlertTitle, {
          "key": "title"
        }, {
          default: () => [slots.title ? slots.title() : props.title]
        }), hasText && (slots.text ? slots.text() : props.text), (_slots$default = slots.default) == null ? void 0 : _slots$default.call(slots)]), slots.append && _createVNode("div", {
          "key": "append",
          "class": "v-alert__append"
        }, [slots.append()]), hasClose && _createVNode(VDefaultsProvider, {
          "key": "close",
          "defaults": {
            VIcon: {
              icon: props.closeIcon,
              size: 'small'
            }
          }
        }, {
          default: () => [_createVNode("div", {
            "class": "v-alert__close",
            "onClick": onCloseClick
          }, [slots.close ? slots.close() : _createVNode(VIcon, null, null)])]
        })]
      });
    };
  }

});
//# sourceMappingURL=VAlert.mjs.map