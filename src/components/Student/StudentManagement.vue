<template>
    <div>
        <h2 class="mb-3">Quản lý sinh viên</h2>
        <b-card no-body>
            <b-tabs card>
                <b-tab title="Quản lý danh sách" active>
                    <b-card-body>
                        <component :is="StudentList"></component>
                    </b-card-body>
                </b-tab>
                <b-tab title="Nhập">
                    <b-card-body>
                        <component :is="Import"></component>
                    </b-card-body>
                </b-tab>
            </b-tabs>
        </b-card>
    </div>
</template>

<script>
    import Import from "@/components/Student/List/Import";
    import StudentList from "@/components/Student/List/StudentList";

    export default {
        name: "StudentManagement",
        component: {
            Import, StudentList
        },
        data() {
            return {
                Import, StudentList
            }
        },
    }
</script>

<style scoped>

</style>
