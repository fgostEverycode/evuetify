import { createTextVNode as _createTextVNode, mergeProps as _mergeProps, createVNode as _createVNode, Fragment as _Fragment } from "vue";
// Styles
import "./VCombobox.css"; // Components

import { makeSelectProps } from "../VSelect/VSelect.mjs";
import { VCheckboxBtn } from "../VCheckbox/index.mjs";
import { VChip } from "../VChip/index.mjs";
import { VDefaultsProvider } from "../VDefaultsProvider/index.mjs";
import { VList, VListItem } from "../VList/index.mjs";
import { VMenu } from "../VMenu/index.mjs";
import { VTextField } from "../VTextField/index.mjs"; // Composables

import { makeFilterProps, useFilter } from "../../composables/filter.mjs";
import { makeTransitionProps } from "../../composables/transition.mjs";
import { transformItem, useItems } from "../../composables/items.mjs";
import { useForwardRef } from "../../composables/forwardRef.mjs";
import { useLocale } from "../../composables/locale.mjs";
import { useProxiedModel } from "../../composables/proxiedModel.mjs";
import { useTextColor } from "../../composables/color.mjs"; // Utility

import { computed, mergeProps, nextTick, ref, watch } from 'vue';
import { genericComponent, useRender, wrapInArray } from "../../util/index.mjs"; // Types

function highlightResult(text, matches, length) {
  if (Array.isArray(matches)) throw new Error('Multiple matches is not implemented');
  return typeof matches === 'number' && ~matches ? _createVNode(_Fragment, null, [_createVNode("span", {
    "class": "v-combobox__unmask"
  }, [text.substr(0, matches)]), _createVNode("span", {
    "class": "v-combobox__mask"
  }, [text.substr(matches, length)]), _createVNode("span", {
    "class": "v-combobox__unmask"
  }, [text.substr(matches + length)])]) : text;
}

export const VCombobox = genericComponent()({
  name: 'VCombobox',
  props: {
    // TODO: implement post keyboard support
    // autoSelectFirst: Boolean,
    delimiters: Array,
    ...makeFilterProps({
      filterKeys: ['title']
    }),
    ...makeSelectProps({
      hideNoData: true,
      returnObject: true
    }),
    ...makeTransitionProps({
      transition: false
    })
  },
  emits: {
    'update:modelValue': val => true,
    'update:searchInput': val => true,
    'update:menu': val => true
  },

  setup(props, _ref) {
    let {
      emit,
      slots
    } = _ref;
    const {
      t
    } = useLocale();
    const vTextFieldRef = ref();
    const isFocused = ref(false);
    const isPristine = ref(true);
    const menu = useProxiedModel(props, 'menu');
    const selectionIndex = ref(-1);
    const color = computed(() => {
      var _vTextFieldRef$value;

      return (_vTextFieldRef$value = vTextFieldRef.value) == null ? void 0 : _vTextFieldRef$value.color;
    });
    const {
      items,
      transformIn,
      transformOut
    } = useItems(props);
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(color);
    const model = useProxiedModel(props, 'modelValue', [], v => transformIn(wrapInArray(v || [])), v => {
      var _transformed$;

      const transformed = transformOut(v);
      return props.multiple ? transformed : (_transformed$ = transformed[0]) != null ? _transformed$ : null;
    });

    const _search = ref('');

    const search = computed({
      get: () => {
        if (props.multiple) return _search.value;
        const item = items.value.find(item => {
          var _model$value$;

          return item.value === ((_model$value$ = model.value[0]) == null ? void 0 : _model$value$.value);
        });
        return item == null ? void 0 : item.value;
      },
      set: val => {
        var _props$delimiters;

        if (props.multiple) {
          _search.value = val;
        } else {
          model.value = [transformItem(props, val)];
        }

        if (val && props.multiple && (_props$delimiters = props.delimiters) != null && _props$delimiters.length) {
          const values = val.split(new RegExp(`(?:${props.delimiters.join('|')})+`));

          if (values.length > 1) {
            values.forEach(v => {
              v = v.trim();
              if (v) select(transformItem(props, v));
            });
            _search.value = '';
          }
        }

        if (!val) selectionIndex.value = -1;
        if (isFocused.value) menu.value = true;
        isPristine.value = !val;
      }
    });
    watch(_search, value => {
      emit('update:searchInput', value);
    });
    const {
      filteredItems
    } = useFilter(props, items, computed(() => isPristine.value ? undefined : search.value));
    const selections = computed(() => {
      return model.value.map(v => {
        return items.value.find(item => item.value === v.value) || v;
      });
    });
    const selected = computed(() => selections.value.map(selection => selection.props.value));
    const selection = computed(() => selections.value[selectionIndex.value]);

    function onClear(e) {
      model.value = [];

      if (props.openOnClear) {
        menu.value = true;
      }
    }

    function onClickControl() {
      if (props.hideNoData && !filteredItems.value.length) return;
      menu.value = true;
    }

    function onKeydown(e) {
      const selectionStart = vTextFieldRef.value.selectionStart;
      const length = selected.value.length;
      if (selectionIndex.value > -1) e.preventDefault();

      if (['Enter', 'ArrowDown'].includes(e.key)) {
        menu.value = true;
      }

      if (['Escape'].includes(e.key)) {
        menu.value = false;
      }

      if (['Enter', 'Escape', 'Tab'].includes(e.key)) {
        isPristine.value = true;
      }

      if (!props.multiple) return;

      if (['Backspace', 'Delete'].includes(e.key)) {
        if (selectionIndex.value < 0) {
          if (e.key === 'Backspace' && !search.value) {
            selectionIndex.value = length - 1;
          }

          return;
        }

        select(selection.value);
        nextTick(() => !selection.value && (selectionIndex.value = length - 2));
      }

      if (e.key === 'ArrowLeft') {
        if (selectionIndex.value < 0 && selectionStart > 0) return;
        const prev = selectionIndex.value > -1 ? selectionIndex.value - 1 : length - 1;

        if (selections.value[prev]) {
          selectionIndex.value = prev;
        } else {
          selectionIndex.value = -1;
          vTextFieldRef.value.setSelectionRange(search.value.length, search.value.length);
        }
      }

      if (e.key === 'ArrowRight') {
        if (selectionIndex.value < 0) return;
        const next = selectionIndex.value + 1;

        if (selections.value[next]) {
          selectionIndex.value = next;
        } else {
          selectionIndex.value = -1;
          vTextFieldRef.value.setSelectionRange(0, 0);
        }
      }

      if (e.key === 'Enter') {
        select(transformItem(props, search.value));
        search.value = '';
      }
    }

    function onAfterLeave() {
      if (isFocused.value) isPristine.value = true;
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

        search.value = '';
      } else {
        search.value = item.title; // watch for search watcher to trigger

        nextTick(() => {
          menu.value = false;
          isPristine.value = true;
        });
      }
    }

    watch(filteredItems, val => {
      if (!val.length && props.hideNoData) menu.value = false;
    });
    watch(isFocused, val => {
      if (val) {
        selectionIndex.value = -1;
      } else {
        menu.value = false;
        if (!props.multiple || !search.value) return;
        model.value = [...model.value, transformItem(props, search.value)];
        search.value = '';
      }
    });
    useRender(() => {
      const hasChips = !!(props.chips || slots.chip);
      return _createVNode(VTextField, {
        "ref": vTextFieldRef,
        "modelValue": search.value,
        "onUpdate:modelValue": [$event => search.value = $event, v => {
          if (v == null) model.value = [];
        }],
        "validationValue": props.modelValue,
        "class": ['v-combobox', {
          'v-combobox--active-menu': menu.value,
          'v-combobox--chips': !!props.chips,
          'v-combobox--selecting-index': selectionIndex.value > -1,
          [`v-combobox--${props.multiple ? 'multiple' : 'single'}`]: true
        }],
        "appendInnerIcon": props.items.length ? props.menuIcon : undefined,
        "onClick:clear": onClear,
        "onClick:control": onClickControl,
        "onClick:input": onClickControl,
        "onFocus": () => isFocused.value = true,
        "onBlur": () => isFocused.value = false,
        "onKeydown": onKeydown
      }, { ...slots,
        default: () => {
          var _slots$noData, _slots$noData2;

          return _createVNode(_Fragment, null, [_createVNode(VMenu, _mergeProps({
            "modelValue": menu.value,
            "onUpdate:modelValue": $event => menu.value = $event,
            "activator": "parent",
            "contentClass": "v-combobox__content",
            "eager": props.eager,
            "openOnClick": false,
            "closeOnContentClick": false,
            "transition": props.transition,
            "onAfterLeave": onAfterLeave
          }, props.menuProps), {
            default: () => [_createVNode(VList, {
              "selected": selected.value,
              "selectStrategy": props.multiple ? 'independent' : 'single-independent',
              "onMousedown": e => e.preventDefault()
            }, {
              default: () => [!filteredItems.value.length && !props.hideNoData && ((_slots$noData = (_slots$noData2 = slots['no-data']) == null ? void 0 : _slots$noData2.call(slots)) != null ? _slots$noData : _createVNode(VListItem, {
                "title": t(props.noDataText)
              }, null)), filteredItems.value.map((_ref2, index) => {
                var _slots$item, _slots$item2;

                let {
                  item,
                  matches
                } = _ref2;
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
                  prepend: _ref3 => {
                    let {
                      isSelected
                    } = _ref3;
                    return props.multiple ? _createVNode(VCheckboxBtn, {
                      "modelValue": isSelected,
                      "ripple": false
                    }, null) : undefined;
                  },
                  title: () => {
                    var _search$value$length, _search$value;

                    return isPristine.value ? item.title : highlightResult(item.title, matches.title, (_search$value$length = (_search$value = search.value) == null ? void 0 : _search$value.length) != null ? _search$value$length : 0);
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
              "class": ['v-combobox__selection', index === selectionIndex.value && ['v-combobox__selection--selected', textColorClasses.value]],
              "style": index === selectionIndex.value ? textColorStyles.value : {}
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
              "class": "v-combobox__selection-text"
            }, [item.title, props.multiple && index < selections.value.length - 1 && _createVNode("span", {
              "class": "v-combobox__selection-comma"
            }, [_createTextVNode(",")])])]);
          })]);
        }
      });
    });
    return useForwardRef({
      isFocused,
      isPristine,
      menu,
      search,
      selectionIndex,
      filteredItems,
      select
    }, vTextFieldRef);
  }

});
//# sourceMappingURL=VCombobox.mjs.map