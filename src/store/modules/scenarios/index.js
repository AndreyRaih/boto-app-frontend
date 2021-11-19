import httpClient from "@/common/httpClient";
import BotoMediaUploader from "@/common/mediaUploader";

let requestQueueInterval = null;

export default {
    state: {
        scenarios: [],
        currentScenario: null,
        requests: [],
        editInProgress: false
    },
    mutations: {
        SET_SCENARIO_LIST(state, list) {
            state.scenarios = list;
        },
        SET_CURRENT_SCENARIO(state, scenario) {
            state.currentScenario = scenario;
        },
        ADD_REQUEST_TO_QUEUE(state, request) {
            state.editInProgress = true;
            const index = state.requests.length;
            state.requests.push({
                ...request,
                index
            });
        },
        REMOVE_REQUEST_FROM_QUEUE(state, targetIndex) {
            const pos = state.requests.findIndex(({
                index
            }) => index === targetIndex);
            state.requests.splice(pos, 1)
        },
        CHANGE_EDITOR_STATE(state, newValue) {
            state.editInProgress = newValue;
        }
    },
    actions: {
        runSync({
            state,
            dispatch
        }) {
            requestQueueInterval = setInterval(() => {
                if (state.requests.length) dispatch('executeRequestInQueue')
            }, 5000)
        },
        stopSync() {
            if (requestQueueInterval) {
                clearInterval(requestQueueInterval);
                requestQueueInterval = null;
            }
        },
        async executeRequestInQueue({
            state,
            commit
        }) {
            for (const request of state.requests) {
                commit('REMOVE_REQUEST_FROM_QUEUE', request.index);
                await httpClient.post(request.url, request.data);
            }
            commit('CHANGE_EDITOR_STATE', Boolean(state.requests.length));
        },
        createScenario({
            dispatch
        }, data) {
            return httpClient.post('/admin/actions/scenario/create', data).then(() => dispatch('getScenarioList', data.creatorId))
        },
        getScenarioList({
            commit
        }, creatorId) {
            return httpClient.get('/admin/actions/scenario/list', {
                params: {
                    creatorId
                }
            }).then(({
                data
            }) => {
                commit('SET_SCENARIO_LIST', data)
                if (data.length) commit('SET_CURRENT_SCENARIO', data[0])
            })
        },
        async updateScenario({
            state,
            getters,
            commit,
        }, updates) {
            const data = [...updates];
            const stages = [];
            for (const stage of data) {
                const mediaUploader = new BotoMediaUploader(getters.userId, Array.isArray(stage.media) ? [...stage.media] : []);
                stage.media = await mediaUploader.getMediaList();
                stages.push(stage);
            }
            commit('ADD_REQUEST_TO_QUEUE', {
                url: `/admin/actions/scenario/${state.currentScenario.id}/update`,
                data: {
                    stages
                }
            });
        }
    }
}