import { withDirectives as _withDirectives, mergeProps as _mergeProps, resolveDirective as _resolveDirective, vModelDynamic as _vModelDynamic, createVNode as _createVNode, Fragment as _Fragment } from "vue";
// Styles
import "./VTextField.css"; // Components

import { filterFieldProps, makeVFieldProps, VField } from "../VField/VField.mjs";
import { filterInputProps, makeVInputProps, VInput } from "../VInput/VInput.mjs";
import { VCounter } from "../VCounter/index.mjs"; // Directives

import Intersect from "../../directives/intersect/index.mjs"; // Composables

import { useForwardRef } from "../../composables/forwardRef.mjs";
import { useProxiedModel } from "../../composables/proxiedModel.mjs"; // Utilities

import { computed, nextTick, ref } from 'vue';
import { filterInputAttrs, genericComponent, useRender } from "../../util/index.mjs"; // Types

const activeTypes = ['color', 'file', 'time', 'date', 'datetime-local', 'week', 'month'];
export const VTextField = genericComponent()({
  name: 'VTextField',
  directives: {
    Intersect
  },
  inheritAttrs: false,
  props: {
    autofocus: Boolean,
    counter: [Boolean, Number, String],
    counterValue: Function,
    hint: String,
    persistentHint: Boolean,
    prefix: String,
    placeholder: String,
    persistentPlaceholder: Boolean,
    persistentCounter: Boolean,
    suffix: String,
    type: {
      type: String,
      default: 'text'
    },
    ...makeVInputProps(),
    ...makeVFieldProps()
  },
  emits: {
    'click:clear': e => true,
    'click:control': e => true,
    'click:input': e => true,
    'update:modelValue': val => true
  },

  setup(props, _ref) {
    let {
      attrs,
      emit,
      slots
    } = _ref;
    const model = useProxiedModel(props, 'modelValue');
    const counterValue = computed(() => {
      var _model$value;

      return typeof props.counterValue === 'function' ? props.counterValue(model.value) : ((_model$value = model.value) != null ? _model$value : '').toString().length;
    });
    const max = computed(() => {
      if (attrs.maxlength) return attrs.maxlength;
      if (!props.counter || typeof props.counter !== 'number' && typeof props.counter !== 'string') return undefined;
      return props.counter;
    });

    function onIntersect(isIntersecting, entries) {
      var _entries$0$target, _entries$0$target$foc;

      if (!props.autofocus || !isIntersecting) return;
      (_entries$0$target = entries[0].target) == null ? void 0 : (_entries$0$target$foc = _entries$0$target.focus) == null ? void 0 : _entries$0$target$foc.call(_entries$0$target);
    }

    const vInputRef = ref();
    const vFieldRef = ref();
    const isFocused = ref(false);
    const inputRef = ref();
    const isActive = computed(() => activeTypes.includes(props.type) || props.persistentPlaceholder || isFocused.value);
    const messages = computed(() => {
      return props.messages.length ? props.messages : isFocused.value || props.persistentHint ? props.hint : '';
    });

    function onFocus() {
      if (inputRef.value !== document.activeElement) {
        var _inputRef$value;

        (_inputRef$value = inputRef.value) == null ? void 0 : _inputRef$value.focus();
      }

      if (!isFocused.value) isFocused.value = true;
    }

    function onControlClick(e) {
      onFocus();
      emit('click:control', e);
    }

    function onClear(e) {
      e.stopPropagation();
      onFocus();
      nextTick(() => {
        model.value = '';
        emit('click:clear', e);
      });
    }

    useRender(() => {
      const hasCounter = !!(slots.counter || props.counter || props.counterValue);
      const [rootAttrs, inputAttrs] = filterInputAttrs(attrs);
      const [{
        modelValue: _,
        ...inputProps
      }] = filterInputProps(props);
      const [fieldProps] = filterFieldProps(props);
      return _createVNode(VInput, _mergeProps({
        "ref": vInputRef,
        "modelValue": model.value,
        "onUpdate:modelValue": $event => model.value = $event,
        "class": ['v-text-field', {
          'v-text-field--prefixed': props.prefix,
          'v-text-field--suffixed': props.suffix,
          'v-text-field--flush-details': ['plain', 'underlined'].includes(props.variant)
        }],
        "onClick:prepend": attrs['onClick:prepend'],
        "onClick:append": attrs['onClick:append']
      }, rootAttrs, inputProps, {
        "messages": messages.value
      }), { ...slots,
        default: _ref2 => {
          let {
            id,
            isDisabled,
            isDirty,
            isReadonly,
            isValid
          } = _ref2;
          return _createVNode(VField, _mergeProps({
            "ref": vFieldRef,
            "onMousedown": e => {
              if (e.target === inputRef.value) return;
              e.preventDefault();
            },
            "onClick:control": onControlClick,
            "onClick:clear": onClear,
            "onClick:prependInner": attrs['onClick:prependInner'],
            "onClick:appendInner": attrs['onClick:appendInner'],
            "role": "textbox"
          }, fieldProps, {
            "id": id.value,
            "active": isActive.value || isDirty.value,
            "dirty": isDirty.value || props.dirty,
            "focused": isFocused.value,
            "error": isValid.value === false
          }), { ...slots,
            default: _ref3 => {
              var _slots$default;

              let {
                props: {
                  class: fieldClass,
                  ...slotProps
                }
              } = _ref3;
              return _createVNode(_Fragment, null, [props.prefix && _createVNode("span", {
                "class": "v-text-field__prefix"
              }, [props.prefix]), _createVNode("div", {
                "class": fieldClass,
                "onClick": e => emit('click:input', e),
                "data-no-activator": ""
              }, [(_slots$default = slots.default) == null ? void 0 : _slots$default.call(slots), _withDirectives(_createVNode("input", _mergeProps({
                "ref": inputRef,
                "onUpdate:modelValue": $event => model.value = $event,
                "autofocus": props.autofocus,
                "readonly": isReadonly.value,
                "disabled": isDisabled.value,
                "name": props.name,
                "placeholder": props.placeholder,
                "size": 1,
                "type": props.type,
                "onFocus": onFocus,
                "onBlur": () => isFocused.value = false
              }, slotProps, inputAttrs), null), [[_vModelDynamic, model.value], [_resolveDirective("intersect"), {
                handler: onIntersect
              }, null, {
                once: true
              }]])]), props.suffix && _createVNode("span", {
                "class": "v-text-field__suffix"
              }, [props.suffix])]);
            }
          });
        },
        details: hasCounter ? () => _createVNode(_Fragment, null, [_createVNode("span", null, null), _createVNode(VCounter, {
          "active": props.persistentCounter || isFocused.value,
          "value": counterValue.value,
          "max": max.value
        }, slots.counter)]) : undefined
      });
    });
    return useForwardRef({}, vInputRef, vFieldRef, inputRef);
  }

});
//# sourceMappingURL=VTextField.mjs.map