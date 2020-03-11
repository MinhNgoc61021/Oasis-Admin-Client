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
                  @input="getLecturerRecordData"
                ></b-pagination-nav>
            </b-col>
            <b-col class="ml-auto my-1">
                <SearchLecturerByCourse :current_course="course_id" location="from-course"></SearchLecturerByCourse>
            </b-col>
            <b-col sm="7" md="3" class="m1-auto my-1" cols="auto">
                <b-button size="sm" variant="outline-primary" title="Thêm giảng viên" class="mr-2" @click="openNewLecturerModal($event.target)">
                  <b-icon icon="plus
                    "></b-icon>
                    <span>Thêm</span>
                </b-button>
                <b-button size="sm" variant="outline-success" @click="getLecturerRecordData">
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
                         :busy="busy"
                         show-empty
                         empty-text="Danh sách giảng viên trống"
                         head-variant="light"
                         :small="true"
                         size="sm"
                         :items="lecturerItems"
                         :fields="fields"
                         :per-page="perPage"
                         :sort-by.sync="sortBy"
                         @sort-changed="sortLectureRecordData"
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
                            <b-button variant="outline-danger" size="sm"  class="mr-1" @click="deleteLecturer(row.item)">
                                <b-icon icon="trash"></b-icon>
                            </b-button>
                        </div>
                    </template>
                </b-table>
                <b-modal :id="AddLecturerModal.id" :title="AddLecturerModal.title" centered hide-footer lazy button-size="sm">
                        <b-form @submit.prevent="submitNewLecturer">
                            <b-form-group
                                    id="submit-lecturer-input-group-1"
                            >
                                <SearchLecturerByCourse :current_course="course_id" location="outside-course"></SearchLecturerByCourse>
                            </b-form-group>
                            <b-alert :show="AddLecturerModal.SubmitLecturerForm.notFilled" fade variant="danger">Nhập thiếu thông tin!</b-alert>
                            <b-button type="submit" size="sm" variant="outline-primary" style="float: right">Thêm</b-button>
                        </b-form>
                    </b-modal>
            </b-col>
        </b-row>

    </b-container>
</template>

<script>
    import axios from 'axios';
    import { eventBus } from "@/main";
    import SearchLecturerByCourse from "@/components/Course/List/Lecturer/SearchLecturerByCourse";

    export default {
        name: "LecturerCourseList",
        props: ['id', 'code', 'name'],
        components: {
            SearchLecturerByCourse,
        },
        data() {
          return {
              SearchLecturerByCourse,
              course_id: this.id,
              course_name: this.name,
              course_code: this.code,
              lecturerItems: [],
              perPage: 10,
              currentPage: 1,
              filter: '',
              sortBy: 'user_id',
              sortOrder: 'asc',
              totalPage: 1,
              route: [
                  {
                    text: 'Danh sách lớp môn học',
                    to: { name: 'course-list' }
                  },
                  {
                    text: 'Danh sách giảng viên lớp ' + this.name + ' (' + this.code + ')',
                    active: false,
                  }
              ],
              fields: [
                  {
                      key: 'user_id',
                      label: 'ID',
                      sortable: true,
                  },
                  {
                      key: 'username',
                      label: 'Tên đăng nhập',
                      sortable: true,
                  },
                  {
                      key: 'name',
                      label: 'Họ tên',
                      sortable: true,
                  },
                  {
                      key: 'email',
                      label: 'Email',
                      sortable: true,
                  },
                  {
                      key: 'actived',
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
                      key: 'is_lock',
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
              totalLecturer: 0,
              busy: false,
              AddLecturerModal: {
                  id: 'add-lecturer-modal',
                  title: 'Thêm giảng viên vào lớp ' + this.name + ' (' + this.code + ')',
                  SubmitLecturerForm: {
                      user_id: '',
                      notFilled: false,
                  }
              }
          }
        },
        methods: {
            async getLecturerRecordData() {
                this.busy = true;
                try {
                    const response = await axios({
                        url: `${process.env.VUE_APP_API_URL}/lecturer/records-by-course`,
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
                        this.lecturerItems = [];
                        this.totalLecturer = response.data.total_results;
                        this.totalPage = response.data.num_pages;
                        response.data.records.forEach((item) => {
                            this.lecturerItems.push(item);
                        });
                        // console.log(this.data);
                        this.busy = false
                    }
                } catch (error) {
                    this.lecturerItems = [];
                    this.totalLecturer = 0;
                    this.busy = false;
                    throw error;

                }
            },
            async submitNewLecturer() {
                try {
                  if (String(this.AddLecturerModal.SubmitLecturerForm.user_id,).replace(' ', '') === '') {
                      this.AddLecturerModal.SubmitLecturerForm.notFilled = true;
                      setTimeout(() => {
                        this.AddLecturerModal.SubmitLecturerForm.notFilled = false
                      }, 3000);
                  }
                  else {
                      const response = await axios({
                          url: `${process.env.VUE_APP_API_URL}/lecturer/create-lecturer-course-record`,
                          method: 'post',
                          changeOrigin: true,
                          data: {
                              new_user_id: this.AddLecturerModal.SubmitLecturerForm.user_id,
                              course_id: this.course_id,
                          },
                  });
                    if (response.status === 200) {
                      this.$bvToast.toast(`Thêm giảng viên vào lớp thành công!`, {
                        title: `Thành công`,
                        variant: 'success',
                        solid: true,
                        appendToast: true,
                      });
                      this.$root.$emit('bv::hide::modal', this.AddLecturerModal.id);
                      this.onReset();
                      this.getLecturerRecordData();
                    }
                    else {
                        this.$bvToast.toast(`Giảng viên đã có trong lớp học này rồi!`, {
                        title: `Oops`,
                        variant: 'warning',
                        solid: true,
                        appendToast: true,
                      });
                    }
                  }
                } catch (e) {
                    this.$bvToast.toast(`Gặp lỗi ${e} khi thêm giảng viên vào lớp!`, {
                        title: `Thất bại`,
                        variant: 'danger',
                        solid: true,
                        appendToast: true,
                    });
                }
            },
            deleteLecturer(item) {
                this.$bvModal.msgBoxConfirm(`Bạn có chắc chắn xóa giảng viên ${item.name}?`, {
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
                                url: `${process.env.VUE_APP_API_URL}/lecturer/delete-lecturer-course-record`,
                                method: 'delete',
                                data: {
                                    delUserID: item.user_id,
                                    course_id: this.course_id,
                                },
                            });
                            if (response.status === 200) {
                                this.$bvToast.toast(`Xóa giảng viên ${item.name} thành công!`, {
                                    title: `Thành công`,
                                    variant: 'success',
                                    solid: true,
                                    appendToast: true,
                                })
                            }
                        } catch (e) {
                            this.$bvToast.toast(`Gặp lỗi ${e.response.data.error_message} khi xóa giảng viên ${item.name}!`, {
                                title: `Thất bại`,
                                variant: 'danger',
                                solid: true,
                                appendToast: true,
                            })
                        } finally {
                            if (this.lecturerItems.length === 1) {
                                if ((this.totalLecturer / this.perPage) > 0) {
                                    this.currentPage--;
                                }
                                else {
                                    this.currentPage = 1;
                                }
                            }
                            this.getLecturerRecordData();
                        }
                    }
                })
            },
            openNewLecturerModal(button) {
              this.$root.$emit('bv::show::modal', this.AddLecturerModal.id, button);
            },
            sortLectureRecordData(sort) {
                this.sortBy = sort.sortBy;
                if (sort.sortDesc === true) {
                    this.sortOrder = 'desc';
                }
                else {
                    this.sortOrder = 'asc';
                }
                this.getLecturerRecordData();
            },
            onReset() {
                // Reset our form values\
                this.AddLecturerModal.SubmitLecturerForm.user_id = '';
            }
        },
        created() {
            this.getLecturerRecordData();
            eventBus.$on('lecturerInCourseSearchSelected', (searchSelected) => {
                this.lecturerItems = [];
                this.lecturerItems.push(searchSelected);
                this.totalPage = 1;
            });
            eventBus.$on('lecturerOutsideCourseSearchSelected', (searchSelected) => {
                this.AddLecturerModal.SubmitLecturerForm.user_id = searchSelected.user_id;
            })
        }
    }
</script>
<style scoped>

</style>
