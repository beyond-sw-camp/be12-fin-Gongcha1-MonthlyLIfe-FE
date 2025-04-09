<template>
  <div class="container py-4 text-nowrap">

    <!-- 상단 도넛 차트 영역: 한 줄에 두 개 배치 -->
    <div class="row g-3 mb-4">
      <!-- 도넛 차트: 매출 분포 -->
      <div class="col-12 col-md-6">
        <div class="chart-box shadow-sm">
          <Doughnut :data="distributionData" :options="chartOptions" />
        </div>
      </div>
      <!-- 월간 목표: 부트스트랩 Progress Bar 사용 -->
      <div class="col-12 col-md-6">
        <div class="card p-3 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">MONTHLY GOAL</h5>
            <div class="progress" style="height: 30px;">
              <div
                  class="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  :style="{ width: goalPercentage + '%' }"
                  :aria-valuenow="goalPercentage"
                  aria-valuemin="0"
                  aria-valuemax="100"
              >
                {{ goalPercentage }}%
              </div>
            </div>
            <div class="mt-2">
              <span>현재: {{ currentSales.toLocaleString() }}</span>
              <span> / 목표: {{ monthlyGoal.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2x2 카드뷰 영역 -->
    <div class="row row-cols-1 row-cols-md-2 g-3 mb-4">
      <!-- 카드들 -->
      <div v-for="(card, index) in cards" :key="index" class="col">
        <div
            class="info-card shadow-sm d-flex flex-column align-items-center justify-content-center text-white"
            :style="{ backgroundColor: card.color }"
        >
          <div class="fs-2">
            <font-awesome-icon :icon="card.icon" />
          </div>
          <div class="fs-1 fw-bold">{{ card.value }}</div>
          <div class="mt-1">{{ card.label }}</div>
        </div>
      </div>
    </div>

    <!-- 배송 스케줄 관리 테이블 -->
    <div class="row mt-4">
      <div class="col">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="section-title mb-0">배송 스케줄 관리</h5>
          <router-link to="/admin/delivery" class="text-primary text-decoration-none">상세보기 →</router-link>
        </div>
        <table class="table table-bordered table-hover subscribe-table">
          <thead class="table-header">
          <tr style="background-color: #D9EDF7">
            <th>주문번호</th>
            <th>주문자명</th>
            <th>주문금액</th>
            <th>주문상태</th>
            <th>주문메모</th>
            <th>주문일시</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(order, idx) in orders"
              :key="idx"
              style="cursor: pointer;"
              @click="openOrderModal(order)"
          >
            <td>{{ order.orderNo }}</td>
            <td>{{ order.customerName }}</td>
            <td>{{ order.amount }}</td>
            <td>{{ order.status }}</td>
            <td>{{ order.memo }}</td>
            <td>{{ order.date }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 주문 상세 정보 모달 -->
    <div
        class="modal fade"
        id="orderModal"
        tabindex="-1"
        aria-labelledby="orderModalLabel"
        aria-hidden="true"
        ref="orderModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="orderModalLabel">주문 상세 정보</h5>
            <button type="button" class="btn btn-close" @click="closeOrderModal"></button>
          </div>
          <div class="modal-body">
            <p><strong>주문번호:</strong> {{ selectedOrder.orderNo }}</p>
            <p><strong>주문자명:</strong> {{ selectedOrder.customerName }}</p>
            <p><strong>주문금액:</strong> {{ selectedOrder.amount }}</p>
            <p><strong>주문상태:</strong> {{ selectedOrder.status }}</p>
            <p><strong>주문메모:</strong> {{ selectedOrder.memo }}</p>
            <p><strong>주문일시:</strong> {{ selectedOrder.date }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeOrderModal">
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 재고 관리 테이블 -->
    <div class="row mt-4">
      <div class="col">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="section-title mb-0">재고 관리</h5>
          <router-link to="/admin/item" class="text-primary text-decoration-none">상세보기 →</router-link>
        </div>
        <table class="table table-bordered table-hover text-center">
          <thead class="custom-thead product-table">
          <tr>
            <th>상품 ID</th>
            <th>상품명</th>
            <th>카테고리</th>
            <th>가격</th>
            <th>재고 수량</th>
            <th>등록일</th>
            <th>판매 상태</th>
            <th>연체 여부</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(product, idx) in products" :key="idx">
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.stock }}</td>
            <td>{{ product.registered }}</td>
            <td>{{ product.status }}</td>
            <td>{{ product.overdue }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 문의 목록 테이블 -->
    <div class="row mt-4">
      <div class="col">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="section-title mb-0">문의 목록</h5>
          <router-link to="/" class="text-primary text-decoration-none">상세보기 →</router-link>
        </div>
        <table class="table table-bordered table-hover customer-table">
          <thead class="table-header">
          <tr>
            <th>글번호</th>
            <th>카테고리</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(post, idx) in posts" :key="idx">
            <td>{{ post.contentNo }}</td>
            <td>{{ post.category }}</td>
            <td>{{ post.title }}</td>
            <td>{{ post.username }}</td>
            <td>{{ post.date }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, ArcElement)

const monthlyGoal = ref(10000000)
const currentSales = ref(2302735)
const goalPercentage = computed(() => Math.min(Math.round((currentSales.value / monthlyGoal.value) * 100), 100))

const distributionData = {
  labels: ['온라인광고', '카드결제', '무통장입금', '현금결제', '기타'],
  datasets: [{
    data: [30, 20, 25, 15, 10],
    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
  }]
}
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } }
}

const totalMembers = ref(120)
const totalSalesValue = ref(2302735)
const answeredInquiries = ref(45)
const customerInquiries = ref(10)

const cards = [
  { icon: ['fas', 'user'], value: totalMembers.value, label: '회원수', color: '#4ea8de' },
  { icon: ['fas', 'won-sign'], value: totalSalesValue.value.toLocaleString(), label: '총 매출', color: '#57c478' },
  { icon: ['fas', 'comments'], value: answeredInquiries.value, label: '문의 답변', color: '#f6b93b' },
  { icon: ['fas', 'q'], value: customerInquiries.value, label: '고객 문의', color: '#ff9f43' }
]

const posts = ref([
  { contentNo: '1', category: '제품고장', title: '수리 문의', username: '김재구', date: '2020-07-09' },
  { contentNo: '2', category: '제품정보', title: '재입고 문의', username: '이우진', date: '2020-07-10' }
])

const orders = ref([
  { orderNo: '20200509VV0002', customerName: '김재구', amount: 38120, status: '결제완료', memo: '배송안내 필요', date: '2020-06-11 16:31:53' },
  { orderNo: '20200510VV0002', customerName: '이우진', amount: 18200, status: '결제완료', memo: '배송안내 필요', date: '2020-06-11 16:31:53' }
])

const products = ref([
  { id: 'P1001', name: '무선 헤드폰', category: '전자제품', price: '150000', stock: '25', registered: '2023-10-01 09:30:00', status: '판매중', overdue: 'N' },
  { id: 'P1002', name: '청바지', category: '의류', price: '50000', stock: '100', registered: '2023-09-25 14:20:00', status: '판매중', overdue: 'Y' },
  { id: 'P1003', name: '자바스크립트 입문서', category: '도서', price: '30000', stock: '50', registered: '2023-10-03 11:00:00', status: '판매중', overdue: 'N' },
  { id: 'P1004', name: '스마트워치', category: '전자제품', price: '200000', stock: '15', registered: '2023-09-28 10:15:00', status: '판매중', overdue: 'N' },
  { id: 'P1005', name: '아동용 신발', category: '패션', price: '40000', stock: '80', registered: '2023-10-05 12:45:00', status: '판매중', overdue: 'Y' }
])

const selectedOrder = ref({})
const orderModal = ref(null)
const openOrderModal = (order) => {
  selectedOrder.value = order
  const modalEl = document.getElementById('orderModal')
  orderModal.value = new bootstrap.Modal(modalEl)
  orderModal.value.show()
}
const closeOrderModal = () => {
  if (orderModal.value) orderModal.value.hide()
}
</script>


<style scoped>
/* 카드 스타일 */
.info-card {
  background-color: #ffffff;
  padding: 0.75rem;
  text-align: center;
  min-height: 90px; /* ✅ 높이 줄임 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 8px;
  transition: transform 0.2s;
}
.info-card:hover {
  transform: scale(1.02);
}
.info-card .fs-2 {
  font-size: 1.25rem !important; /* ✅ 아이콘 크기 줄임 */
}
.info-card .fs-1 {
  font-size: 1.5rem !important; /* ✅ 숫자 크기 줄임 */
}
.info-card .mt-1 {
  font-size: 0.875rem; /* ✅ 제목 글자 크기 */
}

/* 차트 박스 */
.chart-box {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1rem;
  width: 100%;
  height: 220px;
  position: relative;
}

/* 표 스타일 */
.table-header th {
  color: #333;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
}

.product-table th {
  background-color: #FFF8DE;
}

.subscribe-table th {
  background-color: #D9EDF7;
}

.customer-table th {
  background-color: #DFF0D8;
}

/* 섹션 타이틀 */
.section-title {
  font-weight: 600;
  color: #333;
}

/* 모달 */
.modal-content {
  border-radius: 8px;
}

</style>
