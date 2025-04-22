<!-- Register.vue -->
<template>
    <div class="login" ref="registerCard">
        <div class="image">
            <img src="@/assets/img/img002.png" alt="Register Image" />
        </div>
        <div class="loginform">
            <h2>注册</h2>
            <form @submit.prevent="handleRegister">
                <div class="form-group">
                    <label for="username">用户名</label>
                    <input type="text" id="username" v-model="username" required />
                </div>
                <div class="form-group">
                    <label for="password">密码</label>
                    <input type="password" id="password" v-model="password" required />
                </div>
                <div class="form-group">
                    <label for="password-again">再次输入密码</label>
                    <input type="password" id="password-again" v-model="passwordAgain" required />
                </div>
                <button type="submit" class="btn">注册</button>
            </form>
        </div>
    </div>
</template>

<script>
import scrollReveal from 'scrollreveal';

export default {
    data() {
        return {
            username: '',
            email: '',
            password: '',
            passwordAgain: '', // 添加再次输入密码的字段
        };
    },
    mounted() {
        this.initScrollReveal();
        this.$emit('showMainPlace', false); // 通知 App.vue 隐藏 main-place
    },
    methods: {
        handleRegister() {
            // 处理注册逻辑
            console.log('Username:', this.username);
            console.log('Email:', this.email);
            console.log('Password:', this.password);
            console.log('Password Again:', this.passwordAgain);
        },
        initScrollReveal() {
            const sr = scrollReveal();
            sr.reveal(this.$refs.registerCard, {
                duration: 500,
                delay: 100,
                origin: 'bottom',
                reset: true, // 设置为true，以便在滚动回顶部时重新应用动画
                mobile: true,
                distance: '30px',
                opacity: 0.001,
                easing: 'cubic-bezier(0.5, 0, 0, 1)',
                scale: 0.9,
                beforeReveal: function (ele) {
                    console.log('Register card revealed');
                },
            });
        },
    },
};
</script>

<style scoped>
.login {
    width: 800px;
    height: 400px;
    margin: 0 auto;
    background-color: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    user-select: none;
    display: flex;
    z-index: 100;
}

.login .image {
    flex: 0.65; /* 图片占65% */
    background-color: #000;
    border-radius: 12px 0 0 12px;
    overflow: hidden;
    position: relative;
}

.login .image img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 使图片填充整个容器 */
}

.login .image::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.118);
    background-blend-mode: multiply;
    z-index: 1;
}

.login .loginform {
    flex: 0.35; /* 表单占35% */
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0);
    border-radius: 0 12px 12px 0;
}

.login .loginform h2 {
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    color: #666;
}

.login .loginform .form-group {
    margin-bottom: 15px;
    width: 100%;
}

.login .loginform label {
    display: block;
    margin-bottom: 5px;
    color: #666;
}

.login .loginform input {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f9f9f9;
}

.login .loginform .btn {
    width: 100%;
    padding: 10px;
    background-image: linear-gradient(0deg, #eedde0c1 0%, #d7e6fccb 95%, #d3e2f8 100%);
    border-radius: 3px;
    color: #333;
    border: 1px solid #d0d0d0;
    transition: 0.2s;
    cursor: pointer;
    font-size: 14px;
}

.login .loginform .btn:hover {
    background-image: linear-gradient(0deg, #f4d5dab4 0%, #c3d8f7b6 99%, #b6d2f8 100%);
    border-color: #000000;
    transition: 0.2s;
}

.login .loginform .msg {
    text-align: center;
    line-height: 88px;
    font-size: 13px;
    color: #666;
}

.login a {
    background: linear-gradient(90deg, #37b2fec4, #ff5f7fb9);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-decoration: none;
    transition: color 0.2s;
}

.login a:hover {
    text-decoration: underline;
    background: linear-gradient(90deg, #019eff, #fc3fa1);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    background-color: #ffffff00;
}
</style>