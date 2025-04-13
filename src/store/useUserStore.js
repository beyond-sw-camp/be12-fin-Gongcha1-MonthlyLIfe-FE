import {defineStore} from "pinia";
import axios from "axios";
import {createPersistedState} from "pinia-plugin-persistedstate";

export const useUserStore = defineStore("user", {
    state: () => ({}),
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