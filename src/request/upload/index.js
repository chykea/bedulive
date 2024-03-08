import qs from 'qs'
import http from '../../utils/request'

function shouldUpload(params) {
    return http.post('/vertifyUpload', params);
}
function uploadFile(params) {
    return http.post('/uploadChunk', params, { headers: { 'Content-Type': 'multipart/form-data' } });
}
function mergeFile(params) {
    return http.post('/mergeFile', params);
}
export {
    shouldUpload,
    mergeFile,
    uploadFile
}