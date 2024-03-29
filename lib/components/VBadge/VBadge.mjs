import { withDirectives as _withDirectives, mergeProps as _mergeProps, vShow as _vShow, createVNode as _createVNode } from "vue";
// Styles
import "./VBadge.css"; // Components

import { VIcon } from "../VIcon/index.mjs"; // Composables

import { IconValue } from "../../composables/icons.mjs";
import { makeLocationProps, useLocation } from "../../composables/location.mjs";
import { makeRoundedProps, useRounded } from "../../composables/rounded.mjs";
import { makeTagProps } from "../../composables/tag.mjs";
import { makeThemeProps, useTheme } from "../../composables/theme.mjs";
import { makeTransitionProps, MaybeTransition } from "../../composables/transition.mjs";
import { useBackgroundColor, useTextColor } from "../../composables/color.mjs";
import { useLocale } from "../../composables/locale.mjs"; // Utilities

import { defineComponent, pick, useRender } from "../../util/index.mjs";
import { toRef } from 'vue';
export const VBadge = defineComponent({
  name: 'VBadge',
  inheritAttrs: false,
  props: {
    bordered: Boolean,
    color: String,
    content: [Number, String],
    dot: Boolean,
    floating: Boolean,
    icon: IconValue,
    inline: Boolean,
    label: {
      type: String,
      default: '$vuetify.badge'
    },
    max: [Number, String],
    modelValue: {
      type: Boolean,
      default: true
    },
    offsetX: [Number, String],
    offsetY: [Number, String],
    textColor: String,
    ...makeLocationProps({
      location: 'top end'
    }),
    ...makeRoundedProps(),
    ...makeTagProps(),
    ...makeThemeProps(),
    ...makeTransitionProps({
      transition: 'scale-rotate-transition'
    })
  },

  setup(props, ctx) {
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, 'color'));
    const {
      roundedClasses
    } = useRounded(props);
    const {
      t
    } = useLocale();
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(toRef(props, 'textColor'));
    const {
      themeClasses
    } = useTheme();
    const {
      locationStyles
    } = useLocation(props, true, side => {
      var _props$offsetY, _props$offsetX;

      const base = props.floating ? props.dot ? 2 : 4 : props.dot ? 8 : 12;
      return base + (['top', 'bottom'].includes(side) ? +((_props$offsetY = props.offsetY) != null ? _props$offsetY : 0) : ['left', 'right'].includes(side) ? +((_props$offsetX = props.offsetX) != null ? _props$offsetX : 0) : 0);
    });
    useRender(() => {
      var _ctx$slots$default, _ctx$slots, _ctx$slots$badge, _ctx$slots2;

      const value = Number(props.content);
      const content = !props.max || isNaN(value) ? props.content : value <= props.max ? value : `${props.max}+`;
      const [badgeAttrs, attrs] = pick(ctx.attrs, ['aria-atomic', 'aria-label', 'aria-live', 'role', 'title']);
      return _createVNode(props.tag, _mergeProps({
        "class": ['v-badge', {
          'v-badge--bordered': props.bordered,
          'v-badge--dot': props.dot,
          'v-badge--floating': props.floating,
          'v-badge--inline': props.inline
        }]
      }, attrs), {
        default: () => [_createVNode("div", {
          "class": "v-badge__wrapper"
        }, [(_ctx$slots$default = (_ctx$slots = ctx.slots).default) == null ? void 0 : _ctx$slots$default.call(_ctx$slots), _createVNode(MaybeTransition, {
          "transition": props.transition
        }, {
          default: () => [_withDirectives(_createVNode("span", _mergeProps({
            "class": ['v-badge__badge', themeClasses.value, backgroundColorClasses.value, roundedClasses.value, textColorClasses.value],
            "style": [backgroundColorStyles.value, textColorStyles.value, props.inline ? {} : locationStyles.value],
            "aria-atomic": "true",
            "aria-label": t(props.label, value),
            "aria-live": "polite",
            "role": "status"
          }, badgeAttrs), [props.dot ? undefined : ctx.slots.badge ? (_ctx$slots$badge = (_ctx$slots2 = ctx.slots).badge) == null ? void 0 : _ctx$slots$badge.call(_ctx$slots2) : props.icon ? _createVNode(VIcon, {
            "icon": props.icon
          }, null) : content]), [[_vShow, props.modelValue]])]
        })])]
      });
    });
    return {};
  }

});
//# sourceMappingURL=VBadge.mjs.map