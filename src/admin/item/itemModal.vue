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
          <div class="mb-2">
            <label class="form-label">제조사</label>
            <input v-model="form.manufacturer" type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="form-label">상태(Condition)</label>
            <input v-model="form.condition" type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="form-label">위치(Location)</label>
            <input v-model="form.location" type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="form-label">수량(Count)</label>
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
  margin-bottom: .5rem
}
</style>