<template>
    <div class="alert-container">
        <div
            v-for="(alert, index) in alerts"
            :key="index"
            class="alert"
            :class="alert.type"
            ref="alert"
        >
            <div class="alert-icon">
                <span>{{ alert.icon }}</span>
            </div>
            <div class="alert-message">
                <span>{{ alert.message }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import scrollReveal from 'scrollreveal';

export default {
    data() {
        return {
            alerts: [],
        };
    },
    methods: {
        showAlert(message, type) {
            const icons = {
                info: '💡',
                success: '✅',
                warning: '⚠️',
                error: '❌',
            };
            const alert = {
                message,
                type,
                icon: icons[type],
            };
            this.alerts.push(alert);

            this.$nextTick(() => {
                const sr = scrollReveal();
                sr.reveal(this.$refs.alert[this.alerts.length - 1], {
                    duration: 400,
                    delay: 50,
                    origin: 'top',
                    reset: true,
                    mobile: true,
                    distance: '30px',
                    opacity: 0.001,
                    easing: 'cubic-bezier(0.5, 0, 0, 1)',
                    scale: 0.9,
                    afterReveal: () => {
                        setTimeout(() => {
                            this.alerts.splice(this.alerts.length - 1, 1);
                        }, 5000);
                    },
                });
            });
        },
    },
};
</script>

<style>
.alert-container {
    position: absolute; /* 相对于视口定位 */
    top: -90px; /* 离顶部有一定距离 */
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    max-width: 800px;
    z-index: 5000;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.alert {
    padding: 10px 20px; /* 增加一些水平内边距 */
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    color: white;
    font-size: 14px;
    max-width: 100%; /* 确保最大宽度不超过容器 */
    white-space: pre-wrap; /* 确保文本换行 */
    word-wrap: break-word; /* 确保长单词换行 */
}

.alert-icon {
    margin-right: 10px; /* 为图标和文字之间添加间距 */
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px; /* 增大图标字体大小 */
}

.alert-message {
    flex-grow: 1; /* 使消息部分占据剩余空间 */
    white-space: pre-wrap; /* 确保文本换行 */
    word-wrap: break-word; /* 确保长单词换行 */
}

.alert.info {
    background-color: #74c1fc6e;
    border: 1px solid #74c0fc;
    backdrop-filter: blur(7.5px);
}

.alert.success {
    background-color: #8ce99aa2;
    border: 1px solid #8ce99a;
    backdrop-filter: blur(7.5px);
}

.alert.warning {
    background-color: #ffec9983;
    border: 1px solid #ffec99f8;
    backdrop-filter: blur(7.5px);
}

.alert.error {
    background-color: #ff6b6b83;
    border: 1px solid #ff6b6b;
    backdrop-filter: blur(7.5px);
}
</style>