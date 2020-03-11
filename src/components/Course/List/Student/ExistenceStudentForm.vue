<template>
    <b-form @submit.prevent="submitExistentStudent">
        <b-form-group
                id="submit-input-group-1"
        >
            <SearchStudentByCourse :current_course="course_id" location="outside-course"></SearchStudentByCourse>
        </b-form-group>
        <b-alert :show="SubmitStudentForm.notFilled" fade variant="danger">Nhập thiếu thông tin!</b-alert>
        <b-button type="submit" size="sm" variant="outline-primary" style="float: right">Thêm</b-button>
    </b-form>
</template>

<script>
    import SearchStudentByCourse from "@/components/Course/List/Student/SearchStudentByCourse";
    import axios from "axios";

    export default {
        name: "NewStudentForm",
        props: ['course_id'],
        components: {
            SearchStudentByCourse,
        },
        data() {
            return {
                course_id,
                SearchStudentByCourse,
                SubmitStudentForm: {
                    student_id: '',
                    notFilled: false,
                }
            }
        },
        methods: {
          async submitExistentStudent() {
                try {
                  if (String(this.SubmitStudentForm.student_id,).replace(' ', '') === '') {
                      this.SubmitStudentForm.notFilled = true;
                      setTimeout(() => {
                        this.SubmitStudentForm.notFilled = false
                      }, 3000);
                  }
                  else {
                      const response = await axios({
                          url: `${process.env.VUE_APP_API_URL}/student/create-student-course-record`,
                          method: 'post',
                          changeOrigin: true,
                          data: {
                              new_student_id: this.SubmitStudentForm.student_id,
                              course_id: this.course_id,
                          },
                  });
                    if (response.status === 200) {
                      this.$bvToast.toast(`Thêm sinh viên vào lớp thành công!`, {
                        title: `Thành công`,
                        variant: 'success',
                        solid: true,
                        appendToast: true,
                      });
                      this.$root.$emit('bv::hide::modal', 'add-student-modal');
                      this.onReset();
                    }
                  }
                } catch (e) {
                    this.$bvToast.toast(`Gặp lỗi ${e.response.data.error_message} khi thêm sinh viên vào lớp!`, {
                        title: `Thất bại`,
                        variant: 'danger',
                        solid: true,
                        appendToast: true,
                    });
                }
            },
        },
    }
</script>

<style scoped>

</style>
