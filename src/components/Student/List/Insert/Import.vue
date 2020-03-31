<template>
    <div>
        <b-overlay :show="loading" rounded="sm">
            <b-form-group
                    label-for="course-input"
                :invalid-feedback="invalidCourseStatement"
            >
                <b-form-select
                        id="course-input"
                         v-model="course_id"
                         :options="courseOptions"
                         size="sm"
                         :state="courseState"
                         value-field="course_id"
                         text-field="code"
                        >
                     <template v-slot:first>
                         <b-form-select-option value="null" disabled>-- Hãy chọn lớp môn học --</b-form-select-option>
                     </template>
                 </b-form-select>
            </b-form-group>
            <b-form-group
                    :valid-feedback="validExcelStatement"
                    :invalid-feedback="invalidExcelStatement"
                  >
                <b-form-file
                        size="sm"
                        v-model="file"
                        :state="excelState"
                        accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        placeholder="Chọn hoặc kéo thả file..."
                        drop-placeholder="Thả file ở đây..."
                >
               </b-form-file>
            </b-form-group>
            <div class="overflow-auto" style="max-height: 600px;">
                <b-table
                  small
                  hover
                  show-empty
                  empty-text="Danh sách trống"
                  table-variant="success"
                  caption-top
                  responsive
                  :fields="new_students_field"
                  :items="new_students"
                >
                    <template v-slot:table-caption>Danh sách sinh viên mới</template>
                </b-table>
                <b-table
                  small
                  hover
                  show-empty
                  empty-text="Danh sách trống"
                  table-variant="warning"
                  caption-top
                  responsive
                  :fields="updated_students_field"
                  :items="updated_students"
                >
                    <template v-slot:table-caption>Danh sách sinh viên được cập nhật</template>
                </b-table>
                <b-table
                  small
                  hover
                  show-empty
                  empty-text="Danh sách trống"
                  table-variant="danger"
                  caption-top
                  responsive
                  :fields="error_students_field"
                  :items="error_students"
                >
                    <template v-slot:table-caption>Danh sách sinh viên không thêm được</template>
                </b-table>
            </div>
        </b-overlay>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "Import",
        data() {
          return {
              file: null,
              show: false,
              excelState: null,
              courseState: false,
              invalidCourseStatement: '',
              validExcelStatement: '',
              invalidExcelStatement: 'Hãy chọn lớp môn học trước',
              data: [],
              course_id: null,
              courseOptions: [],
              loading: false,
              new_students_field: [
                  {
                      key: 'STT',
                      label: 'STT',
                      sortable: true,
                  },
                  {
                      key: 'Mã SV',
                      label: 'Mã số sinh viên',
                      sortable: true,
                  },
                  {
                      key: 'Họ và tên',
                      label: 'Họ và tên',
                      sortable: true,
                  },
                  {
                      key: 'Ngày sinh',
                      label: 'Ngày sinh',
                      sortable: true,
                  },
                  {
                      key: 'Lớp khóa học',
                      label: 'Lớp khóa học',
                      sortable: true,
                  },
              ],
              updated_students_field: [
                  {
                      key: 'STT',
                      label: 'STT',
                      sortable: true,
                  },
                  {
                      key: 'Mã SV',
                      label: 'Mã số sinh viên',
                      sortable: true,
                  },
                  {
                      key: 'Họ và tên',
                      label: 'Họ và tên',
                      sortable: true,
                  },
                  {
                      key: 'Ngày sinh',
                      label: 'Ngày sinh',
                      sortable: true,
                  },
                  {
                      key: 'Lớp khóa học',
                      label: 'Lớp khóa học',
                      sortable: true,
                  },
              ],
              error_students_field: [
                  {
                      key: 'STT',
                      label: 'STT',
                      sortable: true,
                  },
                  {
                      key: 'Mã SV',
                      label: 'Mã số sinh viên',
                      sortable: true,
                  },
                  {
                      key: 'Họ và tên',
                      label: 'Họ và tên',
                      sortable: true,
                  },
                  {
                      key: 'Ngày sinh',
                      label: 'Ngày sinh',
                      sortable: true,
                  },
                  {
                      key: 'user.email',
                      label: 'Email',
                      sortable: true,
                  },
                  {
                      key: 'Lớp khóa học',
                      label: 'Lớp khóa học',
                      sortable: true,
                  },
              ],
              new_students: [],
              updated_students: [],
              error_students: [],
          }
        },
        watch: {
            file: function () {
                this.show = true;
                if (this.course_id !== null) {
                    if (this.file.type === 'application/vnd.ms-excel' || this.file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                        this.uploadExcel();
                        }
                    else {
                        this.excelState = false;
                        this.invalidExcelStatement = 'Yêu cầu bạn tải file excel có format .xls hoặc .xlsx';
                    }
                }
                else {
                    this.excelState = false;
                    this.invalidExcelStatement = 'Yêu cầu chọn lớp môn học trước.';
                }
            },
            course_id: function () {
                if (this.course_id !== null) {
                    this.courseState = true;
                    if (this.file !== null) {
                        this.uploadExcel();
                    }
                }
            }
        },
        methods: {
            async uploadExcel() {
                try {
                    this.loading = true;
                    let formData = new FormData();
                    formData.append('student_list_excel', this.file);
                    formData.append('course_id', this.course_id);
                    const response = await axios.post(`${process.env.VUE_APP_API_URL}/student/import-excel`, formData,{
                        headers: {
                          'Content-Type': 'multipart/form-data',
                        },
                    });
                    if (response.status === 200) {
                        console.log(response);
                        this.excelState = true;
                        this.validExcelStatement = `Tải file ${this.file.name} lên thành công!`;
                        this.loading = false;

                        response.data.new_students.forEach((item) => {
                            this.new_students.push(item);
                        });
                        response.data.error_students.forEach((item) => {
                            this.error_students.push(item);
                        });
                        response.data.updated_students.forEach((item) => {
                            this.updated_students.push(item);
                        });
                    }
                } catch (e) {
                    this.excelState = false;
                    this.invalidExcelStatement =`Gặp lỗi ${e.response.data.error_message} khi nhập file ${this.file.name}!`;
                    this.loading = false;
                }
            },
            async getCourseRecordData() {
                try {
                    const response = await axios({
                        url: `${process.env.VUE_APP_API_URL}/course/all-records`,
                        method: 'get',
                        changeOrigin: true,
                    });
                    if (response.status === 200) {
                        this.courseOptions= [];
                        response.data.records.forEach((item) => {
                            this.courseOptions.push(item);
                        });
                    }
                } catch (error) {
                    this.semesterOptions = [];
                    throw error;
                }
            }
        },
        created() {
            this.getCourseRecordData();
        }
    }
</script>
<style scoped>
</style>
