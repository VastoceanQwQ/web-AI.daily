<!-- src/components/Sidebar.vue -->
<template>
    <div class="sidebar" :class="{ 'hidden': isHidden }">
        <router-link to="/login">
            <div id="footer-profile" class="profile">
                <div class="profile-image"></div>
                <div class="profile-name">
                    {{ isLoggedIn ? username : '登录' }}
                </div>
            </div>
        </router-link>
        <div class="sidebar-items">
            <router-link to="/" class="sidebar-item">
                <img src="/waterfalls.svg" alt="Home Icon" class="icon" />
                <span class="text">主页</span>
            </router-link>
            <router-link to="/edit" class="sidebar-item">
                <img src="/edit.svg" alt="Edit Icon" class="icon" />
                <span class="text">编辑</span>
            </router-link>
            <router-link to="/history" class="sidebar-item">
                <img src="/history.svg" alt="History Icon" class="icon" />
                <span class="text">历史</span>
            </router-link>
            <router-link to="/settings" class="sidebar-item">
                <img src="/setting.svg" alt="Setting Icon" class="icon" />
                <span class="text">设置</span>
            </router-link>
            <div class="sidebar-item" @click="toggleSidebar" v-if="!isHidden">
                <img src="/left.svg" alt="Left Icon" class="icon" />
                <span class="text"></span>
            </div>
            <div class="sidebar-item" @click="toggleSidebar" v-if="isHidden">
                <img src="/right.svg" alt="Right Icon" class="icon" />
                <span class="text"></span>
            </div>
        </div>
        <div class="footer-logo" id="footer-logo">
            <div class="shrink-0 section_9"></div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isHidden: false,
            isLoggedIn: false, // 假设初始状态为未登录
            username: '', // 用户名，初始为空
        };
    },
    methods: {
        toggleSidebar() {
            this.isHidden = !this.isHidden;
        },
        handleMouseEnter(event) {
            if (event.clientX < 5) {
                this.isHidden = false;
            }
        },
        handleMouseLeave() {
            this.isHidden = true;
        },
    },
    mounted() {
        window.addEventListener('mousemove', this.handleMouseEnter);
        window.addEventListener('mouseleave', this.handleMouseLeave);
    },
    beforeUnmount() {
        window.removeEventListener('mousemove', this.handleMouseEnter);
        window.removeEventListener('mouseleave', this.handleMouseLeave);
    }
};
</script>

<style>
.sidebar {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 60px;
    height: 100%;
    opacity: 1;
    background: rgba(255, 255, 255, 0.6);
    box-shadow: 2px 0px 20px rgba(0, 0, 0, 0.06);
    backdrop-filter: blur(7.5px);
    z-index: 2000;
    user-select: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.3s ease;
}

.sidebar.hidden {
    transform: translateX(-60px);
}

.profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px auto;
    cursor: pointer;
}

.profile-image {
    background-color: #e3e3e3;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    margin-bottom: 5px;
}

.profile-name {
    text-align: center;
    font-size: 0.8rem;
    color: #6b6b6b;
}

.sidebar-items {
    flex: 1;
    overflow: auto;
}

.sidebar-item {
    margin: 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    border-radius: 0.3rem;
}

.sidebar-item:hover {
    background-image: linear-gradient(0deg, #ffeef1b1 0%, #e2eeffa9 95%, #e1edfe9c 100%);
}

.icon {
    width: 20px;
    height: 20px;
    margin-bottom: 3px;
    filter: brightness(2) invert(1);
}

.text {
    color: #6b6b6b;
    font-size: 0.8rem;
    font-family: SourceHanSansCN;
    line-height: 1rem;
    letter-spacing: 0.05rem;
}

.footer-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background-color: #53535300;
    border-radius: 0.94rem;
    margin: 20px;
}

.footer-logo .section_9 {
    background-color: #dedede;
    border-radius: 0.5rem;
    width: 35px;
    height: 35px;
    margin: 20px auto;
}

.footer-logo .text {
    margin-right: 0.38rem;
    color: #000000;
    font-size: 0.95rem;
    font-family: SourceHanSansCN;
    line-height: 0.92rem;
    letter-spacing: 0.13rem;
}
</style>