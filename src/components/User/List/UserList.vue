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
                  base-url="#"
                  first-number
                  last-number
                  @input="getUserRecordData"
                ></b-pagination-nav>
            </b-col>
            <b-col sm="7" md="2" class="ml-auto my-1" cols="auto">
                <b-button size="sm" variant="outline-success" @click="getUserRecordData">
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
                         head-variant="light"
                         small
                         :items="userItems"
                         :fields="fields"
                         :per-page="perPage"
                         :sort-by.sync="sortBy"
                         @sort-changed="sortUserRecordData"
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
                            <b-button variant="outline-warning" size="sm" @click="updateUser(row.item, row.index, $event.target)" class="mr-1">
                                <b-icon icon="pencil"></b-icon>
                            </b-button>
                            <b-button variant="outline-danger" size="sm"  class="mr-1" @click="deleteUser(row.item)">
                                <b-icon icon="trash"></b-icon>
                            </b-button>
                        </div>
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
    import moment from 'moment/moment';

    export default {
        name: "UserList",
        data() {
          return {
              userItems: [
              ],
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
                      key: 'email',
                      label: 'Email',
                      sortable: true,
                  },
                  {
                      key: 'created_at',
                      label: 'Ngày cấp',
                      sortable: true,
                      formatter: value => {
                        return moment(value).format("L, LTS");
                      }
                  },
                  {
                      key: 'updated_at',
                      label: 'Ngày cập nhật',
                      sortable: true,
                      formatter: value => {
                        return moment(value).format("L, LTS");
                      }
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
              totalUser: '',
              busy: false,
              infoModal: {
                  id: 'info-modal',
                  title: '',
                  content: ''
              }
          }
        },
        methods: {
            async getUserRecordData() {
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
                        this.userItems = [];
                        this.totalUser = response.data.total_results;
                        this.totalPage = response.data.num_pages;
                        response.data.records.forEach((item) => {
                            this.userItems.push(item);
                        });
                        // console.log(this.data);
                        this.busy = false
                    }
                } catch (error) {
                    this.userItems = [];
                    this.totalUser = 0;
                    this.busy = false;
                    throw error;

                }
            },
            updateUser(item, index, button) {
                this.infoModal.title = `Row index: ${index}`;
                this.infoModal.content = JSON.stringify(item, null, 2);
                this.$root.$emit('bv::show::modal', this.infoModal.id, button);
            },
            deleteUser(item) {
                this.$bvModal.msgBoxConfirm(`Bạn có chắc chắn xóa người dùng có tên đăng nhập ${item.username}?`, {
                    title: 'Xác nhận xóa',
                    size: 'md',
                    buttonSize: 'md',
                    okVariant: 'danger',
                    okTitle: 'Có',
                    cancelTitle: 'Không',
                    footerClass: 'p-2',
                    hideHeaderClose: false,
                    centered: true,
                }).then(async (value) => {
                    if (value === true) {
                        try {
                            const response = await axios({
                                url: 'http://localhost:5000/user/delete-record',
                                method: 'delete',
                                data: {
                                    delUserID: item.user_id
                                },
                            });
                            if (response.status === 200) {
                                this.$bvToast.toast(`Xóa người dùng có tên đăng nhập ${item.username} thành công!`, {
                                  title: `Thành công`,
                                  variant: 'success',
                                  solid: true
                                })
                            }
                        } catch (e) {
                            this.$bvToast.toast(`Gặp lỗi ${e} khi xóa người dùng có tên đăng nhập ${item.username}`, {
                                title: `Thất bại`,
                                variant: 'danger',
                                solid: true
                            })
                        } finally {
                            this.getUserRecordData();
                        }
                    }
                })
            },
            sortUserRecordData(sort) {
                this.sortBy = sort.sortBy;
                if (sort.sortDesc === true) {
                    this.sortOrder = 'desc';
                }
                else {
                    this.sortOrder = 'asc';
                }
                this.getUserRecordData();
            }
        },
        created() {
            this.getUserRecordData();
        }
    }
</script>
<style scoped>

</style>
