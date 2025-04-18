<script setup>
import { ref, onMounted } from 'vue'

const postcode = ref('')
const address1 = ref('')
const address2 = ref('')

const openDaumPostcode = () => {
  new window.daum.Postcode({
    oncomplete: function (data) {
      postcode.value = data.zonecode
      address1.value = data.roadAddress

      // 상세주소로 포커스 이동
      setTimeout(() => {
        document.getElementById('address2')?.focus()
      }, 0)
    }
  }).open()
}

onMounted(() => {
  const script = document.createElement('script')
  script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
  script.async = true
  document.body.appendChild(script)
})

defineExpose({
  postcode,
  address1,
  address2
})
</script>

<template>
  <div class="container mt-4 text-nowrap">
    <div class="mb-3 row">
      <label for="postcode" class="col-sm-2 col-form-label">우편번호</label>
      <div class="col-sm-8">
        <input type="text" id="postcode" class="form-control" v-model="postcode" readonly />
      </div>
      <div class="col-sm-2">
        <button class="btn btn-outline-secondary" @click="openDaumPostcode">검색</button>
      </div>
    </div>

    <div class="mb-3 row">
      <label for="address1" class="col-sm-2 col-form-label">도로명 주소</label>
      <div class="col-sm">
        <input type="text" id="address1" class="form-control" v-model="address1" readonly />
      </div>
    </div>

    <div class="mb-3 row">
      <label for="address2" class="col-sm-2 col-form-label">상세 주소</label>
      <div class="col-sm">
        <input type="text" id="address2" class="form-control" v-model="address2" />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
