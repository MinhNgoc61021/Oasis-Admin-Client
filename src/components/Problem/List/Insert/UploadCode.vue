<template>
    <b-form>
        <b-form-group
                :valid-feedback="validStatement"
                :invalid-feedback="invalidStatement"
        >
            <b-form-file
                    size="sm"
                    v-model="file"
                    :state="uploadState"
                    accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    placeholder="Chọn hoặc kéo thả file..."
                    drop-placeholder="Thả file ở đây..."
            >
            </b-form-file>
        </b-form-group>
        <b-button variant="outline-primary" size="sm" class="mr-1 float-right" @click="confirmUpload()">
            <span>Tải lên</span>
        </b-button>
    </b-form>
</template>

<script>
    export default {
        name: "UploadCode",
        data() {
            return {
                file: null,
                uploadState: null,
                invalidStatement: '',
                validStatement: '',
            }
        },
        methods: {

        },
    }
</script>

<style scoped>
</style>
