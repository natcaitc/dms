<template>
  <v-container class="fill-height">
    <div>
      <div class="mb-8 text-center">
        <h1 class="text-h2 font-weight-bold">Review Logos</h1>
      </div>
      <div class="font-weight-bold text-orange-lighten-1">
        Pending Logos
      </div>
      <div class="mb-6">
        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
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
        <v-treeview :items="items" />
      </div>
    </div>
  </v-container>
</template>

<script setup>
  import { useDate } from 'vuetify'

  const dt = useDate()

  const items = [
    {
      id: 1,
      title: 'Applications :',
      children: [
        { id: 2, title: 'Calendar : app' },
        { id: 3, title: 'Chrome : app' },
        { id: 4, title: 'Webstorm : app' },
      ],
    },
    {
      id: 5,
      title: 'Documents :',
      children: [
        {
          id: 6,
          title: 'vuetify :',
          children: [
            {
              id: 7,
              title: 'src :',
              children: [
                { id: 8, title: 'index : ts' },
                { id: 9, title: 'bootstrap : ts' },
              ],
            },
          ],
        },
      ],
    },
  ]

  import { onMounted, ref, watch } from 'vue'

  import supabase from '@/supabaseClient'

  const log = ref([])

  async function fetchLogos () {
    const { data, error } = await supabase
      .from('logos')
      .select('*')

    if (error) {
      console.error('Error fetching logos:', error)
    } else {
      log.value = data
    }
  }

  onMounted(fetchLogos)

  const logos = [
    {
      name: 'NCE Convention Logo',
      date: dt.format(new Date('2025-01-02 20:01:47Z'), 'M-d-y'),
      region: 'NCE',
      facility: '- -',
      status: 'Pending',
    },
    {
      name: 'ZJX Logo',
      date: dt.format(new Date('2025-01-02 20:01:47Z'), 'M-d-y'),
      region: 'NSO',
      facility: 'ZJX',
      status: 'Pending',
    },
    {
      name: 'KitKat',
      date: 518,
      region: 26,
      facility: 65,
      status: 'Pending',
    },
    {
      name: 'Eclair',
      date: 262,
      region: 16,
      facility: 23,
      status: 'Pending',
    },
  ]
  const FakeAPI = {
    async fetch ({ page, itemsPerPage, sortBy, search }) {
      return new Promise(resolve => {
        setTimeout(() => {
          const start = (page - 1) * itemsPerPage
          const end = start + itemsPerPage
          const items = logos.slice().filter(item => {
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
  const headers = ref([
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
  const serverItems = ref([])
  const loading = ref(true)
  const totalItems = ref(0)
  const name = ref('')
  const date = ref('')
  const search = ref('')

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
