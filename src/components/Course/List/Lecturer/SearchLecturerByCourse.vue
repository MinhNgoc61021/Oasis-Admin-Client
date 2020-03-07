<template>
    <div>
        <vue-bootstrap-typeahead
          v-model="searchName" size="sm"
          :serializer="s => s.name"
          :placeholder="message"
          :data="searchResults"
          @hit="searchSelect = $event"
          :maxMatches="range"
          :minMatchingChars="minSearchChar"
          ref="typeahead"
        >
            <template slot="suggestion" slot-scope="{ data }">
                <span><b>Họ tên: </b>{{ data.name }}</span><br>
                <span><b>Tên đăng nhập: </b>{{ data.username }}</span><br>
                <span><b>Email: </b>{{ data.email}}</span>
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
        name: "SearchLecturerByCourse",
        props: ['current_course', 'location'],
        components: {
            VueBootstrapTypeahead
        },
        data() {
            return {
                searchName: '',
                searchResults: [],
                minSearchChar: 1,
                range: 1000,
                message: 'Tìm kiếm bằng họ tên',
                searchSelect: Object,
            }
        },
        watch: {
            searchName: debounce(function () {
                this.onSearch();
            }, 500),
            searchSelect: function () {
                if (this.location === 'from-course') {
                    eventBus.$emit('lecturerInCourseSearchSelected', this.searchSelect);
                }
                else {
                    eventBus.$emit('lecturerOutsideCourseSearchSelected', this.searchSelect);
                }
            }
        },
        methods: {
            async onSearch() {
                if (this.searchName.length > 16  || this.searchName.length === 0) {
                    this.searchResults = [];
                }
                else {
                    this.searchResults = [];
                    try {
                        const response = await axios({
                        url: 'http://localhost:5000/lecturer/search-' + this.location,
                        method: 'get',
                        changeOrigin: true,
                        params: {
                            course_id: this.current_course,
                            searchName: this.searchName,
                        },
                    });
                        if (response.status === 200) {
                            // console.log(response.data.search_results);
                            response.data.search_results.forEach((item) => {
                                this.searchResults.push(item);
                            });
                              // console.log(this.searchResults);
                        }
                    }
                    catch(error) {
                        this.$bvToast.toast(`Gặp lỗi ${error} khi tìm kiếm giảng viên ${this.searchName}!`, {
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
        }
    }
</script>

<style scoped>

</style>
