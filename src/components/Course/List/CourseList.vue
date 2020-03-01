<template>
    <b-tabs v-model="tabIndex" align="center" small content-class="mt-3">
        <b-tab title="Danh sách lớp môn học">
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
                              base-url="#"
                              first-number
                              last-number
                              @input="getCourseRecordData"
                            ></b-pagination-nav>
                    </b-col>
                    <b-col class="ml-auto my-1">
                        <b-form-select
                                v-model="selectedSemesterItem"
                                :options="semesterOptions"
                                size="sm"
                                value-field="semester_id"
                                text-field="name"
                        >
                            <template v-slot:first>
                                <b-form-select-option value="" disabled>-- Hãy chọn kỳ học trước để lấy danh sách môn học --</b-form-select-option>
                            </template>
                        </b-form-select>
                    </b-col>
                    <b-col sm="7" md="2" class="ml-auto my-1" cols="auto">
                        <b-button size="sm" variant="outline-success" @click="getCourseRecordData">
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
                                 select-mode="single"
                                 empty-text="Danh sách môn học trống (Lưu ý: Hãy chọn kỳ học trước)"
                                 :busy="busy"
                                 head-variant="light"
                                 :small="true"
                                 size="sm"
                                 :items="courseItems"
                                 :fields="fields"
                                 :per-page="perPage"
                                 :sort-by.sync="sortBy"
                                 @sort-changed="sortCourseRecordData"
                                 :sort-direction="sortOrder"
                                 hover
                        >
                            <template v-slot:table-busy>
                                <div class="text-center text-danger my-2">
                                    <b-spinner class="align-middle"></b-spinner>
                                    <strong class="ml-md-2">Đang tải...</strong>
                                </div>
                            </template>
                            <template v-slot:cell(studentList)="row">
                                <div>
                                    <b><a style="cursor: pointer" @click="getStudentCourseList(row.item)">Danh sách sinh viên</a></b>
                                </div>
                            </template>
                            <template v-slot:cell(lecturerList)="row">
                                <div>
                                    <b><a style="cursor: pointer" @click="getLecturerRecordData(row.item)">Danh sách giảng viên</a></b>
                                </div>
                            </template>
                            <template v-slot:cell(actions)="row">
                                <div class="text-center text-danger my-2" style="min-width: 100px;">
                                    <b-button variant="outline-warning" size="sm" @click="updateModal(row.item, row.index, $event.target)" class="mr-1">
                                        <b-icon icon="pencil"></b-icon>
                                    </b-button>
                                    <b-button variant="outline-danger" size="sm"  class="mr-1" @click="deleteCourse(row.item)">
                                        <b-icon icon="trash"></b-icon>
                                    </b-button>
                                </div>
                            </template>
                        </b-table>
                        <b-modal :id="EditModal.id" :title="EditModal.title" centered hide-footer scrollable button-size="sm">
                            <b-form @submit.prevent="submitSemesterUpdate">
                                <b-form-group
                                        id="edit-input-group-3"
                                    label="Họ tên:"
                                    label-for="edit-input-3"
                                  >
                                    <b-form-input
                                      id="edit-input-3"
                                      v-model="EditModal.UpdateCourseForm.name"
                                      type="text"
                                      size="sm"
                                      required
                                      placeholder="Nhập họ tên"
                                    ></b-form-input>
                                </b-form-group>

                                <b-alert :show="EditModal.UpdateCourseForm.notFilled" fade variant="danger">Nhập thiếu thông tin!</b-alert>
                                <b-button type="submit" size="sm" variant="outline-primary" style="float: right">Cập nhật</b-button>
                            </b-form>
                        </b-modal>
                    </b-col>
                </b-row>
            </b-container>
        </b-tab>
        <b-tab title="Danh sách sinh viên" :disabled="StudentCourseDisable" lazy>
            <StudentCourseList :prop_course="propStudentCourse"></StudentCourseList>
        </b-tab>
        <b-tab title="Danh sách giàng viên" :disabled="LecturerCourseDisable" lazy>
            <LecturerCourseList :prop_course="propLecturerCourse"></LecturerCourseList>
        </b-tab>
    </b-tabs>
</template>

<script>
    import axios from 'axios';
    import StudentCourseList from "@/components/Course/List/StudentCourseList";
    import LecturerCourseList from "@/components/Course/List/LecturerCourseList";
    import { mapState, mapActions } from 'vuex';

    export default {
        name: "CourseList",
        components: {
            StudentCourseList, LecturerCourseList,
        },
        data() {
          return {
              StudentCourseList,
              LecturerCourseList,
              selectedSemesterItem: '',
              semesterOptions: [],
              courseItems: [],
              perPage: 10,
              currentPage: 1,
              filter: '',
              sortBy: 'name',
              sortOrder: 'asc',
              totalPage: 1,
              StudentCourseDisable: true,
              LecturerCourseDisable: true,
              propStudentCourse: Object,
              propLecturerCourse: Object,
              tabIndex: 0,
              fields: [
                  {
                      key: 'course_id',
                      label: 'ID',
                      sortable: true,
                  },
                  {
                      key: 'code',
                      label: 'Mã lớp môn học',
                      sortable: true,
                  },
                  {
                      key: 'name',
                      label: 'Tên lớp môn học',
                      sortable: true,
                  },
                  {
                      key: 'description',
                      label: 'Mô tả',
                      sortable: true,
                      formatter: (value) => {
                          if (value === '' || value === null) {
                              return 'Không có';
                          }
                          else {
                              return value;
                          }
                      }
                  },
                  {
                      key: 'studentList',
                      label: 'Sinh viên'
                  },
                  {
                      key: 'lecturerList',
                      label: 'Giảng viên'
                  },
                  {
                      key: 'actions',
                      label: 'Hành động'
                  }
              ],
              totalCourse: 0,
              busy: false,
              EditModal: {
                  id: 'edit-modal',
                  title: '',
                  UpdateCourseForm: {
                      course_id: '',
                      name: '',
                      notFilled: false,
                  }
              }
          }
        },
        watch: {
            selectedSemesterItem: function () {
                this.setSemesterID(this.selectedSemesterItem);
                this.getCourseRecordData();
            }
        },
        computed: {
            ...mapState([
                'currentSemesterID',
            ]),
        },
        methods: {
            ...mapActions([
                'setSemesterID',
            ]),
            async getSemesterRecordData() {
                try {
                    const response = await axios({
                        url: 'http://localhost:5000/semester/all-records',
                        method: 'get',
                        changeOrigin: true,
                    });
                    if (response.status === 200) {
                        this.semesterOptions = [];
                        response.data.records.forEach((item) => {
                            this.semesterOptions.push(item);
                        });
                    }
                } catch (error) {
                    this.semesterOptions = [];
                    throw error;
                }
            },
            async getCourseRecordData() {
                this.busy = true;
                try {
                    const response = await axios({
                        url: 'http://localhost:5000/course/records',
                        method: 'get',
                        params: {
                            semester_id: this.selectedSemesterItem,
                            page_index: this.currentPage,
                            per_page: this.perPage,
                            sort_field: this.sortBy,
                            sort_order: this.sortOrder,
                        },
                        changeOrigin: true,
                    });
                    if (response.status === 200) {
                        this.courseItems = [];
                        this.totalCourse = response.data.total_results;
                        this.totalPage = response.data.num_pages;
                        response.data.records.forEach((item) => {
                            this.courseItems.push(item);
                        });
                        // console.log(this.data);
                        this.busy = false
                    }
                } catch (error) {
                    this.courseItems = [];
                    this.totalCourse = 0;
                    this.busy = false;
                    throw error;

                }
            },
            deleteCourse(item) {
                this.$bvModal.msgBoxConfirm(`Bạn có chắc chắn xóa môn học ${item.name}(${item.code})?`, {
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
                                url: 'http://localhost:5000/course/delete-record',
                                method: 'delete',
                                data: {
                                    delCourseID: item.course_id,
                                },
                            });
                            if (response.status === 200) {
                                this.$bvToast.toast(`Xóa môn học ${item.name}(${item.code})  thành công!`, {
                                    title: `Thành công`,
                                    variant: 'success',
                                    solid: true,
                                    appendToast: true,
                                })
                            }
                        } catch (e) {
                            this.$bvToast.toast(`Gặp lỗi ${e} khi xóa môn học ${item.name}(${item.code})!`, {
                                title: `Thất bại`,
                                variant: 'danger',
                                solid: true,
                                appendToast: true,
                            })
                        } finally {
                            if (this.courseItems.length === 1) {
                                if ((this.totalCourse / this.perPage) > 0) {
                                    this.currentPage--;
                                }
                                else {
                                    this.currentPage = 1;
                                }
                            }
                            this.getCourseRecordData();
                        }
                    }
                })
            },
            sortCourseRecordData(sort) {
                this.sortBy = sort.sortBy;
                if (sort.sortDesc === true) {
                    this.sortOrder = 'desc';
                }
                else {
                    this.sortOrder = 'asc';
                }
                this.getCourseRecordData();
            },
            getStudentCourseList(course_item) {
                this.StudentCourseDisable = false;
                this.propStudentCourse = course_item;
                this.tabIndex = 1;
            },
            getLecturerRecordData(course_item) {
                this.LecturerCourseDisable = false;
                this.propLecturerCourse = course_item;
                this.tabIndex = 2;
            },
        },
        created() {
            this.getSemesterRecordData();
            this.selectedSemesterItem = this.currentSemesterID;
            if (this.selectedSemesterItem !==  '' ) {
                this.getCourseRecordData();
            }
        }
    }
</script>
<style scoped>

</style>
