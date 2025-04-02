import Main from "../common/Main.vue";
import {createRouter, createWebHistory} from "vue-router";
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
import AdminSale from "../admin/sale/AdminSale.vue";
import AdminSaleRegister from "../admin/sale/AdminSaleRegister.vue";
import AdminCategory from "../admin/product/AdminCategory.vue";
import AdminDelivery from "../admin/subscription/AdminDelivery.vue";
import AdminProductRegister from "../admin/product/AdminProductRegister.vue";
import AdminProduct from "../admin/product/AdminProduct.vue";
import AdminUser from "../admin/user/AdminUser.vue";
import UserLayout from "../shop/user/UserLayout.vue";

const routes = [
    {
        path: '/',
        component: ShopLayout,
        children: [
            { path: '', component: Main },
            { path: 'auth/login', component: Login },
            { path: 'auth/signup/identify', component: SignupIdentify },
            { path: 'auth/signup/input', component: SignupInput },
            { path: 'auth/signup/end', component: SignupEnd },
            {
                path: 'user',
                component: UserLayout,
                children: [
                    { path: 'user/detail', component: UserDetail },
                    { path: 'user/subscription', component: UserSubscription },
                ]
            },
            { path: 'sale/list/:categoryIdx', component: SaleList },
            { path: 'sale/:idx', component: SaleDetail },
            { path: 'cart', component: Cart },
            { path: 'subscription', component: Subscription },
            { path: 'subscription/end', component: SubscriptionEnd },
            { path: 'subscription/:detailIdx/return ', component: ReturnRequest},
            { path: 'subscription/:detailIdx/repair', component: RepairRequest},
            { path: 'subscription/:idx/delivery', component: DeliveryTracking },
        ]

    },
    {
        path: '/admin',
        component: AdminLayout, // 사이드바 포함된 레이아웃
        children: [
            { path: '', component: AdminHome },
            { path: '/item', component: AdminItem },
            { path: '/sale', component: AdminSale },
            { path: '/sale/register', component: AdminSaleRegister },
            { path: '/category', component: AdminCategory },
            { path: '/product', component: AdminProduct },
            { path: '/product/register', component: AdminProductRegister },
            { path: '/delivery', component: AdminDelivery },
            { path: '/subscription', component: AdminDelivery },
            { path: '/user', component: AdminUser },

        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;