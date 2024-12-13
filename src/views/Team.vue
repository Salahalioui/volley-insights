<template>
  <div class="my-team p-4 sm:p-6 lg:p-8 bg-gray-100 rounded-lg shadow-md max-w-4xl mx-auto">
    <h2 class="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">{{ $t('myTeam') }}</h2>

    <!-- Search and Filter -->
    <SearchFilter
      :searchQuery="searchQuery"
      :roleFilter="roleFilter"
      :uniqueRoles="uniqueRoles"
      @update:searchQuery="val => searchQuery = val"
      @update:roleFilter="val => roleFilter = val"
    />

    <!-- Player List -->
    <transition-group name="list" tag="div">
      <PlayerList
        :filteredPlayers="filteredPlayers"
        @edit-player="editPlayer"
        @confirm-remove-player="confirmRemovePlayer"
      />
    </transition-group>

    <!-- Add/Edit Player Form -->
    <PlayerForm
      :currentPlayer="currentPlayer"
      :roles="roles"
      :shirtNumberError="shirtNumberError"
      @save-player="savePlayer"
      @update:currentPlayer="val => currentPlayer = val"
    />

    <!-- Import/Export Buttons -->
    <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
      <button @click="exportPlayers" 
              class="flex-1 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              :aria-label="$t('exportPlayersJSON')">
        <i class="fas fa-file-export mr-2"></i> {{ $t('exportPlayersJSON') }}
      </button>
      <button @click="exportPlayersCSV"
              class="flex-1 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              :aria-label="$t('exportPlayersCSV')">
        <i class="fas fa-file-export mr-2"></i> {{ $t('exportPlayersCSV') }}
      </button>
      <label class="flex-1 bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition duration-300 cursor-pointer text-center focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-opacity-50">
        <i class="fas fa-file-import mr-2"></i> {{ $t('importPlayers') }}
        <input type="file" @change="importPlayers" accept=".json, .csv" class="hidden" :aria-label="$t('importPlayers')">
      </label>
    </div>

    <!-- Notification -->
    <transition name="fade">
      <PlayerNotification :notification="notification" />
    </transition>

    <!-- Confirmation Modal -->
    <transition name="fade">
      <ConfirmModal
        v-if="showConfirmModal"
        :showConfirmModal="showConfirmModal"
        :playerToRemove="playerToRemove"
        @cancel-remove="cancelRemove"
        @remove-player="removePlayer"
      />
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Papa from 'papaparse';
import SearchFilter from '../components/team/SearchFilter.vue';
import PlayerList from '../components/team/PlayerList.vue';
import PlayerForm from '../components/team/PlayerForm.vue';
import PlayerNotification from '../components/team/PlayerNotification.vue';
import ConfirmModal from '../components/team/ConfirmModal.vue';

export default {
  name: 'MyTeam',
  components: {
    SearchFilter,
    PlayerList,
    PlayerForm,
    PlayerNotification,
    ConfirmModal
  },
  setup() {
    const { t } = useI18n();
    const players = ref([]);
    const searchQuery = ref('');
    const roleFilter = ref('');
    const currentPlayer = ref({
      id: null,
      name: '',
      shirtNumber: '',
      role: ''
    });
    const notification = ref(null);
    const shirtNumberError = ref(null);
    const showConfirmModal = ref(false);
    const playerToRemove = ref(null);

    const roles = computed(() => [
  'setter',
  'outsideHitter',
  'opposite',
  'middleBlocker',
  'libero'
]);

    const showNotification = (message, type = 'success') => {
      notification.value = { message: t(message), type };
      setTimeout(() => {
        notification.value = null;
      }, 3000);
    };

    const loadPlayers = () => {
      const storedPlayers = localStorage.getItem('players');
      if (storedPlayers) {
        players.value = JSON.parse(storedPlayers);
      }
    };

    const savePlayers = () => {
      localStorage.setItem('players', JSON.stringify(players.value));
    };

    const savePlayer = () => {
      const existingPlayer = players.value.find(p => 
        p.shirtNumber === currentPlayer.value.shirtNumber && 
        p.id !== currentPlayer.value.id 
      );
      if (existingPlayer) {
        shirtNumberError.value = t('shirtNumberInUse');
        return;
      }
      shirtNumberError.value = null;

      if (currentPlayer.value.id) {
        const index = players.value.findIndex(p => p.id === currentPlayer.value.id);
        players.value[index] = { ...currentPlayer.value };
        showNotification('playerUpdated');
      } else {
        players.value.push({
          ...currentPlayer.value,
          id: Date.now()
        });
        showNotification('playerAdded');
      }

      savePlayers();
      resetForm();
    };

    const editPlayer = (player) => {
      currentPlayer.value = { ...player };
    };

    const confirmRemovePlayer = (player) => {
      playerToRemove.value = player;
      showConfirmModal.value = true;
    };

    const removePlayer = () => {
      players.value = players.value.filter(p => p.id !== playerToRemove.value.id);
      savePlayers();
      showNotification('playerRemoved');
      showConfirmModal.value = false;
      playerToRemove.value = null;
    };

    const cancelRemove = () => {
      showConfirmModal.value = false;
      playerToRemove.value = null;
    };

    const resetForm = () => {
      currentPlayer.value = { id: null, name: '', shirtNumber: '', role: '' };
    };

    const exportPlayers = () => {
      const dataStr = JSON.stringify(players.value, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = 'players.json';

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      showNotification('playersExportedJSON');
    };

    const exportPlayersCSV = () => {
      const csv = Papa.unparse(players.value);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'players.csv');
      link.style.visibility = 'hidden'; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showNotification('playersExportedCSV');
    };

    const importPlayers = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContent = e.target.result;
        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (fileExtension === 'json') {
          try {
            const importedPlayers = JSON.parse(fileContent);
            players.value = importedPlayers;
            savePlayers();
            showNotification('playersImported');
          } catch (error) {
            showNotification('invalidJSONFile', 'error');
          }
        } else if (fileExtension === 'csv') {
          Papa.parse(fileContent, {
            header: true,
            complete: (results) => {
              if (results.errors.length > 0) {
                console.error('CSV parsing errors:', results.errors);
                showNotification('invalidCSVFormat', 'error');
                return;
              }
              players.value = results.data; 
              savePlayers();
              showNotification('playersImported');
            }
          });
        } else {
          showNotification('invalidFileType', 'error');
        }
      };
      reader.readAsText(file);
    };

    const filteredPlayers = computed(() => {
      return players.value.filter(player => 
        (player.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
         player.shirtNumber.toString().includes(searchQuery.value) ||
         player.role.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
        (roleFilter.value === '' || player.role === roleFilter.value)
      );
    });

    const uniqueRoles = computed(() => {
      return [...new Set(players.value.map(player => player.role))];
    });

    onMounted(() => {
      loadPlayers();
    });

    return {
      players,
      searchQuery,
      roleFilter,
      currentPlayer,
      notification,
      shirtNumberError,
      showConfirmModal,
      playerToRemove,
      filteredPlayers,
      uniqueRoles,
      roles,
      savePlayer,
      editPlayer,
      confirmRemovePlayer,
      removePlayer,
      cancelRemove,
      exportPlayers,
      exportPlayersCSV,
      importPlayers
    };
  }
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .my-team {
    padding: 1rem;
  }
}
</style>