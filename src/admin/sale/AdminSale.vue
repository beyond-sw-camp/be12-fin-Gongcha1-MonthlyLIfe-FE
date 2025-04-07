<script setup>
import { ref, reactive, computed } from 'vue'

// 오늘 날짜 (참고용)
const today = new Date().toISOString().split("T")[0]

// 결제 및 연체 관리 데이터 (예시)
const payments = ref([
  {
    paymentId: 'P20210501',
    userName: '홍길동',
    amount: 50000,
    status: '결제완료',
    overdue: 'N',
    paymentDate: '2021-05-01 10:00:00',
    expiryDate: '2022-05-01 10:00:00'
  },
  {
    paymentId: 'P20210502',
    userName: '임꺽정',
    amount: 75000,
    status: '미결제',
    overdue: 'Y',
    paymentDate: '2021-05-02 11:30:00',
    expiryDate: '2022-05-02 11:30:00'
  },
  {
    paymentId: 'P20210503',
    userName: '김철수',
    amount: 60000,
    status: '결제완료',
    overdue: 'N',
    paymentDate: '2021-05-03 09:15:00',
    expiryDate: '2022-05-03 09:15:00'
  }
])

// 페이지네이션 관련
const currentPage = ref(1)
const pageSize = 10

// 필터 조건 (예시데이터가 보이도록 날짜 기본값을 2021년 범위로 설정)
const filter = reactive({
  sort: '최신 결제 순',
  dateFrom: '2021-01-01',
  dateTo: '2021-12-31',
  searchType: 'Payment ID', // 또는 '사용자명'
  searchQuery: '',
  overdueOnly: false,
})

// 결제 데이터 필터링 (날짜, 검색 조건, 연체 여부)
const filteredPayments = computed(() => {
  return payments.value.filter(payment => {
    let match = true
    // 결제일자 필터 (paymentDate의 앞 10자리가 YYYY-MM-DD라고 가정)
    const paymentDate = payment.paymentDate.substring(0, 10)
    if (filter.dateFrom && paymentDate < filter.dateFrom) {
      match = false
    }
    if (filter.dateTo && paymentDate > filter.dateTo) {
      match = false
    }
    // 검색 조건
    if (filter.searchQuery) {
      if (filter.searchType === 'Payment ID' && !payment.paymentId.includes(filter.searchQuery)) {
        match = false
      } else if (filter.searchType === '사용자명' && !payment.userName.includes(filter.searchQuery)) {
        match = false
      }
    }
    // 연체 여부 필터
    if (filter.overdueOnly && payment.overdue !== 'Y') {
      match = false
    }
    return match
  })
})

// 페이지네이션 데이터
const paginatedPayments = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPayments.value.slice(start, start + pageSize)
})

const totalPages = computed(() => {
  return Math.ceil(filteredPayments.value.length / pageSize)
})

// 페이지네이션 함수
function goToPage(page) {
  currentPage.value = page
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// 검색 버튼 클릭 시 페이지 초기화
function filterList() {
  currentPage.value = 1
}
</script>

<template>
  <div class="container-fluid">

    <!-- 필터 영역 -->
    <div class="card mb-3">
      <div class="card-body">
        <div class="row g-3 align-items-center">
          <!-- 정렬 및 날짜 필터 -->
          <div class="col-auto">
            <div class="input-group input-group-sm">
              <label class="input-group-text">정렬</label>
              <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                {{ filter.sort }}
              </button>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="filter.sort = '최신 결제 순'">
                    최신 결제 순
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="filter.sort = '최신 미결제 순'">
                    최신 미결제 순
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-auto">
            <input type="date" class="form-control form-control-sm" v-model="filter.dateFrom">
          </div>
          <div class="col-auto">
            <span>~</span>
          </div>
          <div class="col-auto">
            <input type="date" class="form-control form-control-sm" v-model="filter.dateTo">
          </div>
          <!-- 검색 조건 -->
          <div class="col-auto">
            <div class="input-group input-group-sm">
              <label class="input-group-text">검색 구분</label>
              <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                {{ filter.searchType }}
              </button>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="filter.searchType = 'Payment ID'">
                    Payment ID
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="filter.searchType = '사용자명'">
                    사용자명
                  </a>
                </li>
              </ul>
              <input type="text" class="form-control" v-model="filter.searchQuery" placeholder="검색어">
            </div>
          </div>
          <!-- 연체 여부 체크박스 -->
          <div class="col-auto form-check">
            <input class="form-check-input" type="checkbox" id="overdueCheck" v-model="filter.overdueOnly">
            <label class="form-check-label" for="overdueCheck">연체된 항목만</label>
          </div>
          <!-- 검색 버튼 -->
          <div class="col-auto">
            <button class="btn btn-primary btn-sm" @click="filterList">검색</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 결제 및 연체 관리 테이블 (박스 없이 표시) -->
    <div class="mb-3">
      <h5 class="text-center mb-3">결제 및 연체 관리</h5>
      <table class="table table-bordered table-hover">
        <thead class="table-light">
        <tr>
          <th>결제번호</th>
          <th>사용자명</th>
          <th>결제금액</th>
          <th>결제상태</th>
          <th>연체여부</th>
          <th>결제일자</th>
          <th>만료일자</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="payment in paginatedPayments" :key="payment.paymentId">
          <td>{{ payment.paymentId }}</td>
          <td>{{ payment.userName }}</td>
          <td>{{ payment.amount }}</td>
          <td>{{ payment.status }}</td>
          <td>{{ payment.overdue }}</td>
          <td>{{ payment.paymentDate }}</td>
          <td>{{ payment.expiryDate }}</td>
        </tr>
        <tr v-if="paginatedPayments.length === 0">
          <td colspan="7" class="text-center">검색 결과가 없습니다.</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 -->
    <nav>
      <ul class="pagination justify-content-center mb-0">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="prevPage">‹</a>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
          <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="nextPage">›</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.container-fluid {
  padding: 0 15px;
}
.table th {
  background-color: #f8b9b9;
  vertical-align: middle;
  text-align: center;
}
.table td {
  vertical-align: middle;
  text-align: center;
}
</style>
