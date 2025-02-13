<script lang="ts" setup>
import type { DrawerProps, ExtendedDrawerApi } from './drawer';

import {
  useIsMobile,
  usePriorityValues,
  useSimpleLocale,
} from '@mubox-core/composables';

import { MuboxButton, MuboxHelpTooltip, MuboxIconButton, MuboxLoading } from '@mubox-core/mubox-ui';
import {
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  VisuallyHidden,
} from '@mubox-core/shadcn-ui';
import { ELEMENT_ID_MAIN_CONTENT } from '@mubox-core/shared/constants';
import { globalShareState } from '@mubox-core/shared/global-state';
import { cn } from '@mubox-core/shared/utils';
import { X } from 'lucide-vue-next';
import { computed, provide, ref, useId, watch } from 'vue';

interface Props extends DrawerProps {
  drawerApi?: ExtendedDrawerApi;
}

const props = withDefaults(defineProps<Props>(), {
  appendToMain: false,
  closeIconPlacement: 'right',
  drawerApi: undefined,
  zIndex: 1000,
});

const components = globalShareState.getComponents();

const id = useId();
provide('DISMISSABLE_DRAWER_ID', id);

const wrapperRef = ref<HTMLElement>();
const { $st } = useSimpleLocale();
const { isMobile } = useIsMobile();

const state = props.drawerApi?.useStore?.();

const {
  appendToMain,
  cancelText,
  class: drawerClass,
  closable,
  closeOnClickModal,
  closeOnPressEscape,
  confirmLoading,
  confirmText,
  contentClass,
  description,
  footer: showFooter,
  footerClass,
  header: showHeader,
  headerClass,
  loading: showLoading,
  modal,
  openAutoFocus,
  placement,
  showCancelButton,
  showConfirmButton,
  title,
  titleTooltip,
  zIndex,
} = usePriorityValues(props, state);

watch(
  () => showLoading.value,
  (v) => {
    if (v && wrapperRef.value) {
      wrapperRef.value.scrollTo({
        // behavior: 'smooth',
        top: 0,
      });
    }
  },
);

function interactOutside(e: Event) {
  if (!closeOnClickModal.value) {
    e.preventDefault();
  }
}
function escapeKeyDown(e: KeyboardEvent) {
  if (!closeOnPressEscape.value) {
    e.preventDefault();
  }
}
// pointer-down-outside
function pointerDownOutside(e: Event) {
  const target = e.target as HTMLElement;
  const dismissableDrawer = target?.dataset.dismissableDrawer;
  if (!closeOnClickModal.value || dismissableDrawer !== id) {
    e.preventDefault();
  }
}

function handerOpenAutoFocus(e: Event) {
  if (!openAutoFocus.value) {
    e?.preventDefault();
  }
}

function handleFocusOutside(e: Event) {
  e.preventDefault();
  e.stopPropagation();
}

const getAppendTo = computed(() => {
  return appendToMain.value ? `#${ELEMENT_ID_MAIN_CONTENT}` : undefined;
});
</script>

<template>
  <Sheet
    :modal="false"
    :open="state?.isOpen"
    @update:open="() => drawerApi?.close()"
  >
    <SheetContent
      :append-to="getAppendTo"
      :class="
        cn('flex w-[520px] flex-col', drawerClass, {
          '!w-full': isMobile || placement === 'bottom' || placement === 'top',
          'max-h-[100vh]': placement === 'bottom' || placement === 'top',
        })
      "
      :modal="modal"
      :open="state?.isOpen"
      :side="placement"
      :z-index="zIndex"
      @close-auto-focus="handleFocusOutside"
      @closed="() => drawerApi?.onClosed()"
      @escape-key-down="escapeKeyDown"
      @focus-outside="handleFocusOutside"
      @interact-outside="interactOutside"
      @open-auto-focus="handerOpenAutoFocus"
      @opened="() => drawerApi?.onOpened()"
      @pointer-down-outside="pointerDownOutside"
    >
      <SheetHeader
        v-if="showHeader"
        :class="
          cn(
            '!flex flex-row items-center justify-between border-b px-6 py-5',
            headerClass,
            {
              'px-4 py-3': closable,
              'pl-2': closable && closeIconPlacement === 'left',
            },
          )
        "
      >
        <div class="flex items-center">
          <SheetClose
            v-if="closable && closeIconPlacement === 'left'"
            as-child
            class="data-[state=open]:bg-secondary ml-[2px] cursor-pointer rounded-full opacity-80 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
          >
            <slot name="close-icon">
              <MuboxIconButton>
                <X class="size-4" />
              </MuboxIconButton>
            </slot>
          </SheetClose>
          <Separator
            v-if="closable && closeIconPlacement === 'left'"
            class="ml-1 mr-2 h-8"
            decorative
            orientation="vertical"
          />
          <SheetTitle v-if="title" class="text-left">
            <slot name="title">
              {{ title }}

              <MuboxHelpTooltip v-if="titleTooltip" trigger-class="pb-1">
                {{ titleTooltip }}
              </MuboxHelpTooltip>
            </slot>
          </SheetTitle>
          <SheetDescription v-if="description" class="mt-1 text-xs">
            <slot name="description">
              {{ description }}
            </slot>
          </SheetDescription>
        </div>

        <VisuallyHidden v-if="!title || !description">
          <SheetTitle v-if="!title" />
          <SheetDescription v-if="!description" />
        </VisuallyHidden>

        <div class="flex-center">
          <slot name="extra" />
          <SheetClose
            v-if="closable && closeIconPlacement === 'right'"
            as-child
            class="data-[state=open]:bg-secondary ml-[2px] cursor-pointer rounded-full opacity-80 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
          >
            <slot name="close-icon">
              <MuboxIconButton>
                <X class="size-4" />
              </MuboxIconButton>
            </slot>
          </SheetClose>
        </div>
      </SheetHeader>
      <template v-else>
        <VisuallyHidden>
          <SheetTitle />
          <SheetDescription />
        </VisuallyHidden>
      </template>
      <div
        ref="wrapperRef"
        :class="
          cn('relative flex-1 overflow-y-auto p-3', contentClass, {
            'overflow-hidden': showLoading,
          })
        "
      >
        <MuboxLoading v-if="showLoading" class="size-full" spinning />

        <slot />
      </div>

      <SheetFooter
        v-if="showFooter"
        :class="
          cn(
            'w-full flex-row items-center justify-end border-t p-2 px-3',
            footerClass,
          )
        "
      >
        <slot name="prepend-footer" />
        <slot name="footer">
          <component
            :is="components.DefaultButton || MuboxButton"
            v-if="showCancelButton"
            variant="ghost"
            @click="() => drawerApi?.onCancel()"
          >
            <slot name="cancelText">
              {{ cancelText || $st('cancel') }}
            </slot>
          </component>

          <component
            :is="components.PrimaryButton || MuboxButton"
            v-if="showConfirmButton"
            :loading="confirmLoading"
            @click="() => drawerApi?.onConfirm()"
          >
            <slot name="confirmText">
              {{ confirmText || $st('confirm') }}
            </slot>
          </component>
        </slot>
        <slot name="append-footer" />
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
