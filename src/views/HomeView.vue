<template>
  <div class="home">
    <div class="container">
    <PageHome />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import PageHome from '@/components/PageHome.vue'

export default {
  name: 'HomeView',
  components: {
    PageHome
  }
}
</script>
