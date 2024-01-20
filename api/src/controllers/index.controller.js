const fs = require('fs')
const IndexServices = require('../services/index.services.js')
const path = require('path')
const util = require('util');
class IndexController {
    static async getItems() {
        return new Promise(async (resolve, reject) => {
            try {
                const files = await IndexServices.getList();
                const response = []
                let directory = path.resolve('src/files');
                // Create the directory if it doesn't exist
                if (!fs.existsSync(directory)) {
                    directory = path.resolve('app/src/files');
                }
                const filePaths = []
                for (const file of files) {
                    if (fs.existsSync(path.join(directory, file))) {
                        filePaths.push(path.join(directory, file))
                    }
                }

                // Función que devuelve una promesa para leer un stream
                function readStreamPromise(filePath) {
                    return new Promise((resolve, reject) => {
                        const data = [];
                        const readStream = fs.createReadStream(filePath, { highWaterMark: 16 });

                        readStream.on("data", (chunk) => {
                            data.push(chunk);
                        });
                        readStream.on("end", () => {
                            const file = path.basename(filePath)
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
                            resolve(response)
                        });

                        readStream.on("error", (error) => {
                            reject(error);
                        });
                    });
                }
                const readStreamPromises = filePaths.map(filePath => readStreamPromise(filePath));
                Promise.all(readStreamPromises)
                    .then(res => {
                        const [response] = res
                        resolve(response)
                    })
                    .catch(error => {
                        console.error("Al menos una de las promesas ha sido rechazada:", error);
                    });
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
    static async getItem(file) {
        return new Promise(async (resolve, reject) => {
            try {
                let readStream = null;
                let directory = path.resolve('src/files');
                if (!fs.existsSync(directory)) {
                    directory = path.resolve('app/src/files');
                }
                if (!fs.existsSync(path.join(directory, file))) {
                    console.log('here')
                    const data = await IndexServices.getItem(file);
                    if (!data) {
                        throw new Error('not found')
                    }
                    readStream = fs.createReadStream(path.join(directory, file), { highWaterMark: 16 });

                } else {
                    readStream = fs.createReadStream(path.join(directory, file), { highWaterMark: 16 });
                }
                const response = []
                const data = [];
                readStream.on("data", (chunk) => {
                    data.push(chunk);
                });

                readStream.on("end", () => {
                    const content = Buffer.concat(data).toString()
                    const rows = content.split('\n');
                    const rawData = rows.map(d => d.split(','))
                    const lines = []
                    const item = { file, lines }
                    const headers = rawData[0].map(d => d)
                    for (const data of rawData) {
                        const line = {}
                        if (data !== rawData[0]) {
                            if (headers.length === data.length) {
                                for (let i = 1; i < headers.length; i++) {
                                    if (data[i] !== '') {
                                        line[headers[i]] = data[i]
                                    }
                                }
                                if (Object.keys(line).length === 3) {
                                    lines.push(line)
                                }
                            }
                        }
                    }
                    response.push(item)
                    resolve(response)
                });
                readStream.on("error", (err) => {
                    console.log("error :", err);
                });
            } catch (error) {
                console.log("error :", error);
                reject({ error: true, message: 'not found', status: 404 })
            }
        })
    }
}

module.exports = IndexController