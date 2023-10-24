import { ref } from "vue-demi";

export function useRefs() {
  const componentsRefs = ref({});
  const D = (field) => {
    return (el) => {
      componentsRefs.value = {
        ...componentsRefs.value,
        [field]: el,
      };
    };
  };
  return {
    componentsRefs,
    D,
  };
}
