import { createVNode as _createVNode, mergeProps as _mergeProps, resolveDirective as _resolveDirective } from "vue";
// Styles
import "./VMenu.css"; // Components

import { VDialogTransition } from "../transitions/index.mjs";
import { VOverlay } from "../VOverlay/index.mjs"; // Composables

import { makeTransitionProps } from "../../composables/transition.mjs";
import { useForwardRef } from "../../composables/forwardRef.mjs";
import { useProxiedModel } from "../../composables/proxiedModel.mjs";
import { useScopeId } from "../../composables/scopeId.mjs"; // Utilities

import { computed, inject, provide, ref, watch } from 'vue';
import { genericComponent, getUid, useRender } from "../../util/index.mjs";
import { VMenuSymbol } from "./shared.mjs"; // Types

export const VMenu = genericComponent()({
  name: 'VMenu',
  inheritAttrs: false,
  props: {
    // TODO
    // disableKeys: Boolean,
    modelValue: Boolean,
    id: String,
    ...makeTransitionProps({
      transition: {
        component: VDialogTransition
      }
    })
  },
  emits: {
    'update:modelValue': value => true
  },

  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const isActive = useProxiedModel(props, 'modelValue');
    const {
      scopeId
    } = useScopeId();
    const uid = getUid();
    const id = computed(() => props.id || `v-menu-${uid}`);
    const overlay = ref();
    const parent = inject(VMenuSymbol, null);
    let openChildren = 0;
    provide(VMenuSymbol, {
      register() {
        ++openChildren;
      },

      unregister() {
        --openChildren;
      },

      closeParents() {
        setTimeout(() => {
          if (!openChildren) {
            isActive.value = false;
            parent == null ? void 0 : parent.closeParents();
          }
        }, 40);
      }

    });
    watch(isActive, val => {
      val ? parent == null ? void 0 : parent.register() : parent == null ? void 0 : parent.unregister();
    });

    function onClickOutside() {
      parent == null ? void 0 : parent.closeParents();
    }

    useRender(() => _createVNode(VOverlay, _mergeProps({
      "ref": overlay,
      "modelValue": isActive.value,
      "onUpdate:modelValue": $event => isActive.value = $event,
      "class": ['v-menu'],
      "transition": props.transition,
      "absolute": true,
      "closeOnContentClick": true,
      "locationStrategy": "connected",
      "scrollStrategy": "reposition",
      "scrim": false,
      "openDelay": "300",
      "closeDelay": "250",
      "activatorProps": {
        'aria-haspopup': 'menu',
        'aria-expanded': String(isActive.value),
        'aria-owns': id.value
      },
      "onClick:outside": onClickOutside
    }, scopeId, attrs), {
      default: slots.default,
      activator: slots.activator
    }));
    return useForwardRef({
      id
    }, overlay);
  }

});
//# sourceMappingURL=VMenu.mjs.map