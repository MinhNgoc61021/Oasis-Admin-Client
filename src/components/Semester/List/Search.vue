<template>
    <div>
        <vue-bootstrap-typeahead
                v-model="searchSemester" size="sm"
                :serializer="s => s.name"
                :placeholder="message"
                :data="searchResults"
                @hit="searchSelect = $event"
                :maxMatches="range"
                :minMatchingChars="minSearchChar"
                ref="typeahead"
        >
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
                searchSemester: '',
                searchResults: [],
                minSearchChar: 1,
                range: 1000,
                message: 'Tìm kiếm và nhập mã kỳ học',
                searchSelect: Object,
            }
        },
        watch: {
            searchSemester: debounce(function () {
                this.onSearch();
            }, 500),
            searchSelect: function () {
                eventBus.$emit('semesterSearchSelected', this.searchSelect);
            }
        },
        methods: {
            async onSearch() {
                if (this.searchSemester.length > 16  || this.searchSemester.length === 0) {
                    this.searchResults = [];
                }
                else {
                    this.searchResults = [];
                    try {
                        const response = await axios({
                        url: 'http://localhost:5000/semester/search',
                        method: 'get',
                        changeOrigin: true,
                        params: {
                            searchSemester: this.searchSemester,
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
                        this.$bvToast.toast(`Gặp lỗi ${error} khi tìm kiếm kỳ học ${this.searchSemester}!`, {
                            title: `Thất bại`,
                            variant: 'danger',
                            solid: true,
                            appendToast: true,
                        })
                    }
                }
            },
        },
    }
</script>

<style scoped>

</style>
