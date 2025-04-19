<template>
    <main-footer></main-footer>
    <div class="main-place">
        <div class="card-description">开发版界面 · Ver 20250419-002 · 19:00</div>
        <div class="card-container">
            <div v-for="(card, index) in cards" :key="index" class="card">
                <div class="card-header" :style="{ backgroundImage: `url(${card.headerImage || ''})` }"></div>
                <div class="card-content" v-html="renderMarkdown(card.content)"></div>
            </div>
        </div>
        <div class="upper-main"></div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import MarkdownIt from 'markdown-it';
import MainFooter from './components/footer.vue';
import scrollReveal from 'scrollreveal';

const md = new MarkdownIt();

export default {
    components: {
        MainFooter,
    },
    setup() {
        // 定义响应式数据
        const cards = ref([
            {
                content: '# 📅 2025-04-18 星期五\n## 农历三月廿一',
            },
            {
                content: '# 🌧️ 今日天气\n### 北京天气概况\n| 日期       | 天气 | 最低气温 | 最高气温 | 湿度 | 风力 | 风向       |\n|------------|------|----------|----------|------|------|------------|\n| 2025-04-18 | 小雨 | 9°C      | 19°C     | 59%  | 1级  | 南风/西北风 |\n\n### 未来两天天气预报\n| 日期       | 天气 | 最低气温 | 最高气温 | 湿度 | 风力 | 风向       |\n|------------|------|----------|----------|------|------|------------|\n| 2025-04-19 | 多云 | 10°C     | 22°C     | 59%  | 1级  | 南风       |\n| 2025-04-20 | 多云 | 14°C     | 24°C     | 50%  | 1级  | 南风/北风  |\n\n## 生活指南\n- **穿衣建议**：今日有小雨，气温较低，建议穿保暖衣物并携带雨具。\n- **出行建议**：雨天路滑，出行请注意安全。\n- **洗车建议**：今日有雨，不建议洗车。\n- **户外活动**：雨天不适合户外活动，建议室内活动.\n\n\n## 北京市海淀区未来三天天气情况\n| 日期       | 天气 | 最低气温 | 最高气温 | 湿度 | 风力 | 风向       |\n|------------|------|----------|----------|------|------|------------|\n| 2025-04-18 | 小雨 | 9°C      | 19°C     | 59%  | 1级  | 南风/西北风 |\n| 2025-04-19 | 多云 | 10°C     | 22°C     | 59%  | 1级  | 南风       |\n| 2025-04-20 | 多云 | 14°C     | 24°C     | 50%  | 1级  | 南风/北风  |',
            },
            {
                content: '# 🔮 综合运势报告\n\n#### 🐓 生肖运程（鸡）  \n- **综合运势**：属鸡人今日整体运程及运势一般，不必感觉如今的努力没有用。  \n- **爱情运势**：今日感情方面运程及运势下降，对异性朋友的态度过于强硬，容易引发反感。  \n- **事业运势**：今日工作方面运程及运势比较一般，需要多一些自觉性。  \n- **财富运势**：今日财运方面运程及运势比较一般，建议从正道去挣钱。  \n- **健康运势**：今日健康方面运程及运势升高，情绪积极主动了许多。  \n\n#### ♒ 星座运势（水瓶座）  \n- **综合运势**：会有持续的好运气，能够进行一些自己感兴趣的尝试，再接再厉多试几次必定会有回报。  \n- **爱情运势**：单身的因为害怕被拒绝，所以总是在拒绝别人；恋爱中的不要总是不修边幅，会降低恋人对你的好感度。  \n- **事业运势**：工作方面要清楚当前的形势，选择合适的计划方案，懂得灵活应变，对于旁人的建议择优考虑。  \n- **财富运势**：有奖金方面的进账，贵人带来赚钱商机，果断作出判断和选择，把握不错的进账。  \n- **健康运势**：做好御寒保暖的措施，避免着凉感冒。  \n\n#### ☯ 卦象启示  \n- **小六壬卦**：空亡 - 空亡 - 速喜  \n- **解签**：卜到空亡为凶卦，代表凡事秽暗不明，内心不安，运途起伏。目前运势不佳，自身拿不定主意，无所适从，可多听取他人意见，切莫随意做判断。  \n- **签诗**：江海悠悠，烟波下钩，六鳌连获，歌笑中流。  \n- **解签**：此签大吉，凡谋事、创业必有望，且连获成功，尤其逢「六」数，更具喜色。  \n\n#### 🌟 今日开运  \n- **幸运色**：黛青色（五行补水位）  \n- **幸运物**：黄水晶貔貅（招财磁场）  \n- **养生餐**：黑豆核桃粥（补肾益气）  \n---\n*以上信息仅供参考，如需更多详情，请访问相关运势网站。*',
            },
            {
                content: '# 📰 今日新闻热点及头条\n\n---\n\n#### 📈 **头条新闻**  \n1. **【综合新闻】每日热点15条新闻简报每天一分钟知晓天下事 4月18日**  \n   - 统计局公布3月不同年龄段劳动力失业率，较上月均有下降；三部门开展工伤保险跨省异地就医直接结算工作 。  \n   - 来源链接：[平邑融媒](https://toutiao.com/group/7494460029265920546/)  \n\n---\n\n#### 🔥 **热点新闻**  \n1. **【政策点评】【每日热点新闻政策点评】4月18日 星期五**  \n   - 学会从政策新闻中看门道，从金融角度看世界 。  \n   - 来源链接：[新生代作手阿基](https://toutiao.com/group/7494464245938029066/)  \n\n2. **【社会热点】纵览热点｜青岛电影学院大四女生失联已近一个月，其母：没有任何**  \n   - 23岁女大学生深夜赤脚离奇失踪，母亲苦寻30天发现手机被清空 。  \n   - 来源链接：[隔壁小王](https://toutiao.com/group/7494578161980572223/)  \n\n3. **【健康热点】万步走 10年助力公众减重112万公斤**  \n   - 第十届“万步有约”健走激励大赛正式启动，预计总参赛规模超100万人 。  \n   - 来源链接：[北青热点](https://t.ynet.cn/h5/36599852.html)  \n\n---\n\n#### 🔍 **深度追踪**  \n- **【综合新闻】每日热点15条新闻简报每天一分钟知晓天下事 4月16日**  \n  - 住建部聚焦城镇住宅工程质量问题开展整治；网信办开展整治短视频领域恶意营销乱象专项行动；电动汽车电池新国标将于2026年7月1日施行 。  \n  - 来源链接：[平邑融媒](https://toutiao.com/group/7493689120703676943/)  \n\n---\n  \n*注：新闻选取基于1744993391857.0前12小时热度数据，持续追踪请刷新页面。*  ',
            },
            {
                headerImage: 'https://via.placeholder.com/400x200',
                content: '# Text Card\nThis is the content of card 4 in Markdown format. Here is a code block:\n',
            },
            {
                headerImage: 'https://via.placeholder.com/400x200',
                content: '# Text Card\n> This is the content of card 4 in Markdown format. Here is a code block:\n',
            },
            {
                headerImage: 'https://via.placeholder.com/400x200',
                content: '# Text Card\n```This is the content of card 4 in Markdown format. Here is a code block:```\n',
            },
            {
                headerImage: 'https://via.placeholder.com/400x200',
                content: '*本站部分文本由AI生成，请注意甄别。* \n\n *Powered by [AI-Daliy](https://ai-daliy.vastocean.work/).   Made by Vastocean & other 2 maker.*',
            },
        ]);

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
        };

        // 页面加载生命周期
        onMounted(() => {
            retScroll();
        });

        return {
            cards,
            renderMarkdown,
        };
    },
};
</script>

<style>
body {
    opacity: 1;
    background: linear-gradient(180deg, rgba(238, 241, 245, 1) 0%, rgba(230, 233, 240, 1) 100%);
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
}

.card-header {
    height: 00px;
    background-size: cover;
    background-position: center;
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
}
</style>