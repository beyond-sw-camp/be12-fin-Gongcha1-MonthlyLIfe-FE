<script setup>

import {computed, ref} from "vue";
import router from "../../router/index.js";
import {useUserStore} from "../../store/useUserStore.js";
import SignupAddressInput from "./component/SignupAddressInput.vue";

const addressInputRef = ref(null)

const phoneNumber = ref('');
const id = ref('');
const password = ref('');
const passwordCheck = ref('');
const name = ref('');

const emailFirst = ref('');
const emailDomain = ref('');
const isCustom = computed(() => emailDomain.value === 'custom')
const customEmail = ref('');
const email = computed(() => {
  if(isCustom.value) {
    return emailFirst.value + '@' + customEmail.value
  }
  else {
    return emailFirst.value + '@' + emailDomain.value
  }
});

const birth = ref('');

const isId = computed(() =>
    id.value !== ''
)
const isIdValid = computed(() =>
  /^[a-zA-Z0-9]{6,20}$/.test(id.value)
)

const isPassword = computed(() =>
    password.value !== ''
)
const isPasswordValid = computed(() =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+{}|:;<>,.?/~`]{8,20}$/.test(password.value)
)
const isPasswordChecked = computed(() =>
  passwordCheck.value !== ''
)
const isPasswordMatch = computed(() => {
  return password.value !== '' && passwordCheck.value === password.value
}
)
const idChecked = ref(false);
const userStore = useUserStore();

const telecomCompany = ref('SKT');
const phoneNumberInput = () => {
  phoneNumber.value = phoneNumber.value.replace(/[^0-9]/g, '');
  phoneNumber.value = phoneNumber.value.substr(0, 11);
}
const nameInput = () => {
  name.value = name.value.replace(/[^가-힣]/g, '');
}

const checkId = async () => {
  if(isIdValid.value) {
    const ret = await userStore.postCheckId(id.value);
    if(ret) {
      idChecked.value = true;
    }
    else {
      alert('존재하는 id 입니다.')
    }
  }
}

const checkPhone = async () => {
  console.log(phoneNumber.value.length)
  if(phoneNumber.value.length > 9) {
    console.log('hi')
    const phone = {
      telecomCompany: telecomCompany.value,
      phoneNumber: phoneNumber.value
    }
    await userStore.postCheckPhoneNumber(phone);
  }
  else {

  }
}

const signup = async () => {
  if(
      idChecked.value &&
      name.value !== '' &&
      phoneNumber.value !== '' &&
      email.value !== '' &&
      isPasswordValid.value &&
      isPasswordMatch.value
  ) {
    const { postalCode, address1, address2 } = addressInputRef.value;
    const user = {
      "id": id.value,
      "phoneNumber": phoneNumber.value,
      "password": password.value,
      "name": name.value,
      "email": email.value,
      "postalCode": postalCode,
      "address1": address1,
      "address2": address2,
      "birth": birth.value
    }
    console.log(user);
    const success = await userStore.postSignup(user);
    if(success) {
      router.push('/auth/signup/end')
    }
  }
  else {
    alert('아이디, 이름, 이메일, 비밀번호, 휴대폰 번호는 필수입력입니다.')
    window.scroll({ top: 0, behavior: 'smooth' })
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
      <small class="text-start d-block" >휴대폰번호</small>
<!-- 나중에 휴대폰 인증을 구현하면 disabled를 true로 해야함-->
      <div class="d-flex input-group">
          <select class="input-group-text no-arrow ps-1 pe-2" v-model="telecomCompany">
            <option value="SKT">SKT</option>
            <option value="KT">KT</option>
            <option value="LG">LG</option>
          </select>
        <input type="text" class="form-control" v-model="phoneNumber"  @input="phoneNumberInput" :disabled="false" placeholder="01012345678">
      </div>
      </div>

    <div class="pb-3">
      <small class="text-start d-block">이름</small>
      <input type="text" v-model="name" @input="nameInput" class="underline-input">
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


    <div class="pb-3 text-start" >
      <small class="text-start d-block">아이디</small>
      <div class="d-flex">
        <input type="text" v-model="id" class="underline-input" :disabled="idChecked">
        <button class="btn btn-dark text-nowrap btn-sm" @click="checkId" style="font-size: 10px">중복체크</button>
      </div>
      <small v-if="isId && !isIdValid " class="m-0  text-danger">6~20자 사이의 영문, 숫자</small>
      <small v-if="idChecked" class="m-0 text-primary">사용 가능한 id입니다.</small>
      <small v-else class="m-0 text-white">공백</small>

    </div>

    <div class="pb-3">
      <small class="text-start d-block">비밀번호</small>
      <input type="password" v-model="password" class="underline-input">
      <small v-if="isPassword && !isPasswordValid " class="m-0 text-start text-danger">8~20자 사이의 영문, 숫자 1개이상</small>
      <small v-else class="m-0 text-start text-white">공백</small>
    </div>

    <div class="pb-3">
      <small class="text-start d-block">비밀번호확인</small>
      <input type="password" v-model="passwordCheck" class="underline-input">
      <small v-if="!isPasswordMatch && isPasswordChecked" class="m-0 text-start text-danger">비밀번호가 일치하지 않습니다.</small>
      <small v-else class="m-0 text-start text-white">공백</small>
    </div>

    <SignupAddressInput ref="addressInputRef"/>


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

.no-arrow {
  -webkit-appearance: none; /* Chrome, Safari, Edge */
  -moz-appearance: none;    /* Firefox */
  appearance: none;         /* 최신 브라우저 */
  background: none;         /* 필요에 따라 */
}
</style>