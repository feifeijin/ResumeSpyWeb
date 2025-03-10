<!-- filepath: /Users/ws/Documents/DotCore/ResumeSpyWeb/src/views/CreateView.vue -->
<template>
  <v-container fluid>
    <v-row align-items="center" class="mb-4">
      <v-col cols="auto">
        <v-tabs v-model="activeTab" background-color="primary" dark>
          <v-tab v-for="(tab, index) in tabs" :key="tab" class="d-flex align-center">
            {{ tab }}
            <v-icon
              v-if="index > 0"
              size="small"
              icon="mdi-close"
              color="red"
              style="transform: translate(50%, -50%)"
              @click.stop="openDeleteDialog(index)"
            ></v-icon>
          </v-tab>
        </v-tabs>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col cols="auto">
        <v-dialog v-model="isDialogActive" width="auto" scrollable>
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              prepend-icon="mdi-file-account"
              text="Select Language"
              variant="outlined"
              v-bind="activatorProps"
            ></v-btn>
          </template>

          <template v-slot:default>
            <v-card prepend-icon="mdi-file-account" title="Select Language">
              <v-divider class="mt-3"></v-divider>

              <v-card-text class="px-4">
                <v-radio-group v-model="dialog" class="full-width">
                  <v-row v-for="country in countries" :key="country.value" align-items="center">
                    <v-col>
                      <v-radio :value="country.value">
                        <template v-slot:label>
                          <country-flag :country="country.flag" size="small" class="me-2" />
                          {{ country.label }}
                        </template>
                      </v-radio>
                    </v-col>
                  </v-row>
                </v-radio-group>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-btn text="Close" @click="isDialogActive = false"></v-btn>

                <v-spacer></v-spacer>

                <v-btn color="surface-variant" text="ADD" variant="flat" @click="onAdd"></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>

        <v-btn color="secondary" class="ml-2">Sync</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-tabs-window v-model="activeTab">
          <v-tabs-window-item v-for="(tab, index) in tabs" :key="tab">
            <v-md-editor v-model="editors[index]" height="800px">{{ tab }}</v-md-editor>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-col>
    </v-row>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="isDeleteDialogActive" width="auto">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this tab?</v-card-text>
        <v-card-actions>
          <v-btn text="Cancel" @click="isDeleteDialogActive = false"></v-btn>
          <v-btn color="red" text="Delete" @click="deleteTab"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import CountryFlag from 'vue-country-flag-next'
import { ref } from 'vue'

const dialog = ref('')

const tabs = ref(['Default', '1', '2', '3', '4'])
const activeTab = ref(0)
const editors = ref(['Default', '1', '2', '3', '4']) // Initialize an array with empty strings for each tab

const countries = ref([
  { flag: 'us', label: 'English', value: 'English' },
  { flag: 'jp', label: 'Japanese', value: 'Japanese' },
  { flag: 'cn', label: 'Chinese', value: 'Chinese' },
])

const isDialogActive = ref(false)
const isDeleteDialogActive = ref(false)
const tabIndexToDelete = ref(-1)

const onAdd = () => {
  console.log('Add button clicked')
  console.log('Selected value:', dialog.value)
  // Add your logic here
  if (dialog.value) {
    tabs.value.push(dialog.value)
    editors.value.push(dialog.value) // Add corresponding editor content
  }
  dialog.value = ''
  isDialogActive.value = false
}

const openDeleteDialog = (index: number) => {
  tabIndexToDelete.value = index
  isDeleteDialogActive.value = true
}

const deleteTab = () => {
  if (tabIndexToDelete.value > -1) {
    const wasActiveTab = activeTab.value === tabIndexToDelete.value
    tabs.value.splice(tabIndexToDelete.value, 1)
    editors.value.splice(tabIndexToDelete.value, 1)
    if (tabs.value.length > 0) {
      if (wasActiveTab) {
        activeTab.value = 0
      } else if (activeTab.value > tabIndexToDelete.value) {
        activeTab.value -= 1
      }
    } else {
      activeTab.value = -1
    }
    isDeleteDialogActive.value = false
    tabIndexToDelete.value = -1
  }
}
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
