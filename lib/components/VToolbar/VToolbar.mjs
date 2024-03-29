import { createVNode as _createVNode } from "vue";
// Styles
import "./VToolbar.css"; // Components

import { VDefaultsProvider } from "../VDefaultsProvider/index.mjs";
import { VExpandTransition } from "../transitions/index.mjs";
import { VImg } from "../VImg/index.mjs";
import { VToolbarTitle } from "./VToolbarTitle.mjs"; // Composables

import { makeBorderProps, useBorder } from "../../composables/border.mjs";
import { makeElevationProps, useElevation } from "../../composables/elevation.mjs";
import { makeRoundedProps, useRounded } from "../../composables/rounded.mjs";
import { makeTagProps } from "../../composables/tag.mjs";
import { makeThemeProps, provideTheme } from "../../composables/theme.mjs";
import { provideDefaults } from "../../composables/defaults.mjs";
import { useBackgroundColor } from "../../composables/color.mjs";
import { useForwardRef } from "../../composables/forwardRef.mjs"; // Utilities

import { computed, ref, toRef } from 'vue';
import { convertToUnit, genericComponent, pick, propsFactory, useRender } from "../../util/index.mjs"; // Types

const allowedDensities = [null, 'prominent', 'default', 'comfortable', 'compact'];
export const makeVToolbarProps = propsFactory({
  absolute: Boolean,
  collapse: Boolean,
  color: String,
  density: {
    type: String,
    default: 'default',
    validator: v => allowedDensities.includes(v)
  },
  extended: Boolean,
  extensionHeight: {
    type: [Number, String],
    default: 48
  },
  flat: Boolean,
  floating: Boolean,
  height: {
    type: [Number, String],
    default: 64
  },
  image: String,
  title: String,
  ...makeBorderProps(),
  ...makeElevationProps(),
  ...makeRoundedProps(),
  ...makeTagProps({
    tag: 'header'
  }),
  ...makeThemeProps()
}, 'v-toolbar');
export const VToolbar = genericComponent()({
  name: 'VToolbar',
  props: makeVToolbarProps(),

  setup(props, _ref) {
    var _slots$extension;

    let {
      slots
    } = _ref;
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
    const {
      themeClasses
    } = provideTheme(props);
    const isExtended = ref(!!(props.extended || (_slots$extension = slots.extension) != null && _slots$extension.call(slots)));
    const contentHeight = computed(() => parseInt(Number(props.height) + (props.density === 'prominent' ? Number(props.height) : 0) - (props.density === 'comfortable' ? 8 : 0) - (props.density === 'compact' ? 16 : 0), 10));
    const extensionHeight = computed(() => isExtended.value ? parseInt(Number(props.extensionHeight) + (props.density === 'prominent' ? Number(props.extensionHeight) : 0) - (props.density === 'comfortable' ? 4 : 0) - (props.density === 'compact' ? 8 : 0), 10) : 0);
    provideDefaults({
      VBtn: {
        variant: 'text'
      }
    });
    useRender(() => {
      var _slots$extension2, _slots$image, _slots$prepend, _slots$default, _slots$append;

      const hasTitle = !!(props.title || slots.title);
      const hasImage = !!(slots.image || props.image);
      const extension = (_slots$extension2 = slots.extension) == null ? void 0 : _slots$extension2.call(slots);
      isExtended.value = !!(props.extended || extension);
      return _createVNode(props.tag, {
        "class": ['v-toolbar', {
          'v-toolbar--absolute': props.absolute,
          'v-toolbar--collapse': props.collapse,
          'v-toolbar--flat': props.flat,
          'v-toolbar--floating': props.floating,
          [`v-toolbar--density-${props.density}`]: true
        }, backgroundColorClasses.value, borderClasses.value, elevationClasses.value, roundedClasses.value, themeClasses.value],
        "style": [backgroundColorStyles.value]
      }, {
        default: () => [hasImage && _createVNode("div", {
          "key": "image",
          "class": "v-toolbar__image"
        }, [_createVNode(VDefaultsProvider, {
          "defaults": {
            VImg: {
              cover: true,
              src: props.image
            }
          }
        }, {
          default: () => [slots.image ? (_slots$image = slots.image) == null ? void 0 : _slots$image.call(slots) : _createVNode(VImg, null, null)]
        })]), _createVNode("div", {
          "class": "v-toolbar__content",
          "style": {
            height: convertToUnit(contentHeight.value)
          }
        }, [slots.prepend && _createVNode("div", {
          "class": "v-toolbar__prepend"
        }, [(_slots$prepend = slots.prepend) == null ? void 0 : _slots$prepend.call(slots)]), hasTitle && _createVNode(VToolbarTitle, {
          "key": "title",
          "text": props.title
        }, {
          text: slots.title
        }), (_slots$default = slots.default) == null ? void 0 : _slots$default.call(slots), slots.append && _createVNode("div", {
          "class": "v-toolbar__append"
        }, [(_slots$append = slots.append) == null ? void 0 : _slots$append.call(slots)])]), _createVNode(VExpandTransition, null, {
          default: () => [isExtended.value && _createVNode("div", {
            "class": "v-toolbar__extension",
            "style": {
              height: convertToUnit(extensionHeight.value)
            }
          }, [extension])]
        })]
      });
    });
    return useForwardRef({
      contentHeight,
      extensionHeight
    });
  }

});
export function filterToolbarProps(props) {
  var _VToolbar$props;

  return pick(props, Object.keys((_VToolbar$props = VToolbar == null ? void 0 : VToolbar.props) != null ? _VToolbar$props : {}));
}
//# sourceMappingURL=VToolbar.mjs.map