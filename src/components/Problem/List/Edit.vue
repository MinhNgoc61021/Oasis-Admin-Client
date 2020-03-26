<template>
    <b-form @submit.prevent="submitSemesterUpdate">
          <b-form-group
                  id="input-group-1"
                  label="Tiêu đề:"
                  label-for="input-1"
          >
              <b-form-input
                  id="input-1"
                  size="sm"
                  v-model="problem.title"
                  type="text"
                  placeholder="Nhập tiêu đề:"
              ></b-form-input>
          </b-form-group>

         <b-form-group
                id="input-group-2"
                label="Nội dung:"
                label-for="input-2"
         >
             <froala :tag="input" :config="config" id="input-2" placeholder="Nhập nội dung" v-model="problem.problem_statement"></froala>
         </b-form-group>
         <b-form-group
                id="input-group-3"
                label="Kiểu input:"
                label-for="input-3"
         >
             <froala id="input-3" :config="config" placeholder="Nhập nội dung" v-model="problem.input_format"></froala>
         </b-form-group>
         <b-form-group
                id="input-group-5"
                label="Kiểu output:"
                label-for="input-5"
          >
             <froala id="input-5" :config="config" placeholder="Nhập nội dung" v-model="problem.output_format"></froala>
         </b-form-group>
         <b-form-group
                id="input-group-4"
                label="Giàng buộc:"
                label-for="input-4"
          >
             <froala id="input-4" :config="config" placeholder="Nhập nội dung" v-model="problem.constraints"></froala>
         </b-form-group>
         <b-form-group
                id="input-group-6"
                label="Mức:"
                label-for="input-6"
          >
             <b-form-input
                id="input-6"
                size="sm"
                v-model="form.level"
                type="text"
                placeholder="Nhập mức"
            ></b-form-input>
         </b-form-group>
         <b-form-group
                id="input-group-7"
                label="Điểm:"
                label-for="input-7"
          >
             <b-form-input
                     id="input-7"
                     size="sm"
                     v-model="form.point"
                     type="number"
                     min="0"
                     max="100"
                     placeholder="Nhập điểm"
            ></b-form-input>
         </b-form-group>
         <b-form-group
                id="input-group-8"
                label="Loại:"
                label-for="input-8"
          >
             <b-form-select id="input-8" v-model="problem.category_id" :options="options" size="sm" class="mt-3"></b-form-select>
         </b-form-group>
         <b-form-group
                id="input-group-10"
                label="JUnit:"
                label-for="input-10"
          >
             <b-form-input
                id="input-10"
                size="sm"
                v-model="problem.junit_rate"
                type="text"
                placeholder="Nhập JUnit"
            ></b-form-input>
         </b-form-group>
         <b-form-group
                id="input-group-11"
                label="Parser:"
                label-for="input-11"
          >
             <b-form-input
                id="input-11"
                size="sm"
                v-model="problem.parser_rate"
                type="text"
                placeholder="Nhập điểm cấu trúc"
            ></b-form-input>
        </b-form-group>
         <b-form-group
                id="input-group-12"
                label="Chấm cấu trúc"
                label-for="input-12"
          >
             <b-form-checkbox v-model="problem.mark_parser" id="input-12" size="sm" name="check-button" switch>
                 <span v-if="problem.mark_parser !== true">Không</span>
                 <span v-else>Có</span>
            </b-form-checkbox>
         </b-form-group>
         <b-form-group
                id="input-group-13"
                label="Chấm chức năng:"
                label-for="input-13"
          >
             <b-form-checkbox v-model="problem.mark_io" id="input-13" size="sm" name="check-button" switch>
                 <span v-if="problem.mark_io !== true">Không</span>
                 <span v-else>Có</span>
            </b-form-checkbox>
        </b-form-group>

         <b-form-group
                id="input-group-14"
                label="Chấm JUnit:"
                label-for="input-14"
          >
             <b-form-checkbox v-model="problem.mark_junit" id="input-14" size="sm" name="check-button" switch>
                 <span v-if="problem.mark_junit !== true">Không</span>
                 <span v-else>Có</span>
            </b-form-checkbox>
        </b-form-group>
        <b-form-group
                id="input-group-15"
                label="Nhập code mẫu:"
                label-for="input-15"
          >
             <b-form-input
                id="input-15"
                size="sm"
                v-model="problem.sample_code"
                type="text"
                placeholder="Nhập code mẫu"
            ></b-form-input>
        </b-form-group>
        <b-form-group
                id="input-group-16"
                label="Nhập kiểu submit:"
                label-for="input-16"
          >
             <b-form-input
                id="input-16"
                size="sm"
                v-model="problem.submit_type"
                type="text"
                placeholder="Nhập kiểu submit"
            ></b-form-input>
        </b-form-group>
        <b-alert :show="problem.notFilled" fade variant="danger">Nhập thiếu thông tin!</b-alert>
        <b-button size="sm" type="submit" variant="outline-primary">Tạo</b-button>
        <b-button size="sm" type="reset" class="ml-2" variant="outline-danger">Lại</b-button>
    </b-form>
</template>

<script>
    import axios from "axios";

    export default {
        name: "Edit",
        props: ['problem'],
        data() {
          return {
              options: [
              { value: null, text: 'Hãy chọn loại' },
              { value: 1, text: 'Java cơ bản' },
              { value: 2, text: 'Kế thừa' },
              { value: 3, text: 'Đa hình' },
              { value: 4, text: 'Ngoại lệ' },
              { value: 5, text: 'Java I/O' },
              { value: 6, text: 'Java Generic Programming' },
              { value: 7, text: 'Mẫu thiết kế' },
          ],
          }
        },
        methods: {
            async submitSemesterUpdate() {
                try {
                    if (String(this.EditModal.UpdateProblemForm.name).replace(' ', '') === ''
                    ) {
                        this.EditModal.UpdateProblemForm.notFilled = true;
                        setTimeout(() => {
                            this.EditModal.UpdateProblemForm.notFilled = false;
                        }, 3000);
                    }
                    else {
                        const response = await axios({
                            url: `${process.env.VUE_APP_API_URL}/semester/update-record`,
                            method: 'put',
                            data: {
                                semester_id: this.EditModal.UpdateProblemForm.semester_id,
                                update_name: this.EditModal.UpdateProblemForm.name,
                            },
                            changeOrigin: true,
                        });
                        if (response.status === 200) {
                            this.$bvToast.toast(`Cập nhật kỳ học ${this.EditModal.UpdateProblemForm.name} thành công!`, {
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
                    this.$bvToast.toast(`Gặp lỗi ${e} khi cập nhật dữ liệu problem ${this.EditModal.UpdateProblemForm.name}!`, {
                        title: `Thất bại`,
                        variant: 'danger',
                        solid: true,
                        appendToast: true,
                    })
                } finally {
                    this.getProblemRecordData();
                }
            },
        },
    }

</script>

<style scoped>

</style>
