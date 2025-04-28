<!-- src/views/History.vue -->
<template>
    <div class="main-place" ref="mainPlace">
        <!-- 新增日期选择器按钮 -->
        <div class="date-picker-container">
            <!-- 新增上一天按钮 -->
            <button class=" square-button" @click="goToPreviousDay" :disabled="isFirstDay">
                <img src="/public/left.svg" alt="上一天" class="icon1" />
            </button>
            <button class="date-picker-button" @click="toggleDatePicker">
                {{ formatDate(selectedDate, true) }}
            </button>
            <!-- 新增下一天按钮 -->
            <button class=" square-button" @click="goToNextDay" :disabled="isLastDay">
                <img src="/public/right.svg" alt="下一天" class="icon1" />
            </button>
            <transition name="fade">
                <div v-if="showDatePicker" class="date-picker-menu">
                    <button v-for="(date, index) in pastDates" :key="index" class="date-picker-item"
                        @click="selectDate(date)">
                        {{ formatDate(date, false) }}
                    </button>
                </div>
            </transition>
        </div>

        <div v-if="isLoading" class="loading-state">
            <div class=" no-cards-text card-description">
                <p style="font-size: 25px;letter-spacing:2px;opacity: 0.4;margin-top: -12px;">加载中...</p>
            </div>
        </div>
        <div v-else-if="cards.length === 0" class="no-cards">
            <img src="/public/neko01.png" alt="Add Cards" class="no-cards-image">
            <div class="no-cards-text card-description">
                <p>本日没有生成卡片哦</p>
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
                <div v-if="cards.length > 0" class="card" :key="'footer'"
                    style="text-align: center; font-size: 14px; color: #999;">
                    <div class="card-content">
                        <p>本站部分文本由AI生成，请注意甄别。</p>
                        <p>Powered by <a href="https://ai-daily.vastocean.work/" target="_blank">AI-Daily</a>. Made by
                            Vastocean & 2 coder.</p>
                    </div>
                </div>
            </transition-group>
            <div class="upper-main"></div>
        </div>
    </div>
    <fixed-buttons v-if="cards.length > 0" :main-place-ref="mainPlace" :cards="cards" id="buttons"></fixed-buttons>
</template>

<script>
import { ref, onMounted, nextTick, computed } from 'vue';
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
        const themeColors = ref({
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
        });

        const cards = ref([]);
        const isExpanded = ref([]);
        const isLoading = ref(true);
        const hasCardsSet = ref(false);
        const selectedDate = ref(new Date().toISOString().split('T')[0]); // 默认选中今天
        const showDatePicker = ref(false); // 新增状态变量
        const pastDates = ref([]); // 新增过去7天的日期选项

        // 修改方法：生成过去7天的日期选项
        const generatePastDates = () => {
            const dates = [];
            for (let i = 0; i < 8; i++) { // 从昨天开始，不包含当天
                const date = new Date();
                date.setDate(date.getDate() - i);
                dates.push(date.toISOString().split('T')[0]);
            }
            // 按日期从小到大排序
            pastDates.value = dates.sort((a, b) => new Date(a) - new Date(b));
        };

        // 新增方法：切换日期选择器菜单的显示状态
        const toggleDatePicker = () => {
            showDatePicker.value = !showDatePicker.value;
        };

        // 新增方法：选择某个日期并重新加载卡片数据
        const selectDate = (date) => {
            selectedDate.value = date;
            showDatePicker.value = false;
            fetchCardsByDate();
        };

        // 修改方法：格式化日期
        const formatDate = (date, includeYear = true) => {
            const [year, month, day] = date.split('-');
            if (includeYear) {
                return `${year}-${month}-${day}`;
            } else {
                return `${month}-${day}`;
            }
        };

        // 新增方法：跳转到上一天
        const goToPreviousDay = () => {
            const currentDate = new Date(selectedDate.value);
            currentDate.setDate(currentDate.getDate() - 1);
            selectedDate.value = currentDate.toISOString().split('T')[0];
            fetchCardsByDate();
        };

        // 新增方法：跳转到下一天
        const goToNextDay = () => {
            const currentDate = new Date(selectedDate.value);
            currentDate.setDate(currentDate.getDate() + 1);
            selectedDate.value = currentDate.toISOString().split('T')[0];
            fetchCardsByDate();
        };

        // 新增计算属性：判断是否为最后一天
        const isLastDay = computed(() => {
            const today = new Date().toISOString().split('T')[0];
            return selectedDate.value === today;
        });

        // 新增计算属性：判断是否为最前一天
        const isFirstDay = computed(() => {
            const firstDay = new Date();
            firstDay.setDate(firstDay.getDate() - 7);
            return selectedDate.value === firstDay.toISOString().split('T')[0];
        });

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
            const user_id = getCookie('user_id');
            try {
                isLoading.value = true; // 开始加载状态
                // 根据用户选择的日期生成查询范围
                const startDate = new Date(selectedDate.value);
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 1); // 查询范围改为单日

                // 格式化日期，增加毫秒部分
                const formattedStartDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')} 00:00:00.000`;
                const formattedEndDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')} 00:00:00.000`;

                // 调用API获取卡片数据
                const response = await axios.post(
                    `https://api.coze.cn/v1/workflow/run`,
                    {
                        workflow_id: '7498211665830838282',
                        parameters: {
                            user_id: user_id,
                            start_time: formattedStartDate,
                            end_time: formattedEndDate,
                        }
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer pat_Q2vDsDSZEeW1d3VcqVS06CVKMhYcjTWBSnSygLitFYyhAc8jy5dKzLdAsgS8YkLu`
                        }
                    }
                );

                // 解析API返回的数据
                const responseData = JSON.parse(response.data.data);
                console.log('Parsed API Response:', responseData);

                if (responseData.code === 1) {
                    // 确保API返回的数据格式正确
                    if (Array.isArray(responseData.output)) {
                        // 将API返回的卡片数据映射为前端需要的格式
                        cards.value = responseData.output.map(card => {
                            return {
                                card_type: card.card_type,
                                content: card.card_content,
                                headerImage: card.card_top_img
                            };
                        });
                        initExpandedState(); // 确保 isExpanded 状态被正确初始化
                        hasCardsSet.value = true; // 更新 hasCardsSet 状态
                        console.log(101);
                    } else {
                        console.error('Invalid data format:', responseData.output);
                        cards.value = []; // 清空卡片数据
                        hasCardsSet.value = true; // 更新 hasCardsSet 状态
                    }
                } else {
                    console.error('Failed to fetch cards:', responseData.msg);
                    cards.value = []; // 清空卡片数据
                    hasCardsSet.value = true; // 更新 hasCardsSet 状态
                }
            } catch (error) {
                console.error('Error fetching cards:', error);
                cards.value = []; // 清空卡片数据
                hasCardsSet.value = true; // 更新 hasCardsSet 状态
            } finally {
                isLoading.value = false; // 数据加载完成，关闭加载状态
                console.log(102);
                nextTick(() => {
                    retScroll(); // 调用 scrollReveal 动画
                });
                console.log(103);
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
            generatePastDates(); // 初始化过去7天的日期选项
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
            fetchCardsByDate,
            showDatePicker,
            pastDates,
            toggleDatePicker,
            selectDate,
            formatDate,
            goToPreviousDay,
            goToNextDay,
            isLastDay,
            isFirstDay,
            themeColors // 确保 themeColors 被返回，以便在模板中使用
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

/* 新增样式：日期选择器容器 */
.date-picker-container {
    position: fixed;
    top: 35px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 10px;
    /* 调整按钮间距 */
    user-select: none;
}

/* 修改样式：正方形按钮 */
.square-button {
    width: 35px;
    height: 35px;
    padding: 0;
    border-radius: 12px;
    background-image: linear-gradient(0deg, #eedde077 0%, #d7e6fc6d 95%, #d3e2f868 100%);
    color: rgb(0, 0, 0);
    border: 1.5px solid #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, border-color 0.3s ease, opacity 0.3s ease;
    box-shadow: 0px 3px 10px rgba(97, 97, 97, 0.2);
    break-inside: avoid;
    opacity: 1;
}

.square-button:hover {
    background-image: linear-gradient(0deg, #eedde0 0%, #d7e6fc 95%, #d3e2f8 100%);
    border-color: #74c8ff;
}

/* 修改样式：日期选择器按钮 */
.date-picker-button {
    width: 150px;
    height: 35px;
    border-radius: 12px;
    background-image: linear-gradient(0deg, #eedde0 0%, #d7e6fc 95%, #d3e2f8 100%);
    color: rgb(0, 0, 0);
    border: 1.5px solid #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, border-color 0.3s ease, opacity 0.3s ease;
    box-shadow: 0px 3px 10px rgba(98, 98, 98, 0.2);
    break-inside: avoid;
    opacity: 1;
}

.date-picker-button:hover {
    background-image: linear-gradient(0deg, #f4d5da 0%, #c3d8f7 99%, #b6d2f8 100%);
    border-color: #0199ff;
}

/* 修改样式：日期选择器二级菜单 */
.date-picker-menu {
    position: absolute;
    top: 43px;
    left: 50%;
    transform: translateX(-50%);
    width: 450px;
    background-color: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(137, 137, 137, 0.6);
    z-index: 1001;
    padding: 2px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.6);
    box-shadow: 0px 2px 10px rgba(216, 216, 216, 0.25);
    backdrop-filter: blur(7.5px);
    display: flex;
    justify-content: space-between;
    transition: opacity 0.3s ease, transform 0.3s ease;
    
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* 修改样式：日期选择器菜单项 */
.date-picker-item {
    width: 50px;
    height: 30px;
    border-radius: 12px;
    background-image: linear-gradient(0deg, #e2e2e2 0%, #d6d6d6 99%, #ababab 100%);
    color: rgb(0, 0, 0);
    border: 1.5px solid #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, border-color 0.3s ease, opacity 0.3s ease;
    opacity: 1;
    font-size: 12px;
}

.date-picker-item:hover {
    background-image: linear-gradient(0deg, #eeeeee 0%, #dfdfdf 99%, #a7a7a7 100%);
    border-color: #909090;
}

/* 新增样式：日期选择器按钮图标 */
.icon1 {
    width: 12px;
    height: 12px;
    margin-bottom: -2px;
    filter: brightness(3) invert(1);
}
</style>

