import httpClient from "@/common/httpClient";

export default  {
    state: {
        dialogList: [],
        dialog: null
    },
    mutations: {
        SET_DIALOGS_LIST(state, list) {
            state.dialogList = list;
        },
        SET_CURRENT_DIALOG(state, data) {
            state.dialog = data;
        }
    },
    actions: {
        getDialogListByIds({ commit }, ids) {
            return httpClient.post(`/admin/dialogs/list`, { ids }).then(({ data }) => commit('SET_DIALOGS_LIST', data))
        },
        getDialogById({ commit }, id) {
            return httpClient.get(`/admin/dialogs/${id}`).then(({ data }) => commit('SET_CURRENT_DIALOG', data))
        },
        sendMessageToDialog(ctx, data) {
            return httpClient.post(`/interaction/send_message`, data);
        },
    }
}
