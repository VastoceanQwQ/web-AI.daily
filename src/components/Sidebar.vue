<template>
    <div class="sidebar" :class="{ 'hidden': isHidden }">
        <div class="profile" id="footer-profile"></div>
        <div class="sidebar-items">
            <div class="sidebar-item" @click="handleClick('edit')">
                <img src="/edit.svg" alt="Edit Icon" class="icon" />
                <span class="text">编辑</span>
            </div>
            <div class="sidebar-item" @click="handleClick('history')">
                <img src="/history.svg" alt="History Icon" class="icon" />
                <span class="text">历史</span>
            </div>
            <div class="sidebar-item" @click="handleClick('settings')">
                <img src="/setting.svg" alt="Setting Icon" class="icon" />
                <span class="text">设置</span>
            </div>
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
        };
    },
    methods: {
        handleClick(action) {
            // 处理点击事件
            console.log(`Clicked on ${action}`);
        },
        toggleSidebar() {
            this.isHidden = !this.isHidden;
        },
        handleMouseEnter(event) {
            if (event.clientX < 5) { // 50px 是侧栏的宽度
                this.isHidden = false;
            }
        },
        handleMouseLeave() {
            this.isHidden = true;
        }
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
    z-index: 10;
    user-select: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.3s ease;
}

.sidebar.hidden {
    transform: translateX(-60px);
    /* 侧边栏宽度 */
}

.profile {
    background-color: #e3e3e3;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    margin: 20px auto;
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