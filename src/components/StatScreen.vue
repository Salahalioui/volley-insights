<template>
  <div class="stat-screen p-4 sm:p-6 bg-gray-100 rounded-lg shadow-md max-w-4xl mx-auto">
    <h2 class="text-3xl font-bold mb-6 text-gray-800 text-center">
      Game Statistics
    </h2>

    <!-- Filter Section (Tabs) -->
    <div class="filter-section flex space-x-4 mb-4">
      <button
        @click="setActiveTab('set')"
        :class="{ 'active': activeTab === 'set' }"
        class="px-4 py-2 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Set Stats
      </button>
      <button
        @click="setActiveTab('game')"
        :class="{ 'active': activeTab === 'game' }"
        class="px-4 py-2 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Game Stats
      </button>
    </div>

    <!-- Game Summary Section -->
    <div v-if="activeTab === 'game'" class="game-summary mb-6">
      <button @click="toggleSection('gameSummary')" class="section-header">
        <h3 class="text-lg font-semibold">Game Summary</h3>
        <i
          :class="['fas', gameSummaryOpen ? 'fa-chevron-up' : 'fa-chevron-down']"
        ></i>
      </button>
      <div
        v-if="gameSummaryOpen"
        class="section-content bg-white p-4 rounded-md shadow-sm"
      >
        <p><strong>Game Name:</strong> {{ game.name }}</p>
        <p><strong>Opponent:</strong> {{ game.opponentTeam }}</p>
        <p><strong>Date:</strong> {{ formatDate(game.date) }}</p>
        <p>
          <strong>Sets Won:</strong> {{ game.setsWon.team }} -
          {{ game.setsWon.opponent }}
        </p>
      </div>
    </div>

    <!-- Team Stats Section -->
    <div
      v-if="activeTab === 'set' || activeTab === 'game'"
      class="team-stats mb-6"
    >
      <button @click="toggleSection('teamStats')" class="section-header">
        <h3 class="text-lg font-semibold">Team Stats</h3>
        <i
          :class="['fas', teamStatsOpen ? 'fa-chevron-up' : 'fa-chevron-down']"
        ></i>
      </button>
      <div
        v-if="teamStatsOpen"
        class="section-content bg-white p-4 rounded-md shadow-sm"
      >
        <table
          class="w-full table-auto border-collapse border border-gray-300"
        >
          <thead>
            <tr>
              <th class="px-4 py-2 text-left border border-gray-300">
                Stat Category
              </th>
              <th class="px-4 py-2 text-left border border-gray-300">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-gray-100">
              <td class="px-4 py-2 border border-gray-300">Total Points</td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getTeamTotalPoints(currentSetNumber) }}
              </td>
            </tr>
            <tr>
              <td class="px-4 py-2 border border-gray-300">Total Errors</td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getTeamTotalErrors(currentSetNumber) }}
              </td>
            </tr>
            <tr class="bg-gray-100">
              <td class="px-4 py-2 border border-gray-300">
                Serve Efficiency
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getTeamServeEfficiency(currentSetNumber).toFixed(2) }}
              </td>
            </tr>
            <tr>
              <td class="px-4 py-2 border border-gray-300">
                Attack Efficiency
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getTeamAttackEfficiency(currentSetNumber).toFixed(2) }}
              </td>
            </tr>
            <tr class="bg-gray-100">
              <td class="px-4 py-2 border border-gray-300">
                Block Efficiency
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getTeamBlockEfficiency(currentSetNumber).toFixed(2) }}
              </td>
            </tr>
            <tr>
              <td class="px-4 py-2 border border-gray-300">
                Side Out Percentage
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getTeamSideOutPercentage(currentSetNumber).toFixed(2) }}
              </td>
            </tr>
            <tr class="bg-gray-100">
              <td class="px-4 py-2 border border-gray-300">
                Break Point Percentage
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getTeamBreakPointPercentage(currentSetNumber).toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Rotation Effectiveness Table -->
        <table class="w-full table-auto mt-4">
          <thead>
            <tr>
              <th class="px-4 py-2 text-left border border-gray-300">
                Rotation (Player Names)
              </th>
              <th class="px-4 py-2 text-left border border-gray-300">
                Receive Effectiveness
              </th>
              <th class="px-4 py-2 text-left border border-gray-300">
                Block Effectiveness
              </th>
              <th class="px-4 py-2 text-left border border-gray-300">
                Attack Effectiveness
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(data, rotationKey) in getTeamRotationEffectiveness(
                currentSetNumber
              )"
              :key="rotationKey"
            >
              <td class="px-4 py-2 border border-gray-300">
                {{
                  rotationKey
                    .split("-")
                    .map(
                      (playerId, index) =>
                        `P${index + 1}: ${getPlayerName(parseInt(playerId))}`
                    )
                    .join(", ")
                }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ data.receiveEffectiveness }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ data.blockEffectiveness }}
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ data.attackEffectiveness }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Individual Player Stats Section -->
    <div class="player-stats mb-6">
      <h3 class="text-lg font-semibold mb-2">Individual Player Stats</h3>
      <select
        v-model="selectedPlayer"
        class="w-full p-2 border rounded-md mb-4"
      >
        <option
          v-for="player in game.playerDetails"
          :key="player.id"
          :value="player.id"
        >
          {{ player.name }}
        </option>
      </select>

      <div v-if="selectedPlayer">
        <!-- Basic Stats -->
        <button @click="toggleSection('basicStats')" class="section-header">
          <h3 class="text-lg font-semibold">Basic Stats</h3>
          <i
            :class="['fas', basicStatsOpen ? 'fa-chevron-up' : 'fa-chevron-down']"
          ></i>
        </button>
        <div
          v-if="basicStatsOpen"
          class="section-content bg-white p-4 rounded-md shadow-sm"
        >
          <table
            class="w-full table-auto border-collapse border border-gray-300"
          >
            <thead>
              <tr>
                <th class="px-4 py-2 text-left border border-gray-300">
                  Stat Category
                </th>
                <th class="px-4 py-2 text-left border border-gray-300">
                  Total Attempts
                </th>
                <th class="px-4 py-2 text-left border border-gray-300">
                  Points
                </th>
                <th class="px-4 py-2 text-left border border-gray-300">
                  Errors
                </th>
                <th class="px-4 py-2 text-left border border-gray-300">
                  Efficiency
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- Serve Stats -->
              <tr class="bg-gray-100">
                <td class="px-4 py-2 border border-gray-300">Serve</td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getServeStats(selectedPlayer, currentSetNumber).totalAttempts }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getServeStats(selectedPlayer, currentSetNumber).points }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getServeStats(selectedPlayer, currentSetNumber).errors }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{
                    getServeStats(selectedPlayer, currentSetNumber)
                      .efficiency.toFixed(2)
                  }}
                </td>
              </tr>

              <!-- Reception Stats -->
              <tr>
                <td class="px-4 py-2 border border-gray-300">Reception</td>
                <td class="px-4 py-2 border border-gray-300">
                  {{
                    getReceptionStats(selectedPlayer, currentSetNumber)
                      .totalAttempts
                  }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{
                    getReceptionStats(selectedPlayer, currentSetNumber).points
                  }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{
                    getReceptionStats(selectedPlayer, currentSetNumber).errors
                  }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{
                    getReceptionStats(selectedPlayer, currentSetNumber)
                      .efficiency.toFixed(2)
                  }}
                </td>
              </tr>

              <!-- Setting Stats -->
              <tr class="bg-gray-100">
                <td class="px-4 py-2 border border-gray-300">Setting</td>
                <td class="px-4 py-2 border border-gray-300">
                  {{
                    getSettingStats(selectedPlayer, currentSetNumber)
                      .totalAttempts
                  }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{
                    getSettingStats(selectedPlayer, currentSetNumber).points
                  }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{
                    getSettingStats(selectedPlayer, currentSetNumber).errors
                  }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{
                    getSettingStats(selectedPlayer, currentSetNumber)
                      .efficiency.toFixed(2)
                  }}
                </td>
              </tr>

              <!-- Attack Stats -->
              <tr>
                <td class="px-4 py-2 border border-gray-300">Attack</td>
                <td class="px-4 py-2 border border-gray-300">
                  {{
                    getAttackStats(selectedPlayer, currentSetNumber)
                      .totalAttempts
                  }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{
                    getAttackStats(selectedPlayer, currentSetNumber).points
                  }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{
                    getAttackStats(selectedPlayer, currentSetNumber).errors
                  }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{
                    getAttackStats(selectedPlayer, currentSetNumber)
                      .efficiency.toFixed(2)
                  }}
                </td>
              </tr>

              <!-- Block Stats -->
              <tr class="bg-gray-100">
                <td class="px-4 py-2 border border-gray-300">Block</td>
                <td class="px-4 py-2 border border-gray-300">
                  {{
                    getBlockStats(selectedPlayer, currentSetNumber)
                      .totalAttempts
                  }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getBlockStats(selectedPlayer, currentSetNumber).points }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getBlockStats(selectedPlayer, currentSetNumber).errors }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{
                    getBlockStats(selectedPlayer, currentSetNumber)
                      .efficiency.toFixed(2)
                  }}
                </td>
              </tr>

              <!-- Dig Stats -->
              <tr>
                <td class="px-4 py-2 border border-gray-300">Dig</td>
                <td class="px-4 py-2 border border-gray-300">
                  {{
                    getDigStats(selectedPlayer, currentSetNumber).totalAttempts
                  }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{
                    getDigStats(selectedPlayer, currentSetNumber).validAttempts
                  }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getDigStats(selectedPlayer, currentSetNumber).errors }}
                </td>
                <td class="px-4 py-2 border border-gray-300">-</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Advanced Stats (Only if Advanced Input is Used) -->
        <div v-if="game.inputMethod === 'advanced'" class="advanced-stats">
  <button @click="toggleSection('advancedStats')" class="section-header">
    <h3 class="text-lg font-semibold">Advanced Stats</h3>
    <i :class="['fas', advancedStatsOpen ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
  </button>
  <div v-if="advancedStatsOpen" class="section-content bg-white p-4 rounded-md shadow-sm">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Serve Advanced Stats -->
      <div class="stat-group">
        <h4 class="text-md font-medium mb-2">
          <i class="fas fa-volleyball-ball mr-2"></i>Serve
        </h4>
        <div class="stat-card">
          <h5>Ace Serve Percentage</h5>
          <div class="progress-bar" :style="{ width: getAdvancedServeStats(selectedPlayer, currentSetNumber).aceServePercentage + '%' }"></div>
          <p class="stat-value">{{ getAdvancedServeStats(selectedPlayer, currentSetNumber).aceServePercentage.toFixed(2) }}%</p>
        </div>
        <div class="stat-card">
          <h5>Valid Serve Percentage</h5>
          <div class="progress-bar" :style="{ width: getAdvancedServeStats(selectedPlayer, currentSetNumber).validServePercentage + '%' }"></div>
          <p class="stat-value">{{ getAdvancedServeStats(selectedPlayer, currentSetNumber).validServePercentage.toFixed(2) }}%</p>
        </div>
        
        <!-- Points per Serve Type -->
        <div v-if="Object.keys(getAdvancedServeStats(selectedPlayer, currentSetNumber).typePerPoint).length > 0" class="stat-card">
          <h5>Points per Serve Type</h5>
          <ul>
            <li v-for="(points, type) in getAdvancedServeStats(selectedPlayer, currentSetNumber).typePerPoint" :key="type">
              {{ type }}: {{ points }} point{{ points > 1 ? 's' : '' }}
            </li>
          </ul>
        </div>
        
        <!-- Points per Serve Target -->
        <div v-if="Object.keys(getAdvancedServeStats(selectedPlayer, currentSetNumber).targetPerPoint).length > 0" class="stat-card">
          <h5>Points per Serve Target</h5>
          <ul>
            <li v-for="(data, target) in getAdvancedServeStats(selectedPlayer, currentSetNumber).targetPerPoint" :key="target">
              {{ target }}: {{ data.points }} / {{ data.attempts }} ({{ (data.percentage * 100).toFixed(2) }}%)
            </li>
          </ul>
        </div>
      </div>

      <!-- Reception Advanced Stats -->
      <div class="stat-group">
        <h4 class="text-md font-medium mb-2">
          <i class="fas fa-hands mr-2"></i>Reception
        </h4>
        <div class="stat-card">
          <h5>Valid Reception Percentage</h5>
          <div class="progress-bar" :style="{ width: getAdvancedReceptionStats(selectedPlayer, currentSetNumber).validReceptionPercentage + '%' }"></div>
          <p class="stat-value">{{ getAdvancedReceptionStats(selectedPlayer, currentSetNumber).validReceptionPercentage.toFixed(2) }}%</p>
        </div>
      </div>

      <!-- Setting Advanced Stats -->
      <div class="stat-group">
        <h4 class="text-md font-medium mb-2">
          <i class="fas fa-hand-point-up mr-2"></i>Setting
        </h4>
        <div class="stat-card">
          <h5>Successful Set Percentage</h5>
          <div class="progress-bar" :style="{ width: getAdvancedSettingStats(selectedPlayer, currentSetNumber).successfulSetPercentage + '%' }"></div>
          <p class="stat-value">{{ getAdvancedSettingStats(selectedPlayer, currentSetNumber).successfulSetPercentage.toFixed(2) }}%</p>
        </div>
        
        <!-- Set Target Distribution -->
        <div v-if="Object.keys(getAdvancedSettingStats(selectedPlayer, currentSetNumber).setTargetDistribution).length > 0" class="stat-card">
          <h5>Set Target Distribution</h5>
          <ul>
            <li v-for="(count, target) in getAdvancedSettingStats(selectedPlayer, currentSetNumber).setTargetDistribution" :key="target">
              {{ target }}: {{ count }} set{{ count > 1 ? 's' : '' }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Attack Advanced Stats -->
      <div class="stat-group">
        <h4 class="text-md font-medium mb-2">
          <i class="fas fa-fist-raised mr-2"></i>Attack
        </h4>
        <div class="stat-card">
          <h5>Kill Percentage</h5>
          <div class="progress-bar" :style="{ width: getAdvancedAttackStats(selectedPlayer, currentSetNumber).killPercentage + '%' }"></div>
          <p class="stat-value">{{ getAdvancedAttackStats(selectedPlayer, currentSetNumber).killPercentage.toFixed(2) }}%</p>
        </div>
        <div class="stat-card">
          <h5>Valid Attack Percentage</h5>
          <div class="progress-bar" :style="{ width: getAdvancedAttackStats(selectedPlayer, currentSetNumber).validAttackPercentage + '%' }"></div>
          <p class="stat-value">{{ getAdvancedAttackStats(selectedPlayer, currentSetNumber).validAttackPercentage.toFixed(2) }}%</p>
        </div>
        
        <!-- Points per Attack Type -->
        <div v-if="Object.keys(getAdvancedAttackStats(selectedPlayer, currentSetNumber).typePerPoint).length > 0" class="stat-card">
          <h5>Points per Attack Type</h5>
          <ul>
            <li v-for="(points, type) in getAdvancedAttackStats(selectedPlayer, currentSetNumber).typePerPoint" :key="type">
              {{ type }}: {{ points }} point{{ points > 1 ? 's' : '' }}
            </li>
          </ul>
        </div>
        
        <!-- Points per Attack Target -->
        <div v-if="Object.keys(getAdvancedAttackStats(selectedPlayer, currentSetNumber).targetPerPoint).length > 0" class="stat-card">
          <h5>Points per Attack Target</h5>
          <ul>
            <li v-for="(data, target) in getAdvancedAttackStats(selectedPlayer, currentSetNumber).targetPerPoint" :key="target">
              {{ target }}: {{ data.points }} / {{ data.attempts }} ({{ (data.percentage * 100).toFixed(2) }}%)
            </li>
          </ul>
        </div>
      </div>

      <!-- Block Advanced Stats -->
      <div class="stat-group">
        <h4 class="text-md font-medium mb-2">
          <i class="fas fa-shield-alt mr-2"></i>Block
        </h4>
        <div class="stat-card">
          <h5>Block Efficiency</h5>
          <div class="progress-bar" :style="{ width: getBlockStats(selectedPlayer, currentSetNumber).efficiency + '%' }"></div>
          <p class="stat-value">{{ getBlockStats(selectedPlayer, currentSetNumber).efficiency.toFixed(2) }}</p>
        </div>
      </div>

      <!-- Dig Advanced Stats -->
      <div class="stat-group">
        <h4 class="text-md font-medium mb-2">
          <i class="fas fa-hand-paper mr-2"></i>Dig
        </h4>
        <!-- (No additional advanced stats for dig are included) -->
      </div>
    </div>
  </div>
</div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
    getPlayerName: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      activeTab: "set",
      selectedPlayer: null,
      rotationEffectiveness: {},
      gameSummaryOpen: true,
      teamStatsOpen: true,
      basicStatsOpen: true,
      advancedStatsOpen: true,
    };
  },
  computed: {
    currentSetNumber() {
      return this.activeTab === "set" ? this.game.currentSet : null; 
    },
  },
  mounted() {
    // Set selectedPlayer to the first player on mount
    if (this.game.playerDetails && this.game.playerDetails.length > 0) {
      this.selectedPlayer = this.game.playerDetails[0].id;
    }
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    },

    toggleSection(sectionName) {
      this[sectionName + "Open"] = !this[sectionName + "Open"];
    },

    // Generic stat calculation function
    calculateStatsForAction(playerId, action, setNumber = null) {
      let totalAttempts = 0;
      let points = 0;
      let errors = 0;
      let validAttempts = 0; // For actions like reception and dig

      const setsToProcess =
        setNumber !== null
          ? [this.game.sets[setNumber - 1]] // Get a specific set
          : this.game.sets; // Get all sets

      setsToProcess.forEach((set) => {
        set.events.forEach((event) => {
          if (event.player === playerId && event.action === action) {
            totalAttempts++;

            if (event.result === "point") {
              points++;
            } else if (event.result === "error") {
              errors++;
            }

            if (
              ["receive", "dig"].includes(action) &&
              event.result === "continue"
            ) {
              validAttempts++;
            }
          }
        });
      });

      const efficiency =
        totalAttempts > 0
          ? (points - errors) / totalAttempts // General efficiency calculation
          : 0;

      return { totalAttempts, points, errors, efficiency, validAttempts };
    },

    // Team Stats Calculations
    getTeamTotalPoints(setNumber = null) {
      let totalPoints = 0;
      const setsToProcess =
        setNumber !== null
          ? [this.game.sets[setNumber - 1]]
          : this.game.sets;

      setsToProcess.forEach((set) => {
        set.events.forEach((event) => {
          if (event.result === "point") {
            totalPoints++;
          }
        });
      });
      return totalPoints;
    },

    getTeamTotalErrors(setNumber = null) {
      let totalErrors = 0;
      const setsToProcess =
        setNumber !== null
          ? [this.game.sets[setNumber - 1]]
          : this.game.sets;

      setsToProcess.forEach((set) => {
        set.events.forEach((event) => {
          if (event.result === "error") {
            totalErrors++;
          }
        });
      });
      return totalErrors;
    },

    getTeamServeEfficiency(setNumber = null) {
      let totalServeAttempts = 0;
      let servePoints = 0;
      let serveContinues = 0;
      let serveErrors = 0;

      const setsToProcess =
        setNumber !== null
          ? [this.game.sets[setNumber - 1]]
          : this.game.sets;

      setsToProcess.forEach((set) => {
        set.events.forEach((event) => {
          if (event.action === "serve") {
            totalServeAttempts++;
            if (event.result === "point") {
              servePoints++;
            } else if (event.result === "continue") {
              serveContinues++;
            } else if (event.result === "error") {
              serveErrors++;
            }
          }
        });
      });

      return totalServeAttempts > 0
        ? (servePoints + serveContinues - serveErrors) / totalServeAttempts
        : 0;
    },

    getTeamAttackEfficiency(setNumber = null) {
      let totalAttackAttempts = 0;
      let attackPoints = 0;
      let attackErrors = 0;

      const setsToProcess =
        setNumber !== null
          ? [this.game.sets[setNumber - 1]]
          : this.game.sets;

      setsToProcess.forEach((set) => {
        set.events.forEach((event) => {
          if (event.action === "spike") {
            totalAttackAttempts++;
            if (event.result === "point") {
              attackPoints++;
            } else if (event.result === "error") {
              attackErrors++;
            }
          }
        });
      });

      return totalAttackAttempts > 0
        ? (attackPoints - attackErrors) / totalAttackAttempts
        : 0;
    },

    getTeamBlockEfficiency(setNumber = null) {
      let totalBlockAttempts = 0;
      let blockPoints = 0;
      let blockContinues = 0;
      let blockErrors = 0;

      const setsToProcess =
        setNumber !== null
          ? [this.game.sets[setNumber - 1]]
          : this.game.sets;

      setsToProcess.forEach((set) => {
        set.events.forEach((event) => {
          if (event.action === "block") {
            totalBlockAttempts++;
            if (event.result === "point") {
              blockPoints++;
            } else if (event.result === "continue") {
              blockContinues++;
            } else if (event.result === "error") {
              blockErrors++;
            }
          }
        });
      });

      return totalBlockAttempts > 0
        ? (blockPoints + blockContinues - blockErrors) / totalBlockAttempts
        : 0;
    },

    getTeamSideOutPercentage(setNumber = null) {
      let pointsWhenReceiving = 0;
      let totalTimesReceiving = 0;

      const setsToProcess =
        setNumber !== null
          ? [this.game.sets[setNumber - 1]]
          : this.game.sets;

      setsToProcess.forEach((set) => {
        set.events.forEach((event, index) => {
          // Check if opponent served the previous event
          const opponentServedPrevious =
            index > 0 && set.events[index - 1].result === "error";

          if (opponentServedPrevious && event.result === "point") {
            pointsWhenReceiving++;
          }

          if (opponentServedPrevious) {
            totalTimesReceiving++;
          }
        });
      });

      return totalTimesReceiving > 0
        ? pointsWhenReceiving / totalTimesReceiving
        : 0;
    },

    getTeamBreakPointPercentage(setNumber = null) {
      let pointsWhenServing = 0;
      let totalTimesServing = 0;

      const setsToProcess =
        setNumber !== null
          ? [this.game.sets[setNumber - 1]]
          : this.game.sets;

      setsToProcess.forEach((set) => {
        set.events.forEach((event, index) => {
          // Check if the team served the previous event
          const teamServedPrevious =
            index > 0 && set.events[index - 1].result === "point";

          if (teamServedPrevious && event.result === "point") {
            pointsWhenServing++;
          }

          if (teamServedPrevious) {
            totalTimesServing++;
          }
        });
      });

      return totalTimesServing > 0
        ? pointsWhenServing / totalTimesServing
        : 0;
    },

    getTeamRotationEffectiveness(setNumber = null) {
      const rotationEffectiveness = {};

      const setsToProcess =
        setNumber !== null
          ? [this.game.sets[setNumber - 1]]
          : this.game.sets;

      setsToProcess.forEach((set) => {
        set.events.forEach((event) => {
          if (event.rotation) {
            const rotationKey = event.rotation.join("-");

            if (!rotationEffectiveness[rotationKey]) {
              rotationEffectiveness[rotationKey] = {
                receiveSuccess: 0,
                blockSuccess: 0,
                attackSuccess: 0,
                receiveTotal: 0,
                blockTotal: 0,
                attackTotal: 0,
              };
            }

            // Track Reception Success
            if (
              event.action === "receive" &&
              (event.result === "continue" || event.result === "point")
            ) {
              rotationEffectiveness[rotationKey].receiveSuccess++;
            }
            if (event.action === "receive") {
              rotationEffectiveness[rotationKey].receiveTotal++;
            }

            // Track Block Success
            if (
              event.action === "block" &&
              (event.result === "point" || event.result === "continue")
            ) {
              rotationEffectiveness[rotationKey].blockSuccess++;
            }
            if (event.action === "block") {
              rotationEffectiveness[rotationKey].blockTotal++;
            }

            // Track Attack Success
            if (event.action === "spike" && event.result === "point") {
              rotationEffectiveness[rotationKey].attackSuccess++;
            }
            if (event.action === "spike") {
              rotationEffectiveness[rotationKey].attackTotal++;
            }
          }
        });
      });

      for (const rotation in rotationEffectiveness) {
        const data = rotationEffectiveness[rotation];
        data.receiveEffectiveness =
          data.receiveTotal > 0
            ? (data.receiveSuccess / data.receiveTotal).toFixed(2)
            : "-";
        data.blockEffectiveness =
          data.blockTotal > 0
            ? (data.blockSuccess / data.blockTotal).toFixed(2)
            : "-";
        data.attackEffectiveness =
          data.attackTotal > 0
            ? (data.attackSuccess / data.attackTotal).toFixed(2)
            : "-";
      }

      return rotationEffectiveness;
    },

    // Individual Player Stats Calculations
    getServeStats(playerId, setNumber = null) {
      return this.calculateStatsForAction(playerId, "serve", setNumber);
    },

    getReceptionStats(playerId, setNumber = null) {
      const stats = this.calculateStatsForAction(
        playerId,
        "receive",
        setNumber
      );
      stats.efficiency =
        stats.totalAttempts > 0
          ? stats.validAttempts / stats.totalAttempts
          : 0;
      return stats;
    },

    getSettingStats(playerId, setNumber = null) {
      return this.calculateStatsForAction(playerId, "set", setNumber);
    },

    getAttackStats(playerId, setNumber = null) {
      return this.calculateStatsForAction(playerId, "spike", setNumber);
    },

    getBlockStats(playerId, setNumber = null) {
      return this.calculateStatsForAction(playerId, "block", setNumber);
    },

    getDigStats(playerId, setNumber = null) {
      const stats = this.calculateStatsForAction(playerId, "dig", setNumber);
      stats.efficiency =
        stats.totalAttempts > 0
          ? stats.validAttempts / stats.totalAttempts
          : 0;
      return stats;
    },

    // Advanced Player Stats Calculations
    getAdvancedServeStats(playerId, setNumber = null) {
      let totalAttempts = 0;
      let points = 0;
      let errors = 0;
let perfectServes = 0;
let goodServes = 0;
let typePerPoint = {};
let targetPerPoint = {};

const setsToProcess =
  setNumber !== null
    ? [this.game.sets[setNumber - 1]]
    : this.game.sets;

setsToProcess.forEach((set) => {
  set.events.forEach((event) => {
    if (event.player === playerId && event.action === "serve") {
      totalAttempts++;
      if (event.result === "point") points++;
      if (event.result === "error") errors++;

      if (event.evaluation === "Perfect") perfectServes++;
      if (event.evaluation === "Good") goodServes++;

      if (event.result === "point" && event.type) {
        typePerPoint[event.type] = (typePerPoint[event.type] || 0) + 1;
      }

      if (event.result === "point" && event.target) {
        if (!targetPerPoint[event.target]) {
          targetPerPoint[event.target] = { points: 0, attempts: 0 };
        }
        targetPerPoint[event.target].points++;
      }

      if (event.target) {
        if (!targetPerPoint[event.target]) {
          targetPerPoint[event.target] = { points: 0, attempts: 0 };
        }
        targetPerPoint[event.target].attempts++;
      }
    }
  });
});

const aceServePercentage =
  totalAttempts > 0 ? ((points - errors) / totalAttempts) * 100 : 0;

const validServePercentage =
  totalAttempts > 0
    ? ((perfectServes + goodServes - errors) / totalAttempts) * 100
    : 0;



for (const target in targetPerPoint) {
  targetPerPoint[target].percentage =
    targetPerPoint[target].attempts > 0
      ? targetPerPoint[target].points / targetPerPoint[target].attempts
      : 0;
}

return {
  totalAttempts,
  points,
  errors,
  aceServePercentage,
  validServePercentage,
  typePerPoint,
  targetPerPoint,
};
},

getAdvancedReceptionStats(playerId, setNumber = null) {
let totalAttempts = 0;
let perfectReceptions = 0;
let goodReceptions = 0;
let errors = 0;

const setsToProcess =
  setNumber !== null
    ? [this.game.sets[setNumber - 1]]
    : this.game.sets;

setsToProcess.forEach((set) => {
  set.events.forEach((event) => {
    if (event.player === playerId && event.action === "receive") {
      totalAttempts++;
      if (event.evaluation === "Perfect") perfectReceptions++;
      if (event.evaluation === "Good") goodReceptions++;
      if (event.result === "error") errors++;
    }
  });
});

const validReceptionPercentage =
  totalAttempts > 0
    ? (perfectReceptions + goodReceptions - errors) / totalAttempts
    : 0;

return {
  totalAttempts,
  validReceptionPercentage,
};
},

getAdvancedSettingStats(playerId, setNumber = null) {
let totalAttempts = 0;
let perfectSets = 0;
let goodSets = 0;
let setTargetDistribution = {};

const setsToProcess =
  setNumber !== null
    ? [this.game.sets[setNumber - 1]]
    : this.game.sets;

setsToProcess.forEach((set) => {
  set.events.forEach((event) => {
    if (event.player === playerId && event.action === "set") {
      totalAttempts++;
      if (event.evaluation === "Perfect") perfectSets++;
      if (event.evaluation === "Good") goodSets++;

      // Set Target Distribution
      if (event.target) {
        setTargetDistribution[event.target] =
          (setTargetDistribution[event.target] || 0) + 1;
      }
    }
  });
});

const successfulSetPercentage =
  totalAttempts > 0 ? (perfectSets + goodSets) / totalAttempts : 0;

return {
  totalAttempts,
  successfulSetPercentage,
  setTargetDistribution,
};
},

getAdvancedAttackStats(playerId, setNumber = null) {
let totalAttempts = 0;
let points = 0;
let errors = 0;
let perfectAttacks = 0;
let goodAttacks = 0;
let typePerPoint = {};
let targetPerPoint = {};

const setsToProcess =
  setNumber !== null
    ? [this.game.sets[setNumber - 1]]
    : this.game.sets;

setsToProcess.forEach((set) => {
  set.events.forEach((event) => {
    if (event.player === playerId && event.action === "spike") {
      totalAttempts++;
      if (event.result === "point") points++;
      if (event.result === "error") errors++;

      if (event.evaluation === "Perfect") perfectAttacks++;
      if (event.evaluation === "Good") goodAttacks++;

      if (event.result === "point" && event.type) {
        typePerPoint[event.type] = (typePerPoint[event.type] || 0) + 1;
      }

      if (event.result === "point" && event.target) {
        if (!targetPerPoint[event.target]) {
          targetPerPoint[event.target] = { points: 0, attempts: 0 };
        }
        targetPerPoint[event.target].points++;
      }

      if (event.target) {
        if (!targetPerPoint[event.target]) {
          targetPerPoint[event.target] = { points: 0, attempts: 0 };
        }
        targetPerPoint[event.target].attempts++;
      }
    }
  });
});

const killPercentage =
  totalAttempts > 0 ? (points - errors) / totalAttempts : 0;
const validAttackPercentage =
  totalAttempts > 0
    ? (points + perfectAttacks + goodAttacks - errors) / totalAttempts
    : 0;

for (const target in targetPerPoint) {
  targetPerPoint[target].percentage =
    targetPerPoint[target].attempts > 0
      ? targetPerPoint[target].points / targetPerPoint[target].attempts
      : 0;
}

return {
  totalAttempts,
  points,
  errors,
  killPercentage,
  validAttackPercentage,
  typePerPoint,
  targetPerPoint,
};
},
},
};
</script>
<style scoped>
.advanced-stats .grid {
  display: grid;
  gap: 1rem;
}

.stat-group {
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}

.stat-card {
  background-color: white;
  border-radius: 0.25rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 0.5rem;
  background-color: #4CAF50;
  border-radius: 0.25rem;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-weight: bold;
  color: #333;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  margin-bottom: 0.25rem;
}
.filter-section button {
  background-color: #e2e8f0; /* Light gray */
  color: #4a5568; /* Dark gray */
  border: none;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.filter-section button:hover {
  background-color: #a0aec0; /* Medium gray */
  color: #fff; /* White */
}

.filter-section button.active {
  background-color: #4299e1; /* Blue */
  color: #fff; /* White */
}

.section-header {
  cursor: pointer; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem; /* Adjust as needed */
  border-bottom: 1px solid #e2e8f0;
}

.section-content {
  margin-top: 1rem; /* Adjust as needed */
}

table {
  width: 100%;
  table-layout: auto; 
  border-collapse: collapse;
  border: 1px solid #cbd5e0;
}

th, td {
  padding: 0.5rem 1rem; /* Adjust as needed */
  text-align: left;
  border: 1px solid #cbd5e0;
}

tbody tr:nth-child(even) {
  background-color: #f7fafc; /* Light gray */
}
</style>