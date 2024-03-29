import { mergeProps as _mergeProps, createVNode as _createVNode, Fragment as _Fragment } from "vue";
// Styles
import "./VNavigationDrawer.css"; // Composables

import { makeBorderProps, useBorder } from "../../composables/border.mjs";
import { makeElevationProps, useElevation } from "../../composables/elevation.mjs";
import { makeLayoutItemProps, useLayoutItem } from "../../composables/layout.mjs";
import { makeRoundedProps, useRounded } from "../../composables/rounded.mjs";
import { makeTagProps } from "../../composables/tag.mjs";
import { makeThemeProps, provideTheme } from "../../composables/theme.mjs";
import { useBackgroundColor } from "../../composables/color.mjs";
import { useDisplay } from "../../composables/display.mjs";
import { useProxiedModel } from "../../composables/proxiedModel.mjs";
import { useRouter } from "../../composables/router.mjs";
import { useSsrBoot } from "../../composables/ssrBoot.mjs";
import { useTouch } from "./touch.mjs"; // Utilities

import { computed, onBeforeMount, ref, toRef, Transition, watch } from 'vue';
import { convertToUnit, defineComponent, useRender } from "../../util/index.mjs"; // Types

export const VNavigationDrawer = defineComponent({
  name: 'VNavigationDrawer',
  props: {
    color: String,
    disableResizeWatcher: Boolean,
    disableRouteWatcher: Boolean,
    expandOnHover: Boolean,
    floating: Boolean,
    modelValue: {
      type: Boolean,
      default: null
    },
    permanent: Boolean,
    rail: Boolean,
    railWidth: {
      type: [Number, String],
      default: 72
    },
    image: String,
    temporary: Boolean,
    touchless: Boolean,
    width: {
      type: [Number, String],
      default: 256
    },
    location: {
      type: String,
      default: 'left',
      validator: value => ['left', 'right', 'bottom'].includes(value)
    },
    ...makeBorderProps(),
    ...makeElevationProps(),
    ...makeLayoutItemProps(),
    ...makeRoundedProps(),
    ...makeTagProps({
      tag: 'nav'
    }),
    ...makeThemeProps()
  },
  emits: {
    'update:modelValue': val => true
  },

  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      borderClasses
    } = useBorder(props);
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, 'color'));
    const {
      elevationClasses
    } = useElevation(props);
    const {
      mobile
    } = useDisplay();
    const {
      roundedClasses
    } = useRounded(props);
    const router = useRouter();
    const isActive = useProxiedModel(props, 'modelValue', null, v => !!v);
    const isHovering = ref(false);
    const {
      ssrBootStyles
    } = useSsrBoot();
    const width = computed(() => {
      return props.rail && props.expandOnHover && isHovering.value ? Number(props.width) : Number(props.rail ? props.railWidth : props.width);
    });
    const isTemporary = computed(() => !props.permanent && (mobile.value || props.temporary));

    if (!props.disableResizeWatcher) {
      watch(isTemporary, val => !props.permanent && (isActive.value = !val));
    }

    if (!props.disableRouteWatcher && router) {
      watch(router.currentRoute, () => isTemporary.value && (isActive.value = false));
    }

    watch(() => props.permanent, val => {
      if (val) isActive.value = true;
    });
    onBeforeMount(() => {
      if (props.modelValue != null || isTemporary.value) return;
      isActive.value = props.permanent || !mobile.value;
    });
    const rootEl = ref();
    const {
      isDragging,
      dragProgress,
      dragStyles
    } = useTouch({
      isActive,
      isTemporary,
      width,
      touchless: toRef(props, 'touchless'),
      position: toRef(props, 'location')
    });
    const layoutSize = computed(() => {
      const size = isTemporary.value ? 0 : props.rail && props.expandOnHover ? Number(props.railWidth) : width.value;
      return isDragging.value ? size * dragProgress.value : size;
    });
    const {
      layoutItemStyles,
      layoutRect,
      layoutItemScrimStyles
    } = useLayoutItem({
      id: props.name,
      order: computed(() => parseInt(props.order, 10)),
      position: toRef(props, 'location'),
      layoutSize,
      elementSize: width,
      active: computed(() => isActive.value || isDragging.value),
      disableTransitions: computed(() => isDragging.value),
      absolute: toRef(props, 'absolute')
    });
    const scrimStyles = computed(() => ({ ...(isDragging.value ? {
        opacity: dragProgress.value * 0.2,
        transition: 'none'
      } : undefined),
      ...(layoutRect.value ? {
        left: convertToUnit(layoutRect.value.left),
        right: convertToUnit(layoutRect.value.right),
        top: convertToUnit(layoutRect.value.top),
        bottom: convertToUnit(layoutRect.value.bottom)
      } : undefined),
      ...layoutItemScrimStyles.value
    }));
    useRender(() => {
      var _slots$image, _slots$prepend, _slots$default, _slots$append;

      const hasImage = slots.image || props.image;
      return _createVNode(_Fragment, null, [_createVNode(props.tag, _mergeProps({
        "ref": rootEl,
        "onMouseenter": () => isHovering.value = true,
        "onMouseleave": () => isHovering.value = false,
        "class": ['v-navigation-drawer', {
          'v-navigation-drawer--bottom': props.location === 'bottom',
          'v-navigation-drawer--end': props.location === 'right',
          'v-navigation-drawer--expand-on-hover': props.expandOnHover,
          'v-navigation-drawer--floating': props.floating,
          'v-navigation-drawer--is-hovering': isHovering.value,
          'v-navigation-drawer--rail': props.rail,
          'v-navigation-drawer--start': props.location === 'left',
          'v-navigation-drawer--temporary': isTemporary.value,
          'v-navigation-drawer--active': isActive.value
        }, themeClasses.value, backgroundColorClasses.value, borderClasses.value, elevationClasses.value, roundedClasses.value],
        "style": [backgroundColorStyles.value, layoutItemStyles.value, dragStyles.value, ssrBootStyles.value]
      }, attrs), {
        default: () => [hasImage && _createVNode("div", {
          "key": "image",
          "class": "v-navigation-drawer__img"
        }, [slots.image ? (_slots$image = slots.image) == null ? void 0 : _slots$image.call(slots, {
          image: props.image
        }) : _createVNode("img", {
          "src": props.image,
          "alt": ""
        }, null)]), slots.prepend && _createVNode("div", {
          "class": "v-navigation-drawer__prepend"
        }, [(_slots$prepend = slots.prepend) == null ? void 0 : _slots$prepend.call(slots)]), _createVNode("div", {
          "class": "v-navigation-drawer__content"
        }, [(_slots$default = slots.default) == null ? void 0 : _slots$default.call(slots)]), slots.append && _createVNode("div", {
          "class": "v-navigation-drawer__append"
        }, [(_slots$append = slots.append) == null ? void 0 : _slots$append.call(slots)])]
      }), _createVNode(Transition, {
        "name": "fade-transition"
      }, {
        default: () => [isTemporary.value && (isDragging.value || isActive.value) && _createVNode("div", {
          "class": "v-navigation-drawer__scrim",
          "style": scrimStyles.value,
          "onClick": () => isActive.value = false
        }, null)]
      })]);
    });
    return {};
  }

});
//# sourceMappingURL=VNavigationDrawer.mjs.map