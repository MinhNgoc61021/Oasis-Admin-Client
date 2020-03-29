<template>
  <div>
    <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
      <b-form-group
        id="input-group-1"
        label="Mã môn học:"
        label-for="input-1"
        :valid-feedback="form.Existent"
        :invalid-feedback="form.NonExistent"
      >
        <b-form-input
          id="input-1"
          size="sm"
          v-model="form.code"
          :state="form.state"
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
          :readonly="form.disableEdit"
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
          :readonly="form.disableEdit"
          rows="4"
          max-rows="8"
          placeholder="Nhập mô tả (Không bắt buộc)"
        ></b-form-textarea>
      </b-form-group>

      <b-alert :show="form.notFilled" fade variant="danger">Nhập thiếu thông tin!</b-alert>
      <b-button size="sm" type="submit" :disabled="form.submitDisable" style="float: right" variant="outline-primary">{{ form.buttonType }}</b-button>
      <b-button size="sm" type="reset" style="float: right" class="mr-2" variant="outline-danger">Lại</b-button>
    </b-form>
  </div>
</template>

<script>
  import axios from 'axios';
  import { eventBus } from "@/main";
  import debounce from 'lodash/debounce';

  export default {
    name: 'Input',
    props: ['semestedID'],
    data() {
      return {
        form: {
          semester: this.semestedID,
          course_id: '',
          code: '',
          name: '',
          description: '',
          notFilled: false,
          submitDisable: true,
          state: false,
          Existent: '',
          NonExistent: '',
          disableEdit: false,
          buttonType: 'Thêm',
        },
      }
    },
    watch: {
      'form.code': debounce (function () {
          this.CourseExistence().then((res) => {
              if (JSON.stringify(res) !== '{}') { // Nếu lớp tồn tại
                if (String(res.semester).replace(' ', '') !== '') {  // Nếu lớp đã có kỳ học rồi
                  this.form.state = true;
                  if (parseInt(res.semester) !== parseInt(this.form.semester)) { // Nếu lớp đã có kỳ học rồi nhưng ko đúng kỳ học cần thêm
                    this.form.course_id = res.course_id;
                    this.form.code = res.code;
                    this.form.name = res.name;
                    this.form.description = res.description;
                    this.form.state = true;
                    this.form.Existent = `Lớp học ${this.form.code} đã có trong kỳ học khác.`;
                    this.form.disableEdit = false;
                  }
                  else {
                    this.form.course_id = res.course_id;
                    this.form.code = res.code;
                    this.form.name = res.name;
                    this.form.description = res.description;
                    this.form.state = true;
                    this.form.Existent = `Lớp học ${this.form.code} đã có trong kỳ học này rồi.`;
                    this.form.submitDisable = true;
                    this.form.disableEdit = true;
                  }
                }
                else {
                  this.form.state = false;
                  this.form.submitDisable = false;
                  this.form.course_id = res.course_id;
                  this.form.code = res.code;
                  this.form.name = res.name;
                  this.form.description = res.description;
                  this.form.NonExistent = `Lớp học ${this.form.code} hiện tại chưa có kỳ học nào.`;
                  this.form.buttonType = 'Thêm';
                  this.form.disableEdit = false;
                }
              }
              else { // Nếu lớp không tồn tại
                this.form.state = false;
                this.form.NonExistent = `Lớp học ${this.form.code} hiện tại chưa có trong hệ thống. Hãy nhập vào lớp học này`;
                this.form.submitDisable = false;
                this.form.course_id = '';
                this.form.name = '';
                this.form.description = '';
                this.form.buttonType = 'Thêm';
                this.form.disableEdit = false;
              }
          });
      }, 300),
    },
    methods: {
      async CourseExistence() {
          try {
            const response = await axios({
              url: `${process.env.VUE_APP_API_URL}/course/existent-course`,
              method: 'get',
              changeOrigin: true,
              params: {
                searchCode: this.form.code,
              },
            });
            if (response.status === 200) {
              return response.data.search_result;
            }
          }
          catch(error) {
            this.$bvToast.toast(`Gặp lỗi ${error} khi tìm kiếm mã lớp môn học: ${this.searchCode}!`, {
              title: `Thất bại`,
              variant: 'danger',
              solid: true,
              appendToast: true,
            })
          }
      },
      onSubmit() {
        try {
          if (this.form.state === false) {
            if ( String(this.form.code).replace(' ', '') === ''
              || String(this.form.name).replace(' ', '') === ''
              || this.form.semester === null )
            {
              this.form.notFilled = true;
              setTimeout(() => {
                this.form.notFilled = false
              }, 3000);
            }
            else {
              if (this.form.NonExistent.includes('chưa có trong hệ thống')) {
                this.$bvModal.msgBoxConfirm(`Bạn có chắc chắn tạo và thêm lớp môn học ${this.form.name} vào lớp kỳ học này?`, {
                  title: 'Xác nhận thêm lớp môn học',
                  size: 'md',
                  buttonSize: 'sm',
                  okVariant: 'outline-danger',
                  okTitle: 'Có',
                  cancelTitle: 'Không',
                  cancelVariant: 'outline-primary',
                  footerClass: 'p-2',
                  hideHeaderClose: false,
                  centered: true,
                }).then(async () => {
                  const response = await axios({
                    url: `${process.env.VUE_APP_API_URL}/course/create-record`,
                    method: 'post',
                    changeOrigin: true,
                    data: {
                      new_code: this.form.code,
                      new_name: this.form.name,
                      new_description: this.form.description,
                      semester_id: this.form.semester,
                     },
                  });
                  if (response.status === 200) {
                    this.$bvToast.toast(`Tạo và thêm lớp môn học ${this.form.code} thành công vào kỳ học này!`, {
                      title: `Thành công`,
                      variant: 'success',
                      solid: true,
                      appendToast: true,
                    });
                    this.onReset();
                    this.refreshCourseList();
                  }
                  else if (response.status === 202) {
                    this.$bvToast.toast(`Trùng lặp dữ liệu!`, {
                      title: `Oops`,
                      variant: 'warning',
                      solid: true,
                      appendToast: true,
                    });
                  }
                })
              }
              else if (this.form.studentNonExistent.includes('chưa có kỳ học nào')) {
                this.$bvModal.msgBoxConfirm(`Bạn có chắc chắn thêm lớp môn học ${this.form.code}?`, {
                  title: 'Xác nhận thêm sinh viên',
                  size: 'md',
                  buttonSize: 'sm',
                  okVariant: 'outline-danger',
                  okTitle: 'Có',
                  cancelTitle: 'Không',
                  cancelVariant: 'outline-primary',
                  footerClass: 'p-2',
                  hideHeaderClose: false,
                  centered: true,
                }).then( async (val) => {
                  if (val === true) {
                    const response = await axios({
                      url: `${process.env.VUE_APP_API_URL}/course/update-record`,
                      method: 'post',
                      changeOrigin: true,
                      data: {
                        course_id: this.form.course_id,
                        update_code: this.form.code,
                        update_name: this.form.name,
                        update_description: this.form.description,
                        semester_id: this.form.semester,
                      },
                    });
                    if (response.status === 200) {
                      this.$bvToast.toast(`Cập nhật và thêm lớp môn học ${this.form.code} thành công vào kỳ học này!`, {
                        title: `Thành công`,
                        variant: 'success',
                        solid: true,
                        appendToast: true,
                      });
                      this.onReset();
                      this.refreshCourseList();
                    }
                  }
                });
              }
            }
          }
          else {
            this.$bvModal.msgBoxConfirm(`Bạn có chắc chắn chuyển lớp ${this.form.code} sang kỳ học này?`, {
              title: 'Xác nhận chuyển lớp môn học',
              size: 'md',
              buttonSize: 'sm',
              okVariant: 'outline-primary',
              okTitle: 'Có',
              cancelTitle: 'Không',
              cancelVariant: 'outline-danger',
              footerClass: 'p-2',
              hideHeaderClose: false,
              centered: true,
            }).then( async (val) => {
              if (val === true) {
                const response = await axios({
                  url: `${process.env.VUE_APP_API_URL}/course/update-record`,
                  method: 'put',
                  changeOrigin: true,
                  data: {
                    course_id: this.form.course_id,
                    update_code: this.form.code,
                    update_name: this.form.name,
                    update_description: this.form.description,
                    semester_id: this.form.semester,
                  },
                });
                if (response.status === 200) {
                  this.$bvToast.toast(`Chuyển lớp ${this.form.code} thành công sang kỳ học này!`, {
                    title: `Thành công`,
                    variant: 'success',
                    solid: true,
                    appendToast: true,
                  });
                  this.onReset();
                  this.refreshCourseList();
                }
              }
            });
          }
        } catch (e) {
          this.$bvToast.toast(`Gặp lỗi ${e.response.data.error_message} khi tạo hoặc thêm lớp môn học!`, {
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
        this.form.name = '';
        this.form.description = '';
        this.form.submitDisable = false;
        this.form.disableEdit = false;
        this.form.buttonType = 'Tạo';
        this.form.NonExistent = '';
        this.form.Existent = '';
        this.form.state = false;
      },
      refreshCourseList() {
        eventBus.$emit('refreshCourseList');
      }
    },
  }
</script>
