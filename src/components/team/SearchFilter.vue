<template>
  <div class="mb-6 flex flex-col sm:flex-row gap-4">
    <div class="flex-grow">
      <label for="search-input" class="sr-only">{{ $t('searchPlayers') }}</label>
      <input 
        id="search-input"
        v-model="localSearchQuery"
        type="text" 
        :placeholder="$t('searchPlayers')" 
        class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition duration-300"
        :aria-label="$t('searchPlayers')"
      >
    </div>
    <div class="sm:w-1/3">
      <label for="role-select" class="sr-only">{{ $t('selectRole') }}</label>
      <select 
        id="role-select"
        v-model="localRoleFilter"
        class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition duration-300 appearance-none bg-white"
        :aria-label="$t('selectRole')"
      >
        <option value="">{{ $t('allRoles') }}</option>
        <option v-for="role in translatedRoles" :key="role.key" :value="role.key">{{ role.value }}</option>
      </select>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'SearchFilter',
  props: {
    searchQuery: String,
    roleFilter: String,
    uniqueRoles: Array
  },
  emits: ['update:searchQuery', 'update:roleFilter'],
  setup(props, { emit }) {
    const { t } = useI18n();

    const localSearchQuery = ref(props.searchQuery);
    const localRoleFilter = ref(props.roleFilter);

    watch(localSearchQuery, (newValue) => {
      emit('update:searchQuery', newValue);
    });

    watch(localRoleFilter, (newValue) => {
      emit('update:roleFilter', newValue);
    });

    const translatedRoles = computed(() => 
      props.uniqueRoles.map(role => ({
        key: role,
        value: t(role)
      }))
    );

    return {
      t,
      translatedRoles,
      localSearchQuery,
      localRoleFilter
    };
  }
};
</script>

<style scoped>
@media (max-width: 640px) {
  .sm\:w-1\/3 {
    width: 100%;
  }
}

select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
</style>