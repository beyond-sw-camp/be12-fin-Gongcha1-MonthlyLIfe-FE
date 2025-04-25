<script setup>

import {ref} from "vue";
import {useUserStore} from "../../store/useUserStore.js";
import router from "../../router/index.js";

const id = ref('');
const password = ref('');
const loginFailed = ref(false);

const userStore = useUserStore();

const login = async () => {
  const success = await userStore.postLogin(
      {
        "id": id.value,
        "password": password.value
      }
  );
  console.log(success);
  if(success) {
    // router.go(-1);
  }
  else {
    loginFailed.value=true;
  }
}

</script>

<template>
  <div class="container">

    <div class="mb-5">
      <p class="fs-1 fw-bold">로그인</p>
      <div class="d-flex justify-content-center">
        <div class="bg-primary mb-2" style="width: 80px; height: 5px;"> </div>
      </div>
      <p class="fs-6 text-primary">로그인 후, 이용이 가능합니다.</p>
    </div>

    <div class="d-flex justify-content-center" >
      <div style="width: 20em">
        <p class="fs-5">MonthlyLife</p>
        <input type="text" class="form-control mb-1" v-model="id" placeholder="아이디">

        <input type="password" class="form-control mb-1" v-model="password" placeholder="비밀번호">

        <button class="btn btn-dark w-100" @click="login">로그인</button>

        <div v-if="loginFailed">
          <p class="m-0 text-danger">아이디 또는 비밀번호가 일치하지 않습니다.</p>
        </div>


        <div class="d-flex align-items-center">
          <input type="checkbox">

          <p class="m-0">아이디 저장</p>

          <div class="bg-black m-2" style="height: 1em; width: 1px">      </div>

          <p class="m-0">아이디/비밀번호 찾기</p>
        </div>
      </div>

      <div class="bg-black m-3" style="height: 200px; width: 1px">      </div>

      <div style="width: 20em">
        <p class="fs-5">Social Login</p>

        <div class="d-flex justify-content-center mt-4 mb-4">
          <div class="m-3">Naver</div>
          <div class="m-3">Kakao</div>
          <div class="m-3">Google</div>
        </div>

        <div class="d-flex justify-content-start">
          <router-link to="/auth/signup/identify" class="text-decoration-none text-black">
            <p class="fs-6">회원가입</p>

          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>