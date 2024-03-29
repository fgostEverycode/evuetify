import "./styles/main.css";
import * as components from "./components/index.mjs";
import * as directives from "./directives/index.mjs";
import { createVuetify as _createVuetify } from "./framework.mjs";
export const createVuetify = function () {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _createVuetify({
    components,
    directives,
    ...options
  });
};
export const version = "3.0.0-beta.5";
export { components, directives };
export * from "./composables/index.mjs";
//# sourceMappingURL=entry-bundler.mjs.map