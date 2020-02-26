<template>
    <div>
        <h3 class="mb-3">Quản lý sinh viên</h3>
        <b-card no-body>
            <b-tabs card lazy>
                <b-tab title="Quản lý danh sách" active>
                    <b-card-body>
                        <component :is="StudentList"></component>
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
    import Insert from "@/components/Student/List/Insert";
    import StudentList from "@/components/Student/List/StudentList";

    export default {
        name: "StudentManagement",
        component: {
            Insert, StudentList
        },
        data() {
            return {
                Insert, StudentList
            }
        },
    }
</script>

<style scoped>

</style>
