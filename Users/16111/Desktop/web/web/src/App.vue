<template>
  <main-footer></main-footer>
  <div class="main-place" ref="mainPlace">
    <!-- 卡片内容 -->
    <div v-if="!isEditing && cards.length > 0" class="card-container">
      <transition-group name="card-list" tag="div">
        <div v-for="(card, index) in cards" :key="index" class="card">
          <!-- 卡片内容 -->
        </div>
      </transition-group>
    </div>
    <!-- 编辑页入口 -->
    <div v-if="!isEditing" class="edit-button-container">
      <router-link to="/edit">
        <div class="edit-button">编辑模块</div>
      </router-link>
    </div>
    <!-- 返回主页按钮 -->
    <div v-if="isEditing" class="back-button-container">
      <router-link to="/">
        <div class="back-button">返回主页</div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const isEditing = ref(false);

    // 监听路由变化，动态切换编辑状态
    watch(
      () => route.path,
      (newPath) => {
        isEditing.value = newPath === '/edit';
      },
      { immediate: true }
    );

    return {
      isEditing,
    };
  },
};
</script>

<style>
/* 编辑按钮样式 */
.edit-button,
.back-button {
  background-color: #e3e3e3;
  color: #636262;
  font-size: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-button:hover,
.back-button:hover {
  background-color: #d0e0f9;
}

/* 返回按钮样式 */
.back-button {
  background-color: #808080; /* 灰色背景 */
}

/* 卡片淡出淡入效果 */
.card-list-enter-active,
.card-list-leave-active {
  transition: opacity 0.5s ease;
}

.card-list-enter-from,
.card-list-leave-to {
  opacity: 0;
}
</style>