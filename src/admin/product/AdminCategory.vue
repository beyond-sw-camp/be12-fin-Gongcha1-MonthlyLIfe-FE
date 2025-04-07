<script setup>
import { ref } from 'vue'

// [1] 카테고리 관리
const categories = ref([])
const isAddingCategory = ref(false)
const tempCategory = ref('')
const selectedTopic = ref('') // 주제 선택

// [2] 카테고리 설정
const categoryId = ref(27)
const newCategoryName = ref('')
const showPostCount = ref('표시합니다')
const showNewPost = ref('표시합니다')
const newPostDuration = ref('3일')

// 추가 시작
const startAdding = () => {
  isAddingCategory.value = true
  tempCategory.value = ''
  selectedTopic.value = ''
}

// 추가 확인
const confirmAdd = () => {
  const trimmed = tempCategory.value.trim()
  if (trimmed) {
    // 주제와 함께 저장
    categories.value.push({
      name: trimmed,
      topic: selectedTopic.value || '주제 없음'
    })
    isAddingCategory.value = false
    tempCategory.value = ''
    selectedTopic.value = ''
  } else {
    alert('추가할 카테고리명을 입력해주세요.')
  }
}

// 추가 취소
const cancelAdd = () => {
  isAddingCategory.value = false
  tempCategory.value = ''
  selectedTopic.value = ''
}

// 삭제
const removeCategory = (index) => {
  categories.value.splice(index, 1)
}

// 설정 저장
const saveCategorySettings = () => {
  alert(`카테고리 설정 저장됨
  - 글 수: ${showPostCount.value}
  - 새 글 여부: ${showNewPost.value}
  - 기준일: ${newPostDuration.value}`)
}
</script>

<template>
  <div class="border rounded p-4 bg-light test2">
    <div class="bg-white py-5">
      <h5 class="fw-bold mb-3">카테고리 관리</h5>
      <div class="container my-4">
        <!-- 카테고리 관리 -->
        <div class="p-4 mb-4 border bg-white">
          <p class="text-muted">
            카테고리 순서를 변경하고 하위 연결을 설정할 수 없습니다.
            <a href="#" class="ms-1 text-danger">자세히 보기</a>
          </p>
          <p class="text-muted">드래그 앤 드롭으로 카테고리 순서를 변경할 수 있습니다.</p>

          <!-- 목록 -->
          <div class="mb-3">
            <label class="form-label fw-semibold">분류 전체보기</label>
            <ul class="list-group">
              <!-- 기존 카테고리 목록 -->
              <li
                v-for="(category, index) in categories"
                :key="index"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  {{ category.name }}
                  <small class="text-muted ms-2">({{ category.topic }})</small>
                </div>
                <button class="btn btn-sm btn-danger" @click="removeCategory(index)">삭제</button>
              </li>

              <!-- 추가 입력창 -->
              <li v-if="isAddingCategory" class="list-group-item d-flex align-items-center flex-wrap gap-2">
                <input
                  type="text"
                  class="form-control"
                  v-model="tempCategory"
                  placeholder="카테고리명을 입력하세요"
                  style="max-width: 300px"
                />

                <select class="form-select" v-model="selectedTopic" style="max-width: 200px;">
                  <option value="">주제 없음</option>
                  <option>냉장고</option>
                  <option>세탁기</option>
                  <option>공기청정기</option>
                  <option>청소기</option>
                  <option>전자레인지</option>
                  <option>커피머신</option>
                </select>

                <button class="btn btn-outline-secondary btn-sm" @click="cancelAdd">취소</button>
                <button class="btn btn-dark btn-sm" @click="confirmAdd">확인</button>
              </li>

              <!-- 비어있을 때 -->
              <li v-if="categories.length === 0 && !isAddingCategory" class="list-group-item text-muted">
                아직 추가된 카테고리가 없습니다.
              </li>
            </ul>
          </div>

          <!-- 추가 버튼 -->
          <div
            class="px-3 py-2 bg-light border rounded d-flex align-items-center mb-3"
            role="button"
            @click="startAdding"
            v-if="!isAddingCategory"
          >
            <span class="fw-bold text-danger">+ 카테고리 추가</span>
            <span class="ms-auto text-muted">{{ categories.length }}/500</span>
          </div>

          <div class="text-end">
            <button class="btn btn-dark" @click="confirmAdd">변경사항 저장</button>
          </div>
        </div>

        <!-- 카테고리 설정 -->
        <h5 class="fw-bold mb-3">카테고리 설정</h5>
        <div class="p-4 border bg-white">
          <!-- ID -->
          <div class="row mb-3">
            <label class="col-sm-2 col-form-label fw-semibold">카테고리 ID</label>
            <div class="col-sm-10 d-flex align-items-center">
              <input type="text" class="form-control me-2" v-model="categoryId" style="max-width: 100px" />
              <span>글자까지 표시됩니다.</span>
            </div>
          </div>

          <!-- 글 수 표시 여부 -->
          <div class="row mb-3">
            <label class="col-sm-2 col-form-label fw-semibold">카테고리별 글 수</label>
            <div class="col-sm-10">
              <select class="form-select" v-model="showPostCount" style="max-width: 300px;">
                <option>표시합니다</option>
                <option>표시하지 않습니다</option>
              </select>
            </div>
          </div>

          <!-- 새 글 여부 표시 -->
          <div class="row mb-3">
            <label class="col-sm-2 col-form-label fw-semibold">카테고리에 새 글 발생 여부</label>
            <div class="col-sm-10">
              <select class="form-select" v-model="showNewPost" style="max-width: 300px;">
                <option>표시합니다</option>
                <option>표시하지 않습니다</option>
              </select>
            </div>
          </div>

          <!-- 조건 드롭다운 -->
          <div class="row mb-3" v-if="showNewPost === '표시합니다'">
            <label class="col-sm-2 col-form-label fw-semibold">·</label>
            <div class="col-sm-10 d-flex align-items-center">
              <select class="form-select me-2" v-model="newPostDuration" style="width: 100px;">
                <option>1일</option>
                <option>3일</option>
                <option>5일</option>
              </select>
              <span class="text-muted">이내에 발생된 글이 있으면 새 글 여부를 표시합니다.</span>
            </div>
          </div>

          <!-- 저장 버튼 -->
          <div class="text-end">
            <button class="btn btn-dark" @click="saveCategorySettings">변경사항 저장</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.test2 {
  width: 990.4px;
}
</style>
