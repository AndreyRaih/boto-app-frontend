import BotoLocalStorageManager from "@/common/localStorageManager";
import firebase from "firebase";
const storage = new BotoLocalStorageManager();

export default {
  state: {
    userData: null
  },
  getters: {
    userId(state) {
      return state.userData ? state.userData.uid : null;
    } 
  },
  mutations: {
    SET_USER_DATA(state, data) {
      state.userData = data;
    }
  },
  actions: {
    async signIn({ dispatch }, { email, password }) {
      const { user } = await firebase.auth().signInWithEmailAndPassword(email, password)
      await dispatch('setUserData', user);
      await dispatch('getBotListById', user.uid)
    },
    signOut({ dispatch }) {
      return firebase.auth().signOut().then(() => dispatch('removeFromStorage'));
    },
    async signUp({ dispatch }, { email, password }) {
      const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password)
      await dispatch('setUserData', user);
      await dispatch('getBotListById', user.uid)
    },
    setUserData({ commit, dispatch }, data) {
      commit('SET_USER_DATA', data)
      dispatch('recordToStorage')
    },
    recordToStorage({ state }) {
      storage.set('app:auth', { isLogged: true, userData: state.userData, created: Date.now() }, 28800)
    },
    removeFromStorage() {
      storage.remove('app:auth');
    },
    // Temp:
    sendFeedback({ getters, state }, text) {
      const fieldId = `${state.userData.email}-${Date.now().toString()}`;
      return firebase.firestore().collection('feedback').doc(getters.userId).set({ [fieldId]: text }, { merge: true });
    }
  }
}