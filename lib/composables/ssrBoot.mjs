// Utilities
import { computed, onMounted, readonly, ref } from 'vue'; // Composables

export function useSsrBoot() {
  const isBooted = ref(false);
  onMounted(() => {
    window.requestAnimationFrame(() => {
      isBooted.value = true;
    });
  });
  const ssrBootStyles = computed(() => !isBooted.value ? {
    transition: 'none !important'
  } : undefined);
  return {
    ssrBootStyles,
    isBooted: readonly(isBooted)
  };
}
//# sourceMappingURL=ssrBoot.mjs.map