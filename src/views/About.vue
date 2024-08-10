<template>
  <div class="about-page bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen p-4 sm:p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-4xl sm:text-5xl font-bold mb-8 text-center text-blue-600 animate-fade-in">
        About Volley Insights
      </h1>

      <!-- App Description -->
      <section class="mb-12 bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <h2 class="text-3xl font-semibold mb-4 text-blue-700">What is Volley Insights?</h2>
        <p class="text-lg text-gray-700 mb-4 leading-relaxed">
          Volley Insights is a cutting-edge volleyball match analysis app, developed as part of an innovative PhD project at Tissemsilt University. Our mission is to revolutionize how volleyball games are recorded, analyzed, and understood.
        </p>
        <p class="text-lg text-gray-700 leading-relaxed">
          Whether you're coaching a professional team or leading an amateur club, Volley Insights provides the tools you need to gain a competitive edge and elevate your game strategy.
        </p>
      </section>

      <!-- Video Tutorial -->
      <section class="mb-12 bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <h2 class="text-3xl font-semibold mb-4 text-green-700">Quick Start Video Tutorial</h2>
        <p class="text-lg text-gray-700 mb-4 leading-relaxed">
          Get up to speed with Volley Insights in just a few minutes. Our comprehensive video tutorial walks you through all the key features and functionalities.
        </p>
        <div class="w-full" style="height: 500px;">
          <iframe 
            src="https://www.youtube.com/embed/HrdCEpsJ67o" 
            frameborder="0" 
            allow="autoplay; encrypted-media" 
            allowfullscreen
            class="w-full h-full"
          ></iframe>
        </div>
      </section>

      <!-- Key Features -->
      <section class="mb-12 bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <h2 class="text-3xl font-semibold mb-6 text-yellow-600">Key Features</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="feature in features" :key="feature.title" 
               class="feature-card p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow transition-all duration-300 hover:shadow-md hover:scale-105">
            <i :class="['fas', feature.icon, 'text-3xl', 'mb-3', 'text-blue-500']"></i>
            <h3 class="font-semibold text-xl mb-2 text-gray-800">{{ feature.title }}</h3>
            <p class="text-gray-700">{{ feature.text }}</p>
          </div>
        </div>
      </section>

      <!-- Our Team -->
      <section class="mb-12 bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <h2 class="text-3xl font-semibold mb-6 text-purple-700">Our Team</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="member in teamMembers" :key="member.name" class="team-member-card p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow transition-all duration-300 hover:shadow-md hover:scale-105">
            <img :src="member.image" :alt="member.name" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover">
            <h3 class="font-semibold text-xl mb-2 text-gray-800">{{ member.name }}</h3>
            <p class="text-gray-600 mb-2">{{ member.role }}</p>
            <p class="text-gray-700">{{ member.description }}</p>
          </div>
        </div>
      </section>

      <!-- Guide Section -->
      <section class="mb-12 bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <h2 class="text-3xl font-semibold mb-6 text-indigo-700">Guides</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div v-for="guide in guides" :key="guide.title" class="guide-card p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow transition-all duration-300 hover:shadow-md hover:scale-105">
            <h3 class="font-semibold text-xl mb-2 text-gray-800">{{ guide.title }}</h3>
            <p class="text-gray-700 mb-4">{{ guide.description }}</p>
            <button class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300" @click="showGuide(guide)">
              Read Guide
            </button>
          </div>
        </div>
      </section>

      <!-- Version Info -->
      <section class="mb-12 bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <h2 class="text-3xl font-semibold mb-4 text-blue-700">Version Information</h2>
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <p class="text-lg text-gray-700 mb-2">
              <strong>Current Version:</strong> {{ appVersion }}
            </p>
            <p class="text-lg text-gray-700">
              <strong>Last Updated:</strong> {{ lastUpdated }}
            </p>
          </div>
          <button @click="showChangeLog" class="mt-4 sm:mt-0 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105 text-lg">
            View Changelog
          </button>
        </div>
      </section>

      <!-- Contact Information -->
      <section class="mb-12 bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <h2 class="text-3xl font-semibold mb-6 text-red-700">Get in Touch</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <a href="mailto:salahallioui32000@gmai.com" class="contact-link">
            <i class="fas fa-envelope text-3xl mb-2"></i>
            <span>salahallioui32000@gmai.com</span>
          </a>
          <a href="https://volley-insights.vercel.app/" target="_blank" rel="noopener noreferrer" class="contact-link">
            <i class="fas fa-globe text-3xl mb-2"></i>
            <span>www.volleyinsights.com</span>
          </a>
          <a href="https://twitter.com/VolleyInsights" target="_blank" rel="noopener noreferrer" class="contact-link">
            <i class="fab fa-twitter text-3xl mb-2"></i>
            <span>@VolleyInsights</span>
          </a>
        </div>
      </section>

      <!-- Guide Modal -->
      <div v-if="selectedGuide" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full relative overflow-y-auto max-h-screen">
          <button @click="closeGuide" class="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
            <i class="fas fa-times text-2xl"></i>
          </button>
          <h2 class="text-2xl font-semibold mb-4 text-blue-700">{{ selectedGuide.title }}</h2>
          <p class="text-lg text-gray-700 mb-4 leading-relaxed">{{ selectedGuide.description }}</p>
          <component :is="selectedGuide.component" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventRecordingGuide from '@/components/About/EventRecordingGuide.vue';

export default {
  name: 'AboutView',
  components: {
    EventRecordingGuide
  },
  data() {
    return {
      appVersion: '2.1.0',
      lastUpdated: 'August 10, 2024',
      selectedGuide: null,
      features: [
        { icon: 'fa-clock', title: 'Real-time Tracking', text: 'Record game events as they happen with our intuitive interface.' },
        { icon: 'fa-chart-bar', title: 'Advanced Analytics', text: 'Gain deep insights with our comprehensive performance analysis tools.' },
        { icon: 'fa-sync', title: 'Rotation Management', text: 'Easily manage and track player rotations throughout the game.' },
        { icon: 'fa-users', title: 'Team Profiles', text: 'Create and customize detailed profiles for your teams and players.' },
        { icon: 'fa-file-export', title: 'Data Export', text: 'Share and analyze your game data with easy export options.' },
        { icon: 'fa-mobile-alt', title: 'Mobile Friendly', text: 'Access Volley Insights on any device with our responsive design.' }
      ],
      teamMembers: [
        { 
          name: 'SALAH DINE ALIOUI', 
          role: 'PhD Student & Developer', 
          image: require('@/assets/salah.jpg'),
          description: 'Creator and lead developer of Volley Insights, passionate about volleyball and data analysis.' 
        },
        { 
          name: 'Prof. Benrabeh Kheireddine', 
          role: 'PhD Supervisor', 
          image: require('@/assets/Benrabehkhayreddine.jpg'),
          description: 'Guiding the research and development process with expertise in sports science and data analytics.' 
        },
        { 
          name: 'Dr.Bennadja Mohamed', 
          role: 'Assistant Supervisor', 
          image: require('@/assets/BEn.jpg'),
          description: 'Supporting the project with specialized knowledge in volleyball tactics and performance analysis.' 
        }
      ],
      guides: [
        { 
          id: 'event-recording', 
          title: 'Event Recording Guide', 
          description: 'Learn how to accurately record game events for optimal analysis.', 
          component: 'EventRecordingGuide' 
        },
        { 
          id: 'stats-explanation', 
          title: 'Statistics Guide', 
          description: 'Understand the various statistics provided by Volley Insights and how to interpret them.', 
          component: 'StatsGuide' // Placeholder for another guide component
        }
      ]
    }
  },
  methods: {
    showChangeLog() {
      // Implement changelog display logic here
      alert('Changelog feature coming soon!');
    },
    showGuide(guide) {
      this.selectedGuide = guide;
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    },
    closeGuide() {
      this.selectedGuide = null;
      document.body.style.overflow = 'auto'; // Re-enable background scrolling
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

.contact-link {
  @apply flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg text-blue-500 hover:text-blue-600 transition duration-300 hover:bg-gray-100;
}

.feature-card, .team-member-card, .guide-card {
  @apply flex flex-col items-center text-center;
}

.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

.fixed {
  overflow-y: auto;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .about-page {
    padding: 2rem 1rem;
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  .feature-card, .team-member-card, .guide-card {
    padding: 1rem;
  }

  .contact-link {
    padding: 1rem;
  }
}
</style>
