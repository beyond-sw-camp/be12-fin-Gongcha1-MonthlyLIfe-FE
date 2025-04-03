<script setup>

</script>

<template>
  <div class="container">

    <div class="mb-5">
      <p class="fs-1 fw-bold">로그인</p>
      <div class="d-flex justify-content-center">
        <div class="bg-danger mb-2" style="width: 80px; height: 5px;"> </div>
      </div>
      <p class="fs-6 text-danger">로그인 후, 이용이 가능합니다.</p>
    </div>

    <div class="d-flex" >
      <div style="width: 20em">
        <p class="fs-5">MonthlyLife</p>
        <input type="text" class="form-control mb-1" placeholder="아이디">

        <input type="password" class="form-control mb-1" placeholder="비밀번호">
        <button class="btn btn-dark w-100">로그인</button>


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
          <p class="fs-6 text-danger">회원가입</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>