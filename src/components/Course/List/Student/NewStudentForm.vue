<template>
    <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
      <b-form-group
        id="input-group-1"
        label="Mã số sinh viên:"
        label-for="input-1"
        :valid-feedback="studentExistent"
        :invalid-feedback="studentNotExistent"
      >
        <b-form-input
          id="input-1"
          size="sm"
          v-model="form.code"
          debounce="200"
          type="text"
          :state="state"
          placeholder="Nhập mã số sinh viên"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-2"
        label="Tên đăng nhập:"
        label-for="input-2"
      >
        <b-form-input
          id="input-2"
          size="sm"
          v-model="form.username"
          type="text"
          readonly
          placeholder="Tên đăng nhập"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-3"
        label="Họ tên:"
        label-for="input-3"
      >
        <b-form-input
          id="input-3"
          size="sm"
          v-model="form.name"
          type="text"
          placeholder="Nhập họ tên"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-4"
        label="Email:"
        label-for="input-4"
      >
        <b-form-input
          id="input-4"
          size="sm"
          v-model="form.email"
          readonly
          type="email"
          placeholder="Nhập email"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-5"
        label="Ngày sinh:"
        label-for="input-5"
      >
        <b-form-input
          type="date"
          id="input-5"
          v-model="form.dob"
          size="sm" class="mb-2">
        </b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-6"
        label="Lớp:"
        label-for="input-6"
      >
        <b-form-input
          id="input-6"
          size="sm"
          v-model="form.class_course"
          type="text"
          placeholder="Nhập lớp"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-7"
        label="Nhập lớp học phần:"
        label-for="input-7"
      >
        <CourseInput id="input-7"></CourseInput>
      </b-form-group>

      <b-form-group id="input-group-8" label="Active:" label-for="input-8">
        <b-form-checkbox v-model="form.actived" id="input-8" size="sm" name="check-button" switch>
          <span v-if="form.actived !== true">Khóa</span>
          <span v-else>Mở</span>
        </b-form-checkbox>
      </b-form-group>

      <b-form-group id="input-group-9" label="Khóa tài khoản:" label-for="input-9">
        <b-form-checkbox v-model="form.is_lock" id="input-9" size="sm" name="check-button" switch>
          <span v-if="form.is_lock !== true">Không khóa</span>
          <span v-else>Khóa</span>
        </b-form-checkbox>
      </b-form-group>
      <b-alert :show="form.notFilled" fade variant="danger">Nhập thiếu thông tin!</b-alert>
      <b-button size="sm" type="submit" :disabled="form.submitState" variant="outline-primary" style="float: right;">Tạo</b-button>
      <b-button size="sm" type="reset" class="mr-2" variant="outline-danger" style="float: right;">Lại</b-button>
    </b-form>
</template>

<script>
    import axios from "axios";

    export default {
        name: "NewStudentForm",
        data() {
            return {
                form: {
                    code: '',
                    username: '',
                    name: '',
                    email: '@vnu.edu.vn',
                    dob: '',
                    class_course: '',
                    course: '',
                    actived: true,
                    is_lock: false,
                    notFilled: false,
                    submitState: false,
                },
                result: {},
            }
        },
        computed: {
          state() {
              if (this.form.code.length === 8) {
                  return JSON.stringify(this.result) !== '{}';
              }
              else {
                  return false;
              }
          },
          studentExistent() {
              if (this.state === true) {
                  return `Sinh viên có MSSV: ${this.form.code} đang học lớp ${this.result.name} (${this.result.code})`;
              }
              else {
                   return ``;
              }
          },
          studentNotExistent() {
              if (JSON.stringify(this.result) === '{}' && this.form.code.length === 8) {
                  return 'Sinh viên hiện tại chưa có trong hệ thống';
              }
              else {
                  return '';
              }
          }
        },
        watch: {
            'form.code': function () {
                this.form.username = this.form.code;
                this.form.email = this.form.code + '@vnu.edu.vn';
                if (this.form.code.length === 8) {
                   this.studentCourseExistence()
                }
            },
        },
        methods: {
            async studentCourseExistence() {
                try {
                    const response = await axios({
                        url: 'http://localhost:5000/student/search-from-course-existence',
                        method: 'get',
                        changeOrigin: true,
                        params: {
                            searchCode: this.form.code,
                        },
                    });
                    if (response.status === 200) {
                        this.result = response.data.search_result;
                    }
                }
                catch(error) {
                    this.$bvToast.toast(`Gặp lỗi ${error} khi tìm kiếm sinh viên có MSSV: ${this.searchCode}!`, {
                        title: `Thất bại`,
                        variant: 'danger',
                        solid: true,
                        appendToast: true,
                    })
                }
            },
            onReset() {
                // Reset our form values
                this.form.code = '';
                this.form.username = '';
                this.form.name = '';
                this.form.email = '@vnu.edu.vn';
                this.form.dob = null;
                this.form.class_course = '';
                this.form.actived = true;
                this.form.is_lock = false;
                // eventBus.$emit('clearCourse');
            }
        },
    }
</script>

<style scoped>

</style>
