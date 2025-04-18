<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'

// 오늘 날짜
const today = new Date().toISOString().split("T")[0]

// 검색 조건
const search = reactive({
  dateFrom: '',
  dateTo: '',
  searchType: '주문번호', // '주문번호', '주문자명', '주문상태'
  searchQuery: ''
})

// 페이징 관련
const currentPage = ref(1)
const pageSize = 10
const totalPages = ref(1)

// 데이터
const orders = ref([])

// 상태
const loading = ref(false)
const error = ref(null)

// 데이터 요청 함수
async function fetchOrders() {
  loading.value = true
  error.value = null

  try {
    const response = await axios.get('/api/admin/delivery-by-page', {
      params: {
        page: currentPage.value - 1,
        size: pageSize,
      }
    })

    const result = response.data.result // ✅ 여기서 result 추출

    orders.value = result.content
    totalPages.value = result.totalPages
  } catch (err) {
    console.error(err)
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
}

// 페이지 이동
function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchOrders()
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchOrders()
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchOrders()
  }
}

// 필터는 서버 연동이므로 그냥 fetchOrders() 로 새로고침
function filterList() {
  currentPage.value = 1
  fetchOrders()
}

// 주문 클릭 시 모달 열기
function openOrderModal(order) {
  alert('주문 상세 보기: ' + order.subscribeIdx)
}

// 초기 로딩
onMounted(fetchOrders)
</script>

<template>
  <div class="screen">
    <div class="root-wrapper">
      <div class="root">
        <!-- 상단 옵션 -->
        <div class="border rounded p-4 bg-light">
          <div class="bg-white rounded shadow-sm p-3 mb-3">
            <div class="d-flex flex-wrap gap-3 align-items-center">
              <div class="flex-grow-1">
                <!-- 1행 -->
                <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                  <div class="d-flex align-items-center gap-1">
                    <label class="form-label mb-0 text-nowrap">주문일시</label>
                    <input type="date" class="form-control form-control-sm" v-model="search.dateFrom" style="max-width: 140px;">
                    <span>~</span>
                    <input type="date" class="form-control form-control-sm" v-model="search.dateTo" style="max-width: 140px;">
                  </div>
                  <div class="d-flex align-items-center gap-1 flex-nowrap">
                    <label class="form-label mb-0 text-nowrap" style="font-size: 12px">검색 구분</label>
                    <div class="dropdown">
                      <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        {{ search.searchType }}
                      </button>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#" @click.prevent="search.searchType = '주문번호'">주문번호</a></li>
                        <li><a class="dropdown-item" href="#" @click.prevent="search.searchType = '주문자명'">주문자명</a></li>
                        <li><a class="dropdown-item" href="#" @click.prevent="search.searchType = '주문상태'">주문상태</a></li>
                      </ul>
                    </div>
                    <input type="text" class="form-control form-control-sm" v-model="search.searchQuery" placeholder="검색어" style="max-width: 200px;">
                  </div>
                </div>
              </div>

              <!-- 검색 버튼 -->
              <div class="align-self-start">
                <button type="submit" class="btn btn-primary" @click="filterList">검색</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 데이터 영역 -->
        <div class="p-3">
          <div class="text-center border-top pt-3 mt-3 mb-2">
            <h5 class="fw-bold mb-0">배송 스케줄 관리</h5>
          </div>

          <!-- 에러 -->
          <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>

          <!-- 로딩 -->
          <div v-if="loading" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <!-- 테이블 -->
          <table v-if="!loading" class="table table-bordered table-hover subscribe-table">
            <thead class="table-header custom-thead">
            <tr style="background-color: #4ea8de">
              <th>주문번호</th>
              <th>주문자명</th>
              <th>주문금액</th>
              <th>주문상태</th>
              <th>연락처</th>
              <th>주문일시</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="orders.length === 0">
              <td colspan="6">데이터가 없습니다.</td>
            </tr>
            <tr v-for="order in orders" :key="order.subscribeIdx" style="cursor: pointer;" @click="openOrderModal(order)">
              <td>{{ order.subscribeIdx }}</td>
              <td>{{ order.userName }}</td>
              <td>{{ order.subscribePrice.toLocaleString() }}</td>
              <td>{{ order.deliveryStatus }}</td>
              <td>{{ order.userPhone }}</td>
              <td>{{ order.subscribeDetailCreatedAt.split('T')[0] }}</td>
            </tr>
            </tbody>
          </table>

          <!-- 페이지네이션 -->
          <nav v-if="!loading && orders.length > 0" class="d-flex justify-content-center">
            <ul class="pagination">
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
    </div>
  </div>
</template>

<style scoped>
.root {
  font-size: 12px;
}
.table {
  font-size: 14px;
}
.subscribe-table th {
  background-color: #D9EDF7;
}
</style>
