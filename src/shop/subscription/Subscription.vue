<script setup>
import {ref, reactive, computed, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import * as PortOne from "@portone/browser-sdk/v2";
import AddressInput from '../common/component/AddressInput.vue'
import axios from "axios";
import {usePaymentMethodStore} from "../../store/usePaymentMethodStore.js";
import {useSubscribeStore} from "../../store/useSubcribeStore.js";

const router = useRouter();
const route = useRoute();
const paymentMethodStore = usePaymentMethodStore();
const subscribeStore = useSubscribeStore();

const cartItems = ref(
    JSON.parse(decodeURIComponent(route.query.items || '[]'))
)

const addressInputRef = ref(null)

// const promoCode = ref("EXAMPLECODE");
// const promoDiscount = ref(5);
// const promoInput = ref("");

const isDefaultAddress = ref(true);
const receiver = reactive({
  name: "",
  phone: "",
  memo: ""
});

const paymentMethod = ref([]);
const paymentMethodIdx = ref(0);

const totalPrice = computed(() => {
  return cartItems.value.reduce((acc, item) => acc + item.price, 0);
});

onMounted(async () => {
  await paymentMethodStore.getPaymentMethodPage(0, 5);
  paymentMethod.value = paymentMethodStore.methods;
  console.log(paymentMethod.value);
});

// function redeemPromo() {
//   alert("프로모션 코드 적용됨: " + promoInput.value);
// }

const submitCheckout = async () => {

  const { postcode, address1, address2 } = addressInputRef.value;


  const sales = cartItems.value.map(item => ({
    saleIdx: item.saleIdx,
    period: item.period
  }));
  console.log('서버에 보낼 데이터:', {
    sales: sales,
    rentalDelivery: {
      postalCode: postcode,
      address1,
      address2,
      deliveryMemo: receiver.memo,
      recipientName: receiver.name,
      recipientPhone: receiver.phone
    },
    billingKeyIdx: paymentMethodIdx.value
  })
  await subscribeStore.postSubscribe(
      {
        sales: sales,
        rentalDelivery: {
          postalCode: postcode,
          address1,
          address2,
          deliveryMemo: receiver.memo,
          recipientName: receiver.name,
          recipientPhone: receiver.phone
        },
        billingKeyIdx: paymentMethodIdx.value
      }
  );
}

const addPaymentMethod = async () => {
  const issueResponse = await PortOne.requestIssueBillingKey({
    storeId: "store-b71ccbfa-83cf-4cc8-9896-64aa903dda46",
    channelKey: "channel-key-4ba32ba7-1c46-429c-976d-8e90d75b2e0a",
    billingKeyMethod: "CARD",
  });
// 빌링키가 제대로 발급되지 않은 경우 에러 코드가 존재합니다
  if (issueResponse.code !== undefined) {
    return alert(issueResponse.message);
  }

  console.log(issueResponse);
// 고객사 서버에 빌링키를 전달합니다
  const response = await axios
      .post(`/api/payment/method`,
          {
            billingKey: issueResponse.billingKey,
          }
      );
  if (!response.data.isSuccess) throw new Error(`response: ${await response.json()}`);

  await paymentMethodStore.getPaymentMethodPage(0, 5);
  paymentMethod.value = paymentMethodStore.methods
}

// function formatCurrency(amount) {
//   if (amount === undefined || amount === null) {
//     return "0원";
//   }
//   return amount.toLocaleString() + "원";
// }
</script>


<template>
  <div class="container py-5 checkout-container">
    <div class="row g-5">
      <!-- 장바구니 요약 컬럼 -->
      <div class="col-md-5 col-lg-4 order-md-last">
        <h4 class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-primary fw-bold">장바구니</span>
          <span class="badge bg-primary rounded-pill">{{ cartItems.length }}</span>
        </h4>
        <ul class="list-group mb-3">
          <li
              v-for="(item, idx) in cartItems"
              :key="idx"
              class="list-group-item d-flex justify-content-between lh-sm"
          >
            <div>
              <h6 class="my-0">{{ item.name }}</h6>
              <small class="text-muted">구독 기간 {{ item.period }}개월</small>
            </div>
            <span class="text-muted">₩{{ item.price }}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>총 합계</span>
            <strong>₩{{ totalPrice }}</strong>
          </li>
        </ul>

      </div>


      <!-- 청구 주소 및 결제 컬럼 -->
      <div class="col-md-7 col-lg-8">

        <div>
          <!-- 결제정보 타이틀 -->
          <h4 class="fw-bold mb-3">결제정보</h4>

          <!-- 결제수단 -->
          <table class="table table-bordered align-middle">
            <tbody>
<!--            &lt;!&ndash; 총상품가격 &ndash;&gt;-->
<!--            <tr>-->
<!--              <th class="text-muted" style="width: 150px;">총상품가격</th>-->
<!--              <td>{{ formatCurrency(totalPrice) }}</td>-->
<!--            </tr>-->

<!--            &lt;!&ndash; 즉시할인 &ndash;&gt;-->
<!--            <tr>-->
<!--              <th class="text-muted">즉시할인</th>-->
<!--              <td>{{ formatCurrency(discount) }}</td>-->
<!--            </tr>-->


<!--            &lt;!&ndash; 배송비 &ndash;&gt;-->
<!--            <tr>-->
<!--              <th class="text-muted">배송비</th>-->
<!--              <td>{{ formatCurrency(shippingCost) }}</td>-->
<!--            </tr>-->


            <!-- 총결제금액 -->
            <tr>
              <th class="text-muted">총결제금액</th>
              <td>{{ totalPrice }}</td>
            </tr>

            <!-- 결제방식 -->
            <tr>
              <th class="text-muted">결제방식</th>
              <td>
                <!-- 결제방식 라디오 그룹 -->
                <div>
                  <div v-for="method in paymentMethod" class="form-check me-3":class="{'bg-body-secondary': paymentMethodIdx===method.idx}" >
                    <input

                        type="radio"
                        class="form-check-input"
                        :value="method.idx"
                        :id="method.idx"
                        v-model="paymentMethodIdx"
                    />
                    <label for="bank" class="form-check-label">{{ method.cardCompany }} {{method.cardNumber.substr(8)}}</label>
                  </div>
                </div>
                <div>
                  <button class="btn" @click="addPaymentMethod">+ 결제 수단 추가</button>
                </div>

              </td>
            </tr>
            </tbody>
          </table>

        </div>


        <div>

          <h4 class="mb-3 fw-bold">배송정보</h4>
            <div class="row g-3">
              <!-- 받는사람정보 테이블 영역 -->
              <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <h5 class="fw-bold mb-0">받는사람정보</h5>
                  <div class="d-flex justify-content-end align-items-center">

                    <div class="form-check">
                      <input
                          type="radio"
                          class="form-check-input"
                          id="manualInput"
                          v-model="isDefaultAddress"
                          value="true"
                          @change="toggleAddressFields"
                      />
                      <label class="form-check-label" for="manualInput">기본 정보</label>
                    </div>
                    <div class="form-check">
                      <input
                          type="radio"
                          class="form-check-input"
                          id="manualInput"
                          v-model="isDefaultAddress"
                          value="false"
                          @change="toggleAddressFields"
                      />
                      <label class="form-check-label" for="manualInput">직접 입력하기</label>
                    </div>
                  </div>

                </div>
                <div class="table-responsive">
                  <table class="table table-borderless align-middle">
                    <tbody>
                    <tr>
                      <th class="text-muted" style="width: 120px;">이름</th>
                      <td>
                        <input
                            type="text"
                            class="form-control"
                            v-model="receiver.name"
                            placeholder="ex) 이유정"
                        />
                      </td>
                    </tr>
                    <tr>
                      <th class="text-muted">연락처</th>
                      <td>
                        <input
                            type="text"
                            class="form-control"
                            v-model="receiver.phone"
                            placeholder="010-1234-5678"
                        />
                      </td>
                    </tr>
                    <tr>
                      <th class="text-muted">배송주소</th>
                      <td>

                        <AddressInput  ref="addressInputRef" ></AddressInput>
                      </td>
                    </tr>
                    <tr>
                      <th class="text-muted">메모</th>
                      <td>
                        <textarea
                            class="form-control"
                            rows="2"
                            placeholder="배송 시 요청사항"
                            v-model="receiver.memo"
                        ></textarea>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>


            <!--  결제   -->


            <hr class="my-4"/>

            <button class="w-100 btn btn-primary btn-lg" @click="submitCheckout">
              결제 진행
            </button>


        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CheckoutPage",
  data() {
    return {
      cartItems: [
        {name: "상품명", description: "간단한 설명", price: 12},
        {name: "두 번째 상품", description: "간단한 설명", price: 8},
        {name: "세 번째 상품", description: "간단한 설명", price: 5}
      ],
      promoCode: "EXAMPLECODE",
      promoDiscount: 5,
      promoInput: "",
      billing: {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        address: "",
        address2: "",
        country: "",
        state: "",
        zip: "",
        sameAddress: false,
        saveInfo: false
      },
      paymentMethod: "credit",
      card: {
        name: "",
        number: "",
        expiration: "",
        cvv: ""
      },
      receiver: {
        name: "",
        address: "",
        address2: "",
        phone: "",
        memo: ""
      }
    };
  },
  computed: {
    totalPrice() {
      let subtotal = this.cartItems.reduce((acc, item) => acc + item.price, 0);
      return subtotal - this.promoDiscount;
    }
  },
  methods: {
    redeemPromo() {
      alert("프로모션 코드 적용됨: " + this.promoInput);
    },
    submitCheckout() {

      alert("주문이 접수되었습니다!");
      this.$router.push('/');

    },
    changeAddress() {
      alert("배송지 변경 로직 구현!");
    }
    , formatCurrency(amount) {
      if (amount === undefined || amount === null) {
        return "0원"; // 또는 원하는 기본값을 반환
      }
      return amount.toLocaleString() + "원";
    }
  }
};
</script>

<style scoped>
.checkout-container {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 1rem;
}

.checkout-container h4,
.checkout-container h3 {
  font-weight: bold;
}

/* 리스트 항목 커스텀 스타일 */
.list-group-item {
  border: none;
  border-bottom: 1px solid #e9ecef;
}

.list-group-item:last-child {
  border-bottom: none;
}

/* 버튼에 강렬한 그라데이션 효과 */
button.btn-primary.btn-lg {
  background-image: linear-gradient(45deg, #2a5ae8, #008cf6); /* 밝은 파랑 → 시원한 블루 */
  border: none;
  color: #ffffff;
}

button.btn-primary.btn-lg:hover {
  background-image: linear-gradient(45deg, #008cf6, #2a5ae8); /* 반전 */
}


.table-borderless th {
  width: 100px;
  white-space: nowrap;
}

.table th {
  background-color: #f8f9fa;
  vertical-align: middle;
}

.container.py-5 {
  width: 1200px;
  margin: 0 auto;
}

</style>
