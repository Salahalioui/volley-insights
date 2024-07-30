<template>
    <div class="text-center">
      <p :class="`text-2xl font-bold text-${color}-600`">{{ value }}</p>
      <p class="text-gray-700 text-lg">{{ title }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'StatCard',
    props: {
      title: String,
      value: [String, Number],
      color: {
        type: String,
        default: 'blue'
      }
    }
  }
  </script>