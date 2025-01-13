const _ = require('lodash');
exports.routers = (app) => {
    
    /**
     * @method GET
     * @endpoint /
     * @description Root API Endpoint
     * sudo ffmpeg -re -i video.mov -c:v libx264 -preset veryfast -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -g 50 -c:a aac -b:a 160k -ac 2 -ar 44100 -f flv rtmp://localhost/live/testing
     */
    app.get('/', (req, res) => {
        return res.json({version: '1.0'});
    });


    /**
     * @method POST
     * @endpoint /api/on-live-auth
     * @description authentication for live stream user
     * sudo ffmpeg -re -i video.mov -c:v libx264 -preset veryfast -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -g 50 -c:a aac -b:a 160k -ac 2 -ar 44100 -f flv rtmp://localhost/live/testing
     */
    app.post('/api/on-live-auth', (req, res, next) => {
        const streamInfo = req.body;
        const streamSecretKey = _.get(streamInfo, 'name');

        console.log(`Camera with key: ${streamSecretKey} is now streaming`);
        console.log(streamInfo);

        return res.status(200).json({
            verified: true
        });
    });

    /**
     * @method POST
     * @endpoint /api/on-live-done
     * @description Event after user finishes streaming
     */
    app.post('/api/on-live-done', (req, res, next) => {

        const streamSecretKey = _.get(req, 'body.name');
        console.log(`Camera with key ${streamSecretKey} has stopped streaming to RTMP Server`);

        return res.json({
            done: true
        });
    });

    /**
     * @method POST
     * @endpoint /api/camera/:id/stream
     * @description Send command to server with camera ID and start/stop streaming
     */
    app.post('/api/camera/:id/stream', (req, res, next) => {

        const body = req.body;
        console.log("Got body command", body);

        const payload = _.get(body, 'stream', false);

        //after receiving action from a camera, need to let camera
        const connections = app.connections.getClients();

        //loop all rpi socket clients and send this command to pi
        connections.forEach((con) => {
            const ws = con.ws;
            if(ws){
                const message = {
                    action: 'stream',
                    payload: payload
                }
                console.log("Sending: ", JSON.stringify(message));
                ws.send(JSON.stringify(message));
            }
        })

        return res.status(200).json({
            received: true
        });
    });
}