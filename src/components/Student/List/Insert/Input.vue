<template>
    <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
      <b-form-group
        id="input-group-1"
        label="Mã số sinh viên:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          size="sm"
          v-model="form.code"
          maxlength="8"
          type="text"
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
          placeholder="Nhập tên đăng nhập"
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
      <b-button size="sm" type="submit" variant="outline-primary">Tạo</b-button>
      <b-button size="sm" type="reset" class="ml-2" variant="outline-danger">Lại</b-button>
    </b-form>
</template>

<script>
  import axios from 'axios';
  import { eventBus } from "@/main";
  import CourseInput from "@/components/Student/List/Insert/CourseInput";
  import {authHeader} from "@/auth/jwt";

  export default {
    name: 'Input',
    components: {
        CourseInput
    },
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
        },
      }
    },
    watch: {
        'form.code': function () {
          this.form.username = this.form.code;
          this.form.email = this.form.code + '@vnu.edu.vn';
        },
        'form.username': function () {
          this.form.code = this.form.username;
          this.form.email = this.form.code + '@vnu.edu.vn';
        },
    },
    methods: {
      async onSubmit() {
        console.log(this.form);
        try {
          if (String(this.form.code).replace(' ', '') === ''
                  || String(this.form.username).replace(' ', '') === ''
                  || String(this.form.name).replace(' ', '') === ''
                  || String(this.form.email).replace(' ', '') === ''
                  || String(this.form.dob).replace(' ', '') === ''
                  || String(this.form.class_course).replace(' ', '') === ''
          )
          {
              this.form.notFilled = true;
              setTimeout(() => {
                this.form.notFilled = false
              }, 3000);
          }
          else {
            const response = await axios({
              url: `${process.env.VUE_APP_API_URL}/student/create-record`,
              method: 'post',
              changeOrigin: true,
              headers: { 'Authorization': authHeader() },
              data: {
                new_code: this.form.code,
                new_username: this.form.username,
                new_name: this.form.name,
                new_email: this.form.email,
                new_dob: this.form.dob,
                new_class_cource: this.form.class_course,
                new_course_id: this.form.course.course_id,
                new_actived: this.form.actived,
                new_is_lock: this.form.is_lock,
              },
            });
            if (response.status === 200) {
              this.$bvToast.toast(`Tạo và thêm sinh viên thành công!`, {
                title: `Thành công`,
                variant: 'success',
                solid: true,
                appendToast: true,
              });
              this.onReset();
            }
            else if (response.status === 202) {
              this.$bvToast.toast(`Trùng lặp dữ liệu!`, {
                title: `Oops`,
                variant: 'warning',
                solid: true,
                appendToast: true,
              });
            }
          }
        } catch (e) {
            this.$bvToast.toast(`Gặp lỗi ${e.response.data.error_message} khi tạo sinh viên thất bại!`, {
                title: `Thất bại`,
                variant: 'danger',
                solid: true,
                appendToast: true,
            });
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
    created() {
      eventBus.$on('courseSearchSelected', (courseSelected) => {
        this.form.course = courseSelected;
      })
    }
  }
</script>
