<!-- SectionCustomizer.vue -->
<template>
    <div class="section-customizer">
      <button @click="openCustomizer" class="btn btn-blue flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
        </svg>
        {{ $t('customizeSections') }}
      </button>
      <transition name="modal">
        <div v-if="isCustomizerOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div class="p-6">
              <h3 class="text-lg font-semibold mb-4">{{ $t('customizeSections') }}</h3>
              <div class="space-y-3">
                <div v-for="section in sections" :key="section.id" class="flex items-center">
                  <label class="inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="sectionPreferences[section.id]" @change="updatePreferences" class="form-checkbox h-5 w-5 text-blue-600">
                    <span class="ml-2 text-gray-700">{{ $t(section.name) }}</span>
                  </label>
                </div>
              </div>
            </div>
            <div class="bg-gray-100 px-6 py-4 flex justify-end">
              <button @click="closeCustomizer" class="btn btn-blue">
                {{ $t('close') }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, watch } from 'vue';
  
  export default {
    name: 'SectionCustomizer',
    props: {
      gameId: {
        type: Number,
        required: true
      }
    },
    emits: ['update:preferences'],
    setup(props, { emit }) {
      const isCustomizerOpen = ref(false);
      const sectionPreferences = ref({});
      const sections = [
        { id: 'gameControls', name: 'gameControls' },
        { id: 'gameScoreboard', name: 'scoreboard' },
        { id: 'servingIndicator', name: 'servingTeamSwitch' },
        { id: 'eventInput', name: 'eventInput' },
        { id: 'playerSubstitution', name: 'substitution' },
        { id: 'rotationTracker', name: 'rotationTracker' },
        { id: 'playerStatistics', name: 'playerStatistics' },
        { id: 'recentEvents', name: 'recentEvents' }
      ];
  
      const initializePreferences = () => {
        const storedPreferences = localStorage.getItem(`game-${props.gameId}-section-preferences`);
        if (storedPreferences) {
          sectionPreferences.value = JSON.parse(storedPreferences);
        } else {
          // Set default visibility to true for all sections
          sections.forEach(section => {
            sectionPreferences.value[section.id] = true;
          });
        }
        updatePreferences();
      };
  
      onMounted(() => {
        initializePreferences();
      });
  
      const openCustomizer = () => {
        isCustomizerOpen.value = true;
      };
  
      const closeCustomizer = () => {
        isCustomizerOpen.value = false;
      };
  
      const updatePreferences = () => {
        localStorage.setItem(`game-${props.gameId}-section-preferences`, JSON.stringify(sectionPreferences.value));
        emit('update:preferences', sectionPreferences.value);
      };
  
      watch(sectionPreferences, () => {
        updatePreferences();
      }, { deep: true });
  
      return {
        isCustomizerOpen,
        sectionPreferences,
        sections,
        openCustomizer,
        closeCustomizer,
        updatePreferences
      };
    }
  };
  </script>
  <style scoped>
  .btn {
    @apply font-bold py-2 px-4 rounded transition duration-300 ease-in-out;
  }
  
  .btn-blue {
    @apply bg-blue-500 text-white;
  }
  
  .btn-blue:hover {
    @apply bg-blue-600;
  }
  
  .form-checkbox {
    @apply rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50;
  }
  
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }
  
  @media (max-width: 640px) {
    .fixed {
      @apply p-2;
    }
  }
  </style>
  