<template>
    <div class="drawbroad" style="width: 100%;height:100%;">
        <canvas width="960" height="500" ref="drawbroad"></canvas>
    </div>
    <div class="drawbroad-operation">
        <ul>
            <li v-for="v in handleList" :key="v.type">
                <div v-if="v.type === 'color'">
                    <span>画笔颜色：</span>
                    <el-color-picker v-model="color" show-alpha @change="colorChange"></el-color-picker>
                </div>

                <el-button v-if="!['color', 'lineWidth', 'polygon'].includes(v.type)" @click="handleClick(v)"
                    :class="{ active: currHandle === v.type }">
                    {{ v.name }}
                </el-button>
                <el-popover placement="top" width="175" trigger="click" v-if="v.type === 'polygon'">
                    <el-input-number v-model="sides" @change="sidesChange" :min="3" :max="10"></el-input-number>
                    <template #reference>
                        <el-button @click="handleClick(v)" :class="{ active: currHandle === v.type }">{{ v.name
                        }}</el-button>
                    </template>
                </el-popover>
                <el-popover placement="top" width="400" trigger="click" v-if="v.type === 'lineWidth'">
                    <el-slider v-model="lineWidth" :max=20 @change="lineWidthChange"></el-slider>
                    <template #reference>
                        <el-button>{{ v.name }} <i>{{ lineWidth + 'px' }}</i></el-button>
                    </template>
                </el-popover>
            </li>
        </ul>
    </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import DrawBroad from '../../utils/drawbroad'
import { getSocket } from '../../utils/socket'
import { getInfo, debounce } from '../../utils/util'
const client = getSocket()
const route = useRoute()
const userInfo = getInfo()
let roomId = route.query.roomId || userInfo.uid

const drawbroad = ref(null)
let drawbroadInstance = null
const color = ref('rgba(19, 206, 102, 1)')
const currHandle = ref('line')
const lineWidth = ref(5)
const allowCancel = ref(true)
const allowGo = ref(true)
const sides = ref(3)
const handleList = [
    { name: '圆', type: 'arc' },
    { name: '线条', type: 'line' },
    { name: '矩形', type: 'rect' },
    { name: '多边形', type: 'polygon' },
    { name: '橡皮擦', type: 'eraser' },
    { name: '撤回', type: 'cancel' },
    { name: '前进', type: 'go' },
    { name: '清屏', type: 'clear' },
    { name: '线宽', type: 'lineWidth' },
    { name: '颜色', type: 'color' }
]
const allowCallback = (cancel, go) => {
    allowCancel.value = !cancel;
    allowGo.value = !go;
}
const moveCallback = (...arr) => {
    send(arr)
}
const send = (arr) => {
    if (arr[0] == 'gatherImage') {
        client.socket.emit('sendPaint', {
            roomId,
            user: userInfo,
            data: drawbroadInstance.imgSrc
        })
    }
}
client.socket.on('getPaint', ({ roomId, user, data }) => {
    nextTick(() => {
        drawbroadInstance.drawImage(data)
    })
})
onMounted(() => {
    drawbroadInstance = new DrawBroad(drawbroad.value, {
        drawColor: color.value,
        drawType: currHandle.value,
        lineWidth: lineWidth.value,
        allowCallback: allowCallback,
        moveCallback: moveCallback
    })
})
const sidesChange = (sides) => { // 改变多边形边数
    nextTick(() => {
        drawbroadInstance.changeWay({ sides: sides });
    })
}
const colorChange = (color) => { // 改变颜色
    nextTick(() => {
        drawbroadInstance.changeWay({ color: color });
    })
}
const lineWidthChange = (lineWidth) => { // 改变线宽
    nextTick(() => {
        drawbroadInstance.changeWay({ lineWidth: lineWidth });
    })
}
const handleClick = (v) => { // 操作按钮
    if (['cancel', 'go', 'clear'].includes(v.type)) {
        moveCallback(v.type);
        drawbroadInstance[v.type]();
        client.socket.emit('sendPaint', {
            roomId,
            user: userInfo,
            data: drawbroadInstance.imgSrc
        })
        return;
    }
    drawbroadInstance.changeWay({ type: v.type });
    if (['color', 'lineWidth'].includes(v.type)) return;
    currHandle.value = v.type;
}
</script>
<style lang='scss' scoped>
.drawbroad-operation {

    // height: 100px;
    ul {
        padding: 10px;
    }

    ul>li {
        margin: 0 5px;
        display: inline-block;
    }
}
</style>