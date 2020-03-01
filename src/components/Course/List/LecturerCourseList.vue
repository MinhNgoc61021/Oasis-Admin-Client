<template>
    <b-container>
        <h5> {{ course_name }} {{ course_code }} (Danh sách giảng viên)</h5>
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
                <Search></Search>
            </b-col>
            <b-col sm="7" md="2" class="ml-auto my-1" cols="auto">
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
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import axios from 'axios';
    import { eventBus } from "@/main";
    import Search from "@/components/Lecturer/List/Search";

    export default {
        name: "LecturerCourseList",
        props: ['prop_course'],
        components: {
            Search,
        },
        data() {
          return {
              Search,
              course_id: this.prop_course.course_id,
              course_name: this.prop_course.name,
              course_code: this.prop_course.code,
              lecturerItems: [],
              perPage: 10,
              currentPage: 1,
              filter: '',
              sortBy: 'user_id',
              sortOrder: 'asc',
              totalPage: 1,
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
              EditModal: {
                  id: 'edit-modal',
                  title: '',
                  UpdateLecturerForm: {
                      user_id: '',
                      username: '',
                      name: '',
                      email: '',
                      actived: Boolean,
                      is_lock: Boolean,
                  }
              }
          }
        },
        methods: {
            async getLecturerRecordData() {
                this.busy = true;
                try {
                    const response = await axios({
                        url: 'http://localhost:5000/lecturer/records-by-course',
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
                                url: 'http://localhost:5000/lecturer/delete-record',
                                method: 'delete',
                                data: {
                                    delUserID: item.user_id,
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
                            this.$bvToast.toast(`Gặp lỗi ${e} khi xóa giảng viên ${item.name}!`, {
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
            sortLectureRecordData(sort) {
                this.sortBy = sort.sortBy;
                if (sort.sortDesc === true) {
                    this.sortOrder = 'desc';
                }
                else {
                    this.sortOrder = 'asc';
                }
                this.getLecturerRecordData();
            }
        },
        created() {
            this.getLecturerRecordData();
            eventBus.$on('lecturerSearchSelected', (searchSelected) => {
                this.lecturerItems = [];
                this.lecturerItems.push(searchSelected);
                this.totalPage = 1;
            });
        }
    }
</script>
<style scoped>

</style>
