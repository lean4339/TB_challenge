const fs = require('fs')
const IndexServices = require('../services/index.services.js')
const path = require('path')
class IndexController {
    static async getItems(query) {
        return new Promise(async (resolve, reject) => {
        try {
            if(!query) {
            const files = await IndexServices.getList();
            const response = []
            let directory =  path.resolve('src/files');
              // Create the directory if it doesn't exist
              if (!fs.existsSync(directory)) {
                directory = path.resolve('app/src/files');
            }
            for (const file of files) {

                if (fs.existsSync(path.join(directory, file))) {
                    const readStream = fs.createReadStream(path.join(directory, file), { highWaterMark: 16 });
                    const data = [];
                    readStream.on("data", (chunk) => {
                        data.push(chunk);
                    });

                    readStream.on("end", () => {
                        const content = Buffer.concat(data).toString()
                        const rows = content.split('\n');
                        const rawData = rows.map(d => d.split(','))
                        const lines = []
                        const item = {file, lines}
                        const headers = rawData[0].map(d => d)
                        for(const data of rawData){
                            const line = {}
                            if(data !== rawData[0]){
                                if(headers.length === data.length){
                                    for(let i = 1; i < headers.length; i ++) {
                                        if(data[i] !== ''){
                                            line[headers[i]] = data[i]
                                        }
                                    }
                                    if(Object.keys(line).length === 3){
                                        lines.push(line) 
                                    }
                                }
                            }
                        }
                        response.push(item)
                        if( files[files.length -1] == file){
                            resolve(response)
                        }
                    });

                    readStream.on("error", (err) => {
                        console.log("error :", err);
                    });
                } else {
                    continue;
                }
            }
            } else {
            const file = await IndexServices.getItem(query);
            const response = []
            if (fs.existsSync(`/app/src/files/${file}`)) {
                const readStream = fs.createReadStream(`/app/src/files/${file}`, { highWaterMark: 16 });
                const data = [];
                readStream.on("data", (chunk) => {
                    data.push(chunk);
                });

                readStream.on("end", () => {
                    const content = Buffer.concat(data).toString()
                    const rows = content.split('\n');
                    const rawData = rows.map(d => d.split(','))
                    const lines = []
                    const item = {file, lines}
                    const headers = rawData[0].map(d => d)
                    for(const data of rawData){
                        const line = {}
                        if(data !== rawData[0]){
                            if(headers.length === data.length){
                                for(let i = 1; i < headers.length; i ++) {
                                    if(data[i] !== ''){
                                        line[headers[i]] = data[i]
                                    }
                                }
                                lines.push(line) 
                            }
                        }
                    }
                    response.push(item)
                        resolve(response)
                });
                readStream.on("error", (err) => {
                    console.log("error :", err);
                });
            } else {
                reject({ error: true, message: 'not found', status: 404 })
            }
            }
        } catch (error) {
            reject({ error: true, message: error.message, status: 500 })
        }
        })
    }
    static async getList() {
        try {            
            const files = await IndexServices.getList()
            return files
        } catch (error) {
            return error
        }
    }
}

module.exports = IndexController