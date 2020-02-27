<template>
    <div>
        <h3 class="mb-3">Quản lý kỳ học</h3>
        <b-card no-body>
            <b-tabs card lazy>
                <b-tab title="Quản lý danh sách" active>
                    <b-card-body>
                        <component :is="SemesterList"></component>
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
    import SemesterList from "@/components/Semester/List/SemesterList";
    import Insert from '@/components/Semester/List/Input';

    export default {
        name: "SemesterManagement",
        component: {
            SemesterList, Insert
        },
        data() {
            return {
                SemesterList, Insert
            }
        },
    }
</script>

<style scoped>

</style>
