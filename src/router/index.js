import Main from "../common/Main.vue";
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
import AdminHome from "../admin/common/AdminHome.vue";
import AdminLayout from "../admin/common/AdminLayout.vue";
import ShopLayout from "../shop/common/ShopLayout.vue";
import AdminItem from "../admin/item/AdminItem.vue";
import AdminSaleRegister from "../admin/sale/AdminSaleRegister.vue";
import AdminCategory from "../admin/product/AdminCategory.vue";
import AdminDelivery from "../admin/subscription/AdminDelivery.vue";
import AdminProduct from "../admin/product/AdminProduct.vue";
import AdminUser from "../admin/user/AdminUser.vue";
import UserLayout from "../shop/user/UserLayout.vue";
import Home from "../shop/common/Home.vue";
import AdminStatistics from "../admin/statistics/AdminStatistics.vue";
import AdminItemDetail from "../admin/item/AdminItemDetail.vue";
import AdminSubscriptionDetail from "../admin/subscription/AdminSubscriptionDetail.vue";
import AdminSubscribe from "../admin/subscription/AdminSubscribe.vue";
import Chat from "../chat.vue"
import AdminChat from "../Adminchat.vue"
import AdminPayment from "../admin/payment/AdminPayment.vue";
import AdminReturnRequest from "../admin/subscription/AdminReturnRequest.vue";
import { useUserStore } from "../store/useUserStore.js";
import Sale from "../shop/sale/Sale.vue";


const loginCheck = async (to, from, next) => {
    const userStore = useUserStore();

    const now = new Date();

    if((userStore.isLogin === true) && (now.getTime() > userStore.expired) ){
        alert('로그인이 만료되었습니다.');
        await userStore.getLogout();
    }

    if(userStore.isLogin) {
        next();
    }
    else {
        alert('로그인이 필요한 페이지 입니다.')
        next('/auth/login');
    }
}

const adminCheck = async  (to, from, next) => {
    const userStore = useUserStore();
    if((userStore.isLogin === true) && (userStore.role === 'ROLE_ADMIN') ){
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
                    { path: 'delivery', component: DeliveryTracking },

                ]
            },

            // 판매 상세 페이지
            { path: 'sale/detail/:idx', component: SaleDetail },
            // 카테고리별 판매 목록 페이지
            { path: 'sale/:categoryIdx', component: SaleList },
            {
                path: 'sale/detail/:categoryIdx/:saleIdx',
                component: SaleDetail
            },
            // 전체 렌탈 상품 페이지
            { path: 'sale/list', component: Sale },

            // 장바구니 페이지
            { path: 'cart', component: Cart },
            { path: 'chat', component: Chat },
            { path: 'adminchat', component: AdminChat },
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
        ]

    },
    {
        path: '/admin',
        component: AdminLayout, // 사이드바 포함된 레이아웃,
        //beforeEnter: adminCheck,
        children: [
            //관리자 홈페이지
            { path: '', component: AdminHome },
            // 재고 관리 페이지 (상품 이름, 재고 위치, 재고 상태, 갯수)
            { path: 'product-by-page', component: AdminItem },
            // 재고 상세 페이지 (상품 이름, 재고 위치, 재고 상태, 갯수)
            { path: 'item-detail/:id', component: AdminItemDetail },
            // 판매 관리 페이지
            { path: 'sale', component: AdminPayment },
            // 판매 등록 페이지
            { path: 'sale/register', component: AdminSaleRegister },
            // 카테고리 관리 페이지
            { path: 'category', component: AdminCategory },
            // 상품 관리 페이지 ( 상품 이름, 상품 코드 )
            { path: 'product', component: AdminProduct },
            // 상품 등록 페이지 (보류)
            // { path: '/product/register', component: AdminProductRegister },
            // 배송 관리 페이지
            { path: 'delivery-by-page', component: AdminDelivery },
            //반납/수리 요청 페이지
            {path: 'return-request', component: AdminReturnRequest},
            // 구독 관리 페이지
            { path: 'subscribe', component: AdminSubscribe },
            //구독 상세 페이지
            { path: 'subscribe-detail/:subscribeId', component: AdminSubscriptionDetail},
            // 사용자 관리 페이지
            { path: 'user', component: AdminUser },
            //통계 리포트 페이지
            { path: 'statistics', component: AdminStatistics }
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



// router.beforeEach((to, from, next) => {
//     const isAuthenticated = !!localStorage.getItem('accessToken'); // 예시: 토큰으로 로그인 여부 판단
//
//     // 보호가 필요한 경로들 (로그인이 필요한 페이지들)
//     const protectedPaths = ['/user', '/subscription'];
//
//     const requiresAuth = protectedPaths.some((path) => to.path.startsWith(path));
//
//     if (requiresAuth && !isAuthenticated) {
//         next('/auth/login'); // 로그인 안되어 있으면 로그인 페이지로
//     } else {
//         next(); // 그 외에는 정상 진행
//     }
// });

export default router;