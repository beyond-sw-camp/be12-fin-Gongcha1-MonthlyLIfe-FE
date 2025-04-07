<script setup>

import {ref} from "vue";

const today = new Date().toISOString().split("T")[0]
const users = ref([
  {
    id: 'gildong2',
    email: 'honggildong@email.com',
    name: '홍길동',
    address1: '서울',
    isOngoing: 'N',
    tags: ['1인가구', '대학생'],
    overdue: 'N',
    subscriptionCount: 3,
    joined: '2020-05-16 11:15:53',
  },

  {
    id: 'ggukjeong',
    email: 'ggukjeong@email.com',
    name: '임꺽정',
    address1: '부산',
    isOngoing: 'Y',
    tags: ['1인사무실'],
    overdue: 'N',
    subscriptionCount: 1,
    joined: '2023-05-16 11:15:53',
  },
  // 더 추가 가능
])

</script>

<template>

  <div class="screen text-nowrap">
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
                <div class="d-flex flex-nowrap align-items-center gap-2 mb-2">
                  <div class="d-flex align-items-center gap-1">
                    <label for="inputDate" class="form-label mb-0" >정렬</label>
                    <div class="dropdown">
                      <button class="btn btn-sm btn-secondary dropdown-toggle" id="inputDate" type="button" data-bs-toggle="dropdown">
                        최신 회원가입 순
                      </button>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">최신 회원가입 순</a></li>
                        <li><a class="dropdown-item" href="#">최신 구독 순</a></li>
                        <li><a class="dropdown-item" href="#">전체 구독 순</a></li>
                      </ul>
                    </div>
                    <button type="button" class="btn btn-sm btn-secondary">전체</button>
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
                        <li><a class="dropdown-item" href="#">ID</a></li>
                        <li><a class="dropdown-item" href="#">주소</a></li>
                      </ul>
                    </div>
                    <input type="text" class="form-control form-control-sm" placeholder="검색어" style="max-width: 200px;">
                  </div>
                </div>

                <!-- 2행 -->
                <div class="d-flex flex-nowrap align-items-center gap-2">
                  <div class="d-flex align-items-center gap-1">
                    <label class="form-label mb-0">태그 검색</label>
                    <div class="dropdown">
                      <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        태그
                      </button>
                      <ul class="dropdown-menu">
                        <li>
                          <div class="dropdown-item">
                          <input class="form-check-input" type="checkbox" id="check1">
                          <label class="form-check-label" for="check1">1인 사무실</label>
                          </div>
                        </li>
                        <li>
                          <div class="dropdown-item">
                            <input class="form-check-input" type="checkbox" id="check2">
                            <label class="form-check-label" for="check2">2인가구</label>
                          </div>
                        </li>
                        <li>
                          <div class="dropdown-item">
                            <input class="form-check-input" type="checkbox" id="check3">
                            <label class="form-check-label" for="check3">1인사무실</label>
                          </div>
                        </li>
                      </ul>
                      <button class="btn btn-sm btn-secondory">초기화</button>
                    </div>


                    <input class="form-check-input" type="checkbox" id="check4">
                    <label class="form-check-label" for="check4">연체된 사용자</label>

                  </div>
                </div>
              </div>

              <!-- 검색 버튼 (오른쪽) -->
              <div class="align-self-end">
                <button type="submit" class="btn btn-secondary">검색</button>
              </div>
            </div>
          </div>

          <!-- 🔸 가운데 정렬된 제목 -->

        </div>
        <div class="p-3">

          <div class="text-center border-top pt-3 mt-3 mb-2">
            <h5 class="fw-bold mb-0">사용자 관리</h5>
          </div>
          <!-- 테이블 -->
          <table class="table table-bordered table-hover text-center">
            <thead class="custom-thead" >
            <tr>
              <th>ID</th>
              <th>이메일</th>
              <th>이름</th>
              <th>주소</th>
              <th>현재 구독 중</th>
              <th>보유태그</th>
              <th>연체여부</th>
              <th>누적구독횟수</th>
              <th>가입일자</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in users" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.address1 }}</td>
              <td>{{ item.isOngoing }}</td>
              <td>{{ item.tags }}</td>
              <td>{{ item.overdue }}</td>
              <td>{{ item.subscriptionCount }}</td>
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
button {
  font-size: 12px
}
.table {
  font-size: 14px;
}

.custom-thead th {
  background-color: coral !important;
}
</style>