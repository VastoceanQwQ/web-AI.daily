<!-- src/App.vue -->
<template>
    <router-view></router-view>
    <sidebar></sidebar>
</template>

<script>
import Sidebar from './components/Sidebar.vue'; // 确保路径正确

export default {
    components: {
        Sidebar,
    },
};
</script>

<style>
body {
    opacity: 1;
    background: linear-gradient(180deg, rgba(238, 241, 245, 1) 0%, rgb(217, 226, 246) 100%);
    background-attachment: fixed;
}

main-footer {
    background-color: transparent;
}
</style>