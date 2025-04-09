<template>
  <footer class="footer-wrapper bg-light border-top mt-5">
    <div class="container py-5">
      <div class="row">
        <!-- 왼쪽 정보 -->
        <div class="col-md-3 mb-4 ">
          <h6 class="fw-bold mb-2">구독구독</h6>
          <p class="mb-0">월정액인생</p>
          <p class="mb-0">대표이사: 김철돌</p>
          <p class="mb-0">사업자등록번호: 123-45-67890</p>
          <p class="mb-0">통신판매업신고: 제2025-서울중구-0000호</p>
        </div>

        <!-- 고객센터 -->
        <div class="col-md-3 mb-4 ">
          <h6 class="fw-bold mb-2">고객센터</h6>
          <p class="mb-0">전화번호: 1855-1000</p>
          <p class="mb-0">운영시간: 평일 09:00 ~ 18:00</p>
          <p class="mb-0">점심시간: 12:00 ~ 13:00</p>
          <p class="mb-0">주말/공휴일 휴무</p>
        </div>

        <!-- 이용안내 및 SNS -->
        <div class="col-md-3 mb-4 ">
          <h6 class="fw-bold mb-2">이용안내</h6>
          <p class="mb-1">
            <a href="#" class="text-decoration-none text-dark">이용약관</a> |
            <a href="#" class="text-decoration-none text-dark">개인정보처리방침</a>
          </p>

        </div>
        <div class="col-md-3 mb-4 ">
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

      <div class="text-center mt-4 small text-muted">
        © 2025 HelloRental. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script>

</script>

<style scoped>
.footer-wrapper {
  width: 100%;
}

a:hover {
  text-decoration: underline;
}
.insta {
  color: #C13584;
}
</style>


