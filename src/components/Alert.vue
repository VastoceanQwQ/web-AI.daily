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
                info: 'ℹ️',
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
    padding: 10px 20px; 
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    color: rgb(71, 67, 67);
    font-size: 14px;
    max-width: 100%; 
    white-space: pre-wrap; 
    word-wrap: break-word; 
}

.alert-icon {
    margin-right: 10px; 
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px; 
}

.alert-message {
    flex-grow: 1; 
    white-space: pre-wrap; 
    word-wrap: break-word; 
}

.alert.info {
    background-image: linear-gradient(0deg, #ffffffcb 0%, #c8e6fd 100%);
    border: 1.5px solid #74c0fc;
    backdrop-filter: blur(7.5px);
}

.alert.success {
    background-image: linear-gradient(0deg, #ffffffcb 0%, #ccfbd2 100%);
    border: 1.5px solid #8ce99adb;
    backdrop-filter: blur(7.5px);
}

.alert.warning {
    background-image: linear-gradient(0deg, #ffffffcb 0%, #fdf0bbf8 100%);
    border: 1.5px solid #ffec99;
    backdrop-filter: blur(7.5px);
}

.alert.error {
    background-image: linear-gradient(0deg,#ffffffcb 0%,#ffd7d7 100% );
    border: 1.5px solid #ff6b6b98;
    backdrop-filter: blur(7.5px);
}
</style>