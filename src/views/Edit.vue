<template>
    <div class="edit-container">
        <div class="left-panel">
            <div class="card">
                <h2>添加新卡片</h2>
                <el-dropdown @command="addCard">
                    <el-button type="primary">添加卡片</el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="weather">天气</el-dropdown-item>
                            <el-dropdown-item command="fortune">运势</el-dropdown-item>
                            <el-dropdown-item command="news">定点新闻</el-dropdown-item>
                            <el-dropdown-item command="text">自定义文本</el-dropdown-item>
                            <el-dropdown-item command="newstop">热点新闻</el-dropdown-item>
                            <el-dropdown-item command="health">健康</el-dropdown-item>
                            <el-dropdown-item command="music">音乐</el-dropdown-item>
                            <el-dropdown-item command="traffic">交通</el-dropdown-item>
                            <el-dropdown-item command="economy">经济</el-dropdown-item>
                            <el-dropdown-item command="calendar">每日日历</el-dropdown-item>
                            <el-dropdown-item command="customAI">自定义AI</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <div class="card-buttons">
                    <el-button 
                        v-for="(color, type) in themeColors" 
                        :key="type" 
                        @click="addCard(type)"
                        :style="{ border: `2px dashed ${color}` }"
                        class="card-button"
                    >
                        {{ getEmoji(type) }} {{ getChineseType(type) }}
                    </el-button>
                </div>
                <div class="time-setting">
                    <el-form label-position="left" label-width="100px">
                        <el-form-item label="生成时间">
                            <el-time-picker v-model="generateTime" format="HH:mm" placeholder="选择时间"></el-time-picker>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="action-buttons">
                    <el-button type="primary" @click="saveChanges">保存</el-button>
                    <el-button @click="discardChanges">放弃更改</el-button>
                </div>
            </div>
        </div>
        <div class="right-panel">
            <transition-group name="card-list" tag="div" class="card-container">
                <div v-for="(card, index) in cards" :key="card.id" class="card"
                    :class="{ 'has-header-image': card.headerImage, 'has-theme-color': !card.headerImage && themeColors[card.type] }"
                    :style="{ '--theme-color': !card.headerImage ? themeColors[card.type] : '' }">

                    <div class="card-actions">
                        <img src="/up.svg" alt="up" @click="moveCardUp(index)" />
                        <img src="/down.svg" alt="down" @click="moveCardDown(index)" />
                        <el-dropdown @command="handleChangeCardType(index, $event)">
                            <img src="/change.svg" alt="change" />
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item v-for="(color, type) in themeColors" :key="type"
                                        :command="type">{{ type }}</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                        <img src="/delete.svg" alt="delete" @click="deleteCard(index)" />
                    </div>

                    <el-form label-position="left" label-width="100px" class="form-right-align">
                        <div v-if="card.type === 'weather'">
                            <h2>☀️ 天气</h2>
                            <el-form-item label="城市">
                                <el-input v-model="card.city" />
                            </el-form-item>
                            <el-form-item label="IP">
                                <el-input v-model="card.ip" />
                                <el-button @click="getIP">获取IP</el-button>
                            </el-form-item>
                            <el-form-item label="更多需求">
                                <el-input type="textarea" v-model="card.requirement"
                                    :autosize="{ minRows: 2, maxRows: 6 }" placeholder="请用自然语言描述需求" />
                            </el-form-item>
                        </div>
                        <div v-else-if=" card.type==='newstop'">
                            <h2>📰 热点新闻</h2>
                            <el-form-item label=" 生成图片">
                                <el-switch v-model="card.generateImage" />
                            </el-form-item>
                        </div>
                        <div v-else-if="card.type === 'news'">
                            <h2>🗞️ 定点新闻</h2>
                            <el-form-item label=" 生成图片">
                                <el-switch v-model="card.generateImage" />
                            </el-form-item>
                            <el-form-item label="类型关键词">
                                <el-input v-model="card.typeKeywords" />
                            </el-form-item>
                        </div>
                        <div v-else-if="card.type === 'health'">
                            <h2>🏥 健康</h2>
                            <el-form-item label="身高">
                                <el-input v-model="card.height" />
                            </el-form-item>
                            <el-form-item label="体重">
                                <el-input v-model="card.weight" />
                            </el-form-item>
                            <el-form-item label="年龄">
                                <el-input v-model="card.age" />
                            </el-form-item>
                            <el-form-item label="需求">
                                <el-input type="textarea" v-model="card.requirement"
                                    :autosize="{ minRows: 2, maxRows: 6 }" placeholder="请用自然语言描述需求" />
                            </el-form-item>
                        </div>
                        <div v-else-if="card.type === 'music'">
                            <h2>🎵 音乐</h2>
                            <el-form-item label="音质">
                                <el-select v-model="card.quality">
                                    <el-option label="标准" value="standard" />
                                    <el-option label="高清" value="high" />
                                    <el-option label="无损" value="lossless" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="喜爱偏向">
                                <el-input v-model="card.preference" />
                            </el-form-item>
                        </div>
                        <div v-else-if="card.type === 'traffic'">
                            <h2>🚗 交通</h2>
                            <el-form-item label="出行方式">
                                <el-select v-model="card.transport">
                                    <el-option label="步行" value="walk" />
                                    <el-option label="驾车" value="drive" />
                                    <el-option label="公共交通" value="public" />
                                    <el-option label="骑行" value="bike" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="起始地">
                                <el-input v-model="card.start" />
                            </el-form-item>
                            <el-form-item label="目的地">
                                <el-input v-model="card.destination" />
                            </el-form-item>
                            <el-form-item label="IP 地址">
                                <el-input v-model="card.ip" />
                                <el-button @click="getIP">获取IP</el-button>
                            </el-form-item>
                        </div>
                        <div v-else-if="card.type === 'fortune'">
                            <h2>🔮 运势</h2>
                            <el-form-item label="生成图片">
                                <el-switch v-model="card.generateImage" />
                            </el-form-item>
                            <el-form-item label="生肖">
                                <el-input v-model="card.zodiac" />
                            </el-form-item>
                            <el-form-item label="星座">
                                <el-input v-model="card.constellation" />
                            </el-form-item>

                        </div>
                        <div v-else-if="card.type === 'economy'">
                            <h2>📈 经济</h2>
                            <el-form-item label="生成图片">
                                <el-switch v-model="card.generateImage" />
                            </el-form-item>
                            <el-form-item label="信息类型">
                                <el-input v-model="card.infoType" />
                            </el-form-item>
                        </div>
                        <div v-else-if="card.type === 'calendar'">
                            <h2>📅 每日日历</h2>
                            <el-form-item label="名言警句类型">
                                <el-input v-model="card.quoteType" />
                            </el-form-item>
                            <el-form-item label="图像提示词">
                                <el-input type="textarea" v-model="card.imagePrompt"
                                    :autosize="{ minRows: 2, maxRows: 6 }" placeholder="请用自然语言描述日历展示或生成需求" />
                            </el-form-item>
                        </div>
                        <div v-else-if="card.type === 'text'">
                            <h2>🏷️ 自定义文本</h2>
                            <el-form-item label="卡片标题">
                                <el-input v-model="card.title" />
                            </el-form-item>
                            <el-form-item label="头图链接">
                                <el-input placeholder="留空则不展示头图" v-model="card.headerImageLink" />
                            </el-form-item>
                            <el-form-item label="正文内容">
                                <el-input type="textarea" v-model="card.content" :autosize="{ minRows: 2, maxRows: 6 }"
                                    placeholder="请用自然语言描述需求" />
                            </el-form-item>
                        </div>
                        <div v-else-if="card.type === 'customAI'">
                            <h2>🤖 自定义AI</h2>
                            <el-form-item label="需求">
                                <el-input type="textarea" v-model="card.requirement"
                                    :autosize="{ minRows: 2, maxRows: 6 }" placeholder="请用自然语言描述需求" />
                            </el-form-item>
                        </div>
                        <div v-else>
                            <el-form-item label="ID:">
                                <el-input v-model="card.id" />
                            </el-form-item>
                            <el-form-item label="类型:">
                                <el-select v-model="card.type">
                                    <el-option v-for="(color, type) in themeColors" :key="type" :label="type"
                                        :value="type" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="排序:">
                                <el-input-number v-model="card.order" />
                            </el-form-item>
                            <el-form-item label="标题:">
                                <el-input v-model="card.title" />
                            </el-form-item>
                            <el-form-item label="内容:">
                                <el-input type="textarea" v-model="card.content" />
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
            </transition-group>
        </div>
    </div>
</template>

<script>
import { ElButton, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElInputNumber, ElCheckbox, ElDatePicker, ElDropdown, ElDropdownMenu, ElDropdownItem, ElSwitch } from 'element-plus';

export default {
    name: 'Edit',
    components: {
        ElButton,
        ElSwitch,
        ElForm,
        ElFormItem,
        ElInput,
        ElSelect,
        ElOption,
        ElInputNumber,
        ElCheckbox,
        ElDatePicker,
        ElDropdown,
        ElDropdownMenu,
        ElDropdownItem
    },
    data() {
        return {
            generateTime: '',
            cards: [],
            themeColors: {
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
            }
        };
    },
    methods: {
        getEmoji(type) {
            const emojiMap = {
                weather: '☀️',
                fortune: '🔮',
                news: '🗞️',
                text: '🏷️',
                newstop: '📰',
                health: '🏥',
                music: '🎵',
                traffic: '🚗',
                economy: '📈',
                calendar: '📅',
                customAI: '🤖'
            };
            return emojiMap[type] || '📄';
        },
        getChineseType(type) {
            const chineseTypeMap = {
                weather: '天气',
                fortune: '运势',
                news: '定点新闻',
                text: '自定义文本',
                newstop: '热点新闻',
                health: '健康',
                music: '音乐',
                traffic: '交通',
                economy: '经济',
                calendar: '每日日历',
                customAI: '自定义AI'
            };
            return chineseTypeMap[type] || '未知';
        },
        saveChanges() {
            // 保存更改的逻辑
        },
        discardChanges() {
            // 放弃更改的逻辑
        },
        addCard(type = 'text') {
            this.cards.push({
                id: Date.now(),
                type: type,
                order: this.cards.length + 1,
                title: '',
                content: '',
                headerImage: '',
                city: '',
                ip: '',
                requirement: '',
                height: '',
                weight: '',
                age: '',
                quality: 'standard',
                preference: '',
                transport: 'walk',
                start: '',
                destination: '',
                zodiac: '',
                constellation: '',
                generateImage: false,
                infoType: '',
                quoteType: '',
                imagePrompt: ''
            });
        },
        getIP() {
            // 获取IP的逻辑
        },
        handleChangeCardType(index, type) {
            this.cards[index].type = type;
        },
        moveCardUp(index) {
            if (index > 0) {
                const temp = this.cards[index];
                this.cards[index] = this.cards[index - 1];
                this.cards[index - 1] = temp;
            }
        },
        moveCardDown(index) {
            if (index < this.cards.length - 1) {
                const temp = this.cards[index];
                this.cards[index] = this.cards[index + 1];
                this.cards[index + 1] = temp;
            }
        },
        deleteCard(index) {
            this.cards.splice(index, 1);
        }
    }
};
</script>

<style scoped>
.edit-container {
    display: flex;
    width: 1400px;
    margin: 0 auto;
    padding: 20px;
    color: #000;
    height: 100vh; /* 设置高度为100% */
}

.left-panel {
    width: 30%;
    padding: 20px;
    height: 100%;
    overflow: hidden; /* 左半部分不可滚动 */
}

.right-panel {
    width: 70%;
    padding: 20px;
    height: 100%;
    overflow-y: auto; /* 右半部分可以滚动 */
}

.right-panel .card-container {
    column-count: 2;
    column-gap: 20px; /* 两列间距 */
}

.left-panel .card {
    width: 100%;
    padding: 20px;
    height: auto;
}

.right-panel .card {
    width: 100%;
}

.edit-container h2{
    font-weight: bold;
    padding-bottom: 15px;
}

.card {
    background-color: #fff;
    padding-top: 20px;
    padding-left: 25px;
    padding-right: 25px;
    padding-bottom: 8px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    break-inside: avoid;
    margin-bottom: 20px;
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

.card-row {
    margin-bottom: 10px;
}

.card-row label {
    display: block;
    margin-bottom: 5px;
    color: #2c3e50;
    font-weight: bold;
}

.card-row input,
.card-row textarea,
.card-row select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 14px;
    color: #333;
    line-height: 1.6;
}

.card-row textarea {
    height: 100px;
    resize: vertical;
}

.time-setting {
    margin-top: 20px;
}

button {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #409eff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 14px;
}

button:hover {
    background-color: #66b1ff;
    color: #fff;
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

/* 移植 Home.vue 中的文字样式 */
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

.card-actions {
    position: absolute;
    top: 30px;
    right: 25px;
    display: flex;
    gap: 5px;
    z-index: 2;
}

.card-actions img {
    width: 18px;
    height: 18px;
    cursor: pointer;
    transition: opacity 0.2s;
    opacity: 0.6;
    
}

.card-actions img:hover {
    opacity: 1;
}

.form-right-align .el-form-item__content {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

/* 修改 textarea 的样式，使文字颜色变淡 */
.el-textarea__inner {
    color: #999; /* 设置文字颜色为浅灰色 */
}

/* 确保 textarea 可编辑 */
.el-textarea__inner:read-only {
    background-color: #fff; /* 保持背景为白色 */
    cursor: text; /* 设置光标为文本输入状态 */
}

.card-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 两列布局 */
    gap: 10px;
    margin-top: 20px;
}

.action-buttons {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
}

.card-button {
    width: 100%;
    padding: 10px;
    text-align: center;
    background-color: #fff;
    color: #000;
    transition: background-color 0.3s;
}

.card-button:hover {
    background-color: #f5f5f5;
}
</style>