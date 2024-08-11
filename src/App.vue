<template>
  <div id="app" class="min-h-screen flex flex-col bg-gray-100" :dir="direction">
    <header class="bg-blue-600 text-white shadow-md">
      <div class="container mx-auto px-4">
        <nav class="flex items-center justify-between flex-wrap py-4">
          <div class="flex items-center flex-shrink-0 mr-6">
            <img src="@/assets/logo.png" alt="Volley Insights Logo" class="w-8 h-8 mr-2">
            <span class="font-semibold text-xl">{{ $t('appName') }}</span>
          </div>
          <div class="block lg:hidden">
            <button @click="toggleMenu" class="flex items-center px-3 py-2 border rounded text-white border-white hover:text-blue-200 hover:border-blue-200">
              <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <title>{{ $t('menu') }}</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
              </svg>
            </button>
          </div>
          <div :class="{'hidden': !isMenuOpen, 'block': isMenuOpen}" class="w-full flex-grow lg:flex lg:items-center lg:w-auto">
            <div class="text-sm lg:flex-grow">
              <router-link v-for="(link, index) in navLinks" :key="index" :to="link.path" 
                           class="block mt-4 lg:inline-block lg:mt-0 hover:text-blue-200 mr-4" 
                           active-class="font-bold text-blue-200">
                {{ $t(link.name) }}
              </router-link>
            </div>
            <div class="mt-4 lg:mt-0 lg:ml-auto">
              <select v-model="$i18n.locale" @change="handleLanguageChange" class="bg-blue-600 text-white border border-white rounded px-3 py-1">
                <option value="en">{{ $t('english') }}</option>
                <option value="fr">{{ $t('french') }}</option>
                <option value="ar">{{ $t('arabic') }}</option>
              </select>
            </div>
          </div>
        </nav>
      </div>
    </header>
    <main class="flex-grow container mx-auto mt-6 px-4 sm:px-6 lg:px-8">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </main>
    <footer class="bg-gray-800 text-white py-4 mt-8">
      <div class="container mx-auto text-center">
        <p>{{ $t('footerText', { year: new Date().getFullYear() }) }}</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'App',
  setup() {
    const { locale } = useI18n();
    const isMenuOpen = ref(false);
    const navLinks = [
      { name: 'home', path: '/' },
      { name: 'myTeam', path: '/team' },
      { name: 'createGame', path: '/create-game' },
      { name: 'results', path: '/results' },
      { name: 'about', path: '/about' }
    ];

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    const direction = computed(() => {
      return locale.value === 'ar' ? 'rtl' : 'ltr';
    });

    const handleLanguageChange = () => {
      document.documentElement.dir = direction.value;
      document.documentElement.lang = locale.value;
    };

    // Set initial direction and lang
    handleLanguageChange();

    return {
      isMenuOpen,
      navLinks,
      toggleMenu,
      direction,
      handleLanguageChange
    };
  }
}
</script>

<style>
/* Add these global styles */
body {
  transition: all 0.3s ease;
}

.rtl {
  direction: rtl;
  text-align: right;
}

.ltr {
  direction: ltr;
  text-align: left;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
