import type {
  BaseFormComponentType,
  ExtendedFormApi,
  MuboxFormProps,
} from './types';

import { useStore } from '@mubox-core/shared/store';
import { defineComponent, h, isReactive, onBeforeUnmount, watch } from 'vue';

import { FormApi } from './form-api';
import MuboxUseForm from './mubox-use-form.vue';

export function useMuboxForm<
  T extends BaseFormComponentType = BaseFormComponentType,
>(options: MuboxFormProps<T>) {
  const IS_REACTIVE = isReactive(options);
  const api = new FormApi(options);
  const extendedApi: ExtendedFormApi = api as never;
  extendedApi.useStore = (selector) => {
    return useStore(api.store, selector);
  };

  const Form = defineComponent(
    (props: MuboxFormProps, { attrs, slots }) => {
      onBeforeUnmount(() => {
        api.unmount();
      });
      api.setState({ ...props, ...attrs });
      return () =>
        h(MuboxUseForm, { ...props, ...attrs, formApi: extendedApi }, slots);
    },
    {
      inheritAttrs: false,
      name: 'MuboxUseForm',
    },
  );
  // Add reactivity support
  if (IS_REACTIVE) {
    watch(
      () => options.schema,
      () => {
        api.setState({ schema: options.schema });
      },
      { immediate: true },
    );
  }

  return [Form, extendedApi] as const;
}
