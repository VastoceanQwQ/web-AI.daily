<template>
    <div class="settings">
        <div class="settings-card">
            <div class="menu">
                <ul>
                    <li :class="{ active: activeTab === 'account' }" @click="activeTab = 'account'">账户</li>
                    <li :class="{ active: activeTab === 'about' }" @click="activeTab = 'about'">关于</li>
                </ul>
            </div>
            <div class="content">
                <div v-if="activeTab === 'account'">
                    <h2 style="margin-bottom: 20px;margin-top: 10px; margin-left: 5px;">账户设置</h2>
                    <el-form :model="accountForm" label-width="100px">
                        <el-form-item label="" style="margin-bottom:20px;">
                            <el-avatar :size="100" :src="accountForm.avatarUrl"></el-avatar>
                        </el-form-item>
                        <el-form-item label="头像" style="margin-bottom:25px;">
                            <el-input v-model="accountForm.avatarUrl" style="width: 280px; margin-top: 0px;"
                                placeholder="填入图片的url" :disabled="accountForm.avatarDisabled"></el-input>
                            <el-button v-if="accountForm.avatarDisabled" type="primary" style="margin-left: 30px; "
                                :disabled="!accountForm.usernameDisabled ||
                                    !accountForm.passwordDisabled || accountForm.isLoading"
                                @click="toggleEdit('avatar')">
                                修改
                            </el-button>
                            <el-button v-if="!accountForm.avatarDisabled" type="primary" style="margin-left: 30px;"
                                @click="saveField('avatar')" :loading="accountForm.isLoading">
                                保存
                            </el-button>
                            <el-button v-if="!accountForm.avatarDisabled" type="danger" style="margin-left: 10px;"
                                @click="cancelEdit('avatar')" :disabled="accountForm.isLoading">取消</el-button>
                        </el-form-item>
                        <el-form-item label="用户名" style="margin-bottom:25px;">
                            <el-input v-model="accountForm.username" style="width: 280px;"
                                :disabled="accountForm.usernameDisabled"></el-input>
                            <el-button v-if="accountForm.usernameDisabled" type="primary" style="margin-left: 30px; "
                                :disabled="!accountForm.avatarDisabled ||
                                    !accountForm.passwordDisabled || accountForm.isLoading"
                                @click="toggleEdit('username')">
                                修改
                            </el-button>
                            <el-button v-if="!accountForm.usernameDisabled" type="primary" style="margin-left: 30px;"
                                @click="saveField('username')" :loading="accountForm.isLoading">
                                保存
                            </el-button>
                            <el-button v-if="!accountForm.usernameDisabled" type="danger" style="margin-left: 10px;"
                                @click="cancelEdit('username')" :disabled="accountForm.isLoading">取消</el-button>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input v-model="accountForm.password" type="password" style="width: 280px;"
                                :disabled="accountForm.passwordDisabled"></el-input>

                            <el-button v-if="accountForm.passwordDisabled" type="primary" style="margin-left: 30px; "
                                :disabled="!accountForm.usernameDisabled ||
                                    !accountForm.avatarDisabled || accountForm.isLoading"
                                @click="toggleEdit('password')">
                                修改
                            </el-button>
                            <el-button v-if="!accountForm.passwordDisabled" type="primary" style="margin-left: 30px;"
                                @click="saveField('password'), toloding = true" :loading="accountForm.isLoading">
                                保存
                            </el-button>
                            <el-button v-if="!accountForm.passwordDisabled" type="danger" style="margin-left: 10px;"
                                @click="cancelEdit('password')" :disabled="accountForm.isLoading">取消</el-button>
                        </el-form-item>
                        <el-form-item label="确认密码" style="margin-top: 20px;" v-if="!accountForm.passwordDisabled">
                            <el-input v-model="accountForm.confirmPassword" type="password" placeholder=""
                                style="width: 280px;" :disabled="accountForm.passwordDisabled"></el-input>
                        </el-form-item>
                        <el-form-item style="margin-top: 30px;">
                            <!-- 新增退出登录按钮 -->
                            <el-button type="warning" style="margin-left: 0px; width: 100px;" @click="logout" :disabled="!accountForm.usernameDisabled ||
                                !accountForm.avatarDisabled || !accountForm.passwordDisabled || accountForm.isLoading">
                                退出登录
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div v-else-if="activeTab === 'about'">
                    <h2 style="margin-bottom: 20px;margin-top: 10px; margin-left: 5px;">关于</h2>
                    <img src="@/assets/img/logo.png" alt="Logo" class="loading-logo"
                        style="opacity: 1; margin-left: 248px; margin-bottom: 10px; margin-top: 35px;">
                    <div class=" no-cards-text card-description">
                        <p style="font-size: 25px;letter-spacing:5px;opacity: 0.8;">晨析智报</p>
                        <p style="font-size: 15px;opacity: 0.8; margin-top: 5px;">
                            v1.0.1</p>
                        <p style="font-size: 15px;opacity: 0.6; margin-top: 35px;">
                            2025年中国大学生计算机设计大赛参赛作品</p>
                        <p style="font-size: 15px;opacity: 0.6; margin-top: 35px;"></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import CryptoJS from 'crypto-js'; 
import { ElMessage } from 'element-plus'; 
import { Loading } from 'element-plus/es/components/loading/src/service';
import ScrollReveal from 'scrollreveal'; 

export default {
    name: 'Settings',
    data() {
        return {
            activeTab: 'account',
            accountForm: {
                avatar: '',
                avatarUrl: '',
                username: '',
                password: '********',
                confirmPassword: '',
                passwordDisplay: '',
                avatarDisabled: true,
                usernameDisabled: true,
                passwordDisabled: true,
                confirmPasswordDisabled: true,
                isLoading: false,
            },
            api_token: 'pat_kxaimeTxC6QbMo4K9N0VOzTS7LFzS9HV1yPkfpe5f8yLEboKwSrcV1Gwhynixuum',
            isLoggingOut: false,
        };
    },
    mounted() {

        const sr = ScrollReveal({
            origin: 'bottom',
            distance: '60px',
            duration: 500,
            delay: 200,
            reset: true
        });
        sr.reveal('.settings-card', { interval: 100 });

        const avatarUrl = this.getCookie('avatar');
        const username = this.getCookie('username');



        if (avatarUrl) this.accountForm.avatarUrl = avatarUrl;
        if (username) this.accountForm.username = username;

    },
    methods: {
        toggleEdit(field) {

            if (this.accountForm[`${field}Disabled`]) {
                this.accountForm[`${field}Disabled`] = false;
            } else {
                this.accountForm[`${field}Disabled`] = true;
            }
            if (field === 'password') {
                this.accountForm.password = '';
            }
        },
        cancelEdit(field) {
            if (field === 'avatar')
                this.accountForm.avatarUrl = this.getCookie('avatar');
            if (field === 'username')
                this.accountForm.username = this.getCookie('username');
            if (field === 'password') {
                this.accountForm.password = '********';
                this.accountForm.confirmPassword = '';
            }


            this.accountForm[`${field}Disabled`] = true;
        },
        saveField(field) {

            this.accountForm.isLoading = true;

            let isValid = true;
            let errorMessages = [];

            if (field === 'username') {
                const usernameRegex = /^[a-zA-Z0-9\u4e00-\u9fa5_]{3,15}$/;
                if (!usernameRegex.test(this.accountForm.username)) {
                    errorMessages.push('用户名3-15字，只能包含大小写字母、汉字、数字和下划线');
                    isValid = false;
                    this.accountForm.isLoading = false;
                }
            }

            if (field === 'password') {
                const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]{6,20}$/;
                if (!passwordRegex.test(this.accountForm.password)) {
                    errorMessages.push('密码6-20位，必须含有字母与数字，只能包含大小写字母、数字和下划线');
                    isValid = false;
                    this.accountForm.isLoading = false;
                }

                if (this.accountForm.password !== this.accountForm.confirmPassword) {
                    errorMessages.push('两次输入的密码不一致');
                    isValid = false;
                    this.accountForm.isLoading = false;
                }
            }

            if (!isValid) {
                ElMessage.error(errorMessages.join('\n'));
                return;
            }
            
            if (field === 'username') {
                this.setCookie('username', this.accountForm.username, 30 * 24 * 60 * 60 * 1000);
            }
            if (field === 'password' && this.accountForm.password !== '') {
                const encryptedPassword = CryptoJS.MD5(this.accountForm.password).toString();
                this.setCookie('password', encryptedPassword, 30 * 24 * 60 * 60 * 1000);
            }
            if (field === 'avatar') {
                this.setCookie('avatar', this.accountForm.avatarUrl, 30 * 24 * 60 * 60 * 1000);
            }
            
            const username = this.getCookie('username');
            const password = this.getCookie('password');
            const avatarUrl = this.getCookie('avatar');
            
            const requestData = {
                workflow_id: '7496047468724469770',
                parameters: {
                    user_id: this.getCookie('user_id'),
                    change_password: password,
                    change_account: username,
                    change_img: avatarUrl,
                }
            };

            return axios.post(`https://api.coze.cn/v1/workflow/run`,
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.api_token}`
                    }
                }).then(response => {
                    let responseData;
                    try {
                        responseData = JSON.parse(response.data.data);
                    } catch (parseError) {
                        console.error('解析 JSON 字符串失败:', parseError);
                        ElMessage.error('解析响应数据失败，请重试');
                        return;
                    }

                    console.log('Parsed API Response:', responseData);

                    if (responseData.code === 1) {
                        ElMessage.success('保存成功');

                        setTimeout(() => {
                            window.location.href = '/settings';
                            //this.$router.push('/');
                        }, 1500);
                    } else {
                        ElMessage.error(`保存失败: ${responseData.msg || '未知错误'}`);
                    }
                }).catch(error => {
                    if (error.response) {
                        console.error('API 错误响应:', error.response.data);
                        ElMessage.error(`保存失败: ${error.response.data.msg || '未知错误'}`);
                    } else if (error.request) {
                        console.error('API 请求未收到响应:', error.request);
                        ElMessage.error('网络错误，请检查网络连接');
                    } else {
                        console.error('API 配置错误:', error.message);
                        ElMessage.error('保存失败，请重试');
                    }
                });
        },
        getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        },

        setCookie(name, value, expires) {
            const date = new Date();
            if (expires) {
                date.setTime(date.getTime() + expires);
            } else {
                date.setTime(0);
            }
            document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
        },
        clearAccountData() {
            this.accountForm.avatarUrl = '';
            this.accountForm.username = '';
            this.accountForm.password = '';
            this.accountForm.confirmPassword = '';
            document.cookie = 'avatar=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        },
        logout() {

            this.clearAccountData();
            document.cookie = 'user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            ElMessage.success('已退出登录');
            this.accountForm.isLoading = true;
            /*
            if (this.$bus && typeof this.$bus.emit === 'function') {
                this.$bus.emit('refreshSidebar');
            } else {
                console.error('EventBus is not properly initialized or does not have an emit method.');
            }
            this.$router.push('/login');*/
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
        },
    }
};
</script>

<style scoped>
.settings-card {
    transform: translate(-50%, -50%);
    top: 50%;
    position: absolute;
    left: 50%;
    width: 800px;
    height: 500px;
    background-color: rgba(255, 255, 255, 0);
    border-radius: 12px;
    box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.1);
    display: flex;
    z-index: 100;
}

.settings-card .menu {
    width: 20%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.535);
    backdrop-filter: blur(20px);
    border-radius: 12px 0 0 12px;
    padding: 20px;
    box-sizing: border-box;
    color: rgba(0, 0, 0, 0.645);
}

.settings-card .menu ul {
    list-style-type: none;
    padding: 2px;

}

.settings-card .menu ul li {
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.2s;
    border-radius: 4px;
    margin-top: 5px;

}
.settings-card .menu ul li:hover {
    /*background-color: rgba(166, 209, 255, 0.615);*/
    background-image: linear-gradient(0deg, #ffeef1cb 0%, #e2eeffcf 95%, #e1edfec2 100%);
}

.settings-card .menu ul li.active {
    /*background-color: rgba(0, 123, 255, 0.733);
    color: white;*/
    background-image: linear-gradient(0deg, #ffe5eb 0%, #dbe8fa 95%, #e3eefe 100%);
    color: rgb(0, 0, 0);
}

.settings-card .content {
    width: 80%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    border-radius: 0 12px 12px 0;
}

.settings-card .content h2 {
    font-weight: bold;
    margin-bottom: 20px;
    font-size: 24px;
    color: #666;
}
</style>
