<template>
  <div class="guide-page bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen p-4 sm:p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-4xl sm:text-5xl font-bold mb-8 text-center text-blue-600 animate-fade-in">
        {{ $t('eventRecordingGuide') }}
      </h1>

      <!-- Table of Contents -->
      <nav class="mb-12 bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <h2 class="text-2xl font-semibold mb-4 text-blue-700">{{ $t('tableOfContents') }}</h2>
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <li v-for="section in sections" :key="section.id">
            <a :href="`#${section.id}`" class="text-blue-600 hover:text-blue-800 transition-colors duration-300">
              {{ $t(section.title) }}
            </a>
          </li>
        </ul>
      </nav>

      <!-- Dynamic Sections -->
      <section v-for="section in sections" :key="section.id" :id="section.id" class="mb-12 bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <h2 class="text-3xl font-semibold mb-4" :class="section.titleColor">{{ $t(section.title) }}</h2>
        <div v-html="$t(section.content)" class="text-lg text-gray-700 leading-relaxed"></div>
      </section>

      <!-- Interactive Demo -->
      <section class="mb-12 bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <h2 class="text-3xl font-semibold mb-4 text-green-700">{{ $t('interactiveDemo') }}</h2>
        <div class="flex flex-col space-y-4">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">{{ $t('inputMethod') }}:</label>
            <select v-model="inputMethod" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option value="basic">{{ $t('basic') }}</option>
              <option value="advanced">{{ $t('advanced') }}</option>
            </select>
          </div>

          <!-- Basic Input Method -->
          <div v-if="inputMethod === 'basic'">
            <div class="flex flex-wrap gap-2">
              <button v-for="player in players" :key="player" @click="selectPlayer(player)" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300">
                {{ player }}
              </button>
            </div>
            <div class="flex flex-wrap gap-2 mt-4">
              <button v-for="action in actions" :key="action" @click="selectAction(action)" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300">
                {{ $t(action) }}
              </button>
            </div>
            <div class="flex flex-wrap gap-2 mt-4">
              <button v-for="result in results" :key="result" @click="selectResult(result)" class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-300">
                {{ $t(result) }}
              </button>
            </div>
          </div>

          <!-- Advanced Input Method -->
          <div v-else class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ $t('player') }}:</label>
              <select v-model="selectedPlayer" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option v-for="player in players" :key="player" :value="player">{{ player }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ $t('action') }}:</label>
              <select v-model="selectedAction" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option v-for="action in actions" :key="action" :value="action">{{ action }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ $t('type') }}:</label>
              <input v-model="actionType" type="text" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" :placeholder="$t('typePlaceholder')">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ $t('evaluation') }}:</label>
              <select v-model="evaluation" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option value="perfect">{{ $t('perfect') }}</option>
                <option value="good">{{ $t('good') }}</option>
                <option value="ok">{{ $t('ok') }}</option>
                <option value="poor">{{ $t('poor') }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ $t('result') }}:</label>
              <select v-model="selectedResult" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option v-for="result in results" :key="result" :value="result">{{ $t(result) }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ $t('target') }}:</label>
              <input v-model="target" type="text" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" :placeholder="$t('targetPlaceholder')">
            </div>
          </div>

          <div class="mt-4 p-4 bg-gray-100 rounded">
            <h3 class="font-semibold text-lg mb-2">{{ $t('selectedEvent') }}:</h3>
            <p v-if="inputMethod === 'basic'">{{ selectedPlayer }} - {{ $t(selectedAction) }} - {{ $t(selectedResult) }}</p>
            <div v-else>
              <p><strong>{{ $t('player') }}:</strong> {{ selectedPlayer }}</p>
              <p><strong>{{ $t('action') }}:</strong> {{ $t(selectedAction) }}</p>
              <p><strong>{{ $t('type') }}:</strong> {{ actionType }}</p>
              <p><strong>{{ $t('evaluation') }}:</strong> {{ $t(evaluation) }}</p>
              <p><strong>{{ $t('result') }}:</strong> {{ $t(selectedResult) }}</p>
              <p><strong>{{ $t('target') }}:</strong> {{ target }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  name: 'EventRecordingGuide',
  setup() {
    const { t } = useI18n();

    return {
      sections: [
        {
          id: 'introduction',
          title: 'introduction',
          titleColor: 'text-blue-700',
          content: 'introductionContent'
        },
        {
          id: 'accessing-event-input',
          title: 'accessingEventInput',
          titleColor: 'text-green-700',
          content: 'accessingEventInputContent'
        },
        {
          id: 'basic-input-method',
          title: 'basicInputMethod',
          titleColor: 'text-yellow-700',
          content: 'basicInputMethodContent'
        },
        {
          id: 'advanced-input-method',
          title: 'advancedInputMethod',
          titleColor: 'text-purple-700',
          content: 'advancedInputMethodContent'
        },
        {
          id: 'recording-specific-events',
          title: 'recordingSpecificEvents',
          titleColor: 'text-red-700',
          content: 'recordingSpecificEventsContent'
        },
        {
          id: 'tips-for-accurate-recording',
          title: 'tipsForAccurateRecording',
          titleColor: 'text-indigo-700',
          content: 'tipsForAccurateRecordingContent'
        }
      ],
      players: ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5', 'Player 6'],
      actions: ['serve', 'receive', 'set', 'spike', 'block', 'dig'],
      results: ['point', 'error', 'continue'],
      inputMethod: 'basic',
      selectedPlayer: '',
      selectedAction: '',
      selectedResult: '',
      actionType: '',
      evaluation: '',
      target: '',
      t
    };
  },
  methods: {
    selectPlayer(player) {
      this.selectedPlayer = player;
    },
    selectAction(action) {
      this.selectedAction = action;
    },
    selectResult(result) {
      this.selectedResult = result;
    }
  }
};
</script>


<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

section {
  animation: fadeIn 0.5s ease-out;
}

.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .guide-page {
    padding: 2rem 1rem;
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
  }
}
</style>