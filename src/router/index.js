import Vue from 'vue'
import VueRouter from 'vue-router';
import StudentManagement from "@/components/Student/StudentManagement";
import AdminPage from "@/components/AdminPage";
import UserManagement from "@/components/User/UserManagement";
import LecturerManagement from "@/components/Lecturer/LecturerManagement";

Vue.use(VueRouter);



export const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/admin', name: 'admin', redirect: '/user-management', component: AdminPage,
      children: [
          { path: '/student-management', name: 'student-management', component: StudentManagement },
          { path: '/user-management', name: 'user-management', component: UserManagement },
          { path: '/lecturer-management', name: 'lecturer-management', component: LecturerManagement },
      ],

    },
    {  path: '/*', redirect: '/admin' },

  ],
});
