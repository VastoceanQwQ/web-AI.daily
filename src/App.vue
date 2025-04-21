<template>
    <main-footer></main-footer>
    <div class="main-place" ref="mainPlace">
        <div class="card-description">开发版界面 · Ver 20250421-001 · 20:45
            <div>
                <button @click="clearCards" class="test-button">删除所有卡片</button><span>&nbsp&nbsp&nbsp</span>
                <button @click="loadSampleData" class="test-button">加载示例数据</button>
            </div>
        </div>
        <div v-if="cards.length === 0" class="no-cards">
            <img src="/public/neko01.png" alt="Add Cards" class="no-cards-image">
            <div class="no-cards-text card-description">
                <p>还没有添加卡片哦</p>
                <p>点击侧边栏 “<img src="/edit.svg" alt="Edit Icon" class="icon1" />编辑” 按钮, 开启您的AI早报之旅</p>
            </div>
        </div>
        <div v-else>
            <transition-group name="card-list" tag="div" class="card-container">
                <div v-for="(card, index) in cards" :key="index" class="card"
                    :class="{ 'has-header-image': card.headerImage, 'has-theme-color': !card.headerImage && themeColors[card.card_type] }"
                    :style="{ '--theme-color': !card.headerImage ? themeColors[card.card_type] : '' }">
                    <div class="card-header" :style="{ backgroundImage: `url(${card.headerImage || ''})` }"></div>
                    <div class="card-content" v-html="renderMarkdown(card.content)"></div>
                </div>
            </transition-group>
            <div class="upper-main"></div>
        </div>
    </div>
    <fixed-buttons v-if="cards.length > 0" :main-place-ref="mainPlace" :cards="cards" id="buttons"></fixed-buttons>
</template>

<script>
import { ref, onMounted } from 'vue';
import MarkdownIt from 'markdown-it';
import MainFooter from './components/Sidebar.vue';
import FixedButtons from './components/FixedButtons.vue';
import scrollReveal from 'scrollreveal';
import { sampleCards } from './sampleCards'; // 导入示例数据

const md = new MarkdownIt();

export default {
    components: {
        MainFooter,
        FixedButtons,
    },
    setup() {
        // 定义每种卡片类型的主题色
        const themeColors = {
            date: '#d0ebff', 
            weather: '#e9ecef', 
            fortune: '#e5dbff', 
            miku: '#c5f6fa', 
            news: '#ffe3e3', 
            text: '#ffe8cc', 
        };

        // 定义响应式数据
        const cards = ref([]);

        // 定义方法
        const renderMarkdown = (content) => {
            return md.render(content);
        };

        // 设置scrollReveal的方法
        const retScroll = () => {
            const sr = scrollReveal();
            sr.reveal('.card', {
                duration: 500,
                delay: 100,
                origin: 'bottom',
                reset: true, // 设置为true，以便在滚动回顶部时重新应用动画
                mobile: true,
                distance: '10px',
                opacity: 0.001,
                easing: 'cubic-bezier(0.5, 0, 0, 1)',
                scale: 0.9,
                beforeReveal: function (ele) {
                    console.log(1);
                },
            });
            sr.reveal('#buttons', {
                duration: 500,
                delay: 100,
                origin: 'bottom',
                reset: false, 
                mobile: true,
                distance: '0px',
                opacity: 0.001,
                easing: 'cubic-bezier(0.5, 0, 0, 1)',
                scale: 0.9,
                beforeReveal: function (ele) {
                    console.log(1);
                },
            });
        };

        // 页面加载生命周期
        onMounted(() => {
            // 移除自动加载示例数据的调用
            // retScroll();
        });

        const mainPlace = ref(null);

        // 清空卡片的方法
        const clearCards = () => {
            cards.value = [];
        };

        // 加载示例数据的方法
        const loadSampleData = () => {
            cards.value = sampleCards;
            // 重新初始化 scrollReveal
            retScroll();
            // 同步新的 .card 元素
            scrollReveal().sync();

        };

        return {
            cards,
            renderMarkdown,
            mainPlace,
            clearCards,
            themeColors, // 确保 themeColors 可以在模板中使用
            loadSampleData, // 提供加载示例数据的方法
        };
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

.upper-main {
    background-color: rgba(180, 180, 180, 0);
    width: 100%;
    height: 100px;
}

.main-place {
    width: 1200px;
    padding: 50px;
    background-color: rgba(180, 180, 180, 0);
    position: absolute;
    top: 6%;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1; /* 确保 main-place 在其他元素之上 */
}

.card-container {
    column-count: 2;
    column-gap: 20px;
}

.card {
    overflow: hidden;
    opacity: 1;
    border-radius: 15px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    break-inside: avoid;
    margin-bottom: 20px;

    ::selection {
        background-color: #d5e3f8;
        color: rgb(34, 34, 34);
    }
}

.card.has-header-image .card-header {
    height: 200px; /* 设置头图的高度 */
    background-size: cover;
    background-position: center;
    position: relative;
    z-index: 1;
}

.card.has-header-image .card-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
    background-blend-mode: multiply;
    z-index: 2;
}

.card.has-theme-color {
    position: relative;
}

.card.has-theme-color::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50px; /* 渐淡主题色的高度 */
    background: linear-gradient(to bottom, var(--theme-color), rgba(255, 255, 255, 0));
    z-index: 1;
}

.card-content {
    padding: 25px;
    color: #333;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
}

.card-content blockquote {
    background-color: #f9f9f9;
    border-left: 5px solid #ccc;
    padding: 10px 20px;
    margin: 1em 0;
    color: #555;
    font-style: italic;
}

.card-content h1,
.card-content h2,
.card-content h3,
.card-content h4,
.card-content strong {
    color: #2c3e50;
    margin-top: 0em;
    margin-bottom: 0.5em;
    font-weight: bold;
}

.card-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
}

.card-content th,
.card-content td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.card-content th {
    background-color: #f4f4f4;
    color: #333;
}

.card-content a {
    background: linear-gradient(90deg, #37b2fe, #ff5f7f);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-decoration: none;
}

.card-content a:hover {
    text-decoration: underline;
    background: linear-gradient(90deg, #019eff, #fc3fa1);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    background-color: #ffffff00;
}

.card-content pre {
    background-color: #282c34;
    color: #abb2bf;
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;
}

.card-content code {
    font-family: 'Fira Code', monospace;
    font-size: 0.9em;
}

.card-description {
    font-size: 15px;
    color: #b6b6b6;
    margin-bottom: 20px;
    text-align: center;
    font-weight: bold;
    user-select: none;
}

.no-cards {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
}

.no-cards-image {
    width: 150px; /* 根据需要调整图片大小 */
    height: auto;
    margin-bottom: 20px;
    filter: grayscale(30%);
    opacity: 0.7;
}

.no-cards-text p {
    font-size: 16px;
    color: #636363;
    opacity: 0.7;
    font-weight: bold;
}

/* 添加过渡效果的 CSS 类 */
.card-list-enter-active,
.card-list-leave-active {
    transition: opacity 0.5s ease;
}

.card-list-enter-from,
.card-list-leave-to {
    opacity: 0;
}

.icon1 {
    width: 20px;
    height: 20px;
    margin-bottom: -4px;
    filter: brightness(3) invert(1);
}
</style>