<template>
  <div>
    <b-card class="m-5 form" header="Đăng nhập">
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group
        id="input-group-1"
        label="Tên tài khoản:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.username"
          type="text"
          placeholder="Tên tài khoản"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Mật khẩu:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.password"
          type="password"

          placeholder="Mật khẩu"
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" class="float-right" variant="outline-primary">Đăng nhập</b-button>
    </b-form>
    </b-card>
  </div>
</template>

<script>
  export default {
    name: 'SignInForm',
    data() {
      return {
        form: {
          username: '',
          password: '',
        },
        show: true
      }
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault()
        alert(JSON.stringify(this.form))
      },
      onReset(evt) {
        evt.preventDefault()
        // Reset our form values
        this.form.email = ''
        this.form.name = ''
        this.form.food = null
        this.form.checked = []
        // Trick to reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      }
    }
  }
</script>
<style scoped>
  .form {
    max-width: 500px;
  }
</style>

