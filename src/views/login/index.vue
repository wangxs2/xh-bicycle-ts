<template>
  <div class="viewPage">
    <div class="bg"></div>
    <div class="login-form">
      <div class="form-box">
        <h2>用户登录</h2>
        <div class="login-border"></div>
        <div class="error-message">{{errorMessage}}</div>
        <form autocomplete="on">
          <div class="form-item">
            <div class="inp-icon">
              <img src="~@img/login/icon_user@2x.png">
            </div>
            <input type="text"
                   v-model="userKey"
                   placeholder="用户名">
          </div>
          <div class="form-sub"
               @click="login">登录</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="scss" scoped src="./index.scss"></style>

