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
import { getToken } from "@/auth/jwt";

Vue.use(VueRouter);

export const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/sign-in', name: 'sign-in-form', component: SignInForm },
    { path: '/admin', name: 'admin', redirect: '/user-management', component: AdminPage,
      children: [
          { path: '/student-management', name: 'student-management', component: StudentManagement },
          { path: '/user-management', name: 'user-management', component: UserManagement },
          { path: '/lecturer-management', name: 'lecturer-management', component: LecturerManagement },
          { path: '/semester-management', name: 'semester-management', component: SemesterManagement },
          { path: '/problem-management', name: 'problem-management', component: ProblemManagement },
          { path: '/course-management', name: 'course-management', redirect: '/course-management/course-list', component: CourseManagement,
              children: [
                  { path: '', name: 'course-list', component: CourseList },
                  { path: '/course-management/student-list/id/:id/code/:code/name/:name', props: true, name: 'student-course-list', component: StudentCourseList },
                  { path: '/course-management/lecturer-list/id/:id/code/:code/name/:name', props: true, name: 'lecturer-course-list', component: LecturerCourseList },
              ]
          },
      ],

    },
    {  path: '/*', redirect: '/admin' },

  ],
});
router.beforeEach ((to, from, next) => {

    // redirect to register page if not logged in or trying to access a restricted page
    // redirect to admin page if the user is an admin
    // redirect to student page if the user is a student
    const publicPages = ['/sign-in'];
    const securePages = ['/admin', '/student-management', '/lecturer-management', '/user-management', '/semester-management', '/problem-management', '/course-management'];
    const authRequired = !publicPages.includes(to.path);
    const signedIn = getToken();

    // When logging in
    if (signedIn) {
      if (signedIn.type === 'Admin' || signedIn.type === 'Lecture') {
        if (!authRequired) { // When location is register page
          return next('/admin');
        }
        else if (securePages.includes(to.path)) {
          return next();
        }
        else { // Move to a new hook
          return next();
        }
      }
    }
    // When not logging in
    else if (!signedIn) {
      if (authRequired) { // When there is no register page
        return next('/sign-in');
      }
      else { // Move to a new hook
        return next();
      }
    }
    //else next();

});

