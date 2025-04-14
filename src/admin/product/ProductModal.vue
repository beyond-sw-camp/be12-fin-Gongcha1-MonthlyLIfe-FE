<script setup>
import { reactive, ref } from 'vue'
import { useProductStore } from '../../store/useProductStore'

const emit = defineEmits(['registered'])
const store = useProductStore()

const form = reactive({
  name: '',
  code: '',
  description: '',
  manufacturer: '',
  productImages: [],
})

const newImageUrl = ref('')

const addImage = () => {
  if (newImageUrl.value.trim()) {
    form.productImages.push({ productImgUrl: newImageUrl.value })
    newImageUrl.value = ''
  }
}

const submit = async () => {
  try {
    await store.registerProduct(form)
    alert('등록 완료!')
    emit('registered') // 부모에게 목록 리프레시 알림
    // 초기화
    form.name = ''
    form.code = ''
    form.description = ''
    form.manufacturer = ''
    form.productImages = []
  } catch (e) {
    console.error(e)
    alert('등록 실패')
  }
}
</script>

<template>
  <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="registerModalLabel">상품 등록</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <div class="mb-2">
            <label class="form-label">상품명</label>
            <input v-model="form.name" type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="form-label">상품 코드</label>
            <input v-model="form.code" type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="form-label">설명</label>
            <textarea v-model="form.description" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="form-label">제조사</label>
            <input v-model="form.manufacturer" type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="form-label">이미지 URL</label>
            <input v-model="newImageUrl" type="text" class="form-control mb-1" placeholder="https://..." />
            <button class="btn btn-outline-secondary btn-sm" @click="addImage">추가</button>
            <ul class="mt-2">
              <li v-for="(img, i) in form.productImages" :key="i">{{ img.productImgUrl }}</li>
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
