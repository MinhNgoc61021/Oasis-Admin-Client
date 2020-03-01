import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
export const store = new Vuex.Store ({
    state: {
        currentSemesterID: '', // used for semester select options in course list
    },
    mutations: {
        setCurrentSemesterID(state, semID) {
            state.currentSemesterID = semID;
        },
    },
    actions: {
        setSemesterID: (context, semID) => { // hàm này gọi bên shift_register
            context.commit('setCurrentSemesterID', semID);
        },
    }
});
