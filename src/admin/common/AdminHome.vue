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
      <!-- 회원수 카드 -->
      <div class="col">
        <div
            class="info-card shadow-sm d-flex flex-column align-items-center justify-content-center text-white"
            style="background-color: #4ea8de;"
        >
          <div class="fs-2">
            <font-awesome-icon :icon="['fas', 'user']" />
          </div>
          <div class="fs-1 fw-bold">{{ totalMembers }}</div>
          <div class="mt-1">회원수</div>
        </div>
      </div>

      <!-- 총 매출 카드 -->
      <div class="col">
        <div
            class="info-card shadow-sm d-flex flex-column align-items-center justify-content-center text-white"
            style="background-color: #57c478;"
        >
          <div class="fs-2">
            <font-awesome-icon :icon="['fas', 'won-sign']" />
          </div>
          <div class="fs-1 fw-bold">{{ totalSalesValue.toLocaleString() }}</div>
          <div class="mt-1">총 매출</div>
        </div>
      </div>

      <!-- 문의 답변 카드 -->
      <div class="col">
        <div
            class="info-card shadow-sm d-flex flex-column align-items-center justify-content-center text-white"
            style="background-color: #f6b93b;"
        >
          <div class="fs-2">
            <font-awesome-icon :icon="['fas', 'comments']" />
          </div>
          <div class="fs-1 fw-bold">{{ answeredInquiries }}</div>
          <div class="mt-1">문의 답변</div>
        </div>
      </div>

      <!-- 고객 문의 카드 -->
      <div class="col">
        <div
            class="info-card shadow-sm d-flex flex-column align-items-center justify-content-center text-white"
            style="background-color: #ff9f43;"
        >
          <div class="fs-2">
            <font-awesome-icon :icon="['fas', 'q']" />
          </div>
          <div class="fs-1 fw-bold">{{ customerInquiries }}</div>
          <div class="mt-1">고객 문의</div>
        </div>
      </div>
    </div>



    <!-- 주문 목록 테이블 -->
    <div class="row mt-4">
      <div class="col">
        <h5 class="section-title mb-3">주문 목록</h5>
        <table class="table table-bordered table-hover subscribe-table">
          <thead class="table-header" >
            <tr style="background-color: #4ea8de">
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



    <!-- 제품 목록 테이블 -->
    <div class="row mt-4">
      <div class="col">
        <h5 class="section-title mb-3">제품 목록</h5>
        <table class="table table-bordered table-hover product-table">
          <thead class="table-header">
          <tr>
            <th>제품번호</th>
            <th>카테고리</th>
            <th>제품명</th>
            <th>단가</th>
            <th>재고수량</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(product, idx) in products" :key="idx">
            <td>{{ product.productNo }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.stock }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- 문의 목록 테이블 -->
  <div class="row mt-4">
    <div class="col">
      <h5 class="section-title mb-3">문의 목록</h5>
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
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Chart.js 플러그인 등록 (Doughnut 차트용)
ChartJS.register(Title, Tooltip, Legend, ArcElement)

// 월간 목표 관련 데이터
const monthlyGoal = ref(10000000)
const currentSales = ref(2302735)
const goalPercentage = computed(() => {
  const pct = (currentSales.value / monthlyGoal.value) * 100
  return pct > 100 ? 100 : Math.round(pct)
})

// 매출 분포 도넛 차트 데이터 & 옵션
const distributionData = {
  labels: ['온라인광고', '카드결제', '무통장입금', '현금결제', '기타'],
  datasets: [
    {
      data: [30, 20, 25, 15, 10],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
    }
  ]
}
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' }
  }
}

// 카드뷰용 데이터
const totalMembers = ref(120)
const totalSalesValue = ref(2302735)
const answeredInquiries = ref(45)
const customerInquiries = ref(10)

// 문의 목록
const posts = ref([
  { contentNo: '1', category: '제품고장', title: '수리 문의', username: "김재구", date: '2020-07-09' },
  { contentNo: '2', category: '제품정보', title: '재입고 문의', username: "이우진", date: '2020-07-10' }
])

// 주문 목록
const orders = ref([
  {
    orderNo: '20200509VV0002',
    customerName: '김재구',
    amount: 38120,
    status: '결제완료',
    memo: '배송안내 필요',
    date: '2020-06-11 16:31:53'
  },
  {
    orderNo: '20200510VV0002',
    customerName: '이우진',
    amount: 18200,
    status: '결제완료',
    memo: '배송안내 필요',
    date: '2020-06-11 16:31:53'
  }
])

// 제품 목록
const products = ref([
  { productNo: '1', category: '100', name: '4832107654', price: 30000, stock: 15 },
  { productNo: '2', category: '200', name: 'GAP QDFOZIQ', price: 50000, stock: 8 }
])

// 주문 상세 모달 관련
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
  padding: 1rem;
  text-align: center;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 8px;
  transition: transform 0.2s;
}
.info-card:hover {
  transform: scale(1.02);
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
  background-color: #CCFFFF;
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
