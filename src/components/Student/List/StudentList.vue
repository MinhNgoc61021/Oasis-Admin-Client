<template>
    <b-container>
        <b-row>
            <b-col sm="7" md="6" class="my-1 mb-2">
                <b-pagination-nav
                  v-model="currentPage"
                  :total-rows="perPage"
                  :number-of-pages="totalPage"
                  align="fill"
                  size="sm"
                  class="my-0 light"
                  first-number
                  last-number
                  base-url="#"
                  @input="getStudentRecordData"
                ></b-pagination-nav>
            </b-col>
            <b-col class="ml-auto my-1">
                <Search></Search>
            </b-col>
            <b-col sm="7" md="2" class="ml-auto my-1" cols="auto">
                <b-button size="sm" variant="outline-success" @click="getStudentRecordData">
                  <b-icon icon="arrow-repeat
                    "></b-icon>
                    <span>
                        Làm mới
                    </span>
                </b-button>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-table responsive
                         show-empty
                         empty-text="Danh sách sinh viên trống"
                         :busy="busy"
                         head-variant="light"
                         :small="true"
                         size="sm"
                         :items="studentItems"
                         :fields="fields"
                         :per-page="perPage"
                         :sort-by.sync="sortBy"
                         @sort-changed="sortStudentRecordData"
                         :sort-direction="sortOrder"
                         hover
                >
                    <template v-slot:table-busy>
                        <div class="text-center text-danger my-2">
                              <b-spinner class="align-middle"></b-spinner>
                              <strong class="ml-md-2">Đang tải...</strong>
                        </div>
                    </template>
                    <template v-slot:cell(actions)="row">
                        <div class="text-center text-danger my-2" style="min-width: 120px;">
                            <b-button variant="outline-warning" size="sm" @click="updateModal(row.item, row.index, $event.target)" class="mr-1">
                                <b-icon icon="pencil"></b-icon>
                            </b-button>
                            <b-button variant="outline-danger" size="sm"  class="mr-1" @click="deleteStudent(row.item)">
                                <b-icon icon="trash"></b-icon>
                            </b-button>
                        </div>
                    </template>
                </b-table>
                <b-modal :id="EditModal.id" :title="EditModal.title" centered hide-footer scrollable lazy button-size="sm">
                    <b-form @submit.prevent="submitStudentUpdate">
                       <b-form-group
                        id="edit-input-group-0"
                        label="Mã số sinh viên:"
                        label-for="edit-input-0"
                       >
                        <b-form-input
                          id="edit-input-0"
                          v-model="EditModal.UpdateStudentForm.code"
                          type="text"
                          size="sm"
                          placeholder="Nhập mã số sinh viên"
                        ></b-form-input>
                      </b-form-group>

                      <b-form-group
                        id="edit-input-group-1"
                        label="Email:"
                        label-for="edit-input-1"
                      >
                        <b-form-input
                          id="edit-input-1"
                          v-model="EditModal.UpdateStudentForm.email"
                          type="email"
                          size="sm"
                          placeholder="Nhập tên đăng nhập"
                        ></b-form-input>
                      </b-form-group>

                      <b-form-group
                        id="edit-input-group-2"
                        label="Tên đăng nhập:"
                        label-for="edit-input-2"
                      >
                        <b-form-input
                          id="edit-input-2"
                          v-model="EditModal.UpdateStudentForm.username"
                          type="text"
                          size="sm"
                          placeholder="Nhập tên đăng nhập"
                        ></b-form-input>
                      </b-form-group>

                      <b-form-group
                        id="edit-input-group-3"
                        label="Họ tên:"
                        label-for="edit-input-3"
                      >
                        <b-form-input
                          id="edit-input-3"
                          v-model="EditModal.UpdateStudentForm.name"
                          type="text"
                          size="sm"
                          placeholder="Nhập họ tên"
                        >
                        </b-form-input>
                      </b-form-group>

                      <b-form-group
                            id="edit-input-group-4"
                            label="Ngày sinh:"
                            label-for="edit-input-4"
                      >
                        <b-form-input
                                type="date"
                                id="input-5"
                                v-model="EditModal.UpdateStudentForm.dob"
                                size="sm" class="mb-2">
                        </b-form-input>
                      </b-form-group>

                      <b-form-group
                        id="edit-input-group-5"
                        label="Lớp:"
                        label-for="edit-input-5"
                      >
                        <b-form-input
                          id="edit-input-5"
                          v-model="EditModal.UpdateStudentForm.class_course"
                          type="text"
                          size="sm"
                          placeholder="Nhập lớp"
                        >
                        </b-form-input>
                      </b-form-group>
                      <b-form-group
                        id="edit-input-group-6"
                        label="Lớp:"
                        label-for="edit-input-6"
                      >
                        <StudentCourseEdit id="input-6" :course-code="EditModal.UpdateStudentForm.course"></StudentCourseEdit>
                      </b-form-group>
                      <b-form-group
                              id="edit-input-group-7"
                              label="Active:"
                              label-for="edit-input-7">
                        <b-form-checkbox
                                v-model="EditModal.UpdateStudentForm.actived"
                                size="sm"
                                id="edit-input-7"
                                name="check-button"
                                switch>
                          <span v-if="EditModal.UpdateStudentForm.actived !== true">Không</span>
                          <span v-else>Có</span>
                        </b-form-checkbox>
                      </b-form-group>

                      <b-form-group
                              id="edit-input-group-8"
                              label="Khóa tài khoản:"
                              label-for="edit-input-8">
                        <b-form-checkbox
                                v-model="EditModal.UpdateStudentForm.is_lock"
                                size="sm" id="edit-input-8"
                                name="check-button"
                                switch
                        >
                          <span v-if="EditModal.UpdateStudentForm.is_lock !== true">Không khóa</span>
                          <span v-else>Khóa</span>
                        </b-form-checkbox>
                      </b-form-group>
                      <b-alert :show="EditModal.UpdateStudentForm.notFilled" fade variant="danger">Nhập thiếu thông tin!</b-alert>
                      <b-button type="submit" size="sm" variant="outline-primary" style="float: right">Cập nhật</b-button>
                    </b-form>
                </b-modal>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import axios from 'axios';
    import moment from 'moment/moment';
    import { eventBus } from "@/main";
    import Search from "@/components/Student/List/Search";
    import StudentCourseEdit from "@/components/Student/List/StudentCourseEdit";

    export default {
        name: "StudentList",
        components: {
            Search, StudentCourseEdit
        },
        data() {
          return {
              Search, StudentCourseEdit,
              studentItems: [],
              perPage: 10,
              currentPage: 1,
              filter: '',
              sortBy: 'code',
              sortOrder: 'asc',
              totalPage: 1,
              fields: [
                  {
                      key: 'code',
                      label: 'Mã số sinh viên',
                      sortable: true,
                  },
                  {
                      key: 'user.username',
                      label: 'Tên đăng nhập',
                      sortable: true,
                  },
                  {
                      key: 'user.name',
                      label: 'Họ tên',
                      sortable: true,
                  },
                  {
                      key: 'dob',
                      label: 'Ngày sinh',
                      sortable: true,
                      formatter: value => {
                        return moment(value).format('MM/DD/YYYY');
                      }
                  },
                  {
                      key: 'user.email',
                      label: 'Email',
                      sortable: true,
                  },
                  {
                      key: 'class_course',
                      label: 'Lớp',
                      sortable: true,
                  },
                  {
                      key: 'user.actived',
                      label: 'Quyền hoạt động',
                      sortable: true,
                      formatter: value => {
                          if (value === 1) {
                              return `Có`
                          }
                          else {
                              return `Không`
                          }
                      }
                  },
                  {
                      key: 'user.is_lock',
                      label: 'Khóa',
                      sortable: true,
                      formatter: value => {
                          if (value === 1) {
                              return `Có`
                          }
                          else {
                              return `Không`
                          }
                      }
                  },
                  {
                      key: 'actions',
                      label: 'Hành động'
                  }
              ],
              totalStudent: 0,
              busy: false,
              EditModal: {
                  id: 'edit-modal',
                  title: '',
                  UpdateStudentForm: {
                      student_id: '',
                      user_id: '',
                      code: '',
                      username: '',
                      name: '',
                      dob: '',
                      email: '',
                      class_course: '',
                      course: Object,
                      actived: Boolean,
                      is_lock: Boolean,
                      notFilled: false,
                  }
              }
          }
        },
        methods: {
            async getStudentRecordData() {
                this.busy = true;
                try {
                    const response = await axios({
                        url: 'http://localhost:5000/student/records',
                        method: 'get',
                        params: {
                            page_index: this.currentPage,
                            per_page: this.perPage,
                            sort_field: this.sortBy,
                            sort_order: this.sortOrder,
                        },
                        changeOrigin: true,
                    });
                    if (response.status === 200) {
                        this.studentItems = [];
                        this.totalStudent = response.data.total_results;
                        this.totalPage = response.data.num_pages;
                        response.data.records.forEach((item) => {
                            this.studentItems.push(item);
                        });
                        // console.log(this.data);
                        this.busy = false
                    }
                } catch (error) {
                    this.studentItems = [];
                    this.totalStudent = 0;
                    this.busy = false;
                    throw error;

                }
            },
            async updateModal(item, index, button) {
                this.EditModal.title = `Sửa thông tin sinh viên ${item.user.name}`;
                this.EditModal.UpdateStudentForm.student_id = item.student_id;
                this.EditModal.UpdateStudentForm.code = item.code;
                this.EditModal.UpdateStudentForm.user_id = item.user.user_id;
                this.EditModal.UpdateStudentForm.username = item.user.username;
                this.EditModal.UpdateStudentForm.name = item.user.name;
                this.EditModal.UpdateStudentForm.dob = item.dob;
                this.EditModal.UpdateStudentForm.email = item.user.email;
                this.EditModal.UpdateStudentForm.class_course = item.class_course;
                const course = await axios({
                    url: 'http://localhost:5000/course/student-course',
                    method: 'get',
                    params: {
                        student_id: item.student_id,
                    },
                    changeOrigin: true,
                });

                this.EditModal.UpdateStudentForm.course = course.data.course;
                this.EditModal.UpdateStudentForm.actived = item.user.actived === 1;
                this.EditModal.UpdateStudentForm.is_lock = item.user.is_lock === 1;
                this.$root.$emit('bv::show::modal', this.EditModal.id, button);
            },
            async submitStudentUpdate() {
                console.log(this.EditModal.UpdateStudentForm.course);
                try {
                    if (String(this.EditModal.UpdateStudentForm.code).replace(' ', '') === ''
                        || String(this.EditModal.UpdateStudentForm.name).replace(' ', '') === ''
                        || String(this.EditModal.UpdateStudentForm.dob).replace(' ', '') === ''
                        || String(this.EditModal.UpdateStudentForm.class_course).replace(' ', '') === ''
                        || String(this.EditModal.UpdateStudentForm.username).replace(' ', '') === ''
                        || String(this.EditModal.UpdateStudentForm.dob).replace(' ', '') === ''
                        || String(this.EditModal.UpdateStudentForm.email).replace(' ', '') === ''
                        || this.EditModal.UpdateStudentForm.course == null
                    ) {
                        this.EditModal.UpdateStudentForm.notFilled = true;
                        setTimeout(() => {
                            this.EditModal.UpdateStudentForm.notFilled = false;
                        }, 3000);
                    }
                    else {
                        const response = await axios({
                            url: 'http://localhost:5000/student/update-record',
                            method: 'put',
                            data: {
                                user_id: this.EditModal.UpdateStudentForm.user_id,
                                student_id: this.EditModal.UpdateStudentForm.student_id,
                                update_code: this.EditModal.UpdateStudentForm.code,
                                update_username: this.EditModal.UpdateStudentForm.username,
                                update_email: this.EditModal.UpdateStudentForm.email,
                                update_name: this.EditModal.UpdateStudentForm.name,
                                update_dob: moment(this.EditModal.UpdateStudentForm.dob).format('YYYY-MM-DD'),
                                update_class_course: this.EditModal.UpdateStudentForm.class_course,
                                update_course_id: this.EditModal.UpdateStudentForm.course.course_id,
                                update_actived: this.EditModal.UpdateStudentForm.actived,
                                update_is_lock: this.EditModal.UpdateStudentForm.is_lock,
                            },
                            changeOrigin: true,
                        });
                        if (response.status === 200) {
                            this.$bvToast.toast(`Cập nhật thông tin sinh viên ${this.EditModal.UpdateStudentForm.name} thành công!`, {
                                title: `Thành công`,
                                variant: 'success',
                                solid: true,
                                appendToast: true,
                            });
                            this.$root.$emit('bv::hide::modal', this.EditModal.id);
                            this.getStudentRecordData();
                        }
                        else if (response.status === 202) {
                            this.$bvToast.toast(`Trùng dữ liệu!`, {
                                title: `Oops!`,
                                variant: 'warning',
                                solid: true,
                                appendToast: true,
                            })
                        }
                    }

                } catch (e) {
                    this.$bvToast.toast(`Gặp lỗi ${e} khi cập nhật thông tin sinh viên!`, {
                        title: `Thất bại`,
                        variant: 'danger',
                        solid: true,
                        appendToast: true,
                    })
                }
            },
            deleteStudent(item) {
                this.$bvModal.msgBoxConfirm(`Bạn có chắc chắn xóa sinh viên ${item.user.name}?`, {
                    title: 'Xác nhận xóa',
                    size: 'md',
                    buttonSize: 'sm',
                    okVariant: 'outline-danger',
                    okTitle: 'Có',
                    cancelTitle: 'Không',
                    cancelVariant: 'outline-primary',
                    footerClass: 'p-2',
                    hideHeaderClose: false,
                    centered: true,
                }).then(async (value) => {
                    if (value === true) {
                        try {
                            const response = await axios({
                                url: 'http://localhost:5000/student/delete-record',
                                method: 'delete',
                                data: {
                                    // delStudentCode: item.code,
                                    delUserID: item.user.user_id,
                                },
                            });
                            if (response.status === 200) {
                                this.$bvToast.toast(`Xóa sinh viên ${item.user.name} thành công!`, {
                                    title: `Thành công`,
                                    variant: 'success',
                                    solid: true,
                                    appendToast: true,
                                })
                            }
                        } catch (e) {
                            this.$bvToast.toast(`Gặp lỗi ${e} khi sinh viên ${item.user.name}!`, {
                                title: `Thất bại`,
                                variant: 'danger',
                                solid: true,
                                appendToast: true,
                            })
                        } finally {
                            if (this.studentItems.length === 1) {
                                if ((this.totalStudent / this.perPage) > 0) {
                                    this.currentPage--;
                                }
                                else {
                                    this.currentPage = 1;
                                }
                            }
                            this.getStudentRecordData();
                        }
                    }
                })
            },
            sortStudentRecordData(sort) {
                this.sortBy = sort.sortBy;
                if (sort.sortDesc === true) {
                    this.sortOrder = 'desc';
                }
                else {
                    this.sortOrder = 'asc';
                }
                this.getStudentRecordData();
            }
        },
        created() {
            this.getStudentRecordData();
            eventBus.$on('studentSearchSelected', (searchSelected) => {
                this.studentItems = [];
                this.studentItems.push(searchSelected);
                this.totalPage = 1;
            });
            eventBus.$on('courseEditSelected', (searchSelected) => {
                this.EditModal.UpdateStudentForm.course = searchSelected;
            });
        }
    }
</script>
<style scoped>

</style>
