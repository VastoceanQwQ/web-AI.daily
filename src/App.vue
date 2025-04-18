<template>
    <div class="main-place">
        <div class="card-container">
            <div v-for="(card, index) in cards" :key="index" class="card">
                <div class="card-header" :style="{ backgroundImage: `url(${card.headerImage})` }"></div>
                <div class="card-content" v-html="renderMarkdown(card.content)"></div>
            </div>
        </div>
    </div>
    <main-footer></main-footer>
</template>

<script>
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

export default {
    data() {
        return {
            cards: [
                {
                    headerImage: 'https://via.placeholder.com/400x200',
                    content: '# Card 1\nThis is the content of card 1 in Markdown format. Here is some more text to demonstrate how the card expands with content.\nThis is the content of card 1 in Markdown format. Here is some more text to demonstrate how the card expands with content.',
                },
                {
                    headerImage: 'https://via.placeholder.com/400x200',
                    content: '# Card 2\nThis is the content of card 2 in Markdown format. Markdown al1lows for **bold** text, *italic* text, and [links](https://example.com).',
                },
                {
                    headerImage: 'https://via.placeholder.com/400x200',
                    content: '# Card 3\nThis is the content of card 3 in Markdown format. You can also include lists:\n- Item 1\n- Item 2\n- Item 3',
                },
                {
                    headerImage: 'https://via.placeholder.com/400x200',
                    content: '# Card 4\nThis is the content of card 4 in Markdown format. Here is a code block:\n```javascript\nconsole.log("Hello, world!");\n```',
                },
                {
                    headerImage: 'https://via.placeholder.com/400x200',
                    content: '# Card 4\nThis is the content of card 4 in Markdown format. Here is a code block:\n```javascript\nconsole.log("Hello, world!");\n```',
                },
            ],
        };
    },
    methods: {
        renderMarkdown(content) {
            return md.render(content);
        },
    },
};
</script>

<style>
body {
    opacity: 1;
    background: linear-gradient(180deg,  rgba(238, 241, 245, 1) 0%, rgba(230, 233, 240, 1) 100%);
    background-attachment: fixed; /* 固定背景 */
}
main-footer {
    background-color: transparent; /* 确保 footer 不会覆盖背景 */
}
/* 样式保持不变 */
.main-place {
    width: 700px;
    background-color: rgba(180, 180, 180, 0);
    position: absolute;
    top: 20%;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
}

.card-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}

.card {
    overflow: hidden;
    opacity: 1;
    border-radius: 15px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    min-height: 00px; /* 确保卡片有最小高度 */
}

.card-content {
    padding: 15px;
    flex: 1; /* 确保内容区域能够扩展 */
    color: black; /* 确保文字颜色可见 */
}
</style>