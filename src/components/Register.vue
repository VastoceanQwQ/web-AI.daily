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
                    <input type="text" id="username" v-model="user_name" required placeholder="3-15字 汉字字母数字下划线"
                        :class="{ 'is-invalid': errors.user_name, 'is-valid': !errors.user_name && user_name && isSubmitted }"
                        @blur="resetValidation('user_name')" />
                </div>
                <div class="form-group">
                    <label for="password">密码</label>
                    <input type="password" id="password" v-model="user_password" required placeholder="6-20位 必须含有字母与数字"
                        :class="{ 'is-invalid': errors.user_password, 'is-valid': !errors.user_password && user_password && isSubmitted }"
                        @blur="resetValidation('user_password')" />
                </div>
                <div class="form-group">
                    <label for="password-again">再次输入密码</label>
                    <input type="password" id="password-again" v-model="passwordAgain" required placeholder="两次需一致"
                        :class="{ 'is-invalid': errors.passwordAgain, 'is-valid': !errors.passwordAgain && passwordAgain && isSubmitted }"
                        @blur="resetValidation('passwordAgain')" />
                </div>
                <button type="submit" class="btn">注册</button>
                <p class="msg">已有账号？<router-link to="/login">登录</router-link></p>
            </form>
        </div>
        <Alert ref="alertComponent" />
    </div>
</template>

<script>
import scrollReveal from 'scrollreveal';
import Alert from './Alert.vue';
import { CozeAPI } from '@coze/api';

export default {
    components: {
        Alert,
    },
    data() {
        return {
            user_name: '',
            user_password: '',
            passwordAgain: '',
            code: 0,
            errors: {},
            isSubmitted: false, // 新增一个标志位，表示是否已提交
            api_token: 'pat_Q2vDsDSZEeW1d3VcqVS06CVKMhYcjTWBSnSygLitFYyhAc8jy5dKzLdAsgS8YkLu',
        };
    },
    mounted() {
        this.initScrollReveal();
    },
    methods: {
        async handleRegister() {
            this.errors = {};
            this.isSubmitted = true; // 设置为已提交
            let isValid = true;
            let errorMessages = [];

            // 验证用户名
            const usernameRegex = /^[a-zA-Z0-9\u4e00-\u9fa5_]{3,15}$/;
            if (!usernameRegex.test(this.user_name)) {
                errorMessages.push('用户名3-15字，只能包含大小写字母、汉字、数字和下划线');
                this.errors.user_name = true;
                isValid = false;
            } else {
                this.errors.user_name = false;
            }

            // 验证密码
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]{6,20}$/;
            if (!passwordRegex.test(this.user_password)) {
                errorMessages.push('密码6-20位，必须含有字母与数字，只能包含大小写字母、数字和下划线');
                this.errors.user_password = true;
                isValid = false;
            } else {
                this.errors.user_password = false;
            }

            // 验证两次密码是否一致
            if (this.user_password !== this.passwordAgain) {
                errorMessages.push('两次输入的密码不一致');
                this.errors.passwordAgain = true;
                isValid = false;
            } else {
                this.errors.passwordAgain = false;
            }

            if (isValid) {
                console.log('Validation passed'); // 确认是否进入这一块
                // 处理注册逻辑
                console.log('Username:', this.user_name);
                console.log('Password:', this.user_password);
                console.log('0');

                console.log('1');
                try {
                    const apiClient = new CozeAPI({
                        token: this.api_token,
                        baseURL: 'https://api.coze.cn'
                    });
                    console.log('2');
                } catch (error) {
                    console.error('CozeAPI 初始化失败:', error);
                }

                try {
                    const res = await apiClient.workflows.runs.stream({
                        workflow_id: '7495766150467895306',
                        parameters: {
                            "name": this.user_name,
                            "password": this.user_password
                        },
                    });

                    console.log('API Response:', res);
                    this.code = 1;
                    this.$refs.alertComponent.showAlert('注册成功', 'success');
                } catch (error) {
                    console.error('注册失败:', error);
                    if (error.response) {
                        console.error('API 错误响应:', error.response.data);
                        console.error('API 错误状态码:', error.response.status);
                        console.error('API 错误头:', error.response.headers);
                    } else if (error.request) {
                        console.error('API 请求对象:', error.request);
                    } else {
                        console.error('API 错误信息:', error.message);
                    }
                    this.$refs.alertComponent.showAlert('注册失败，请重试', 'error');
                }
            } else {
                console.log('Validation failed'); // 确认是否进入这一块
                const combinedErrors = errorMessages.join('\n');
                this.$refs.alertComponent.showAlert(combinedErrors, 'error');
            }
        },
        initScrollReveal() {
            const sr = scrollReveal();
            sr.reveal(this.$refs.registerCard, {
                duration: 500,
                delay: 100,
                origin: 'bottom',
                reset: true,
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
        resetValidation(fieldName) {
            if (!this.isSubmitted) {
                this.errors[fieldName] = false; // 重置错误状态
            }
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
    flex: 0.65;
    /* 图片占65% */
    background-color: #000;
    border-radius: 12px 0 0 12px;
    overflow: hidden;
    position: relative;
}

.login .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* 使图片填充整个容器 */
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
    flex: 0.35;
    /* 表单占35% */
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
    margin-bottom: 5px;
    font-size: 24px;
    color: #666;
}

.login .loginform .form-group {
    margin-bottom: 5px;
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
    color: #333;
    transition: border-color 0.2s, background-color 0.2s;
}

.login .loginform input::placeholder {
    color: #999;
    /* 提示文字颜色变灰 */
    opacity: 1;
    /* Firefox */
}

.login .loginform input:focus {
    border-color: #007bff !important;
    /* 选中时外框为蓝色 */
    background-color: #fff !important;
    /* 选中时底色为白色 */
    outline: none;
}

.login .loginform input.is-invalid {
    border-color: #dc3545;
    /* 验证失败时外框为红色 */
    background-color: #f8d7da;
    /* 验证失败时底色为红色 */
}

.login .loginform input.is-valid {
    border-color: #28a745;
    /* 验证通过时外框为绿色 */
    background-color: #d4edda;
    /* 验证通过时底色为绿色 */
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
    border-color: #007bff;
    transition: 0.2s;
}

.login .loginform .msg {
    text-align: center;
    line-height: 48px;
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