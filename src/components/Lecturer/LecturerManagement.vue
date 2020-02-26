<template>
    <div>
        <h3 class="mb-3">Quản lý giảng viên</h3>
        <b-card no-body>
            <b-tabs card lazy>
                <b-tab title="Quản lý danh sách" active>
                    <b-card-body>
                        <component :is="LecturerList"></component>
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
    import LecturerList from "@/components/Lecturer/List/LecturerList";
    import Insert from '@/components/Lecturer/List/Insert';

    export default {
        name: "StudentManagement",
        component: {
            LecturerList, Insert
        },
        data() {
            return {
                LecturerList, Insert
            }
        },
    }
</script>

<style scoped>

</style>
