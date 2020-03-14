<template>
    <div>
        <h3 class="mb-3"><b-icon icon="people"></b-icon> Quản lý giảng viên</h3>
        <b-card no-body>
            <b-tabs card lazy>
                <b-tab title="Quản lý danh sách" active>
                    <b-card-body>
                        <component :is="LecturerList"></component>
                    </b-card-body>
                </b-tab>
                <b-tab title="Thêm">
                    <b-card-body>
                        <component :is="Input"></component>
                    </b-card-body>
                </b-tab>
            </b-tabs>
        </b-card>
    </div>
</template>

<script>
    import LecturerList from "@/components/Lecturer/List/LecturerList";
    import Input from '@/components/Lecturer/List/Insert';

    export default {
        name: "LecturerManagement",
        component: {
            LecturerList, Input
        },
        data() {
            return {
                LecturerList, Input
            }
        },
    }
</script>

<style scoped>

</style>
