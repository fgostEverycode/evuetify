import { withDirectives as _withDirectives, resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
// Components
import { VExpansionPanelSymbol } from "./VExpansionPanels.mjs";
import { VIcon } from "../VIcon/index.mjs"; // Directives

import { Ripple } from "../../directives/ripple/index.mjs"; // Composables

import { IconValue } from "../../composables/icons.mjs";
import { useBackgroundColor } from "../../composables/color.mjs"; // Utilities

import { computed, inject } from 'vue';
import { defineComponent, propsFactory, useRender } from "../../util/index.mjs";
export const makeVExpansionPanelTitleProps = propsFactory({
  color: String,
  expandIcon: {
    type: IconValue,
    default: '$expand'
  },
  collapseIcon: {
    type: IconValue,
    default: '$collapse'
  },
  hideActions: Boolean,
  ripple: {
    type: [Boolean, Object],
    default: false
  },
  readonly: Boolean
});
export const VExpansionPanelTitle = defineComponent({
  name: 'VExpansionPanelTitle',
  directives: {
    Ripple
  },
  props: { ...makeVExpansionPanelTitleProps()
  },

  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const expansionPanel = inject(VExpansionPanelSymbol);
    if (!expansionPanel) throw new Error('[Vuetify] v-expansion-panel-title needs to be placed inside v-expansion-panel');
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(props, 'color');
    const slotProps = computed(() => ({
      collapseIcon: props.collapseIcon,
      disabled: expansionPanel.disabled.value,
      expanded: expansionPanel.isSelected.value,
      expandIcon: props.expandIcon,
      readonly: props.readonly
    }));
    useRender(() => {
      var _slots$default;

      return _withDirectives(_createVNode("button", {
        "class": ['v-expansion-panel-title', {
          'v-expansion-panel-title--active': expansionPanel.isSelected.value
        }, backgroundColorClasses.value],
        "style": backgroundColorStyles.value,
        "type": "button",
        "tabindex": expansionPanel.disabled.value ? -1 : undefined,
        "disabled": expansionPanel.disabled.value,
        "aria-expanded": expansionPanel.isSelected.value,
        "onClick": !props.readonly ? expansionPanel.toggle : undefined
      }, [_createVNode("div", {
        "class": "v-expansion-panel-title__overlay"
      }, null), (_slots$default = slots.default) == null ? void 0 : _slots$default.call(slots, slotProps.value), !props.hideActions && _createVNode("div", {
        "class": "v-expansion-panel-title__icon"
      }, [slots.actions ? slots.actions(slotProps.value) : _createVNode(VIcon, {
        "icon": expansionPanel.isSelected.value ? props.collapseIcon : props.expandIcon
      }, null)])]), [[_resolveDirective("ripple"), props.ripple]]);
    });
    return {};
  }

});
//# sourceMappingURL=VExpansionPanelTitle.mjs.map