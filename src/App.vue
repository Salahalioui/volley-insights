<template>
  <div id="app">
    <nav class="bg-gray-800 text-white p-4">
      <router-link to="/" class="mr-4">Home</router-link>
      <router-link to="/team" class="mr-4">My Team</router-link>
      <router-link to="/create-game" class="mr-4">Create Game</router-link>
      <router-link to="/results" class="mr-4">Results</router-link>
      <router-link to="/about">About</router-link>
    </nav>
    <main class="container mx-auto mt-4 p-4">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
