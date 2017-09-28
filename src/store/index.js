/**
 * data store
 **/
import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

//vuex调试工具
import createLogger from 'vuex/dist/logger.js'   //每次修改状态会打印出来



Vue.use(Vuex);


const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({

    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions,
    strict: debug,                      //debug为true时会检测
    plugins: debug ? [createLogger()] : []
})