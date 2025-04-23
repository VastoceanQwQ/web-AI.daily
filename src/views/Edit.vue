<template>
    <div class="edit-container">
        <div class="left-panel">
            <div class="card">
                <h2>添加新卡片</h2>
                <button @click="addCard">添加卡片</button>
                <div class="time-setting">
                    <label for="generate-time">生成时间：</label>
                    <input type="datetime-local" id="generate-time" v-model="generateTime" />
                </div>
            </div>
        </div>
        <div class="right-panel">
            <transition-group name="card-list" tag="div" class="card-container">
                <div v-for="(card, index) in cards" :key="index" class="card">
                    <h3>卡片 {{ index + 1 }}</h3>
                    <div class="card-row">
                        <label>标题:</label>
                        <input type="text" v-model="card.title" />
                    </div>
                    <div class="card-row">
                        <label>内容:</label>
                        <textarea v-model="card.content"></textarea>
                    </div>
                </div>
            </transition-group>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Edit',
    data() {
        return {
            generateTime: '',
            cards: []
        };
    },
    methods: {
        addCard() {
            this.cards.push({ title: '', content: '' });
        }
    }
};
</script>

<style scoped>
.edit-container {
    display: flex;
    height: 100vh;
    width: 100vw;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
}

.left-panel {
    width: 20%;
    padding: 20px;
    background-color: #f5f5f5;
    height: 100%;
}

.right-panel {
    width: 80%;
    padding: 20px;
    height: 100%;
}

.card-container {
    column-count: 2;
    column-gap: 20px;
}

.card {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    break-inside: avoid;
    margin-bottom: 20px;
}

.card-row {
    margin-bottom: 10px;
}

.card-row label {
    display: block;
    margin-bottom: 5px;
}

.card-row input,
.card-row textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
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
}

button:hover {
    background-color: #66b1ff;
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
</style>