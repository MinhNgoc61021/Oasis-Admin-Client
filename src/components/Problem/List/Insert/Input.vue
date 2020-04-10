<template>
  <div>
      <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
          <b-form-group
                  id="input-group-1"
                  label="Tiêu đề:"
                  label-for="input-1"
          >
              <b-form-input
                  id="input-1"
                  size="sm"
                  v-model="form.title"
                  type="text"
                  placeholder="Nhập tiêu đề:"
              ></b-form-input>
          </b-form-group>

         <b-form-group
                id="input-group-2"
                label="Nội dung:"
                label-for="input-2"
         >
             <froala :tag="input" :config="config" id="input-2" placeholder="Nhập nội dung" v-model="form.problem_statement"></froala>
         </b-form-group>
         <b-form-group
                id="input-group-3"
                label="Kiểu input:"
                label-for="input-3"
         >
             <froala id="input-3" :config="config" placeholder="Nhập nội dung" v-model="form.input_format"></froala>
         </b-form-group>
         <b-form-group
                id="input-group-5"
                label="Kiểu output:"
                label-for="input-5"
          >
             <froala id="input-5" :config="config" placeholder="Nhập nội dung" v-model="form.output_format"></froala>
         </b-form-group>
         <b-form-group
                id="input-group-4"
                label="Giàng buộc:"
                label-for="input-4"
          >
             <froala id="input-4" :config="config" placeholder="Nhập nội dung" v-model="form.constraints"></froala>
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
             <b-form-select id="input-8" v-model="form.category_id" :options="options" size="sm" class="mt-3"></b-form-select>
         </b-form-group>
         <b-form-group
                id="input-group-10"
                label="JUnit:"
                label-for="input-10"
          >
             <b-form-input
                id="input-10"
                size="sm"
                v-model="form.junit_rate"
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
                v-model="form.parser_rate"
                type="text"
                placeholder="Nhập điểm cấu trúc"
            ></b-form-input>
        </b-form-group>
         <b-form-group
                id="input-group-12"
                label="Chấm cấu trúc"
                label-for="input-12"
          >
             <b-form-checkbox v-model="form.mark_parser" id="input-12" size="sm" name="check-button" switch>
                 <span v-if="form.mark_parser !== true">Không</span>
                 <span v-else>Có</span>
            </b-form-checkbox>
         </b-form-group>
         <b-form-group
                id="input-group-13"
                label="Chấm chức năng:"
                label-for="input-13"
          >
             <b-form-checkbox v-model="form.mark_io" id="input-13" size="sm" name="check-button" switch>
                 <span v-if="form.mark_io !== true">Không</span>
                 <span v-else>Có</span>
            </b-form-checkbox>
        </b-form-group>

         <b-form-group
                id="input-group-14"
                label="Chấm JUnit:"
                label-for="input-14"
          >
             <b-form-checkbox v-model="form.mark_junit" id="input-14" size="sm" name="check-button" switch>
                 <span v-if="form.mark_junit !== true">Không</span>
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
                v-model="form.sample_code"
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
                v-model="form.submit_type"
                type="text"
                placeholder="Nhập kiểu submit"
            ></b-form-input>
        </b-form-group>
        <b-alert :show="form.notFilled" fade variant="danger">Nhập thiếu thông tin!</b-alert>
        <b-button size="sm" type="submit" variant="outline-primary">Tạo</b-button>
        <b-button size="sm" type="reset" class="ml-2" variant="outline-danger">Lại</b-button>
      </b-form>
  </div>
</template>

<script>
  import axios from 'axios';
  import {authHeader} from "@/auth/jwt";

  export default {
    name: 'Input',
    data() {
      return {
          config: {
              htmlRemoveTags: ['script', 'style', 'base'],
          },
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
          form: {
              title: '',
              problem_statement: '',
              input_format: '',
              constraints: '',
              output_format: '',
              junit_rate: '0.6',
              mark_io: true,
              mark_junit: true,
              mark_parser: true,
              parser_rate: '0.4',
              level: '1',
              point: 100,
              submit_type: 'CODE',
              sample_code: '',
              category_id: null,
              notFilled: false,
          },
      }
    },
    methods: {
      async onSubmit() {
          console.log(this.form);
        try {
          if (String(this.form.title).replace(' ', '') === ''
              || String(this.form.problem_statement).replace(' ', '') === ''
              || this.form.category_id === null
              || String(this.form.level).replace(' ', '') === '')
          {
              this.form.notFilled = true;
              setTimeout(() => {
                this.form.notFilled = false
              }, 3000);
          }
          else {
            const response = await axios({
                url: `${process.env.VUE_APP_API_URL}/problem/create-record`,
                method: 'post',
                changeOrigin: true,
                headers: { 'Authorization': authHeader() },
                data: {
                    new_title: this.form.title,
                    new_problem_statement: this.form.problem_statement,
                    new_input_format: this.form.input_format,
                    new_output_format: this.form.output_format,
                    new_constraints: this.form.constraints,
                    new_junit_rate: this.form.junit_rate,
                    new_mark_io: this.form.mark_io,
                    new_mark_junit: this.form.mark_junit,
                    new_level: this.form.level,
                    new_point: this.form.point,
                    new_submit_type: this.form.submit_type,
                    new_sample_code: this.form.sample_code,
                    category_id: this.form.category_id,
                    new_mark_parser: this.form.mark_parser,
                    new_parser_rate: this.form.parser_rate,
                },
              });
            if (response.status === 200) {
              this.$bvToast.toast(`Tạo problem thành công!`, {
                title: `Thành công`,
                variant: 'success',
                solid: true,
                appendToast: true,
              });
              this.onReset();
            }
            else if (response.status === 202) {
              this.$bvToast.toast(`Trùng lặp dữ liệu!`, {
                title: `Oops`,
                variant: 'warning',
                solid: true,
                appendToast: true,
              });
            }
          }
        } catch (e) {
            this.$bvToast.toast(`Gặp lỗi ${e.response.data.error_message} khi tạo problem!`, {
                title: `Thất bại`,
                variant: 'danger',
                solid: true,
                appendToast: true,
            });
        }
      },
      onReset() {
          // Reset our form values
          this.form.title = '';
          this.form.problem_statement = '';
          this.form.input_format = '';
          this.form.constraints = '';
          this.form.output_format = '';
          this.form.junit_rate = '0.6';
          this.form.mark_io = true;
          this.form.mark_junit = true;
          this.form.mark_parser = true;
          this.form.parser_rate = '0.4';
          this.form.level = '1';
          this.form.point = 100;
          this.form.submit_type = 'CODE';
          this.form.sample_code = '';
          this.form.category_id = null;
          this.form.notFilled = false;
      }
    }
  }
</script>
