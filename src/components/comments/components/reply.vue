<template>
  <div class="reply">
    <div class="reply-img">
      <el-avatar :size="50" :src="reply.user.avatar_url"></el-avatar>
    </div>
    <div class="reply-desc">
      <div class="desc-top">
        <h6>{{ reply.user.nick_name }}</h6>
      </div>
      <p>
        {{
        parentReply
          ? `回复 @${parentReply.user.nick_name} :` + reply.content
          : reply.content
      }}
      </p>
      <span class="date">{{ reply.createdAt }}</span>&nbsp;
      <a href="javascript:void(0)" @click="showReply(reply.id)">回复</a>
      &nbsp;
      <a href="javascript:void(0)" v-if="reply.user.uid === store.userInfo.uid || store.userInfo.identity === '0'"
        @click="deleteReply(reply.id)">删除
      </a>
    </div>
    <div :id="prefix + reply.id"></div>
  </div>
  <template v-if="reply.replies.length">
    <Reply v-for="item in reply.replies" :key="item.id" :reply="item" :parentReply="reply" :articleId="articleId">
    </Reply>
  </template>
  <Teleport v-if="locationID !== 'body'" :to="locationID">
    <div>
      <el-input v-model="replyContent" style="height: 50px" placeholder="请输入内容哟"></el-input>
      <div style="text-align: right; margin-top: 10px">
        <el-button class="btn" @click="handleReply">回复</el-button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from "vue";
import Reply from "./reply.vue";
import { addComment, deleteComment } from "../../../request/index";
import { useRootStore } from "../../../store/index";
const store = useRootStore();
const emits = defineEmits(["reloads"]);
const props = defineProps({
  parentReply: {
    type: Object,
    default: null,
  },
  reply: {
    type: Object,
    default: () => ({}),
  },
  articleId: {
    type: String,
    default: "",
  },
});

// 保存被回复的id
let id = null;
const locationID = ref("body");
// 回复内容
const replyContent = ref("");
// 前缀
const prefix = "reply-to-reply-";

const showReply = async (parentId) => {
  if (locationID.value.length > prefix.length + 1) {
    const tmp = locationID.value.substring(prefix.length + 1, locationID.value.length);
    if (tmp == parentId) {
      locationID.value = "body";
      id = null;
      return;
    }
  }
  locationID.value = "#" + prefix + parentId;
  id = parentId;
};

const handleReply = async () => {
  if (!replyContent.value) {
    ElMessage({
      message: "请输入回复内容",
      type: "warning",
    });
    return;
  }
  const articleId = props.articleId;
  const content = replyContent.value;
  const parentId = id;
  const { data } = await addComment({ articleId, content, parentId });
  if (data.code == "0") {
    ElMessage({
      message: "回复成功",
      type: "success",
      duration: 1000,
    });
    locationID.value = "body";
    id = null;
    replyContent.value = "";
    emits('reloads')
    // location.reload();
    return;
  }
  ElMessage({
    message: "回复失败",
    type: "error",
    duration: 1000,
  });
};

const deleteReply = async (commentId) => {
  try {
    const res = await ElMessageBox.confirm("删除评论操作不可逆！是否继续", "Warning", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    });
    if (res === "confirm") {
      const { data } = await deleteComment(commentId);
      if (data.code == "0") {
        ElMessage({
          message: "删除成功",
          type: "success",
          duration: 1000,
        });
        emits('reloads')
        // location.reload();
        return;
      }
      ElMessage({
        message: "删除失败",
        type: "error",
        duration: 1000,
      });
    }
  } catch (e) {
    ElMessage({
      type: "info",
      message: "删除取消",
    });
  }
};
</script>

<style lang="scss" scoped>
.reply {
  position: relative;
  padding-left: 80px;
  margin-bottom: 20px;

  .reply-img {
    position: absolute;
    left: 0;
    width: 50px;
    height: 50px;
  }

  .reply-desc {
    a {
      color: #aaa;
    }

    a:hover {
      color: #0d6efd;
    }
  }
}
</style>
