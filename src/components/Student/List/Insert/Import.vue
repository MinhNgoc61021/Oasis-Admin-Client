<template>
    <div>
        <b-form-group
            :invalid-feedback="invalidStatement"
          >
            <b-form-file
                    size="sm"
                    v-model="file"
                    :state="state"
                    accept="application/vnd.ms-excel"

                    placeholder="Chọn hoặc kéo thả file..."
                    drop-placeholder="Thả file ở đây..."
            >
           </b-form-file>
        </b-form-group>
        <b-alert :show="show" variant="success">
            <h4 class="alert-heading">Well done!</h4>
            <p>
              GG {{ file }}
            </p>
            <hr>
        </b-alert>

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
          }
        },
        watch: {
            file: function () {
                this.show = true;
                console.log(this.file.type);
                if (this.file.type === 'application/vnd.ms-excel') {
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
                        this.$bvToast.toast(`Tại file lên thành công !`, {
                            title: `Thành công`,
                            variant: 'success',
                            solid: true,
                            appendToast: true,
                        });
                    }
                } catch (e) {
                    this.$bvToast.toast(`Gặp lỗi ${e} khi nhập file ${this.file}!`, {
                        title: `Thất bại`,
                        variant: 'danger',
                        solid: true,
                        appendToast: true,
                    });
                }
            }
        },
    }
</script>
<style scoped>
</style>
