import {defineStore} from "pinia";
import axios from "axios";
import {createPersistedState} from "pinia-plugin-persistedstate";

export const useUserStore = defineStore("user", {
    state: () => ({ isLogin: false, id: "" }),
    //persist하게 할거면 사용
    persist: {
        storage: sessionStorage,
    },
    actions: {
        async getExample(context) {
            const response = await axios
                .get(url);
            return response.data;
        },
        async getExampleList(context) {
            const response = await axios
                .get(url);
            return response.data;
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
            }
            return response.data.isSuccess;
        },
        async postLogin(user) {
            try {
                const response = await axios
                    .post("/api/auth/login",
                        user,
                    );
                if(response.data.isSuccess) {
                    this.id = user.id;
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
        async deleteExample(context) {
            const response = await axios
                .delete(url,
                    { withCredentials: true }
                )
            return response.data;
        }
    }
})