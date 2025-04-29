<template>
    <div class="login" ref="loginCard">
        <div class="image">
            <img src="@/assets/img/img001.jpg" alt="Login Image" />
        </div>
        <div class="loginform">
            <h2>登录</h2>
            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="username">用户名</label>
                    <input type="text" id="username" v-model="username" required
                        :class="{ 'is-invalid': errors.username, 'is-valid': !errors.username && username && isSubmitted }"
                        @blur="resetValidation('username')" />
                </div>
                <div class="form-group">
                    <label for="password">密码</label>
                    <input type="password" id="password" v-model="password" required
                        :class="{ 'is-invalid': errors.password, 'is-valid': !errors.password && password && isSubmitted }"
                        @blur="resetValidation('password')" />
                </div>
                <div class="form-group remember-password">
                    <label for="remember">
                        <input type="checkbox" id="remember" v-model="remember" />
                        <span>记住密码</span>
                    </label>
                </div>
                <el-form-item>
                    <el-button type="primary" native-type="submit" 
                        style="width: 200px;" size="large" class="btn" :loading="isLoading" >
                        {{ isLoading ? '正在登录...' : loginSuccess ? '登录成功' : '登录' }}
                    </el-button>
                </el-form-item>
                <p class="msg">还没有账号？<router-link to="/register">注册</router-link></p>
            </form>
        </div>
        <Alert ref="alertComponent" />
    </div>
</template>

<script>
import scrollReveal from 'scrollreveal';
import Alert from './Alert.vue';
import axios from 'axios';
import CryptoJS from 'crypto-js'; 
import { setCookie } from '@/utils/cookieUtils'; 
import eventBus from '@/eventBus';

export default {
    components: {
        Alert,
    },
    data() {
        return {
            username: '',
            password: '',
            errors: {},
            isSubmitted: false, 
            isLoading: false, 
            loginSuccess: false, 
            api_token: 'pat_kxaimeTxC6QbMo4K9N0VOzTS7LFzS9HV1yPkfpe5f8yLEboKwSrcV1Gwhynixuum',
            workflow_id: '7495595869320871976',
            remember: false, 
        };
    },
    mounted() {
        this.initScrollReveal();
    },
    methods: {
        async handleLogin() {
            this.errors = {};
            this.isSubmitted = true; 
            this.isLoading = true; 
            this.loginSuccess = false; 
            let isValid = true;
            let errorMessages = [];

            // 验证用户名
            const usernameRegex = /^[a-zA-Z0-9\u4e00-\u9fa5_]{3,15}$/;
            if (!usernameRegex.test(this.username)) {
                errorMessages.push('用户名3-15字，只能包含大小写字母、汉字、数字和下划线');
                this.errors.username = true;
                isValid = false;
            } else {
                this.errors.username = false;
            }

            // 验证密码
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]{6,20}$/;
            if (!passwordRegex.test(this.password)) {
                errorMessages.push('密码6-20位，必须含有字母与数字，只能包含大小写字母、数字和下划线');
                this.errors.password = true;
                isValid = false;
            } else {
                this.errors.password = false;
            }

            if (isValid) {
                try {
                    // 对密码进行 MD5 加密
                    const encryptedPassword = CryptoJS.MD5(this.password).toString();
                    
                    const response = await axios.post(
                        `https://api.coze.cn/v1/workflow/run`,
                        {
                            workflow_id: this.workflow_id,
                            parameters: {
                                user_name: this.username,
                                user_password: encryptedPassword
                            }
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${this.api_token}`
                            }
                        }
                    );

                    // 解析 JSON 字符串
                    let responseData;
                    try {
                        responseData = JSON.parse(response.data.data);
                    } catch (parseError) {
                        console.error('解析 JSON 字符串失败:', parseError);
                        this.$refs.alertComponent.showAlert('解析响应数据失败，请重试', 'error');
                        this.isLoading = false; 
                    }

                    console.log('Parsed API Response:', responseData);

                    if (responseData.code === 1) {
                        // 登录成功
                        this.$refs.alertComponent.showAlert('登录成功，2秒后将跳转到主页', 'success');

                        // 根据“记住密码”状态设置 Cookie 过期时间
                        const days = this.remember ? 14 : null;

                        // 存储登录信息到 Cookie 中
                        setCookie('username', this.username, days);
                        setCookie('encryptedPassword', encryptedPassword, days);
                        setCookie('user_id', responseData.user_id.toString(), days);
                        setCookie('avatar', responseData.avatar, days);

                        
                        this.updateSidebar(this.username, responseData.user_id);
                        this.loginSuccess = true;
                       
                        eventBus.emit('refreshSidebar');
                        console.log('refreshSidebar event emitted');

                        // 登录成功后2秒自动跳转到主页
                        setTimeout(() => {
                            window.location.href = '/';
                            //this.$router.push('/');
                        }, 2000);
                    } else if (responseData.code === -1) {
                        // 用户名不存在
                        this.$refs.alertComponent.showAlert('用户名不存在', 'error');
                        this.errors.username = true;
                        this.errors.password = false;
                    } else if (responseData.code === -2) {
                        // 密码错误
                        this.$refs.alertComponent.showAlert('密码错误', 'error');
                        this.errors.username = false;
                        this.errors.password = true;
                    } else {
                        // 未知登录错误
                        this.$refs.alertComponent.showAlert('未知登录错误', 'error');
                    }

                } catch (error) {
                    console.error('登录失败:', error);
                    let errorMsg = '登录失败，请重试';

                    if (error.response) {
                        console.error('API 错误响应:', error.response.data);
                        errorMsg = error.response.data.msg || errorMsg;
                    } else if (error.request) {
                        console.error('API 请求未收到响应:', error.request);
                        errorMsg = '网络错误，请检查网络连接';
                    } else {
                        console.error('API 配置错误:', error.message);
                    }

                    this.$refs.alertComponent.showAlert(errorMsg, 'error');
                } finally {
                    this.isLoading = false; 
                }
            } else {
                const combinedErrors = errorMessages.join('\n');
                this.$refs.alertComponent.showAlert(combinedErrors, 'error');
                this.isLoading = false; 
            }
        },
        initScrollReveal() {
            const sr = scrollReveal();
            sr.reveal(this.$refs.loginCard, {
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
                    console.log('Login card revealed');
                },
            });
        },
        resetValidation(fieldName) {
            if (!this.isSubmitted) {
                this.errors[fieldName] = false; 
            }
        },
        updateSidebar(username, user_id) {
            
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
    position: absolute; 
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #00000000;
    border-radius: 12px;
    overflow: hidden;
    z-index: 1; 
}

.login .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    
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
    position: absolute; 
    top: 0;
    right: 0;
    width: 38%;
    height: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.85); 
    backdrop-filter: blur(20px);
    border-radius: 0 12px 12px 0;
    z-index: 2; 
}

.login .loginform h2 {
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    color: #666;
}

.login .loginform .form-group {
    margin-bottom: 10px;
    width: 100%;
}

.login .loginform .form-group label {
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
    opacity: 1;
}

.login .loginform input:focus {
    border-color: #007bff !important;
    background-color: #fff !important;
    outline: none;
}

.login .loginform input.is-invalid {
    border-color: #dc3545;
    background-image: linear-gradient(0deg, #fff3f3cb 0%, #ffe5e5 100%);
}

.login .loginform input.is-valid {
    border-color: #28a745;
    background-image: linear-gradient(0deg, #f4fff6 0%, #e7ffeb 100%);
}

.login .loginform .btn {
    width: 100%;
    padding: 10px;
    background-image: linear-gradient(0deg, #ffeef1 0%, #e2eeff 95%, #e1edfe 100%);
    border-radius: 3px;
    color: #333;
    border: 1px solid #d0d0d0;
    transition: 0.2s;
    cursor: pointer;
    font-size: 14px;
}

.login .loginform .btn:hover {
    background-image: linear-gradient(0deg, #ffeef1fe 0%, #e2eeff 95%, #e1edfe 100%);
    border-color: #007bff;
    transition: 0.2s;
}

.login .loginform .btn.loading {
    background-image: linear-gradient(0deg, #ffeef156 0%, #e2eeff67 95%, #e1edfe66 100%);
    color: #888;
    border-color: #989898;
    cursor: not-allowed;
}

.login .loginform .btn.success {
    background-image: linear-gradient(0deg, #ccfbd2a4 0%, #ccfbd2a3 100%);
    border: 1.5px solid #8ce99adb;
    backdrop-filter: blur(7.5px);
    cursor: not-allowed;
}

.login .loginform .msg {
    text-align: center;
    line-height: 30px;
    font-size: 13px;
    color: #666;
    margin-top: 10px;
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

.login .loginform .form-group label {
    display: flex;
    align-items: center;
}

.login .loginform .form-group input[type="checkbox"] {
    margin-left: -85px;
    margin-top: 2.5px;
    margin-right: 0px;
    accent-color: #007bff;
}

.login .loginform .form-group span {
    margin-left: -80px;
    font-size: 13px;
    color: #666;
}

.login .loginform .remember-password {
    margin-bottom: 15px;
}
</style>