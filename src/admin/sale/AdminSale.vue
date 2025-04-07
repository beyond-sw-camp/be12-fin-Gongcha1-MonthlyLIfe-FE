<script setup>
import { ref, reactive, computed } from 'vue'

// 오늘 날짜 (YYYY-MM-DD 형식)
const today = new Date().toISOString().split("T")[0]

// 검색 조건
const search = reactive({
  ordersId: '',
  ordersName: '',
  seller: '' // 추후 필요에 따라 활용하세요.
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
const filteredData = computed(() => {
  return orders.value.filter((item) => {
    return (
        item.orderNo.includes(search.ordersId) &&
        item.customerName.includes(search.ordersName)
        // 필요에 따라 search.seller 조건을 추가하세요.
    )
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
        <!-- 바깥 큰 상자 -->
        <div class="border rounded p-4 bg-light">
          <!-- 옵션 영역 -->
          <div class="bg-white rounded shadow-sm p-3 mb-3">
            <div class="d-flex flex-wrap gap-3 align-items-start">
              <!-- 옵션 폼 그룹 -->
              <div class="flex-grow-1">
                <!-- 1행: 날짜 및 검색 구분 -->
                <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                  <div class="d-flex align-items-center gap-1">
                    <label for="inputDate" class="form-label mb-0">기간</label>
                    <div class="dropdown">
                      <button class="btn btn-sm btn-secondary dropdown-toggle" id="inputDate" type="button" data-bs-toggle="dropdown">
                        상품 등록일
                      </button>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">상품 등록일</a></li>
                        <li><a class="dropdown-item" href="#">상품 등록일2</a></li>
                      </ul>
                    </div>
                    <button type="button" class="btn btn-sm btn-primary">전체</button>
                  </div>
                  <div class="d-flex align-items-center gap-1">
                    <input type="date" class="form-control form-control-sm" :value="today" style="max-width: 140px;">
                    <span>~</span>
                    <input type="date" class="form-control form-control-sm" :value="today" style="max-width: 140px;">
                  </div>
                  <div class="d-flex align-items-center gap-1 flex-nowrap">
                    <label class="form-label mb-0 text-nowrap" style="font-size: 12px">검색 구분</label>
                    <div class="dropdown">
                      <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        통합 검색
                      </button>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">상품 등록일</a></li>
                      </ul>
                    </div>
                    <input type="text" class="form-control form-control-sm" placeholder="검색어" style="max-width: 200px;">
                  </div>
                </div>
                <!-- 2행: 창고 선택 및 상품 수량 -->
                <div class="d-flex flex-wrap align-items-center gap-2">
                  <div class="d-flex align-items-center gap-1">
                    <label class="form-label mb-0">창고 선택</label>
                    <div class="input-group input-group-sm" style="max-width: 200px;">
                      <input type="text" class="form-control" placeholder="지역 선택">
                      <button class="btn btn-outline-secondary" type="button">Button</button>
                    </div>
                    <div class="input-group input-group-sm" style="max-width: 200px;">
                      <input type="text" class="form-control" placeholder="창고 선택">
                      <button class="btn btn-outline-secondary" type="button">Button</button>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-1">
                    <label class="form-label mb-0">상품 수량</label>
                    <div class="dropdown">
                      <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        현재 상품
                      </button>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">수리중</a></li>
                        <li><a class="dropdown-item" href="#">대여중</a></li>
                        <li><a class="dropdown-item" href="#">가용 재고</a></li>
                      </ul>
                    </div>
                    <input type="text" class="form-control form-control-sm" placeholder="최소 수량" style="max-width: 100px;">
                    <span>개 이상</span>
                    <input type="text" class="form-control form-control-sm" placeholder="최대 수량" style="max-width: 100px;">
                    <span>개 이하</span>
                  </div>
                </div>
              </div>
              <!-- 검색 버튼 -->
              <div class="align-self-start">
                <button type="submit" class="btn btn-primary" @click="filterList">검색</button>
              </div>
            </div>
          </div>
          <!-- 가운데 정렬된 제목 (필요 시 추가) -->
        </div>
        <div class="p-3">
          <div class="text-center border-top pt-3 mt-3 mb-2">
            <h5 class="fw-bold mb-0">예약 관리</h5>
          </div>
          <!-- 테이블 -->
          <table class="table table-bordered table-hover subscribe-table">
            <thead class="table-header">
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
                v-for="(order, idx) in paginatedData"
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
