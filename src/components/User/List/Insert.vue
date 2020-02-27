<template>
    <b-tabs content-class="mt-3" align="center" small lazy>
        <b-tab title="Nhập form" active>
            <b-card-body>
                <component :is="Input"></component>
            </b-card-body>
        </b-tab>
        <b-tab title="Import Excel">
            <b-card-body>
                <component :is="Import"></component>
            </b-card-body>
        </b-tab>
    </b-tabs>
</template>

<script>
    import Input from '@/components/User/List/Insert/Input';
    import Import from '@/components/User/List/Insert/Import';

    export default {
        name: "Insert",
        component: {
            Import, Input
        },
        data() {
            return {
                Import, Input
            }
        },
    }
</script>

<style scoped>

</style>
