import { createVNode as _createVNode, mergeProps as _mergeProps } from "vue";
// Styles
import "./VTabs.css"; // Components

import { VSlideGroup } from "../VSlideGroup/index.mjs";
import { VTab } from "./VTab.mjs"; // Composables

import { makeDensityProps, useDensity } from "../../composables/density.mjs";
import { makeTagProps } from "../../composables/tag.mjs";
import { provideDefaults } from "../../composables/defaults.mjs";
import { useBackgroundColor } from "../../composables/color.mjs"; // Utilities

import { computed, toRef } from 'vue';
import { defineComponent, useRender } from "../../util/index.mjs"; // Types

import { VTabsSymbol } from "./shared.mjs";

function parseItems(items) {
  if (!items) return [];
  return items.map(item => {
    if (typeof item === 'string') return {
      title: item,
      value: item
    };
    return item;
  });
}

export const VTabs = defineComponent({
  name: 'VTabs',
  props: {
    alignWithTitle: Boolean,
    color: String,
    direction: {
      type: String,
      default: 'horizontal'
    },
    fixedTabs: Boolean,
    items: {
      type: Array,
      default: () => []
    },
    stacked: Boolean,
    backgroundColor: String,
    centered: Boolean,
    grow: Boolean,
    height: {
      type: [Number, String],
      default: undefined
    },
    hideSlider: Boolean,
    optional: Boolean,
    end: Boolean,
    sliderColor: String,
    modelValue: null,
    ...makeDensityProps(),
    ...makeTagProps()
  },
  emits: {
    'update:modelValue': v => true
  },

  setup(props, _ref) {
    let {
      slots,
      emit
    } = _ref;
    const parsedItems = computed(() => parseItems(props.items));
    const {
      densityClasses
    } = useDensity(props);
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, 'backgroundColor'));
    provideDefaults({
      VTab: {
        color: toRef(props, 'color'),
        direction: toRef(props, 'direction'),
        stacked: toRef(props, 'stacked'),
        fixed: toRef(props, 'fixedTabs'),
        sliderColor: toRef(props, 'sliderColor'),
        hideSlider: toRef(props, 'hideSlider')
      }
    });
    useRender(() => _createVNode(VSlideGroup, {
      "class": ['v-tabs', `v-tabs--${props.direction}`, {
        'v-tabs--align-with-title': props.alignWithTitle,
        'v-tabs--centered': props.centered,
        'v-tabs--fixed-tabs': props.fixedTabs,
        'v-tabs--grow': props.grow,
        'v-tabs--end': props.end,
        'v-tabs--stacked': props.stacked
      }, densityClasses.value, backgroundColorClasses.value],
      "style": backgroundColorStyles.value,
      "role": "tablist",
      "symbol": VTabsSymbol,
      "mandatory": "force",
      "direction": props.direction,
      "modelValue": props.modelValue,
      "onUpdate:modelValue": v => emit('update:modelValue', v)
    }, {
      default: () => [slots.default ? slots.default() : parsedItems.value.map(item => _createVNode(VTab, _mergeProps(item, {
        "key": item.title
      }), null))]
    }));
    return {};
  }

});
//# sourceMappingURL=VTabs.mjs.map