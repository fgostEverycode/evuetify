import { mergeProps as _mergeProps, resolveDirective as _resolveDirective, Fragment as _Fragment, createVNode as _createVNode } from "vue";
// Styles
import "./VBreadcrumbs.css"; // Components

import { VBreadcrumbsDivider } from "./VBreadcrumbsDivider.mjs";
import { VBreadcrumbsItem } from "./VBreadcrumbsItem.mjs";
import { VDefaultsProvider } from "../VDefaultsProvider/index.mjs";
import { VIcon } from "../VIcon/index.mjs"; // Composables

import { IconValue } from "../../composables/icons.mjs";
import { makeDensityProps, useDensity } from "../../composables/density.mjs";
import { makeRoundedProps, useRounded } from "../../composables/rounded.mjs";
import { makeTagProps } from "../../composables/tag.mjs";
import { provideDefaults } from "../../composables/defaults.mjs";
import { useBackgroundColor } from "../../composables/color.mjs"; // Utilities

import { genericComponent, useRender } from "../../util/index.mjs";
import { toRef } from 'vue'; // Types

export const VBreadcrumbs = genericComponent()({
  name: 'VBreadcrumbs',
  props: {
    activeClass: String,
    activeColor: String,
    bgColor: String,
    color: String,
    disabled: Boolean,
    divider: {
      type: String,
      default: '/'
    },
    icon: IconValue,
    items: {
      type: Array,
      default: () => []
    },
    ...makeDensityProps(),
    ...makeRoundedProps(),
    ...makeTagProps({
      tag: 'ul'
    })
  },

  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, 'bgColor'));
    const {
      densityClasses
    } = useDensity(props);
    const {
      roundedClasses
    } = useRounded(props);
    provideDefaults({
      VBreadcrumbsItem: {
        activeClass: toRef(props, 'activeClass'),
        activeColor: toRef(props, 'activeColor'),
        color: toRef(props, 'color'),
        disabled: toRef(props, 'disabled')
      }
    });
    useRender(() => {
      var _slots$default;

      const hasPrepend = !!(slots.prepend || props.icon);
      return _createVNode(props.tag, {
        "class": ['v-breadcrumbs', backgroundColorClasses.value, densityClasses.value, roundedClasses.value],
        "style": backgroundColorStyles.value
      }, {
        default: () => [props.icon && _createVNode(VIcon, {
          "key": "icon",
          "icon": props.icon,
          "left": true
        }, null), hasPrepend && _createVNode(VDefaultsProvider, {
          "key": "prepend",
          "defaults": {
            VIcon: {
              icon: props.icon,
              start: true
            }
          }
        }, {
          default: () => [_createVNode("div", {
            "class": "v-breadcrumbs__prepend"
          }, [slots.prepend ? slots.prepend() : props.icon && _createVNode(VIcon, null, null)])]
        }), props.items.map((item, index, array) => {
          var _slots$divider, _slots$divider2;

          return _createVNode(_Fragment, null, [_createVNode(VBreadcrumbsItem, _mergeProps({
            "key": index,
            "disabled": index >= array.length - 1
          }, typeof item === 'string' ? {
            title: item
          } : item), {
            default: slots.title ? () => {
              var _slots$title;

              return (_slots$title = slots.title) == null ? void 0 : _slots$title.call(slots, {
                item,
                index
              });
            } : undefined
          }), index < array.length - 1 && _createVNode(VBreadcrumbsDivider, null, {
            default: () => [(_slots$divider = (_slots$divider2 = slots.divider) == null ? void 0 : _slots$divider2.call(slots, {
              item,
              index
            })) != null ? _slots$divider : props.divider]
          })]);
        }), (_slots$default = slots.default) == null ? void 0 : _slots$default.call(slots)]
      });
    });
    return {};
  }

});
//# sourceMappingURL=VBreadcrumbs.mjs.map