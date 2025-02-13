import type { ComputedRef } from 'vue';
import type { ZodRawShape } from 'zod';
import type { FormActions, MuboxFormProps } from './types';

import { createContext } from '@mubox-core/shadcn-ui';
import { isString } from '@mubox-core/shared/utils';
import { useForm } from 'vee-validate';
import { computed, unref, useSlots } from 'vue';
import { object } from 'zod';
import { getDefaultsForSchema } from 'zod-defaults';

export const [injectFormProps, provideFormProps]
  = createContext<[ComputedRef<MuboxFormProps> | MuboxFormProps, FormActions]>(
    'MuboxFormProps',
  );

export function useFormInitial(
  props: ComputedRef<MuboxFormProps> | MuboxFormProps,
) {
  const slots = useSlots();
  const initialValues = generateInitialValues();

  const form = useForm({
    ...(Object.keys(initialValues)?.length ? { initialValues } : {}),
  });

  const delegatedSlots = computed(() => {
    const resultSlots: string[] = [];

    for (const key of Object.keys(slots)) {
      if (key !== 'default') {
        resultSlots.push(key);
      }
    }
    return resultSlots;
  });

  function generateInitialValues() {
    const initialValues: Record<string, any> = {};

    const zodObject: ZodRawShape = {};
    (unref(props).schema || []).forEach((item) => {
      if (Reflect.has(item, 'defaultValue')) {
        initialValues[item.fieldName] = item.defaultValue;
      }
      else if (item.rules && !isString(item.rules)) {
        zodObject[item.fieldName] = item.rules;
      }
    });

    const schemaInitialValues = getDefaultsForSchema(object(zodObject));

    return { ...initialValues, ...schemaInitialValues };
  }

  return {
    delegatedSlots,
    form,
  };
}
