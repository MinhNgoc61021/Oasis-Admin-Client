<template>
  <div class="ctn">
    <div class="form">
      <b-card class="m-5 form-input">
        <template v-slot:header>
          <img :src="'/img/oasis.png'" height="35" width="auto" alt="OASIS Admin" class="d-inline-block">
        </template>

        <b-form @submit.prevent="onSubmit">
          <b-form-group
            id="input-group-1"
            label="Tên tài khoản:"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model="form.username"
              type="text"
              size="sm"
              placeholder="Tên tài khoản"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label="Mật khẩu:" label-for="input-2">
            <b-form-input
              id="input-2"
              v-model="form.password"
              type="password"
              size="sm"
              placeholder="Mật khẩu"
            ></b-form-input>
          </b-form-group>

          <b-form-invalid-feedback :state="form.validation">
            <b-icon icon="exclamation-triangle"></b-icon> {{ form.invalidFeedback }}
          </b-form-invalid-feedback>
          <b-form-valid-feedback :state="form.validation">
            <b-icon icon="check-circle"></b-icon> {{ form.validFeedback }}
          </b-form-valid-feedback>
         <b-overlay
              :show="busy"
              rounded
              opacity="0.6"
              spinner-small
              spinner-variant="primary"
              @hidden="onHidden"
              class="float-right"
            >
            <b-button ref="button" type="submit" :disabled="busy"  size="sm" variant="outline-primary">Đăng nhập</b-button>
         </b-overlay>
        </b-form>
      </b-card>
    </div>
  </div>
</template>

<script>
  import {signIn} from "@/auth/handling";
  import {router} from "@/middleware/router";

  export default {
    name: 'SignInForm',
    data() {
      return {
        form: {
          username: '',
          password: '',
          validation: null,
          validFeedback: '',
          invalidFeedback: '',
        },
        busy: false,
      }
    },
    watch: {
      'form.username': function () {
          this.form.validation = null;
          this.form.validFeedback = '';
          this.form.invalidFeedback = '';
      },
      'form.password': function () {
          this.form.validation = null;
          this.form.validFeedback = '';
          this.form.invalidFeedback = '';
      }
    },
    methods: {
      onHidden() {
        // Return focus to the button once hidden
        this.$refs.button.focus()
      },
      onSubmit() {
        this.busy = true;
        signIn(this.form.username, this.form.password).then((response) => {
          if (response.status === 200) {
            this.form.validation = true;
            this.form.validFeedback = 'Đăng nhập thành công.';
            return true;
          }
          else if (response.status === 401) {
            if (response.data.message === 'student-unauthorized') {
              this.form.validation = false;
              this.form.invalidFeedback = 'Sinh viên không được phép truy cập hệ thống này.';
              this.busy = false;
              return false;
            }
            else {
              this.form.validation = false;
              this.form.invalidFeedback = 'Sai tài khoản hoặc mật khẩu.';
              this.busy = false;
              return false;
            }
          }
        }).catch((err) => {
          console.log(err);
          this.form.validation = false;
          this.form.invalidFeedback = 'Hệ thống hiện tại không thể truy cập được.';
          this.busy = false;
          return false;
        }).then((response) => {
          setTimeout(() => {
            if (response === true) {
              this.busy = true;
              router.push('/admin');
            }
          }, 800);
        });
      },
    }
  }
</script>
<style scoped>
  .ctn {
    display: flex;
    justify-content: center;
    margin: 10px auto;
    position: fixed;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    padding-top: 60px;
  }

  .form {
    width: 70%;
    display: flex;
    justify-content: center;
    height: 300px;
  }

  .form-input {
    width: 50%;
    height: 100%;
  }

  @media only screen and (max-width: 700px) {
    .ctn {
      margin: 0;
    }
    .form-input {
        min-width: 300px;
          /*-moz-transform: translate(50%,-50%);*/
          /*-webkit-transform: translate(50%,-50%);*/
          /*-o-transform: translate(50%,-50%);*/
    }
  }
  @media only screen and (min-width: 1000px) {
    .ctn {
      margin: 0;
    }
    .form-input {
        max-width: 450px;
          /*-moz-transform: translate(50%,-50%);*/
          /*-webkit-transform: translate(50%,-50%);*/
          /*-o-transform: translate(50%,-50%);*/
    }
  }

</style>

