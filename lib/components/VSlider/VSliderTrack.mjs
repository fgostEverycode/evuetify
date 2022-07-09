import { createVNode as _createVNode } from "vue";
// Styles
import "./VSliderTrack.css"; // Components

import { VSliderSymbol } from "./slider.mjs"; // Composables

import { useBackgroundColor } from "../../composables/color.mjs";
import { useRounded } from "../../composables/rounded.mjs"; // Utilities

import { computed, inject } from 'vue';
import { convertToUnit, defineComponent, useRender } from "../../util/index.mjs";
export const VSliderTrack = defineComponent({
  name: 'VSliderTrack',
  props: {
    start: {
      type: Number,
      required: true
    },
    stop: {
      type: Number,
      required: true
    }
  },
  emits: {},

  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const slider = inject(VSliderSymbol);
    if (!slider) throw new Error('[Vuetify] v-slider-track must be inside v-slider or v-range-slider');
    const {
      color,
      horizontalDirection,
      parsedTicks,
      rounded,
      showTicks,
      tickSize,
      trackColor,
      trackFillColor,
      trackSize,
      vertical
    } = slider;
    const {
      roundedClasses
    } = useRounded(rounded);
    const {
      backgroundColorClasses: trackFillColorClasses,
      backgroundColorStyles: trackFillColorStyles
    } = useBackgroundColor(trackFillColor);
    const {
      backgroundColorClasses: trackColorClasses,
      backgroundColorStyles: trackColorStyles
    } = useBackgroundColor(trackColor);
    const startDir = computed(() => `inset-${vertical.value ? 'block-end' : 'inline-start'}`);
    const endDir = computed(() => vertical.value ? 'height' : 'width');
    const backgroundStyles = computed(() => {
      return {
        [startDir.value]: '0%',
        [endDir.value]: '100%'
      };
    });
    const trackFillWidth = computed(() => props.stop - props.start);
    const trackFillStyles = computed(() => {
      return {
        [startDir.value]: convertToUnit(props.start, '%'),
        [endDir.value]: convertToUnit(trackFillWidth.value, '%')
      };
    });
    const computedTicks = computed(() => {
      const ticks = vertical.value ? parsedTicks.value.slice().reverse() : parsedTicks.value;
      return ticks.map((tick, index) => {
        var _slots$tickLabel, _slots$tickLabel2;

        const directionProperty = vertical.value ? 'bottom' : 'margin-inline-start';
        const directionValue = tick.position > 0 && tick.position < 100 ? convertToUnit(tick.position, '%') : undefined;
        return _createVNode("div", {
          "key": tick.value,
          "class": ['v-slider-track__tick', {
            'v-slider-track__tick--filled': tick.position >= props.start && tick.position <= props.stop
          }],
          "style": {
            [directionProperty]: directionValue
          }
        }, [(tick.label || slots['tick-label']) && _createVNode("div", {
          "class": "v-slider-track__tick-label"
        }, [(_slots$tickLabel = (_slots$tickLabel2 = slots['tick-label']) == null ? void 0 : _slots$tickLabel2.call(slots, {
          tick,
          index
        })) != null ? _slots$tickLabel : tick.label])]);
      });
    });
    useRender(() => {
      return _createVNode("div", {
        "class": ['v-slider-track', roundedClasses.value],
        "style": {
          '--v-slider-track-size': convertToUnit(trackSize.value),
          '--v-slider-tick-size': convertToUnit(tickSize.value),
          direction: !vertical.value ? horizontalDirection.value : undefined
        }
      }, [_createVNode("div", {
        "class": ['v-slider-track__background', trackColorClasses.value, {
          'v-slider-track__background--opacity': !!color.value || !trackFillColor.value
        }],
        "style": { ...backgroundStyles.value,
          ...trackColorStyles.value
        }
      }, null), _createVNode("div", {
        "class": ['v-slider-track__fill', trackFillColorClasses.value],
        "style": { ...trackFillStyles.value,
          ...trackFillColorStyles.value
        }
      }, null), showTicks.value && _createVNode("div", {
        "class": ['v-slider-track__ticks', {
          'v-slider-track__ticks--always-show': showTicks.value === 'always'
        }]
      }, [computedTicks.value])]);
    });
    return {};
  }

});
//# sourceMappingURL=VSliderTrack.mjs.map