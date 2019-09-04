let http = require('http');
let crypto = require('crypto');
// 加密
let SECRET = '123456'; // webhook里面的m秘钥
function sign(body) {
    return `sha1=${crypto.createHmac('sha1',SECRET).update(body).digest('hex')}`
}

let server = http.createServer((req, res) => {
    console.log(req.method, req.url);
    if (req.method == 'POST' && req.url == '/webhook') {
        let buffers = [];
        req.on('data', buffer => {
            buffers.push(buffer);
        })
        req.on('end', buffer => {
            let body = Buffer.concat(buffers);
            let event = req.header['x-githHub-ecnet']; // event= push
            // 签名:github请求来的时候， 要传递请求体body，另外还会传一个signature过来，需要验证签名正确与否
            let signature = req.header['x-hub-signature'];
            if (signature !== sign(body)) {
                return res.end('Not Found');
            }
        })
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: true }))
    } else {
        res.end('Not Found');
    }
});

serve.listen(4000, () => {
    console.log('webhook服务已经在4000端口上启动')
})