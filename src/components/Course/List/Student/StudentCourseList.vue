<template>
    <b-container>
        <b-breadcrumb :items="route"></b-breadcrumb>
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
                  @input="getStudentCourseRecordData"
                ></b-pagination-nav>
            </b-col>
            <b-col class="ml-auto my-1">
                <SearchStudentByCourse :current_course="course_id" location="from-course"></SearchStudentByCourse>
            </b-col>
            <b-col sm="7" md="3" class="ml-auto my-1" cols="auto">
                <b-button size="sm" variant="outline-primary" title="Thêm sinh viên" class="mr-2" @click="openNewStudentModal($event.target)">
                  <b-icon icon="plus
                    "></b-icon>
                    <span>Thêm</span>
                </b-button>
                <b-button size="sm" variant="outline-success" @click="getStudentCourseRecordData">
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
                        <div class="text-center text-danger my-2">
                            <b-button variant="outline-danger" size="sm"  class="mr-1" @click="deleteStudent(row.item)">
                                <b-icon icon="trash"></b-icon>
                            </b-button>
                        </div>
                    </template>
                </b-table>
                <b-modal :id="AddStudentModal.id" :title="AddStudentModal.title" centered hide-footer button-size="sm">
                    <NewStudentForm :course_id="id" :course_code="code" :course_name="name"></NewStudentForm>
                </b-modal>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import axios from 'axios';
    import moment from 'moment/moment';
    import { eventBus } from "@/main";
    import SearchStudentByCourse from "@/components/Course/List/Student/SearchStudentByCourse";
    import NewStudentForm from "@/components/Course/List/Student/NewStudentForm";

    export default {
        props: ['id', 'code', 'name'],
        name: "StudentCourseList",
        components: {
            SearchStudentByCourse, NewStudentForm
        },
        data() {
          return {
              SearchStudentByCourse, NewStudentForm,
              course_id: this.id,
              course_name: this.name,
              course_code: this.code,
              studentItems: [],
              perPage: 10,
              currentPage: 1,
              filter: '',
              sortBy: 'code',
              sortOrder: 'asc',
              totalPage: 1,
              route: [
                  {
                    text: 'Danh sách lớp môn học',
                    to: { name: 'course-list' }
                  },
                  {
                    text: 'Danh sách sinh viên lớp ' + this.name + ' (' + this.code + ')',
                    active: false,
                  }
              ],
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
              AddStudentModal: {
                  id: 'add-student-modal',
                  title: 'Thêm sinh viên vào lớp ' + this.name + ' (' + this.code + ')',
              }
          }
        },
        methods: {
            async getStudentCourseRecordData() {
                this.busy = true;
                try {
                    const response = await axios({
                        url: 'http://localhost:5000/student/records-by-course',
                        method: 'get',
                        params: {
                            course_id: this.course_id,
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
                                url: 'http://localhost:5000/student/delete-student-course-record',
                                method: 'delete',
                                data: {
                                    // delStudentCode: item.code,
                                    student_id: item.student_id,
                                    course_id: this.course_id,
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
                            this.getStudentCourseRecordData();
                        }
                    }
                })
            },
            openNewStudentModal(button) {
              this.$root.$emit('bv::show::modal', this.AddStudentModal.id, button);
            },
            sortStudentRecordData(sort) {
                this.sortBy = sort.sortBy;
                if (sort.sortDesc === true) {
                    this.sortOrder = 'desc';
                }
                else {
                    this.sortOrder = 'asc';
                }
                this.getStudentCourseRecordData();
            },
            onReset() {
                // Reset our form values\
                this.AddStudentModal.SubmitStudentForm.student_id = '';
            }
        },
        created() {
            this.getStudentCourseRecordData();
            eventBus.$on('studentInCourseSearchSelected', (searchSelected) => {
                this.studentItems = [];
                this.studentItems.push(searchSelected);
                this.totalPage = 1;
            });
            eventBus.$on('studentOutsideCourseSearchSelected', (searchSelected) => {
                this.AddStudentModal.SubmitStudentForm.student_id = searchSelected.student_id;
            })
        }
    }
</script>
<style scoped>

</style>
