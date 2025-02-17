<script setup lang="ts">
import axios from 'axios' // Import axios
import { ref, onMounted } from 'vue'
defineProps<{
  msg: string
}>()

// Axios API client setup
const apiClient = axios.create({
  baseURL: 'http://localhost:5293', // Adjust to your .NET Core API URL
  headers: {
    'Content-Type': 'application/json',
  },
})
// State to hold fetched data
const data = ref(null)

// Fetch data from API on component mount
onMounted(async () => {
  try {
    const response = await apiClient.get('/weatherforecast') // Adjust endpoint as needed
    data.value = response.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a href="https://vite.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>. What's next?
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
