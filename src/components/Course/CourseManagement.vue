<template>
    <div>
        <h3 class="mb-3">Quản lý lớp môn học</h3>
        <b-card no-body>
            <b-tabs card lazy>
                <b-tab title="Quản lý danh sách" active>
                    <b-card-body>
                        <component :is="CourseList"></component>
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
    import CourseList from "@/components/Course/List/CourseList";
    import Input from '@/components/Course/List/Input';

    export default {
        name: "CourseManagement",
        components: {
            CourseList, Input
        },
        data() {
            return {
                CourseList, Input
            }
        },
    }
</script>

<style scoped>

</style>
