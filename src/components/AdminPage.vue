<template>
    <div>
      <b-row class="mb-3">
        <b-col align-self="start">
          <b-navbar toggleable="xl" sticky type="light" variant="light">
            <b-navbar-brand>Oasis Admin</b-navbar-brand>

            <b-navbar-nav class="ml-auto">
              <b-nav-item-dropdown right>
                <!-- Using 'button-content' slot -->
                  <template v-slot:button-content>
                    <span>User</span>
                  </template>
                  <b-dropdown-item >Profile</b-dropdown-item>
                  <b-dropdown-item >Đăng xuất</b-dropdown-item>
                </b-nav-item-dropdown>
              </b-navbar-nav>
          </b-navbar>
        </b-col>
      </b-row>
      <div>
      <!--header-->


        <!--content-->
        <b-row class="m-3">
          <b-col>
            <div>
              <b-list-group>
                <b-list-group-item to="/user-management">Quản lý người dùng</b-list-group-item>
                <b-list-group-item to="/student-management">Quản lý sinh viên</b-list-group-item>
              </b-list-group>
            </div>
          </b-col>
          <b-col align-self="center" cols="9">
            <router-view></router-view>
          </b-col>
        </b-row>

        <!--footer-->
        <b-row class="mb-3">
          <b-col align-self="end">
            <!-- Footer -->
            <footer class="page-footer font-small blue">

              <!-- Copyright -->
              <div class="footer-copyright text-center py-3">© 2020 Copyright:
                <a href="#"> Oasis Admin</a>
              </div>
              <!-- Copyright -->

            </footer>
            <!-- Footer -->
          </b-col>
        </b-row>
      </div>
    </div>
</template>

<script>
    export default {
        name: "AdminPage",
        data() {
            return {
                collapsed: false,
            }
        },
    }
</script>

<style scoped>
    .layout-aside {
    width: 16rem;
}
</style>
