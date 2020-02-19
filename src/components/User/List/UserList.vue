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
                         :small="true"
                         size="sm"
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
                        <div class="text-center text-danger my-2" style="min-width: 120px;">
                            <b-button variant="outline-warning" size="sm" @click="updateModal(row.item, row.index, $event.target)" class="mr-1">
                                <b-icon icon="pencil"></b-icon>
                            </b-button>
                            <b-button variant="outline-danger" size="sm"  class="mr-1" @click="deleteUser(row.item)">
                                <b-icon icon="trash"></b-icon>
                            </b-button>
                        </div>
                    </template>
                </b-table>
                <b-modal :id="EditModal.id" :title="EditModal.title" centered hide-footer scrollable button-size="sm">
                    <b-form @submit.prevent="submitUserUpdate" @reset.prevent="onReset">
                      <b-form-group
                        id="edit-input-group-1"
                        label="Email:"
                        label-for="edit-input-1"
                      >
                        <b-form-input
                          id="edit-input-1"
                          v-model="EditModal.UpdateUserForm.email"
                          type="email"
                          required
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
                          v-model="EditModal.UpdateUserForm.username"
                          type="text"
                          required
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
                          v-model="EditModal.UpdateUserForm.name"
                          type="text"
                          required
                          placeholder="Nhập họ tên"
                        ></b-form-input>
                      </b-form-group>

                      <b-form-group id="edit-input-group-4" label="Quyền:" label-for="edit-input-4">
                        <b-form-select
                                id="edit-input-4"
                            v-model="EditModal.UpdateUserForm.permission"
                            :options="EditModal.UpdateUserForm.permission_opt"
                            required
                        ></b-form-select>
                      </b-form-group>

                      <b-form-group id="edit-input-group-5" label="Active:" label-for="edit-input-5">
                        <b-form-checkbox v-model="EditModal.UpdateUserForm.actived" id="edit-input-5" name="check-button" switch>
                          <span v-if="EditModal.UpdateUserForm.actived !== true">Không</span>
                          <span v-else>Có</span>
                        </b-form-checkbox>
                      </b-form-group>

                      <b-form-group id="edit-input-group-6" label="Khóa tài khoản:" label-for="edit-input-6">
                        <b-form-checkbox v-model="EditModal.UpdateUserForm.is_lock" id="edit-input-6" name="check-button" switch>
                          <span v-if="EditModal.UpdateUserForm.is_lock !== true">Không khóa</span>
                          <span v-else>Khóa</span>
                        </b-form-checkbox>
                      </b-form-group>
                        <b-button type="submit" variant="primary" style="float: right">Cập nhật</b-button>
                    </b-form>
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
              EditModal: {
                  id: 'edit-modal',
                  title: '',
                  UpdateUserForm: {
                      user_id: '',
                      username: '',
                      name: '',
                      email: '',
                      permission: 'Sinh viên',
                      actived: Boolean,
                      is_lock: Boolean,
                      permission_opt: ['Admin', 'Sinh viên', 'Giảng viên'],
                  }
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
            updateModal(item, index, button) {
                this.EditModal.title = `Sửa thông tin người dùng có ID: ${item.user_id}`;
                this.EditModal.UpdateUserForm.user_id = item.user_id;
                this.EditModal.UpdateUserForm.username = item.username;
                this.EditModal.UpdateUserForm.email = item.email;
                this.EditModal.UpdateUserForm.name = item.name;
                this.EditModal.UpdateUserForm.permission = item.permission;
                this.EditModal.UpdateUserForm.actived = item.actived === 1;
                this.EditModal.UpdateUserForm.is_lock = item.is_lock === 1;
                this.$root.$emit('bv::show::modal', this.EditModal.id, button);
            },
            async submitUserUpdate() {
                try {
                    const response = await axios({
                        url: 'http://localhost:5000/user/update-record',
                        method: 'put',
                        data: {
                            user_id: this.EditModal.UpdateUserForm.user_id,
                            update_username: this.EditModal.UpdateUserForm.username,
                            update_name: this.EditModal.UpdateUserForm.name,
                            update_email: this.EditModal.UpdateUserForm.email,
                            update_permission: this.EditModal.UpdateUserForm.permission,
                            update_actived: this.EditModal.UpdateUserForm.actived,
                            is_lock: this.EditModal.UpdateUserForm.is_lock,
                        },
                        changeOrigin: true,
                    });
                    if (response.status === 200) {
                        this.$bvToast.toast(`Cập nhật người dùng có ID ${this.EditModal.UpdateUserForm.user_id} thành công!`, {
                            title: `Thành công`,
                            variant: 'success',
                            solid: true,
                            appendToast: true,
                        });
                        this.$root.$emit('bv::hide::modal', this.EditModal.id);

                    }
                    else if (response.status === 202) {
                        this.$bvToast.toast(`Trùng dữ liệu!`, {
                            title: `Oops!`,
                            variant: 'warning',
                            solid: true,
                            appendToast: true,
                        })
                    }
                } catch (e) {
                    this.$bvToast.toast(`Gặp lỗi ${e} khi cập nhật dữ liệu người dùng có ID: ${this.EditModal.UpdateUserForm.user_id}!`, {
                        title: `Thất bại`,
                        variant: 'danger',
                        solid: true,
                        appendToast: true,
                    })
                } finally {
                    this.getUserRecordData();
                }
            },
            deleteUser(item) {
                this.$bvModal.msgBoxConfirm(`Bạn có chắc chắn xóa người dùng có ID: ${item.user_id}?`, {
                    title: 'Xác nhận xóa',
                    size: 'md',
                    buttonSize: 'sm',
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
                                this.$bvToast.toast(`Xóa người dùng có ID: ${item.user_id} thành công!`, {
                                    title: `Thành công`,
                                    variant: 'success',
                                    solid: true,
                                    appendToast: true,
                                })
                            }
                        } catch (e) {
                            this.$bvToast.toast(`Gặp lỗi ${e} khi xóa người dùng có ID: ${item.user_id}!`, {
                                title: `Thất bại`,
                                variant: 'danger',
                                solid: true,
                                appendToast: true,
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
