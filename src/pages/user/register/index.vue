<template>
    <div class="register-body">
        <div class="register-panel">
            <div class="register-title">用户登录</div>
            <el-radio-group v-model="identity" label="identity">
                <el-radio-button label="student">学生</el-radio-button>
                <el-radio-button label="teacher">教师</el-radio-button>
                <el-radio-button label="admin">管理</el-radio-button>
            </el-radio-group>
            <el-form :model="formData" :rules="rules" ref="formDataRef">
                <el-form-item prop="user_name">
                    <el-input placeholder="请输入账号" v-model="formData.user_name" size="large" type="text">
                        <template #prefix>
                            <el-icon>
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input placeholder="请输入密码" v-model="formData.password" size="large" type="password"
                        @keyup.enter.native="registerFunc">
                        <template #prefix>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item style="width: 100%">
                    <router-link to="/user/login" class="register">已有账号？返回登录</router-link>
                </el-form-item>
                <!-- <el-form-item label="">
                    <div class="check-code-panel">
                        <el-input placeholder="请输入验证码" v-model="formData.checkCode" class="input-panel" />
                        <img src="checkCodeUrl" class="check-code">
                    </div>
                </el-form-item> -->
                <!-- <el-form-item label="">
                    <el-checkbox label="记住密码" name="type" />
                </el-form-item> -->
                <el-form-item label="">
                    <el-button type="primary" style="width: 100%;" @click="registerFunc" size="large">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const identity = ref('student')
const formDataRef = ref();
let formData = reactive({
    user_name: "",
    password: ""
});
const rules = {
    user_name: [{
        required: true,
        message: "请输入用户名"
    }],
    password: [{
        required: true,
        message: "请输入密码"
    }],
    // checkCode: [{
    //     required: true,
    //     message: "请输入验证码"
    // }],
}
const registerFunc = () => {

}
</script>
<style lang='scss' scoped>
.register-body {
    height: 100%;
    width: 100%;
    background-size: cover;
    position: absolute;
    left: 0;
    top: 0;

    .register-panel {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;

        padding: 25px;
        width: 26%;
        min-width: 460px;
        height: 30%;
        min-height: 300px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 5%;
        box-shadow: 2px 2px 10px #ddd;

        .register-title {
            font-size: 22px;
            text-align: center;
            margin-bottom: 22px;
        }
    }
}
</style>