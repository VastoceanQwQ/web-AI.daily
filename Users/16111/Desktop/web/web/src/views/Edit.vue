<script>
export default {
    data() {
        return {
            generateTime: '',
            cards: [],
            themeColors: {
            },
            isCardsLoaded: false // 新增标志位，用于控制卡片渲染时机
        };
    },
    methods: {
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
                            'Authorization': `Bearer pat_Q2vDsZEeW1d3VcqVS06CVKMhYcjTWBSnSygLitFYyhAc8jy5dKzLdAsgS8YkLu`
                        }
                    }
                );

                const responseData = JSON.parse(response.data.data);
                if (responseData.code === 1) {
                    this.cards = responseData.cards.map(card => {
                        // 确保所有字段都正确映射
                        return {
                            id: card.card_id,
                            type: card.data_type,
                            order: card.data.card_number,
                            title: card.data.title || '',
                            content: card.data.content || '',
                            headerImage: card.data.headerImage || '',
                            city: card.data.city || '',
                            ip: card.data.ip || '',
                            requirement: card.data.requirement || '',
                            height: card.data.height || '',
                            weight: card.data.weight || '',
                            age: card.data.age || '',
                            quality: card.data.quality || 'standard',
                            preference: card.data.preference || '',
                            transport: card.data.transport || 'walk',
                            start: card.data.start || '',
                            destination: card.data.destination || '',
                            zodiac: card.data.zodiac || '',
                            constellation: card.data.constellation || '',
                            generateImage: card.data.generateImage || card.data.img || false,  // 适配 img 字段
                            infoType: card.data.infoType || card.data.new || '',         // 适配 new 字段
                            quoteType: card.data.quoteType || '',
                            imagePrompt: card.data.imagePrompt || ''
                        };
                    });
                    this.isCardsLoaded = true; // API返回值后，设置标志位为true
                } else {
                    console.error('Failed to fetch cards:', responseData.msg);
                }
            } catch (error) {
                console.error('Error fetching cards:', error);
            }
        }
    },
    mounted() {
        this.fetchCards();
    }
};
</script>

<template>
    <div class="edit-container">
        <div class="left-panel">
            <!-- 左侧面板内容 -->
        </div>
        <div class="right-panel" v-if="isCardsLoaded">
            <!-- 右侧面板内容，仅在isCardsLoaded为true时渲染 -->
            <transition-group name="card-list" tag="div" class="card-container">
                <div v-for="(card, index) in cards" :key="card.id" class="card"
                    :class="{ 'has-header-image': card.headerImage, 'has-theme-color': !card.headerImage && themeColors[card.type] }"
                    :style="{ '--theme-color': !card.headerImage ? themeColors[card.type] : '' }">
                    <!-- 卡片内容 -->
                </div>
            </transition-group>
        </div>
    </div>
</template>