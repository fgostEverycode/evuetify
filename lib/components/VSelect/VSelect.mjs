import { createTextVNode as _createTextVNode, mergeProps as _mergeProps, createVNode as _createVNode, Fragment as _Fragment } from "vue";
// Styles
import "./VSelect.css"; // Components

import { VDialogTransition } from "../transitions/index.mjs";
import { VCheckboxBtn } from "../VCheckbox/index.mjs";
import { VChip } from "../VChip/index.mjs";
import { VDefaultsProvider } from "../VDefaultsProvider/index.mjs";
import { VList, VListItem } from "../VList/index.mjs";
import { VMenu } from "../VMenu/index.mjs";
import { VTextField } from "../VTextField/index.mjs"; // Composables

import { makeItemsProps, useItems } from "../../composables/items.mjs";
import { makeTransitionProps } from "../../composables/transition.mjs";
import { useForwardRef } from "../../composables/forwardRef.mjs";
import { useLocale } from "../../composables/locale.mjs";
import { useProxiedModel } from "../../composables/proxiedModel.mjs";
import { IconValue } from "../../composables/icons.mjs"; // Utility

import { computed, mergeProps, ref } from 'vue';
import { genericComponent, propsFactory, useRender, wrapInArray } from "../../util/index.mjs"; // Types

export const makeSelectProps = propsFactory({
  chips: Boolean,
  closableChips: Boolean,
  eager: Boolean,
  hideNoData: Boolean,
  hideSelected: Boolean,
  menu: Boolean,
  menuIcon: {
    type: IconValue,
    default: '$dropdown'
  },
  menuProps: {
    type: Object
  },
  modelValue: {
    type: null,
    default: () => []
  },
  multiple: Boolean,
  noDataText: {
    type: String,
    default: '$vuetify.noDataText'
  },
  openOnClear: Boolean,
  ...makeItemsProps({
    itemChildren: false
  })
}, 'select');
export const VSelect = genericComponent()({
  name: 'VSelect',
  props: { ...makeSelectProps(),
    ...makeTransitionProps({
      transition: {
        component: VDialogTransition
      }
    })
  },
  emits: {
    'update:modelValue': val => true,
    'update:menu': val => true
  },

  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      t
    } = useLocale();
    const vTextFieldRef = ref();
    const menu = useProxiedModel(props, 'menu');
    const {
      items,
      transformIn,
      transformOut
    } = useItems(props);
    const model = useProxiedModel(props, 'modelValue', [], v => transformIn(wrapInArray(v)), v => {
      var _transformed$;

      const transformed = transformOut(v);
      return props.multiple ? transformed : (_transformed$ = transformed[0]) != null ? _transformed$ : null;
    });
    const selections = computed(() => {
      return model.value.map(v => {
        return items.value.find(item => item.value === v.value) || v;
      });
    });
    const selected = computed(() => selections.value.map(selection => selection.props.value));

    function onClear(e) {
      model.value = [];

      if (props.openOnClear) {
        menu.value = true;
      }
    }

    function onClickControl() {
      if (props.hideNoData && !items.value.length) return;
      menu.value = true;
    }

    function onKeydown(e) {
      if (['Enter', 'ArrowDown', ' '].includes(e.key)) {
        menu.value = true;
      }

      if (['Escape', 'Tab'].includes(e.key)) {
        menu.value = false;
      }
    }

    function select(item) {
      if (props.multiple) {
        const index = selected.value.findIndex(selection => selection === item.value);

        if (index === -1) {
          model.value = [...model.value, item];
        } else {
          const value = [...model.value];
          value.splice(index, 1);
          model.value = value;
        }
      } else {
        model.value = [item];
        menu.value = false;
      }
    }

    useRender(() => {
      const hasChips = !!(props.chips || slots.chip);
      return _createVNode(VTextField, {
        "ref": vTextFieldRef,
        "modelValue": model.value.map(v => v.props.value).join(', '),
        "onUpdate:modelValue": v => {
          if (v == null) model.value = [];
        },
        "validationValue": props.modelValue,
        "class": ['v-select', {
          'v-select--active-menu': menu.value,
          'v-select--chips': !!props.chips,
          [`v-select--${props.multiple ? 'multiple' : 'single'}`]: true
        }],
        "appendInnerIcon": props.menuIcon,
        "readonly": true,
        "onClick:clear": onClear,
        "onClick:input": onClickControl,
        "onClick:control": onClickControl,
        "onBlur": () => menu.value = false,
        "onKeydown": onKeydown
      }, { ...slots,
        default: () => {
          var _slots$noData, _slots$noData2;

          return _createVNode(_Fragment, null, [_createVNode(VMenu, _mergeProps({
            "modelValue": menu.value,
            "onUpdate:modelValue": $event => menu.value = $event,
            "activator": "parent",
            "contentClass": "v-select__content",
            "eager": props.eager,
            "openOnClick": false,
            "closeOnContentClick": false,
            "transition": props.transition
          }, props.menuProps), {
            default: () => [_createVNode(VList, {
              "selected": selected.value,
              "selectStrategy": props.multiple ? 'independent' : 'single-independent',
              "onMousedown": e => e.preventDefault()
            }, {
              default: () => [!items.value.length && !props.hideNoData && ((_slots$noData = (_slots$noData2 = slots['no-data']) == null ? void 0 : _slots$noData2.call(slots)) != null ? _slots$noData : _createVNode(VListItem, {
                "title": t(props.noDataText)
              }, null)), items.value.map((item, index) => {
                var _slots$item, _slots$item2;

                return (_slots$item = (_slots$item2 = slots.item) == null ? void 0 : _slots$item2.call(slots, {
                  item,
                  index,
                  props: mergeProps(item.props, {
                    onClick: () => select(item)
                  })
                })) != null ? _slots$item : _createVNode(VListItem, _mergeProps({
                  "key": index
                }, item.props, {
                  "onClick": () => select(item)
                }), {
                  prepend: _ref2 => {
                    let {
                      isSelected
                    } = _ref2;
                    return props.multiple ? _createVNode(VCheckboxBtn, {
                      "modelValue": isSelected,
                      "ripple": false
                    }, null) : undefined;
                  }
                });
              })]
            })]
          }), selections.value.map((item, index) => {
            function onChipClose(e) {
              e.stopPropagation();
              e.preventDefault();
              select(item);
            }

            const slotProps = {
              'onClick:close': onChipClose,
              modelValue: true
            };
            return _createVNode("div", {
              "key": index,
              "class": "v-select__selection"
            }, [hasChips ? _createVNode(VDefaultsProvider, {
              "defaults": {
                VChip: {
                  closable: props.closableChips,
                  size: 'small',
                  text: item.title
                }
              }
            }, {
              default: () => [slots.chip ? slots.chip({
                item,
                index,
                props: slotProps
              }) : _createVNode(VChip, slotProps, null)]
            }) : slots.selection ? slots.selection({
              item,
              index
            }) : _createVNode("span", {
              "class": "v-select__selection-text"
            }, [item.title, props.multiple && index < selections.value.length - 1 && _createVNode("span", {
              "class": "v-select__selection-comma"
            }, [_createTextVNode(",")])])]);
          })]);
        }
      });
    });
    return useForwardRef({
      menu,
      select
    }, vTextFieldRef);
  }

});
//# sourceMappingURL=VSelect.mjs.map