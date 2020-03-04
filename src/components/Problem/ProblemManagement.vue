<template>
   <div>
        <h3 class="mb-3">Quản lý problem</h3>
        <b-card no-body>
            <b-tabs card lazy>
                <b-tab title="Quản lý danh sách" active>
                    <b-card-body>
                        <component :is="ProblemList"></component>
                    </b-card-body>
                </b-tab>
                <b-tab title="Thêm">
                    <b-card-body>
                    </b-card-body>
                </b-tab>
            </b-tabs>
        </b-card>
    </div>

</template>

<script>
    import ProblemList from "@/components/Problem/List/ProblemList";

    export default {
        name: "ProblemManagement",
        components: {
            ProblemList
        },
        data() {
            return {
                ProblemList
            }
        }
    }
</script>

<style scoped>

</style>
