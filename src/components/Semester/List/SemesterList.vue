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
                  @input="getSemesterRecordData"
                ></b-pagination-nav>
            </b-col>
            <b-col sm="7" md="2" class="ml-auto my-1" cols="auto">
                <b-button size="sm" variant="outline-success" @click="getSemesterRecordData">
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
                         empty-text="Danh sách kỳ học trống"
                         :busy="busy"
                         head-variant="light"
                         :small="true"
                         size="sm"
                         :items="semesterItems"
                         :fields="fields"
                         :per-page="perPage"
                         :sort-by.sync="sortBy"
                         @sort-changed="sortSemesterRecordData"
                         :sort-direction="sortOrder"
                         hover
                         fixed
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
                            <b-button variant="outline-danger" size="sm"  class="mr-1" @click="deleteSemester(row.item)">
                                <b-icon icon="trash"></b-icon>
                            </b-button>
                        </div>
                    </template>
                </b-table>
                <b-modal :id="EditModal.id" :title="EditModal.title" centered hide-footer lazy button-size="sm">
                    <b-form @submit.prevent="submitSemesterUpdate">
                      <b-form-group
                        id="edit-input-group-3"
                        label="Họ tên:"
                        label-for="edit-input-3"
                      >
                        <b-form-input
                          id="edit-input-3"
                          v-model="EditModal.UpdateSemesterForm.name"
                          type="text"
                          size="sm"
                          required
                          placeholder="Nhập họ tên"
                        ></b-form-input>
                      </b-form-group>

                      <b-alert :show="EditModal.UpdateSemesterForm.notFilled" fade variant="danger">Nhập thiếu thông tin!</b-alert>
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

    export default {
        name: "SemesterList",
        data() {
          return {
              semesterItems: [],
              perPage: 10,
              currentPage: 1,
              filter: '',
              sortBy: 'name',
              sortOrder: 'asc',
              totalPage: 1,
              fields: [
                  {
                      key: 'semester_id',
                      label: 'ID',
                      sortable: true,
                  },
                  {
                      key: 'name',
                      label: 'Tên kỳ học',
                      sortable: true,
                  },
                  {
                      key: 'actions',
                      label: 'Hành động'
                  }
              ],
              totalSemester: 0,
              busy: false,
              EditModal: {
                  id: 'edit-modal',
                  title: '',
                  UpdateSemesterForm: {
                      semester_id: '',
                      name: '',
                      notFilled: false,
                  }
              }
          }
        },
        methods: {
            async getSemesterRecordData() {
                this.busy = true;
                try {
                    const response = await axios({
                        url: 'http://localhost:5000/semester/records',
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
                        this.semesterItems = [];
                        this.totalSemester = response.data.total_results;
                        this.totalPage = response.data.num_pages;
                        response.data.records.forEach((item) => {
                            this.semesterItems.push(item);
                        });
                        // console.log(this.data);
                        this.busy = false
                    }
                } catch (error) {
                    this.semesterItems = [];
                    this.totalSemester = 0;
                    this.busy = false;
                    throw error;

                }
            },
            async updateModal(item, index, button) {
                this.EditModal.title = `Sửa thông tin hoc kỳ ${item.name}`;
                this.EditModal.UpdateSemesterForm.semester_id = item.semester_id;
                this.EditModal.UpdateSemesterForm.name = item.name;
                this.$root.$emit('bv::show::modal', this.EditModal.id, button);
            },
            async submitSemesterUpdate() {
                try {
                    if (String(this.EditModal.UpdateSemesterForm.name).replace(' ', '') === ''
                    ) {
                        this.EditModal.UpdateSemesterForm.notFilled = true;
                        setTimeout(() => {
                            this.EditModal.UpdateSemesterForm.notFilled = false;
                        }, 3000);
                    }
                    else {
                        const response = await axios({
                            url: 'http://localhost:5000/semester/update-record',
                            method: 'put',
                            data: {
                                semester_id: this.EditModal.UpdateSemesterForm.semester_id,
                                update_name: this.EditModal.UpdateSemesterForm.name,
                            },
                            changeOrigin: true,
                        });
                        if (response.status === 200) {
                            this.$bvToast.toast(`Cập nhật kỳ học ${this.EditModal.UpdateSemesterForm.name} thành công!`, {
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
                    }
                } catch (e) {
                    this.$bvToast.toast(`Gặp lỗi ${e} khi cập nhật dữ liệu kỳ học ${this.EditModal.UpdateSemesterForm.name}!`, {
                        title: `Thất bại`,
                        variant: 'danger',
                        solid: true,
                        appendToast: true,
                    })
                } finally {
                    this.getSemesterRecordData();
                }
            },
            deleteSemester(item) {
                this.$bvModal.msgBoxConfirm(`Bạn có chắc chắn xóa kỳ học ${item.name}?`, {
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
                                url: 'http://localhost:5000/semester/delete-record',
                                method: 'delete',
                                data: {
                                    delSemesterID: item.semester_id,
                                },
                            });
                            if (response.status === 200) {
                                this.$bvToast.toast(`Xóa kỳ học ${item.name} thành công!`, {
                                    title: `Thành công`,
                                    variant: 'success',
                                    solid: true,
                                    appendToast: true,
                                })
                            }
                        } catch (e) {
                            this.$bvToast.toast(`Gặp lỗi ${e} khi xóa kỳ học ${item.name}!`, {
                                title: `Thất bại`,
                                variant: 'danger',
                                solid: true,
                                appendToast: true,
                            })
                        } finally {
                            if (this.semesterItems.length === 1) {
                                if ((this.totalSemester / this.perPage) > 0) {
                                    this.currentPage--;
                                }
                                else {
                                    this.currentPage = 1;
                                }
                            }
                            this.getSemesterRecordData();
                        }
                    }
                })
            },
            sortSemesterRecordData(sort) {
                this.sortBy = sort.sortBy;
                if (sort.sortDesc === true) {
                    this.sortOrder = 'desc';
                }
                else {
                    this.sortOrder = 'asc';
                }
                this.getSemesterRecordData();
            }
        },
        created() {
            this.getSemesterRecordData();
            eventBus.$on('semesterSearchSelected', (searchSelected) => {
                this.semesterItems = [];
                this.semesterItems.push(searchSelected);
                this.totalPage = 1;
            });
        }
    }
</script>
<style scoped>

</style>
