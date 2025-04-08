<template>
  <div class="container py-4">

    <!-- ✅ 상단 카드 -->
    <div class="row text-white mb-4">
      <div class="col" v-for="card in cards" :key="card.title">
        <div
            class="info-card shadow-sm d-flex flex-column align-items-center justify-content-center text-white"
            :style="{ backgroundColor: card.color }"
        >
          <div class="fs-4 mb-1">
            <font-awesome-icon :icon="card.icon" />
          </div>
          <div class="small mt-1">{{ card.title }}</div>
          <div class="fs-5 fw-bold">{{ card.value }}</div>
        </div>
      </div>
    </div>


    <!-- ✅ 차트 -->
    <div class="row mb-4">
      <div class="col-md-6 mb-3">
        <div class="card shadow-sm">
          <div class="card-header fw-bold">월별 매출 추이</div>
          <div class="card-body">
            <canvas id="salesChart"></canvas>
          </div>
        </div>
      </div>
      <div class="col-md-6 mb-3">
        <div class="card shadow-sm">
          <div class="card-header fw-bold">월별 신규 유저</div>
          <div class="card-body">
            <canvas id="userChart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ 하단 테이블 -->
    <div class="row">
      <div class="col-md-6 mb-3">
        <div class="card shadow-sm">
          <div class="card-header fw-bold">최근 가입 유저</div>
          <div class="card-body p-0">
            <table class="table table-hover mb-0 text-center">
              <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>이름</th>
                <th>가입일</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="user in recentUsers" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.dateJoined }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-md-6 mb-3">
        <div class="card shadow-sm">
          <div class="card-header fw-bold">최근 주문</div>
          <div class="card-body p-0">
            <table class="table table-hover mb-0 text-center">
              <thead class="table-light">
              <tr>
                <th>주문 ID</th>
                <th>고객명</th>
                <th>금액</th>
                <th>상태</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="order in recentOrders" :key="order.id">
                <td>{{ order.id }}</td>
                <td>{{ order.customerName }}</td>
                <td>{{ order.amount }}</td>
                <td>{{ order.status }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const cards = ref([
  { title: '총 매출', value: '3,500,000원', color: '#00a8ff', icon: ['fas', 'wallet'] },
  { title: '문의 답변', value: 85, color: '#f6b93b', icon: ['fas', 'comments'] },
  { title: '고객 문의', value: 12, color: '#ff9f43', icon: ['fas', 'question-circle'] },
  { title: '총 주문 수', value: 58, color: '#38ada9', icon: ['fas', 'shopping-cart'] },
  { title: '연체 주문', value: 3, color: '#e55039', icon: ['fas', 'exclamation-circle'] },
])

const recentUsers = ref([
  { id: 1, name: '홍길동', dateJoined: '2025-04-07' },
  { id: 2, name: '임꺽정', dateJoined: '2025-04-06' },
  { id: 3, name: '김철수', dateJoined: '2025-04-05' },
])

const recentOrders = ref([
  { id: 101, customerName: '홍길동', amount: '500,000원', status: '결제완료' },
  { id: 102, customerName: '임꺽정', amount: '250,000원', status: '결제완료' },
  { id: 103, customerName: '김철수', amount: '750,000원', status: '결제완료' },
])

const salesLabels = ['1월', '2월', '3월', '4월', '5월', '6월']
const salesData = [500000, 750000, 1200000, 900000, 1500000, 1700000]

const userLabels = ['1월', '2월', '3월', '4월', '5월', '6월']
const userData = [10, 15, 8, 20, 18, 25]

onMounted(() => {
  new Chart(document.getElementById('salesChart'), {
    type: 'line',
    data: {
      labels: salesLabels,
      datasets: [{
        label: '매출 (원)',
        data: salesData,
        backgroundColor: 'rgba(0,168,255,0.2)',
        borderColor: 'rgba(0,168,255,1)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  })

  new Chart(document.getElementById('userChart'), {
    type: 'bar',
    data: {
      labels: userLabels,
      datasets: [{
        label: '신규 가입자 (명)',
        data: userData,
        backgroundColor: 'rgba(255,159,67,0.5)',
        borderColor: 'rgba(255,159,67,1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  })
})
</script>

<style scoped>

.info-card {
  height: 90px; /* ⬅️ 기존 120px → 90px 로 줄임 */
  border-radius: 8px;
  padding: 8px;
}
.card-header {
  background-color: #f8f9fa;
}
.table th, .table td {
  vertical-align: middle;
}

</style>
