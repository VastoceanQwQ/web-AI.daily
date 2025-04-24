<template>
    <div class="edit-container">
        <div class="left-panel">
            <div class="card">
                <h1 style="font-weight:600; margin-bottom: 5px;">编辑</h1>
                <!--<p style="font-size: 12px;color:darkgray;margin-bottom: 20px;">每有改动将自动保存</p>-->
                <el-dropdown @command="addCard">
                    <el-button type="primary" style="width: 257px;">添加卡片</el-button>

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
                    <el-form label-position="left" label-width="100px">
                        <el-form-item label="生成时间">
                            <el-TimeSelect v-model="generateTime" format="HH:mm" placeholder="请选择" start="5:00"
                                end="11:00" step="00:10"></el-TimeSelect>
                        </el-form-item>
                        <p style="font-size: 12px;color:darkgray;">
                            生成时间为早报内容开始生成的时间点，从开始生成到完成并展示内容期间需要约5-10分钟的时间，推荐将时间提前10分钟设定以获得更好的体验。</p>
                    </el-form>
                    <p style="font-size: 12px;color: #ff8787; margin-top: 15px;">
                        注意：请填写所有卡片的必填参数且不要保留没有填写任何参数的卡片，否则生成的内容会出现比较大的偏差和问题！</p>
                </div>
                <!-- 新增手动保存按钮 -->
                <el-button type="primary" style="width: 267px; margin-top: 20px;" @click="manualSave" :loading="loading">
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
                        <img src="/up.svg" alt="up" @click="moveCardUp(index)" />
                        <img src="/down.svg" alt="down" @click="moveCardDown(index)" />

                        <img src="/delete.svg" alt="delete" @click="deleteCard(index)" style="width: 16px;" />
                    </div>

                    <el-form label-position="left" label-width="100px" class="form-right-align">
                        <div v-if="card.type === 'calendar'">
                            <h2>📅 日历</h2>
                            <el-form-item label=" 生成图片">
                                <el-switch v-model="card.generateImage" />
                            </el-form-item>
                        </div>
                        <div v-else-if="card.type === 'weather'">
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
                                    <el-option label="高清" value="higher" />
                                    <el-option label="无损" value="lossless" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="喜爱偏向">
                                <el-input v-model="card.preference" />
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
                                <el-input v-model="card.start" />
                            </el-form-item>
                            <el-form-item label="目的地">
                                <el-input v-model="card.destination" />
                            </el-form-item>
                            <el-form-item label="经纬度位置">
                                <el-input v-model="card.location" />
                                <el-button @click="getLocation">获取定位</el-button>
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
                            <h2>📈 财经</h2>
                            <el-form-item label="生成图片">
                                <el-switch v-model="card.generateImage" disabled />
                            </el-form-item>
                            <el-form-item label="信息类型">
                                <el-input v-model="card.infoType" />
                            </el-form-item>
                        </div>

                        <div v-else-if="card.type === 'text'">
                            <h2>🏷️ 自定义文本</h2>
                            <el-form-item label="卡片标题">
                                <el-input v-model="card.title" placeholder="留空则不显示标题" />
                            </el-form-item>
                            <el-form-item label="头图链接">
                                <el-input placeholder="留空则不展示头图" v-model="card.headerImageLink" />
                            </el-form-item>
                            <el-form-item label="正文内容">
                                <el-input type="textarea" v-model="card.content"
                                    :autosize="{ minRows: 2, maxRows: 6 }" />
                            </el-form-item>
                        </div>
                        <div v-else-if="card.type === 'customAI'">
                            <h2>✨ 自定义应用</h2>
                            <el-form-item label="需求">
                                <el-input type="textarea" v-model="card.requirement"
                                    :autosize="{ minRows: 4, maxRows: 6 }"
                                    placeholder="请用自然语言描述需求，Agent将根据您的需求自动生成内容" />
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

                        <!-- 显示卡片ID和顺序 -->
                        <el-form-item label="卡片ID">
                            <span>{{ card.card_id }}</span>
                        </el-form-item>
                        <el-form-item label="顺序">
                            <span>{{ card.card_number }}</span>
                        </el-form-item>
                    </el-form>
                </div>
            </transition-group>
        </div>
    </div>
</template>

<script>
import { ElButton, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElInputNumber, ElCheckbox, ElDatePicker, ElDropdown, ElDropdownMenu, ElDropdownItem, ElSwitch, ElMessage } from 'element-plus';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { getCookie } from '@/utils/cookieUtils';

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
        ElMessage
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
            },
            loading: false, // 新增 loading 状态
            timeApiUrl: 'https://api.coze.cn/v1/workflow/run' // 新增时间 API URL
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
            // 检查是否有需要保存的卡片
            if (this.cards.length === 0) {
                return;
            }

            // 遍历所有卡片并依次保存
            this.cards.forEach((card) => {
                // 根据卡片类型提取相关参数
                let relevantParams = {};
                switch (card.type) {
                    case 'weather':
                        relevantParams = {
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
                    data: JSON.stringify({
                        ...relevantParams,
                        card_number: card.card_number // 每次都保存顺序
                    })
                };

                // 调用API保存卡片信息
                axios.post(
                    `https://api.coze.cn/v1/workflow/run`,
                    {
                        workflow_id: '7496722349124993061', // 假设这是保存卡片的workflow_id
                        parameters: {
                            user_id: getCookie('user_id'),
                            card_id: cardData.card_id,
                            data_type: cardData.data_type,
                            data: cardData.data
                        }
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer pat_Q2vDsDSZEeW1d3VcqVS06CVKMhYcjTWBSnSygLitFYyhAc8jy5dKzLdAsgS8YkLu`
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
        discardChanges() {
            // 放弃更改的逻辑
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
                infoType: '',
                typeKeywords: '',
                location: '',
                headerImageLink: ''
            });

            // 新增：在添加卡片后立即触发自动保存
            this.autoSave();
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

                // 更新卡片顺序
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

                // 更新卡片顺序
                this.cards.forEach((card, i) => {
                    card.card_number = i + 1;
                });
            }
        },

        deleteCard(index) {
            this.cards.splice(index, 1);

            // 更新卡片顺序
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
                        workflow_id: '7496712396578783282', // 假设这是获取卡片列表的workflow_id
                        parameters: {
                            user_id: user_id
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
                console.log(responseData.code);
                console.log("001");
                if (responseData.code === 1) {
                    console.log("002");
                    this.cards = responseData.cards.map(card => {
                        console.log(card);
                        
                        console.log(JSON.parse(card.data));
                        const cardData = JSON.parse(card.data);

                        console.log(cardData.img);
                        console.log(cardData.new);
                        // 确保所有字段都正确映射
                        return {
                            card_id: card.card_id,
                            type: card.data_type,
                            card_number: cardData.card_number,
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

        async fetchGenerateTime() {
            try {
                const response = await axios.post(
                    this.timeApiUrl,
                    {
                        workflow_id: '7494504516701274162', // 假设这是获取生成时间的 workflow_id
                        parameters: {
                            user_id: getCookie('user_id'),
                            time: "* * * * * *"
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
                if (responseData.code === 3) {
                    // 将 Cron 表达式转换为 HH:mm 格式
                    const cronTime = responseData.time.split(' ');
                    this.generateTime = `${cronTime[1]}:${cronTime[0]}`;
                } else {
                    console.error('Failed to fetch generate time:', responseData.msg);
                }
            } catch (error) {
                console.error('Error fetching generate time:', error);
            }
        },

        async saveGenerateTime() {
            try {
                // 将 HH:mm 转换为 Cron 表达式
                const [hour, minute] = this.generateTime.split(':');
                const cronTime = `0 ${minute} ${hour} * * *`;

                const response = await axios.post(
                    this.timeApiUrl,
                    {
                        workflow_id: '7496722349124993061', // 假设这是保存生成时间的 workflow_id
                        parameters: {
                            user_id: getCookie('user_id'),
                            time: cronTime
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

        async manualSave() {
            if (this.loading) return; // 防止重复提交

            if (!this.generateTime) {
                ElMessage.warning('请设置生成时间');
                return;
            }

            this.loading = true;
            ElMessage.info('正在保存...');

            try {
                await this.saveGenerateTime(); // 保存生成时间
                await this.saveChanges(); // 保存卡片信息
                ElMessage.success('保存成功');
            } catch (error) {
                console.error('Error during manual save:', error);
                ElMessage.error('保存失败');
            } finally {
                this.loading = false;
            }
        }
    },
    mounted() {
        this.fetchCards();
        this.fetchGenerateTime(); // 页面加载时获取生成时间
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
    /* 固定定位 */
    top: 20;
    /* 固定在顶部 */
    user-select: none;
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
    /* 右半部分可以滚动 */
    margin-left: 30%;
    /* 保持与左侧面板的间距 */
}

.right-panel .card-container {
    column-count: 2;
    column-gap: 20px;
    /* 两列间距 */
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
    color: #999;
    /* 设置文字颜色为浅灰色 */
}

/* 确保 textarea 可编辑 */
.el-textarea__inner:read-only {
    background-color: #fff;
    /* 保持背景为白色 */
    cursor: text;
    /* 设置光标为文本输入状态 */
}

.card-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    /* 两列布局 */
    gap: 8px;
    margin-top: 10px;
    padding-left: 0px;

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

/* 卡片底部信息的样式 */
.el-form-item__label {
    font-weight: bold;
    color: #555;
}

.el-form-item__content span {
    color: #999;
    font-size: 12px;
}
</style>