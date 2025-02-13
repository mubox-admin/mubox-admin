import type { MuboxFormSchema as FormSchema } from '@mubox/components';

import type { ComponentType } from './components';

import { setupMuboxForm, useMuboxForm as useForm, z } from '@mubox/components';
import { $t } from '@mubox/locales';

setupMuboxForm<ComponentType>({
  config: {
    // naive-ui组件的空值为null,不能是undefined，否则重置表单时不生效
    emptyStateValue: null,
    baseModelPropName: 'value',
    modelPropNameMap: {
      Checkbox: 'checked',
      Radio: 'checked',
      Upload: 'fileList',
    },
  },
  defineRules: {
    required: (value, _params, ctx) => {
      if (value === undefined || value === null || value.length === 0) {
        return $t('ui.formRules.required', [ctx.label]);
      }
      return true;
    },
    selectRequired: (value, _params, ctx) => {
      if (value === undefined || value === null) {
        return $t('ui.formRules.selectRequired', [ctx.label]);
      }
      return true;
    },
  },
});

const useMuboxForm = useForm<ComponentType>;

export { useMuboxForm, z };

export type MuboxFormSchema = FormSchema<ComponentType>;
