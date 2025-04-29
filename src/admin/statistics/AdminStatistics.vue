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
                <td>{{ user.dateJoined.split('T')[0] }}</td>
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
                <td>{{ order.amount }}원</td>
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
import axios from "axios";

const cards = ref([
  { title: '올해 누적 매출', value: '3,500,000원', color: '#00a8ff', icon: ['fas', 'wallet'] },
  { title: '누적 사용자 수', value: 85, color: '#f6b93b', icon: ['fas', 'user'] },
  { title: '진행중인 구독 수', value: 12, color: '#ff9f43', icon: ['fas', 'shopping-cart'] },
  { title: '수리/반납 요청 수', value: 58, color: '#38ada9', icon: ['fas', 'truck'] },
  { title: '총 상품 수', value: 3, color: '#e55039', icon: ['fas', 'box'] },
])





const salesLabels = ['1월', '2월', '3월', '4월', '5월', '6월']
const salesData = [500000, 750000, 1200000, 900000, 1500000, 1700000]

const monthLabels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

function fillMonthlyData(rawData) {
  const filledData = Array(12).fill(0) // 1~12월 모두 0으로 초기화

  for (const item of rawData) {
    const month = item.month - 1 // 1월이면 인덱스 0
    filledData[month] = item.value
  }

  return filledData
}const userData = [10, 15, 8, 20, 18, 25]

async function fetchCardData() {
  try {
    const response = await axios.get('/api/admin/statistics/cardview')
    const data = response.data.result
    cards.value[0].value = data.totalRevenue.toLocaleString()
    cards.value[1].value = data.userCount
    cards.value[2].value = data.activeSubscriptions
    cards.value[3].value = data.repairAndReturnRequests
    cards.value[4].value = data.productCount
  } catch (err) {
    console.error('카드 데이터 로딩 실패', err)
  }
}

const monthlySales = ref([])
const monthlyNewUsers = ref([])

async function fetchStatistics() {
  try {
    const response = await axios.get('/api/admin/statistics')
    const data = response.data.result

    monthlySales.value = data.monthlySales
    monthlyNewUsers.value = data.monthlyNewUsers
  } catch (err) {
    console.error('통계 데이터 로딩 실패', err)
  }
}


const recentOrders = ref([])

async function fetchRecentPayments() {
  try {
    const response = await axios.get('/api/admin/statistics/recent-payments')
    recentOrders.value = response.data.result
  } catch (err) {
    console.error('최근 결제 불러오기 실패', err)
  }
}



const recentUsers = ref([])

async function fetchRecentUsers() {
  try {
    const response = await axios.get('/api/admin/statistics/recent-users')
    recentUsers.value = response.data.result
  } catch (err) {
    console.error('최근 가입 유저 불러오기 실패', err)
  }
}



onMounted(() => {
  fetchCardData()
  fetchStatistics().then(() => {
    new Chart(document.getElementById('salesChart'), {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [{
          label: '매출 (원)',
          data: monthlySales.value,
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
        labels: monthLabels,
        datasets: [{
          label: '신규 가입자 (명)',
          data: monthlyNewUsers.value,
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

    // 추가 차트도 이 방식으로 그릴 수 있음 (구독, 수리/반납, 성공률)
  })
  fetchRecentPayments()
  fetchRecentUsers()
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
