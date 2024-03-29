/* eslint-disable max-statements */
// Composables
import { makeElevationProps } from "../../composables/elevation.mjs";
import { makeRoundedProps } from "../../composables/rounded.mjs";
import { useRtl } from "../../composables/rtl.mjs"; // Utilities

import { clamp, createRange, propsFactory } from "../../util/index.mjs";
import { computed, provide, ref, toRef } from 'vue'; // Types

export const VSliderSymbol = Symbol.for('vuetify:v-slider');
export function getOffset(e, el, direction) {
  const vertical = direction === 'vertical';
  const rect = el.getBoundingClientRect();
  const touch = 'touches' in e ? e.touches[0] : e;
  return vertical ? touch.clientY - (rect.top + rect.height / 2) : touch.clientX - (rect.left + rect.width / 2);
}

function getPosition(e, position) {
  if ('touches' in e && e.touches.length) return e.touches[0][position];else if ('changedTouches' in e && e.changedTouches.length) return e.changedTouches[0][position];else return e[position];
}

export const makeSliderProps = propsFactory({
  disabled: Boolean,
  error: Boolean,
  readonly: Boolean,
  max: {
    type: [Number, String],
    default: 100
  },
  min: {
    type: [Number, String],
    default: 0
  },
  step: {
    type: [Number, String],
    default: 0
  },
  thumbColor: String,
  thumbLabel: {
    type: [Boolean, String],
    default: undefined,
    validator: v => typeof v === 'boolean' || v === 'always'
  },
  thumbSize: {
    type: [Number, String],
    default: 20
  },
  showTicks: {
    type: [Boolean, String],
    default: false,
    validator: v => typeof v === 'boolean' || v === 'always'
  },
  ticks: {
    type: [Array, Object]
  },
  tickSize: {
    type: [Number, String],
    default: 2
  },
  color: String,
  trackColor: String,
  trackFillColor: String,
  trackSize: {
    type: [Number, String],
    default: 4
  },
  direction: {
    type: String,
    default: 'horizontal',
    validator: v => ['vertical', 'horizontal'].includes(v)
  },
  reverse: Boolean,
  ...makeRoundedProps(),
  ...makeElevationProps({
    elevation: 2
  })
}, 'slider');
export const useSlider = _ref => {
  let {
    props,
    handleSliderMouseUp,
    handleMouseMove,
    getActiveThumb
  } = _ref;
  const {
    isRtl
  } = useRtl();
  const isReversed = computed(() => isRtl.value !== props.reverse);
  const horizontalDirection = computed(() => {
    let hd = isRtl.value ? 'rtl' : 'ltr';

    if (props.reverse) {
      hd = hd === 'rtl' ? 'ltr' : 'rtl';
    }

    return hd;
  });
  const min = computed(() => parseFloat(props.min));
  const max = computed(() => parseFloat(props.max));
  const step = computed(() => props.step > 0 ? parseFloat(props.step) : 0);
  const decimals = computed(() => {
    const trimmedStep = step.value.toString().trim();
    return trimmedStep.includes('.') ? trimmedStep.length - trimmedStep.indexOf('.') - 1 : 0;
  });
  const thumbSize = computed(() => parseInt(props.thumbSize, 10));
  const tickSize = computed(() => parseInt(props.tickSize, 10));
  const trackSize = computed(() => parseInt(props.trackSize, 10));
  const numTicks = computed(() => (max.value - min.value) / step.value);
  const disabled = toRef(props, 'disabled');
  const vertical = computed(() => props.direction === 'vertical');
  const thumbColor = computed(() => {
    var _props$thumbColor;

    return props.error || props.disabled ? undefined : (_props$thumbColor = props.thumbColor) != null ? _props$thumbColor : props.color;
  });
  const trackColor = computed(() => {
    var _props$trackColor;

    return props.error || props.disabled ? undefined : (_props$trackColor = props.trackColor) != null ? _props$trackColor : props.color;
  });
  const trackFillColor = computed(() => {
    var _props$trackFillColor;

    return props.error || props.disabled ? undefined : (_props$trackFillColor = props.trackFillColor) != null ? _props$trackFillColor : props.color;
  });
  const mousePressed = ref(false);
  const startOffset = ref(0);
  const trackContainerRef = ref();
  const activeThumbRef = ref();

  function roundValue(value) {
    if (step.value <= 0) return value;
    const clamped = clamp(value, min.value, max.value);
    const offset = min.value % step.value;
    const newValue = Math.round((clamped - offset) / step.value) * step.value + offset;
    return parseFloat(Math.min(newValue, max.value).toFixed(decimals.value));
  }

  function parseMouseMove(e) {
    var _trackContainerRef$va;

    const vertical = props.direction === 'vertical';
    const start = vertical ? 'top' : 'left';
    const length = vertical ? 'height' : 'width';
    const position = vertical ? 'clientY' : 'clientX';
    const {
      [start]: trackStart,
      [length]: trackLength
    } = (_trackContainerRef$va = trackContainerRef.value) == null ? void 0 : _trackContainerRef$va.$el.getBoundingClientRect();
    const clickOffset = getPosition(e, position); // It is possible for left to be NaN, force to number

    let clickPos = Math.min(Math.max((clickOffset - trackStart - startOffset.value) / trackLength, 0), 1) || 0;
    if (vertical || isReversed.value) clickPos = 1 - clickPos;
    return roundValue(min.value + clickPos * (max.value - min.value));
  }

  let thumbMoved = false;

  const handleStop = e => {
    if (!thumbMoved) {
      startOffset.value = 0;
      handleSliderMouseUp(parseMouseMove(e));
    }

    mousePressed.value = false;
    thumbMoved = false;
    startOffset.value = 0;
  };

  const handleStart = e => {
    activeThumbRef.value = getActiveThumb(e);
    if (!activeThumbRef.value) return;
    activeThumbRef.value.focus();
    mousePressed.value = true;

    if (activeThumbRef.value.contains(e.target)) {
      thumbMoved = true;
      startOffset.value = getOffset(e, activeThumbRef.value, props.direction);
    } else {
      startOffset.value = 0;
      handleMouseMove(parseMouseMove(e));
    }
  };

  const moveListenerOptions = {
    passive: true,
    capture: true
  };

  function onMouseMove(e) {
    thumbMoved = true;
    handleMouseMove(parseMouseMove(e));
  }

  function onSliderMouseUp(e) {
    e.stopPropagation();
    e.preventDefault();
    handleStop(e);
    window.removeEventListener('mousemove', onMouseMove, moveListenerOptions);
    window.removeEventListener('mouseup', onSliderMouseUp);
  }

  function onSliderTouchend(e) {
    e.stopPropagation();
    e.preventDefault();
    handleStop(e);
    window.removeEventListener('touchmove', onMouseMove, moveListenerOptions);
    window.removeEventListener('touchend', onSliderTouchend);
  }

  function onSliderTouchstart(e) {
    handleStart(e);
    window.addEventListener('touchmove', onMouseMove, moveListenerOptions);
    window.addEventListener('touchend', onSliderTouchend, {
      passive: false
    });
  }

  function onSliderMousedown(e) {
    e.preventDefault();
    handleStart(e);
    window.addEventListener('mousemove', onMouseMove, moveListenerOptions);
    window.addEventListener('mouseup', onSliderMouseUp, {
      passive: false
    });
  }

  const position = val => {
    const percentage = (val - min.value) / (max.value - min.value) * 100;
    return clamp(isNaN(percentage) ? 0 : percentage, 0, 100);
  };

  const parsedTicks = computed(() => {
    if (!props.ticks) {
      return numTicks.value !== Infinity ? createRange(numTicks.value + 1).map(t => {
        const value = min.value + t * step.value;
        return {
          value,
          position: position(value)
        };
      }) : [];
    }

    if (Array.isArray(props.ticks)) return props.ticks.map(t => ({
      value: t,
      position: position(t),
      label: t.toString()
    }));
    return Object.keys(props.ticks).map(key => ({
      value: parseInt(key, 10),
      position: position(parseInt(key, 10)),
      label: props.ticks[key]
    }));
  });
  const hasLabels = computed(() => parsedTicks.value.some(_ref2 => {
    let {
      label
    } = _ref2;
    return !!label;
  }));
  const data = {
    activeThumbRef,
    color: toRef(props, 'color'),
    decimals,
    disabled,
    direction: toRef(props, 'direction'),
    elevation: toRef(props, 'elevation'),
    hasLabels,
    horizontalDirection,
    isReversed,
    min,
    max,
    mousePressed,
    numTicks,
    onSliderMousedown,
    onSliderTouchstart,
    parsedTicks,
    parseMouseMove,
    position,
    readonly: toRef(props, 'readonly'),
    rounded: toRef(props, 'rounded'),
    roundValue,
    showTicks: toRef(props, 'showTicks'),
    startOffset,
    step,
    thumbSize,
    thumbColor,
    thumbLabel: toRef(props, 'thumbLabel'),
    ticks: toRef(props, 'ticks'),
    tickSize,
    trackColor,
    trackContainerRef,
    trackFillColor,
    trackSize,
    vertical
  };
  provide(VSliderSymbol, data);
  return data;
};
//# sourceMappingURL=slider.mjs.map