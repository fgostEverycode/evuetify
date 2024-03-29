import { createVNode as _createVNode } from "vue";
// Styles
import "./VPagination.css"; // Components

import { VBtn } from "../VBtn/index.mjs"; // Composables

import { IconValue } from "../../composables/icons.mjs";
import { makeBorderProps } from "../../composables/border.mjs";
import { makeDensityProps } from "../../composables/density.mjs";
import { makeElevationProps } from "../../composables/elevation.mjs";
import { makeRoundedProps } from "../../composables/rounded.mjs";
import { makeSizeProps } from "../../composables/size.mjs";
import { makeTagProps } from "../../composables/tag.mjs";
import { makeThemeProps, provideTheme } from "../../composables/theme.mjs";
import { makeVariantProps } from "../../composables/variant.mjs";
import { provideDefaults } from "../../composables/defaults.mjs";
import { useLocale } from "../../composables/locale.mjs";
import { useProxiedModel } from "../../composables/proxiedModel.mjs";
import { useRefs } from "../../composables/refs.mjs";
import { useResizeObserver } from "../../composables/resizeObserver.mjs";
import { useRtl } from "../../composables/rtl.mjs"; // Utilities

import { computed, nextTick, ref, toRef } from 'vue';
import { createRange, defineComponent, keyValues, useRender } from "../../util/index.mjs"; // Types

export const VPagination = defineComponent({
  name: 'VPagination',
  props: {
    start: {
      type: [Number, String],
      default: 1
    },
    modelValue: {
      type: Number,
      default: props => props.start
    },
    disabled: Boolean,
    length: {
      type: [Number, String],
      default: 1,
      validator: val => val % 1 === 0
    },
    totalVisible: [Number, String],
    firstIcon: {
      type: IconValue,
      default: '$first'
    },
    prevIcon: {
      type: IconValue,
      default: '$prev'
    },
    nextIcon: {
      type: IconValue,
      default: '$next'
    },
    lastIcon: {
      type: IconValue,
      default: '$last'
    },
    ariaLabel: {
      type: String,
      default: '$vuetify.pagination.ariaLabel.root'
    },
    pageAriaLabel: {
      type: String,
      default: '$vuetify.pagination.ariaLabel.page'
    },
    currentPageAriaLabel: {
      type: String,
      default: '$vuetify.pagination.ariaLabel.currentPage'
    },
    firstAriaLabel: {
      type: String,
      default: '$vuetify.pagination.ariaLabel.first'
    },
    previousAriaLabel: {
      type: String,
      default: '$vuetify.pagination.ariaLabel.previous'
    },
    nextAriaLabel: {
      type: String,
      default: '$vuetify.pagination.ariaLabel.next'
    },
    lastAriaLabel: {
      type: String,
      default: '$vuetify.pagination.ariaLabel.last'
    },
    ellipsis: {
      type: String,
      default: '...'
    },
    showFirstLastPage: Boolean,
    ...makeBorderProps(),
    ...makeDensityProps(),
    ...makeElevationProps(),
    ...makeRoundedProps(),
    ...makeSizeProps(),
    ...makeTagProps({
      tag: 'nav'
    }),
    ...makeThemeProps(),
    ...makeVariantProps({
      variant: 'text'
    })
  },
  emits: {
    'update:modelValue': value => true,
    first: value => true,
    prev: value => true,
    next: value => true,
    last: value => true
  },

  setup(props, _ref) {
    let {
      slots,
      emit
    } = _ref;
    const page = useProxiedModel(props, 'modelValue');
    const {
      t,
      n
    } = useLocale();
    const {
      isRtl
    } = useRtl();
    const {
      themeClasses
    } = provideTheme(props);
    const maxButtons = ref(-1);
    provideDefaults(undefined, {
      scoped: true
    });
    const {
      resizeRef
    } = useResizeObserver(entries => {
      if (!entries.length) return;
      const {
        target,
        contentRect
      } = entries[0];
      const firstItem = target.querySelector('.v-pagination__list > *');
      if (!firstItem) return;
      const totalWidth = contentRect.width;
      const itemWidth = firstItem.getBoundingClientRect().width + 10;
      maxButtons.value = Math.max(0, Math.floor((totalWidth - 96) / itemWidth));
    });
    const length = computed(() => parseInt(props.length, 10));
    const start = computed(() => parseInt(props.start, 10));
    const totalVisible = computed(() => {
      var _props$totalVisible;

      if (props.totalVisible) return Math.min(parseInt((_props$totalVisible = props.totalVisible) != null ? _props$totalVisible : '', 10), length.value);else if (maxButtons.value >= 0) return maxButtons.value;
      return length.value;
    });
    const range = computed(() => {
      if (length.value <= 0) return [];
      if (totalVisible.value <= 2) return [page.value];

      if (length.value <= totalVisible.value) {
        return createRange(length.value, start.value);
      }

      const even = totalVisible.value % 2 === 0;
      const middle = even ? totalVisible.value / 2 : Math.floor(totalVisible.value / 2);
      const left = even ? middle : middle + 1;
      const right = length.value - middle;

      if (left - page.value >= 0) {
        return [...createRange(Math.max(1, totalVisible.value - 1), start.value), props.ellipsis, length.value];
      } else if (page.value - right >= 0) {
        const rangeLength = totalVisible.value - 1;
        const rangeStart = length.value - rangeLength + start.value;
        return [start.value, props.ellipsis, ...createRange(rangeLength, rangeStart)];
      } else {
        const rangeLength = Math.max(1, totalVisible.value - 3);
        const rangeStart = rangeLength === 1 ? page.value : page.value - Math.ceil(rangeLength / 2) + start.value;
        return [start.value, props.ellipsis, ...createRange(rangeLength, rangeStart), props.ellipsis, length.value];
      }
    }); // TODO: 'first' | 'prev' | 'next' | 'last' does not work here?

    function setValue(e, value, event) {
      e.preventDefault();
      page.value = value;
      event && emit(event, value);
    }

    const {
      refs,
      updateRef
    } = useRefs();
    provideDefaults({
      VBtn: {
        border: toRef(props, 'border'),
        density: toRef(props, 'density'),
        size: toRef(props, 'size'),
        variant: toRef(props, 'variant')
      }
    });
    const items = computed(() => {
      return range.value.map((item, index) => {
        const ref = e => updateRef(e, index);

        if (typeof item === 'string') {
          return {
            isActive: false,
            page: item,
            props: {
              ref,
              ellipsis: true,
              icon: true,
              disabled: true
            }
          };
        } else {
          const isActive = item === page.value;
          return {
            isActive,
            page: n(item),
            props: {
              ref,
              ellipsis: false,
              icon: true,
              disabled: !!props.disabled || props.length < 2,
              elevation: props.elevation,
              rounded: props.rounded,
              color: isActive ? props.color : undefined,
              ariaCurrent: isActive,
              ariaLabel: t(isActive ? props.currentPageAriaLabel : props.pageAriaLabel, index + 1),
              onClick: e => setValue(e, item)
            }
          };
        }
      });
    });
    const controls = computed(() => {
      const prevDisabled = !!props.disabled || page.value <= start.value;
      const nextDisabled = !!props.disabled || page.value >= start.value + length.value - 1;
      return {
        first: props.showFirstLastPage ? {
          icon: isRtl.value ? props.lastIcon : props.firstIcon,
          onClick: e => setValue(e, start.value, 'first'),
          disabled: prevDisabled,
          ariaLabel: t(props.firstAriaLabel),
          ariaDisabled: prevDisabled
        } : undefined,
        prev: {
          icon: isRtl.value ? props.nextIcon : props.prevIcon,
          onClick: e => setValue(e, page.value - 1, 'prev'),
          disabled: prevDisabled,
          ariaLabel: t(props.previousAriaLabel),
          ariaDisabled: prevDisabled
        },
        next: {
          icon: isRtl.value ? props.prevIcon : props.nextIcon,
          onClick: e => setValue(e, page.value + 1, 'next'),
          disabled: nextDisabled,
          ariaLabel: t(props.nextAriaLabel),
          ariaDisabled: nextDisabled
        },
        last: props.showFirstLastPage ? {
          icon: isRtl.value ? props.firstIcon : props.lastIcon,
          onClick: e => setValue(e, start.value + length.value - 1, 'last'),
          disabled: nextDisabled,
          ariaLabel: t(props.lastAriaLabel),
          ariaDisabled: nextDisabled
        } : undefined
      };
    });

    function updateFocus() {
      var _refs$value$currentIn;

      const currentIndex = page.value - start.value;
      (_refs$value$currentIn = refs.value[currentIndex]) == null ? void 0 : _refs$value$currentIn.$el.focus();
    }

    function onKeydown(e) {
      if (e.key === keyValues.left && !props.disabled && page.value > props.start) {
        page.value = page.value - 1;
        nextTick(updateFocus);
      } else if (e.key === keyValues.right && !props.disabled && page.value < start.value + length.value - 1) {
        page.value = page.value + 1;
        nextTick(updateFocus);
      }
    }

    useRender(() => _createVNode(props.tag, {
      "ref": resizeRef,
      "class": ['v-pagination', themeClasses.value],
      "role": "navigation",
      "aria-label": t(props.ariaLabel),
      "onKeydown": onKeydown,
      "data-test": "v-pagination-root"
    }, {
      default: () => [_createVNode("ul", {
        "class": "v-pagination__list"
      }, [props.showFirstLastPage && _createVNode("li", {
        "key": "first",
        "class": "v-pagination__first",
        "data-test": "v-pagination-first"
      }, [slots.first ? slots.first(controls.value.first) : _createVNode(VBtn, controls.value.first, null)]), _createVNode("li", {
        "class": "v-pagination__prev",
        "data-test": "v-pagination-prev"
      }, [slots.prev ? slots.prev(controls.value.prev) : _createVNode(VBtn, controls.value.prev, null)]), items.value.map((item, index) => _createVNode("li", {
        "key": `${index}_${item.page}`,
        "class": ['v-pagination__item', {
          'v-pagination__item--is-active': item.isActive
        }],
        "data-test": "v-pagination-item"
      }, [slots.item ? slots.item(item) : _createVNode(VBtn, item.props, {
        default: () => [item.page]
      })])), _createVNode("li", {
        "class": "v-pagination__next",
        "data-test": "v-pagination-next"
      }, [slots.next ? slots.next(controls.value.next) : _createVNode(VBtn, controls.value.next, null)]), props.showFirstLastPage && _createVNode("li", {
        "key": "last",
        "class": "v-pagination__last",
        "data-test": "v-pagination-last"
      }, [slots.last ? slots.last(controls.value.last) : _createVNode(VBtn, controls.value.last, null)])])]
    }));
    return {};
  }

});
//# sourceMappingURL=VPagination.mjs.map