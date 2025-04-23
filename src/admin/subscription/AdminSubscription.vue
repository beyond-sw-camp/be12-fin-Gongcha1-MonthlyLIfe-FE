<script setup>
import { ref, reactive, computed } from 'vue'

// 오늘 날짜
const today = new Date().toISOString().split("T")[0]

// 검색 조건 (필요에 따라 더 추가 가능)
const search = reactive({
  productId: '',
  productName: '',
  seller: '',
})

// 페이지네이션 및 구독 관리용 샘플 데이터
const currentPage = ref(1)
const pageSize = 10

const products = ref([
  {
    id: 'SUBS202101010001',
    name: '홍길동',
    price: '29,900원',  // 요금제 금액
    stock: '활성',      // 구독 상태 (예: 활성, 해지)
    overdue: 'N',       // 연체 여부 (N: 정상, Y: 연체)
    subscriptions: 3,   // 총 구독 개월 수
    currentMonth: 1,    // 현재 진행중인 구독 월
    joined: '2021-01-01 09:30:00',
    startDate: '2021-01-01', // 구독 시작 날짜
    endDate: '2021-03-31',   // 구독 종료 날짜
  },
  {
    id: 'SUBS202102020002',
    name: '이영희',
    price: '34,900원',
    stock: '해지',
    overdue: 'Y',
    subscriptions: 6,
    currentMonth: 4,
    joined: '2021-02-02 10:45:00',
    startDate: '2021-02-02',
    endDate: '2021-07-31',
  },
  {
    id: 'SUBS202103150003',
    name: '박민수',
    price: '39,900원',
    stock: '활성',
    overdue: 'N',
    subscriptions: 9,
    currentMonth: 5,
    joined: '2021-03-15 14:20:00',
    startDate: '2021-03-15',
    endDate: '2021-12-31',
  },
  // 추가 데이터...
])

// 필터된 결과 (검색 조건에 따른 필터링)
const filteredData = computed(() => {
  return products.value.filter((item) => {
    return (
        item.id.includes(search.productId) &&
        item.name.includes(search.productName) &&
        item.price.includes(search.seller)
    )
  })
})

// 페이지네이션 처리
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredData.value.slice(start, start + pageSize)
})

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / pageSize)
})

// 페이지 이동 함수
function filterList() {
  currentPage.value = 1
}

function goToPage(page) {
  currentPage.value = page
}
</script>

<template>
  <div class="screen">
    <div class="root-wrapper">
      <div class="root">
        <!-- 바깥 큰 상자 -->
        <div class="border rounded p-4 bg-light">
          <!-- 옵션 영역 (검색 영역) -->
          <div class="bg-white rounded shadow-sm p-3 mb-3">
            <div class="d-flex flex-wrap gap-3 align-items-start">
              <!-- 옵션 폼 그룹 -->
              <div class="flex-grow-1">
                <!-- 1행: 가입기간 및 검색 구분 -->
                <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                  <div class="d-flex align-items-center gap-1">
                    <label for="inputDate" class="form-label mb-0">가입기간</label>
                    <div class="dropdown">
                      <button class="btn btn-sm btn-secondary dropdown-toggle" id="inputDate" type="button" data-bs-toggle="dropdown">
                        가입일 기준
                      </button>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">가입일 기준</a></li>
                        <li><a class="dropdown-item" href="#">최근 가입순</a></li>
                      </ul>
                    </div>
                    <button type="button" class="btn btn-sm btn-primary">전체 구독</button>
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
                        <li><a class="dropdown-item" href="#">가입일</a></li>
                        <li><a class="dropdown-item" href="#">구독 상태</a></li>
                      </ul>
                    </div>
                    <input type="text" class="form-control form-control-sm" placeholder="검색어 입력" style="max-width: 200px;">
                  </div>
                </div>

                <!-- 2행: 구독 유형 및 구독 개월 -->
                <div class="d-flex flex-wrap align-items-center gap-2">
                  <div class="d-flex align-items-center gap-1">
                    <label class="form-label mb-0">구독 유형</label>
                    <div class="input-group input-group-sm" style="max-width: 200px;">
                      <input type="text" class="form-control" placeholder="서비스 선택">
                      <button class="btn btn-outline-secondary" type="button">보기</button>
                    </div>
                    <div class="input-group input-group-sm" style="max-width: 200px;">
                      <input type="text" class="form-control" placeholder="구독 상태">
                      <button class="btn btn-outline-secondary" type="button">보기</button>
                    </div>
                  </div>

                  <div class="d-flex align-items-center gap-1">
                    <label class="form-label mb-0">구독 개월</label>
                    <div class="dropdown">
                      <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        전체 구독 개월
                      </button>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">1회 이상</a></li>
                        <li><a class="dropdown-item" href="#">5회 이상</a></li>
                        <li><a class="dropdown-item" href="#">10회 이상</a></li>
                      </ul>
                    </div>
                    <input type="text" class="form-control form-control-sm" placeholder="최소 개월" style="max-width: 100px;">
                    <span>개월 이상</span>
                    <input type="text" class="form-control form-control-sm" placeholder="최대 개월" style="max-width: 100px;">
                    <span>개월 이하</span>
                  </div>
                </div>
              </div>

              <!-- 검색 버튼 (오른쪽) -->
              <div class="align-self-start">
                <button type="submit" class="btn btn-primary">검색</button>
              </div>
            </div>
          </div>

          <!-- 가운데 제목 -->
          <div class="text-center border-top pt-3 mt-3 mb-2">
            <h5 class="fw-bold mb-0">구독 관리</h5>
          </div>

          <!-- 테이블 -->
          <table class="table table-bordered table-hover text-center">
            <thead class="custom-thead">
            <tr>
              <th>구독 ID</th>
              <th>구독자명</th>
              <th>요금제</th>
              <th>구독 상태</th>
              <th>연체 여부</th>
              <th>구독 진행</th>
              <th>가입일자</th>
              <th>구독 시작 날짜</th>
              <th>구독 종료 날짜</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in paginatedData" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.stock }}</td>
              <td>{{ item.overdue }}</td>
              <td>{{ item.currentMonth }}/{{ item.subscriptions }}개월차</td>
              <td>{{ item.joined }}</td>
              <td>{{ item.startDate }}</td>
              <td>{{ item.endDate }}</td>
            </tr>
            </tbody>
          </table>

          <!-- 페이지네이션 -->
          <nav class="d-flex justify-content-center">
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="currentPage--">‹</a>
              </li>
              <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
                <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="currentPage++">›</a>
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
.flash-text {
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #d9534f;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}
</style>
