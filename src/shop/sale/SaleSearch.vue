<script setup>
import { ref } from 'vue'
import { defineEmits } from 'vue'

const emit = defineEmits(['search'])

// 로컬 상태
const searchInput = ref('')
const selectedGrade = ref(null)
const grades = ['S급', 'A급', 'B급', 'C급']

// 검색 버튼 클릭 시
const onSearch = () => {
  emit('search', { keyword: searchInput.value, grade: selectedGrade.value })
}

// 초기화 버튼 클릭 시
const resetAll = () => {
  searchInput.value = ''
  selectedGrade.value = null
  emit('search', { keyword: '', grade: null })
}

// 등급 토글 및 자동 검색
const selectGrade = (g) => {
  selectedGrade.value = selectedGrade.value === g ? null : g
  emit('search', { keyword: searchInput.value, grade: selectedGrade.value })
}
</script>

<template>
  <div class="sale-search">
    <!-- 검색창 -->
    <div class="search-bar d-flex mb-3">
      <input
        v-model="searchInput"
        type="text"
        class="form-control"
        placeholder="🔍 상품명 또는 키워드 검색"
        @keyup.enter="onSearch"
      />
      <button class="btn btn-primary ms-2" @click="onSearch">검색</button>
    </div>

    <!-- 헤더: 아이콘 + 타이틀, 초기화 버튼 -->
    <div class="filter-header d-flex justify-content-between align-items-center mb-3">
      <div class="d-flex align-items-center">
        <i class="bi bi-funnel-fill text-danger me-2"></i>
        <span class="filter-title">필터로 원하는 상품을 찾으세요</span>
      </div>
      <button class="btn btn-link reset-btn d-flex align-items-center" @click="resetAll">
        <font-awesome-icon :icon="['fas', 'rotate-right']" class="me-1" style="cursor: pointer;" />
        초기화
      </button>
    </div>

    <!-- 상품 등급 필터 행 -->
    <div class="filter-row d-flex align-items-center">
      <small class="filter-label me-3">상품 등급</small>
      <div class="filter-buttons d-flex flex-wrap">
        <button
          v-for="g in grades"
          :key="g"
          type="button"
          class="btn grade-btn d-flex justify-content-center align-items-center"
          :class="selectedGrade === g ? 'btn-primary' : 'btn-outline-primary'"
          @click="selectGrade(g)"
        >
          {{ g }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sale-search {
  background: #fff;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 1.5rem;
}

/* 검색창 스타일 */
.search-bar {
  gap: 0.5rem;
}

.search-bar input {
  flex: 1;
}

/* 헤더 스타일 */
.filter-header {
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.filter-title {
  font-weight: 600;
  font-size: 1rem;
}

.reset-btn {
  font-size: 0.9rem;
  color: #6c757d;
}

.reset-btn:hover {
  text-decoration: none;
  color: #495057;
}

/* 필터 행 */
.filter-row {
  padding-top: 0.75rem;
}

.filter-label {
  font-size: 0.9rem;
  color: #495057;
}

.filter-buttons {
  gap: 0.5rem;
}

.grade-btn {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  font-size: 0.9rem;
  padding: 0;
}

/* 반응형: 작은 화면 */
@media (max-width: 576px) {
  .search-bar {
    flex-direction: column;
  }

  .filter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .filter-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>