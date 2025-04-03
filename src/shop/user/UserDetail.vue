<script setup>

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
          <button class="btn btn-outline-secondary btn-sm me-2 mb-1">수정하기</button>
        </div>

        <div class="mb-4 border p-3 rounded">
          <div class="p-3">
            <ul>
              <li class="d-flex align-items-center mb-2">
                <p class="mb-1">이름</p>
                <div class="ms-auto d-flex flex-column">
                  <input class="form-control" style="width: 30em;" value="홍길동" disabled="true">
                </div>
              </li>

              <li class="d-flex align-items-center mb-2">
                <p class="mb-1">아이디</p>
                <div class="ms-auto d-flex flex-column">
                  <input class="form-control" style="width: 30em;" value="gildong123" disabled="true">
                </div>
              </li>

              <li class="d-flex align-items-center mb-2">
                <p class="mb-1">생년월일</p>
                <div class="ms-auto d-flex flex-column">
                  <input class="form-control" style="width: 30em;" value="20250403" disabled="true">
                </div>
              </li>


              <li class="d-flex align-items-center mb-2">
                <p class="mb-1">연락처</p>
                <div class="ms-auto d-flex flex-column">
                  <input class="form-control" style="width: 30em;" value="01012345678" disabled="true">
                </div>
              </li>

              <li class="d-flex align-items-center mb-2">
                <p class="mb-1">주소</p>
                <div class="ms-auto d-flex flex-column">
                  <input class="form-control" style="width: 30em;" value="서울시 동작구 보라매로 87" disabled="true">
                </div>
              </li>

              <li class="d-flex align-items-center mb-2">
                <p class="mb-1">상세주소</p>
                <div class="ms-auto d-flex flex-column">
                  <input class="form-control" style="width: 30em;" value="4층" disabled="true">
                </div>
              </li>

              <li class="d-flex align-items-center mb-2">
                <p class="mb-1">상세주소</p>
                <div class="ms-auto d-flex flex-column">
                  <input class="form-control" style="width: 30em;" value="4층" disabled="true">
                </div>
              </li>
            </ul>

          </div>
        </div>
      </div>

      <div class="card-body">
        <div class="d-flex justify-content-between">
          <h6 class="fw-bold text-lg-start">소셜 로그인</h6>
        </div>

        <div class="mb-4 border p-3 rounded">
          <div class="p-3">
            <ul>
              <li class="d-flex align-items-center mb-2">
                <p class="mb-1">네이버</p>
                <div class="ms-auto d-flex flex-column">
                  <button class="btn btn-outline-secondary btn-sm me-2 mb-1">등록하기</button>
                </div>
              </li>

              <li class="d-flex align-items-center mb-2">
                <p class="mb-1">카카오</p>
                <div class="ms-auto d-flex flex-column">
                  <button class="btn btn-outline-secondary btn-sm me-2 mb-1">등록하기</button>
                </div>
              </li>

              <li class="d-flex align-items-center mb-2">
                <p class="mb-1">구글</p>
                <div class="ms-auto d-flex flex-column">
                  <button class="btn btn-outline-secondary btn-sm me-2 mb-1">등록하기</button>
                </div>
              </li>
            </ul>

          </div>
        </div>

      </div>


      <div class="card-body">
        <div class="d-flex justify-content-between">
          <h6 class="fw-bold text-lg-start">태그</h6>
          <button class="btn btn-outline-secondary btn-sm me-2 mb-1">수정하기</button>
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


      <!-- 더보기 버튼 -->
      <div class="text-end">
        <small>회원 탈퇴</small>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>