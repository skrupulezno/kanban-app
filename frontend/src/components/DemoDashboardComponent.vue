<template>
  <GridLayout
    :layout="layout"
    :col-num="12"
    :row-height="30"
    :is-draggable="true"
    :is-resizable="true"
    :vertical-compact="true"
    @layout-updated="updateLayout"
  >
    <GridItem
      v-for="item in layout"
      :key="item.i"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
    >
      <div class="widget-content">
        <h3>Widget {{ item.i }}</h3>
      </div>
    </GridItem>
  </GridLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { GridItem, GridLayout } from 'vue-grid-layout';

interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

// Инициализация начального макета
const layout = ref<LayoutItem[]>([
  { i: '1', x: 0, y: 0, w: 4, h: 2 },
  { i: '2', x: 4, y: 0, w: 4, h: 2 },
  { i: '3', x: 8, y: 0, w: 4, h: 2 }
]);

onMounted(() => {
  const savedLayout = localStorage.getItem('dashboard-layout');
  if (savedLayout) {
    layout.value = JSON.parse(savedLayout);
  }
});

const updateLayout = (newLayout: LayoutItem[]) => {
  layout.value = newLayout;
  localStorage.setItem('dashboard-layout', JSON.stringify(newLayout));
};

watch(layout, newLayout => {
  localStorage.setItem('dashboard-layout', JSON.stringify(newLayout));
});
</script>

<style scoped>
.widget-content {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  text-align: center;
}
</style>
