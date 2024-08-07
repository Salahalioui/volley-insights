<template>
  <div class="my-team p-4 sm:p-6 bg-gray-100 rounded-lg shadow-md max-w-4xl mx-auto">
    <h2 class="text-3xl font-bold mb-6 text-gray-800">My Team</h2>

    <!-- Search and Filter -->
    <SearchFilter
      :searchQuery="searchQuery"
      :roleFilter="roleFilter"
      :uniqueRoles="uniqueRoles"
      @update:searchQuery="val => searchQuery = val"
      @update:roleFilter="val => roleFilter = val"
    />

    <!-- Player List -->
    <PlayerList
      :filteredPlayers="filteredPlayers"
      @edit-player="editPlayer"
      @confirm-remove-player="confirmRemovePlayer"
    />

    <!-- Add/Edit Player Form -->
    <PlayerForm
      :currentPlayer="currentPlayer"
      :roles="roles"
      :shirtNumberError="shirtNumberError"
      @save-player="savePlayer"
      @update:currentPlayer="val => currentPlayer = val"
    />

    <!-- Import/Export Buttons -->
    <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
      <button @click="exportPlayers" 
              class="flex-1 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300">
        <i class="fas fa-file-export mr-2"></i> Export Players (JSON)
      </button>
      <button @click="exportPlayersCSV"
              class="flex-1 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300">
        <i class="fas fa-file-export mr-2"></i> Export Players (CSV)
      </button>
      <label class="flex-1 bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition duration-300 cursor-pointer text-center">
        <i class="fas fa-file-import mr-2"></i> Import Players
        <input type="file" @change="importPlayers" accept=".json, .csv" class="hidden">
      </label>
    </div>

    <!-- Notification -->
    <PlayerNotification :notification="notification" />

    <!-- Confirmation Modal -->
    <ConfirmModal
      :showConfirmModal="showConfirmModal"
      :playerToRemove="playerToRemove"
      @cancel-remove="cancelRemove"
      @remove-player="removePlayer"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
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

    const roles = [
      'Setter',
      'Outside Hitter',
      'Opposite',
      'Middle Blocker',
      'Libero'
    ];

    const showNotification = (message, type = 'success') => {
      notification.value = { message, type };
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
        shirtNumberError.value = 'Shirt number already in use';
        return;
      }
      shirtNumberError.value = null;

      if (currentPlayer.value.id) {
        const index = players.value.findIndex(p => p.id === currentPlayer.value.id);
        players.value[index] = { ...currentPlayer.value };
        showNotification('Player updated successfully');
      } else {
        players.value.push({
          ...currentPlayer.value,
          id: Date.now()
        });
        showNotification('Player added successfully');
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
      showNotification('Player removed successfully');
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
      showNotification('Players exported successfully (JSON)');
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
      showNotification('Players exported successfully (CSV)');
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
            showNotification('Players imported successfully');
          } catch (error) {
            showNotification('Error: Invalid JSON file', 'error');
          }
        } else if (fileExtension === 'csv') {
          Papa.parse(fileContent, {
            header: true,
            complete: (results) => {
              if (results.errors.length > 0) {
                console.error('CSV parsing errors:', results.errors);
                showNotification('Error parsing CSV file. Please check the format.', 'error');
                return;
              }
              players.value = results.data; 
              savePlayers();
              showNotification('Players imported successfully');
            }
          });
        } else {
          showNotification('Error: Invalid file type', 'error');
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
</style>
