<template>
  <div
    class="modal fade"
    :class="{ show: show }"
    tabindex="-1"
    :style="show ? 'display: block;' : ''"
    @click.self="close"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">판매상품 수정</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <!-- 이름/설명 -->
          <div class="mb-3">
            <label class="form-label">판매 상품명</label>
            <input v-model="edited.name" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">설명</label>
            <textarea v-model="edited.description" class="form-control" rows="3"></textarea>
          </div>

          <!-- 가격 정보 -->
          <div class="mb-3">
            <h6>가격 정보</h6>
            <div
              v-for="(p, i) in edited.salePrices"
              :key="p.period"
              class="input-group mb-2"
              style="max-width: 300px;"
            >
              <span class="input-group-text">{{ p.period }}개월</span>
              <input
                v-model.number="edited.salePrices[i].price"
                type="number"
                class="form-control"
              />
              <span class="input-group-text">원</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">
            취소
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="save"
            :disabled="saving"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'
import { useSaleStore } from '../../store/useSaleStore'

const props = defineProps({
  sale: { type: Object, required: true },
  show: { type: Boolean, default: false }
})
const emit = defineEmits(['update:show', 'updated', 'error'])

const saleStore = useSaleStore()
const saving = ref(false)

// 편집용 로컬 상태
const edited = reactive({
  name: '',
  description: '',
  // 가격 리스트
  salePrices: []
})

// props.sale이 바뀔 때마다 복사
watch(() => props.sale, s => {
  if (s) {
    edited.name = s.name
    edited.description = s.description || ''
    // priceList 는 GetSaleListRes 에도, GetSaleDetailRes 에도 동일하게 들어있습니다.
    edited.salePrices = (s.priceList || []).map(p => ({ period: p.period, price: p.price }))
  }
}, { immediate: true })

function close() {
  emit('update:show', false)
}

async function save() {
  saving.value = true
  try {
    // 백엔드에 PUT /sale/{saleIdx} 요청
    await saleStore.updateSale(props.sale.categoryIdx, props.sale.idx, {
      categoryIdx: props.sale.categoryIdx,
      name: edited.name,
      description: edited.description,
      salePrices: edited.salePrices
    })
    emit('updated')
    close()
  } catch (err) {
    console.error(err)
    emit('error', err)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
