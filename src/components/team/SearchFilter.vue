<template>
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <input 
        :value="searchQuery" 
        @input="$emit('update:searchQuery', $event.target.value)"
        type="text" 
        placeholder="Search players..." 
        class="flex-grow p-3 border rounded-lg focus:ring focus:ring-blue-300 transition duration-300"
      >
      <select 
        :value="roleFilter"
        @change="$emit('update:roleFilter', $event.target.value)"
        class="p-3 border rounded-lg focus:ring focus:ring-blue-300 transition duration-300"
      >
        <option value="">All Roles</option>
        <option v-for="role in uniqueRoles" :key="role" :value="role">{{ role }}</option>
      </select>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SearchFilter',
    props: {
      searchQuery: String,
      roleFilter: String,
      uniqueRoles: Array
    }
  };
  </script>
  
  <style scoped>
  </style>
  