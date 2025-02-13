<script setup lang="ts">
import type { Recordable } from '@mubox/types';

import { useMuboxForm, z } from '@mubox-core/form-ui';
import { MuboxAvatar, MuboxButton } from '@mubox-core/mubox-ui';
import { useMuboxModal } from '@mubox-core/popup-ui';
import { $t } from '@mubox/locales';
import { computed, reactive } from 'vue';

interface Props {
  avatar?: string;
  text?: string;
}

defineOptions({
  name: 'LockScreenModal',
});

withDefaults(defineProps<Props>(), {
  avatar: '',
  text: '',
});

const emit = defineEmits<{
  submit: [Recordable<any>];
}>();

const [Form, { resetForm, validate, getValues }] = useMuboxForm(
  reactive({
    commonConfig: {
      hideLabel: true,
      hideRequiredMark: true,
    },
    schema: computed(() => [
      {
        component: 'MuboxInputPassword' as const,
        componentProps: {
          placeholder: $t('ui.widgets.lockScreen.placeholder'),
        },
        fieldName: 'lockScreenPassword',
        formFieldProps: { validateOnBlur: false },
        label: $t('authentication.password'),
        rules: z
          .string()
          .min(1, { message: $t('ui.widgets.lockScreen.placeholder') }),
      },
    ]),
    showDefaultActions: false,
  }),
);

const [Modal] = useMuboxModal({
  onConfirm() {
    handleSubmit();
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      resetForm();
    }
  },
});

async function handleSubmit() {
  const { valid } = await validate();
  const values = await getValues();
  if (valid) {
    emit('submit', values?.lockScreenPassword);
  }
}
</script>

<template>
  <Modal
    :footer="false"
    :fullscreen-button="false"
    :title="$t('ui.widgets.lockScreen.title')"
  >
    <div
      class="mb-10 flex w-full flex-col items-center px-10"
      @keydown.enter.prevent="handleSubmit"
    >
      <div class="w-full">
        <div class="ml-2 flex w-full flex-col items-center">
          <MuboxAvatar
            :src="avatar"
            class="size-20"
            dot-class="bottom-0 right-1 border-2 size-4 bg-green-500"
          />
          <div class="text-foreground my-6 flex items-center font-medium">
            {{ text }}
          </div>
        </div>
        <Form />
        <MuboxButton class="mt-1 w-full" @click="handleSubmit">
          {{ $t('ui.widgets.lockScreen.screenButton') }}
        </MuboxButton>
      </div>
    </div>
  </Modal>
</template>
