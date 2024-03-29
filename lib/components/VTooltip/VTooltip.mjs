import { createVNode as _createVNode, mergeProps as _mergeProps } from "vue";
// Styles
import "./VTooltip.css"; // Components

import { VOverlay } from "../VOverlay/index.mjs"; // Composables

import { makeTransitionProps } from "../../composables/transition.mjs";
import { useProxiedModel } from "../../composables/proxiedModel.mjs";
import { useScopeId } from "../../composables/scopeId.mjs"; // Utilities

import { computed } from 'vue';
import { genericComponent, getUid, useRender } from "../../util/index.mjs"; // Types

export const VTooltip = genericComponent()({
  name: 'VTooltip',
  inheritAttrs: false,
  props: {
    id: String,
    modelValue: Boolean,
    text: String,
    location: {
      type: String,
      default: 'end'
    },
    origin: {
      type: String,
      default: 'auto'
    },
    ...makeTransitionProps({
      transition: false
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
    const id = computed(() => props.id || `v-tooltip-${uid}`);
    const location = computed(() => {
      return props.location.split(' ').length > 1 ? props.location : props.location + ' center';
    });
    const origin = computed(() => {
      return props.origin === 'auto' || props.origin === 'overlap' || props.origin.split(' ').length > 1 || props.location.split(' ').length > 1 ? props.origin : props.origin + ' center';
    });
    const transition = computed(() => {
      if (props.transition) return props.transition;
      return isActive.value ? 'scale-transition' : 'fade-transition';
    });
    useRender(() => _createVNode(VOverlay, _mergeProps({
      "modelValue": isActive.value,
      "onUpdate:modelValue": $event => isActive.value = $event,
      "class": ['v-tooltip'],
      "id": id.value,
      "transition": transition.value,
      "absolute": true,
      "locationStrategy": "connected",
      "scrollStrategy": "reposition",
      "location": location.value,
      "origin": origin.value,
      "min-width": 0,
      "offset": 10,
      "scrim": false,
      "persistent": true,
      "open-on-click": false,
      "open-on-hover": true,
      "close-on-back": false,
      "role": "tooltip",
      "eager": true,
      "activatorProps": {
        'aria-describedby': id.value
      }
    }, scopeId, attrs), {
      activator: slots.activator,
      default: function () {
        var _slots$default, _slots$default2;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return (_slots$default = (_slots$default2 = slots.default) == null ? void 0 : _slots$default2.call(slots, ...args)) != null ? _slots$default : props.text;
      }
    }));
    return {};
  }

});
//# sourceMappingURL=VTooltip.mjs.map