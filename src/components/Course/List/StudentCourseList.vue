<template>
    <b-container>
        <h5> {{ course_name }} {{ course_code }} (Danh sách sinh viên)</h5>
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
                <Search></Search>
            </b-col>
            <b-col sm="7" md="2" class="ml-auto my-1" cols="auto">
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
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import axios from 'axios';
    import moment from 'moment/moment';
    import { eventBus } from "@/main";
    import Search from "@/components/Student/List/Search";

    export default {
        props: ['prop_course'],
        name: "StudentCourseList",
        components: {
            Search,
        },
        data() {
          return {
              Search,
              course_id: this.prop_course.course_id,
              course_name: this.prop_course.name,
              course_code: this.prop_course.code,
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
                            this.getStudentCourseRecordData();
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
                this.getStudentCourseRecordData();
            }
        },
        created() {
            this.getStudentCourseRecordData();
            eventBus.$on('studentSearchSelected', (searchSelected) => {
                this.studentItems = [];
                this.studentItems.push(searchSelected);
                this.totalPage = 1;
            });
        }
    }
</script>
<style scoped>

</style>
