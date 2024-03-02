<template>
    <div class="main-content">
        <div class="dashboard-block mt-0 profile-settings-block">
            <h3 class="block-title">编辑个人资料</h3>
            <div class="inner-block">
                <el-form :model="info" class="profile-setting-form" :rules="rules2" ref="infoFormRef">
                    <div class="row">
                        <div class="col-lg-6 col-12">
                            <div class="form-group">
                                <label>昵称*</label>
                                <el-form-item prop="nick_name">
                                    <el-input type="text" placeholder="昵称" v-model="info.nick_name" />
                                </el-form-item>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-group button mb-0">
                                <el-form-item>
                                    <button type="button" class="btn "
                                        @click="changeUserInfo(infoFormRef)">更新资料</button>
                                </el-form-item>
                            </div>
                        </div>
                    </div>
                </el-form>
            </div>
        </div>
        <div class="dashboard-block password-change-block">
            <h3 class="block-title">更新密码</h3>
            <div class="inner-block">
                <el-form :model="model" :rules="rules" class="default-form-style" ref="formDataRef">
                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label>当前密码</label>
                                <el-form-item prop="old_password">
                                    <el-input type="password" placeholder="当前密码" v-model="model.old_password"
                                        show-password />
                                </el-form-item>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label>新密码</label>
                                <el-form-item prop="new_password">
                                    <el-input type="password" placeholder="新密码" show-password
                                        v-model="model.new_password" />
                                </el-form-item>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label>确认密码</label>
                                <el-form-item prop="confirm_password">
                                    <el-input type="password" placeholder="确认密码" v-model="model.confirm_password"
                                        show-password />
                                </el-form-item>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-group button mb-0">
                                <el-form-item>
                                    <button type="button" @click="changeUserPassword(formDataRef)" class="btn ">
                                        更改密码
                                    </button>
                                </el-form-item>
                            </div>
                        </div>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { changePassword, changeInfo } from '../../request/index'
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useRootStore } from '../../store/index'
const store = useRootStore()
const router = useRouter()
const model = reactive({
    old_password: '',
    new_password: '',
    confirm_password: '',
})

// 1
const info = reactive({
    nick_name: ''
})
const formDataRef = ref()
const infoFormRef = ref()

const validatePass = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入密码'))
    } else {
        if (model.old_password !== '') {
            if (value === model.old_password) {
                callback(new Error('新密码与当前密码一致'))
            }
        }
        if (model.confirm_password !== '') {
            if (!formDataRef.value) return
            formDataRef.value.validateField('confirm_password', () => null)
        }
        callback()
    }
}
const validateConfPass = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== model.new_password) {
        callback(new Error("密码不一致"))
    } else {
        callback()
    }
}
const rules = {
    new_password: [{
        required: true,
        validator: validatePass,
        trigger: 'blur'
    }],
    confirm_password: [{
        required: true,
        validator: validateConfPass,
        trigger: 'blur'
    }]
}
// 2
const rules2 = {
    nick_name: [{
        required: true,
        message: '请输入昵称',
        trigger: 'blur'
    }]
}
// 修改密码后重新登录
const changeUserPassword = (formEle) => {
    if (!formEle) return
    formEle.validate(async (valid) => {
        if (valid) {
            try {
                const { old_password, confirm_password } = model
                const form_obj = { old_password, password: confirm_password }
                const { data } = await changePassword(form_obj)
                ElMessage({
                    message: data.message,
                    duration: 1000,
                    type: 'success',
                    onClose: () => {
                        store.token = ''
                        store.userInfo = {}
                        sessionStorage.removeItem('user')
                        router.push('/user/login')
                    }
                })
            } catch (e) {
                console.log(e);
            };
        } else {
            return false
        }
    })
}

const changeUserInfo = (formEle) => {
    if (!formEle) return
    formEle.validate(async (valid) => {
        if (valid) {
            try {
                const { nick_name } = info
                const form_obj = { nick_name }
                const { data } = await changeInfo(form_obj)
                const { id, ...res } = data.result
                store.userInfo = res
                ElMessage({
                    message: data.message,
                    duration: 1000,
                    type: 'success',

                })
            } catch (e) {
                console.log(e);
            };
        } else {
            return false
        }
    })

}
</script>

<style lang='scss' scoped></style>