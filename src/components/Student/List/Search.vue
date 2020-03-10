<template>
    <div>
        <vue-bootstrap-typeahead
          v-model="searchCode" size="sm"
          :serializer="s => s.code"
          :placeholder="message"
          :data="searchResults"
          @hit="searchSelect = $event"
          :maxMatches="range"
          :minMatchingChars="minSearchChar"
        >
            <template slot="suggestion" slot-scope="{ data }">
                <span><b>MSSV: </b>{{ data.code }}</span><br>
                <span><b>Email: </b>{{ data.user.email}}</span><br>
                <span><b>Họ tên: </b>{{ data.user.name }}</span>

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
                searchCode: '',
                searchResults: [],
                minSearchChar: 1,
                range: 1000,
                message: 'Tìm kiếm bằng mã số sinh viên',
                searchSelect: Object,
            }
        },
        watch: {
            searchCode: debounce(function () {
                this.onSearch();
            }, 500),
            searchSelect: function () {
                eventBus.$emit('studentSearchSelected', this.searchSelect);
            }
        },
        methods: {
            async onSearch() {
                if (this.searchCode.length > 16  || this.searchCode.length === 0) {
                    this.searchResults = [];
                }
                else {
                    this.searchResults = [];
                    try {
                        const response = await axios({
                        url: `${process.env.VUE_APP_API_URL}/student/search`,
                        method: 'get',
                        changeOrigin: true,
                        params: {
                            searchCode: this.searchCode,
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
                        this.$bvToast.toast(`Gặp lỗi ${error} khi tìm kiếm sinh viên có MSSV: ${this.searchCode}!`, {
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
