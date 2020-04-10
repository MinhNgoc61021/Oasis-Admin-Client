import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";
import {getData} from "@/auth/handling";
import {removeToken} from "@/auth/jwt";
import { router } from '../router/index.js';

Vue.use(Vuex);
export const store = new Vuex.Store ({
    state: {
        currentSemesterID: '', // used for semester select options in course list
        personalData: null,
    },
    plugins: [createPersistedState()],
    mutations: {
        setCurrentSemesterID(state, semID) {
            state.currentSemesterID = semID;
        },
        setPersonalData(state, data) {
            state.personalData = data;
        },
        removePersonalData(state) {
            state.personalData = null;
        },
    },
    actions: {
        setSemesterID: (context, semID) => { // hàm này gọi bên shift_register
            context.commit('setCurrentSemesterID', semID);
        },
        getPersonalData: (context) => {
            getData().then((response) => {
                if (response.status === 200) {
                    context.commit('setPersonalData', response.data.user_data);
                }
            });
        },
        signOut: (context) => {
            context.commit('removePersonalData');
            removeToken();
            router.push('/sign-in')
        }
    }
});
