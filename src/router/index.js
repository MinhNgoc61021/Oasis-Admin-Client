import Vue from 'vue'
import VueRouter from 'vue-router';
import StudentManagement from "@/components/Student/StudentManagement";
import AdminPage from "@/components/AdminPage";
import UserManagement from "@/components/User/UserManagement";
import LecturerManagement from "@/components/Lecturer/LecturerManagement";
import SemesterManagement from "@/components/Semester/SemesterManagement";
import CourseManagement from "@/components/Course/CourseManagement";
import ProblemManagement from "@/components/Problem/ProblemManagement";
import CourseList from "@/components/Course/List/CourseList";
import StudentCourseList from "@/components/Course/List/Student/StudentCourseList";
import LecturerCourseList from "@/components/Course/List/Lecturer/LecturerCourseList";
import SignInForm from "@/components/SignIn/SignInForm";

Vue.use(VueRouter);

export const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', name: 'sign-in-form', component: SignInForm },
    { path: '/admin', name: 'admin', redirect: '/user-management', component: AdminPage,
      children: [
          { path: '/student-management', name: 'student-management', component: StudentManagement },
          { path: '/user-management', name: 'user-management', component: UserManagement },
          { path: '/lecturer-management', name: 'lecturer-management', component: LecturerManagement },
          { path: '/semester-management', name: 'semester-management', component: SemesterManagement },
          { path: '/problem-management', name: 'problem-management', component: ProblemManagement },
          { path: '/course-management', name: 'course-management', redirect: '/course-management/course-list', component: CourseManagement,
              children: [
                  { path: '/course-management/course-list', name: 'course-list', component: CourseList },
                  { path: '/course-management/student-list/id/:id/code/:code/name/:name', props: true, name: 'student-course-list', component: StudentCourseList },
                  { path: '/course-management/lecturer-list/id/:id/code/:code/name/:name', props: true, name: 'lecturer-course-list', component: LecturerCourseList },
              ]
          },
      ],

    },
    {  path: '/*', redirect: '/admin' },

  ],
});
