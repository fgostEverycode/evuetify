import { createVNode as _createVNode } from "vue";
// Styles
import "./VBottomNavigation.css"; // Composables

import { makeBorderProps, useBorder } from "../../composables/border.mjs";
import { makeDensityProps, useDensity } from "../../composables/density.mjs";
import { makeElevationProps, useElevation } from "../../composables/elevation.mjs";
import { makeGroupProps, useGroup } from "../../composables/group.mjs";
import { makeLayoutItemProps, useLayoutItem } from "../../composables/layout.mjs";
import { makeRoundedProps, useRounded } from "../../composables/rounded.mjs";
import { makeTagProps } from "../../composables/tag.mjs";
import { makeThemeProps, useTheme } from "../../composables/theme.mjs";
import { provideDefaults } from "../../composables/defaults.mjs";
import { useBackgroundColor } from "../../composables/color.mjs";
import { useProxiedModel } from "../../composables/proxiedModel.mjs"; // Utilities

import { computed, toRef } from 'vue';
import { convertToUnit, defineComponent, useRender } from "../../util/index.mjs"; // Types

import { VBtnToggleSymbol } from "../VBtnToggle/VBtnToggle.mjs";
export const VBottomNavigation = defineComponent({
  name: 'VBottomNavigation',
  props: {
    bgColor: String,
    color: String,
    grow: Boolean,
    mode: {
      type: String,
      validator: v => !v || ['horizontal', 'shift'].includes(v)
    },
    height: {
      type: [Number, String],
      default: 56
    },
    ...makeBorderProps(),
    ...makeDensityProps(),
    ...makeElevationProps(),
    ...makeRoundedProps(),
    ...makeLayoutItemProps({
      name: 'bottom-navigation'
    }),
    ...makeTagProps({
      tag: 'header'
    }),
    ...makeGroupProps({
      modelValue: true,
      selectedClass: 'v-btn--selected'
    }),
    ...makeThemeProps()
  },
  emits: {
    'update:modelValue': value => true
  },

  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      themeClasses
    } = useTheme();
    const {
      borderClasses
    } = useBorder(props);
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, 'bgColor'));
    const {
      densityClasses
    } = useDensity(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(props);
    const height = computed(() => Number(props.height) - (props.density === 'comfortable' ? 8 : 0) - (props.density === 'compact' ? 16 : 0));
    const isActive = useProxiedModel(props, 'modelValue', props.modelValue);
    const {
      layoutItemStyles
    } = useLayoutItem({
      id: props.name,
      order: computed(() => parseInt(props.order, 10)),
      position: computed(() => 'bottom'),
      layoutSize: computed(() => isActive.value ? height.value : 0),
      elementSize: height,
      active: isActive,
      absolute: toRef(props, 'absolute')
    });
    useGroup(props, VBtnToggleSymbol);
    provideDefaults({
      VBtn: {
        color: toRef(props, 'color'),
        density: toRef(props, 'density'),
        stacked: computed(() => props.mode !== 'horizontal'),
        variant: 'text'
      }
    }, {
      scoped: true
    });
    useRender(() => {
      return _createVNode(props.tag, {
        "class": ['v-bottom-navigation', {
          'v-bottom-navigation--active': isActive.value,
          'v-bottom-navigation--grow': props.grow,
          'v-bottom-navigation--shift': props.mode === 'shift'
        }, themeClasses.value, backgroundColorClasses.value, borderClasses.value, densityClasses.value, elevationClasses.value, roundedClasses.value],
        "style": [backgroundColorStyles.value, layoutItemStyles.value, {
          height: convertToUnit(height.value),
          transform: `translateY(${convertToUnit(!isActive.value ? 100 : 0, '%')})`
        }]
      }, {
        default: () => [slots.default && _createVNode("div", {
          "class": "v-bottom-navigation__content"
        }, [slots.default()])]
      });
    });
    return {};
  }

});
//# sourceMappingURL=VBottomNavigation.mjs.map