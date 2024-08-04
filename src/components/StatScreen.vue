<template>
  <div class="stat-screen p-4 sm:p-6 bg-gray-100 rounded-lg shadow-md max-w-4xl mx-auto">
    <h2 class="text-3xl font-bold mb-6 text-gray-800 text-center">Game Statistics</h2>

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
        <i :class="['fas', gameSummaryOpen ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
      </button>
      <div v-if="gameSummaryOpen" class="section-content bg-white p-4 rounded-md shadow-sm">
        <p><strong>Game Name:</strong> {{ game.name }}</p>
        <p><strong>Opponent:</strong> {{ game.opponentTeam }}</p>
        <p><strong>Date:</strong> {{ formatDate(game.date) }}</p>
        <p>
          <strong>Sets Won:</strong> {{ game.setsWon.team }} - {{ game.setsWon.opponent }}
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
        <i :class="['fas', teamStatsOpen ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
      </button>
      <div v-if="teamStatsOpen" class="section-content bg-white p-4 rounded-md shadow-sm">
        <table class="w-full table-auto border-collapse border border-gray-300">
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
                {{ getTeamTotalPoints() }}
              </td>
            </tr>
            <tr>
              <td class="px-4 py-2 border border-gray-300">Total Errors</td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getTeamTotalErrors() }}
              </td>
            </tr>
            <tr class="bg-gray-100">
              <td class="px-4 py-2 border border-gray-300">Serve Efficiency</td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getTeamServeEfficiency().toFixed(2) }}
              </td>
            </tr>
            <tr>
              <td class="px-4 py-2 border border-gray-300">
                Attack Efficiency
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getTeamAttackEfficiency().toFixed(2) }}
              </td>
            </tr>
            <tr class="bg-gray-100">
              <td class="px-4 py-2 border border-gray-300">Block Efficiency</td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getTeamBlockEfficiency().toFixed(2) }}
              </td>
            </tr>
            <tr>
              <td class="px-4 py-2 border border-gray-300">
                Side Out Percentage
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getTeamSideOutPercentage().toFixed(2) }}
              </td>
            </tr>
            <tr class="bg-gray-100">
              <td class="px-4 py-2 border border-gray-300">
                Break Point Percentage
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getTeamBreakPointPercentage().toFixed(2) }}
              </td>
            </tr>
            <tr>
              <td class="px-4 py-2 border border-gray-300">
                Rotation Effectiveness (Receive-Block-Attack)
              </td>
              <td class="px-4 py-2 border border-gray-300">
                {{ getTeamRotationEffectiveness().receive }} -
                {{ getTeamRotationEffectiveness().block }} -
                {{ getTeamRotationEffectiveness().attack }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="teamStatsOpen" class="section-content">
      <table class="w-full table-auto">
  <thead>
    <tr>
      <th class="px-4 py-2">Rotation (Player Names)</th>
      <th class="px-4 py-2">Receive Effectiveness</th>
      <th class="px-4 py-2">Block Effectiveness</th>
      <th class="px-4 py-2">Attack Effectiveness</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(data, rotationKey) in getTeamRotationEffectiveness()" :key="rotationKey">
      <td class="px-4 py-2">
  {{ rotationKey.split('-').map((playerId, index) => `P${index + 1}: ${getPlayerName(parseInt(playerId))}`).join(', ') }} 
</td>
      <td class="px-4 py-2">{{ data.receiveEffectiveness }}</td>
      <td class="px-4 py-2">{{ data.blockEffectiveness }}</td>
      <td class="px-4 py-2">{{ data.attackEffectiveness }}</td>
    </tr>
  </tbody>
</table>
    </div>

    <!-- Individual Player Stats Section -->
    <div class="player-stats mb-6">
      <h3 class="text-lg font-semibold mb-2">Individual Player Stats</h3>
      <select v-model="selectedPlayer" class="w-full p-2 border rounded-md mb-4">
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
          <table class="w-full table-auto border-collapse border border-gray-300">
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
                  {{ getServeStats(selectedPlayer).totalAttempts }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getServeStats(selectedPlayer).points }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getServeStats(selectedPlayer).errors }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getServeStats(selectedPlayer).efficiency.toFixed(2) }}
                </td>
              </tr>

              <!-- Reception Stats -->
              <tr>
                <td class="px-4 py-2 border border-gray-300">Reception</td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getReceptionStats(selectedPlayer).totalAttempts }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getReceptionStats(selectedPlayer).points }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getReceptionStats(selectedPlayer).errors }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getReceptionStats(selectedPlayer).efficiency.toFixed(2) }}
                </td>
              </tr>

              <!-- Setting Stats -->
              <tr class="bg-gray-100">
                <td class="px-4 py-2 border border-gray-300">Setting</td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getSettingStats(selectedPlayer).totalAttempts }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getSettingStats(selectedPlayer).points }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getSettingStats(selectedPlayer).errors }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getSettingStats(selectedPlayer).efficiency.toFixed(2) }}
                </td>
              </tr>

              <!-- Attack Stats -->
              <tr>
                <td class="px-4 py-2 border border-gray-300">Attack</td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getAttackStats(selectedPlayer).totalAttempts }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getAttackStats(selectedPlayer).points }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getAttackStats(selectedPlayer).errors }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getAttackStats(selectedPlayer).efficiency.toFixed(2) }}
                </td>
              </tr>

              <!-- Block Stats -->
              <tr class="bg-gray-100">
                <td class="px-4 py-2 border border-gray-300">Block</td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getBlockStats(selectedPlayer).totalAttempts }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getBlockStats(selectedPlayer).points }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getBlockStats(selectedPlayer).errors }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getBlockStats(selectedPlayer).efficiency.toFixed(2) }}
                </td>
              </tr>

              <!-- Dig Stats -->
              <tr>
                <td class="px-4 py-2 border border-gray-300">Dig</td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getDigStats(selectedPlayer).totalAttempts }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getDigStats(selectedPlayer).validAttempts }}
                </td>
                <td class="px-4 py-2 border border-gray-300">
                  {{ getDigStats(selectedPlayer).errors }}
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
            <i
              :class="['fas', advancedStatsOpen ? 'fa-chevron-up' : 'fa-chevron-down']"
            ></i>
          </button>
          <div
            v-if="advancedStatsOpen"
            class="section-content bg-white p-4 rounded-md shadow-sm"
          >
            <!-- Serve Advanced Stats -->
            <div class="mb-4">
              <h4 class="text-md font-medium mb-2">Serve</h4>
              <p>
                <strong>Ace Serve Percentage:</strong>
                {{
                  getAdvancedServeStats(selectedPlayer).aceServePercentage.toFixed(
                    2
                  )
                }}
              </p>
              <p>
                <strong>Valid Serve Percentage:</strong>
                {{
                  getAdvancedServeStats(selectedPlayer)
                    .validServePercentage.toFixed(2)
                }}
              </p>

              <!-- Type per Point -->
              <div
                v-if="
                  Object.keys(
                    getAdvancedServeStats(selectedPlayer).typePerPoint
                  ).length > 0
                "
                class="mt-2"
              >
                <strong class="block mb-1">Points per Serve Type:</strong>
                <div
                  v-for="(points, type) in getAdvancedServeStats(
                    selectedPlayer
                  ).typePerPoint"
                  :key="type"
                  class="flex items-center"
                >
                  <span class="w-24">{{ type }}:</span>
                  <span>{{ points }} point{{ points > 1 ? 's' : '' }}</span>
                </div>
              </div>

              <!-- Target per Point -->
              <div
                v-if="
                  Object.keys(
                    getAdvancedServeStats(selectedPlayer).targetPerPoint
                  ).length > 0
                "
                class="mt-2"
              >
                <strong class="block mb-1">Points per Serve Target:</strong>
                <div
                  v-for="(
                    data, target
                  ) in getAdvancedServeStats(selectedPlayer).targetPerPoint"
                  :key="target"
                  class="flex items-center"
                >
                  <span class="w-24">{{ target }}:</span>
                  <span
                    >{{ data.points }} point{{ data.points > 1 ? 's' : '' }} / {{
                      data.attempts
                    }} attempt{{ data.attempts > 1 ? 's' : '' }} ({{
                      (data.percentage * 100).toFixed(2)
                    }}%)</span
                  >
                </div>
              </div>
            </div>

            <!-- Reception Advanced Stats -->
            <div class="mb-4">
              <h4 class="text-md font-medium mb-2">Reception</h4>
              <p>
                <strong>Valid Reception Percentage:</strong>
                {{
                  getAdvancedReceptionStats(selectedPlayer)
                    .validReceptionPercentage.toFixed(2)
                }}
              </p>
            </div>

            <!-- Setting Advanced Stats -->
            <div class="mb-4">
              <h4 class="text-md font-medium mb-2">Setting</h4>
              <p>
                <strong>Successful Set Percentage:</strong>
                {{
                  getAdvancedSettingStats(selectedPlayer)
                    .successfulSetPercentage.toFixed(2)
                }}
              </p>

              <!-- Set Target Distribution -->
              <div
                v-if="
                  Object.keys(
                    getAdvancedSettingStats(selectedPlayer).setTargetDistribution
                  ).length > 0
                "
                class="mt-2"
              >
                <strong class="block mb-1">Set Target Distribution:</strong>
                <div
                  v-for="(
                    count, target
                  ) in getAdvancedSettingStats(selectedPlayer)
                    .setTargetDistribution"
                  :key="target"
                  class="flex items-center"
                >
                  <span class="w-24">{{ target }}:</span>
                  <span>{{ count }} set{{ count > 1 ? 's' : '' }}</span>
                </div>
              </div>
            </div>

            <!-- Attack Advanced Stats -->
            <div class="mb-4">
              <h4 class="text-md font-medium mb-2">Attack</h4>
              <p>
                <strong>Kill Percentage:</strong>
                {{
                  getAdvancedAttackStats(selectedPlayer).killPercentage.toFixed(
                    2
                  )
                }}
              </p>
              <p>
                <strong>Valid Attack Percentage:</strong>
                {{
                  getAdvancedAttackStats(selectedPlayer)
                    .validAttackPercentage.toFixed(2)
                }}
              </p>

              <!-- Type per Point -->
              <div
                v-if="
                  Object.keys(
                    getAdvancedAttackStats(selectedPlayer).typePerPoint
                  ).length > 0
                "
                class="mt-2"
              >
                <strong class="block mb-1">Points per Attack Type:</strong>
                <div
                  v-for="(
                    points, type
                  ) in getAdvancedAttackStats(selectedPlayer).typePerPoint"
                  :key="type"
                  class="flex items-center"
                >
                  <span class="w-24">{{ type }}:</span>
                  <span>{{ points }} point{{ points > 1 ? 's' : '' }}</span>
                </div>
              </div>

              <!-- Target per Point -->
              <div
                v-if="
                  Object.keys(
                    getAdvancedAttackStats(selectedPlayer).targetPerPoint
                  ).length > 0
                "
                class="mt-2"
              >
                <strong class="block mb-1">Points per Attack Target:</strong>
                <div
                  v-for="(
                    data, target
                  ) in getAdvancedAttackStats(selectedPlayer).targetPerPoint"
                  :key="target"
                  class="flex items-center"
                >
                  <span class="w-24">{{ target }}:</span>
                  <span
                    >{{ data.points }} point{{ data.points > 1 ? 's' : '' }} / {{
                      data.attempts
                    }} attempt{{ data.attempts > 1 ? 's' : '' }} ({{
                      (data.percentage * 100).toFixed(2)
                    }}%)</span
                  >
                </div>
              </div>
            </div>

            <!-- Block Advanced Stats -->
            <div class="mb-4">
              <h4 class="text-md font-medium mb-2">Block</h4>
              <p>
                <strong>Block Efficiency:</strong>
                {{ getBlockStats(selectedPlayer).efficiency.toFixed(2) }}
              </p>
            </div>

            <!-- Dig Advanced Stats -->
            <div>
              <h4 class="text-md font-medium mb-2">Dig</h4>
              <!-- (No additional advanced stats for dig are included) -->
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
    getPlayerName: { // Add getPlayerName as a prop
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
      this[sectionName + 'Open'] = !this[sectionName + 'Open'];
    },
    // Team Stats Calculations
    getTeamTotalPoints() {
      let totalPoints = 0;
      this.game.sets.forEach((set) => {
        set.events.forEach((event) => {
          if (event.result === "point") {
            totalPoints++;
          }
        });
      });
      return totalPoints;
    },

    getTeamTotalErrors() {
      let totalErrors = 0;
      this.game.sets.forEach((set) => {
        set.events.forEach((event) => {
          if (event.result === "error") {
            totalErrors++;
          }
        });
      });
      return totalErrors;
    },

    getTeamServeEfficiency() {
      let totalServeAttempts = 0;
      let servePoints = 0;
      let serveContinues = 0;
      let serveErrors = 0;

      this.game.sets.forEach((set) => {
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

    getTeamAttackEfficiency() {
      let totalAttackAttempts = 0;
      let attackPoints = 0;
      let attackErrors = 0;

      this.game.sets.forEach((set) => {
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

    getTeamBlockEfficiency() {
      let totalBlockAttempts = 0;
      let blockPoints = 0;
      let blockContinues = 0;
      let blockErrors = 0;

      this.game.sets.forEach((set) => {
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

    getTeamSideOutPercentage() {
      let pointsWhenReceiving = 0;
      let totalTimesReceiving = 0;

      this.game.sets.forEach((set) => {
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

    getTeamBreakPointPercentage() {
      let pointsWhenServing = 0;
      let totalTimesServing = 0;

      this.game.sets.forEach((set) => {
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

      return totalTimesServing > 0 ? pointsWhenServing / totalTimesServing : 0;
    },

    getTeamRotationEffectiveness() {
  // Create a new object to avoid mutating the original data
  const rotationEffectiveness = {};

  this.game.sets.forEach((set) => {
    set.events.forEach((event) => {
      // Check if event.rotation exists before proceeding
      if (event.rotation) { 
      const rotationKey = event.rotation.join("-");

      // Use a temporary object to accumulate data for each rotation
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
    }});
  });

 // Calculate effectiveness percentages for each rotation
 for (const rotation in rotationEffectiveness) {
    const data = rotationEffectiveness[rotation];
    data.receiveEffectiveness =
      data.receiveTotal > 0
        ? (data.receiveSuccess / data.receiveTotal).toFixed(2)
        : "-"; // Display "-" if no attempts
    data.blockEffectiveness =
      data.blockTotal > 0
        ? (data.blockSuccess / data.blockTotal).toFixed(2)
        : "-";
    data.attackEffectiveness =
      data.attackTotal > 0
        ? (data.attackSuccess / data.attackTotal).toFixed(2)
        : "-";
  }

  // Instead of calculating averages, return the entire rotationEffectiveness object
  return rotationEffectiveness;
},

    // Individual Player Stats Calculations
    getServeStats(playerId) {
      let totalAttempts = 0;
      let points = 0;
      let errors = 0;

      this.game.sets.forEach((set) => {
        set.events.forEach((event) => {
          if (event.player === playerId && event.action === "serve") {
            totalAttempts++;
            if (event.result === "point") {
              points++;
            } else if (event.result === "error") {
              errors++;
            }
          }
        });
      });

      const efficiency =
        totalAttempts > 0 ? (points - errors) / totalAttempts : 0;
      return { totalAttempts, points, errors, efficiency };
    },
    getReceptionStats(playerId) {
      let totalAttempts = 0;
      let validAttempts = 0;
      let errors = 0;
      let points = 0;

      this.game.sets.forEach((set) => {
        set.events.forEach((event) => {
          if (event.player === playerId && event.action === "receive") {
            totalAttempts++;
            if (event.result === "continue" || event.result === "point") {
              validAttempts++;
              if (event.result === "point") {
                points++;
              }
            } else if (event.result === "error") {
              errors++;
            }
          }
        });
      });

      const efficiency =
        totalAttempts > 0 ? validAttempts / totalAttempts : 0;
      return { totalAttempts, validAttempts, errors, efficiency, points };
    },
    getSettingStats(playerId) {
      let totalAttempts = 0;
      let validAttempts = 0;
      let errors = 0;
      let points = 0;

      this.game.sets.forEach((set) => {
        set.events.forEach((event) => {
          if (event.player === playerId && event.action === "set") {
            totalAttempts++;
            if (event.result === "continue" || event.result === "point") {
              validAttempts++;
              if (event.result === "point") {
                points++;
              }
            } else if (event.result === "error") {
              errors++;
            }
          }
        });
      });

      const efficiency =
        totalAttempts > 0 ? (validAttempts - errors) / totalAttempts : 0;
      return { totalAttempts, validAttempts, errors, efficiency, points };
    },
    getAttackStats(playerId) {
      let totalAttempts = 0;
      let points = 0;
      let errors = 0;

      this.game.sets.forEach((set) => {
        set.events.forEach((event) => {
          if (event.player === playerId && event.action === "spike") {
            totalAttempts++;
            if (event.result === "point") {
              points++;
            } else if (event.result === "error") {
              errors++;
            }
          }
        });
      });

      const efficiency =
        totalAttempts > 0 ? (points - errors) / totalAttempts : 0;
      return { totalAttempts, points, errors, efficiency };
    },
    getBlockStats(playerId) {
      let totalAttempts = 0;
      let points = 0;
      let errors = 0;

      this.game.sets.forEach((set) => {
        set.events.forEach((event) => {
          if (event.player === playerId && event.action === "block") {
            totalAttempts++;
            if (event.result === "point") {
              points++;
            } else if (event.result === "error") {
              errors++;
            }
          }
        });
      });

      const efficiency =
        totalAttempts > 0 ? (points - errors) / totalAttempts : 0;
      return { totalAttempts, points, errors, efficiency };
    },
    getDigStats(playerId) {
      let totalAttempts = 0;
      let validAttempts = 0;
      let errors = 0;

      this.game.sets.forEach((set) => {
        set.events.forEach((event) => {
          if (event.player === playerId && event.action === "dig") {
            totalAttempts++;
            if (event.result === "continue") {
              validAttempts++;
            } else if (event.result === "error") {
              errors++;
            }
          }
        });
      });

      const efficiency =
        totalAttempts > 0 ? (validAttempts - errors) / totalAttempts : 0;
      return { totalAttempts, validAttempts, errors, efficiency };
    },

    // Advanced Player Stats Calculations
    getAdvancedServeStats(playerId) {
      let totalAttempts = 0;
      let points = 0;
      let errors = 0;
      let perfectServes = 0;
      let goodServes = 0;
      let typePerPoint = {};
      let targetPerPoint = {};

      this.game.sets.forEach((set) => {
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
        totalAttempts > 0 ? (points - errors) / totalAttempts : 0;
      const validServePercentage =
        totalAttempts > 0
          ? (points + perfectServes + goodServes - errors) / totalAttempts
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

    getAdvancedReceptionStats(playerId) {
      let totalAttempts = 0;
      let perfectReceptions = 0;
      let goodReceptions = 0;
      let errors = 0;

      this.game.sets.forEach((set) => {
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

    getAdvancedSettingStats(playerId) {
      let totalAttempts = 0;
      let perfectSets = 0;
      let goodSets = 0;
      let setTargetDistribution = {};

      this.game.sets.forEach((set) => {
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

    getAdvancedAttackStats(playerId) {
      let totalAttempts = 0;
      let points = 0;
      let errors = 0;
      let perfectAttacks = 0;
      let goodAttacks = 0;
      let typePerPoint = {};
      let targetPerPoint = {};

      this.game.sets.forEach((set) => {
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