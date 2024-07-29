<template>
    <div class="home">
      <h1 class="text-2xl font-bold mb-4">Welcome to Volley Insights</h1>
      <BaseButton @click="navigateToTeam">Go to My Team</BaseButton>
    </div>
  </template>
  
  <script>
  import BaseButton from '@/components/common/BaseButton.vue'
  
  export default {
    name: 'HomeView',
    components: {
      BaseButton
    },
    methods: {
      navigateToTeam() {
        this.$router.push('/team')
      }
    }
  }
  </script>
  