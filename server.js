const http = require('http');
const { execFile } = require('child_process');
const fs = require('fs');

const PORT = 9876;

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/run' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { path } = JSON.parse(body);
                if (!fs.existsSync(path)) {
                    res.writeHead(404);
                    res.end(JSON.stringify({ ok: false, error: 'File not found: ' + path }));
                    return;
                }
                execFile(path, [], { detached: true, shell: true }, (err) => {
                    if (err) {
                        res.writeHead(500);
                        res.end(JSON.stringify({ ok: false, error: err.message }));
                    } else {
                        res.writeHead(200);
                        res.end(JSON.stringify({ ok: true }));
                    }
                });
            } catch (e) {
                res.writeHead(400);
                res.end(JSON.stringify({ ok: false, error: e.message }));
            }
        });
        return;
    }

    // GET /ping - health check
    res.writeHead(200);
    res.end(JSON.stringify({ ok: true, msg: 'AI中台本地服务运行中' }));
});

server.listen(PORT, '127.0.0.1', () => {
    console.log('AI中台本地服务已启动: http://127.0.0.1:' + PORT);
    console.log('按 Ctrl+C 停止');
});
