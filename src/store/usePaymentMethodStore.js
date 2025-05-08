import {defineStore} from "pinia";
import axios from "axios";
import {createPersistedState} from "pinia-plugin-persistedstate";


export const usePaymentMethodStore = defineStore("paymentMethod", {
    state: () => ({ page: {}, methods: [] }),
    //persist하게 할거면 사용
    actions: {
        async getExample(context) {
            const response = await axios
                .get(url);
            return response.data;
        },
        async getPaymentMethodPage(page, size) {
            const response = await axios
                .get('/api/payment/method'
                    +'?page='+page+'&size='+size
                );

            if(!response.data.isSuccess)
                return response.data.message;

            this.page = response.data.result;
            this.methods = response.data.result.content;

            return response.data.result;
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