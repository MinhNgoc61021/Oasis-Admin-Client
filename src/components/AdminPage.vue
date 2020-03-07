<template>
    <div>
      <div>
        <Header></Header>
      </div>

      <div style="margin-top: 80px;">
        <!--content-->
        <MainContent></MainContent>
        <!--footer-->
        <Footer></Footer>
      </div>
    </div>
</template>

<script>
    import Header from "@/components/Header";
    import MainContent from "@/components/MainContent";
    import Footer from "@/components/Footer";

    export default {
        name: "AdminPage",
        components: {
          Header, MainContent, Footer
        },
        data() {
            return {
              Header, MainContent, Footer,
              collapsed: false,

            }
        },
        watch: {
            width: function (value) {
              console.log(value);
            }
        },
    }
</script>

<style scoped>
</style>
