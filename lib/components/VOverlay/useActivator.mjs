// Composables
import { makeDelayProps, useDelay } from "../../composables/delay.mjs";
import { VMenuSymbol } from "../VMenu/shared.mjs"; // Utilities

import { getCurrentInstance, IN_BROWSER, isComponentInstance, propsFactory, SUPPORTS_FOCUS_VISIBLE } from "../../util/index.mjs";
import { computed, effectScope, inject, nextTick, onScopeDispose, ref, watch, watchEffect } from 'vue'; // Types

export const makeActivatorProps = propsFactory({
  activator: [String, Object],
  activatorProps: {
    type: Object,
    default: () => ({})
  },
  openOnClick: {
    type: Boolean,
    default: undefined
  },
  openOnHover: Boolean,
  openOnFocus: {
    type: Boolean,
    default: undefined
  },
  closeOnContentClick: Boolean,
  ...makeDelayProps()
});
export function useActivator(props, _ref) {
  let {
    isActive,
    isTop
  } = _ref;
  const activatorEl = ref();
  let isHovered = false;
  let isFocused = false;
  const openOnFocus = computed(() => props.openOnFocus || props.openOnFocus == null && props.openOnHover);
  const openOnClick = computed(() => props.openOnClick || props.openOnClick == null && !props.openOnHover && !openOnFocus.value);
  const {
    runOpenDelay,
    runCloseDelay
  } = useDelay(props, value => {
    if (value === (props.openOnHover && isHovered || openOnFocus.value && isFocused) && !(props.openOnHover && isActive.value && !isTop.value)) {
      isActive.value = value;
    }
  });
  const availableEvents = {
    click: e => {
      e.stopPropagation();
      activatorEl.value = e.currentTarget || e.target;
      isActive.value = !isActive.value;
    },
    mouseenter: e => {
      isHovered = true;
      activatorEl.value = e.currentTarget || e.target;
      runOpenDelay();
    },
    mouseleave: e => {
      isHovered = false;
      runCloseDelay();
    },
    focus: e => {
      if (SUPPORTS_FOCUS_VISIBLE && !e.target.matches(':focus-visible')) return;
      isFocused = true;
      e.stopPropagation();
      activatorEl.value = e.currentTarget || e.target;
      runOpenDelay();
    },
    blur: e => {
      isFocused = false;
      e.stopPropagation();
      runCloseDelay();
    }
  };
  const activatorEvents = computed(() => {
    const events = {};

    if (openOnClick.value) {
      events.click = availableEvents.click;
    }

    if (props.openOnHover) {
      events.mouseenter = availableEvents.mouseenter;
      events.mouseleave = availableEvents.mouseleave;
    }

    if (openOnFocus.value) {
      events.focus = availableEvents.focus;
      events.blur = availableEvents.blur;
    }

    return events;
  });
  const contentEvents = computed(() => {
    const events = {};

    if (props.openOnHover) {
      events.mouseenter = () => {
        isHovered = true;
        runOpenDelay();
      };

      events.mouseleave = () => {
        isHovered = false;
        runCloseDelay();
      };
    }

    if (props.closeOnContentClick) {
      const menu = inject(VMenuSymbol, null);

      events.click = () => {
        isActive.value = false;
        menu == null ? void 0 : menu.closeParents();
      };
    }

    return events;
  });
  watch(isTop, val => {
    if (val && props.openOnHover && !isHovered) {
      isActive.value = false;
    }
  });
  const activatorRef = ref();
  watchEffect(() => {
    if (!activatorRef.value) return;
    nextTick(() => {
      const activator = activatorRef.value;
      activatorEl.value = isComponentInstance(activator) ? activator.$el : activator;
    });
  });
  const vm = getCurrentInstance('useActivator');
  let scope;
  watch(() => !!props.activator, val => {
    if (val && IN_BROWSER) {
      scope = effectScope();
      scope.run(() => {
        _useActivator(props, vm, {
          activatorEl,
          activatorEvents
        });
      });
    } else if (scope) {
      scope.stop();
    }
  }, {
    flush: 'post',
    immediate: true
  });
  return {
    activatorEl,
    activatorRef,
    activatorEvents,
    contentEvents
  };
}

function _useActivator(props, vm, _ref2) {
  let {
    activatorEl,
    activatorEvents
  } = _ref2;
  watch(() => props.activator, (val, oldVal) => {
    if (oldVal && val !== oldVal) {
      const activator = getActivator(oldVal);
      activator && unbindActivatorProps(activator);
    }

    if (val) {
      nextTick(() => bindActivatorProps());
    }
  }, {
    immediate: true
  });
  watch(() => props.activatorProps, () => {
    bindActivatorProps();
  });
  onScopeDispose(() => {
    unbindActivatorProps();
  });

  function bindActivatorProps() {
    let el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getActivator();

    let _props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : props.activatorProps;

    if (!el) return;
    Object.entries(activatorEvents.value).forEach(_ref3 => {
      let [name, cb] = _ref3;
      el.addEventListener(name, cb);
    });
    Object.keys(_props).forEach(k => {
      if (_props[k] == null) {
        el.removeAttribute(k);
      } else {
        el.setAttribute(k, _props[k]);
      }
    });
  }

  function unbindActivatorProps() {
    let el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getActivator();

    let _props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : props.activatorProps;

    if (!el) return;
    Object.entries(activatorEvents.value).forEach(_ref4 => {
      let [name, cb] = _ref4;
      el.removeEventListener(name, cb);
    });
    Object.keys(_props).forEach(k => {
      el.removeAttribute(k);
    });
  }

  function getActivator() {
    var _activator;

    let selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : props.activator;
    let activator;

    if (selector) {
      if (selector === 'parent') {
        var _vm$proxy, _vm$proxy$$el;

        let el = vm == null ? void 0 : (_vm$proxy = vm.proxy) == null ? void 0 : (_vm$proxy$$el = _vm$proxy.$el) == null ? void 0 : _vm$proxy$$el.parentNode;

        while (el.hasAttribute('data-no-activator')) {
          el = el.parentNode;
        }

        activator = el;
      } else if (typeof selector === 'string') {
        // Selector
        activator = document.querySelector(selector);
      } else if ('$el' in selector) {
        // Component (ref)
        activator = selector.$el;
      } else {
        // HTMLElement | Element
        activator = selector;
      }
    } // The activator should only be a valid element (Ignore comments and text nodes)


    activatorEl.value = ((_activator = activator) == null ? void 0 : _activator.nodeType) === Node.ELEMENT_NODE ? activator : null;
    return activatorEl.value;
  }
}
//# sourceMappingURL=useActivator.mjs.map