<template>
  <div class="image-component" @click="isExpanded = !isExpanded">
    <div class="image-container" :class="{ expanded: isExpanded }">
      <div class="image-content">
        <img
          :src="isExpanded ? regularImgUrl : smallImgUrl"
          :alt="alt"
          class="image"
        />
        <div class="image-info">
          <div>{{ imageTitle }}</div>
          <p>{{ imageAuthor }}</p>
          <p>{{ imageDate }}</p>
        </div>
      </div>
    </div>
    <div class="overlay" :class="{ active: isExpanded }"></div>  
  </div>
</template>

<script setup>
import { ref } from 'vue';
defineProps({
  regularImgUrl: String,
  smallImgUrl: String,
  alt: String,
  imageTitle: String, 
  imageAuthor: String, 
  imageDate: String,
});

const isExpanded = ref(false);
</script>

<style scoped>
.image-component {
  cursor: pointer;
}

.image-container {
  transition: transform 0.3s;
  transform-origin: center;
  overflow: hidden;
}

.image-container.expanded {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.image-content {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.image-info {
  position: absolute;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 10px;
  display: none;
  width:100%;
}

.image-component:hover .image-info {
  display: block;
  z-index: 3; 
  pointer-events: none;
}

.image {
  width: auto;
  height: auto;
  display: block;
}

.overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1; 
}

.overlay.active {
  display: block;
}
</style>
