// Utilities
import { computed, inject, provide, reactive, ref, watch, watchEffect } from 'vue';
import { colorToInt, colorToRGB, createRange, darken, getCurrentInstance, getLuma, IN_BROWSER, intToHex, lighten, mergeDeep, propsFactory } from "../util/index.mjs";
import { APCAcontrast } from "../util/color/APCA.mjs"; // Types

export const ThemeSymbol = Symbol.for('vuetify:theme');
export const makeThemeProps = propsFactory({
  theme: String
}, 'theme');
const defaultThemeOptions = {
  defaultTheme: 'light',
  variations: {
    colors: [],
    lighten: 0,
    darken: 0
  },
  themes: {
    light: {
      dark: false,
      colors: {
        background: '#FFFFFF',
        surface: '#FFFFFF',
        'surface-variant': '#424242',
        'on-surface-variant': '#EEEEEE',
        primary: '#6200EE',
        'primary-darken-1': '#3700B3',
        secondary: '#03DAC6',
        'secondary-darken-1': '#018786',
        error: '#B00020',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00'
      },
      variables: {
        'border-color': '#000000',
        'border-opacity': 0.12,
        'high-emphasis-opacity': 0.87,
        'medium-emphasis-opacity': 0.60,
        'disabled-opacity': 0.38,
        'idle-opacity': 0.04,
        'hover-opacity': 0.04,
        'focus-opacity': 0.12,
        'selected-opacity': 0.08,
        'activated-opacity': 0.12,
        'pressed-opacity': 0.12,
        'dragged-opacity': 0.08,
        'kbd-background-color': '#212529',
        'kbd-color': '#FFFFFF',
        'code-background-color': '#C2C2C2'
      }
    },
    dark: {
      dark: true,
      colors: {
        background: '#121212',
        surface: '#212121',
        'surface-variant': '#BDBDBD',
        'on-surface-variant': '#424242',
        primary: '#BB86FC',
        'primary-darken-1': '#3700B3',
        secondary: '#03DAC5',
        'secondary-darken-1': '#03DAC5',
        error: '#CF6679',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00'
      },
      variables: {
        'border-color': '#FFFFFF',
        'border-opacity': 0.12,
        'high-emphasis-opacity': 0.87,
        'medium-emphasis-opacity': 0.60,
        'disabled-opacity': 0.38,
        'idle-opacity': 0.10,
        'hover-opacity': 0.04,
        'focus-opacity': 0.12,
        'selected-opacity': 0.08,
        'activated-opacity': 0.12,
        'pressed-opacity': 0.16,
        'dragged-opacity': 0.08,
        'kbd-background-color': '#212529',
        'kbd-color': '#FFFFFF',
        'code-background-color': '#B7B7B7'
      }
    }
  }
};

function parseThemeOptions() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultThemeOptions;
  if (!options) return { ...defaultThemeOptions,
    isDisabled: true
  };
  const themes = {};

  for (const [key, theme] of Object.entries((_options$themes = options.themes) != null ? _options$themes : {})) {
    var _options$themes, _defaultThemeOptions$, _defaultThemeOptions$2;

    const defaultTheme = theme.dark ? (_defaultThemeOptions$ = defaultThemeOptions.themes) == null ? void 0 : _defaultThemeOptions$.dark : (_defaultThemeOptions$2 = defaultThemeOptions.themes) == null ? void 0 : _defaultThemeOptions$2.light;
    themes[key] = mergeDeep(defaultTheme, theme);
  }

  return mergeDeep(defaultThemeOptions, { ...options,
    themes
  });
} // Composables


export function createTheme(app, options) {
  const head = app._context.provides.usehead;
  const parsedOptions = reactive(parseThemeOptions(options));
  const name = ref(parsedOptions.defaultTheme);
  const themes = ref(parsedOptions.themes);
  const computedThemes = computed(() => {
    const acc = {};

    for (const [name, original] of Object.entries(themes.value)) {
      const theme = acc[name] = { ...original,
        colors: { ...original.colors
        }
      };

      if (parsedOptions.variations) {
        for (const name of parsedOptions.variations.colors) {
          const color = theme.colors[name];

          for (const variation of ['lighten', 'darken']) {
            const fn = variation === 'lighten' ? lighten : darken;

            for (const amount of createRange(parsedOptions.variations[variation], 1)) {
              theme.colors[`${name}-${variation}-${amount}`] = intToHex(fn(colorToInt(color), amount));
            }
          }
        }
      }

      for (const color of Object.keys(theme.colors)) {
        if (/on-[a-z]/.test(color) || theme.colors[`on-${color}`]) continue;
        const onColor = `on-${color}`;
        const colorVal = colorToInt(theme.colors[color]);
        const blackContrast = Math.abs(APCAcontrast(0, colorVal));
        const whiteContrast = Math.abs(APCAcontrast(0xffffff, colorVal)); // TODO: warn about poor color selections
        // const contrastAsText = Math.abs(APCAcontrast(colorVal, colorToInt(theme.colors.background)))
        // const minContrast = Math.max(blackContrast, whiteContrast)
        // if (minContrast < 60) {
        //   consoleInfo(`${key} theme color ${color} has poor contrast (${minContrast.toFixed()}%)`)
        // } else if (contrastAsText < 60 && !['background', 'surface'].includes(color)) {
        //   consoleInfo(`${key} theme color ${color} has poor contrast as text (${contrastAsText.toFixed()}%)`)
        // }
        // Prefer white text if both have an acceptable contrast ratio

        theme.colors[onColor] = whiteContrast > Math.min(blackContrast, 50) ? '#fff' : '#000';
      }
    }

    return acc;
  });
  const current = computed(() => computedThemes.value[name.value]);
  const styles = computed(() => {
    const lines = [];

    if (current.value.dark) {
      createCssClass(lines, ':root', ['color-scheme: dark']);
    }

    for (const [themeName, theme] of Object.entries(computedThemes.value)) {
      const {
        variables,
        dark
      } = theme;
      createCssClass(lines, `.v-theme--${themeName}`, [`color-scheme: ${dark ? 'dark' : 'normal'}`, ...genCssVariables(theme), ...Object.keys(variables).map(key => {
        const value = variables[key];
        const color = typeof value === 'string' && value.startsWith('#') ? colorToRGB(value) : undefined;
        const rgb = color ? `${color.r}, ${color.g}, ${color.b}` : undefined;
        return `--v-${key}: ${rgb != null ? rgb : value}`;
      })]);
    }

    const colors = new Set(Object.values(computedThemes.value).flatMap(theme => Object.keys(theme.colors)));

    for (const key of colors) {
      if (/on-[a-z]/.test(key)) {
        createCssClass(lines, `.${key}`, [`color: rgb(var(--v-theme-${key})) !important`]);
      } else {
        createCssClass(lines, `.bg-${key}`, [`--v-theme-overlay-multiplier: var(--v-theme-${key}-overlay-multiplier)`, `background: rgb(var(--v-theme-${key})) !important`, `color: rgb(var(--v-theme-on-${key})) !important`]);
        createCssClass(lines, `.text-${key}`, [`color: rgb(var(--v-theme-${key})) !important`]);
        createCssClass(lines, `.border-${key}`, [`--v-border-color: var(--v-theme-${key})`]);
      }
    }

    return lines.map((str, i) => i === 0 ? str : `    ${str}`).join('');
  });

  if (head) {
    head.addHeadObjs(computed(() => ({
      style: [{
        children: styles.value,
        type: 'text/css',
        id: 'vuetify-theme-stylesheet'
      }]
    })));

    if (IN_BROWSER) {
      watchEffect(() => head.updateDOM());
    }
  } else {
    let styleEl = IN_BROWSER ? document.getElementById('vuetify-theme-stylesheet') : null;
    watch(styles, updateStyles, {
      immediate: true
    });

    function updateStyles() {
      if (parsedOptions.isDisabled) return;

      if (typeof document !== 'undefined' && !styleEl) {
        const el = document.createElement('style');
        el.type = 'text/css';
        el.id = 'vuetify-theme-stylesheet';
        styleEl = el;
        document.head.appendChild(styleEl);
      }

      if (styleEl) styleEl.innerHTML = styles.value;
    }
  }

  const themeClasses = computed(() => parsedOptions.isDisabled ? undefined : `v-theme--${name.value}`);
  return {
    isDisabled: parsedOptions.isDisabled,
    name,
    themes,
    current,
    computedThemes,
    themeClasses,
    styles,
    global: {
      name,
      current
    }
  };
}
export function provideTheme(props) {
  getCurrentInstance('provideTheme');
  const theme = inject(ThemeSymbol, null);
  if (!theme) throw new Error('Could not find Vuetify theme injection');
  const name = computed(() => {
    var _props$theme;

    return (_props$theme = props.theme) != null ? _props$theme : theme == null ? void 0 : theme.name.value;
  });
  const themeClasses = computed(() => theme.isDisabled ? undefined : `v-theme--${name.value}`);
  const newTheme = { ...theme,
    name,
    themeClasses
  };
  provide(ThemeSymbol, newTheme);
  return newTheme;
}
export function useTheme() {
  getCurrentInstance('useTheme');
  const theme = inject(ThemeSymbol, null);
  if (!theme) throw new Error('Could not find Vuetify theme injection');
  return theme;
}

function createCssClass(lines, selector, content) {
  lines.push(`${selector} {\n`, ...content.map(line => `  ${line};\n`), '}\n');
}

function genCssVariables(theme) {
  const lightOverlay = theme.dark ? 2 : 1;
  const darkOverlay = theme.dark ? 1 : 2;
  const variables = [];

  for (const [key, value] of Object.entries(theme.colors)) {
    const rgb = colorToRGB(value);
    variables.push(`--v-theme-${key}: ${rgb.r},${rgb.g},${rgb.b}`);

    if (!key.startsWith('on-')) {
      variables.push(`--v-theme-${key}-overlay-multiplier: ${getLuma(value) > 0.18 ? lightOverlay : darkOverlay}`);
    }
  }

  return variables;
}
//# sourceMappingURL=theme.mjs.map