<template>
  <v-sheet id="about" class="py-16 text-center">
    <div class="text-h4 font-weight-bold">What We Do</div>

    <div class="text-body-1 font-weight-regular mt-3 text-medium-emphasis mb-12">
      Discover how our amazing team can help your business.
    </div>

    <v-container>
      <v-row>
        <v-col
          v-for="item in whatWeDo"
          :key="item.title"
          class="d-flex flex-column align-center"
          cols="12"
          md="4"
        >
          <img :src="item.icon" />

          <div class="text-h6 mt-1">
            {{ item.title }}
          </div>

          <div class="text-body-1 mt-2 text-medium-emphasis w-75">
            {{ item.description }}
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup lang="ts">
const whatWeDo = [
  {
    icon: './assets/what/analytics.png',
    title: 'Automatic Create Resumes',
    description:
      'Generate resumes automatically from your GitHub profile, with the option to customize.',
  },
  {
    icon: './assets/what/awareness.png',
    title: 'Life-Long Version Control',
    description: 'Version control and mutiple languages support, with the option to customize.',
  },
  {
    icon: './assets/what/design.png',
    title: 'Pimp My Nova',
    description: 'Jobs are automatically fall in love with your talent.',
  },
]
</script>
