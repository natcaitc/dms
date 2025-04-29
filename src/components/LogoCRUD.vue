<template>
  <v-container class="fill-height">
    <div>
      <div class="mb-8">
        <h1 class="text-h2 font-weight-bold">Review Logos</h1>
        <v-btn class="mt-3" prepend-icon="cloud-arrow-up" to="/logos/upload">Submit Logo for Approval</v-btn>
      </div>

      <div class="font-weight-bold text-orange-lighten-1">
        Pending Logos
      </div>
      <div class="mb-6">
        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          density="compact"
          :header-props="{align: 'left'}"
          :headers="pendingHeaders"
          item-value="name"
          :items="serverItems"
          :items-length="totalItems"
          :loading="loading"
          :search="search"
          @update:options="loadItems"
        >
          <template #item.action="{ item }">
            <v-btn
              v-if="item.status === 'Pending'"
              color="green"
            >
              Approve
            </v-btn>
            <v-btn
              v-if="item.status === 'Pending'"
              color="red"
            >
              Deny
            </v-btn>
          </template>
          <template #tfoot>
            <tr>
              <td>
                <v-text-field
                  v-model="name"
                  class="ma-2"
                  density="compact"
                  hide-details
                  placeholder="Search name..."
                />
              </td>
              <td>
                <v-text-field
                  v-model="date"
                  class="ma-2"
                  density="compact"
                  hide-details
                  placeholder="Logo entered date"
                  type="number"
                />
              </td>
            </tr>
          </template>
        </v-data-table-server>
      </div>

      <div class="font-weight-bold">
        Approved Logos
      </div>
      <div>
        <v-tabs v-model="tab" background-color="primary">
          <v-tab v-for="type in types" :key="type">
            {{ type }}
          </v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item v-for="type in types" :key="type">
            <v-text-field
              v-model="search"
              hide-details
              label="Search"
              prepend-inner-icon="fass fa-magnifying-glass"
              single-line
              variant="outlined"
            />

            <v-data-table
              :group-by="groupBy"
              :headers="approvedHeaders"
              hide-default-footer
              item-value="name"
              :items="logosByType"
              :search="search"
            >
              <template #group-header="{ item, columns, toggleGroup, isGroupOpen }">
                <tr>
                  <td :colspan="columns.length">
                    <div class="d-flex align-center">
                      <v-btn
                        color="medium-emphasis"
                        density="comfortable"
                        :icon="isGroupOpen(item) ? '$expand' : '$next'"
                        size="small"
                        variant="outlined"
                        @click="toggleGroup(item)"
                      />

                      <span class="ms-4">{{ item.value }} Logos</span>
                    </div>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-tabs-window-item>
        </v-tabs-window>

      </div>
    </div>
  </v-container>
</template>

<script setup>
  import { useDate } from 'vuetify'

  const dt = useDate()

  import { onMounted, ref, watch } from 'vue'

  import supabase from '@/supabaseClient'

  const log = ref([])
  const types = ref(['Committee', 'Region', 'Facility', 'Event']);
  const tab = ref(1);
  const search = ref('');

  const groupBy = computed (() => {
    switch (tab.value) {
      case 0:
      case 3:
        return [];
      case 1:
        return [{ key: 'region', order: 'asc' }]
      case 2:
        return [{ key: 'facility', order: 'asc' }]
    }
  });

  async function fetchLogos () {
    const { data, error } = await supabase
      .from('logos')
      .select(`*, region:regions(code) as region`)

    if (error) {
      console.error('Error fetching logos:', error)
    } else {
      log.value = data.map(logo => ({
        ...logo,
        region_code: logo.region ? logo.region.code : null,
      }));
      log.value.forEach(logo => delete logo.region);
    }
  }

  onMounted(fetchLogos)

  const logos = [
    {
      type: 1,
      name: 'NCE Shirt Design 2025',
      date: dt.format(new Date('2025-01-02 20:01:47Z'), 'M-d-y'),
      region: 'NCE',
      facility: '- -',
      status: 'Pending',
    },
    {
      type: 2,
      name: 'ZJX Logo',
      date: dt.format(new Date('2025-01-02 20:01:47Z'), 'M-d-y'),
      region: 'NSO',
      facility: 'ZJX',
      status: 'Pending',
    },
    {
      type: 1,
      name: 'NSO Convention Logo',
      date: dt.format(new Date('2025-01-02 20:01:47Z'), 'M-d-y'),
      region: 'NSO',
      facility: '- -',
      status: 'Approved',
    },
    {
      type: 3,
      name: 'SFO Convention 2025',
      date: dt.format(new Date('2025-01-02 20:01:47Z'), 'M-d-y'),
      region: '- -',
      facility: '- -',
      status: 'Approved',
    },
  ]
  const logosByType = computed(() => {
    return logos.filter(logo => logo.type === tab.value);
  });
  const unapprovedLogos = computed(() => {
    return logos.filter(logo => logo.status === 'Pending')
  });
  const FakeAPI = {
    async fetch ({ page, itemsPerPage, sortBy, search }) {
      return new Promise(resolve => {
        setTimeout(() => {
          const start = (page - 1) * itemsPerPage
          const end = start + itemsPerPage
          const items = unapprovedLogos.value.slice().filter(item => {
            if (search.name && !item.name.toLowerCase().includes(search.name.toLowerCase())) {
              return false
            }
            // eslint-disable-next-line sonarjs/prefer-single-boolean-return
            if (search.date && !(item.date >= Number(search.date))) {
              return false
            }
            return true
          })
          if (sortBy.length) {
            const sortKey = sortBy[0].key
            const sortOrder = sortBy[0].order
            items.sort((a, b) => {
              const aValue = a[sortKey]
              const bValue = b[sortKey]
              return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
            })
          }
          const paginated = items.slice(start, end === -1 ? undefined : end)
          resolve({ items: paginated, total: items.length })
        }, 500)
      })
    },
  }
  const itemsPerPage = ref(5)
  const pendingHeaders = ref([
    {
      title: 'Logo Name',
      align: 'start',
      sortable: false,
      key: 'name',
    },
    { title: 'Date', key: 'date', align: 'end' },
    { title: 'Region', key: 'region', align: 'end' },
    { title: 'Facility', key: 'facility', align: 'end' },
    { title: 'Action', key: 'action', align: 'end', sortable: false },
  ])
  const approvedHeaders = ref([
    {
      title: 'Logo Name',
      align: 'start',
      sortable: false,
      key: 'name',
    },
    { title: 'Date', key: 'date', align: 'end' },
    { title: 'Region', key: 'region', align: 'end' },
    { title: 'Facility', key: 'facility', align: 'end' },
  ])
  const serverItems = ref([])
  const loading = ref(true)
  const totalItems = ref(0)
  const name = ref('')
  const date = ref('')

  function loadItems ({ page, itemsPerPage, sortBy }) {
    loading.value = true
    FakeAPI.fetch({ page, itemsPerPage, sortBy, search: { name: name.value, date: date.value } }).then(({
      items,
      total,
    }) => {
      serverItems.value = items
      totalItems.value = total
      loading.value = false
    })
  }

  watch(name, () => {
    search.value = String(Date.now())
  })
  watch(date, () => {
    search.value = String(Date.now())
  })
</script>
