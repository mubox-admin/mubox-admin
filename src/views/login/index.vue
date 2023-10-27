<script setup lang="ts">
import { LockOutlined, UserOutlined } from "@ant-design/icons-vue";
import ImageVerify from "./components/ImageVerify.vue";
import type { Rule } from "ant-design-vue/es/form";
import { useUserStore } from "@/store/user";

// 滑动动画
const slide = ref(false);

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
        return new Promise<void>((resolve, reject) => {
          if (value === "") {
            reject("请输入密码");
          } else if (!REGEXP_PWD.test(value)) {
            reject("密码格式应为8-18位数字、字母、符号的任意两种组合");
          } else resolve();
        });
      },
      trigger: "blur",
    },
  ],
  verifyCode: [
    {
      validator: (_, value) => {
        return new Promise<void>((resolve, reject) => {
          if (value === "") {
            reject("请输入验证码");
          } else if (imageCode.value !== value) {
            reject("请输入正确的验证码");
          } else resolve();
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
  <div class="login-body flex-box">
    <div class="login-body__box">
      <div class="signup" :class="{ slide }">
        <a-typography-title class="form-title" @click="slide = false">
          <span>or</span>
          Sign up
        </a-typography-title>
      </div>
      <div class="login" :class="{ slide: !slide }">
        <div class="login-box">
          <a-typography-title class="form-title" @click="slide = true">
            <span>or</span>
            Log in
          </a-typography-title>
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
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@mixin or {
  color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}
@mixin slide-title {
  font-size: 1em;
  cursor: pointer;
}
@mixin slide-or {
  margin-right: 5px;
  opacity: 1;
  visibility: visible;
  transition: all 0.3s ease;
}

.login-body {
  position: relative;
  min-height: 100vh;
  background-color: #e1e8ee;

  .login-body__box {
    background-color: #222;
    border-radius: 15px;
    height: 550px;
    width: 500px;
    position: relative;
    overflow: hidden;
    &::after {
      content: "";
      opacity: 0.8;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-repeat: no-repeat;
      background-position: left bottom;
      background-size: 500px;
      background-image: url("https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=bf884ad570b50659c5fa2dc2cfb20ecf&auto=format&fit=crop&w=1000&q=100");
    }
    .signup {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 65%;
      z-index: 5;
      transition: all 0.3s ease;

      .form-title {
        color: #fff;
        font-size: 1.7em;
        text-align: center;

        span {
          @include or;
        }
      }

      &.slide {
        top: 5%;
        transform: translate(-50%, 0%);
      }

      &.slide .form-title {
        @include slide-title;
      }

      &.slide .form-title span {
        @include slide-or;
      }
    }

    .login {
      position: absolute;
      top: 20%;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #fff;
      z-index: 5;
      transition: all 0.3s ease;

      &::before {
        content: "";
        position: absolute;
        left: 50%;
        top: -20px;
        transform: translate(-50%, 0);
        background-color: #fff;
        width: 200%;
        height: 250px;
        border-radius: 50%;
        z-index: 4;
        transition: all 0.3s ease;
      }

      .login-box {
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 65%;
        z-index: 5;
        transition: all 0.3s ease;

        .form-title {
          color: #000;
          font-size: 1.7em;
          text-align: center;
          margin-bottom: 3rem;

          span {
            @include or;
          }
        }
      }

      &.slide {
        top: 90%;
        transition: all 0.3s ease;
      }

      &.slide .login-box {
        top: 10%;
        transform: translate(-50%, 0%);
      }

      &.slide .form-title {
        @include slide-title;
        margin-bottom: 5rem;
        padding: 0;
        transition: all 0.3s ease;
      }

      &.slide .form-title span {
        @include slide-or;
      }
    }
  }
}
</style>
