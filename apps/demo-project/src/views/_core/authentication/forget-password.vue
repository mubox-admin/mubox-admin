<script lang="ts" setup>
import type { MuboxFormSchema } from '@mubox/components';
import type { Recordable } from '@mubox/types';

import { z } from '@mubox/components';

import { $t } from '@mubox/locales';
import { AuthenticationForgetPassword } from '@mubox/views';
import { computed, ref } from 'vue';

defineOptions({ name: 'ForgetPassword' });

const loading = ref(false);

const formSchema = computed((): MuboxFormSchema[] => {
  return [
    {
      component: 'MuboxInput',
      componentProps: {
        placeholder: 'example@example.com',
      },
      fieldName: 'email',
      label: $t('authentication.email'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.emailTip') })
        .email($t('authentication.emailValidErrorTip')),
    },
  ];
});

function handleSubmit(value: Recordable<any>) {
  // eslint-disable-next-line no-console
  console.log('reset email:', value);
}
</script>

<template>
  <AuthenticationForgetPassword
    :form-schema="formSchema"
    :loading="loading"
    @submit="handleSubmit"
  />
</template>
