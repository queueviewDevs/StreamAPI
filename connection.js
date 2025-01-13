const {OrderedMap} = require('immutable');
const {ObjectId} = require('mongodb');

class Connection{

    constructor(app){
        this.app = app;
        this.clients = new OrderedMap();
        this.socketServerConnect();
    }

    getClients(){
        return this.clients;
    }

    addClient(id, client){
        this.clients = this.clients.set(id, client);
    }

    removeClient(id){
        this.clients = this.clients.remove(id);
    }

    socketServerConnect(){

        const app = this.app;

        app.wss.on('connection', (ws) => {
        
            console.log(`Raspberry PI is connected`);
        
            //Add this Pi client to client collection
            const clientId = new ObjectId().toString();

            const newClient = {
                _id: clientId,
                ws: ws,
                created: new Date()
            }
    
            this.addClient(clientId, newClient);
    
            ws.on('message', (msg) => {
                console.log("Message received from RPi is ", msg.toString());
            });

            ws.on('close', () => {
                console.log(`Raspberry Pi camera with id ${clientId} is disconnected`);
                this.removeClient(clientId);
            });
    
            const commandToSendToPi = {action: 'stream', payload: true};
            // ws.send(JSON.stringify(commandToSendToPi))
        });
    }
}
exports.connection = Connection;