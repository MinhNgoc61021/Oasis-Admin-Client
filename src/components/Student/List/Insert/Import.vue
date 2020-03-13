<template>
    <div>
        <b-form-group
            :invalid-feedback="invalidStatement"
          >
            <b-form-file
                    size="sm"
                    v-model="file"
                    :state="state"
                    accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    placeholder="Chọn hoặc kéo thả file..."
                    drop-placeholder="Thả file ở đây..."
            >
           </b-form-file>
        </b-form-group>
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
              state: null,
              invalidStatement: '',
              data: [],
          }
        },
        watch: {
            file: function () {
                this.show = true;
                if (this.file.type === 'application/vnd.ms-excel' || this.file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                    this.uploadExcel();
                }
                else {
                    this.invalidStatement = 'Yêu cầu bạn tải file excel có format .xls'
                }

            }
        },
        methods: {
            async uploadExcel() {
                try {
                    let formData = new FormData();
                    formData.append('student_list_excel', this.file);
                    const response = await axios.post(`${process.env.VUE_APP_API_URL}/student/import-excel`, formData, {
                        headers: {
                          'Content-Type': 'multipart/form-data',
                        }
                    });
                    if (response.status === 200) {
                        console.log(response);
                        this.$bvToast.toast(`Tại file ${this.file.name} lên thành công!`, {
                            title: `Thành công`,
                            variant: 'success',
                            solid: true,
                            appendToast: true,
                        });
                        this.state = true;
                    }
                } catch (e) {
                    this.$bvToast.toast(`Gặp lỗi ${e.response.data.error_message} khi nhập file ${this.file.name}!`, {
                        title: `Thất bại`,
                        variant: 'danger',
                        solid: true,
                        appendToast: true,
                    });
                    this.state = false;
                }
            }
        },
    }
</script>
<style scoped>
</style>
