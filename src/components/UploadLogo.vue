<template>
  <v-container class="fill-height">
    <div>
      <div class="mb-8 text-center">
        <h1 class="text-h2 font-weight-bold">Upload Logos For NEB Review</h1>
        <v-sheet class="mt-6 pa-8">
          <v-form>
            <h2 class="text-left mb-3">Logo Type</h2>
            <v-combobox
              v-model="type"
              item-title="name"
              item-value="id"
              :items="types"
              label="Logo Type"
            />
            <v-combobox
              v-model="region"
              item-title="name"
              item-value="id"
              :items="regions"
              label="Region"
            />
            <v-combobox
              v-model="facility"
              item-title="name"
              item-value="id"
              :items="facilities"
              label="Facility"
            />

            <v-divider class="mt-2 mb-4" :thickness="4" />
            <h2 class="text-left mb-3">Logo Details</h2>

            <v-text-field label="Logo Name" />
            <v-file-input label="File input" variant="outlined" />
            <v-btn block class="mt-2" type="submit">Submit</v-btn>
          </v-form>
        </v-sheet></div>
    </div></v-container>
</template>

<script setup>
  import { useDate } from 'vuetify'

  const dt = useDate()

  const types = [
    {
      id: 1,
      name: 'Committee',
    },
    {
      id: 2,
      name: 'Region',
    },
    {
      id: 3,
      name: 'Facility',
    },
    {
      id: 4,
      name: 'Event',
    },
  ];
  const regions = [
    {
      id: 1,
      name: 'NSO',
    },
    {
      id: 2,
      name: 'NCE',
    },
    {
      id: 3,
      name: 'NSW',
    },
    {
      id: 4,
      name: 'NNE',
    },
  ];
  const facilities = [
    {
      id: 1,
      name: 'ZJX',
    },
    {
      id: 2,
      name: 'ZKC',
    },
    {
      id: 3,
      name: 'ZFW',
    },
    {
      id: 4,
      name: 'ZHU',
    },
  ];
  const type = ref();
  const region = ref();
  const facility = ref();

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
