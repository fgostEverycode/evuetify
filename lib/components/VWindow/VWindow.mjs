import { withDirectives as _withDirectives, resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
// Styles
import "./VWindow.css"; // Components

import { VBtn } from "../VBtn/index.mjs"; // Directives

import { Touch } from "../../directives/touch/index.mjs"; // Composables

import { makeTagProps } from "../../composables/tag.mjs";
import { makeThemeProps, provideTheme } from "../../composables/theme.mjs";
import { useGroup } from "../../composables/group.mjs";
import { useLocale } from "../../composables/locale.mjs";
import { useRtl } from "../../composables/rtl.mjs"; // Utilities

import { computed, provide, ref, watch } from 'vue';
import { genericComponent, useRender } from "../../util/index.mjs"; // Types

export const VWindowSymbol = Symbol.for('vuetify:v-window');
export const VWindowGroupSymbol = Symbol.for('vuetify:v-window-group');
export const VWindow = genericComponent()({
  name: 'VWindow',
  directives: {
    Touch
  },
  props: {
    continuous: Boolean,
    nextIcon: {
      type: [Boolean, String, Function, Object],
      default: '$next'
    },
    prevIcon: {
      type: [Boolean, String, Function, Object],
      default: '$prev'
    },
    reverse: Boolean,
    showArrows: {
      type: [Boolean, String],
      validator: v => typeof v === 'boolean' || v === 'hover'
    },
    touch: {
      type: [Object, Boolean],
      default: undefined
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    modelValue: null,
    disabled: Boolean,
    selectedClass: {
      type: String,
      default: 'v-window-item--active'
    },
    // TODO: mandatory should probably not be exposed but do this for now
    mandatory: {
      default: 'force'
    },
    ...makeTagProps(),
    ...makeThemeProps()
  },
  emits: {
    'update:modelValue': v => true
  },

  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      isRtl
    } = useRtl();
    const {
      t
    } = useLocale();
    const group = useGroup(props, VWindowGroupSymbol);
    const rootRef = ref();
    const isRtlReverse = computed(() => isRtl.value ? !props.reverse : props.reverse);
    const isReversed = ref(false);
    const transition = computed(() => {
      const axis = props.direction === 'vertical' ? 'y' : 'x';
      const reverse = isRtlReverse.value ? !isReversed.value : isReversed.value;
      const direction = reverse ? '-reverse' : '';
      return `v-window-${axis}${direction}-transition`;
    });
    const transitionCount = ref(0);
    const transitionHeight = ref(undefined);
    const activeIndex = computed(() => {
      return group.items.value.findIndex(item => group.selected.value.includes(item.id));
    });
    watch(activeIndex, (newVal, oldVal) => {
      const itemsLength = group.items.value.length;
      const lastIndex = itemsLength - 1;

      if (itemsLength <= 2) {
        isReversed.value = newVal < oldVal;
      } else if (newVal === lastIndex && oldVal === 0) {
        isReversed.value = true;
      } else if (newVal === 0 && oldVal === lastIndex) {
        isReversed.value = false;
      } else {
        isReversed.value = newVal < oldVal;
      }
    });
    provide(VWindowSymbol, {
      transition,
      isReversed,
      transitionCount,
      transitionHeight,
      rootRef
    });
    const canMoveBack = computed(() => props.continuous || activeIndex.value !== 0);
    const canMoveForward = computed(() => props.continuous || activeIndex.value !== group.items.value.length - 1);

    function prev() {
      canMoveBack.value && group.prev();
    }

    function next() {
      canMoveForward.value && group.next();
    }

    const arrows = computed(() => {
      const arrows = [];
      const prevProps = {
        icon: isRtl.value ? props.nextIcon : props.prevIcon,
        class: `v-window__${isRtlReverse.value ? 'right' : 'left'}`,
        onClick: group.prev,
        ariaLabel: t('$vuetify.carousel.prev')
      };
      arrows.push(canMoveBack.value ? slots.prev ? slots.prev({
        props: prevProps
      }) : _createVNode(VBtn, prevProps, null) : _createVNode("div", null, null));
      const nextProps = {
        icon: isRtl.value ? props.prevIcon : props.nextIcon,
        class: `v-window__${isRtlReverse.value ? 'left' : 'right'}`,
        onClick: group.next,
        ariaLabel: t('$vuetify.carousel.next')
      };
      arrows.push(canMoveForward.value ? slots.next ? slots.next({
        props: nextProps
      }) : _createVNode(VBtn, nextProps, null) : _createVNode("div", null, null));
      return arrows;
    });
    const touchOptions = computed(() => {
      if (props.touch === false) return props.touch;
      const options = {
        left: () => {
          isRtlReverse.value ? prev() : next();
        },
        right: () => {
          isRtlReverse.value ? next() : prev();
        },
        end: _ref2 => {
          let {
            originalEvent
          } = _ref2;
          originalEvent.stopPropagation();
        },
        start: _ref3 => {
          let {
            originalEvent
          } = _ref3;
          originalEvent.stopPropagation();
        }
      };
      return { ...options,
        ...(props.touch === true ? {} : props.touch)
      };
    });
    useRender(() => {
      var _slots$default, _slots$additional;

      return _withDirectives(_createVNode(props.tag, {
        "ref": rootRef,
        "class": ['v-window', {
          'v-window--show-arrows-on-hover': props.showArrows === 'hover'
        }, themeClasses.value]
      }, {
        default: () => [_createVNode("div", {
          "class": "v-window__container",
          "style": {
            height: transitionHeight.value
          }
        }, [(_slots$default = slots.default) == null ? void 0 : _slots$default.call(slots, {
          group
        }), props.showArrows !== false && _createVNode("div", {
          "class": "v-window__controls"
        }, [arrows.value])]), (_slots$additional = slots.additional) == null ? void 0 : _slots$additional.call(slots, {
          group
        })]
      }), [[_resolveDirective("touch"), touchOptions.value]]);
    });
    return {
      group
    };
  }

});
//# sourceMappingURL=VWindow.mjs.map