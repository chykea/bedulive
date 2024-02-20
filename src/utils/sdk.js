'use strict';

function SrsError(name, message) {
    this.name = name;
    this.message = message;
    this.stack = (new Error()).stack;
}
SrsError.prototype = Object.create(Error.prototype);
SrsError.prototype.constructor = SrsError;


// 推流
function SrsRtcPublishAsync() {

    var self = {};
    // self.streamUrl = url
    var screenConstraint = {
        video: true

    }
    var cemareConstraint = {
        video: true,
        audio: true
    }
    var soundsConstraint = {
        // video: true,
        audio: true
    }
    self.pc = new RTCPeerConnection(null);

    self.camera = new MediaStream();
    self.screen = new MediaStream();
    self.audio = new MediaStream();

    self.close = function () {
        self.pc && self.pc.close();
        self.pc = null;
    };



    /* self.openCemare = async function () {
        if (self.camera.getTracks().length) return
        // 摄像头
        var stream = await navigator.mediaDevices.getUserMedia(cemareConstraint);

        stream.getTracks().forEach(function (track) {
            // 然后添加到RTCPeerConnection中(传输)
            // self.pc.addTrack(track);
            // 把每个轨道放到self.stream中(本地显示)
            self.camera.addTrack(track);
            self.pc.addTrack(track, self.camera)
        });
    } */
    self.openScreen = async function () {
        if (self.screen.getTracks().length) return

        // 获取屏幕
        var screenStream = await navigator.mediaDevices.getDisplayMedia(screenConstraint)
        screenStream.getTracks().forEach(function (track) {
            // self.pc.addTrack(track);
            self.screen.addTrack(track)
            self.pc.addTrack(track, self.screen)
        });

    }
    // 用于开启声音
    self.openSounds = async function () {
        var soundsStream = await navigator.mediaDevices.getUserMedia(soundsConstraint);

        // 把获取到的音轨添加到屏幕的视频流中
        soundsStream.getTracks().forEach(function (track) {
            // 本地可以不用听到
            // self.screen.addTrack(track)
            self.pc.addTrack(track)
        })
    }

    self.publish = async function (url) {
        self.session = await self.generateOffer(url)
        return self.session
    }
    self.generateOffer = async function (url) {

        var conf = self.__internal.prepareUrl(url);

        self.pc.addTransceiver("audio", { direction: "recvonly" });
        // self.pc.addTransceiver("video", { direction: "recvonly", streams: [self.camera] });
        self.pc.addTransceiver("video", { direction: "recvonly", streams: [self.screen] });


        // await self.openCemare()
        await self.openSounds()
        await self.openScreen()


        var offer = await self.pc.createOffer();

        await self.pc.setLocalDescription(offer);
        // console.log("offer", offer.sdp);
        var session = await new Promise(function (resolve, reject) {
            var data = {
                api: conf.apiUrl, tid: conf.tid, streamurl: conf.streamUrl,
                clientip: null, sdp: offer.sdp
            };

            $.ajax({
                type: "POST", url: conf.apiUrl, data: JSON.stringify(data),
                contentType: 'application/json', dataType: 'json'
            }).done(function (data) {

                if (data.code) {
                    reject(data);
                    return;
                }

                resolve(data);
            }).fail(function (reason) {
                reject(reason);
            });
        });

        // console.log('远端offer', session.sdp);
        await self.pc.setRemoteDescription(
            new RTCSessionDescription({ type: 'answer', sdp: session.sdp })
        );

        return session;
    }
    self.__internal = {
        defaultPath: '/rtc/v1/publish/',
        prepareUrl: function (webrtcUrl) {
            //
            var urlObject = self.__internal.parse(webrtcUrl);

            // If user specifies the schema, use it as API schema.
            var schema = urlObject.user_query.schema;
            schema = schema ? schema + ':' : window.location.protocol;

            var port = urlObject.port || 1985;
            if (schema === 'https:') {
                port = urlObject.port || 443;
            }

            // @see https://github.com/rtcdn/rtcdn-draft
            var api = urlObject.user_query.play || self.__internal.defaultPath;
            if (api.lastIndexOf('/') !== api.length - 1) {
                api += '/';
            }

            apiUrl = schema + '//' + urlObject.server + ':' + port + api;
            for (var key in urlObject.user_query) {
                if (key !== 'api' && key !== 'play') {
                    apiUrl += '&' + key + '=' + urlObject.user_query[key];
                }
            }
            // Replace /rtc/v1/play/&k=v to /rtc/v1/play/?k=v
            var apiUrl = apiUrl.replace(api + '&', api + '?');

            var streamUrl = urlObject.url;

            return {
                apiUrl: apiUrl, streamUrl: streamUrl, schema: schema, urlObject: urlObject, port: port,
                tid: Number(parseInt(new Date().getTime() * Math.random() * 100)).toString(16).substr(0, 7)
            };
        },
        parse: function (url) {
            // 根据推流地址进行解析
            // 据观察，这个创建出来的a标签只是用于进行推流地址的解析
            // @see: http://stackoverflow.com/questions/10469575/how-to-use-location-object-to-parse-url-without-redirecting-the-page-in-javascri
            var a = document.createElement("a");
            a.href = url.replace("rtmp://", "http://")
                .replace("webrtc://", "http://")
                .replace("rtc://", "http://");

            var vhost = a.hostname;
            var app = a.pathname.substr(1, a.pathname.lastIndexOf("/") - 1);
            var stream = a.pathname.substr(a.pathname.lastIndexOf("/") + 1);


            // parse the vhost in the params of app, that srs supports.
            app = app.replace("...vhost...", "?vhost=");
            if (app.indexOf("?") >= 0) {
                var params = app.substr(app.indexOf("?"));
                app = app.substr(0, app.indexOf("?"));

                if (params.indexOf("vhost=") > 0) {
                    vhost = params.substr(params.indexOf("vhost=") + "vhost=".length);
                    if (vhost.indexOf("&") > 0) {
                        vhost = vhost.substr(0, vhost.indexOf("&"));
                    }
                }
            }

            // when vhost equals to server, and server is ip, 当vhost等于host，此时为ip地址访问
            // the vhost is __defaultVhost__
            if (a.hostname === vhost) {
                var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
                if (re.test(a.hostname)) { // 替换为__defaultVhost__
                    vhost = "__defaultVhost__";
                }
            }

            // parse the schema
            var schema = "rtmp"; // 默认为rtmp
            if (url.indexOf("://") > 0) {
                // 获取当前的传输格式(webrtc)
                schema = url.substr(0, url.indexOf("://"));
            }

            // 获取推流地址上的端口号
            var port = a.port;
            // 如果没有端口号
            if (!port) {
                // Finger out by webrtc url, if contains http or https port, to overwrite default 1985.
                // 判断是否为webrtc推流
                // console.log(url.indexOf(`webrtc://${a.host}:`));
                if (schema === 'webrtc' && url.indexOf(`webrtc://${a.host}:`) === 0) {
                    port = (url.indexOf(`webrtc://${a.host}:80`) === 0) ? 80 : 443;
                }

                // Guess by schema.
                if (schema === 'http') {
                    port = 80;
                } else if (schema === 'https') {
                    port = 443;
                } else if (schema === 'rtmp') {
                    port = 1935;
                }
            }

            var ret = {
                url: url,
                schema: schema,
                server: a.hostname, port: port,
                vhost: vhost, app: app, stream: stream
            };
            self.__internal.fill_query(a.search, ret);

            // For webrtc API, we use 443 if page is https, or schema specified it.
            if (!ret.port) {
                if (schema === 'webrtc' || schema === 'rtc') {
                    if (ret.user_query.schema === 'https') {
                        ret.port = 443;
                    } else if (window.location.href.indexOf('https://') === 0) {
                        ret.port = 443;
                    } else {
                        // For WebRTC, SRS use 1985 as default API port.
                        ret.port = 1985;
                    }
                }
            }

            return ret;
        },
        fill_query: function (query_string, obj) {
            // pure user query object.
            obj.user_query = {};

            if (query_string.length === 0) {
                return;
            }

            // split again for angularjs.
            if (query_string.indexOf("?") >= 0) {
                query_string = query_string.split("?")[1];
            }

            var queries = query_string.split("&");
            for (var i = 0; i < queries.length; i++) {
                var elem = queries[i];

                var query = elem.split("=");
                obj[query[0]] = query[1];
                obj.user_query[query[0]] = query[1];
            }

            // alias domain for vhost.
            if (obj.domain) {
                obj.vhost = obj.domain;
            }
        }
    };

    return self;
}


function SrsRtcPlayerAsync() {
    var self = {};

    // 只拉
    self.play = async function (url) {
        var conf = self.__internal.prepareUrl(url);

        self.pc.addTransceiver("audio", { direction: "recvonly" });
        // self.pc.addTransceiver("video", { direction: "recvonly", streams: [self.camera] });
        self.pc.addTransceiver("video", { direction: "recvonly", streams: [self.screen] });


        var offer = await self.pc.createOffer();
        // console.log('本地sdp', offer.sdp);
        // 本地生成的sdp与answer的m=行修改一致(当摄像头与屏幕同时存在时)
        // offer.sdp = offer.sdp.replace(/a=group:BUNDLE 0 1 2/g, 'a=group:BUNDLE 0 1 video-1')
        // offer.sdp = offer.sdp.replace(/a=mid:2/g, 'a=mid:video-1')

        await self.pc.setLocalDescription(offer);
        // console.log('本地offer', offer.sdp);

        var session = await new Promise(function (resolve, reject) {
            // @see https://github.com/rtcdn/rtcdn-draft
            var data = {
                api: conf.apiUrl, tid: conf.tid, streamurl: conf.streamUrl,
                clientip: null, sdp: offer.sdp
            };

            $.ajax({
                type: "POST", url: conf.apiUrl, data: JSON.stringify(data),
                contentType: 'application/json', dataType: 'json'
            }).done(function (data) {
                // console.log("Got answer: ", data);
                if (data.code) {
                    reject(data); return;
                }

                resolve(data);
            }).fail(function (reason) {
                reject(reason);
            });
        });
        // console.log('远方sdp', session.sdp);
        await self.pc.setRemoteDescription(
            new RTCSessionDescription({ type: 'answer', sdp: session.sdp })
        );
        session.simulator = conf.schema + '//' + conf.urlObject.server + ':' + conf.port + '/rtc/v1/nack/';

        return session;
    };

    // Close the player.
    self.close = function () {
        self.pc && self.pc.close();
        self.pc = null;
    };

    // 接收到远端的音视频轨道时
    // The callback when got remote track.
    self.ontrack = function (event) {
        // console.log(event);
        // console.log(event.track);
        self.screen.addTrack(event.track)
        // if (event.track.kind == 'video') {
        //     self.screen.addTrack(event.track);
        // }
        // else if (event.track.kind == 'audio') {
        //     self.audio.addTrack(event.track);
        // }


    };

    // Internal APIs.
    self.__internal = {
        defaultPath: '/rtc/v1/play/',
        prepareUrl: function (webrtcUrl) {
            var urlObject = self.__internal.parse(webrtcUrl);

            // If user specifies the schema, use it as API schema.
            var schema = urlObject.user_query.schema;
            schema = schema ? schema + ':' : window.location.protocol;

            var port = urlObject.port || 1985;
            if (schema === 'https:') {
                port = urlObject.port || 443;
            }

            // @see https://github.com/rtcdn/rtcdn-draft
            var api = urlObject.user_query.play || self.__internal.defaultPath;
            if (api.lastIndexOf('/') !== api.length - 1) {
                api += '/';
            }

            apiUrl = schema + '//' + urlObject.server + ':' + port + api;
            for (var key in urlObject.user_query) {
                if (key !== 'api' && key !== 'play') {
                    apiUrl += '&' + key + '=' + urlObject.user_query[key];
                }
            }
            // Replace /rtc/v1/play/&k=v to /rtc/v1/play/?k=v
            var apiUrl = apiUrl.replace(api + '&', api + '?');

            var streamUrl = urlObject.url;

            return {
                apiUrl: apiUrl, streamUrl: streamUrl, schema: schema, urlObject: urlObject, port: port,
                tid: Number(parseInt(new Date().getTime() * Math.random() * 100)).toString(16).substr(0, 7)
            };
        },
        parse: function (url) {
            // @see: http://stackoverflow.com/questions/10469575/how-to-use-location-object-to-parse-url-without-redirecting-the-page-in-javascri
            var a = document.createElement("a");
            a.href = url.replace("rtmp://", "http://")
                .replace("webrtc://", "http://")
                .replace("rtc://", "http://");

            var vhost = a.hostname;
            var app = a.pathname.substr(1, a.pathname.lastIndexOf("/") - 1);
            var stream = a.pathname.substr(a.pathname.lastIndexOf("/") + 1);

            // parse the vhost in the params of app, that srs supports.
            app = app.replace("...vhost...", "?vhost=");
            if (app.indexOf("?") >= 0) {
                var params = app.substr(app.indexOf("?"));
                app = app.substr(0, app.indexOf("?"));

                if (params.indexOf("vhost=") > 0) {
                    vhost = params.substr(params.indexOf("vhost=") + "vhost=".length);
                    if (vhost.indexOf("&") > 0) {
                        vhost = vhost.substr(0, vhost.indexOf("&"));
                    }
                }
            }

            // when vhost equals to server, and server is ip,
            // the vhost is __defaultVhost__
            if (a.hostname === vhost) {
                var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
                if (re.test(a.hostname)) {
                    vhost = "__defaultVhost__";
                }
            }

            // parse the schema
            var schema = "rtmp";
            if (url.indexOf("://") > 0) {
                schema = url.substr(0, url.indexOf("://"));
            }

            var port = a.port;
            if (!port) {
                // Finger out by webrtc url, if contains http or https port, to overwrite default 1985.
                if (schema === 'webrtc' && url.indexOf(`webrtc://${a.host}:`) === 0) {
                    port = (url.indexOf(`webrtc://${a.host}:80`) === 0) ? 80 : 443;
                }

                // Guess by schema.
                if (schema === 'http') {
                    port = 80;
                } else if (schema === 'https') {
                    port = 443;
                } else if (schema === 'rtmp') {
                    port = 1935;
                }
            }

            var ret = {
                url: url,
                schema: schema,
                server: a.hostname, port: port,
                vhost: vhost, app: app, stream: stream
            };
            self.__internal.fill_query(a.search, ret);

            // For webrtc API, we use 443 if page is https, or schema specified it.
            if (!ret.port) {
                if (schema === 'webrtc' || schema === 'rtc') {
                    if (ret.user_query.schema === 'https') {
                        ret.port = 443;
                    } else if (window.location.href.indexOf('https://') === 0) {
                        ret.port = 443;
                    } else {
                        // For WebRTC, SRS use 1985 as default API port.
                        ret.port = 1985;
                    }
                }
            }

            return ret;
        },
        fill_query: function (query_string, obj) {
            // pure user query object.
            obj.user_query = {};

            if (query_string.length === 0) {
                return;
            }

            // split again for angularjs.
            if (query_string.indexOf("?") >= 0) {
                query_string = query_string.split("?")[1];
            }

            var queries = query_string.split("&");
            for (var i = 0; i < queries.length; i++) {
                var elem = queries[i];

                var query = elem.split("=");
                obj[query[0]] = query[1];
                obj.user_query[query[0]] = query[1];
            }

            // alias domain for vhost.
            if (obj.domain) {
                obj.vhost = obj.domain;
            }
        }
    };

    self.pc = new RTCPeerConnection(null);


    self.camera = new MediaStream();
    self.screen = new MediaStream();
    self.audio = new MediaStream();

    // 接收到远端轨道时会自动执行
    self.pc.ontrack = function (event) {
        // console.log(event);
        // console.log(self.pc);
        if (self.ontrack) {
            self.ontrack(event);
        }
    };

    return self;
}
