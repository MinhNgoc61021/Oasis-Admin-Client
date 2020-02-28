<template>
  <div>
    <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
      <b-form-group
        id="input-group-0"
        label="Nhập kỳ học:"
        label-for="input-0"
      >
        <Search id="input-0"/>
      </b-form-group>

      <b-form-group
        id="input-group-1"
        label="Mã môn học:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          size="sm"
          v-model="form.code"
          type="text"
          placeholder="Nhập mã môn học"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-2"
        label="Tên môn học:"
        label-for="input-2"
      >
        <b-form-input
          id="input-2"
          size="sm"
          v-model="form.name"
          type="text"
          placeholder="Nhập tên môn học"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-3"
        label="Mô tả:"
        label-for="input-3"
      >
        <b-form-textarea
          id="input-3"
          size="sm"
          v-model="form.description"
          rows="4"
          max-rows="8"
          placeholder="Nhập mô tả (Không bắt buộc)"
        ></b-form-textarea>
      </b-form-group>

      <b-alert :show="form.notFilled" fade variant="danger">Nhập thiếu thông tin!</b-alert>
      <b-button size="sm" type="submit" variant="outline-primary">Tạo</b-button>
      <b-button size="sm" type="reset" class="ml-2" variant="outline-danger">Lại</b-button>
    </b-form>
  </div>
</template>

<script>
  import axios from 'axios';
  import Search from "@/components/Semester/List/Search";
  import { eventBus } from "@/main";

  export default {
    name: 'Input',
    components: {
      Search,
    },
    data() {
      return {
        Search,
        form: {
          semester: Object,
          code: '',
          name: '',
          description: '',
          notFilled: false,
        },
      }
    },
    methods: {
      async onSubmit() {
        try {
          if ( String(this.form.code).replace(' ', '') === ''
              || String(this.form.name).replace(' ', '') === ''
              || this.form.semester === null
          ) {
              this.form.notFilled = true;
              setTimeout(() => {
                this.form.notFilled = false
              }, 3000);
          }
          else {
            const response = await axios({
            url: 'http://localhost:5000/course/create-record',
            method: 'post',
            changeOrigin: true,
            data: {
              new_code: this.form.code,
              new_name: this.form.name,
              new_description: this.form.description,
              semester_id: this.form.semester.semester_id,
            },
          });
            if (response.status === 200) {
              this.$bvToast.toast(`Tạo lớp môn học thành công!`, {
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
            this.$bvToast.toast(`Gặp lỗi khi ${e} tạo lớp môn học!`, {
                title: `Thành công`,
                variant: 'danger',
                solid: true,
                appendToast: true,
            });
        }
      },
      onReset() {
        // Reset our form values
        this.form.code = '';
        this.form.name = '';
        this.form.description = '';
      }
    },
    created() {
      eventBus.$on('semesterSearchSelected', (semesterSelected) => {
        this.form.semester = semesterSelected;
      });
    }
  }
</script>
