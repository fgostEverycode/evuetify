import { resolveDirective as _resolveDirective, withDirectives as _withDirectives, vShow as _vShow, createVNode as _createVNode } from "vue";

/* eslint-disable complexity */
// Styles
import "./VChip.css"; // Components

import { VAvatar } from "../VAvatar/index.mjs";
import { VChipGroupSymbol } from "../VChipGroup/VChipGroup.mjs";
import { VDefaultsProvider } from "../VDefaultsProvider/index.mjs";
import { VExpandXTransition } from "../transitions/index.mjs";
import { VIcon } from "../VIcon/index.mjs"; // Composables

import { genOverlays, makeVariantProps, useVariant } from "../../composables/variant.mjs";
import { makeBorderProps, useBorder } from "../../composables/border.mjs";
import { makeDensityProps, useDensity } from "../../composables/density.mjs";
import { makeElevationProps, useElevation } from "../../composables/elevation.mjs";
import { makeGroupItemProps, useGroupItem } from "../../composables/group.mjs";
import { makeRoundedProps, useRounded } from "../../composables/rounded.mjs";
import { makeRouterProps, useLink } from "../../composables/router.mjs";
import { makeSizeProps, useSize } from "../../composables/size.mjs";
import { makeTagProps } from "../../composables/tag.mjs";
import { makeThemeProps, provideTheme } from "../../composables/theme.mjs";
import { useProxiedModel } from "../../composables/proxiedModel.mjs";
import { IconValue } from "../../composables/icons.mjs"; // Directives

import { Ripple } from "../../directives/ripple/index.mjs"; // Utilities

import { defineComponent } from "../../util/index.mjs";
export const VChip = defineComponent({
  name: 'VChip',
  directives: {
    Ripple
  },
  props: {
    activeClass: String,
    appendAvatar: String,
    appendIcon: IconValue,
    closable: Boolean,
    closeIcon: {
      type: IconValue,
      default: '$delete'
    },
    closeLabel: {
      type: String,
      default: '$vuetify.close'
    },
    draggable: Boolean,
    filter: Boolean,
    filterIcon: {
      type: String,
      default: '$complete'
    },
    label: Boolean,
    link: Boolean,
    pill: Boolean,
    prependAvatar: String,
    prependIcon: IconValue,
    ripple: {
      type: Boolean,
      default: true
    },
    text: String,
    modelValue: {
      type: Boolean,
      default: true
    },
    ...makeBorderProps(),
    ...makeDensityProps(),
    ...makeElevationProps(),
    ...makeGroupItemProps(),
    ...makeRoundedProps(),
    ...makeRouterProps(),
    ...makeSizeProps(),
    ...makeTagProps({
      tag: 'span'
    }),
    ...makeThemeProps(),
    ...makeVariantProps({
      variant: 'tonal'
    })
  },
  emits: {
    'click:close': e => true,
    'update:active': value => true,
    'update:modelValue': value => true
  },

  setup(props, _ref) {
    let {
      attrs,
      emit,
      slots
    } = _ref;
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
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      sizeClasses
    } = useSize(props);
    const {
      themeClasses
    } = provideTheme(props);
    const isActive = useProxiedModel(props, 'modelValue');
    const group = useGroupItem(props, VChipGroupSymbol, false);
    const link = useLink(props, attrs);

    function onCloseClick(e) {
      isActive.value = false;
      emit('click:close', e);
    }

    return () => {
      var _slots$default, _slots$default2;

      const Tag = link.isLink.value ? 'a' : props.tag;
      const hasAppend = !!(slots.append || props.appendIcon || props.appendAvatar);
      const hasClose = !!(slots.close || props.closable);
      const hasFilter = !!(slots.filter || props.filter) && group;
      const hasPrepend = !!(slots.prepend || props.prependIcon || props.prependAvatar);
      const hasColor = !group || group.isSelected.value;
      const isClickable = !props.disabled && (!!group || link.isClickable.value || props.link);
      const onClickFunc = props.link ? props.link : group == null ? void 0 : group.toggle;
      return isActive.value && _withDirectives(_createVNode(Tag, {
        "class": ['v-chip', {
          'v-chip--disabled': props.disabled,
          'v-chip--label': props.label,
          'v-chip--link': isClickable,
          'v-chip--filter': hasFilter,
          'v-chip--pill': props.pill
        }, themeClasses.value, borderClasses.value, hasColor ? colorClasses.value : undefined, densityClasses.value, elevationClasses.value, roundedClasses.value, sizeClasses.value, variantClasses.value, group == null ? void 0 : group.selectedClass.value],
        "style": [hasColor ? colorStyles.value : undefined],
        "disabled": props.disabled || undefined,
        "draggable": props.draggable,
        "href": link.href.value,
        "onClick": isClickable && onClickFunc
      }, {
        default: () => [genOverlays(isClickable, 'v-chip'), hasFilter && _createVNode(VDefaultsProvider, {
          "key": "filter",
          "defaults": {
            VIcon: {
              icon: props.filterIcon
            }
          }
        }, {
          default: () => [_createVNode(VExpandXTransition, null, {
            default: () => [_withDirectives(_createVNode("div", {
              "class": "v-chip__filter"
            }, [slots.filter ? slots.filter() : _createVNode(VIcon, null, null)]), [[_vShow, group.isSelected.value]])]
          })]
        }), hasPrepend && _createVNode(VDefaultsProvider, {
          "key": "prepend",
          "defaults": {
            VAvatar: {
              image: props.prependAvatar
            },
            VIcon: {
              icon: props.prependIcon
            }
          }
        }, {
          default: () => [slots.prepend ? _createVNode("div", {
            "class": "v-chip__prepend"
          }, [slots.prepend()]) : props.prependAvatar ? _createVNode(VAvatar, {
            "start": true
          }, null) : props.prependIcon ? _createVNode(VIcon, {
            "start": true
          }, null) : undefined]
        }), (_slots$default = (_slots$default2 = slots.default) == null ? void 0 : _slots$default2.call(slots, {
          isSelected: group == null ? void 0 : group.isSelected.value,
          selectedClass: group == null ? void 0 : group.selectedClass.value,
          select: group == null ? void 0 : group.select,
          toggle: group == null ? void 0 : group.toggle,
          value: group == null ? void 0 : group.value.value,
          disabled: props.disabled
        })) != null ? _slots$default : props.text, hasAppend && _createVNode(VDefaultsProvider, {
          "key": "append",
          "defaults": {
            VAvatar: {
              image: props.appendAvatar
            },
            VIcon: {
              icon: props.appendIcon
            }
          }
        }, {
          default: () => [slots.append ? _createVNode("div", {
            "class": "v-chip__append"
          }, [slots.append()]) : props.appendAvatar ? _createVNode(VAvatar, {
            "end": true
          }, null) : props.appendIcon ? _createVNode(VIcon, {
            "end": true
          }, null) : undefined]
        }), hasClose && _createVNode(VDefaultsProvider, {
          "key": "close",
          "defaults": {
            VIcon: {
              icon: props.closeIcon,
              size: 'x-small'
            }
          }
        }, {
          default: () => [_createVNode("div", {
            "class": "v-chip__close",
            "onClick": onCloseClick
          }, [slots.close ? slots.close() : _createVNode(VIcon, null, null)])]
        })]
      }), [[_resolveDirective("ripple"), isClickable && props.ripple, null]]);
    };
  }

});
//# sourceMappingURL=VChip.mjs.map