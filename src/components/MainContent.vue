<template>
    <b-row class="m-2 mt-3">
        <b-col>
            <div>
                <b-list-group flush sm>
                    <b-list-group-item to="/user-management">Quản lý người dùng</b-list-group-item>
                    <b-list-group-item to="/student-management">Quản lý sinh viên</b-list-group-item>
                    <b-list-group-item to="/lecturer-management">Quản lý giảng viên</b-list-group-item>
                    <b-list-group-item to="/semester-management">Quản lý kỳ học</b-list-group-item>
                    <b-list-group-item to="/course-management">Quản lý lớp môn học</b-list-group-item>
                    <b-list-group-item to="/problem-management">Quản lý các problem</b-list-group-item>
                </b-list-group>
            </div>
        </b-col>
        <b-col :class="{ 'col-9': activation }" align-self="center">
            <router-view></router-view>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        name: "MainContent",
        data() {
            return {
                width: window.innerWidth,
                activation: true,
            }
        }
    }
</script>

<style scoped>

</style>
