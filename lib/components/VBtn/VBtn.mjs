import { withDirectives as _withDirectives, resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
// Styles
import "./VBtn.css"; // Components

import { VBtnToggleSymbol } from "../VBtnToggle/VBtnToggle.mjs";
import { VDefaultsProvider } from "../VDefaultsProvider/index.mjs";
import { VIcon } from "../VIcon/index.mjs";
import { VProgressCircular } from "../VProgressCircular/index.mjs"; // Directives

import { Ripple } from "../../directives/ripple/index.mjs"; // Composables

import { genOverlays, makeVariantProps, useVariant } from "../../composables/variant.mjs";
import { IconValue } from "../../composables/icons.mjs";
import { makeBorderProps, useBorder } from "../../composables/border.mjs";
import { makeDensityProps, useDensity } from "../../composables/density.mjs";
import { makeDimensionProps, useDimension } from "../../composables/dimensions.mjs";
import { makeElevationProps, useElevation } from "../../composables/elevation.mjs";
import { makeGroupItemProps, useGroupItem } from "../../composables/group.mjs";
import { makeLoaderProps, useLoader } from "../../composables/loader.mjs";
import { makeLocationProps, useLocation } from "../../composables/location.mjs";
import { makePositionProps, usePosition } from "../../composables/position.mjs";
import { makeRoundedProps, useRounded } from "../../composables/rounded.mjs";
import { makeRouterProps, useLink } from "../../composables/router.mjs";
import { makeSizeProps, useSize } from "../../composables/size.mjs";
import { makeTagProps } from "../../composables/tag.mjs";
import { makeThemeProps, provideTheme } from "../../composables/theme.mjs";
import { useSelectLink } from "../../composables/selectLink.mjs"; // Utilities

import { computed } from 'vue';
import { defineComponent, useRender } from "../../util/index.mjs"; // Types

export const VBtn = defineComponent({
  name: 'VBtn',
  directives: {
    Ripple
  },
  props: {
    active: Boolean,
    symbol: {
      type: null,
      default: VBtnToggleSymbol
    },
    flat: Boolean,
    icon: [Boolean, String, Function, Object],
    prependIcon: IconValue,
    appendIcon: IconValue,
    block: Boolean,
    stacked: Boolean,
    ripple: {
      type: Boolean,
      default: true
    },
    ...makeBorderProps(),
    ...makeRoundedProps(),
    ...makeDensityProps(),
    ...makeDimensionProps(),
    ...makeElevationProps(),
    ...makeGroupItemProps(),
    ...makeLoaderProps(),
    ...makeLocationProps(),
    ...makePositionProps(),
    ...makeRouterProps(),
    ...makeSizeProps(),
    ...makeTagProps({
      tag: 'button'
    }),
    ...makeThemeProps(),
    ...makeVariantProps({
      variant: 'elevated'
    })
  },

  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      borderClasses
    } = useBorder(props);
    const {
      colorClasses,
      colorStyles,
      variantClasses
    } = useVariant(props);
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
      loaderClasses
    } = useLoader(props);
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
      sizeClasses
    } = useSize(props);
    const group = useGroupItem(props, props.symbol, false);
    const link = useLink(props, attrs);
    const isDisabled = computed(() => (group == null ? void 0 : group.disabled.value) || props.disabled);
    const isElevated = computed(() => {
      return props.variant === 'elevated' && !(props.disabled || props.flat || props.border);
    });
    useSelectLink(link, group == null ? void 0 : group.select);
    useRender(() => {
      var _slots$prepend, _slots$prepend2, _slots$default, _slots$default2, _slots$append, _slots$append2, _slots$loader, _slots$loader2;

      const Tag = link.isLink.value ? 'a' : props.tag;
      const hasColor = !group || group.isSelected.value;
      const hasPrepend = !!(props.prependIcon || slots.prepend);
      const hasAppend = !!(props.appendIcon || slots.append);
      return _withDirectives(_createVNode(Tag, {
        "type": Tag === 'a' ? undefined : 'button',
        "class": ['v-btn', group == null ? void 0 : group.selectedClass.value, {
          'v-btn--active': props.active,
          'v-btn--block': props.block,
          'v-btn--disabled': isDisabled.value,
          'v-btn--elevated': isElevated.value,
          'v-btn--flat': props.flat,
          'v-btn--icon': !!props.icon,
          'v-btn--loading': props.loading,
          'v-btn--stacked': props.stacked
        }, themeClasses.value, borderClasses.value, hasColor ? colorClasses.value : undefined, densityClasses.value, elevationClasses.value, loaderClasses.value, positionClasses.value, roundedClasses.value, sizeClasses.value, variantClasses.value],
        "style": [hasColor ? colorStyles.value : undefined, dimensionStyles.value, locationStyles.value],
        "disabled": isDisabled.value || undefined,
        "href": link.href.value,
        "onClick": e => {
          var _link$navigate;

          if (isDisabled.value) return;
          (_link$navigate = link.navigate) == null ? void 0 : _link$navigate.call(link, e);
          group == null ? void 0 : group.toggle();
        }
      }, {
        default: () => [genOverlays(true, 'v-btn'), !props.icon && hasPrepend && _createVNode(VDefaultsProvider, {
          "key": "prepend",
          "defaults": {
            VIcon: {
              icon: props.prependIcon
            }
          }
        }, {
          default: () => [_createVNode("div", {
            "class": "v-btn__prepend"
          }, [(_slots$prepend = (_slots$prepend2 = slots.prepend) == null ? void 0 : _slots$prepend2.call(slots)) != null ? _slots$prepend : _createVNode(VIcon, null, null)])]
        }), _createVNode("div", {
          "class": "v-btn__content",
          "data-no-activator": ""
        }, [_createVNode(VDefaultsProvider, {
          "key": "content",
          "defaults": {
            VIcon: {
              icon: typeof props.icon === 'string' ? props.icon : undefined
            }
          }
        }, {
          default: () => [(_slots$default = (_slots$default2 = slots.default) == null ? void 0 : _slots$default2.call(slots)) != null ? _slots$default : typeof props.icon === 'string' && _createVNode(VIcon, {
            "key": "icon"
          }, null)]
        })]), !props.icon && hasAppend && _createVNode(VDefaultsProvider, {
          "key": "append",
          "defaults": {
            VIcon: {
              icon: props.appendIcon
            }
          }
        }, {
          default: () => [_createVNode("div", {
            "class": "v-btn__append"
          }, [(_slots$append = (_slots$append2 = slots.append) == null ? void 0 : _slots$append2.call(slots)) != null ? _slots$append : _createVNode(VIcon, null, null)])]
        }), !!props.loading && _createVNode("span", {
          "key": "loader",
          "class": "v-btn__loader"
        }, [(_slots$loader = (_slots$loader2 = slots.loader) == null ? void 0 : _slots$loader2.call(slots)) != null ? _slots$loader : _createVNode(VProgressCircular, {
          "color": typeof props.loading === 'boolean' ? undefined : props.loading,
          "indeterminate": true,
          "size": "23",
          "width": "2"
        }, null)])]
      }), [[_resolveDirective("ripple"), !isDisabled.value && props.ripple, null]]);
    });
    return {};
  }

});
//# sourceMappingURL=VBtn.mjs.map