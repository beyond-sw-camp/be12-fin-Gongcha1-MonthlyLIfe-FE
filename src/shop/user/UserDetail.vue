<script setup>


import {onMounted, reactive} from "vue";
import {useUserStore} from "../../store/useUserStore.js";
import router from "../../router/index.js";

const userStore = useUserStore();
const user = reactive({
  id: null,
  name: null,
  birth: null,
  phoneNumber: null,
  address1: null,
  address2: null
});

onMounted(async () =>  {
  Object.assign(user, await userStore.getUser());
  console.log(user);
})

const withdraw = () => {
  const result = userStore.deleteUser();
  if(result) {
    userStore.getLogout();
    router.push('/');
  }
  else {
    alert('회원 탈퇴 실패, 잠시 후 다시 시도해주세요');
  }
}

</script>

<template>
  <div class="container py-4">
    <!-- 구독 목록 카드 -->
    <div class="card shadow-sm mb-4">
      <div class="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 class="mb-0">개인정보확인/수정</h5>
      </div>

      <div class="card-body">
        <div class="d-flex justify-content-between">
          <h6 class="fw-bold text-lg-start">개인정보</h6>
          <button class="btn btn-link text-decoration-underline btn-sm me-2 mb-1">수정</button>
        </div>

        <div class="mb-4 border p-3 rounded">
          <div class="p-3">
            <ul>
              <li class="d-flex align-items-center mb-2">
                <p class="mb-1">이름</p>
                <div class="ms-auto d-flex flex-column">
                  <input class="form-control" style="width: 30em;" v-model="user.name" disabled="true">
                </div>
              </li>

              <li class="d-flex align-items-center mb-2">
                <p class="mb-1">아이디</p>
                <div class="ms-auto d-flex flex-column">
                  <input class="form-control" style="width: 30em;" v-model="user.id" disabled="true">
                </div>
              </li>

              <li class="d-flex align-items-center mb-2">
                <p class="mb-1">생년월일</p>
                <div class="ms-auto d-flex flex-column">
                  <input class="form-control" style="width: 30em;" v-model="user.birth" disabled="true">
                </div>
              </li>


              <li class="d-flex align-items-center mb-2">
                <p class="mb-1">연락처</p>
                <div class="ms-auto d-flex flex-column">
                  <input class="form-control" style="width: 30em;" v-model="user.phoneNumber" disabled="true">
                </div>
              </li>
              <li class="d-flex align-items-center mb-2">
                <p class="mb-1">우편번호</p>
                <div class="ms-auto d-flex flex-column">
                  <input class="form-control" style="width: 30em;"v-model="user.postalCode" disabled="true">
                </div>
              </li>
              <li class="d-flex align-items-center mb-2">
                <p class="mb-1">주소</p>
                <div class="ms-auto d-flex flex-column">
                  <input class="form-control" style="width: 30em;"v-model="user.address1" disabled="true">
                </div>
              </li>

              <li class="d-flex align-items-center mb-2">
                <p class="mb-1">상세주소</p>
                <div class="ms-auto d-flex flex-column">
                  <input class="form-control" style="width: 30em;" v-model="user.address2" disabled="true">
                </div>
              </li>
            </ul>

          </div>
        </div>
      </div>
      
      <div class="card-body">
        <div class="d-flex justify-content-between">
          <h6 class="fw-bold text-lg-start">태그</h6>
          <button class="btn btn-link text-decoration-underline btn-sm me-2 mb-1">수정</button>
        </div>

        <div class="mb-4 border p-3 rounded">
          <div class="p-3">
            <ul>
              <li class="d-flex align-items-center mb-2">
                <input type="checkbox" disabled="true">
                <p class="mb-1">1인가구</p>
              </li>
              <li class="d-flex align-items-center mb-2">
                <input type="checkbox" disabled="true" checked="true">
                <p class="mb-1">신혼부부</p>
              </li>

              <li class="d-flex align-items-center mb-2">
                <input type="checkbox" disabled="true">
                <p class="mb-1">대학생</p>
              </li>

              <li class="d-flex align-items-center mb-2">
                <input type="checkbox" disabled="true">
                <p class="mb-1">취준생</p>
              </li>
            </ul>
          </div>
        </div>
      </div>


      <!-- 회원탈퇴 버튼 -->
      <div class="text-end">
        <button class="btn btn-link text-black text-decoration-underline btn-sm me-2 mb-1"
                @click="withdraw"
        >회원탈퇴</button>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>