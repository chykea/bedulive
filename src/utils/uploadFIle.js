import { ElMessage } from "element-plus";
import { shouldUpload, mergeFile, uploadFile } from "../request";
const getPurpose = (purpose) => { // 上传的文件作为什么用途
    switch (purpose) {
        case 'avatar':
            return 'avatar';
        default:
            return 'file'
    }
}
async function handleUpload(file, use = 'file') {
    if (!file) return
    const purpose = getPurpose(use)
    const { fileChunkList, type, size } = createFileChunk(file) // 创建切片,返回值为切片数组,文件类型,切片标准大小
    const hash = await calculateHash(fileChunkList) // 计算文件的hash值
    const { needUpload } = await verifyUpload(type, hash);
    if (!needUpload) {
        ElMessage({
            message: "上传成功",
            type: "success",
            duration: 1000
        })
        return;
    }
    const res = await uploadChunk(fileChunkList, type, hash, size, purpose)
    return res
}

// 创建切片
function createFileChunk(file) {
    const chunkSize = 100 * 1024; // 切片大小 100kb
    const totalChunk = Math.ceil(file.size / chunkSize); // 根据文件大小计算出切片的个数
    const fileChunkList = []; // 存放切片blob
    for (let i = 0; i < totalChunk; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        fileChunkList.push({ file: chunk });
    }
    // 获取文件拓展名
    const fileNameArr = file.name.split('.')
    const type = file.name.split('.')[fileNameArr.length - 1]
    // 返回切片list、类型以及切片的标准大小
    return { fileChunkList, type, size: chunkSize };
}
// 上传切片，接收四个参数，list=切片list type=文件类型 hash=文件hash值 size=切片标准大小
async function uploadChunk(list, type, hash, size, purpose) {
    // 第一层处理
    list = list.map(({ file }, index) => ({
        chunk: file, // 切片
        hash: hash + '.' + type + '-' + index, // 切片名
        index,
        fileHash: hash + '.' + type // 文件名
    })).map(({ chunk, hash, index, fileHash }) => {
        // 存放到formData中
        const formData = new FormData();
        formData.append('chunk', chunk)
        formData.append('hash', hash)
        formData.append('filename', fileHash)
        return { formData, index }
    }).map(({ formData, index }) => {
        return uploadFile(formData)
    })
    await Promise.all(list)
    return await mergeReq(hash + '.' + type, size, purpose)
}

async function mergeReq(name, size, purpose) {
    return await mergeFile({ filename: name, size, purpose })
}
// 询问是否上传
async function verifyUpload(type, hash) {
    const { data } = await shouldUpload({ type, hash })
    // fetch要查看响应体,需要调用.json方法
    const needUpload = data.shouldUpload

    return { needUpload }
}


let worker = null
// 生成文件hash(通过web-worker创建子进程进行生成)
function calculateHash(fileChunkList) {
    return new Promise(resolve => {
        // vite项目中要使用绝对路径
        worker = new Worker('/src/utils/hash.js')
        worker.postMessage({ fileChunkList })
        worker.onmessage = e => {
            const { percentage, hash } = e.data;
            if (hash) {
                resolve(hash)
            }
        }
    })
}

export {
    handleUpload
}