<template>
    <div>
        <h2 class="mb-3">Quản lý người dùng</h2>
        <b-card no-body>
            <b-tabs card>
                <b-tab title="Quản lý danh sách" active>
                    <b-card-body>
                        <component :is="UserList"></component>
                    </b-card-body>
                </b-tab>
                <b-tab title="Nhập">
                    <b-card-body>
                    </b-card-body>
                </b-tab>
            </b-tabs>
        </b-card>
    </div>
</template>

<script>
    import UserList from "@/components/User/List/UserList";
    export default {
        name: "StudentManagement",
        component: {
            UserList
        },
        data() {
            return {
                UserList
            }
        },
    }
</script>

<style scoped>

</style>
