<template>
  <div>
    <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
      <b-form-group
        id="input-group-1"
        label="Tên kỳ học:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          size="sm"
          v-model="form.name"
          type="text"
          placeholder="Nhập tên kỳ học"
        ></b-form-input>
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
            name: '',
            notFilled: false,
        },
      }
    },
    methods: {
      async onSubmit() {
        try {
          if (String(this.form.name).replace(' ', '') === '')
          {
              this.form.notFilled = true;
              setTimeout(() => {
                this.form.notFilled = false
              }, 3000);
          }
          else {
            const response = await axios({
            url: 'http://localhost:5000/semester/create-record',
            method: 'post',
            changeOrigin: true,
            data: {
              new_name: this.form.name,
            },
          });
            if (response.status === 200) {
              this.$bvToast.toast(`Tạo kỳ học thành công!`, {
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
            this.$bvToast.toast(`Gặp lỗi ${e} khi tạo kỳ học!`, {
                title: `Thất bại`,
                variant: 'danger',
                solid: true,
                appendToast: true,
            });
        }
      },
      onReset() {
        // Reset our form values
        this.form.name = '';
      }
    }
  }
</script>
