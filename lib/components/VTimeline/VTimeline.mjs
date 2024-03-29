import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
// Styles
import "./VTimeline.css"; // Composables

import { makeDensityProps, useDensity } from "../../composables/density.mjs";
import { makeTagProps } from "../../composables/tag.mjs";
import { makeThemeProps, provideTheme } from "../../composables/theme.mjs";
import { provideDefaults } from "../../composables/defaults.mjs"; // Utilities

import { computed, toRef } from 'vue';
import { convertToUnit, defineComponent, useRender } from "../../util/index.mjs"; // Types

export const VTimeline = defineComponent({
  name: 'VTimeline',
  props: {
    align: {
      type: String,
      default: 'center',
      validator: v => ['center', 'start'].includes(v)
    },
    direction: {
      type: String,
      default: 'vertical',
      validator: v => ['vertical', 'horizontal'].includes(v)
    },
    side: {
      type: String,
      validator: v => v == null || ['start', 'end'].includes(v)
    },
    lineInset: {
      type: [String, Number],
      default: 0
    },
    lineThickness: {
      type: [String, Number],
      default: 2
    },
    lineColor: String,
    truncateLine: {
      type: String,
      validator: v => ['start', 'end', 'both'].includes(v)
    },
    ...makeDensityProps(),
    ...makeTagProps(),
    ...makeThemeProps()
  },

  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      densityClasses
    } = useDensity(props);
    provideDefaults({
      VTimelineDivider: {
        lineColor: toRef(props, 'lineColor')
      },
      VTimelineItem: {
        density: toRef(props, 'density')
      }
    });
    const sideClasses = computed(() => {
      const side = props.side ? props.side : props.density !== 'default' ? 'end' : null;
      return side && `v-timeline--side-${side}`;
    });
    const truncateClasses = computed(() => {
      const classes = ['v-timeline--truncate-line-start', 'v-timeline--truncate-line-end'];

      switch (props.truncateLine) {
        case 'both':
          return classes;

        case 'start':
          return classes[0];

        case 'end':
          return classes[1];

        default:
          return null;
      }
    });
    useRender(() => _createVNode(props.tag, {
      "class": ['v-timeline', `v-timeline--${props.direction}`, `v-timeline--align-${props.align}`, !props.lineInset && truncateClasses.value, {
        'v-timeline--inset-line': !!props.lineInset
      }, themeClasses.value, densityClasses.value, sideClasses.value],
      "style": {
        '--v-timeline-line-thickness': convertToUnit(props.lineThickness),
        '--v-timeline-line-inset': convertToUnit(props.lineInset)
      }
    }, slots));
    return {};
  }

});
//# sourceMappingURL=VTimeline.mjs.map