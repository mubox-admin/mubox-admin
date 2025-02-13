<script lang="ts" setup>
import { ErrorMessage } from 'vee-validate';

import { toValue } from 'vue';

import { useFormField } from './useFormField';

const { formMessageId, name } = useFormField();
</script>

<template>
  <ErrorMessage
    :id="formMessageId"
    :name="toValue(name)"
    as="p"
    class="text-destructive text-[0.8rem]"
  />
</template>
