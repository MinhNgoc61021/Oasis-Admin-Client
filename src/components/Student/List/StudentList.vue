<template>
    <b-container>
        <b-row>
            <b-col sm="7" md="6" class="my-1 mb-2">
                <b-pagination-nav
                  v-model="currentPage"
                  :total-rows="totalStudent"
                  :number-of-pages="10"
                  align="fill"
                  :link-gen="studentPageChange"
                  size="sm"
                  class="my-0 light"
                  use-router
                ></b-pagination-nav>
            </b-col>
            <b-col>
                <b-table responsive
                 sticky-header
                 :busy="busy"
                 head-variant="light"
                 small
                 :items="studentItems"
                 :fields="fields"
                 :current-page="currentPage"
                 :per-page="perPage"
                 :filter="filter"
                 :sort-by.sync="sortBy"
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
                <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
                    Thông tin
                </b-button>
            </template>
        </b-table>
                <b-modal :id="infoModal.id" :title="infoModal.title" ok-only>
                  <pre>{{ infoModal.content }}</pre>
                </b-modal>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import axios from 'axios';

    export default {
        name: "StudentList",
        data() {
          return {
              studentItems: [

              ],
              perPage: 10,
              currentPage: 1,
              filter: '',
              sortBy: 'code',
              sortOrder: 'desc',
              fields: [
                  {
                      key: 'code',
                      label: 'Mã số sinh viên',
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
                      key: 'dob',
                      label: 'Ngày sinh',
                      sortable: true,
                  },
                  {
                      key: 'email',
                      label: 'Email',
                      sortable: true,
                  },
                  {
                      key: 'class_course',
                      label: 'Lớp',
                      sortable: true,
                  },
                  {
                      key: 'created_at',
                      label: 'Ngày tạo',
                      sortable: true,
                  },
                  {
                      key: 'updated_at',
                      label: 'Ngày cập nhật',
                      sortable: true,
                  },
                  {
                      key: 'actived',
                      label: 'Actived',
                      sortable: true,
                  },
                  {
                      key: 'is_lock',
                      label: 'Is_lock',
                      sortable: true,
                  },
                  {
                      key: 'actions',
                      label: 'Hành động'
                  }
              ],
              totalStudent: 33,
              busy: false,
              infoModal: {
                  id: 'info-modal',
                  title: '',
                  content: ''
              }
          }
        },
        methods: {
            async getStudentRecordData() {
                this.busy = true;
                try {
                    const response = await axios({
                        url: 'http://localhost:5000/user/records',
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
            info(item, index, button) {
                this.infoModal.title = `Row index: ${index}`;
                this.infoModal.content = JSON.stringify(item, null, 2);
                this.$root.$emit('bv::show::modal', this.infoModal.id, button);
            },
            studentPageChange(pageNum) {
                return pageNum === 1 ? '?' : `?page=${pageNum}`
              }
        },
        created() {
            this.getStudentRecordData();
        }
    }
</script>
<style scoped>

</style>
