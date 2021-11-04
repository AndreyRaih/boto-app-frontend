import httpClient from "@/common/httpClient";
import {
    v4 as uuid
} from "uuid";

export default {
    state: {
        botList: [],
        currentBot: null,
        editToken: null
    },
    getters: {
        botIds(state) {
            return state.botList.map(({
                id
            }) => id);
        }
    },
    mutations: {
        SET_BOT_LIST(state, list) {
            state.botList = list;
        },
        SET_BOT(state, bot) {
            state.currentBot = bot;
        },
        SET_BOT_EDIT_TOKEN(state, token) {
            state.editToken = token;
        }
    },
    actions: {
        async createBot({ commit, dispatch }, reqData) {
            const { data } = await httpClient.post('admin/bot/create', reqData);
            await dispatch('getBotListById', reqData.userId)
            commit('SET_BOT', data);
        },
        async getBotListById({
            commit
        }, id) {
            return httpClient({
                method: 'get',
                url: `admin/bot/list/${id}`
            }).then(({
                data
            }) => commit('SET_BOT_LIST', data))
        },
        getFullBotDataById({
            commit
        }, id) {
            commit('SET_BOT', null)
            return httpClient({
                method: 'get',
                url: `admin/bot/${id}`
            }).then(({
                data
            }) => commit('SET_BOT', data))
        },
        addBotAdmin({
            state,
            commit
        }) {
            const token = uuid();
            httpClient.post(`admin/bot/${state.currentBot.id}/set_edit_token`, {
                token
            }).then(() => commit('SET_BOT_EDIT_TOKEN', token));
            setTimeout(() => httpClient.post(`admin/bot/${state.currentBot.id}/set_edit_token`).then(() => commit('SET_BOT_EDIT_TOKEN', null)), 60000);
        },
        deleteBotAdmin({
            dispatch,
            state
        }, id) {
            return httpClient.post(`admin/bot/${state.currentBot.id}/delete_admin`, {
                id
            }).then(() => dispatch('getFullBotDataById', state.currentBot.id));
        },
        deleteBot({ state }) {
            return httpClient.get(`admin/bot/${state.currentBot.id}/delete`);
        }
    }
}