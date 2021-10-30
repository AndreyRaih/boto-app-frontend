import httpClient from "@/common/httpClient";
import firebase from "firebase";

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
            commit,
        }, stage) {
            commit('ADD_REQUEST_TO_QUEUE', {
                url: `/admin/actions/scenario/${state.currentScenario.id}/update`,
                data: {
                    stage
                }
            });
        },
        deleteScenarioStage({
            commit,
            state
        }, id) {
            commit('ADD_REQUEST_TO_QUEUE', {
                url: `/admin/actions/scenario/${state.currentScenario.id}/delete_stage`,
                data: {
                    id
                }
            });
        },
        async executeRequestInQueue({
            state,
            getters,
            commit
        }) {
            for (const request of state.requests) {
                commit('REMOVE_REQUEST_FROM_QUEUE', request.index);
                const data = { ...request.data.stage } ;
                let images = data.images && data.images.length ? data.images.filter(item => typeof item === 'object') : [];
                if (data) {
                    if (images.length > 0) {
                        const imagesUrls = [];
                        const storage = firebase.storage();
                        for (let image of images) {
                            let url = null;
                            if (image.isUploaded) {
                                url = image.name
                            } else {
                                const storageRef = storage.ref(`${getters.userId}/${image.id}`);
                                await storageRef.put(image.file)
                                url = await storageRef.getDownloadURL();
                            }
                            imagesUrls.push(url);
                        }
                        images = imagesUrls;
                    }
                    await httpClient.post(request.url, { stage: {...data, images } });
                    
                }
            }
            commit('CHANGE_EDITOR_STATE', Boolean(state.requests.length));
        },
        bindBotToScenario({
            state,
            commit
        }, id) {
            commit('SET_CURRENT_SCENARIO', {
                ...state.currentScenario,
                bot: id
            })
            return httpClient.post(`/admin/actions/scenario/${state.currentScenario.id}/bind`, {
                id
            });
        }
    }
}