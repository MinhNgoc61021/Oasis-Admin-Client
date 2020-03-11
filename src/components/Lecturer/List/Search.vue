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
        >
            <template slot="suggestion" slot-scope="{ data }">
                <span><b>Họ tên: </b>{{ data.name }}</span><br>
                <span><b>Tài khoản: </b>{{ data.username}}</span><br>
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
        name: "Search",
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
                eventBus.$emit('lecturerSearchSelected', this.searchSelect);
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
                        url: `${process.env.VUE_APP_API_URL}/lecturer/search`,
                        method: 'get',
                        changeOrigin: true,
                        params: {
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
                        this.$bvToast.toast(`Gặp lỗi ${error.response.data.error_message} khi tìm kiếm giảng viên ${this.searchName}!`, {
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
