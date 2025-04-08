<template>
  <div class="container-fluid d-flex p-0 min-vh-100">
    <!-- Sidebar -->
<!--    <div class="sidebar bg-white border-end p-3">-->
<!--      <h5 class="fw-bold mb-4">월정액 인생</h5>-->
<!--      <div class="mb-3">-->
<!--        <h6 class="fw-bold">MY 구독</h6>-->
<!--        <ul class="list-unstyled">-->
<!--          <li><a href="#" class="text-decoration-none text-dark">구독 관리</a></li>-->
<!--          <li><a href="#" class="text-decoration-none text-dark">정기배송관리</a></li>-->
<!--        </ul>-->
<!--      </div>-->
<!--      <div class="mb-3">-->
<!--        <h6 class="fw-bold">MY 혜택</h6>-->
<!--        <ul class="list-unstyled">-->
<!--          <li><a href="#" class="text-decoration-none text-dark">쿠폰/포인트</a></li>-->
<!--        </ul>-->
<!--      </div>-->
<!--      <div class="mb-3">-->
<!--        <h6 class="fw-bold">MY 활동</h6>-->
<!--        <ul class="list-unstyled">-->
<!--          <li><a href="#" class="text-decoration-none text-dark">문의내역</a></li>-->
<!--          <li><a href="#" class="text-decoration-none text-dark">리뷰내역</a></li>-->
<!--        </ul>-->
<!--      </div>-->
<!--      <div>-->
<!--        <h6 class="fw-bold">MY 정보</h6>-->
<!--        <ul class="list-unstyled">-->
<!--          <li><a href="#" class="text-decoration-none text-dark">개인정보 관리</a></li>-->
<!--        </ul>-->
<!--      </div>-->
<!--    </div>-->

    <!-- Main Content -->`
    <div class="flex-grow-1 p-4">
      <h4 class="fw-bold mb-3">배송조회</h4>

      <!-- 방문 예정 안내 -->
      <div class="bg-light p-3 rounded mb-4 text-center fw-bold fs-5">
        <font-awesome-icon :icon="['fas', 'truck']" class="me-2" />
        4/3 (화) 기사 방문 예정
      </div>

      <!-- 배송 상세 정보 -->
      <div class="card p-3 mb-4">
        <div class="row mb-2">
          <div class="col-md-6">
            <strong>기사님 핸드폰 번호:</strong> <br />
            <span class="text-muted">{{ deliveryInfo.driverPhone }}</span>
          </div>
          <div class="col-md-6">
            <strong>받는 분:</strong> <br />
            <span class="text-muted">{{ deliveryInfo.receiverName }}</span>
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-md-6">
            <strong>배송조회사항:</strong> <br />
            <span class="text-muted">{{ deliveryInfo.status }}</span>
          </div>
          <div class="col-md-6">
            <strong>받는 주소:</strong> <br />
            <span class="text-muted">{{ deliveryInfo.address }}</span>
          </div>
        </div>
      </div>

      <!-- 배송 이력 테이블 -->
      <div>
        <table class="table table-bordered">
          <thead class="table-light">
          <tr>
            <th>시간</th>
            <th>기사이름</th>
            <th>방문 상태</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(log, index) in deliveryLogs" :key="index">
            <td>{{ log.time }}</td>
            <td>{{ log.driver }}</td>
            <td>{{ log.status }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTruck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Font Awesome 등록
library.add(faTruck)

// 배송 정보 데이터
const deliveryInfo = ref({
  driverPhone: '1025057496626',
  receiverName: '이우진',
  address: '경기도 의왕시 서해구 교육읍 단둘리 319 인성트라이엄프타운 102동 601호',
  status: '완료'
})

// 배송 이력
const deliveryLogs = ref([
  { time: '4월 3, 2025 12:34', driver: '김재구', status: '방문 예정' }
])
</script>

<style scoped>
.sidebar {
  width: 220px;
  min-height: 100vh;
}
.table th,
.table td {
  vertical-align: middle;
  text-align: center;
}
</style>
