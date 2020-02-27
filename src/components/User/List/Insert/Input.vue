<template>
  <div>
    <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
      <b-form-group
        id="input-group-1"
        label="Email:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          size="sm"
          v-model="form.email"
          type="email"
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

      <b-form-group id="input-group-4" label="Quyền:" label-for="input-4">
        <b-form-select
                id="input-4"
                size="sm"
            v-model="form.permission"
            :options="permission_opt"
            required
        ></b-form-select>
      </b-form-group>

      <b-form-group id="input-group-5" label="Active:" label-for="input-5">
        <b-form-checkbox v-model="form.actived" id="input-5" size="sm" name="check-button" switch>
          <span v-if="form.actived !== true">Khóa</span>
          <span v-else>Mở</span>
        </b-form-checkbox>
      </b-form-group>

      <b-form-group id="input-group-6" label="Khóa tài khoản:" label-for="input-6">
        <b-form-checkbox v-model="form.is_lock" id="input-6" size="sm" name="check-button" switch>
          <span v-if="form.is_lock !== true">Không khóa</span>
          <span v-else>Khóa</span>
        </b-form-checkbox>
      </b-form-group>
      <b-alert :show="form.notFilled" fade variant="danger">Nhập thiếu thông tin!</b-alert>
      <b-button size="sm" type="submit" variant="outline-primary">Tạo</b-button>
      <b-button size="sm" type="reset" class="ml-2" variant="outline-danger">Lại</b-button>
    </b-form>
  </div>
</template>

<script>
  import axios from 'axios';

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
          notFilled: false,
        },
        permission_opt: ['Admin', 'Sinh viên', 'Giảng viên'],
      }
    },
    methods: {
      async onSubmit() {
        try {
          if (String(this.form.username).replace(' ', '') === ''
                  || String(this.form.name).replace(' ', '') === ''
                  || String(this.form.email).replace(' ', '') === ''
                  || String(this.form.permission).replace(' ', '') === ''
          )
          {
              this.form.notFilled = true;
              setTimeout(() => {
                this.form.notFilled = false
              }, 3000);
          }
          else {
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
              this.onReset()
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
            this.$bvToast.toast(`Gặp lỗi khi ${e} tạo người dùng!`, {
                title: `Thành công`,
                variant: 'danger',
                solid: true,
                appendToast: true,
            });
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
      }
    }
  }
</script>
