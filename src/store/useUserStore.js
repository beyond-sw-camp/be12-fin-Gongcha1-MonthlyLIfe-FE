import {defineStore} from "pinia";
import axios from "axios";
import {createPersistedState} from "pinia-plugin-persistedstate";

export const useUserStore = defineStore("user", {
    state: () => ({ isLogin: false, id: "", role: "", expired: 0 }),
    //persist하게 할거면 사용
    persist: {
        storage: sessionStorage,
    },
    actions: {
        async getUser() {
            const response = await axios
                .get('/api/user/detail',
                    { withCredentials: true }
                );
            console.log(response);
            return response.data.result;
        },
        async postCheckId(id) {
            const response = await axios
                .post("/api/user/check/id",
                    {id : id},
                )
            return response.data.result;
        },
        async postCheckPhoneNumber(phone) {
            console.log(phone);
            const response = await axios
                .post("/api/user/check/phone",
                    phone,
                )
            return response.data.result;
        },
        async postSignup(user) {
            const response = await axios
                .post("/api/user/register",
                    user,
                )
            console.log(response);
            return response.data.isSuccess;
        },
        async getLogout() {
            const response = await axios
                .get("/api/auth/logout",
                    { withCredentials: true }
                );
            if(response.data.isSuccess) {
                this.isLogin = false;
                this.id = '';
                this.expired = 0;
                this.role = '';
            }
            return response.data.isSuccess;
        },
        async postLogin(user) {
            try {
                const response = await axios
                    .post("/api/auth/login",
                        user,
                    );
                console.log(response);
                if(response.data.isSuccess) {
                    const dto = response.data.result;
                    this.id = dto.id;
                    this.expired = dto.expired;
                    this.role = dto.role;
                    this.isLogin = true;

                }
                return response.data.isSuccess;
            } catch (error) {
                console.error()
                return false
            }
        },
        async putExample(context) {
            const response = await axios
                .put(url,
                    {

                    },
                    { withCredentials: true }
                )
            return response.data;
        },
        async deleteUser() {
            const response = await axios
                .get('/api/user/withdraw',
                    { withCredentials: true }
                );

            return response.data.isSuccess;
        }
    }
})