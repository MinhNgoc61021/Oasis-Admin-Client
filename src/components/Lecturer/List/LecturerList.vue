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
                        <div class="text-center text-danger my-2" style="min-width: 120px;">
                            <b-button variant="outline-warning" size="sm" @click="updateModal(row.item, row.index, $event.target)" class="mr-1">
                                <b-icon icon="pencil"></b-icon>
                            </b-button>
                            <b-button variant="outline-danger" size="sm"  class="mr-1" @click="deleteLecturer(row.item)">
                                <b-icon icon="trash"></b-icon>
                            </b-button>
                        </div>
                    </template>
                </b-table>
                <b-modal :id="EditModal.id" :title="EditModal.title" centered hide-footer scrollable lazy button-size="sm">
                    <b-form @submit.prevent="submitLecturerUpdate">
                      <b-form-group
                        id="edit-input-group-1"
                        label="Email:"
                        label-for="edit-input-1"
                      >
                        <b-form-input
                          id="edit-input-1"
                          v-model="EditModal.UpdateLecturerForm.email"
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
                          v-model="EditModal.UpdateLecturerForm.username"
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
                          v-model="EditModal.UpdateLecturerForm.name"
                          type="text"
                          size="sm"
                          placeholder="Nhập họ tên"
                        ></b-form-input>
                      </b-form-group>

                      <b-form-group
                              id="edit-input-group-5"
                              label="Active:"
                              label-for="edit-input-5">
                        <b-form-checkbox
                                v-model="EditModal.UpdateLecturerForm.actived"
                                size="sm"
                                id="edit-input-5"
                                name="check-button"
                                switch
                        >
                          <span v-if="EditModal.UpdateLecturerForm.actived !== true">Không</span>
                          <span v-else>Có</span>
                        </b-form-checkbox>
                      </b-form-group>

                      <b-form-group
                              id="edit-input-group-6"
                              label="Khóa tài khoản:"
                              label-for="edit-input-6">
                        <b-form-checkbox
                                v-model="EditModal.UpdateLecturerForm.is_lock"
                                size="sm"
                                id="edit-input-6"
                                name="check-button"
                                switch
                        >
                          <span v-if="EditModal.UpdateLecturerForm.is_lock !== true">Không khóa</span>
                          <span v-else>Khóa</span>
                        </b-form-checkbox>
                      </b-form-group>
                        <b-button type="submit" size="sm" variant="outline-primary" style="float: right">Cập nhật</b-button>
                    </b-form>
                </b-modal>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import axios from 'axios';
    import { eventBus } from "@/main";
    import Search from "@/components/Lecturer/List/Search";
    import {authHeader} from "@/auth/jwt";

    export default {
        name: "LecturerList",
        components: {
            Search,
        },
        data() {
          return {
              Search,
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
                        url: `${process.env.VUE_APP_API_URL}/lecturer/records`,
                        method: 'get',
                        headers: { 'Authorization': authHeader() },
                        params: {
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
            async updateModal(item, index, button) {
                this.EditModal.title = `Sửa thông tin giảng viên ${item.name}`;
                this.EditModal.UpdateLecturerForm.user_id = item.user_id;
                this.EditModal.UpdateLecturerForm.username = item.username;
                this.EditModal.UpdateLecturerForm.email = item.email;
                this.EditModal.UpdateLecturerForm.name = item.name;
                this.EditModal.UpdateLecturerForm.actived = item.actived === 1;
                this.EditModal.UpdateLecturerForm.is_lock = item.is_lock === 1;
                this.$root.$emit('bv::show::modal', this.EditModal.id, button);
            },
            async submitLecturerUpdate() {
                try {
                    const response = await axios({
                        url: `${process.env.VUE_APP_API_URL}/lecturer/update-record`,
                        method: 'put',
                        headers: { 'Authorization': authHeader() },
                        data: {
                            user_id: this.EditModal.UpdateLecturerForm.user_id,
                            update_username: this.EditModal.UpdateLecturerForm.username,
                            update_name: this.EditModal.UpdateLecturerForm.name,
                            update_email: this.EditModal.UpdateLecturerForm.email,
                            update_actived: this.EditModal.UpdateLecturerForm.actived,
                            update_is_lock: this.EditModal.UpdateLecturerForm.is_lock,
                        },
                        changeOrigin: true,
                    });
                    if (response.status === 200) {
                        this.$bvToast.toast(`Cập nhật giảng viên ${this.EditModal.UpdateLecturerForm.name} thành công!`, {
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
                    this.$bvToast.toast(`Gặp lỗi ${e} khi cập nhật giảng viên ${this.EditModal.UpdateLecturerForm.name}!`, {
                        title: `Thất bại`,
                        variant: 'danger',
                        solid: true,
                        appendToast: true,
                    })
                } finally {
                    this.getLecturerRecordData();
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
                                url: `${process.env.VUE_APP_API_URL}/lecturer/delete-record`,
                                method: 'delete',
                                headers: { 'Authorization': authHeader() },
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
