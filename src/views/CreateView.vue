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

        <v-btn color="secondary" class="ml-2" @click="openSyncDialog">Sync</v-btn>
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
    <!-- Sync Confirmation Dialog -->
    <v-dialog v-model="isSyncDialogActive" width="auto">
      <v-card>
        <v-card-title class="headline">Confirm SYNC</v-card-title>
        <v-card-text>Current tab title: {{ tabs[activeTab] }}</v-card-text>
        <v-card-actions>
          <v-btn text="Cancel" @click="isSyncDialogActive = false">Cancel</v-btn>
          <v-btn color="primary" text="Sync" @click="syncTab">Sync</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Loading Indicator -->
    <v-dialog v-model="isLoading" hide-overlay persistent width="300">
      <v-card class="d-flex justify-center align-center" height="100">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import CountryFlag from 'vue-country-flag-next'
import { ref } from 'vue'
import { ResumeDetail } from '@/models/ResumeDetail.type'
import { Language } from '@/models/enums/Language.enum'
const dialog = ref('')
const resumeDetails = ref<ResumeDetail[]>([
  new ResumeDetail(
    '1',
    '1',
    'Default',
    Language.English,
    '# 履歴書\n\n**キン　ウンヒ**  \n**靳　　雲飛**\n\n- **生年月日** 1990 年 4 月 7 日（満 34 歳） **性別** 男性\n- **電話番号** 070-8826-0407 　　　　 **メールアドレス** <feifeijinjp@gmail.com>\n- **住所** 〒 162-0806 東京都新宿区榎町 73-15-701\n\n## 学歴\n\n- **2008 年 9 月~2012 年 7 月** 昆明理工大学 管理学部　情報管理と情報システム学士 卒業\n\n## 職務経歴\n\n- **2013 年 1 月** 　　雲南 SYNDA 网络技術有限公司（中国）入社\n- **2014 年 4 月** 　　雲南 SYNDA 网络技術有限公司（中国）退職\n- **2014 年 5 月** 　　 9Ji Network（中国）入社\n- **2016 年 2 月** 　　 9Ji Network（中国）退職\n- **2016 年 4 月** 　　深圳 Authine 网络技術有限公司（中国）入社\n- **2019 年 9 月** 　　深圳 Authine 网络技術有限公司（中国）退職\n- **2020 年 1 月** 　　 Infosys Technologies（China）Co., Ltd.（中国）入社\n- **2022 年 9 月** 　　 Infosys Technologies（China）Co., Ltd.（中国）退職\n- **2023 年 4 月** 　　 SNS ソフトウェア株式会社（日本）入社\n- **2024 年 11 月** 　 SNS ソフトウェア株式会社（日本）退職\n\n## 語学力\n\n- **英語** 　　　ビジネス会話（TOEIC 875 点, 2024 年）\n- **日本語**　　 ビジネス会話 (JLPT N1, 2022 年)\n- **北京語**　　 ネイティブ',
    true,
    new Date().toDateString(),
    new Date().toDateString(),
  ),
  new ResumeDetail(
    '2',
    '1',
    'Tab 1',
    Language.Japanese,
    'Content for Tab 1',
    false,
    new Date().toDateString(),
    new Date().toDateString(),
  ),
  new ResumeDetail(
    '3',
    '1',
    'Tab 2',
    Language.Chinese,
    'Content for Tab 2',
    false,
    new Date().toDateString(),
    new Date().toDateString(),
  ),
  new ResumeDetail(
    '4',
    '1',
    'Tab 3',
    Language.English,
    'Content for Tab 3',
    false,
    new Date().toDateString(),
    new Date().toDateString(),
  ),
  new ResumeDetail(
    '5',
    '1',
    'Tab 4',
    Language.Japanese,
    'Content for Tab 4',
    false,
    new Date().toDateString(),
    new Date().toDateString(),
  ),
])

const tabs = ref(resumeDetails.value.map((detail) => detail.name))
const activeTab = ref(0)
const editors = ref(resumeDetails.value.map((detail) => detail.content)) // Initialize an array with empty strings for each tab

const countries = ref([
  { flag: 'us', label: 'English', value: 'English' },
  { flag: 'jp', label: 'Japanese', value: 'Japanese' },
  { flag: 'cn', label: 'Chinese', value: 'Chinese' },
])

const isDialogActive = ref(false)
const isDeleteDialogActive = ref(false)
const tabIndexToDelete = ref(-1)
const isSyncDialogActive = ref(false)
const isLoading = ref(false)

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

const openSyncDialog = () => {
  isSyncDialogActive.value = true
}

const syncTab = async () => {
  isSyncDialogActive.value = false
  isLoading.value = true
  try {
    // Simulate a request to the server
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log('Sync completed for tab:', tabs.value[activeTab.value])
  } catch (error) {
    console.error('Sync failed:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
