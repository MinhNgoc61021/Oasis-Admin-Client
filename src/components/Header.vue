<template>
    <b-row>
        <b-col align-self="start">
            <b-navbar toggleable="sm" class="border-bottom" variant="light" fixed="top" type="light">
                <b-navbar-brand to="/user-management"><img :src="'/img/oasis.png'" height="35" width="auto" alt="OASIS Admin"></b-navbar-brand>
                <b-navbar-nav class="ml-auto">
                    <b-nav-item-dropdown right>
                        <!-- Using 'button-content' slot -->
                        <template v-slot:button-content>
                            <span>User</span>
                        </template>
                        <b-dropdown-item>Profile</b-dropdown-item>
                        <b-dropdown-item>Đăng xuất</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-navbar>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        name: "Header"
    }
</script>

<style scoped>

</style>
