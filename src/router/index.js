import { createRouter, createWebHistory } from "vue-router";
import SaleList from "../shop/sale/SaleList.vue";
import SaleDetail from "../shop/sale/SaleDetail.vue";
import Login from "../shop/auth/Login.vue";
import SignupIdentify from "../shop/auth/SignupIdentify.vue";
import SignupInput from "../shop/auth/SignupInput.vue";
import SignupEnd from "../shop/auth/SignupEnd.vue";
import UserDetail from "../shop/user/UserDetail.vue";
import UserSubscription from "../shop/user/UserSubscription.vue";
import DeliveryTracking from "../shop/subscription/DeliveryTracking.vue";
import Subscription from "../shop/subscription/Subscription.vue";
import SubscriptionEnd from "../shop/subscription/SubscriptionEnd.vue";
import ReturnRequest from "../shop/subscription/ReturnRequest.vue";
import RepairRequest from "../shop/subscription/RepairRequest.vue";
import Cart from "../shop/sale/Cart.vue";
import ShopLayout from "../shop/common/ShopLayout.vue";
import UserLayout from "../shop/user/UserLayout.vue";
import Home from "../shop/common/Home.vue";
import Chat from "../chat.vue"
import { useUserStore } from "../store/useUserStore.js";
import Sale from "../shop/sale/Sale.vue";
import BestSale from "../shop/sale/BestSale.vue";
import PackageSale from "../shop/sale/PackageSale.vue";
import PurchaseGuide from "../shop/etc/PurchaseGuide.vue";
import Terms from "../shop/etc/Terms.vue";
import PrivacyPolicy from "../shop/etc/PrivacyPolicy.vue";


const loginCheck = async (to, from, next) => {
    const userStore = useUserStore();

    const now = new Date();

    if ((userStore.isLogin === true) && (now.getTime() > userStore.expired)) {
        alert('로그인이 만료되었습니다.');
        await userStore.getLogout();
    }

    if (userStore.isLogin) {
        next();
    }
    else {
        alert('로그인이 필요한 페이지 입니다.')
        next('/auth/login');
    }
}

const adminCheck = async (to, from, next) => {
    const userStore = useUserStore();
    if ((userStore.isLogin === true) && (userStore.role === 'ROLE_ADMIN')) {
        next();
    }
    else {
        alert('관리자 권한이 필요한 페이지 입니다.')
        next('/auth/login');
    }
}

const routes = [
    {
        path: '/',
        component: ShopLayout,
        children: [
            // 홈페이지 카테고리 있는 그거 페이지
            { path: '', component: Home },
            // 로그인 페이지
            { path: 'auth/login', component: Login },
            // 회원가입 본인인증 페이지
            { path: 'auth/signup/identify', component: SignupIdentify },
            // 회원가입 개인정보 입력 페이지
            { path: 'auth/signup/input', component: SignupInput },
            // 회원가입 완료 페이지
            { path: 'auth/signup/end', component: SignupEnd },
            {
                path: 'user',
                component: UserLayout,
                beforeEnter: loginCheck,
                children: [
                    // 개인 상세 페이지
                    { path: 'detail', component: UserDetail },
                    // 개인 구독정보 페이지
                    { path: 'subscription', component: UserSubscription },
                    { path: 'delivery/:detailIdx', component: DeliveryTracking },

                ]
            },

            // 전체 렌탈상품 페이지
            { path: 'sale/list', component: Sale },
            // 베스트 상품 페이지
            { path: 'sale/best', component: BestSale },
            // 패키지 특가 페이지
            { path: 'sale/package', component: PackageSale },

            // 판매 상세 
            { path: 'sale/detail/:idx', component: SaleDetail },
            { path: 'sale/detail/:categoryIdx/:saleIdx', component: SaleDetail },

            // 카테고리별 목록 
            { path: 'sale/:categoryIdx', component: SaleList },
            { path: 'sale/package', component: PackageSale },

            // 장바구니 페이지
            { path: 'cart', component: Cart },
            { path: 'chat', component: Chat },
            { path: 'adminchat', component:
                    () => import("../Adminchat.vue") },
            // 구독 확정 페이지 (결제 페이지)
            { path: 'subscription', name: 'subscription', component: Subscription },
            // 구독 완료 페이지
            { path: 'subscription/end', component: SubscriptionEnd },
            // 반납 신청 페이지
            { path: 'subscription/:detailIdx/return', component: ReturnRequest },
            // 수리 신청 페이지
            { path: 'subscription/:detailIdx/repair', component: RepairRequest },
            // 배송 조회 페이지
            { path: 'subscription/:idx/delivery', component: DeliveryTracking },

            //기타 페이지들
            { path: 'guide', component: PurchaseGuide },
            { path: 'terms', component: Terms },
            { path: 'policy', component: PrivacyPolicy },
        ]

    },
    {
        path: '/admin',
        component: () => import("../admin/common/AdminLayout.vue"),
        beforeEnter: adminCheck,
        children: [
            { path: '', component: () => import("../admin/common/AdminHome.vue") },
            { path: 'product-by-page', component: () => import("../admin/item/AdminItem.vue") },
            { path: 'item-detail/:id', component: () => import("../admin/item/AdminItemDetail.vue") },
            { path: 'sale', component: () => import("../admin/payment/AdminPayment.vue") },
            { path: 'sale/register', component: () => import("../admin/sale/AdminSaleRegister.vue") },
            { path: 'category', component: () => import("../admin/product/AdminCategory.vue") },
            { path: 'product', component: () => import("../admin/product/AdminProduct.vue") },
            { path: 'delivery-by-page', component: () => import("../admin/subscription/AdminDelivery.vue") },
            { path: 'return-request', component: () => import("../admin/subscription/AdminReturnRequest.vue") },
            { path: 'subscribe', component: () => import("../admin/subscription/AdminSubscribe.vue") },
            { path: 'subscribe-detail/:subscribeId', component: () => import("../admin/subscription/AdminSubscriptionDetail.vue") },
            { path: 'user', component: () => import("../admin/user/AdminUser.vue") },
            { path: 'statistics', component: () => import("../admin/statistics/AdminStatistics.vue") },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // 항상 맨 위로 이동
        return { top: 0 }
    }
});


export default router;