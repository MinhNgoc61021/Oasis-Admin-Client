<template>
  <div>
    <b-form @submit.prevent="onSubmit" @reset.prevent="onReset" v-if="show">
      <b-form-group
        id="input-group-1"
        label="Email:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.email"
          type="email"
          required
          placeholder="Nhập email"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-2"
        label="Tên đăng nhập:"
        label-for="input-2"
      >
        <b-form-input
          id="input-2"
          v-model="form.username"
          type="text"
          required
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
          v-model="form.name"
          type="text"
          required
          placeholder="Nhập họ tên"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-4" label="Quyền:" label-for="input-4">
        <b-form-select
                id="input-4"
            v-model="form.permission"
            :options="permission_opt"
            required
        ></b-form-select>
      </b-form-group>

      <b-form-group id="input-group-5" label="Active:" label-for="input-5">
        <b-form-checkbox v-model="form.actived" id="input-5" name="check-button" switch>
          <span v-if="form.actived !== true">Khóa</span>
          <span v-else>Mở</span>
        </b-form-checkbox>
      </b-form-group>

      <b-form-group id="input-group-6" label="Khóa tài khoản:" label-for="input-6">
        <b-form-checkbox v-model="form.is_lock" id="input-6" name="check-button" switch>
          <span v-if="form.is_lock !== true">Không khóa</span>
          <span v-else>Khóa</span>
        </b-form-checkbox>
      </b-form-group>

      <b-button type="submit" variant="primary">Tạo</b-button>
      <b-button type="reset" class="ml-2" variant="danger">Lại</b-button>
    </b-form>
  </div>
</template>

<script>
  import axios from 'axios';
  import { eventBus } from "@/main";

  export default {
    name: 'Input',
    data() {
      return {
        form: {
          username: '',
          name: '',
          email: '',
          permission: 'Sinh viên',
          actived: true,
          is_lock: false,
          password: '',
        },
        show: true,
        permission_opt: ['Admin', 'Sinh viên', 'Giảng viên'],
      }
    },
    methods: {
      async onSubmit() {
        try {
          const response = await axios({
            url: 'http://localhost:5000/user/create-record',
            method: 'post',
            changeOrigin: true,
            data: {
              new_username: this.form.username,
              new_name: this.form.name,
              new_email: this.form.email,
              new_permission: this.form.permission,
              new_actived: this.form.actived,
              new_is_lock: this.form.is_lock,
            },
          });
          if (response.status === 200) {
            this.$bvToast.toast(`Tạo người dùng thành công!`, {
              title: `Thành công`,
              variant: 'success',
              solid: true,
              appendToast: true,
            });

            this.form.username = '';
            this.form.name = '';
            this.form.email = '';
            this.form.permission = 'Sinh viên';
            this.form.actived = true;
            this.form.is_lock = false;
          }
          else if (response.status === 202) {
            this.$bvToast.toast(`Trùng lặp dữ liệu!`, {
              title: `Oops`,
              variant: 'warning',
              solid: true,
              appendToast: true,
            });
          }
        } catch (e) {
            this.$bvToast.toast(`Gặp lỗi khi ${e} tạo người dùng thất bại!`, {
                title: `Thành công`,
                variant: 'danger',
                solid: true,
                appendToast: true,
            });
        } finally {
            eventBus.$emit('refreshUserRecordData')
        }
      },
      onReset() {
        // Reset our form values
        this.form.username = '';
        this.form.name = '';
        this.form.email = '';
        this.form.permission = 'Sinh viên';
        this.form.actived = true;
        this.form.is_lock = false;
        this.show = false;
        this.$nextTick(() => {
          this.show = true
        })
      }
    }
  }
</script>
