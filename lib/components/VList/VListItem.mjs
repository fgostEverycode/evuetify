import { withDirectives as _withDirectives, resolveDirective as _resolveDirective, createVNode as _createVNode, Fragment as _Fragment } from "vue";
// Styles
import "./VListItem.css"; // Components

import { VListItemAvatar } from "./VListItemAvatar.mjs";
import { VListItemHeader } from "./VListItemHeader.mjs";
import { VListItemIcon } from "./VListItemIcon.mjs";
import { VListItemSubtitle } from "./VListItemSubtitle.mjs";
import { VListItemTitle } from "./VListItemTitle.mjs"; // Directives

import { Ripple } from "../../directives/ripple/index.mjs"; // Composables

import { genOverlays, makeVariantProps, useVariant } from "../../composables/variant.mjs";
import { IconValue } from "../../composables/icons.mjs";
import { makeBorderProps, useBorder } from "../../composables/border.mjs";
import { makeDensityProps, useDensity } from "../../composables/density.mjs";
import { makeDimensionProps, useDimension } from "../../composables/dimensions.mjs";
import { makeElevationProps, useElevation } from "../../composables/elevation.mjs";
import { makeRoundedProps, useRounded } from "../../composables/rounded.mjs";
import { makeRouterProps, useLink } from "../../composables/router.mjs";
import { makeTagProps } from "../../composables/tag.mjs";
import { makeThemeProps, provideTheme } from "../../composables/theme.mjs";
import { useList } from "./list.mjs";
import { useNestedItem } from "../../composables/nested/nested.mjs"; // Utilities

import { computed, watch } from 'vue';
import { genericComponent, useRender } from "../../util/index.mjs"; // Types

export const VListItem = genericComponent()({
  name: 'VListItem',
  directives: {
    Ripple
  },
  props: {
    active: Boolean,
    activeColor: String,
    activeClass: String,
    appendAvatar: String,
    appendIcon: IconValue,
    disabled: Boolean,
    lines: String,
    nav: Boolean,
    prependAvatar: String,
    prependIcon: IconValue,
    subtitle: [String, Number, Boolean],
    title: [String, Number, Boolean],
    value: null,
    link: Boolean,
    ...makeBorderProps(),
    ...makeDensityProps(),
    ...makeDimensionProps(),
    ...makeElevationProps(),
    ...makeRoundedProps(),
    ...makeRouterProps(),
    ...makeTagProps(),
    ...makeThemeProps(),
    ...makeVariantProps({
      variant: 'text'
    })
  },

  setup(props, _ref) {
    var _link$isExactActive2;

    let {
      attrs,
      slots
    } = _ref;
    const link = useLink(props, attrs);
    const id = computed(() => {
      var _props$value;

      return (_props$value = props.value) != null ? _props$value : link.href.value;
    });
    const {
      select,
      isSelected,
      isIndeterminate,
      isGroupActivator,
      root,
      parent
    } = useNestedItem(id, false);
    const list = useList();
    const isActive = computed(() => {
      var _link$isExactActive;

      return props.active || ((_link$isExactActive = link.isExactActive) == null ? void 0 : _link$isExactActive.value) || isSelected.value;
    });
    const roundedProps = computed(() => props.rounded || props.nav);
    const variantProps = computed(() => {
      var _props$activeColor;

      return {
        color: isActive.value ? (_props$activeColor = props.activeColor) != null ? _props$activeColor : props.color : props.color,
        variant: props.variant
      };
    });

    if ((_link$isExactActive2 = link.isExactActive) != null && _link$isExactActive2.value && parent.value != null) {
      root.open(parent.value, true);
    }

    watch(() => {
      var _link$isExactActive3;

      return (_link$isExactActive3 = link.isExactActive) == null ? void 0 : _link$isExactActive3.value;
    }, val => {
      if (val && parent.value != null) {
        root.open(parent.value, true);
      }
    });
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
      roundedClasses
    } = useRounded(roundedProps);
    const lineClasses = computed(() => props.lines ? `v-list-item--${props.lines}-line` : undefined);
    const slotProps = computed(() => ({
      isActive: isActive.value,
      select,
      isSelected: isSelected.value,
      isIndeterminate: isIndeterminate.value
    }));
    useRender(() => {
      var _slots$prepend, _slots$default, _slots$append;

      const Tag = link.isLink.value ? 'a' : props.tag;
      const hasColor = !list || isSelected.value || isActive.value;
      const hasTitle = slots.title || props.title;
      const hasSubtitle = slots.subtitle || props.subtitle;
      const hasHeader = !!(hasTitle || hasSubtitle);
      const hasAppend = !!(slots.append || props.appendAvatar || props.appendIcon);
      const hasPrepend = !!(slots.prepend || props.prependAvatar || props.prependIcon);
      const isClickable = !props.disabled && (props.link || link.isClickable.value || props.value != null && !!list);
      list == null ? void 0 : list.updateHasPrepend(hasPrepend);
      return _withDirectives(_createVNode(Tag, {
        "class": ['v-list-item', {
          'v-list-item--active': isActive.value,
          'v-list-item--disabled': props.disabled,
          'v-list-item--link': isClickable,
          'v-list-item--nav': props.nav,
          'v-list-item--prepend': !hasPrepend && (list == null ? void 0 : list.hasPrepend.value),
          [`${props.activeClass}`]: isActive.value
        }, themeClasses.value, borderClasses.value, hasColor ? colorClasses.value : undefined, densityClasses.value, elevationClasses.value, lineClasses.value, roundedClasses.value, variantClasses.value],
        "style": [hasColor ? colorStyles.value : undefined, dimensionStyles.value],
        "href": link.href.value,
        "tabindex": isClickable ? 0 : undefined,
        "onClick": isClickable && (e => {
          var _link$navigate;

          if (isGroupActivator) return;
          (_link$navigate = link.navigate) == null ? void 0 : _link$navigate.call(link, e);
          props.value != null && select(!isSelected.value, e);
        })
      }, {
        default: () => [genOverlays(isClickable || isActive.value, 'v-list-item'), hasPrepend && _createVNode(_Fragment, null, [props.prependAvatar && _createVNode(VListItemAvatar, {
          "image": props.prependAvatar,
          "start": true
        }, null), props.prependIcon && _createVNode(VListItemIcon, {
          "icon": props.prependIcon,
          "start": true
        }, null), (_slots$prepend = slots.prepend) == null ? void 0 : _slots$prepend.call(slots, slotProps.value)]), hasHeader && _createVNode(VListItemHeader, {
          "key": "header"
        }, {
          default: () => [hasTitle && _createVNode(VListItemTitle, {
            "key": "title"
          }, {
            default: () => [slots.title ? slots.title({
              title: props.title
            }) : props.title]
          }), hasSubtitle && _createVNode(VListItemSubtitle, null, {
            default: () => [slots.subtitle ? slots.subtitle({
              subtitle: props.subtitle
            }) : props.subtitle]
          })]
        }), (_slots$default = slots.default) == null ? void 0 : _slots$default.call(slots, slotProps.value), hasAppend && _createVNode(_Fragment, null, [(_slots$append = slots.append) == null ? void 0 : _slots$append.call(slots, slotProps.value), props.appendAvatar && _createVNode(VListItemAvatar, {
          "image": props.appendAvatar,
          "end": true
        }, null), props.appendIcon && _createVNode(VListItemIcon, {
          "icon": props.appendIcon,
          "end": true
        }, null)])]
      }), [[_resolveDirective("ripple"), isClickable]]);
    });
    return {};
  }

});
//# sourceMappingURL=VListItem.mjs.map