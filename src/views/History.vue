<!-- src/views/History.vue -->
<template>
    <div class="main-place" ref="mainPlace">
        <div style="margin-bottom: 20px;">
            <label for="date-selector">选择日期：</label>
            <input type="date" id="date-selector" v-model="selectedDate" @change="fetchCardsByDate">
        </div>

        <div v-if="isLoading" class="loading-state">
            <img src="@/assets/img/logo.png" alt="Logo" class="loading-logo"
                style="opacity: 0.6; padding-right: 3px;">
            <div class=" no-cards-text card-description">
                <p style="font-size: 25px;letter-spacing:5px;opacity: 0.4;margin-top: -12px;">晨析智报</p>
            </div>
        </div>
        <div v-else-if="cards.length === 0 && hasCardsSet" class="no-cards">
            <img src="/public/neko01.png" alt="Add Cards" class="no-cards-image">
            <div class="no-cards-text card-description">
                <p>没有找到相关卡片</p>
            </div>
        </div>
        <div v-else-if="cards.length === 0" class="no-cards">
            <img src="/public/neko01.png" alt="Add Cards" class="no-cards-image">
            <div class="no-cards-text card-description">
                <p>还没有历史卡片哦</p>
            </div>
        </div>
        <div v-else>
            <transition-group name="card-list" tag="div" class="card-container">
                <div v-for="(card, index) in cards" :key="index" class="card"
                    :class="{ 'has-header-image': card.headerImage, 'has-theme-color': !card.headerImage && themeColors[card.card_type] }"
                    :style="{ '--theme-color': !card.headerImage ? themeColors[card.card_type] : '' }">
                    <div class="card-header" :style="{ backgroundImage: `url(${card.headerImage || ''})` }"></div>
                    <div class="card-content-container"
                        :style="{ maxHeight: isExpanded[index] ? 'none' : '300px', overflow: 'hidden' }">
                        <div class="card-content" v-html="renderMarkdown(card.content)"></div>
                    </div>
                    <button v-if="card.content.length > 200" class="expand-button" @click="toggleExpand(index)">
                        <img v-if="isExpanded[index]" src="/public/up.svg" alt="收起" class="icon1" />
                        <img v-else src="/public/down.svg" alt="展开" class="icon1" />
                    </button>
                </div>
                <div v-if="cards.length > 0" class="card" :key="'footer'" style="text-align: center; font-size: 14px; color: #999;">
                    <div class="card-content">
                        <p>本站部分文本由AI生成，请注意甄别。</p>
                        <p>Powered by <a href="https://ai-daily.vastocean.work/" target="_blank">AI-Daily</a>. Made by Vastocean & 2 coder.</p>
                    </div>
                </div>
            </transition-group>
            <div class="upper-main"></div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue';
import MarkdownIt from 'markdown-it';
import FixedButtons from '../components/FixedButtons.vue';
import scrollReveal from 'scrollreveal';
import axios from 'axios';
import { getCookie } from '@/utils/cookieUtils';

const md = new MarkdownIt();

export default {
    components: {
        FixedButtons,
    },
    setup() {
        const sr = ref(null);
        const themeColors = {
            weather: '#fff3bf',
            fortune: '#e5dbff',
            news: '#fcc2d7',
            text: '#ffe8cc',
            newstop: '#ffc9c9',
            health: '#d3f9d8',
            music: '#ffd8a8',
            traffic: '#a5d8ff',
            economy: '#ffdeeb',
            calendar: '#d0ebff',
            customAI: '#ced4da'
        };

        const cards = ref([]);
        const isExpanded = ref([]);
        const isLoading = ref(true);
        const hasCardsSet = ref(false);
        const selectedDate = ref(new Date().toISOString().split('T')[0]); // 默认选中今天

        const initExpandedState = () => {
            isExpanded.value = cards.value.map(() => false);
        };

        const toggleExpand = (index) => {
            isExpanded.value[index] = !isExpanded.value[index];
        };

        const renderMarkdown = (content) => {
            return md.render(content);
        };

        // 根据日期获取卡片数据
        const fetchCardsByDate = async () => {
            const user_id = getCookie('user_id') || 'fc08b2f5-dbe8-4aaa-a842-417e5238ee87'; 
            try {
                const startDate = new Date(selectedDate.value);
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 7); // 获取7天内的数据

                const formattedStartDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')} 00:00:00`;
                const formattedEndDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')} 23:59:59`;

                const response = await axios.post(
                    `https://api.coze.cn/v1/workflow/run`,
                    {
                        workflow_id: '7496415888914087988',
                        parameters: {
                            user_id: user_id,
                            start_time: formattedStartDate
                        }
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer pat_Q2vDsDSZEeW1d3VcqVS06CVKMhYcjTWBSnSygLitFYyhAc8jy5dKzLdAsgS8YkLu`
                        }
                    }
                );

                const responseData = JSON.parse(response.data.data);

                if (responseData.code === 1) {
                    cards.value = responseData.output.map(card => {
                        return {
                            card_type: card.card_type || '',
                            content: card.card_content || '',
                            headerImage: card.card_top_img || ''
                        };
                    });
                    initExpandedState();
                } else {
                    console.error('Failed to fetch cards:', responseData.msg);
                }
            } catch (error) {
                console.error('Error fetching cards:', error);
            } finally {
                isLoading.value = false;
                nextTick(() => {
                    retScroll();
                });
            }
        };

        const retScroll = () => {
            if (sr.value) {
                sr.value.destroy();
            }
            sr.value = scrollReveal();
            sr.value.reveal('.card', {
                duration: 500,
                delay: 100,
                origin: 'bottom',
                reset: false,
                mobile: true,
                distance: '10px',
                opacity: 0.001,
                easing: 'cubic-bezier(0.5, 0, 0, 1)',
                scale: 0.9,
                beforeReveal: function (ele) {
                    console.log('Card revealed');
                },
            });
            sr.value.reveal('#buttons', {
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
                    console.log('Buttons revealed');
                },
            });
        };

        onMounted(async () => {
            await fetchCardsByDate();
            retScroll();
        });

        const mainPlace = ref(null);

        return {
            cards,
            isExpanded,
            toggleExpand,
            renderMarkdown,
            mainPlace,
            isLoading,
            hasCardsSet,
            selectedDate,
            fetchCardsByDate
        };
    },
};
</script>

<style scoped>
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
    z-index: 1;
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
    height: 200px;
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
    height: 50px;
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

.card-content p {
    margin-bottom: 0.5em;
}

.card-content ul,
.card-content ol {
    padding-left: 1.5em;
    margin: 1em 0;
}

.card-content li {
    margin: 0.4em 0;
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
    transition: color 0.2s;
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
    width: 150px;
    height: auto;
    margin-bottom: 20px;
    filter: grayscale(30%);
    opacity: 0.5;
}

.no-cards-text p {
    font-size: 16px;
    color: #636363;
    opacity: 0.5;
    font-weight: bold;
}

.loading-state {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 18px;
    color: #636363;
}

.loading-logo {
    width: 100px;
    height: auto;
    margin-bottom: 20px;
}

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

.upper-main {
    height: 50px;
}

.card-content-container {
    overflow: hidden;
    transition: max-height 0.3s ease;
    will-change: max-height;
}

.expand-button {
    display: block;
    width: 100%;
    padding-top: -10px;
    padding: 3px;
    border: none;
    background-color: #f0f0f000;
    cursor: pointer;
    text-align: center;
    font-size: 14px;
    transition: background-color 0.2s ease;
}

.expand-button:hover {
    background-color: #e0e0e031;
}
</style>