<script setup>
import { ref, reactive, computed } from 'vue'

// 오늘 날짜
const today = new Date().toISOString().split("T")[0]

// 검색 조건
const search = reactive({
  productId: '',
  productName: '',
  seller: '',
})

// 테이블 데이터
const currentPage = ref(1)
const pageSize = 10

const products = ref([
  {
    id: '2020051600004',
    name: 'millet22',
    price: '01012345678',
    stock: '홍길동',
    email: 'honggildong@email.com',
    overdue: 'N',
    subscriptions: 3,
    joined: '2020-05-16 11:15:53',
  },
  // 더 추가 가능
])

// 필터된 결과
const filteredData = computed(() => {
  return products.value.filter((item) => {
    return (
        item.id.includes(search.productId) &&
        item.name.includes(search.productName) &&
        item.price.includes(search.seller)
    )
  })
})

// 페이지네이션
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredData.value.slice(start, start + pageSize)
})

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / pageSize)
})

// 페이지 이동
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

          <!-- 옵션만 따로 감싼 상자 -->
          <div class="bg-white rounded shadow-sm p-3 mb-3">
            <div class="d-flex flex-wrap gap-3 align-items-start">
              <!-- 옵션 폼 그룹 -->
              <div class="flex-grow-1">
                <!-- 1행 -->
                <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                  <div class="d-flex align-items-center gap-1">
                    <label for="inputDate" class="form-label mb-0" >기간</label>
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

                <!-- 2행 -->
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
                    <label class="form-label mb-0">재고 수량</label>
                    <div class="dropdown">
                      <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        현재 재고
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

              <!-- 검색 버튼 (오른쪽) -->
              <div class="align-self-start">
                <button type="submit" class="btn btn-primary">검색</button>
              </div>
            </div>
          </div>

          <!-- 🔸 가운데 정렬된 제목 -->

        </div>
        <div class="p-3">

        <div class="text-center border-top pt-3 mt-3 mb-2">
          <h5 class="fw-bold mb-0">재고관리</h5>
        </div>
        <!-- 테이블 -->
        <table class="table table-bordered table-hover text-center">
          <thead class="custom-thead" >
          <tr>
            <th>상품 ID</th>
            <th>상품명</th>
            <th>판매가</th>
            <th>가용 재고</th>
            <th>이메일</th>
            <th>연체여부</th>
            <th>누적구독횟수</th>
            <th>가입일자</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in paginatedData" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.price }}</td>
            <td>{{ item.stock }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.overdue }}</td>
            <td>{{ item.subscriptions }}</td>
            <td>{{ item.joined }}</td>
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
  font-size: 12px
}
.table {
  font-size: 14px;
}

.custom-thead th {
  background-color: #DFF0D8 !important;
}
</style>
