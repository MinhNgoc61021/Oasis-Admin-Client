<template>
    <div>
      <div>
        <b-row>
          <b-col align-self="start">
            <b-navbar toggleable="sm" class="border-bottom" variant="light" fixed="top" type="light">
              <b-navbar-brand to="/user-management"><img :src="'/img/oasis.png'" height="35" width="auto" alt="OASIS Admin"></b-navbar-brand>
              <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown right>
                  <!-- Using 'button-content' slot -->
                    <template v-slot:button-content>
                      <span>User</span>
                    </template>
                    <b-dropdown-item>Profile</b-dropdown-item>
                    <b-dropdown-item>Đăng xuất</b-dropdown-item>
                  </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-navbar>
          </b-col>
        </b-row>
      </div>

      <div style="margin-top: 88px;">
          <!--content-->
          <b-row class="m-2 mt-3">
            <b-col>
              <div>
                <b-list-group>
                  <b-list-group-item to="/user-management">Quản lý người dùng</b-list-group-item>
                  <b-list-group-item to="/student-management">Quản lý sinh viên</b-list-group-item>
                  <b-list-group-item to="/lecturer-management">Quản lý giảng viên</b-list-group-item>
                  <b-list-group-item to="/semester-management">Quản lý kỳ học</b-list-group-item>
                  <b-list-group-item to="/course-management">Quản lý lớp môn học</b-list-group-item>
                  <b-list-group-item to="/problem-management">Quản lý các problem</b-list-group-item>
                </b-list-group>
              </div>
            </b-col>
            <b-col :class="{ 'col-9': activation }" align-self="center">
              <router-view></router-view>
            </b-col>
          </b-row>

          <!--footer-->
          <b-row class="mb-3">
            <b-col align-self="end">
              <!-- Footer -->
              <footer class="page-footer font-small blue">

                <!-- Copyright -->
                <div class="footer-copyright text-center py-3"><b>© 2020 Copyright: </b>
                  <a href="#">Oasis Admin</a>
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
                width: window.innerWidth,
                activation: true,
            }
        },
        watch: {
            width: function (value) {
              console.log(value);
            }
        },
    }
</script>

<style scoped>
</style>
