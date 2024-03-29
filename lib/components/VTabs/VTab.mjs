import { mergeProps as _mergeProps, createVNode as _createVNode } from "vue";
// Styles
import "./VTab.css"; // Components

import { VBtn } from "../VBtn/index.mjs"; // Composables

import { IconValue } from "../../composables/icons.mjs";
import { makeGroupItemProps } from "../../composables/group.mjs";
import { makeRouterProps } from "../../composables/router.mjs";
import { makeTagProps } from "../../composables/tag.mjs";
import { makeThemeProps } from "../../composables/theme.mjs";
import { useTextColor } from "../../composables/color.mjs"; // Utilities

import { computed, ref } from 'vue';
import { defineComponent, pick, standardEasing, useRender } from "../../util/index.mjs"; // Types

import { VTabsSymbol } from "./shared.mjs";
export const VTab = defineComponent({
  name: 'VTab',
  props: {
    fixed: Boolean,
    icon: [Boolean, String, Function, Object],
    prependIcon: IconValue,
    appendIcon: IconValue,
    stacked: Boolean,
    title: String,
    ripple: {
      type: Boolean,
      default: true
    },
    color: String,
    sliderColor: String,
    hideSlider: Boolean,
    direction: {
      type: String,
      default: 'horizontal'
    },
    ...makeTagProps(),
    ...makeRouterProps(),
    ...makeGroupItemProps({
      selectedClass: 'v-tab--selected'
    }),
    ...makeThemeProps()
  },

  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      textColorClasses: sliderColorClasses,
      textColorStyles: sliderColorStyles
    } = useTextColor(props, 'sliderColor');
    const isHorizontal = computed(() => props.direction === 'horizontal');
    const isSelected = ref(false);
    const rootEl = ref();
    const sliderEl = ref();

    function updateSlider(_ref2) {
      let {
        value
      } = _ref2;
      isSelected.value = value;

      if (value) {
        var _rootEl$value, _rootEl$value$$el$par;

        const prevEl = (_rootEl$value = rootEl.value) == null ? void 0 : (_rootEl$value$$el$par = _rootEl$value.$el.parentElement) == null ? void 0 : _rootEl$value$$el$par.querySelector('.v-tab--selected .v-tab__slider');
        const nextEl = sliderEl.value;
        if (!prevEl || !nextEl) return;
        const color = getComputedStyle(prevEl).color;
        const prevBox = prevEl.getBoundingClientRect();
        const nextBox = nextEl.getBoundingClientRect();
        const xy = isHorizontal.value ? 'x' : 'y';
        const XY = isHorizontal.value ? 'X' : 'Y';
        const rightBottom = isHorizontal.value ? 'right' : 'bottom';
        const widthHeight = isHorizontal.value ? 'width' : 'height';
        const prevPos = prevBox[xy];
        const nextPos = nextBox[xy];
        const delta = prevPos > nextPos ? prevBox[rightBottom] - nextBox[rightBottom] : prevBox[xy] - nextBox[xy];
        const origin = Math.sign(delta) > 0 ? isHorizontal.value ? 'right' : 'bottom' : Math.sign(delta) < 0 ? isHorizontal.value ? 'left' : 'top' : 'center';
        const size = Math.abs(delta) + (Math.sign(delta) < 0 ? prevBox[widthHeight] : nextBox[widthHeight]);
        const scale = size / Math.max(prevBox[widthHeight], nextBox[widthHeight]);
        const initialScale = prevBox[widthHeight] / nextBox[widthHeight];
        const sigma = 1.5;
        nextEl.animate({
          backgroundColor: [color, ''],
          transform: [`translate${XY}(${delta}px) scale${XY}(${initialScale})`, `translate${XY}(${delta / sigma}px) scale${XY}(${(scale - 1) / sigma + 1})`, ''],
          transformOrigin: Array(3).fill(origin)
        }, {
          duration: 225,
          easing: standardEasing
        });
      }
    }

    useRender(() => {
      const [btnProps] = pick(props, ['href', 'to', 'replace', 'icon', 'stacked', 'prependIcon', 'appendIcon', 'ripple', 'theme', 'disabled', 'selectedClass', 'value', 'color']);
      return _createVNode(VBtn, _mergeProps({
        "_as": "VTab",
        "symbol": VTabsSymbol,
        "ref": rootEl,
        "class": ['v-tab'],
        "tabindex": isSelected.value ? 0 : -1,
        "role": "tab",
        "aria-selected": String(isSelected.value),
        "block": props.fixed,
        "maxWidth": props.fixed ? 300 : undefined,
        "variant": "text",
        "rounded": 0
      }, btnProps, attrs, {
        "onGroup:selected": updateSlider
      }), {
        default: () => [slots.default ? slots.default() : props.title, !props.hideSlider && _createVNode("div", {
          "ref": sliderEl,
          "class": ['v-tab__slider', sliderColorClasses.value],
          "style": sliderColorStyles.value
        }, null)]
      });
    });
    return {};
  }

});
//# sourceMappingURL=VTab.mjs.map