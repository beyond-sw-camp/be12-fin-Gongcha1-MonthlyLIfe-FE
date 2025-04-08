<script setup>
import { ref, reactive, computed } from 'vue'

// 오늘 날짜 (참고용)
const today = new Date().toISOString().split("T")[0]

// 검색 조건 (배송 스케줄 관리에 맞춤)
// 날짜 범위와 검색 구분(주문번호, 주문자명, 주문상태), 검색어
const search = reactive({
  dateFrom: '',
  dateTo: '',
  searchType: '주문번호', // 옵션: '주문번호', '주문자명', '주문상태'
  searchQuery: ''
})

// 테이블 데이터 관련
const currentPage = ref(1)
const pageSize = 10

// 주문 목록 (예시 데이터)
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

// 필터된 결과 (검색 조건에 맞게 필터)
// - 날짜 범위: 주문일시(YYYY-MM-DD) 기준 필터링
// - 검색 구분에 따라 주문번호, 주문자명, 주문상태 필터 적용
const filteredData = computed(() => {
  return orders.value.filter(item => {
    let match = true
    // 날짜 필터: item.date의 앞 10자리가 주문일시(YYYY-MM-DD)
    const orderDate = item.date.substring(0, 10)
    if (search.dateFrom && orderDate < search.dateFrom) {
      match = false
    }
    if (search.dateTo && orderDate > search.dateTo) {
      match = false
    }
    // 검색어 필터
    if (search.searchQuery) {
      if (search.searchType === '주문번호' && !item.orderNo.includes(search.searchQuery)) {
        match = false
      } else if (search.searchType === '주문자명' && !item.customerName.includes(search.searchQuery)) {
        match = false
      } else if (search.searchType === '주문상태' && !item.status.includes(search.searchQuery)) {
        match = false
      }
    }
    return match
  })
})

// 페이지네이션 데이터
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredData.value.slice(start, start + pageSize)
})

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / pageSize)
})

// 검색 조건 변경 시 페이지 초기화
function filterList() {
  currentPage.value = 1
}

// 특정 페이지로 이동
function goToPage(page) {
  currentPage.value = page
}

// 이전 페이지로 이동
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// 다음 페이지로 이동
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// 주문 클릭 시 주문 상세 모달 열기 (예시)
function openOrderModal(order) {
  alert('주문 상세 보기: ' + order.orderNo)
}
</script>

<template>
  <div class="screen">
    <div class="root-wrapper">
      <div class="root">
        <!-- 상단 옵션 영역 -->
        <div class="border rounded p-4 bg-light">
          <div class="bg-white rounded shadow-sm p-3 mb-3">
            <div class="d-flex flex-wrap gap-3 align-items-center">
              <!-- 옵션 폼 그룹 -->
              <div class="flex-grow-1">
                <!-- 1행: 주문일시(기간) 및 검색 구분 -->
                <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                  <!-- 주문일시(기간) 선택 -->
                  <div class="d-flex align-items-center gap-1">
                    <label class="form-label mb-0 text-nowrap">주문일시</label>
                    <input type="date" class="form-control form-control-sm" v-model="search.dateFrom" style="max-width: 140px;">
                    <span>~</span>
                    <input type="date" class="form-control form-control-sm" v-model="search.dateTo" style="max-width: 140px;">
                  </div>
                  <!-- 검색 구분 및 검색어 입력 -->
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
          <!-- 필요 시 가운데 정렬된 제목 등 추가 -->
        </div>
        <div class="p-3">
          <div class="text-center border-top pt-3 mt-3 mb-2">
            <h5 class="fw-bold mb-0">배송 스케줄 관리</h5>
          </div>
          <!-- 주문 테이블 -->
          <table class="table table-bordered table-hover subscribe-table">
            <thead class="table-header custom-thead">
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
            <tr v-for="(order, idx) in paginatedData" :key="idx" style="cursor: pointer;" @click="openOrderModal(order)">
              <td>{{ order.orderNo }}</td>
              <td>{{ order.customerName }}</td>
              <td>{{ order.amount }}</td>
              <td>{{ order.status }}</td>
              <td>{{ order.memo }}</td>
              <td>{{ order.date }}</td>
            </tr>
            </tbody>
          </table>
          <!-- 페이지네이션 -->
          <nav class="d-flex justify-content-center">
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
.custom-thead th {
  background-color: #DFF0D8 !important;
}
</style>
