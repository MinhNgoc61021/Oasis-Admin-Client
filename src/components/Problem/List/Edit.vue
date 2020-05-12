<template>
    <b-form @submit.prevent="submitProblemUpdate">
        <b-form-group
                id="input-group-1"
                label="Tiêu đề:"
                label-for="input-1"
        >
            <b-form-input
                    id="input-1"
                    size="sm"
                    v-model="editForm.title"
                    type="text"
                    placeholder="Nhập tiêu đề:"
            ></b-form-input>
        </b-form-group>

        <b-form-group
                id="input-group-2"
                label="Nội dung:"
                label-for="input-2"
        >
            <editor id="input-2" ref="problem_statement" height="400px" mode="markdown" @change="getStatement" :options="editorOptions" :initialValue="editForm.problem_statement"
                    />
        </b-form-group>
        <b-form-group
                id="input-group-3"
                label="Kiểu input:"
                label-for="input-3"
        >
            <editor id="input-3" ref="input_format" height="400px" mode="markdown" @change="getInputFormat" v-model="editForm.input_format" :options="editorOptions"
                    :initialValue="editForm.input_format"/>
        </b-form-group>
        <b-form-group
                id="input-group-4"
                label="Kiểu output:"
                label-for="input-4"
        >
            <editor id="input-4" ref="output_format" height="400px" mode="markdown" @change="getOutputFormat" :options="editorOptions" :initialValue="editForm.output_format"
                    />
        </b-form-group>
        <b-form-group
                id="input-group-5"
                label="Giàng buộc:"
                label-for="input-5"
        >
            <editor id="input-5" ref="constraints" height="400px" mode="markdown" @change="getConstraints" :options="editorOptions" :initialValue="editForm.constraints"
                    v-model="editForm.constraints"/>
        </b-form-group>
        <b-form-group
                id="input-group-6"
                label="Mức:"
                label-for="input-6"
        >
            <b-form-input
                    id="input-6"
                    size="sm"
                    v-model="editForm.level"
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
                    v-model="editForm.point"
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
            <b-form-select id="input-8" v-model="editForm.category_id" :options="options" size="sm"
                           class="mt-3"></b-form-select>
        </b-form-group>
        <b-form-group
                id="input-group-10"
                label="JUnit:"
                label-for="input-10"
        >
            <b-form-input
                    id="input-10"
                    size="sm"
                    v-model="editForm.junit_rate"
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
                    v-model="editForm.parser_rate"
                    type="text"
                    placeholder="Nhập điểm cấu trúc"
            ></b-form-input>
        </b-form-group>
        <b-form-group
                id="input-group-12"
                label="Chấm cấu trúc"
                label-for="input-12"
        >
            <b-form-checkbox v-model="editForm.mark_parser" id="input-12" size="sm" name="check-button" switch>
                <span v-if="editForm.mark_parser !== true">Không</span>
                <span v-else>Có</span>
            </b-form-checkbox>
        </b-form-group>
        <b-form-group
                id="input-group-13"
                label="Chấm chức năng:"
                label-for="input-13"
        >
            <b-form-checkbox v-model="editForm.mark_io" id="input-13" size="sm" name="check-button" switch>
                <span v-if="editForm.mark_io !== true">Không</span>
                <span v-else>Có</span>
            </b-form-checkbox>
        </b-form-group>

        <b-form-group
                id="input-group-14"
                label="Chấm JUnit:"
                label-for="input-14"
        >
            <b-form-checkbox v-model="editForm.mark_junit" id="input-14" size="sm" name="check-button" switch>
                <span v-if="editForm.mark_junit !== true">Không</span>
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
                    v-model="editForm.sample_code"
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
                    v-model="editForm.submit_type"
                    type="text"
                    placeholder="Nhập kiểu submit"
            ></b-form-input>
        </b-form-group>
        <b-alert :show="editForm.notFilled" fade variant="danger">Nhập thiếu thông tin!</b-alert>
        <b-button size="sm" style="float: right;" type="submit" variant="outline-primary">Cập nhật</b-button>
    </b-form>
</template>

<script>
    import axios from "axios";
    import {eventBus} from "@/main";
    import {authHeader} from "@/auth/jwt";
    import 'codemirror/lib/codemirror.css';

    import '@toast-ui/editor/dist/toastui-editor.css';
    import {Editor} from "@toast-ui/vue-editor";

    export default {
        name: "Edit",
        props: ['problem'],
        components: {
            editor: Editor
        },
        data() {
            return {
                editorOptions: {
                    hideModeSwitch: true
                },
                options: [
                    {value: null, text: 'Hãy chọn loại'},
                    {value: 1, text: 'Java cơ bản'},
                    {value: 2, text: 'Kế thừa'},
                    {value: 3, text: 'Đa hình'},
                    {value: 4, text: 'Ngoại lệ'},
                    {value: 5, text: 'Java I/O'},
                    {value: 6, text: 'Java Generic Programming'},
                    {value: 7, text: 'Mẫu thiết kế'},
                ],
                editForm: {
                    problem_id: this.problem.problem_id,
                    title: this.problem.title,
                    problem_statement: this.problem.problem_statement,
                    input_format: this.problem.input_format,
                    constraints: this.problem.constraints,
                    output_format: this.problem.output_format,
                    junit_rate: parseFloat(this.problem.junit_rate).toFixed(1),
                    mark_io: Boolean(this.problem.mark_io),
                    mark_junit: Boolean(this.problem.mark_junit),
                    mark_parser: Boolean(this.problem.mark_parser),
                    parser_rate: parseFloat(this.problem.parser_rate).toFixed(1),
                    level: this.problem.level,
                    point: this.problem.point,
                    submit_type: this.problem.submit_type,
                    sample_code: this.problem.sample_code,
                    category_id: this.problem.category.category_id,
                    notFilled: false,
                },
            }
        },
        methods: {
            getStatement() {
                this.editForm.problem_statement = this.$refs.problem_statement.invoke('getMarkdown');
            },
            getInputFormat() {
                this.editForm.input_format = this.$refs.input_format.invoke('getMarkdown');
            },
            getOutputFormat() {
                this.editForm.output_format = this.$refs.output_format.invoke('getMarkdown');
            },
            getConstraints() {
                this.editForm.constraints = this.$refs.constraints.invoke('getMarkdown');
            },
            async submitProblemUpdate() {
                try {
                    if (String(this.editForm.title).replace(' ', '') === ''
                        || String(this.editForm.problem_statement).replace(' ', '') === ''
                        || String(this.editForm.level).replace(' ', '') === ''
                        || String(this.editForm.point).replace(' ', '') === ''
                        || this.editForm.category_id === null
                    ) {
                        this.editForm.notFilled = true;
                        setTimeout(() => {
                            this.editForm.notFilled = false;
                        }, 3000);
                    } else {
                        const response = await axios({
                            url: `${process.env.VUE_APP_API_URL}/problem/update-record`,
                            method: 'put',
                            headers: {'Authorization': authHeader()},
                            data: {
                                problem_id: this.editForm.problem_id,
                                update_title: this.editForm.title,
                                update_problem_statement: this.editForm.problem_statement,
                                update_input_format: this.editForm.input_format,
                                update_constraints: this.editForm.constraints,
                                update_output_format: this.editForm.output_format,
                                update_junit_rate: this.editForm.junit_rate,
                                update_mark_io: this.editForm.mark_io,
                                update_mark_junit: this.editForm.mark_junit,
                                update_mark_parser: this.editForm.mark_parser,
                                update_parser_rate: this.editForm.parser_rate,
                                update_level: this.editForm.level,
                                update_point: this.editForm.point,
                                update_submit_type: this.editForm.submit_type,
                                update_sample_code: this.editForm.sample_code,
                                update_category_id: this.editForm.category_id,
                            },
                            changeOrigin: true,
                        });
                        if (response.status === 200) {
                            this.$bvToast.toast(`Cập nhật problem ${this.editForm.title} thành công!`, {
                                title: `Thành công`,
                                variant: 'success',
                                solid: true,
                                appendToast: true,
                            });
                            this.refreshProblemList()
                        } else if (response.status === 202) {
                            this.$bvToast.toast(`Trùng dữ liệu!`, {
                                title: `Oops!`,
                                variant: 'warning',
                                solid: true,
                                appendToast: true,
                            })
                        }
                    }
                } catch (e) {
                    this.$bvToast.toast(`Gặp lỗi ${e} khi cập nhật dữ liệu problem ${this.editForm.title}!`, {
                        title: `Thất bại`,
                        variant: 'danger',
                        solid: true,
                        appendToast: true,
                    })
                }
            },
            refreshProblemList() {
                eventBus.$emit('refreshProblemList');
            }
        },
    }

</script>

<style scoped>

</style>
