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
             <b-col sm="7" md="3" class="ml-auto my-1" cols="auto">
                 <b-button size="sm" variant="outline-primary" class="mr-2" @click="newCourseModal($event.target)">
                     <b-icon icon="book"></b-icon>
                     <span> Thêm</span>
                 </b-button>
                 <b-button size="sm" variant="outline-success" @click="getCourseRecordData">
                     <b-icon icon="arrow-repeat"></b-icon>
                     <span> Làm mới</span>
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
                             <a style="cursor: pointer; color: #007bff;" @click="getStudentCourseList(row.item)"><b-icon icon="people"></b-icon> Danh sách sinh viên</a>
                         </div>
                     </template>
                     <template v-slot:cell(lecturerList)="row">
                         <div>
                             <a style="cursor: pointer; color: #007bff" @click="getLecturerRecordData(row.item)"><b-icon icon="people"></b-icon> Danh sách giảng viên</a>
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
                 <b-modal :id="SubmitNewCourseModal.id" :title="SubmitNewCourseModal.title" centered hide-footer scrollable button-size="sm">
                     <Input :semestedID="selectedSemesterItem"/>
                 </b-modal>
                 <b-modal :id="EditModal.id" :title="EditModal.title" centered hide-footer scrollable lazy button-size="sm">
                     <b-form @submit.prevent="submitCourseUpdate">
                         <b-form-group
                                 id="edit-input-group-1"
                                 label="Mã lớp:"
                                 label-for="edit-input-1"
                         >
                             <b-form-input
                                     id="edit-input-1"
                                     v-model="EditModal.UpdateCourseForm.code"
                                     type="text"
                                     size="sm"
                                     required
                                     placeholder="Nhập mã lớp môn học"
                             ></b-form-input>
                                </b-form-group>

                                <b-form-group
                                        id="edit-input-group-2"
                                        label="Tiêu đề:"
                                        label-for="edit-input-2"
                                ><b-form-input
                                      id="edit-input-2"
                                      v-model="EditModal.UpdateCourseForm.name"
                                      type="text"
                                      size="sm"
                                      required
                                      placeholder="Nhập tên lớp môn học"
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
                                     v-model="EditModal.UpdateCourseForm.description"
                                     rows="4"
                                     max-rows="8"
                                     placeholder="Nhập mô tả (Không bắt buộc)"
                             ></b-form-textarea>
                         </b-form-group>
                         <b-alert :show="EditModal.UpdateCourseForm.notFilled" fade variant="danger">Nhập thiếu thông tin!</b-alert>
                         <b-button type="submit" size="sm" variant="outline-primary" style="float: right">Cập nhật</b-button>
                     </b-form>
                 </b-modal>
             </b-col>
         </b-row>
     </b-container>
</template>

<script>
    import axios from 'axios';
    import { mapState, mapActions } from 'vuex';
    import Input from '../List/Input';
    import {eventBus} from "@/main";
    import {authHeader} from "@/auth/jwt";

    export default {
        name: "CourseList",
        components: {
            Input
        },
        data() {
          return {
              Input,
              selectedSemesterItem: '',
              semesterOptions: [],
              courseItems: [],
              perPage: 10,
              currentPage: 1,
              filter: '',
              sortBy: 'course_id',
              sortOrder: 'asc',
              totalPage: 1,
              route: [
                  {
                      text: 'Danh sách lớp môn học',
                      to: { name: 'course-list' }
                  },
              ],
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
                      label: 'Sinh viên',
                      sortable: false,
                  },
                  {
                      key: 'lecturerList',
                      label: 'Giảng viên',
                      sortable: false,
                  },
                  {
                      key: 'actions',
                      label: 'Hành động'
                  }
              ],
              totalCourse: 0,
              busy: false,
              SubmitNewCourseModal: {
                  id: 'new-course-modal',
                  title: 'Thêm lớp môn học cho kỳ học hiện tại',
              },
              EditModal: {
                  id: 'edit-modal',
                  title: '',
                  UpdateCourseForm: {
                      course_id: '',
                      code: '',
                      name: '',
                      description: '',
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
                        url: `${process.env.VUE_APP_API_URL}/semester/all-records`,
                        method: 'get',
                        headers: { 'Authorization': authHeader() },
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
                        url: `${process.env.VUE_APP_API_URL}/course/records`,
                        method: 'get',
                        headers: { 'Authorization': authHeader() },
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
            newCourseModal(button) {
                this.$root.$emit('bv::show::modal', this.SubmitNewCourseModal.id, button);
            },
            updateModal(item, index, button) {
                this.EditModal.title = `Sửa thông tin lớp môn học ${item.name}`;
                this.EditModal.UpdateCourseForm.course_id = item.course_id;
                this.EditModal.UpdateCourseForm.code = item.code;
                this.EditModal.UpdateCourseForm.name = item.name;
                this.EditModal.UpdateCourseForm.description = item.description;
                this.$root.$emit('bv::show::modal', this.EditModal.id, button);
            },
            async submitCourseUpdate() {
                try {
                    if (String(this.EditModal.UpdateCourseForm.code).replace(' ', '') === ''
                        || String(this.EditModal.UpdateCourseForm.name).replace(' ', '') === ''
                    ) {
                        this.EditModal.UpdateCourseForm.notFilled = true;
                        setTimeout(() => {
                            this.EditModal.UpdateCourseForm.notFilled = false;
                        }, 3000);
                    }
                    else {
                        const response = await axios({
                            url: `${process.env.VUE_APP_API_URL}/course/update-record`,
                            method: 'put',
                            headers: { 'Authorization': authHeader() },
                            data: {
                                course_id: this.EditModal.UpdateCourseForm.course_id,
                                update_name: this.EditModal.UpdateCourseForm.name,
                                update_code: this.EditModal.UpdateCourseForm.code,
                                update_description: this.EditModal.UpdateCourseForm.description,
                            },
                            changeOrigin: true,
                        });
                        if (response.status === 200) {
                            this.$bvToast.toast(`Cập nhật lớp môn học ${this.EditModal.UpdateCourseForm.name} thành công!`, {
                                title: `Thành công`,
                                variant: 'success',
                                solid: true,
                                appendToast: true,
                            });
                            this.$root.$emit('bv::hide::modal', this.EditModal.id);
                            this.getCourseRecordData();
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
                    this.$bvToast.toast(`Gặp lỗi ${e} khi cập nhật lớp môn học học ${this.EditModal.UpdateCourseForm.name}!`, {
                        title: `Thất bại`,
                        variant: 'danger',
                        solid: true,
                        appendToast: true,
                    })
                } finally {
                    this.getSemesterRecordData();
                }
            },
            deleteCourse(item) {
                this.$bvModal.msgBoxConfirm(`Bạn có chắc chắn xóa môn học ${item.name} (${item.code})?`, {
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
                                url: `${process.env.VUE_APP_API_URL}/course/delete-record`,
                                method: 'delete',
                                headers: { 'Authorization': authHeader() },
                                data: {
                                    delCourseID: item.course_id,
                                },
                            });
                            if (response.status === 200) {
                                this.$bvToast.toast(`Xóa môn học ${item.name} (${item.code})  thành công!`, {
                                    title: `Thành công`,
                                    variant: 'success',
                                    solid: true,
                                    appendToast: true,
                                })
                            }
                        } catch (e) {
                            this.$bvToast.toast(`Gặp lỗi ${e.response.data.error_message} khi xóa môn học ${item.name}(${item.code})!`, {
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
                this.$router.push({ name: 'student-course-list',
                                    params: { id: course_item.course_id,
                                            code: course_item.code,
                                            name: course_item.name }
                });
            },
            getLecturerRecordData(course_item) {
                this.$router.push({ name: 'lecturer-course-list',
                                    params: { id: course_item.course_id,
                                            code: course_item.code,
                                            name: course_item.name }
                });
            },
        },
        created() {
            this.getSemesterRecordData();
            this.selectedSemesterItem = this.currentSemesterID;
            if (this.selectedSemesterItem !==  '' ) {
                this.getCourseRecordData();
            }
            eventBus.$on('refreshCourseList', () => {
                this.$root.$emit('bv::hide::modal', this.SubmitNewCourseModal.id);
                this.getCourseRecordData();
            });
        }
    }
</script>
<style scoped>

</style>
