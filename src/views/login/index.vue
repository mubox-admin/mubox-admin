<script setup lang="ts">
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import type { FormRules } from "naive-ui";
import { useMessage } from "naive-ui";
import { LockClosed, Person } from "@vicons/ionicons5";
import ImageVerify from "./components/ImageVerify.vue";
import { useUserStore } from "@/store/user";
import { getTopMenu, initRouter } from "@/router/utils";

const { t } = useI18n();
const message = useMessage();

const imageCode = ref("");
const loginForm = ref({
  username: "",
  password: "",
  verifyCode: "",
});

const { loginByUsername } = useUserStore();

/** 密码正则（密码格式应为8-18位数字、字母、符号的任意两种组合） */
const REGEXP_PWD
  = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/;
// 登陆规则
const loginRules: FormRules = {
  username: [
    {
      required: true,
      message: t("sys.tips.inputUsername"),
      trigger: "blur",
    },
  ],
  password: [
    {
      validator: (_, value) => {
        return new Promise<void>((resolve, reject) => {
          if (value === "")
            reject(t("sys.tips.inputPassword"));
          else if (!REGEXP_PWD.test(value))
            reject(t("sys.tips.passwordError"));
          else resolve();
        });
      },
      trigger: "blur",
    },
  ],
  verifyCode: [
    {
      validator: (_, value) => {
        return new Promise<void>((resolve, reject) => {
          if (value === "")
            reject(t("sys.tips.inputVerificationCode"));
          else if (imageCode.value !== value)
            reject(t("sys.tips.verificationCodeError"));
          else resolve();
        });
      },
      trigger: "blur",
    },
  ],
};
// 登陆
const formRef = ref();
const loading = ref(false);
const router = useRouter();
async function login() {
  formRef.value.validate((error) => {
    if (error)
      return;
    loading.value = true;
    loginByUsername(loginForm.value.username, loginForm.value.password)
      .then(() => {
        initRouter().then(() => {
          const topMenuPath = getTopMenu(true)?.path;
          if (topMenuPath)
            router.push(topMenuPath);
          message.success(t("sys.tips.loginSuccess"));
        });
      })
      .finally(() => {
        loading.value = false;
      });
  });
}
</script>

<template>
  <n-layout class="flex-box h-100vh" has-sider>
    <n-layout-sider class="bg-black" width="50%">
      123
    </n-layout-sider>
    <n-layout-content>
      <n-flex align="center" class="h-100vh">
        <n-form ref="formRef" class="w-360px m-auto" :model="loginForm" :rules="loginRules">
          <n-form-item path="username">
            <n-input
              v-model:value="loginForm.username"
              :placeholder="$t('sys.base.username')"
              clearable
            >
              <template #prefix>
                <n-icon :component="Person" />
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="password">
            <n-input
              v-model:value="loginForm.password"
              type="password"
              :placeholder="$t('sys.base.password')"
              autocomplete="谷歌限制"
              clearable
            >
              <template #prefix>
                <n-icon :component="LockClosed" />
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="verifyCode">
            <n-input
              v-model:value="loginForm.verifyCode"
              :placeholder="$t('sys.base.verificationCode')"
              clearable
              size="large"
            >
              <template #suffix>
                <ImageVerify v-model:code="imageCode" />
              </template>
            </n-input>
          </n-form-item>
          <n-form-item>
            <n-button class="w-100%" type="primary" :loading="loading" @click="login">
              登陆
            </n-button>
          </n-form-item>
        </n-form>
      </n-flex>
    </n-layout-content>
  </n-layout>
</template>
