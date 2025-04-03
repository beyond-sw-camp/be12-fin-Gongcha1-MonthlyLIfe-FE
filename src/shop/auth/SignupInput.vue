<script setup>

</script>

<template>
  <div class="container">
    <div class="d-flex" style="width: 50vh;">
      <p class="fs-2">회원정보입력</p>
    </div>

    <small class="text-start d-block">MonthlyLife 가입을 위해 정보를 입력해 주세요.</small>

    <div class="pt-3 pb-3">
      <small class="text-start d-block">휴대폰번호</small>
      <input type="number" class="form-control" :disabled="true" placeholder="01012345678">
    </div>


    <div class="pb-3">
      <small class="text-start d-block">아이디</small>
      <div class="d-flex">
        <input type="text" class="underline-input">
        <button class="btn btn-danger text-nowrap btn-sm" style="font-size: 10px">중복체크</button>
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
        <input type="password" class="underline-input">
    </div>

    <div class="pb-3">
      <small class="text-start d-block">비밀번호확인</small>
      <input type="password" class="underline-input">
    </div>

    <div class="pb-3">
      <small class="text-start d-block">주소</small>
      <div class="d-flex">
        <input type="password" class="underline-input">
        <button class="btn btn-dark text-nowrap btn-sm" style="font-size: 10px">검색</button>
      </div>
    </div>
    <div class="pb-3">
      <small class="text-start d-block">상세주소</small>
      <input type="password" class="underline-input">
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



    <router-link to="/auth/signup/end" class="btn btn-danger rounded-pill w-100">다음</router-link>

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