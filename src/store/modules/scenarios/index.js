import httpClient from "@/common/httpClient";
import firebase from "firebase";

export default {
    state: {
        scenarios: [],
        currentScenario: null
    },
    mutations: {
        SET_SCENARIO_LIST(state, list) {
            state.scenarios = list;
        },
        SET_CURRENT_SCENARIO(state, scenario) {
            state.currentScenario = scenario;
        }
    },
    actions: {
        createScenario({ dispatch }, data) {
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
            getters
        }, stage) {
            if (stage && stage.images.length > 0) {
                const storage = firebase.storage();
                const imagesUrls = [];
                for (let image of stage.images) {
                    const storageRef = storage.ref(`${getters.userId}/${image.id}`);
                    await storageRef.put(image.file)
                    const url = await storageRef.getDownloadURL();
                    imagesUrls.push(url);
                }
                stage.images = imagesUrls;
            }
            return httpClient.post(`/admin/actions/scenario/${state.currentScenario.id}/update`, {
                stage
            });
        },
        deleteScenarioStage({state, dispatch, getters}, id) {
            return httpClient.post(`/admin/actions/scenario/${state.currentScenario.id}/delete_stage`, {
                id
            }).then(() => dispatch('getScenarioList', getters.userId));
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