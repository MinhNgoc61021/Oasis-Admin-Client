<template>
    <div>
        <vue-bootstrap-typeahead
          v-model="searchUsername" size="sm"
          :serializer="s => s.username"
          :placeholder="message"
          :data="searchResults"
          @hit="searchSelect = $event"
          :maxMatches="range"
          :minMatchingChars="minSearchChar"
        >
            <template slot="suggestion" slot-scope="{ data }">
                <span><b>Tài khoản: </b>{{ data.username}}</span><br>
                <span><b>Email: </b>{{ data.email}}</span><br>
                <span><b>Họ tên: </b>{{ data.name }}</span>

            </template>
        </vue-bootstrap-typeahead>
    </div>
</template>

<script>
    import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';
    import debounce from 'lodash/debounce';
    import axios from 'axios';
    import { eventBus } from "@/main";
    import {authHeader} from "@/auth/jwt";

    export default {
        name: "Search",
        components: {
            VueBootstrapTypeahead
        },
        data() {
            return {
                searchUsername: '',
                searchResults: [],
                minSearchChar: 1,
                range: 1000,
                message: 'Tìm kiếm bằng tên đăng nhập',
                searchSelect: Object,
            }
        },
        watch: {
            searchUsername: debounce(function () {
                this.onSearch();
            }, 500),
            searchSelect: function () {
                eventBus.$emit('userSearchSelected', this.searchSelect);
            }
        },
        methods: {
            async onSearch() {
                if (this.searchUsername.length > 16  || this.searchUsername.length === 0) {
                    this.searchResults = [];
                }
                else {
                    this.searchResults = [];
                    try {
                        const response = await axios({
                            url: `${process.env.VUE_APP_API_URL}/user/search`,
                            method: 'get',
                            headers: { 'Authorization': authHeader() },
                            changeOrigin: true,
                            params: {
                                searchUsername: this.searchUsername,
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
                        this.$bvToast.toast(`Gặp lỗi ${error.response.data.error_message} khi tìm kiếm người dùng có tài khoản: ${this.searchUsername}!`, {
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
