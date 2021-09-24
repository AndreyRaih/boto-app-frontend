import { createStore } from 'vuex'

import auth from './modules/auth';
import bots from './modules/bots';
import scenarios from './modules/scenarios';
import dialogs from './modules/dialogs';

export default createStore({
  modules: {
    auth,
    bots,
    scenarios,
    dialogs
  }
})
