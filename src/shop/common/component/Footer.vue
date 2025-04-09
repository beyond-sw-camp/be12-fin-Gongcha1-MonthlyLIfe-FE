<script setup>
</script>

<template>
  <footer class="footer-container w-100 bg-white pt-5 pb-4 mt-5">
    <div class="row mx-0 px-5">
      <!-- 회사 정보 -->
      <div class="col-md-3 mb-4 ">
        <h5 class="fw-bold mb-3">구독구독</h5>
          <p class="mb-1">㈜월정액인생</p>
          <p class="mb-1">대표이사: 김경준</p>
          <p class="mb-1">사업자등록번호: 123-45-67890</p>
          <p class="mb-1">통신판매업신고: 제2025-서울동작-0000호</p>
      </div>

      <!-- 고객센터 -->
      <div class="col-md-3 mb-4">
        <h5 class="fw-bold mb-3">고객센터</h5>
        <p class="mb-1">대표번호: 1855-1000</p>
        <p class="mb-1">운영시간: 평일 09:00 ~ 18:00</p>
        <p class="mb-1">점심시간: 12:00 ~ 13:00</p>
        <p class="mb-1">주말/공휴일 휴무</p>
      </div>

      <!-- 이용안내 -->
      <div class="col-md-3 mb-4">
        <h5 class="fw-bold mb-3">이용안내</h5>
          <p class="mb-1" >이용약관</p>
          <p class="mb-1">개인정보처리방침</p>
          <p class="mb-1">고객센터</p>
          <p class="mb-1">자주 묻는 질문</p>
      </div>

      <!-- SNS -->
      <div class="col-md-3 mb-4">
        <h5 class="fw-bold mb-3">Follow Us</h5>
        <a href="#" class=" me-3">
          <font-awesome-icon :icon="['fab', 'facebook']" />
        </a>
        <a href="#" class=" me-3 insta" >
          <font-awesome-icon :icon="['fab', 'square-instagram']" />
        </a>
        <a href="#" class=" me-3" style="color: red">
          <font-awesome-icon :icon="['fab', 'youtube']" />
        </a>
        <a href="#" class="" style="color: black">
          <font-awesome-icon :icon="['fab', 'github']" />
        </a>
      </div>
    </div>

    <!-- 하단 -->
    <div class="text-center border-top pt-3 mt-3 px-5">
      <small>&copy; 2025 HelloRental. All rights reserved.</small>
    </div>
  </footer>
</template>

<style scoped>
.footer-link {
  color: white;
  text-decoration: none;
  transition: color 0.2s ease;
}
.footer-link:hover {
  color: #cccccc;
  text-decoration: underline;
}
.insta {
  color: #C13584;
}
.footer-container {
  margin-top: auto;
  margin-left: 0;
}
p {
  font-size: 10px;
}


</style>




