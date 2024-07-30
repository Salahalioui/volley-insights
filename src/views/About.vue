<template>
    <div class="about-screen p-4 bg-gray-100 min-h-screen">
      <h1 class="text-3xl font-bold mb-6 text-center">About Volley Insights</h1>
  
      <!-- App Description -->
      <div class="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold mb-4">What is Volley Insights?</h2>
        <p class="text-gray-700 mb-4">
          Volley Insights is a comprehensive volleyball match analysis app designed to help coaches, players, and staff track and analyze game performance. Whether you're a professional team or an amateur enthusiast, our app provides powerful tools to elevate your volleyball strategy.
        </p>
        <p class="text-gray-700">
          Part of a PhD thesis project, Volley Insights aims to revolutionize how volleyball games are recorded, analyzed, and understood.
        </p>
      </div>
  
      <!-- Key Features -->
      <div class="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold mb-4">Key Features</h2>
        <ul class="list-disc pl-5 text-gray-700">
          <li>Real-time game recording and event tracking</li>
          <li>Advanced statistics and performance analysis</li>
          <li>Player rotation management</li>
          <li>Customizable team and player profiles</li>
          <li>Export and share game data</li>
          <li>Intuitive and user-friendly interface</li>
        </ul>
      </div>
  
      <!-- Version Info -->
      <div class="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold mb-4">Version Information</h2>
        <p class="text-gray-700">
          <strong>Current Version:</strong> {{ appVersion }}
        </p>
        <p class="text-gray-700">
          <strong>Last Updated:</strong> {{ lastUpdated }}
        </p>
      </div>
  
      <!-- Contact Information -->
      <div class="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold mb-4">Contact Us</h2>
        <p class="text-gray-700 mb-2">
          <strong>Email:</strong> support@volleyinsights.com
        </p>
        <p class="text-gray-700 mb-2">
          <strong>Website:</strong> www.volleyinsights.com
        </p>
        <p class="text-gray-700">
          <strong>Follow us:</strong> @VolleyInsights on Twitter and Instagram
        </p>
      </div>
  
      <!-- Acknowledgments -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold mb-4">Acknowledgments</h2>
        <p class="text-gray-700">
          Volley Insights was developed as part of a PhD thesis project at [University Name]. We would like to thank all the coaches, players, and volleyball enthusiasts who contributed to the development and testing of this app.
        </p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AboutView',
    data() {
      return {
        appVersion: '1.0.0',
        lastUpdated: 'July 30, 2024'
      }
    }
  }
  </script>
  