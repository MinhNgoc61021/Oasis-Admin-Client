<template>
    <b-form @submit.prevent="onSubmitStudentCourse" @reset.prevent="onReset">
      <b-form-group
        id="input-group-1"
        label="Mã số sinh viên:"
        label-for="input-1"
        :valid-feedback="form.studentExistent"
        :invalid-feedback="form.studentNonExistent"
      >
        <b-form-input
          id="input-1"
          size="sm"
          v-model="form.code"
          maxlength="8"
          type="text"
          :state="form.state"
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
          :readonly="form.disableEdit"
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
          :readonly="form.disableEdit"
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
          :readonly="form.disableEdit"
          type="text"
          placeholder="Nhập lớp"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-8" label="Active:" label-for="input-8">
        <b-form-checkbox v-model="form.actived" id="input-8" size="sm" name="check-button" :disabled="form.disableEdit" switch>
          <span v-if="form.actived !== true">Khóa</span>
          <span v-else>Mở</span>
        </b-form-checkbox>
      </b-form-group>

      <b-form-group id="input-group-9" label="Khóa tài khoản:" label-for="input-9">
        <b-form-checkbox v-model="form.is_lock" id="input-9" size="sm" :disabled="form.disableEdit" name="check-button" switch>
          <span v-if="form.is_lock !== true">Không khóa</span>
          <span v-else>Khóa</span>
        </b-form-checkbox>
      </b-form-group>
      <b-alert :show="form.notFilled" fade variant="danger">Nhập thiếu thông tin!</b-alert>
      <b-button size="sm" type="submit" :disabled="form.submitDisable" variant="outline-primary" style="float: right;">{{ form.buttonType }}</b-button>
      <b-button size="sm" type="reset" class="mr-2" variant="outline-danger" style="float: right;">Lại</b-button>
    </b-form>
</template>

<script>
    import axios from "axios";
    import debounce from 'lodash/debounce';

    export default {
        name: "NewStudentForm",
        props: ['course_id', 'course_code', 'course_name'],
        data() {
            return {
                form: {
                    current_course_id: '', // của sinh viên cụ thể
                    course_id: this.course_id,
                    course_code: this.course_code,
                    course_name: this.course_name,
                    user_id: '',
                    student_id: '',
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
                    submitDisable: true,
                    state: false,
                    studentExistent: '',
                    studentNonExistent: 'Yêu cầu nhập đúng 8 ký tự số',
                    buttonType: 'Thêm',
                    disableEdit: false,
                },
                courseExistence: Object,
            }
        },
        watch: {
            'form.code': debounce (function () {
                this.form.username = this.form.code;
                this.form.email = this.form.code + '@vnu.edu.vn';
                if (this.form.code.length === 8) {
                    this.courseExistence = this.studentCourseExistence().then((res) => {
                        if (JSON.stringify(res[1]) !== '{}') { // Nếu sinh viên tồn tại
                            if (JSON.stringify(res[0]) !== '{}') {  // Nếu sinh viên đã có lớp học rồi
                                this.form.state = true;

                                if (parseInt(res[0].course_id) !== parseInt(this.form.course_id)) { // Nếu sinh viên đã có lớp học rồi nhưng ko đúng lớp cần thêm
                                    this.form.current_course_id = res[0].course_id;
                                    this.form.studentExistent = `Sinh viên có MSSV: ${this.form.code} đã có trong lớp khác: ${res[0].name} (${res[0].code})`;
                                    this.form.user_id = res[1].user.user_id;
                                    this.form.student_id = res[1].student_id;
                                    this.form.name = res[1].user.name;
                                    this.form.dob = res[1].dob;
                                    this.form.class_course = res[1].class_course;
                                    this.form.is_lock = res[1].user.is_lock === 1;
                                    this.form.actived = res[1].user.actived === 1;
                                    this.form.submitDisable = false;
                                    this.form.buttonType = 'Cập nhật';
                                    this.form.disableEdit = true;
                                }
                                else {
                                    this.form.studentExistent = `Sinh viên có MSSV: ${this.form.code} đã có trong lớp học này.`;
                                    this.form.user_id = res[1].user.user_id;
                                    this.form.student_id = res[1].student_id;
                                    this.form.name = res[1].user.name;
                                    this.form.dob = res[1].dob;
                                    this.form.class_course = res[1].class_course;
                                    this.form.is_lock = res[1].user.is_lock === 1;
                                    this.form.actived = res[1].user.actived === 1;
                                    this.form.submitDisable = true;
                                    this.form.disableEdit = true;
                                }
                            }
                            else {
                                this.form.state = false;
                                this.form.studentNonExistent = `Sinh viên có MSSV: ${this.form.code} hiện tại chưa có lớp học nào.`;
                                this.form.submitDisable = false;
                                this.form.user_id = res[1].user.user_id;
                                this.form.student_id = res[1].student_id;
                                this.form.name = res[1].user.name;
                                this.form.dob = res[1].dob;
                                this.form.class_course = res[1].class_course;
                                this.form.is_lock = res[1].user.is_lock === 1;
                                this.form.actived = res[1].user.actived === 1;
                                this.form.buttonType = 'Thêm';
                                this.form.disableEdit = true;
                            }
                        }
                        else { // Nếu sinh viên không tồn tại
                            this.form.state = false;
                            this.form.studentNonExistent = `Sinh viên có MSSV: ${this.form.code} hiện tại chưa có trong hệ thống. Hãy nhập vào sinh viên này`;
                            this.form.submitDisable = false;
                            this.form.name = '';
                            this.form.dob = '';
                            this.form.class_course = '';
                            this.form.is_lock = false;
                            this.form.actived = true;
                            this.form.buttonType = 'Thêm';
                            this.form.disableEdit = false;
                        }
                    });
                }
                else {
                    this.form.state = false;
                    this.form.studentExistent = '';
                    this.form.studentNonExistent = 'Yêu cầu nhập đúng 8 ký tự số';
                    this.form.submitDisable = true;
                    this.form.name = '';
                    this.form.dob = '';
                    this.form.class_course = '';
                    this.form.is_lock = false;
                    this.form.actived = true;
                    this.form.buttonType = 'Thêm';
                    this.form.disableEdit = false;
                }
            }, 300),
        },
        methods: {
            async studentCourseExistence() {
                try {
                    const response = await axios({
                        url: `${process.env.VUE_APP_API_URL}/student/search-from-course-existence`,
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
                    this.$bvToast.toast(`Gặp lỗi ${error} khi tìm kiếm sinh viên có MSSV: ${this.searchCode}!`, {
                        title: `Thất bại`,
                        variant: 'danger',
                        solid: true,
                        appendToast: true,
                    })
                }
            },
            onSubmitStudentCourse() {
                try {
                    if (this.form.state === false) {
                        if ( String(this.form.code).replace(' ', '') === ''
                            || String(this.form.username).replace(' ', '') === ''
                            || String(this.form.name).replace(' ', '') === ''
                            || String(this.form.email).replace(' ', '') === ''
                            || String(this.form.dob).replace(' ', '') === ''
                            || String(this.form.class_course).replace(' ', '') === '')
                        {
                            this.form.notFilled = true;
                            setTimeout(() => {
                                this.form.notFilled = false
                            }, 3000);
                        }
                        else {
                            if (this.form.studentNonExistent.includes('chưa có trong hệ thống')) {
                                this.$bvModal.msgBoxConfirm(`Bạn có chắc chắn tạo và thêm sinh viên ${this.form.name} vào lớp ${this.course_name} (${this.course_code})?`, {
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
                                }).then(async () => {
                                    const response = await axios({
                                        url: `${process.env.VUE_APP_API_URL}/student/create-record`,
                                        method: 'post',
                                        changeOrigin: true,
                                        data: {
                                            new_code: this.form.code,
                                            new_username: this.form.username,
                                            new_name: this.form.name,
                                            new_email: this.form.email,
                                            new_dob: this.form.dob,
                                            new_class_cource: this.form.class_course,
                                            new_course_id: this.course_id,
                                            new_actived: this.form.actived,
                                            new_is_lock: this.form.is_lock,
                                        },
                                    });
                                    if (response.status === 200) {
                                        this.$bvToast.toast(`Tạo và thêm sinh viên ${this.form.name} vào lớp ${this.course_name} (${this.course_code}) thành công!`, {
                                            title: `Thành công`,
                                            variant: 'success',
                                            solid: true,
                                            appendToast: true,
                                        });
                                        this.onReset();
                                    }
                                })
                            }
                            else if(this.form.studentNonExistent.includes('chưa có lớp học nào')) {
                                this.$bvModal.msgBoxConfirm(`Bạn có chắc chắn thêm sinh viên ${this.form.name} vào lớp ${this.course_name} (${this.course_code})?`, {
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
                                            url: `${process.env.VUE_APP_API_URL}/student/create-student-course-record`,
                                            method: 'post',
                                            changeOrigin: true,
                                            data: {
                                                student_id: this.form.student_id,
                                                course_id: this.form.course_id,
                                            },
                                        });
                                        if (response.status === 200) {
                                            this.$bvToast.toast(`Cập nhật và thêm sinh viên ${this.form.name} vào lớp ${this.course_name} (${this.course_code}) thành công!`, {
                                                title: `Thành công`,
                                                variant: 'success',
                                                solid: true,
                                                appendToast: true,
                                            });
                                            this.onReset();
                                        }
                                    }
                                })
                            }
                        }
                    }
                    else {
                        this.$bvModal.msgBoxConfirm(`Bạn có chắc chắn chuyển lớp của sinh viên ${this.form.name} sang lớp ${this.course_name} (${this.course_code})?`, {
                             title: 'Xác nhận chuyển sinh viên',
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
                                    url: `${process.env.VUE_APP_API_URL}/student/update-student-course-record`,
                                    method: 'put',
                                    changeOrigin: true,
                                    data: {
                                        student_id: this.form.student_id,
                                        current_course_id: this.form.current_course_id,
                                        update_course_id: this.form.course_id,
                                    },
                                });
                                if (response.status === 200) {
                                    this.$bvToast.toast(`Chuyển sinh viên ${this.form.name} vào lớp ${this.course_name} (${this.course_code}) thành công!`, {
                                        title: `Thành công`,
                                        variant: 'success',
                                        solid: true,
                                        appendToast: true,
                                    });
                                    this.onReset();
                                }
                            }
                        })
                    }
                } catch (e) {
                    this.$bvToast.toast(`Gặp lỗi ${e} khi tạo hoặc thêm sinh viên thất bại!`, {
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
                this.form.buttonType = 'Thêm';
                this.form.disableEdit = false;
                // eventBus.$emit('clearCourse');
            }
        },
    }
</script>

<style scoped>

</style>
