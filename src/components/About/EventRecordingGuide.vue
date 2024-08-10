<template>
    <div class="guide-page bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen p-4 sm:p-8">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-4xl sm:text-5xl font-bold mb-8 text-center text-blue-600 animate-fade-in">
          Event Recording Guide
        </h1>
  
        <!-- Table of Contents -->
        <nav class="mb-12 bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
          <h2 class="text-2xl font-semibold mb-4 text-blue-700">Table of Contents</h2>
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li v-for="section in sections" :key="section.id">
              <a :href="`#${section.id}`" class="text-blue-600 hover:text-blue-800 transition-colors duration-300">
                {{ section.title }}
              </a>
            </li>
          </ul>
        </nav>
  
        <!-- Dynamic Sections -->
        <section v-for="section in sections" :key="section.id" :id="section.id" class="mb-12 bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
          <h2 class="text-3xl font-semibold mb-4" :class="section.titleColor">{{ section.title }}</h2>
          <div v-html="section.content" class="text-lg text-gray-700 leading-relaxed"></div>
        </section>
  
        <!-- Interactive Demo -->
        <section class="mb-12 bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
          <h2 class="text-3xl font-semibold mb-4 text-green-700">Interactive Demo</h2>
          <div class="flex flex-col space-y-4">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Input Method:</label>
              <select v-model="inputMethod" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option value="basic">Basic</option>
                <option value="advanced">Advanced</option>
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
                  {{ action }}
                </button>
              </div>
              <div class="flex flex-wrap gap-2 mt-4">
                <button v-for="result in results" :key="result" @click="selectResult(result)" class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-300">
                  {{ result }}
                </button>
              </div>
            </div>
  
            <!-- Advanced Input Method -->
            <div v-else class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Player:</label>
                <select v-model="selectedPlayer" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  <option v-for="player in players" :key="player" :value="player">{{ player }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Action:</label>
                <select v-model="selectedAction" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  <option v-for="action in actions" :key="action" :value="action">{{ action }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Type:</label>
                <input v-model="actionType" type="text" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" placeholder="e.g., float serve, jump serve">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Evaluation:</label>
                <select v-model="evaluation" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  <option value="perfect">Perfect</option>
                  <option value="good">Good</option>
                  <option value="ok">OK</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Result:</label>
                <select v-model="selectedResult" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  <option v-for="result in results" :key="result" :value="result">{{ result }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Target:</label>
                <input v-model="target" type="text" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" placeholder="Specify target area on the court">
              </div>
            </div>
  
            <div class="mt-4 p-4 bg-gray-100 rounded">
              <h3 class="font-semibold text-lg mb-2">Selected Event:</h3>
              <p v-if="inputMethod === 'basic'">{{ selectedPlayer }} - {{ selectedAction }} - {{ selectedResult }}</p>
              <div v-else>
                <p><strong>Player:</strong> {{ selectedPlayer }}</p>
                <p><strong>Action:</strong> {{ selectedAction }}</p>
                <p><strong>Type:</strong> {{ actionType }}</p>
                <p><strong>Evaluation:</strong> {{ evaluation }}</p>
                <p><strong>Result:</strong> {{ selectedResult }}</p>
                <p><strong>Target:</strong> {{ target }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'EventRecordingGuide',
    data() {
      return {
        sections: [
          {
            id: 'introduction',
            title: 'Introduction',
            titleColor: 'text-blue-700',
            content: `
              <p>Welcome to the Event Recording Guide for Volley Insights! This guide will help you accurately record volleyball events during a match, ensuring that your statistics are precise and meaningful. Remember, the key to successful event recording is to stay calm and take a moment to process what you've seen before inputting the data.</p>
            `
          },
          {
            id: 'accessing-event-input',
            title: 'Accessing the Event Input',
            titleColor: 'text-green-700',
            content: `
              <p>During a live game, you'll find the Event Input section on the main game screen. You can choose between Basic and Advanced input methods.</p>
            `
          },
          {
            id: 'basic-input-method',
            title: 'Basic Input Method',
            titleColor: 'text-yellow-700',
            content: `
              <ol class="list-decimal list-inside">
                <li class="mb-4"><strong>Select Player:</strong> Click on the button corresponding to the player who performed the action. The buttons display the players currently on the court in their rotation positions.</li>
                <li class="mb-4"><strong>Select Action:</strong> Choose from the following actions: serve, receive, set, spike, block, dig. Each action is color-coded for easy identification.</li>
                <li class="mb-4"><strong>Select Result:</strong> Choose the outcome: point, error, or continue. The result buttons are color-coded: green for point, red for error, and orange for continue.</li>
              </ol>
            `
          },
          {
            id: 'advanced-input-method',
            title: 'Advanced Input Method',
            titleColor: 'text-purple-700',
            content: `
              <p>In the advanced input, you'll have dropdown menus for more detailed event recording:</p>
              <ul class="list-disc list-inside">
                <li><strong>Player:</strong> Select the player who performed the action.</li>
                <li><strong>Action:</strong> Choose from serve, receive, set, spike, block, dig.</li>
                <li><strong>Type:</strong> Specifies the type of action (e.g., float serve, jump serve).</li>
                <li><strong>Evaluation:</strong> Rate the quality of the action (e.g., perfect, good, OK, poor).</li>
                <li><strong>Result:</strong> Indicate the outcome (point, error, continue).</li>
                <li><strong>Target:</strong> For certain actions, specify the target area on the court.</li>
              </ul>
            `
          },
          {
            id: 'recording-specific-events',
            title: 'Recording Specific Events',
            titleColor: 'text-red-700',
            content: `
              <div class="space-y-8">
                <div>
                  <h3 class="text-2xl font-semibold mb-2 text-gray-800">Attacks</h3>
                  <p><strong>Definition:</strong> A strategic hit by a player with the intent of scoring a point.</p>
                  <p><strong>When to record:</strong> Any time a player attempts to score with an aggressive hit.</p>
                  <p><strong>How to record:</strong></p>
                  <ol class="list-decimal list-inside">
                    <li>Select the attacking player.</li>
                    <li>Choose "spike" as the action.</li>
                    <li>In advanced mode, select the type of attack (e.g., power, off-speed, tip).</li>
                    <li>Choose the result:
                      <ul class="list-disc list-inside ml-4">
                        <li>Point: If the attack directly leads to a point (kill).</li>
                        <li>Error: If the attack results in a point for the opposing team.</li>
                        <li>Continue: If the ball stays in play.</li>
                      </ul>
                    </li>
                    <li>In advanced mode, evaluate the quality of the attack and specify the target area.</li>
                  </ol>
                </div>
                
                <div>
                  <h3 class="text-2xl font-semibold mb-2 text-gray-800">Setting</h3>
                  <p><strong>Definition:</strong> When a player passes, sets, or digs a ball to a teammate who attempts an attack.</p>
                  <p><strong>When to record:</strong> Any time a player sets up an attack for a teammate.</p>
                  <p><strong>How to record:</strong></p>
                  <ol class="list-decimal list-inside">
                    <li>Select the setting player.</li>
                    <li>Choose "set" as the action.</li>
                    <li>In advanced mode, select the type of set (e.g., front, back, jump).</li>
                    <li>Choose the result:
                      <ul class="list-disc list-inside ml-4">
                        <li>Continue: Most sets will result in "continue" unless there's an error.</li>
                        <li>Error: If there's a double hit, lift, or other violation.</li>
                      </ul>
                    </li>
                    <li>In advanced mode, evaluate the quality of the set and specify the target area.</li>
                  </ol>
                </div>
  
                <div>
                  <h3 class="text-2xl font-semibold mb-2 text-gray-800">Serving</h3>
                  <p><strong>Definition:</strong> The initial hit to start a rally.</p>
                  <p><strong>When to record:</strong> Every time a player serves the ball.</p>
                  <p><strong>How to record:</strong></p>
                  <ol class="list-decimal list-inside">
                    <li>Select the serving player.</li>
                    <li>Choose "serve" as the action.</li>
                    <li>In advanced mode, select the type of serve (e.g., float, jump, topspin).</li>
                    <li>Choose the result:
                      <ul class="list-disc list-inside ml-4">
                        <li>Point: If it's an ace (the serve directly results in a point).</li>
                        <li>Error: If the serve fails to go over the net or lands out of bounds.</li>
                        <li>Continue: If the serve is received by the opposing team.</li>
                      </ul>
                    </li>
                    <li>In advanced mode, evaluate the quality of the serve and specify the target area.</li>
                  </ol>
                </div>
  
                <div>
                  <h3 class="text-2xl font-semibold mb-2 text-gray-800">Receiving</h3>
                  <p><strong>Definition:</strong> The first contact after the serve.</p>
                  <p><strong>When to record:</strong> Every time a player attempts to receive a serve.</p>
                  <p><strong>How to record:</strong></p>
                  <ol class="list-decimal list-inside">
                    <li>Select the receiving player.</li>
                    <li>Choose "receive" as the action.</li>
                    <li>In advanced mode, select the type of receive (e.g., forearm, overhead).</li>
                    <li>Choose the result:
                                            <ul class="list-disc list-inside ml-4">
                      <li>Error: If the reception results in a point for the serving team.</li>
                      <li>Continue: If the ball is kept in play.</li>
                    </ul>
                  </li>
                  <li>In advanced mode, evaluate the quality of the reception.</li>
                </ol>
              </div>

              <div>
                <h3 class="text-2xl font-semibold mb-2 text-gray-800">Defense/Digs</h3>
                <p><strong>Definition:</strong> When a player successfully keeps an attacked ball in play.</p>
                <p><strong>When to record:</strong> Any time a player digs an attacked ball.</p>
                <p><strong>How to record:</strong></p>
                <ol class="list-decimal list-inside">
                  <li>Select the digging player.</li>
                  <li>Choose "dig" as the action.</li>
                  <li>In advanced mode, select the type of dig (e.g., forearm, overhead, dive).</li>
                  <li>Choose the result:
                    <ul class="list-disc list-inside ml-4">
                      <li>Continue: If the ball is kept in play.</li>
                      <li>Error: Rare, but if there's a ball handling error on the dig.</li>
                    </ul>
                  </li>
                  <li>In advanced mode, evaluate the quality of the dig.</li>
                </ol>
              </div>

              <div>
                <h3 class="text-2xl font-semibold mb-2 text-gray-800">Blocking</h3>
                <p><strong>Definition:</strong> An attempt by one or more players to intercept the ball coming from the opponent's attack.</p>
                <p><strong>When to record:</strong> Any time a player or players attempt to block an attack.</p>
                <p><strong>How to record:</strong></p>
                <ol class="list-decimal list-inside">
                  <li>Select the blocking player(s).</li>
                  <li>Choose "block" as the action.</li>
                  <li>In advanced mode, select the type of block (e.g., stuff, soft).</li>
                  <li>Choose the result:
                    <ul class="list-disc list-inside ml-4">
                      <li>Point: If the block directly results in a point.</li>
                      <li>Error: If the blocker commits a violation (e.g., net touch, centerline fault).</li>
                      <li>Continue: If the ball remains in play after the block attempt.</li>
                    </ul>
                  </li>
                  <li>In advanced mode, evaluate the quality of the block.</li>
                </ol>
              </div>
            </div>
          `,
        },
        {
          id: 'tips-for-accurate-recording',
          title: 'Tips for Accurate and Fast Event Recording',
          titleColor: 'text-indigo-700',
          content: `
            <ul class="list-disc list-inside">
              <li>Familiarize yourself with the interface: Practice using both the basic and advanced input methods before an actual game.</li>
              <li>Use the basic input method for speed: For most plays, the 3-step process (select player, action, result) is fastest. Only use advanced input when you need to capture more detailed information.</li>
              <li>Stay focused on the game: Watch each play carefully and process what you've seen before inputting. Don't get distracted by the app - keep your eyes on the court.</li>
              <li>Use the color-coding to your advantage: Player buttons, action types, and results are color-coded for quick identification. Train your eye to recognize these colors for faster input.</li>
              <li>Record events immediately: Input each event as soon as the play ends. Don't wait to record multiple events at once, as this can lead to errors.</li>
              <li>Utilize keyboard shortcuts (if available): Learn any keyboard shortcuts for common actions to speed up input.</li>
              <li>Prioritize accuracy over speed: It's better to take an extra second to ensure accuracy than to input incorrect data.</li>
              <li>Use the undo/redo function: If you make a mistake, quickly use the undo function to correct it.</li>
              <li>Take advantage of timeouts: Use timeouts to double-check recent entries and make any necessary corrections.</li>
              <li>Practice, practice, practice: The more you use the app, the faster and more accurate you'll become. Consider doing "dry runs" with recorded matches to improve your speed and accuracy.</li>
              <li>Know the common pitfalls: Be aware of tricky situations like distinguishing between kills and blocks on overpasses. Pay attention to referee signals for official rulings on close calls.</li>
              <li>Communicate with your team: If possible, have someone call out the events as they happen to help you record more quickly.</li>
              <li>Use the rotation tracker: Keep the rotation tracker updated to quickly select the correct player for each event.</li>
              <li>Understand volleyball rules and statistics: A solid understanding of the game will help you make quick, accurate decisions when recording events.</li>
              <li>Stay calm and focused: Remember the golden rule: RELAX! Take a deep breath if you feel overwhelmed.</li>
            </ul>
          `
        }
      ],
      players: ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5', 'Player 6'],
      actions: ['Serve', 'Receive', 'Set', 'Spike', 'Block', 'Dig'],
      results: ['Point', 'Error', 'Continue'],
      inputMethod: 'basic',
      selectedPlayer: '',
      selectedAction: '',
      selectedResult: '',
      actionType: '',
      evaluation: '',
      target: ''
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