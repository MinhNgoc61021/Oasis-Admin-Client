<template>
    <b-row>
        <b-col align-self="start">
            <b-navbar toggleable="sm" class="border-bottom" variant="light" fixed="top" type="light" >
                <b-navbar-brand to="/user-management"><img :src="'/img/oasis.png'" height="35" width="auto" alt="OASIS Admin"></b-navbar-brand>
                <b-navbar-nav class="ml-auto">
                    <b-nav-item-dropdown right no-caret>
                        <!-- Using 'button-content' slot -->
                        <template v-slot:button-content>
                            <b-avatar variant="dark" size="35px"></b-avatar><span> {{ personalData.username }} </span>
                        </template>
                        <b-dropdown-item>{{ personalData.email }}</b-dropdown-item>
                        <b-dropdown-item @click="sign_out">Đăng xuất</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-navbar>
        </b-col>
    </b-row>
</template>

<script>
    import {mapState, mapActions} from "vuex";

    export default {
        name: "Header",
        computed: {
          ...mapState([
              'personalData',
          ]),
        },
        methods: {
          ...mapActions([
              'getPersonalData', 'signOut',
          ]),
          sign_out() {
              this.signOut();
          }
        },
        created() {
            if (this.personalData === null) {
                this.getPersonalData();
            }
        }
    }
</script>

<style scoped>

</style>
