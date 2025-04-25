<script setup>
import {ref, reactive, onMounted} from 'vue'
import axios from 'axios'

const payments = ref([])
const totalPages = ref(1)
const currentPage = ref(1)
const pageSize = 10

const filter = reactive({
  sort: '최신 결제 순',
  dateFrom: '2021-01-01',
  dateTo: '',
  searchType: 'Payment ID',
  searchQuery: '',
  overdueOnly: false,
})

function fetchPayments() {
  const params = {
      page: currentPage.value - 1,
      size: pageSize,
      sort: filter.sort,
      dateFrom: filter.dateFrom || null,
      dateTo: filter.dateTo || null,
      searchType: filter.searchType || null,
      searchQuery: filter.searchQuery?.trim(),
      overdueOnly: filter.overdueOnly

  }

  axios.get('/api/admin/payments', { params })
      .then(res => {
        payments.value = res.data.result.content
        totalPages.value = res.data.result.totalPages
      })
      .catch(err => {
        console.error('결제 목록 조회 실패:', err)
      })
}

function goToPage(page) {
  currentPage.value = page
  fetchPayments()
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchPayments()
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchPayments()
  }
}

function filterList() {
  currentPage.value = 1
  fetchPayments()
}

onMounted(() => {
  fetchPayments()
})
</script>

<template>
  <div class="screen bg-light">
      <!-- 필터 영역 -->
      <div class="bg-white rounded shadow-sm p-3 mb-3">
        <div class="row g-3 align-items-center">
          <div class="col-auto">
            <div class="input-group input-group-sm">
              <label class="input-group-text">정렬</label>
              <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                {{ filter.sort }}
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" @click.prevent="filter.sort = '최신 결제 순'">최신 결제 순</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="filter.sort = '최신 미결제 순'">최신 미결제 순</a></li>
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
          <div class="col-auto">
            <div class="input-group input-group-sm">
              <label class="input-group-text">검색 구분</label>
              <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                {{ filter.searchType }}
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" @click.prevent="filter.searchType = 'Payment ID'">Payment ID</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="filter.searchType = '사용자명'">사용자명</a></li>
              </ul>
              <input type="text" class="form-control" v-model="filter.searchQuery" placeholder="검색어">
            </div>
          </div>
          <div class="col-auto form-check">
            <input class="form-check-input" type="checkbox" id="overdueCheck" v-model="filter.overdueOnly">
            <label class="form-check-label" for="overdueCheck">연체된 항목만</label>
          </div>
          <div class="col-auto">
            <button class="btn btn-primary btn-sm" @click="filterList">검색</button>
          </div>
        </div>
      </div>

      <!-- 메인 카드 영역 -->
      <div class="bg-white rounded shadow-sm p-3">
        <div class="text-center border-top pt-3 mt-3 mb-3">
          <h5 class="fw-bold mb-0">결제 및 연체 관리</h5>
        </div>

        <!-- 테이블 -->
        <table class="table table-bordered table-hover text-center">
          <thead class="table-light">
          <tr>
            <th>결제번호</th>
            <th>사용자명</th>
            <th>결제금액</th>
            <th>결제상태</th>
            <th>연체여부</th>
            <th>결제일자</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="payment in payments" :key="payment.paymentId">
            <td>{{ payment.paymentId }}</td>
            <td>{{ payment.userName }}</td>
            <td>{{ payment.amount }}</td>
            <td>{{ payment.status }}</td>
            <td>{{ payment.overdue }}</td>
            <td>{{ payment.paymentDate }}</td>
          </tr>
          <tr v-if="payments.length === 0">
            <td colspan="6" class="text-center">검색 결과가 없습니다.</td>
          </tr>
          </tbody>
        </table>

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
    </div>
</template>

<style scoped>
.screen {
  background-color: #f8f9fa;
  padding: 20px;
  min-height: 100vh;
}
.table th {
  background-color: #fff5ee;
  vertical-align: middle;
  text-align: center;
}
.table td {
  vertical-align: middle;
  text-align: center;
}
</style>