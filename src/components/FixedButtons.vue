<!-- src/components/FixedButtons.vue -->
<template>
    <div class="fixed-buttons" :style="fixedButtonsStyle">
        <transition name="fade">
            <button v-show="showScrollToTopButton" class="button" @click="scrollToTop"><img src="/to-top.svg"
                    alt="To-top Icon" class="icon" /></button>
        </transition>
        <button class="button" @click="toggleMenu">
            <img src="/map.svg" alt="Map Icon" class="icon" />
        </button>
        <transition name="fade">
            <div v-if="showMenu" class="dropdown-menu">
                <button v-for="(card, index) in filteredCards" :key="index" class="dropdown-item"
                    @click="scrollToCard(index)">
                    {{ getFirstEmoji(card.content) }}
                </button>
            </div>
        </transition>
    </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue';

export default {
    props: {
        mainPlaceRef: {
            type: Object,
            required: true,
        },
        cards: {
            type: Array,
            required: true,
        },
    },
    setup(props) {
        const showMenu = ref(false);
        const fixedButtonsStyle = ref({});
        const showScrollToTopButton = ref(false);

        const toggleMenu = () => {
            showMenu.value = !showMenu.value;
        };

        const scrollToCard = (index) => {
            const cardElements = document.querySelectorAll('.card');
            if (cardElements.length > index) {
                cardElements[index].scrollIntoView({ behavior: 'smooth' });
                showMenu.value = false;
            }
        };

        const scrollToTop = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        const updatePosition = () => {
            if (props.mainPlaceRef) {
                const mainPlaceRect = props.mainPlaceRef.getBoundingClientRect();
                fixedButtonsStyle.value = {
                    right: `${window.innerWidth - mainPlaceRect.right - 60}px`,
                    bottom: `85px`,
                };
            }
        };

        const handleScroll = () => {
            showScrollToTopButton.value = window.scrollY > 300; // 当滚动超过300px时显示按钮
        };

        const getFirstEmoji = (content) => {
            const firstLine = content.split('\n')[0];
            const emojiRegex = /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/;
            const match = firstLine.match(emojiRegex);
            return match ? match[0] : null;
        };

        const filteredCards = computed(() => {
            return props.cards.filter(card => getFirstEmoji(card.content) !== null);
        });

        onMounted(() => {
            updatePosition();
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', handleScroll);
            handleScroll(); // 初始化时检查滚动位置
        });

        watch(
            () => props.mainPlaceRef,
            () => {
                updatePosition();
            }
        );

        return {
            showMenu,
            fixedButtonsStyle,
            showScrollToTopButton,
            toggleMenu,
            scrollToCard,
            scrollToTop,
            getFirstEmoji,
            filteredCards,
        };
    },
};
</script>

<style scoped>
.fixed-buttons {
    position: fixed; /* 改为固定定位 */
    bottom: 20px;
    right: 20px; /* 调整为相对于浏览器窗口的右下角 */
    display: flex;
    flex-direction: column;
    z-index: 1000;
    /* 确保按钮在最上层 */
}

.button {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    background-image: linear-gradient(0deg, #eedde0 0%, #d7e6fc 95%, #d3e2f8 100%);
    color: rgb(0, 0, 0);
    border: 2px solid #ffffff;
    /* 添加外边框 */
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, border-color 0.3s ease, opacity 0.3s ease;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.20);
    break-inside: avoid;
    margin-bottom: 20px;
    opacity: 1;
    /* 默认完全不透明 */
}

.button.fade-enter-active,
.button.fade-leave-active {
    transition: opacity 0.3s ease;
}

.button.fade-enter-from,
.button.fade-leave-to {
    opacity: 0;
    /* 完全透明 */
}

.button:hover {
    background-image: linear-gradient(0deg, #f4d5da 0%, #c3d8f7 99%, #b6d2f8 100%);
    border-color: #0199ff;
    /* 改变hover状态下的边框颜色 */
}

.dropdown-menu {
    position: absolute;
    width: 55px;
    /* 与按钮宽度相同 */
    bottom: 80px;
    /* 调整为在按钮上方 */
    left: -3px;
    /* 与按钮对齐 */
    background-color: rgba(255, 255, 255, 0.6);
    /* 白色背景 */
    border: 2px solid rgba(137, 137, 137, 0.6);
    /* 无边框 */
    box-shadow: none;
    /* 无阴影 */
    max-height: 200px;
    /* 设置最大高度 */
    overflow-y: auto;
    /* 允许滚动 */
    z-index: 1001;
    /* 确保在按钮之上 */
    padding: 2px;
    /* 去除内边距 */
    border-radius: 12px;
    /* 与按钮圆角相同 */
    background: rgba(255, 255, 255, 0.6);
    /* 半透明背景 */
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(7.5px);
    /* 毛玻璃效果 */
}

.dropdown-menu::-webkit-scrollbar {
    display: none;
    /* 隐藏滚动条 */
}

.dropdown-item {
    width: 100%;
    height: 50px;
    /* 与按钮高度相同 */
    border-radius: 12px;
    /* 与按钮圆角相同 */
    background-image: linear-gradient(0deg, #e2e2e2 0%, #d1d1d1 99%, #ababab 100%);
    color: rgb(0, 0, 0);
    border: 2px solid #ffffff;
    /* 添加外边框 */
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, border-color 0.3s ease, opacity 0.3s ease;

    margin-bottom: 10px;
    /* 与按钮间距相同 */
    opacity: 1;
    /* 默认完全不透明 */
    font-size: 24px;
    /* 增加文字大小 */
}

.dropdown-item:hover {
    background-image: linear-gradient(0deg, #eeeeee 0%, #dfdfdf 99%, #a7a7a7 100%);
    border-color: #909090;
    /* 改变hover状态下的边框颜色 */
}

/* 定义淡入淡出过渡效果 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    /* 完全透明 */
}

.icon {
    width: 75%;
    height: 75%;
    filter: brightness(2.5) invert(1);
    object-fit: contain; /* 保持图标比例 */
}
</style>