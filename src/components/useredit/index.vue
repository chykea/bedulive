<template>
    <div class="main-content">
        <div class="dashboard-block mt-0">
            <h3 class="block-title">用户管理</h3>

            <div class="my-items">
                <div class="item-list-title">
                    <div class="row align-items-center">
                        <div class="col-lg-2 col-md-2 col-12">
                            <p>用户名</p>
                        </div>
                        <div class="col-lg-3 col-md-3 col-12">
                            <p>昵称</p>
                        </div>
                        <div class="col-lg-2 col-md-2 col-12">
                            <p>是否封号</p>
                        </div>
                        <div class="col-lg-1 col-md-1 col-12 ">
                            <p>身份</p>
                        </div>
                        <div class="col-lg-3 col-md-3 col-12 align-center">
                            <p>操作</p>
                        </div>
                    </div>
                </div>
                <div class="single-item-list">
                    <div class="row align-items-center" v-for="u in userList">
                        <div class="col-lg-2 col-md-2 col-12">
                            <div class="item-image">
                                <div class="content">
                                    <h3 class="title"><a href="javascript:void(0)">{{ u.user_name }}</a></h3>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-3 col-12">
                            <div class="item-image">
                                <div class="content">
                                    <h3 class="title"><a href="javascript:void(0)">{{ u.nick_name }}</a></h3>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-2 col-md-2 col-12">
                            <div class="item-image">
                                <div class="content">
                                    <h3 class="title"><a href="javascript:void(0)">{{ u.state ? '已封号' : '正常' }}</a></h3>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-1 col-md-1 col-12 ">
                            <div class="item-image">
                                <div class="content">
                                    <h3 class="title">
                                        <a href="javascript:void(0)">
                                            {{ u.identity == '1' ? '学生' : '教师' }}
                                        </a>
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-3 col-12 align-center">
                            <ul class="action-btn">
                                <li><a href="javascript:void(0)" title="解封用户" @click="recoverThis(u.id, u.state)">
                                        <i class="lni lni-eye"></i></a></li>
                                <li><a href="javascript:void(0)" title="封禁用户" @click="deleteThis(u.id, u.state)">
                                        <i class="lni lni-trash"></i></a></li>
                                <li>
                                    <el-popover placement="bottom-start" :width="200" style="height:300px;"
                                        trigger="click" content="this is content, this is content, this is content">
                                        <template #reference>
                                            <a href="javascript:void(0)" title="修改用户身份">
                                                <i class="lni lni-control-panel"></i></a>
                                        </template>
                                        <template #default>
                                            <div style="height:60px">
                                                <el-radio-group v-model="u.identity" class="ml-4">
                                                    <el-radio value="1">学生</el-radio>
                                                    <el-radio value="2">教师</el-radio>
                                                </el-radio-group>
                                                <el-button type="primary" size="small" style="margin-top:10px"
                                                    @click="updateUserIdentity(u.id, u.identity)">确定</el-button>
                                            </div>
                                        </template>
                                    </el-popover>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <el-pagination :page-size="10" v-if="total > 10" @current-change="handleCurrentChange" :pager-count="5"
                    background layout="prev, pager, next" :total="total" />
            </div>

        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getUserList, banUser, unbanUser, updateUser } from '../../request/index'
import { ElMessage, ElMessageBox } from 'element-plus';
const router = useRouter()
const userList = ref([])
const total = ref(0)
const page = ref(1)
const getAllUserList = async () => {
    const { data } = await getUserList({ page: page.value })
    if (data.res) {
        userList.value = [...data.res]
    }
    total.value = data.total
}
// 初始化数据
getAllUserList()

const handleCurrentChange = async (val) => {
    page.value = val
    await getUserList()
}

const recoverThis = (id, state) => {
    if (state === 0) {
        ElMessage.success('用户为正常状态')
        return
    }
    ElMessageBox.confirm(
        '真的要解封该用户吗？',
        '警告',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            const { data } = await unbanUser({ id })
            if (data.code === 200) {
                ElMessage({
                    message: '操作成功',
                    type: 'success',
                    duration: 1000,
                    onClose: async () => {
                        await getAllUserList({ page: page.value })
                    }

                })
            }
        })
}

const deleteThis = (id, state) => {
    if (state === 1) {
        ElMessage.success('用户为封禁状态')
        return
    }
    ElMessageBox.confirm(
        '真的要封禁该用户吗？',
        '警告',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            const { data } = await banUser({ id })
            if (data.code === 200) {
                ElMessage({
                    message: '操作成功',
                    type: 'success',
                    duration: 1000,
                    onClose: async () => {
                        await getAllUserList({ page: page.value })
                    }
                })
            }
        })
}

const updateUserIdentity = async (id, identity) => {
    const { data } = await updateUser({ id, identity })
    if (data.code === 200) {
        ElMessage({
            message: '操作成功',
            type: 'success',
            duration: 1000,
            onClose: async () => {
                await getAllUserList({ page: page.value })
            }
        })
        return
    }
    ElMessage.error('操作失败')
}
</script>
<style lang='scss' scoped></style>