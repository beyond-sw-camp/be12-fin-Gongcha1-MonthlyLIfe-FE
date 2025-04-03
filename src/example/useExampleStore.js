import {defineStore} from "pinia";
import axios from "axios";
import {createPersistedState} from "pinia-plugin-persistedstate";

export const useExampleStore = defineStore("example", {
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
        async postExample(context) {
            const response = await axios
                .post(url,
                    {
                    },
                { withCredentials: true }
                )
            return response.data;
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