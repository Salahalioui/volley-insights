<template>
    <div class="about-screen p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold mb-10 text-center text-blue-600">About Volley Insights</h1>
  
        <!-- App Description -->
        <section class="mb-8 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 class="text-2xl font-semibold mb-4 flex items-center text-blue-700">
            <i class="fas fa-info-circle mr-3 text-blue-500"></i>
            What is Volley Insights?
          </h2>
          <p class="text-gray-700 mb-4 leading-relaxed">
            Volley Insights is a comprehensive volleyball match analysis app designed to help coaches, players, and staff track and analyze game performance. Whether you're a professional team or an amateur enthusiast, our app provides powerful tools to elevate your volleyball strategy.
          </p>
          <p class="text-gray-700 leading-relaxed">
            Part of a PhD thesis project, Volley Insights aims to revolutionize how volleyball games are recorded, analyzed, and understood.
          </p>
        </section>
  
        <!-- Key Features -->
        <section class="mb-8 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 class="text-2xl font-semibold mb-6 flex items-center text-yellow-600">
            <i class="fas fa-star mr-3 text-yellow-500"></i>
            Key Features
          </h2>
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <li v-for="feature in features" :key="feature.text" class="flex items-start">
              <i :class="['fas', feature.icon, 'mt-1', 'mr-3', 'text-green-500']"></i>
              <span class="text-gray-700">{{ feature.text }}</span>
            </li>
          </ul>
        </section>
  
        <!-- Version Info -->
        <section class="mb-8 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 class="text-2xl font-semibold mb-4 flex items-center text-purple-700">
            <i class="fas fa-code-branch mr-3 text-purple-500"></i>
            Version Information
          </h2>
          <p class="text-gray-700 mb-2">
            <strong>Current Version:</strong> {{ appVersion }}
          </p>
          <p class="text-gray-700 mb-4">
            <strong>Last Updated:</strong> {{ lastUpdated }}
          </p>
          <button @click="showChangeLog" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
            View Changelog
          </button>
        </section>
  
        <!-- Contact Information -->
        <section class="mb-8 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 class="text-2xl font-semibold mb-6 flex items-center text-red-700">
            <i class="fas fa-envelope mr-3 text-red-500"></i>
            Contact Us
          </h2>
          <div class="space-y-4">
            <a href="mailto:support@volleyinsights.com" class="flex items-center text-blue-500 hover:text-blue-600 transition duration-300">
              <i class="fas fa-envelope mr-3"></i>
              support@volleyinsights.com
            </a>
            <a href="https://www.volleyinsights.com" target="_blank" rel="noopener noreferrer" class="flex items-center text-blue-500 hover:text-blue-600 transition duration-300">
              <i class="fas fa-globe mr-3"></i>
              www.volleyinsights.com
            </a>
            <a href="https://twitter.com/VolleyInsights" target="_blank" rel="noopener noreferrer" class="flex items-center text-blue-500 hover:text-blue-600 transition duration-300">
              <i class="fab fa-twitter mr-3"></i>
              @VolleyInsights
            </a>
          </div>
        </section>
  
        <!-- Acknowledgments -->
        <section class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 class="text-2xl font-semibold mb-4 flex items-center text-yellow-700">
            <i class="fas fa-award mr-3 text-yellow-600"></i>
            Acknowledgments
          </h2>
          <p class="text-gray-700 leading-relaxed">
            Volley Insights was developed as part of a PhD thesis project at [University Name]. We would like to thank all the coaches, players, and volleyball enthusiasts who contributed to the development and testing of this app.
          </p>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AboutView',
    data() {
      return {
        appVersion: '1.0.0',
        lastUpdated: 'July 30, 2024',
        features: [
          { icon: 'fa-clock', text: 'Real-time game recording and event tracking' },
          { icon: 'fa-chart-bar', text: 'Advanced statistics and performance analysis' },
          { icon: 'fa-sync', text: 'Player rotation management' },
          { icon: 'fa-users', text: 'Customizable team and player profiles' },
          { icon: 'fa-file-export', text: 'Export and share game data' },
          { icon: 'fa-mobile-alt', text: 'Intuitive and user-friendly interface' }
        ]
      }
    },
    methods: {
      showChangeLog() {
        // Implement changelog display logic here
        alert('Changelog feature coming soon!');
      }
    }
  }
  </script>
  
  <style scoped>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  section {
    animation: fadeIn 0.5s ease-out;
  }
  </style>