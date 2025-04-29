<template>
    <div class="edit-container">
        <div class="left-panel">
            <div class="card" style="padding-left: 28px;">
                <h1 style="font-weight:600; margin-bottom: 5px;">编辑</h1>
                <el-dropdown @command="addCard">
                    <el-button type="primary" style="width: 249px;">添加卡片</el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="calendar">日历</el-dropdown-item>
                            <el-dropdown-item command="weather">天气</el-dropdown-item>
                            <el-dropdown-item command="fortune">运势</el-dropdown-item>
                            <el-dropdown-item command="news">定点新闻</el-dropdown-item>
                            <el-dropdown-item command="newstop">热点新闻</el-dropdown-item>
                            <el-dropdown-item command="health">健康</el-dropdown-item>
                            <el-dropdown-item command="music">音乐</el-dropdown-item>
                            <el-dropdown-item command="traffic">出行</el-dropdown-item>
                            <el-dropdown-item command="economy">财经</el-dropdown-item>
                            <el-dropdown-item command="text">自定义文本</el-dropdown-item>
                            <el-dropdown-item command="customAI">自定义应用</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>

                <div class="card-buttons">
                    <el-button style="margin: 0px;" v-for="(color, type) in themeColors" :key="type"
                        @click="addCard(type)" :style="{ border: `1px dashed ${color}` }" class="card-button">
                        {{ getEmoji(type) }} {{ getChineseType(type) }}
                    </el-button>
                </div>
                <br>
                <div class="time-setting">
                    <el-form label-position="left" label-width="87px" style="margin-top: -20px;">
                        <el-form-item label="生成时间">
                            <el-time-select v-model="generateTime" format="HH:mm" placeholder="未选择" start="0:00"
                                end="23:50" step="00:10" clearable="false" editable="false" label-width="10px"
                                style="width: 163px" :class="{ 'required-field': !generateTime }"></el-time-select>
                        </el-form-item>
                        <p style=" font-size: 12px;color:darkgray; margin-bottom: 15px;">
                            此处填写的时间为早报内容开始生成的时间点。支持手动输入和列表选择，只允许填入10分钟的倍数的时间。设定有误可能导致生成重复卡片。
                        </p>
                        <p style=" font-size: 12px;color:darkgray;">
                            从生成程序启动到内容展示，通常需要5-10分钟的处理时间。为确保您能及时获取早报，建议将设定时间提前 10 分钟，以获得更流畅的体验。
                        </p>
                    </el-form>
                    <p style="font-size: 12px;color: #ff8787; margin-top: 15px;">
                        重要提示：请务必填写所有卡片的必填参数，并确保参数准确无误。错误或随意填写参数可能导致内容异常或数据偏差！</p>
                </div>
                <el-button style="width: 80px; margin-top: 20px;" @click="showDiscardDialog" plain type="danger"
                    :disabled="loading">
                    放弃更改
                </el-button>
                <el-button type="primary" style="width: 162px; margin-top: 20px;" @click="manualSave"
                    :loading="loading">
                    保存
                </el-button>
            </div>
        </div>
        <div class="right-panel">
            <transition-group name="card-list" tag="div" class="card-container">
                <div v-for="(card, index) in cards" :key="card.card_id" class="card"
                    :class="{ 'has-header-image': card.headerImage, 'has-theme-color': !card.headerImage && themeColors[card.type] }"
                    :style="{ '--theme-color': !card.headerImage ? themeColors[card.type] : '' }">

                    <div class="card-actions">
                        <el-tooltip content="上移" placement="top" effect="light">
                            <img src="/up.svg" alt="up" @click="moveCardUp(index)" />
                        </el-tooltip>
                        <el-tooltip content="下移" placement="top" effect="light">
                            <img src="/down.svg" alt="down" @click="moveCardDown(index)" />
                        </el-tooltip>

                        <el-popconfirm title="确认删除?" confirm-button-type="danger">
                            <template #reference>

                                <img src="/delete.svg" alt="delete" style="width: 16px;" />

                            </template>
                            <template #actions>
                                <el-button size="small" @click="deleteCard(index)">
                                    删除
                                </el-button>
                            </template>
                        </el-popconfirm>

                    </div>
                    <el-tooltip content="卡片序号" placement="top" effect="light">
                        <el-text class="card-id-display">
                            # {{ card.card_number }}
                        </el-text>
                    </el-tooltip>

                    <el-form label-position="left" label-width="100px" class="form-right-align">
                        <div v-if="card.type === 'calendar'">
                            <h2>📅 日历</h2>
                            <el-form-item label=" 生成图片">
                                <el-switch v-model="card.generateImage" />
                            </el-form-item>
                        </div>
                        <div v-else-if="card.type === 'weather'">
                            <h2>☀️ 天气</h2>
                            <el-form-item label=" 生成图片">
                                <el-switch v-model="card.generateImage" />
                            </el-form-item>
                            <el-form-item label="城市">
                                <el-input v-model="card.city" placeholder="IP或城市必填一项"
                                    :class="{ 'required-field': !card.city && !card.ip }" />
                            </el-form-item>
                            <el-form-item label="IP">
                                <el-input v-model="card.ip" placeholder="如不能自动获取，可手动输入"
                                    :class="{ 'required-field': !card.city && !card.ip }" />
                                <el-button @click="getIP(index)" :loading="card.ipLoading">获取IP</el-button>
                            </el-form-item>
                            <el-form-item label="更多需求">
                                <el-input type="textarea" v-model="card.requirement"
                                    :autosize="{ minRows: 2, maxRows: 6 }" placeholder="必填，请用自然语言描述需求"
                                    :class="{ 'required-field': !card.requirement }" />
                            </el-form-item>
                        </div>
                        <div v-else-if="card.type === 'newstop'">
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
                            <el-form-item label="新闻类型">
                                <el-input v-model="card.typeKeywords" :class="{ 'required-field': !card.typeKeywords }"
                                    placeholder="必填，如“科技”" />
                            </el-form-item>
                        </div>
                        <div v-else-if="card.type === 'health'">
                            <h2>🏥 健康</h2>
                            <el-form-item label="身高">
                                <el-input v-model="card.height" placeholder="选填" />
                            </el-form-item>
                            <el-form-item label="体重">
                                <el-input v-model="card.weight" placeholder="选填" />
                            </el-form-item>
                            <el-form-item label="年龄">
                                <el-input v-model="card.age" placeholder="选填" />
                            </el-form-item>
                            <el-form-item label="目标和需求">
                                <el-input type="textarea" v-model="card.requirement"
                                    :autosize="{ minRows: 2, maxRows: 6 }" placeholder="必填，请用自然语言描述目标和需求"
                                    :class="{ 'required-field': !card.requirement }" />
                            </el-form-item>
                        </div>
                        <div v-else-if="card.type === 'music'">
                            <h2>🎵 音乐</h2>
                            <el-form-item label="音质">
                                <el-select v-model="card.quality">
                                    <el-option label="标准" value="standard" />
                                    <el-option label="高清" value="higher" />
                                    <el-option label="无损" value="lossless" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="喜爱偏向">
                                <el-input v-model="card.preference" placeholder="选填，如“民谣”" />
                            </el-form-item>
                        </div>
                        <div v-else-if="card.type === 'traffic'">
                            <h2>🚗 出行</h2>
                            <el-form-item label="出行方式">
                                <el-select v-model="card.transport">
                                    <el-option label="任意" value="任意" />
                                    <el-option label="步行" value="walk" />
                                    <el-option label="驾车" value="drive" />
                                    <el-option label="公共交通" value="public" />
                                    <el-option label="骑行" value="bike" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="起始地">
                                <el-input v-model="card.start" placeholder="起始地或定位位置必填一项"
                                    :class="{ 'required-field': !card.start && !card.location }" />
                            </el-form-item>
                            <el-form-item label="经纬度位置">
                                <el-input v-model="card.location" placeholder="如不能自动获取，可手动输入"
                                    :class="{ 'required-field': !card.start && !card.location }" />
                                <el-button @click="getLocation(index)" :loading="card.locationLoading">获取位置</el-button>
                            </el-form-item>
                            <el-form-item label="目的地">
                                <el-input v-model="card.destination" placeholder="必填"
                                    :class="{ 'required-field': !card.destination }" />
                            </el-form-item>

                        </div>
                        <div v-else-if="card.type === 'fortune'">
                            <h2>🔮 运势</h2>
                            <el-form-item label="生成图片">
                                <el-switch v-model="card.generateImage" />
                            </el-form-item>
                            <el-form-item label="生肖">
                                <el-input v-model="card.zodiac" placeholder="选填" />
                            </el-form-item>
                            <el-form-item label="星座">
                                <el-input v-model="card.constellation" placeholder="选填" />
                            </el-form-item>

                        </div>
                        <div v-else-if="card.type === 'economy'">
                            <h2>📈 财经</h2>
                            <el-form-item label="生成图片">
                                <el-switch v-model="card.generateImage" disabled />
                            </el-form-item>
                            <el-form-item label="信息类型">
                                <el-input v-model="card.infoType" placeholder="选填" />
                            </el-form-item>
                        </div>

                        <div v-else-if="card.type === 'text'">
                            <h2>🏷️ 自定义文本</h2>
                            <el-form-item label="头图链接">
                                <el-input placeholder="选填，留空则不展示头图" v-model="card.headerImageLink" />
                            </el-form-item>
                            <el-form-item label="正文内容">
                                <el-input type="textarea" v-model="card.content" :autosize="{ minRows: 4, maxRows: 6 }"
                                    placeholder="必填，可使用Markdown语法填写文本，将自动转译。第一行使用 # 为开头则可作为卡片标题"
                                    :class="{ 'required-field': !card.content }" />
                            </el-form-item>
                        </div>
                        <div v-else-if="card.type === 'customAI'">
                            <h2>✨ 自定义应用</h2>
                            <el-form-item label="需求">
                                <el-input type="textarea" v-model="card.requirement"
                                    :autosize="{ minRows: 4, maxRows: 6 }"
                                    placeholder="必填，请用自然语言描述需求，Agent将根据您的需求智能生成内容"
                                    :class="{ 'required-field': !card.requirement }" />
                            </el-form-item>
                        </div>
                        <div v-else>
                            <el-form-item label="ID:">
                                <el-input v-model="card.card_id" />
                            </el-form-item>
                            <el-form-item label="类型:">
                                <el-select v-model="card.type">
                                    <el-option v-for="(color, type) in themeColors" :key="type" :label="type"
                                        :value="type" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="排序:">
                                <el-input-number v-model="card.card_number" />
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
                <div v-if="cards.length === 0" class="no-cards">
                    <img src="/public/neko01.png" alt="No Cards" />
                    <p>没有卡片哦</p>
                    <p>可在左侧列表中添加新的卡片</p>
                </div>
            </transition-group>
        </div>
        <el-dialog v-model="discardDialogVisible" title="提示" width="30%">
            <span>确定要放弃所有更改吗？</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="discardDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="discardChanges">确定</el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>

<script>
import { ElButton, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElInputNumber, ElCheckbox, ElDatePicker, ElDropdown, ElDropdownMenu, ElDropdownItem, ElSwitch, ElMessage, ElTimePicker, ElDialog, ElLoading } from 'element-plus';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { getCookie } from '@/utils/cookieUtils';
import ScrollReveal from 'scrollreveal';

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
        ElDropdownItem,
        ElMessage,
        ElTimePicker,
        ElDialog,
        ElLoading
    },
    data() {
        return {
            generateTime: '',
            discardDialogVisible: false,
            isDirty: false,
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
            },
            loading: false,
            timeApiUrl: 'https://api.coze.cn/v1/workflow/run',
            ipLoading: false,
            locationLoading: false,
            loadingState: true
        };
    },
    methods: {
        showDiscardDialog() {
            this.discardDialogVisible = true;
        },
        discardChanges() {
            this.discardDialogVisible = false;
            window.location.href = "/edit";

        },
        beforeUnloadHandler(event) {
            if (this.isDirty) {
                event.preventDefault();
                event.returnValue = '您有未保存的更改，确定要离开吗？';
            }
        },
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
                customAI: '✨'
            };
            return emojiMap[type] || '📄';
        },
        getChineseType(type) {
            const chineseTypeMap = {
                calendar: '日历',
                weather: '天气',
                fortune: '运势',
                news: '定点新闻',
                newstop: '热点新闻',
                health: '健康',
                music: '音乐',
                traffic: '出行',
                economy: '财经',
                text: '自定义文本',
                customAI: '自定义应用'
            };
            return chineseTypeMap[type] || '未知';
        },
        saveChanges() {

            if (this.cards.length === 0) {
                return;
            }

            this.cards.forEach((card) => {
                let relevantParams = {};
                switch (card.type) {
                    case 'weather':
                        relevantParams = {
                            generateImage: card.generateImage,
                            city: card.city,
                            ip: card.ip,
                            requirement: card.requirement
                        };
                        break;
                    case 'calendar':
                        relevantParams = {
                            generateImage: card.generateImage
                        };
                        break;
                    case 'news':
                        relevantParams = {
                            generateImage: card.generateImage,
                            typeKeywords: card.typeKeywords
                        };
                        break;
                    case 'newstop':
                        relevantParams = {
                            generateImage: card.generateImage
                        };
                        break;
                    case 'health':
                        relevantParams = {
                            height: card.height,
                            weight: card.weight,
                            age: card.age,
                            requirement: card.requirement
                        };
                        break;
                    case 'music':
                        relevantParams = {
                            quality: card.quality,
                            preference: card.preference
                        };
                        break;
                    case 'traffic':
                        relevantParams = {
                            transport: card.transport,
                            start: card.start,
                            destination: card.destination,
                            location: card.location
                        };
                        break;
                    case 'fortune':
                        relevantParams = {
                            generateImage: card.generateImage,
                            zodiac: card.zodiac,
                            constellation: card.constellation
                        };
                        break;
                    case 'economy':
                        relevantParams = {
                            generateImage: card.generateImage,
                            infoType: card.infoType
                        };
                        break;
                    case 'text':
                        relevantParams = {
                            title: card.title,
                            headerImageLink: card.headerImageLink,
                            content: card.content
                        };
                        break;
                    case 'customAI':
                        relevantParams = {
                            requirement: card.requirement
                        };
                        break;
                    default:
                        relevantParams = {};
                }

                // 构造保存数据
                const cardData = {
                    card_id: card.card_id,
                    data_type: card.type,
                    card_number: card.card_number,
                    data: JSON.stringify({
                        ...relevantParams,
                        card_number: card.card_number
                    })
                };

                // 调用API保存卡片信息
                axios.post(
                    `https://api.coze.cn/v1/workflow/run`,
                    {
                        workflow_id: '7496722349124993061',
                        parameters: {
                            user_id: getCookie('user_id'),
                            card_id: cardData.card_id,
                            data_type: cardData.data_type,
                            data: cardData.data,
                            card_number: cardData.card_number
                        }
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer pat_kxaimeTxC6QbMo4K9N0VOzTS7LFzS9HV1yPkfpe5f8yLEboKwSrcV1Gwhynixuum`
                        }
                    }
                ).then(response => {
                    const responseData = JSON.parse(response.data.data);
                    if (responseData.code === 1) {
                        console.log(`Card ${cardData.card_id} saved successfully`);
                    } else {
                        console.error(`Failed to save card ${cardData.card_id}:`, responseData.msg);
                    }
                }).catch(error => {
                    console.error(`Error saving card ${cardData.card_id}:`, error);
                });
            });
        },
        addCard(type = 'text') {
            this.cards.push({
                card_id: Date.now(),
                type: type,
                card_number: this.cards.length + 1,
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
                transport: '任意',
                start: '',
                destination: '',
                zodiac: '',
                constellation: '',
                generateImage: true,
                infoType: '财经资讯',
                typeKeywords: '',
                location: '',
                headerImageLink: ''
            });

            // 动态应用 scrollReveal 动画到新添加的卡片
            this.$nextTick(() => {
                const sr = ScrollReveal({
                    origin: 'bottom',
                    distance: '10px',
                    duration: 500,
                    delay: 0,
                    reset: false,
                    mobile: true,
                    opacity: 0.001, // 确保动画结束后透明度为 1
                    easing: 'cubic-bezier(0.5, 0, 0, 1)',
                    scale: 0.9,
                });

                sr.reveal(`.right-panel .card[data-card-id="${this.cards[this.cards.length - 1].card_id}"]`, {
                    interval: 100,
                    opacity: 1, // 确保动画结束后透明度为 1
                });
            });
        },
        handleChangeCardType(index, type) {
            this.cards[index].type = type;
        },
        moveCardUp(index) {
            if (index > 0) {
                const temp = this.cards[index];
                this.cards[index] = this.cards[index - 1];
                this.cards[index - 1] = temp;

                this.cards.forEach((card, i) => {
                    card.card_number = i + 1;
                });
            }
        },

        moveCardDown(index) {
            if (index < this.cards.length - 1) {
                const temp = this.cards[index];
                this.cards[index] = this.cards[index + 1];
                this.cards[index + 1] = temp;

                this.cards.forEach((card, i) => {
                    card.card_number = i + 1;
                });
            }
        },

        deleteCard(index) {
            this.cards.splice(index, 1);

            this.cards.forEach((card, i) => {
                card.card_number = i + 1;
            });
        },

        async fetchCards() {
            const user_id = getCookie('user_id');
            if (!user_id) {
                console.error('User ID not found in cookies');
                return;
            }

            try {
                const response = await axios.post(
                    `https://api.coze.cn/v1/workflow/run`,
                    {
                        workflow_id: '7496712396578783282',
                        parameters: {
                            user_id: user_id
                        }
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer pat_kxaimeTxC6QbMo4K9N0VOzTS7LFzS9HV1yPkfpe5f8yLEboKwSrcV1Gwhynixuum`
                        }
                    }
                );

                const responseData = JSON.parse(response.data.data);
                if (responseData.code === 1) {
                    this.cards = responseData.cards.map(card => {

                        const cardData = JSON.parse(card.data);

                        return {
                            card_id: card.card_id,
                            type: card.data_type,
                            card_number: card.card_number,
                            title: cardData.title || '', // 自定义文本-标题-str
                            content: cardData.content || '', // 自定义文本-正文内容-str
                            headerImageLink: cardData.headerImageLink || '',  // 自定义文本-头图链接-str
                            city: cardData.city || '',  // 天气-城市-str
                            ip: cardData.ip || '',      // 天气-IP地址-str
                            requirement: cardData.requirement || '',  // 多种卡片-更多需求-str
                            height: cardData.height || '', // 健康-身高-str
                            weight: cardData.weight || '', // 健康-体重-str
                            age: cardData.age || '',    // 健康-年龄-str
                            quality: cardData.quality || 'standard',  // 音乐-音质-str
                            preference: cardData.preference || '',  // 音乐-喜爱偏向-str
                            transport: cardData.transport || '任意',  // 出行-出行方式-str
                            start: cardData.start || '', // 出行-起始地-str
                            destination: cardData.destination || '',  // 出行-目的地-str
                            location: cardData.location || '', // 出行-经纬度位置-str
                            zodiac: cardData.zodiac || '',  // 运势-生肖-str
                            constellation: cardData.constellation || '', // 运势-星座-str
                            generateImage: cardData.generateImage || false,  // 多种卡片-生成图片-bool
                            infoType: cardData.infoType || '',         // 财经-信息类型-str
                            typeKeywords: cardData.typeKeywords || '' //定点新闻-类型关键词-str
                        };
                    });
                } else {
                    console.error('Failed to fetch cards:', responseData.msg);
                }
            } catch (error) {
                console.error('Error fetching cards:', error);
            }
        },
        convertCronToTime(cronExpression) {
            const parts = cronExpression.split(' ');
            if (parts.length >= 3) {
                const minute = parts[1].padStart(2, '0');
                const hour = parts[2].padStart(2, '0');
                return `${hour}:${minute}`;
            }
            return '';
        },
        async fetchGenerateTime() {
            try {
                const response = await axios.post(
                    this.timeApiUrl,
                    {
                        workflow_id: '7494504516701274162',
                        parameters: {
                            user_id: getCookie('user_id'),
                            time: "0 0 0 * * *"
                        }
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer pat_kxaimeTxC6QbMo4K9N0VOzTS7LFzS9HV1yPkfpe5f8yLEboKwSrcV1Gwhynixuum`
                        }
                    }
                );
                const responseData = JSON.parse(response.data.data);
                if (responseData.code === 4) {
                    this.generateTime = '';
                }
                else if (responseData.code === 3) {

                    this.generateTime = this.convertCronToTime(responseData.time);
                    if (this.generateTime === '00:00') {
                        this.generateTime = '';
                    }
                } else {
                    console.error('Failed to fetch generate time:', responseData.msg);
                }
            } catch (error) {
                console.error('Error fetching generate time:', error);
            }
        },


        async getIP(index) {
            let card = this.cards[index];
            card.ipLoading = true;
            try {
                const response = await axios.get('https://qifu-api.baidubce.com/ip/local/geo/v1/district');
                if (response.data.ip) {
                    card.ip = response.data.ip;
                    ElMessage.success('IP 获取成功');
                } else {
                    ElMessage.error('无法获取 IP 地址');
                }
            } catch (error) {
                console.error('获取 IP 失败:', error);
                ElMessage.error('获取 IP 失败，请检查网络连接');
            } finally {
                card.ipLoading = false;
            }
        },


        async getLocation(index) {
            let card = this.cards[index];
            card.locationLoading = true;
            if (!navigator.geolocation) {
                ElMessage.error('您的浏览器不支持获取地理位置');
                card.locationLoading = false;
                return;
            }

            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });

                const { latitude, longitude } = position.coords;
                card.location = `${latitude},${longitude}`;
                ElMessage.success('定位获取成功');
            } catch (error) {
                console.error('获取定位失败:', error);
                ElMessage.error('获取定位失败，请检查权限设置');
            } finally {
                card.locationLoading = false;
            }
        },

        async saveGenerateTime() {
            try {

                const [hour, minute] = this.generateTime.split(':');
                const cronTime = `0 ${minute} ${hour} * * *`;

                const response = await axios.post(
                    this.timeApiUrl,
                    {
                        workflow_id: '7494504516701274162',
                        parameters: {
                            user_id: getCookie('user_id'),
                            time: cronTime
                        }
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer pat_kxaimeTxC6QbMo4K9N0VOzTS7LFzS9HV1yPkfpe5f8yLEboKwSrcV1Gwhynixuum`
                        }
                    }
                );
                const responseData = JSON.parse(response.data.data);
                if (responseData.code === 1 && responseData.code === 2) {
                    console.log('生成时间保存成功');
                } else {
                    console.error('生成时间保存失败');
                }
            } catch (error) {
                console.error('Error saving generate time:', error);
                console.error('生成时间保存失败');
            }
        },

        async deleteCardsFromServer(deletedCardIds) {
            const user_id = getCookie('user_id');
            if (!user_id) {
                console.error('User ID not found in cookies');
                return;
            }

            for (const cardId of deletedCardIds) {
                try {
                    const response = await axios.post(
                        `https://api.coze.cn/v1/workflow/run`,
                        {
                            workflow_id: '7496749965827014719',
                            parameters: {
                                card_id: cardId
                            }
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer pat_kxaimeTxC6QbMo4K9N0VOzTS7LFzS9HV1yPkfpe5f8yLEboKwSrcV1Gwhynixuum`
                            }
                        }
                    );

                    const responseData = JSON.parse(response.data.data);
                    if (responseData.code === 1) {
                        console.log(`Card ${cardId} deleted successfully`);
                    } else {
                        console.error(`Failed to delete card ${cardId}:`, responseData.msg);
                    }
                } catch (error) {
                    console.error(`Error deleting card ${cardId}:`, error);
                }
            }
        },

        async manualSave() {
            if (this.loading) return;

            if (!this.generateTime) {
                ElMessage.warning('请设置生成时间');
                return;
            }

            const missingRequiredFields = [];
            this.cards.forEach((card, index) => {
                switch (card.type) {
                    case 'weather':
                        if (!card.requirement) {
                            missingRequiredFields.push({ index, field: 'requirement' });
                        }
                        // 新增：校验城市和IP是否至少填写一个
                        if (!card.city && !card.ip) {
                            missingRequiredFields.push({ index, field: 'cityOrIp' });
                        }
                        break;
                    case 'news':
                        if (!card.typeKeywords) {
                            missingRequiredFields.push({ index, field: 'typeKeywords' });
                        }
                        break;
                    case 'traffic':
                        if (!card.destination) {
                            missingRequiredFields.push({ index, field: 'destination' });
                        }
                        if (!card.start && !location) {
                            missingRequiredFields.push({ index, field: 'startOrlocation' });
                        }
                        break;
                    case 'health':
                        if (!card.requirement) {
                            missingRequiredFields.push({ index, field: 'requirement' });
                        }
                        break;
                    case 'text':
                        if (!card.content) {
                            missingRequiredFields.push({ index, field: 'content' });
                        }
                        break;
                    case 'customAI':
                        if (!card.requirement) {
                            missingRequiredFields.push({ index, field: 'requirement' });
                        }
                        break;
                    default:
                        break;
                }
            });

            if (missingRequiredFields.length > 0) {
                ElMessage.warning('请填写所有必填参数');

                missingRequiredFields.forEach(({ index, field }) => {
                    if (field === 'cityOrIp') {
                        // 标记城市和IP字段为必填
                        this.$set(this.cards[index], 'cityError', true);
                        this.$set(this.cards[index], 'ipError', true);
                    }
                    else if (field === 'startOrlocation') {
                        this.$set(this.cards[index], 'startError', true);
                        this.$set(this.cards[index], 'locationError', true);
                    }
                    else {
                        this.$set(this.cards[index], `${field}Error`, true);
                    }
                });
                return;
            }

            this.loading = true;

            try {
                const localCardIds = this.cards.map(card => card.card_id);
                const serverCardIds = await this.fetchServerCardIds();

                const deletedCardIds = serverCardIds.filter(id => !localCardIds.includes(id));

                console.log('deletedCardIds:', deletedCardIds);

                await this.deleteCardsFromServer(deletedCardIds);

                await this.saveGenerateTime();
                await this.saveChanges();
                ElMessage.success('保存成功');
            } catch (error) {
                console.error('Error during manual save:', error);
                ElMessage.error('保存失败');
            } finally {
                this.loading = false;
            }
        },

        async fetchServerCardIds() {
            const user_id = getCookie('user_id');
            if (!user_id) {
                console.error('User ID not found in cookies');
                return [];
            }

            try {
                const response = await axios.post(
                    `https://api.coze.cn/v1/workflow/run`,
                    {
                        workflow_id: '7496712396578783282',
                        parameters: {
                            user_id: user_id
                        }
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer pat_kxaimeTxC6QbMo4K9N0VOzTS7LFzS9HV1yPkfpe5f8yLEboKwSrcV1Gwhynixuum`
                        }
                    }
                );

                const responseData = JSON.parse(response.data.data);
                if (responseData.code === 1) {
                    return responseData.cards.map(card => card.card_id);
                } else {
                    console.error('Failed to fetch server card IDs:', responseData.msg);
                    return [];
                }
            } catch (error) {
                console.error('Error fetching server card IDs:', error);
                return [];
            }
        },


        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    },
    mounted() {
        this.fetchCards();
        this.fetchGenerateTime();
        window.addEventListener('beforeunload', this.beforeUnloadHandler);

        const loadingInstance = ElLoading.service({
            lock: true,
            text: '加载中...',
            background: 'rgba(255, 255, 255, 0.7)',
            customClass: 'custom-loading'
        });


        const sr = ScrollReveal({
            origin: 'bottom',
            distance: '10px',
            duration: 500,
            delay: 0,
            reset: false,
            mobile: true,
            opacity: 0.001,
            easing: 'cubic-bezier(0.5, 0, 0, 1)',
            scale: 0.9,
        });


        sr.reveal('.left-panel .card', {
            interval: 100,
            opacity: 1,
        });

        this.fetchCards().then(() => {
            this.fetchGenerateTime().then(() => {
                loadingInstance.close();

                setTimeout(() => {
                    this.loadingState = false;
                }, 1000);
            });
        });

        window.addEventListener('beforeunload', this.beforeUnloadHandler);
    },
    beforeUnmount() {
        window.removeEventListener('beforeunload', this.beforeUnloadHandler);
    }
};
</script>

<style scoped>
.edit-container {
    display: flex;
    width: 1200px;
    margin: 0 auto;
    padding: 20px;
    color: #000;
    top: 10%;

}

.left-panel {
    width: 350px;
    padding: 20px;
    height: 100vh;
    position: fixed;
    top: 20;
    user-select: none;
    padding-left: 20px;
    z-index: 200;
}

.left-panel .card {
    background: rgba(255, 255, 255, 0.785);
    box-shadow: 2px 0px 20px rgba(0, 0, 0, 0.06);
    backdrop-filter: blur(7.5px);
}

.right-panel {
    width: 70%;
    padding: 20px;
    height: 100%;
    overflow-y: auto;
    margin-left: 30%;
    user-select: none;
}

.right-panel .card-container {
    column-count: 2;
    column-gap: 20px;
}

.left-panel .card {
    width: 100%;
    padding: 20px;
    height: auto;
}

.right-panel .card {
    width: 100%;
}

.edit-container h2 {
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

.card-list-enter-active,
.card-list-leave-active {
    transition: opacity 0.5s ease;
}

.card-list-enter-from,
.card-list-leave-to {
    opacity: 0;
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

.el-textarea__inner {
    color: #999;
}


.el-textarea__inner:read-only {
    background-color: #fff;
    cursor: text;
}

.card-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-top: 10px;


}

.action-buttons {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
}

.card-button {
    width: 90%;
    padding: 10px;
    text-align: center;
    background-color: #ffffff00;
    color: #000;
    transition: background-color 0.3s;
}

.card-button:hover {
    background-color: #e4f7ff;
    color: #000;
}

.el-form-item__label {
    font-weight: bold;
    color: #555;
}

.el-form-item__content span {
    color: #999;
    font-size: 12px;
}

.custom-loading {
    z-index: 100 !important;
    margin-left: 350px;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #999;
    font-size: 14px;
}

.empty-state img {
    width: 100px;
    height: 100px;
    margin-bottom: 10px;
}

.required-field {
    transition: border 0.1s ease;
    border: 1.5px solid rgb(255, 75, 75);
    border-radius: 5px;
}

.no-cards {
    position: absolute;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 90%;
    width: 55%;

}

.no-cards img {
    margin-bottom: 20px;
    width: 150px;
    height: auto;
    filter: grayscale(30%);
    opacity: 0.5;
}

.no-cards p {
    font-size: 16px;
    color: #636363;
    opacity: 0.5;
    font-weight: bold;
}

.card-id-display {
    position: absolute;
    top: 28px;
    right: 95px;
    font-size: 14px;
    color: #454545;
    opacity: 0.8;
    font-weight: 600;
    background-color: #00000000;
}

.card-id-display :hover {
    color: #454545;
}
</style>