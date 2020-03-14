<template>
    <div>
        <h3 class="mb-3"><b-icon icon="people"></b-icon> Quản lý người dùng</h3>
        <b-card no-body>
            <b-tabs card lazy>
                <b-tab title="Quản lý danh sách" active>
                    <b-card-body>
                        <component :is="UserList"></component>
                    </b-card-body>
                </b-tab>
                <b-tab title="Thêm">
                    <b-card-body>
                        <component :is="Insert"></component>
                    </b-card-body>
                </b-tab>
            </b-tabs>
        </b-card>
    </div>
</template>

<script>
    import UserList from "@/components/User/List/UserList";
    import Insert from '@/components/User/List/Insert';

    export default {
        name: "StudentManagement",
        component: {
            UserList, Insert
        },
        data() {
            return {
                UserList, Insert
            }
        },
    }
</script>

<style scoped>

</style>
