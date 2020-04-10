<template>
    <b-row>
        <b-col align-self="start">
            <b-navbar toggleable="sm" class="border-bottom" variant="light" fixed="top" type="light" >
                <b-navbar-brand to="/user-management"><img :src="'/img/oasis.png'" height="35" width="auto" alt="OASIS Admin"></b-navbar-brand>
                <b-navbar-nav class="ml-auto">
                    <b-nav-item-dropdown right no-caret>
                        <!-- Using 'button-content' slot -->
                        <template v-slot:button-content>
                            <b-avatar variant="dark" size="35px" :text="avatarTxt"></b-avatar><b> {{ name }}</b>
                        </template>
                        <b-dropdown-item disabled>{{ email }}</b-dropdown-item>
                        <b-dropdown-item @click="sign_out"><b-icon icon="box-arrow-right"></b-icon> Đăng xuất</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-navbar>
        </b-col>
    </b-row>
</template>

<script>
    import {mapActions, mapState} from "vuex";

    export default {
        name: "Header",
        data() {
            return {
                avatarTxt: '',
                name: '',
                email: '',
            }
        },
        computed: {
          ...mapState([
              'personalData',
          ]),
        },
        watch: {
          personalData: function () {
              this.toAvatar(this.personalData.name);
              this.name = this.personalData.name;
              this.email = this.personalData.email;
          }
        },
        methods: {
          ...mapActions([
              'getPersonalData', 'signOut',
          ]),
          sign_out() {
              this.signOut();
          },
          toAvatar(name) {
              const each = name.split(' ');
              for (var i = 0; i < each.length; i++) {
                  this.avatarTxt += each[i].charAt(0).toUpperCase();
              }
          }
        },
        created() {
            if (this.personalData === null) {
                this.getPersonalData();
            }
            else if (this.personalData != null) {
                this.toAvatar(this.personalData.name);
                this.name = this.personalData.name;
                this.email = this.personalData.email;
            }
        }
    }
</script>

<style scoped>

</style>
