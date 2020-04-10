<template>
    <b-tabs content-class="mt-3" align="center" small lazy>
        <b-tab title="Nhập form" active>
            <b-card-body>
                <component :is="Input"></component>
            </b-card-body>
        </b-tab>
    </b-tabs>
</template>

<script>
    import Input from '@/components/User/List/Insert/Input';

    export default {
        name: "Insert",
        component: {
            Input
        },
        data() {
            return {
                Input
            }
        },
    }
</script>

<style scoped>

</style>
