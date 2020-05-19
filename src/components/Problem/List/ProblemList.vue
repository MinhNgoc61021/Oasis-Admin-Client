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
                  @input="getProblemRecordData"
                ></b-pagination-nav>
            </b-col>
            <b-col sm="7" md="2" class="ml-auto my-1" cols="auto">
                <b-button size="sm" variant="outline-success" @click="getProblemRecordData">
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
                         :items="ProblemItems"
                         :fields="fields"
                         :per-page="perPage"
                         :sort-by.sync="sortBy"
                         @sort-changed="sortProblemRecordData"
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
                        <div class="text-center text-danger my-2" style="min-width: 220px;">
                            <b-button size="sm" variant="outline-success" @click="row.toggleDetails" class="mr-1">
                              {{ row.detailsShowing ? 'Ẩn' : 'Hiện' }}
                            </b-button>
                            <b-button size="sm" variant="outline-primary" @click="uploadCodeModal(row.item, row.index, $event.target)" class="mr-1">
                                <b-icon icon="upload"></b-icon>
                            </b-button>
                            <b-button variant="outline-warning" size="sm" @click="updateModal(row.item, row.index, $event.target)" class="mr-1">
                                <b-icon icon="pencil"></b-icon>
                            </b-button>
                            <b-button variant="outline-danger" size="sm"  class="mr-1" @click="deleteProblem(row.item)">
                                <b-icon icon="trash"></b-icon>
                            </b-button>
                        </div>
                    </template>

                      <template v-slot:row-details="row">
                        <b-card>
                          <h4>Chi tiết:</h4>
                          <b-list-group>
                            <b-list-group-item>
                                <h6>Tiêu đề:</h6>
                                <span>{{ row.item.title }}</span>
                            </b-list-group-item>
                            <b-list-group-item>
                                <h6>Nội dung:</h6>
                                <vue-markdown v-if="String(row.item.problem_statement).replace(' ', '') !== '' && row.item.problem_statement !== null ">{{row.item.problem_statement}}</vue-markdown>
                                <span v-else>Không có</span>
                            </b-list-group-item>
                            <b-list-group-item>
                                <h6>Input:</h6>
                                <vue-markdown v-if="String(row.item.input_format).replace(' ', '') !== '' && row.item.input_format !== null ">{{row.item.input_format}}</vue-markdown>
                                <span v-else>Không có</span>
                            </b-list-group-item>
                            <b-list-group-item>
                                <h6>Output:</h6>
                                <vue-markdown v-if="String(row.item.output_format).replace(' ', '') !== '' && row.item.output_format !== null ">{{row.item.output_format}}</vue-markdown>
                                <span v-else>Không có</span>
                            </b-list-group-item>
                              <b-list-group-item>
                                <h6>Giàng buộc:</h6>
                                  <vue-markdown v-if="String(row.item.constraints).replace(' ', '') !== '' && row.item.constraints !== null">{{row.item.constraints}}</vue-markdown>
                                  <span v-else>Không có</span>
                            </b-list-group-item>
                            <b-list-group-item>
                                <h6>Mức:</h6>
                                <span>{{ row.item.level }}</span>
                            </b-list-group-item><b-list-group-item>
                                <h6>Loại:</h6>
                                <span>{{ row.item.category.name }}</span>
                            </b-list-group-item><b-list-group-item>
                                <h6>JUnit:</h6>
                                <span>{{ parseFloat(row.item.junit_rate).toFixed(1) }}</span>
                            </b-list-group-item>
                            <b-list-group-item>
                                <h6>Parser:</h6>
                                <span>{{ parseFloat(row.item.parser_rate).toFixed(1) }}</span>
                            </b-list-group-item>
                            <b-list-group-item>
                                <h6>Chấm cấu trúc:</h6>
                                <span v-if="row.item.mark_parser !== 0">Có</span>
                                <span v-else>Không có</span>
                            </b-list-group-item>
                            <b-list-group-item>
                                <h6>Chấm chức năng:</h6>
                                <span v-if="row.item.mark_io !== 0">Có</span>
                                <span v-else>Không có</span>
                            </b-list-group-item>
                            <b-list-group-item>
                                <h6>Chấm JUnit:</h6>
                                <span v-if="row.item.mark_junit !== 0">Có</span>
                                <span v-else>Không có</span>
                            </b-list-group-item>
                            <b-list-group-item>
                                <h6>Code mẫu:</h6>
                                <span v-if="String(row.item.sample_code).replace(' ', '') !== '' && row.item.sample_code !== null">{{row.item.sample_code}}</span>
                                <span v-else>Không có</span>
                            </b-list-group-item>
                            <b-list-group-item>
                                <h6>Kiểu submit:</h6>
                                <span>{{ row.item.submit_type }}</span>
                            </b-list-group-item>
                          </b-list-group>
                        </b-card>
                      </template>
                </b-table>
                <b-modal :id="EditModal.id" :title="EditModal.title" centered hide-footer scrollable button-size="sm" size="xl">
                    <Edit :problem="EditModal.UpdateProblemForm.problem"></Edit>
                </b-modal>
                <b-modal :id="UploadCodeModal.id" :title="UploadCodeModal.title" centered hide-footer scrollable button-size="sm">
                    <UploadCode :problem="UploadCodeModal.UploadCodeForm.problem"></UploadCode>
                </b-modal>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import axios from 'axios';
    import Edit from "@/components/Problem/List/Edit";
    import { eventBus } from "@/main";
    import {authHeader} from "@/auth/jwt";
    import UploadCode from "@/components/Problem/List/Insert/UploadCode";
    import VueMarkdown from 'vue-markdown';

    export default {
        name: "ProblemList",
        components: {
            UploadCode,
            Edit,
            VueMarkdown,
        },
        data() {
          return {
              Edit, UploadCode,
              ProblemItems: [],
              perPage: 10,
              currentPage: 1,
              filter: '',
              sortBy: 'problem_id',
              sortOrder: 'asc',
              totalPage: 1,
              fields: [
                  {
                      key: 'problem_id',
                      label: 'ID',
                      sortable: true,
                  },
                  {
                      key: 'title',
                      label: 'Tiêu đề',
                      sortable: true,
                  },
                  {
                      key: 'category.name',
                      label: 'Phân loại',
                      sortable: true,
                  },
                  {
                      key: 'actions',
                      label: 'Hành động'
                  }
              ],
              totalProblem: 0,
              busy: false,
              EditModal: {
                  id: 'edit-modal',
                  title: '',
                  UpdateProblemForm: {
                      problem: Object,
                      notFilled: false,
                  }
              },
              UploadCodeModal: {
                  id: 'upload-code-modal',
                  title: '',
                  UploadCodeForm: {
                      problem: Object,
                      notFilled: false,
                  }
              }
          }
        },
        methods: {
            async getProblemRecordData() {
                this.busy = true;
                try {
                    const response = await axios({
                        url: `${process.env.VUE_APP_API_URL}/problem/records`,
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
                        this.ProblemItems = [];
                        this.totalProblem = response.data.total_results;
                        this.totalPage = response.data.num_pages;
                        response.data.records.forEach((item) => {
                            this.ProblemItems.push(item);
                        });
                        // console.log(this.data);
                        this.busy = false
                    }
                } catch (error) {
                    this.ProblemItems = [];
                    this.totalProblem = 0;
                    this.busy = false;
                    throw error;

                }
            },
            updateModal(item, index, button) {
                this.EditModal.title = `Sửa thông tin problem ${item.problem_id}`;
                this.EditModal.UpdateProblemForm.problem = item;
                this.$root.$emit('bv::show::modal', this.EditModal.id, button);
            },
            uploadCodeModal(item, index, button) {
                this.UploadCodeModal.title = `Tải code mẫu cho problem ${item.problem_id}`;
                this.UploadCodeModal.UploadCodeForm.problem = item;
                this.$root.$emit('bv::show::modal', this.UploadCodeModal.id, button);
            },
            deleteProblem(item) {
                this.$bvModal.msgBoxConfirm(`Bạn có chắc chắn xóa problem ${item.title}?`, {
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
                                url: `${process.env.VUE_APP_API_URL}/problem/delete-record`,
                                method: 'delete',
                                headers: { 'Authorization': authHeader() },
                                data: {
                                    delProblemID: item.problem_id,
                                },
                            });
                            if (response.status === 200) {
                                this.$bvToast.toast(`Xóa problem ${item.title} thành công!`, {
                                    title: `Thành công`,
                                    variant: 'success',
                                    solid: true,
                                    appendToast: true,
                                })
                            }
                        } catch (e) {
                            this.$bvToast.toast(`Gặp lỗi ${e.response.data.error_message} khi xóa problem ${item.title}!`, {
                                title: `Thất bại`,
                                variant: 'danger',
                                solid: true,
                                appendToast: true,
                            })
                        } finally {
                            if (this.ProblemItems.length === 1) {
                                if ((this.totalProblem / this.perPage) > 0) {
                                    this.currentPage--;
                                }
                                else {
                                    this.currentPage = 1;
                                }
                            }
                            this.getProblemRecordData();
                        }
                    }
                })
            },
            sortProblemRecordData(sort) {
                this.sortBy = sort.sortBy;
                if (sort.sortDesc === true) {
                    this.sortOrder = 'desc';
                }
                else {
                    this.sortOrder = 'asc';
                }
                this.getProblemRecordData();
            }
        },
        created() {
            this.getProblemRecordData();
            eventBus.$on('refreshProblemList', () => {
                this.$root.$emit('bv::hide::modal', this.EditModal.id);
                this.getProblemRecordData();
            });
        }
    }
</script>
<style scoped>

</style>
