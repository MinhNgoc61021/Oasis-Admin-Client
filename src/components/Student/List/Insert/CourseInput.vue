<template>
    <div>
        <vue-bootstrap-typeahead
          v-model="searchCourse" size="sm"
          :serializer="s => s.code"
          :placeholder="message"
          :data="searchResults"
          @hit="searchSelect = $event"
          :maxMatches="range"
          :minMatchingChars="minSearchChar"
          ref="typeahead"
        >
            <template slot="suggestion" slot-scope="{ data }">
                <span><b>Mã học phần: </b>{{ data.code }}</span><br>
                <span><b>Tên học phần: </b>{{ data.name }}</span><br>
            </template>
        </vue-bootstrap-typeahead>
    </div>
</template>

<script>
    import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';
    import debounce from 'lodash/debounce';
    import axios from 'axios';
    import { eventBus } from "@/main";

    export default {
        name: "CourseInput",
        components: {
            VueBootstrapTypeahead
        },
        data() {
            return {
                searchCourse: '',
                searchResults: [],
                minSearchChar: 1,
                range: 1000,
                message: 'Tìm kiếm và nhập mã lớp học phần',
                searchSelect: Object,
            }
        },
        watch: {
            searchCourse: debounce(function () {
                this.onSearch();
            }, 500),
            searchSelect: function () {
                eventBus.$emit('courseSearchSelected', this.searchSelect);
            }
        },
        methods: {
            async onSearch() {
                if (this.searchCourse.length > 16  || this.searchCourse.length === 0) {
                    this.searchResults = [];
                }
                else {
                    this.searchResults = [];
                    try {
                        const response = await axios({
                        url: `${process.env.VUE_APP_API_URL}/course/search`,
                        method: 'get',
                        changeOrigin: true,
                        params: {
                            searchCourse: this.searchCourse,
                        },
                    });
                        if (response.status === 200) {
                            // console.log(response.data.search_results);
                            response.data.search_results.forEach((item) => {
                                this.searchResults.push(item);
                            });
                        }
                    }
                    catch(error) {
                        this.$bvToast.toast(`Gặp lỗi ${error} khi tìm kiếm lớp học phần có mã: ${this.searchCode}!`, {
                            title: `Thất bại`,
                            variant: 'danger',
                            solid: true,
                            appendToast: true,
                        })
                    }
                }
            },
        },
        created() {
            // eventBus.$on('clearCourse', () => {
            //     this.$ref.typeahead.inputValue = '';
            // });
        }
    }
</script>

<style scoped>

</style>
