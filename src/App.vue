<!-- src/App.vue -->
<template>
    <router-view></router-view>
    <Sidebar ref="sidebar"></Sidebar>
</template>

<script>
import Sidebar from './components/Sidebar.vue';

export default {
    components: {
        Sidebar: Sidebar
    },
    provide() {
        return {
            sidebar: this.$refs.sidebar
        };
    }
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