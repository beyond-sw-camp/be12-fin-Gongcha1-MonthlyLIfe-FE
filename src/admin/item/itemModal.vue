<script setup>
import { reactive, ref } from 'vue'
import { defineEmits } from 'vue'
import { useProductStore } from '../../store/useProductStore'
import { Modal } from 'bootstrap'

const emit = defineEmits(['registered'])
const store = useProductStore()

// Form state
const form = reactive({
  name: '',
  code: '',
  description: '',
  descriptionImageUrl: '',
  manufacturer: '',
  condition: '',
  location: '',
  count: 0,
  files: []
})

const fileInput = ref(null)

const onFileChange = e => {
  const files = e.target.files
  if (!files) return
  form.files = [...form.files, ...Array.from(files)]
  e.target.value = null
}

const removeFile = idx => {
  form.files.splice(idx, 1)
}

const submit = async () => {
  try {
    // DTO payload
    const dto = {
      name: form.name,
      code: form.code,
      description: form.description,
      descriptionImageUrl: form.descriptionImageUrl,
      manufacturer: form.manufacturer,
      condition: form.condition,
      location: form.location,
      count: form.count
    }

    const formData = new FormData()
    formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }))
    form.files.forEach(file => formData.append('images', file))

    // 상품 등록 via store
    await store.registerProduct(formData)
    // 목록 갱신
    await store.fetchProductList()
    alert('등록 완료!')
    emit('registered')
    // 모달 닫기
    const modalEl = document.getElementById('registerModal')
    const modalInstance = Modal.getInstance(modalEl) || new Modal(modalEl)
    modalInstance.hide()
    // 폼 초기화
    Object.assign(form, {
      name: '', code: '', description: '',
      manufacturer: '', condition: '',
      location: '', count: 0, files: []
    })
  } catch (err) {
    console.error(err.response?.data || err)
    alert('등록 실패')
  }
}
</script>

<template>
  <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">상품 등록</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-2">
            <label class="form-label">상품 코드</label>
            <input v-model="form.code" type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="form-label">상품명</label>
            <input v-model="form.name" type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="form-label">설명</label>
            <textarea v-model="form.description" class="form-control"></textarea>
          </div>
          <!-- 설명 이미지 URL 입력란 추가 -->
          <div class="mb-2">
            <label class="form-label">설명 이미지 URL</label>
            <input v-model="form.descriptionImageUrl" type="text" class="form-control"
              placeholder="https://example.com/desc-img.png" />
          </div>
          <div class="mb-2">
            <label class="form-label">제조사</label>
            <input v-model="form.manufacturer" type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="form-label fw-bold">상태</label>
            <select v-model="form.condition" class="form-select">
              <option disabled value="">상태 선택</option>
              <option value="S급">S급 (새 상품)</option>
              <option value="A급">A급 (사용감 없음)</option>
              <option value="B급">B급 (사용감 조금)</option>
              <option value="C급">C급 (사용감 많음)</option>
            </select>
          </div>
          <div class="mb-2">
            <label class="form-label fw-bold">위치</label>
            <select v-model="form.location" class="form-select">
              <option disabled value="">위치 선택</option>
              <option>창고</option>
              <option>대여중</option>
              <option>수리중</option>
            </select>
          </div>
          <div class="mb-2">
            <label class="form-label">수량</label>
            <input v-model.number="form.count" type="number" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="form-label">이미지 파일 선택</label>
            <input ref="fileInput" type="file" class="form-control" multiple @change="onFileChange" />
            <ul class="mt-2">
              <li v-for="(file, i) in form.files" :key="file.name + i"
                class="list-group-item d-flex justify-content-between align-items-center">
                {{ file.name }}
                <button type="button" class="btn btn-sm btn-outline-danger" @click="removeFile(i)">
                  삭제
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">취소</button>
          <button type="button" class="btn btn-primary btn-sm" @click="submit">등록</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mb-2 {
  margin-bottom: 0.75rem;
}

.form-label {
  font-weight: 600;
}

ul {
  padding-left: 0;
  list-style: none;
}

ul li {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  background: #f8f9fa;
}

.btn-outline-danger {
  font-size: 0.8rem;
}
</style>