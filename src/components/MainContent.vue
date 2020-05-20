<template>
    <b-row class="m-2 mt-3">
        <b-col>
            <div>
                <b-list-group flush sm>
                    <b-list-group-item to="/user-management" exact exact-active-class="active"><b-icon icon="people"></b-icon><span> Quản lý người dùng</span></b-list-group-item>
                    <b-list-group-item to="/student-management" exact exact-active-class="active"><b-icon icon="people"></b-icon><span> Quản lý sinh viên</span></b-list-group-item>
                    <b-list-group-item to="/lecturer-management" exact exact-active-class="active"><b-icon icon="people"></b-icon><span> Quản lý giảng viên</span></b-list-group-item>
                    <b-list-group-item to="/semester-management" exact exact-active-class="active"><b-icon icon="archive"></b-icon><span> Quản lý kỳ học</span></b-list-group-item>
                    <b-list-group-item to="/course-management" exact exact-active-class="active"><b-icon icon="book"></b-icon><span> Quản lý lớp môn học</span></b-list-group-item>
                    <b-list-group-item to="/problem-management" exact exact-active-class="active"><b-icon icon="code-slash"></b-icon><span> Quản lý các problem</span></b-list-group-item>
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
                width: 0,
                activation: true,
            }
        },
        mounted() {
            window.addEventListener('resize', this.handleResize);
        },
        destroyed() {
            window.removeEventListener('resize', this.handleResize);
        },
        methods: {
            handleResize() {
                this.width = window.innerWidth;
                console.log(this.width)
                if (this.width < 1200) {
                    this.activation = false;
                }
                else {
                    this.activation = true;
                }
            }
        }
    }   
</script>

<style scoped>

</style>
