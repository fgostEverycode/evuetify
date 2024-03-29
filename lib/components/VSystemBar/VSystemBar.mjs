import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
// Styles
import "./VSystemBar.css"; // Composables

import { makeElevationProps, useElevation } from "../../composables/elevation.mjs";
import { makeLayoutItemProps, useLayoutItem } from "../../composables/layout.mjs";
import { makeRoundedProps, useRounded } from "../../composables/rounded.mjs";
import { makeTagProps } from "../../composables/tag.mjs";
import { makeThemeProps, provideTheme } from "../../composables/theme.mjs";
import { useBackgroundColor } from "../../composables/color.mjs"; // Utilities

import { computed, ref, toRef } from 'vue';
import { defineComponent, useRender } from "../../util/index.mjs";
export const VSystemBar = defineComponent({
  name: 'VSystemBar',
  props: {
    color: String,
    height: [Number, String],
    window: Boolean,
    ...makeElevationProps(),
    ...makeLayoutItemProps(),
    ...makeRoundedProps(),
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
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, 'color'));
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(props);
    const height = computed(() => {
      var _props$height;

      return ((_props$height = props.height) != null ? _props$height : props.window) ? 32 : 24;
    });
    const {
      layoutItemStyles
    } = useLayoutItem({
      id: props.name,
      order: computed(() => parseInt(props.order, 10)),
      position: ref('top'),
      layoutSize: height,
      elementSize: height,
      active: computed(() => true),
      absolute: toRef(props, 'absolute')
    });
    useRender(() => _createVNode(props.tag, {
      "class": ['v-system-bar', {
        'v-system-bar--window': props.window
      }, themeClasses.value, backgroundColorClasses.value, elevationClasses.value, roundedClasses.value],
      "style": [backgroundColorStyles.value, layoutItemStyles.value]
    }, slots));
    return {};
  }

});
//# sourceMappingURL=VSystemBar.mjs.map