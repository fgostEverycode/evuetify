import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
// Styles
import "./VFooter.css"; // Composables

import { makeBorderProps, useBorder } from "../../composables/border.mjs";
import { makeElevationProps, useElevation } from "../../composables/elevation.mjs";
import { makeLayoutItemProps, useLayoutItem } from "../../composables/layout.mjs";
import { makeRoundedProps, useRounded } from "../../composables/rounded.mjs";
import { makeTagProps } from "../../composables/tag.mjs";
import { makeThemeProps, provideTheme } from "../../composables/theme.mjs";
import { useBackgroundColor } from "../../composables/color.mjs";
import { useResizeObserver } from "../../composables/resizeObserver.mjs"; // Utilities

import { computed, ref, toRef } from 'vue';
import { defineComponent, useRender } from "../../util/index.mjs";
export const VFooter = defineComponent({
  name: 'VFooter',
  props: {
    app: Boolean,
    color: String,
    height: {
      type: [Number, String],
      default: 'auto'
    },
    ...makeBorderProps(),
    ...makeElevationProps(),
    ...makeLayoutItemProps(),
    ...makeRoundedProps(),
    ...makeTagProps({
      tag: 'footer'
    }),
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
      borderClasses
    } = useBorder(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(props);
    const autoHeight = ref(32);
    const {
      resizeRef
    } = useResizeObserver(entries => {
      if (!entries.length) return;
      autoHeight.value = entries[0].target.clientHeight;
    });
    const height = computed(() => props.height === 'auto' ? autoHeight.value : parseInt(props.height, 10));
    const {
      layoutItemStyles
    } = useLayoutItem({
      id: props.name,
      order: computed(() => parseInt(props.order, 10)),
      position: computed(() => 'bottom'),
      layoutSize: height,
      elementSize: computed(() => props.height === 'auto' ? undefined : height.value),
      active: computed(() => props.app),
      absolute: toRef(props, 'absolute')
    });
    useRender(() => _createVNode(props.tag, {
      "ref": resizeRef,
      "class": ['v-footer', themeClasses.value, backgroundColorClasses.value, borderClasses.value, elevationClasses.value, roundedClasses.value],
      "style": [backgroundColorStyles, props.app ? layoutItemStyles.value : undefined]
    }, slots));
    return {};
  }

});
//# sourceMappingURL=VFooter.mjs.map