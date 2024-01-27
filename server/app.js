import NodeMediaServer from 'node-media-server'

const config = {
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 60,
        ping_timeout: 30
    },
    http: { // http访问 http://localhost:8000/live
        port: 8000,
        allow_origin: '*',
        // mediaroot: "../media" 
    },
    // 转码
    /* trans: {   
        ffmpeg: 'D:/ffmpeg/ffmpeg-4.3.1-2021-01-01-essentials_build/bin/ffmpeg.exe', // 替换为你的FFmpeg可执行文件路径
        tasks: [
            {
                app: 'live',
                mp4: true,
                mp4Flags: '[movflags=faststart]',
            },
        ],
    }, */
};

var nms = new NodeMediaServer(config)
nms.run();
console.log('http://localhost:8000/admin  查看媒体流');
