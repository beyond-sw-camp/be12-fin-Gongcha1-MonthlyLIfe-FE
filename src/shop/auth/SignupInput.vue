<script setup>

import {computed, ref} from "vue";
import router from "../../router/index.js";
import {useUserStore} from "../../store/useUserStore.js";

const phoneNumber = ref('');
const id = ref('');
const password = ref('');
const name = ref('');

const emailFirst = ref('');
const emailDomain = ref('');
const isCustom = computed(() => emailDomain.value === 'custom')
const customEmail = ref('');
const email = computed(() => {
  if(isCustom) {
    return emailFirst.value + '@' + customEmail.value
  }
  else {
    return emailFirst.value + '@' + emailDomain.value
  }
});

const address1 = ref('');
const address2 = ref('');
const birth = ref('');

const userStore = useUserStore();
const signup = async () => {
  const user = {
    "id": id.value,
    "phoneNumber": phoneNumber.value,
    "password": password.value,
    "name": name.value,
    "email": email.value,
    "address1": address1.value,
    "address2": address2.value,
    "birth": birth.value
  }
  console.log(user);
  const success = await userStore.postSignup(user);
  if(success) {
    router.push('/auth/signup/end')
  }
};


</script>

<template>
  <div class="container" style="max-width: 720px;">
    <div class="d-flex" >
      <p class="fs-2">회원정보입력</p>
    </div>

    <small class="text-start d-block">MonthlyLife 가입을 위해 정보를 입력해 주세요.</small>

    <div class="pt-3 pb-3">
      <small class="text-start d-block">휴대폰번호</small>
<!-- 나중에 휴대폰 인증을 구현하면 disabled를 true로 해야함-->
      <input type="text" class="form-control" v-model="phoneNumber" :disabled="false" placeholder="01012345678">
    </div>

    <div class="pb-3">
      <small class="text-start d-block">이름</small>
      <input type="text" v-model="name" class="underline-input">
    </div>

    <div class="pb-3">
      <small class="text-start d-block">이메일</small>

      <div class="input-group">
        <input type="text" v-model="emailFirst" class="form-control">
        <span class="input-group-text" id="basic-addon2">@</span>
        <select class="form-select" id="dropdown" v-model="emailDomain" @change="handleSelectChange">
          <option selected>옵션을 선택하세요</option>
          <option value="naver.com">naver.com</option>
          <option value="gmail.com">gmail.com</option>
          <option value="custom">직접 입력</option>
        </select>
        <div v-if="isCustom">
          <input type="text" class="form-control" id="customInput" v-model="customEmail" placeholder="입력하세요">
        </div>
      </div>
    </div>

    <div class="pb-3">
      <small class="text-start d-block">생일</small>
      <input type="date" v-model="birth" class="underline-input">
    </div>


    <div class="pb-3">
      <small class="text-start d-block">아이디</small>
      <div class="d-flex">
        <input type="text" v-model="id" class="underline-input">
        <button class="btn btn-dark text-nowrap btn-sm" style="font-size: 10px">중복체크</button>
      </div>
    </div>

    <div class="pb-3 d-flex justify-content-between">
      <small class="text-start d-block">소셜로그인 연동</small>
      <div class="d-flex">
        <div class="p-1">Naver</div>
        <div class="p-1">Kakao</div>
        <div class="p-1">Google</div>

      </div>
    </div>

    <div class="pb-3">
      <small class="text-start d-block">비밀번호</small>
        <input type="password" v-model="password" class="underline-input">
    </div>

    <div class="pb-3">
      <small class="text-start d-block">비밀번호확인</small>
      <input type="password" class="underline-input">
    </div>

    <div class="pb-3">
      <small class="text-start d-block">주소</small>
      <div class="d-flex">
        <input type="text" v-model="address1" class="underline-input">
        <button class="btn btn-dark text-nowrap btn-sm" style="font-size: 10px">검색</button>
      </div>
    </div>
    <div class="pb-3">
      <small class="text-start d-block">상세주소</small>
      <input type="text" v-model="address2" class="underline-input">
    </div>

    <small class="text-start d-block">태그</small>
    <div class="m-3">
      <div class="form-check text-start">
        <input class="form-check-input limit-check" type="checkbox" id="check1">
        <label class="form-check-label" for="check1">1인가구</label>
      </div>
      <div class="form-check text-start">
        <input class="form-check-input limit-check" type="checkbox" id="check2">
        <label class="form-check-label" for="check1">신혼부부</label>
      </div>
      <div class="form-check text-start">
        <input class="form-check-input limit-check" type="checkbox" id="check3">
        <label class="form-check-label" for="check1">1인 사무실</label>
      </div>
    </div>



    <button @click="signup" class="btn btn-primary rounded-pill w-100">다음</button>

  </div>
</template>

<style scoped>
.underline-input {
  border: none;
  border-bottom: 1px solid #000; /* 밑줄 스타일 */
  outline: none; /* 클릭 시 파란 테두리 제거 */
  width: 100%; /* 입력창 너비 조절 */
  padding: 5px 0; /* 위아래 여백 조절 */
  background: transparent; /* 배경 제거 */
  font-size: 16px;
}
</style>