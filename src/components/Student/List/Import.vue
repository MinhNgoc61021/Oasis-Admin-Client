<template>
    <div>
        <b-form-file
                size="sm"
                v-model="file"
                :state="Boolean(file)"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                placeholder="Chọn hoặc kéo thả file..."
                drop-placeholder="Thả file ở đây..."
        >
       </b-form-file>
    </div>
</template>

<script>
    export default {
        name: "Import",
        data() {
          return {
            file: null,
          }
        }
    }
</script>
<style scoped>
     .custom-file-input:lang(en) ~ .custom-file-label::after {
         content: 'Chọn';
     }
</style>
