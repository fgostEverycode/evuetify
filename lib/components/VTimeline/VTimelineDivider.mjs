import { createVNode as _createVNode } from "vue";
// Components
import { VIcon } from "../VIcon/index.mjs"; // Composables

import { IconValue } from "../../composables/icons.mjs";
import { makeElevationProps, useElevation } from "../../composables/elevation.mjs";
import { makeRoundedProps, useRounded } from "../../composables/rounded.mjs";
import { makeSizeProps, useSize } from "../../composables/size.mjs";
import { provideDefaults } from "../../composables/defaults.mjs";
import { useBackgroundColor } from "../../composables/color.mjs"; // Utilities

import { defineComponent, useRender } from "../../util/index.mjs";
import { toRef } from 'vue';
export const VTimelineDivider = defineComponent({
  name: 'VTimelineDivider',
  props: {
    dotColor: String,
    fillDot: Boolean,
    hideDot: Boolean,
    icon: IconValue,
    iconColor: String,
    lineColor: String,
    ...makeRoundedProps(),
    ...makeSizeProps(),
    ...makeElevationProps()
  },

  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      sizeClasses,
      sizeStyles
    } = useSize(props, 'v-timeline-divider__dot');
    const {
      backgroundColorStyles,
      backgroundColorClasses
    } = useBackgroundColor(toRef(props, 'dotColor'));
    const {
      roundedClasses
    } = useRounded(props, 'v-timeline-divider__dot');
    const {
      elevationClasses
    } = useElevation(props);
    const {
      backgroundColorClasses: lineColorClasses,
      backgroundColorStyles: lineColorStyles
    } = useBackgroundColor(toRef(props, 'lineColor'));
    provideDefaults({
      VIcon: {
        color: toRef(props, 'iconColor'),
        icon: toRef(props, 'icon'),
        size: toRef(props, 'size')
      }
    });
    useRender(() => {
      var _slots$default, _slots$default2;

      return _createVNode("div", {
        "class": ['v-timeline-divider', {
          'v-timeline-divider--fill-dot': props.fillDot
        }]
      }, [!props.hideDot && _createVNode("div", {
        "key": "dot",
        "class": ['v-timeline-divider__dot', elevationClasses.value, roundedClasses.value, sizeClasses.value],
        "style": sizeStyles.value
      }, [_createVNode("div", {
        "class": ['v-timeline-divider__inner-dot', backgroundColorClasses.value, roundedClasses.value],
        "style": backgroundColorStyles.value
      }, [((_slots$default = (_slots$default2 = slots.default) == null ? void 0 : _slots$default2.call(slots)) != null ? _slots$default : props.icon) ? _createVNode(VIcon, null, null) : undefined])]), _createVNode("div", {
        "class": ['v-timeline-divider__line', lineColorClasses.value],
        "style": lineColorStyles.value
      }, null)]);
    });
    return {};
  }

});
//# sourceMappingURL=VTimelineDivider.mjs.map