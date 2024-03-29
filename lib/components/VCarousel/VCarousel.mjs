import { createVNode as _createVNode, mergeProps as _mergeProps, Fragment as _Fragment } from "vue";
// Styles
import "./VCarousel.css"; // Components

import { VBtn } from "../VBtn/index.mjs";
import { VDefaultsProvider } from "../VDefaultsProvider/index.mjs";
import { VProgressLinear } from "../VProgressLinear/index.mjs";
import { VWindow } from "../VWindow/index.mjs"; // Composables

import { IconValue } from "../../composables/icons.mjs";
import { useLocale } from "../../composables/locale.mjs";
import { useProxiedModel } from "../../composables/proxiedModel.mjs"; // Utilities

import { convertToUnit, defineComponent, useRender } from "../../util/index.mjs";
import { onMounted, ref, watch } from 'vue'; // Types

export const VCarousel = defineComponent({
  name: 'VCarousel',
  props: {
    color: String,
    cycle: Boolean,
    delimiterIcon: {
      type: IconValue,
      default: '$delimiter'
    },
    height: {
      type: [Number, String],
      default: 500
    },
    hideDelimiters: Boolean,
    hideDelimiterBackground: Boolean,
    interval: {
      type: [Number, String],
      default: 6000,
      validator: value => value > 0
    },
    modelValue: null,
    progress: [Boolean, String],
    showArrows: {
      type: [Boolean, String],
      default: true,
      validator: v => typeof v === 'boolean' || v === 'hover'
    },
    verticalDelimiters: [Boolean, String]
  },
  emits: {
    'update:modelValue': val => true
  },

  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const model = useProxiedModel(props, 'modelValue');
    const {
      t
    } = useLocale();
    const windowRef = ref();
    let slideTimeout = -1;
    watch(model, restartTimeout);
    watch(() => props.interval, restartTimeout);
    watch(() => props.cycle, val => {
      if (val) restartTimeout();else window.clearTimeout(slideTimeout);
    });
    onMounted(startTimeout);

    function startTimeout() {
      if (!props.cycle || !windowRef.value) return;
      slideTimeout = window.setTimeout(windowRef.value.group.next, +props.interval > 0 ? +props.interval : 6000);
    }

    function restartTimeout() {
      window.clearTimeout(slideTimeout);
      window.requestAnimationFrame(startTimeout);
    }

    useRender(() => _createVNode(VWindow, {
      "ref": windowRef,
      "modelValue": model.value,
      "onUpdate:modelValue": $event => model.value = $event,
      "class": ['v-carousel', {
        'v-carousel--hide-delimiter-background': props.hideDelimiterBackground,
        'v-carousel--vertical-delimiters': props.verticalDelimiters
      }],
      "style": {
        height: convertToUnit(props.height)
      },
      "continuous": true,
      "mandatory": "force",
      "showArrows": props.showArrows
    }, {
      default: slots.default,
      additional: _ref2 => {
        let {
          group
        } = _ref2;
        return _createVNode(_Fragment, null, [!props.hideDelimiters && _createVNode("div", {
          "class": "v-carousel__controls",
          "style": {
            left: props.verticalDelimiters === 'left' && props.verticalDelimiters ? 0 : 'auto',
            right: props.verticalDelimiters === 'right' ? 0 : 'auto'
          }
        }, [group.items.value.length > 0 && _createVNode(VDefaultsProvider, {
          "defaults": {
            VBtn: {
              color: props.color,
              icon: props.delimiterIcon,
              size: 'x-small',
              variant: 'text'
            }
          },
          "scoped": true
        }, {
          default: () => [group.items.value.map(item => {
            const props = {
              'aria-label': t('$vuetify.carousel.ariaLabel.delimiter'),
              class: [group.isSelected(item.id) && 'v-btn--selected'],
              onClick: () => group.select(item.id, true)
            };
            return slots.item ? slots.item({
              props,
              item
            }) : _createVNode(VBtn, _mergeProps(item, props), null);
          })]
        })]), props.progress && _createVNode(VProgressLinear, {
          "class": "v-carousel__progress",
          "color": typeof props.progress === 'string' ? props.progress : undefined,
          "modelValue": (group.getItemIndex(model.value) + 1) / group.items.value.length * 100
        }, null)]);
      },
      prev: slots.prev,
      next: slots.next
    }));
    return {};
  }

});
//# sourceMappingURL=VCarousel.mjs.map