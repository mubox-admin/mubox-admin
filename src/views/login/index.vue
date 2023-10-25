<script setup lang="ts">
import { LockOutlined, UserOutlined } from "@ant-design/icons-vue";
import ImageVerify from "./components/ImageVerify.vue";
import type { Rule } from "ant-design-vue/es/form";
import { useUserStore } from "@/store/user";

const imageCode = ref("");
const loginForm = ref({
  username: "",
  password: "",
  verifyCode: "",
});

const { loginByUsername } = useUserStore();

/** 密码正则（密码格式应为8-18位数字、字母、符号的任意两种组合） */
const REGEXP_PWD =
  /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/;
// 登陆规则
const loginRules: Record<string, Rule[]> = {
  // TODO 国际化
  username: [
    {
      required: true,
      message: "请输入账号",
      trigger: "blur",
    },
  ],
  password: [
    {
      validator: (_, value) => {
        return new Promise<void>((_, reject) => {
          if (value === "") {
            reject("请输入密码");
          } else if (!REGEXP_PWD.test(value)) {
            reject("密码格式应为8-18位数字、字母、符号的任意两种组合");
          }
        });
      },
      trigger: "blur",
    },
  ],
  verifyCode: [
    {
      validator: (_, value) => {
        return new Promise<void>((_, reject) => {
          if (value === "") {
            reject("请输入验证码");
          } else if (imageCode.value !== value) {
            reject("请输入正确的验证码");
          }
        });
      },
      trigger: "blur",
    },
  ],
};
// 登陆
const loading = ref(false);
function login() {
  loginByUsername(loginForm.value.username, loginForm.value.password);
}
</script>

<template>
  <div class="login-box">
    <a-form layout="vertical" :model="loginForm" :rules="loginRules" @finish="login">
      <a-form-item name="username">
        <a-input v-model:value="loginForm.username" placeholder="账号" clearable>
          <template #prefix>
            <UserOutlined />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item name="password">
        <a-input-password
          v-model:value="loginForm.password"
          placeholder="密码"
          autocomplete="谷歌限制"
          clearable
        >
          <template #prefix>
            <LockOutlined />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item name="verifyCode">
        <a-input v-model:value="loginForm.verifyCode" placeholder="验证码" clearable>
          <template #suffix>
            <ImageVerify v-model:code="imageCode" />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" :loading="loading">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style lang="scss" scoped>
.login-box {
  width: 360px;
}
</style>
