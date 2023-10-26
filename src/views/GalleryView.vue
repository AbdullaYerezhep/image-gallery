<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import ImageComponent from '../components/ImageComponent.vue';
import { useImageStore } from '../store/ImageStore';

const imageStore = useImageStore();
const currentPage = ref(1);
const selectedTab = ref('All'); 
const tabs = ref([]);
const filtersChanged = ref(false);
const isPaginated = ref(true);

const populateAuthorSet = async () => {
  await imageStore.fetchImages(imageStore.currentPage);
  const authorSet = new Set(imageStore.authors);
  tabs.value = ['All', ...Array.from(authorSet)];
};

onMounted(async () => {
  await populateAuthorSet();
});

watch(selectedTab, () => {
  filtersChanged.value = true;
  currentPage.value = 1;
});

const filteredImages = computed(() => {
  if (filtersChanged.value) {
    currentPage.value = 1;
    filtersChanged.value = false;
  }

  let images = imageStore.images;

  if (selectedTab.value !== 'All') {
    images = images.filter(image => image.user.name.includes(selectedTab.value));
  }

  isPaginated.value = images.length <= imageStore.imagesPerPage;
  if (isPaginated.value) {
    currentPage.value = 1;
    isPaginated.value = false;
    return images;
  }else{
    isPaginated.value = true;
  }

  const start = (currentPage.value - 1) * imageStore.imagesPerPage;
  const end = start + imageStore.imagesPerPage;
  return images.slice(start, end);
});

const selectTab = (tab) => {
  selectedTab.value = tab;
};


const changePage = async (page) => {
  if (page >= 1 && page <= Math.ceil(imageStore.totalImagesCount / imageStore.imagesPerPage)) {
    currentPage.value = page;
    await imageStore.fetchImages(currentPage);
  }
};
</script>

<template>
  <Suspense>
    <template #default>
      <div class="flex flex-col gap-10 justify-center items-center p-5">
        <div>
          <h1 class="text-3xl font-bold text-black">Image Gallery</h1>
          <p class="text-xl text-black">A simple image gallery using Vue 3 and Tailwind CSS</p>
        </div>
        <div>
          <div>
            <div class="hidden">
              <label for="Tab" class="sr-only">Tab</label>
              <select v-model="selectedTab" id="Tab" class="w-full rounded-md border-gray-200">
                <option v-for="tab in tabs" :key="tab">{{ tab }}</option>
              </select>
            </div>
            <div class="sm:block">
              <div class="border-b border-gray-200">
                <nav class="mb-1 flex flex-wrap gap-6 justify-center" aria-label="Tabs">
                  <a
                    v-for="tab in tabs"
                    :key="tab"
                    :href="`#${tab.toLowerCase()}`"
                    :class="{
                      'shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700': selectedTab !== tab,
                      'shrink-0 border-b-2 border-sky-500 px-1 pb-4 text-sm font-medium text-sky-600': selectedTab === tab
                    }"
                    @click.prevent="selectTab(tab)"
                  >
                    {{ tab }}
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
          <div class="image-gallery relative z-0 px-[10%] py-5">
              <ImageComponent
                  v-for="image in filteredImages"
                  :key="image.id"
                  :regularImgUrl="image.urls.raw + '&fit=fill&w=1080&h=800'"
                  :smallImgUrl="image.urls.raw + '&w=400&h=400&fit=crop'"
                  :alt="image.alt_description"
                  :imageTitle="image.description"
                  :imageAuthor="image.user.name"
                  :imageDate="image.created_at"
              />
          </div>
          <div v-show="isPaginated" class="pagination flex gap-5">
            <p class="pagination-btn" :class="{disabled: currentPage === 1}" @click="changePage(currentPage - 1)">Previous</p>
            <p class="pagination-btn" :class="{disabled: currentPage * imageStore.imagesPerPage >= imageStore.totalImagesCount}" @click="changePage(currentPage + 1)">Next</p>
          </div>
  
      </div>
    </template>
    <template #fallback>...Loading</template>
  </Suspense>
</template>

<style>
.image-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  
  gap: 10px;
  max-width: 1280px;
  margin: 0 auto;
}
.pagination-btn {
  color:black;
  cursor:pointer;
}

.disabled {
  color: gray;
  cursor: default;
}
</style>