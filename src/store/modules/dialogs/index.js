import httpClient from "@/common/httpClient";
import BotoMediaUploader from "@/common/mediaUploader";

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
        async sendMessageToDialog({ getters }, data) {
            data.message.triggers = []
            if (data.message.media.length) {
                const uploader = new BotoMediaUploader(getters.userId, data.message.media);
                data.message.media = await uploader.getMediaList();
            }
            debugger;
            return httpClient.post(`/interaction/send_message`, data);
        },
    }
}
