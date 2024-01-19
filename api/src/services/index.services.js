
const axios = require('axios');
const fs = require('fs');
const path = require('path');
class IndexServices {

    static async getList() {
        try {
            const headers = {
                Authorization: 'Bearer aSuperSecretKey'
            }
            const files = await axios.get('https://echo-serv.tbxnet.com/v1/secret/files', { headers })
            for (const file of files.data.files) {
                try {
                    const fileData = await axios.get(`https://echo-serv.tbxnet.com/v1/secret/file/${file}`, {
                        headers,
                        method: 'GET',
                        responseType: 'arraybuffer',
                    })
                    let directory =  path.resolve('src/files');

                    // Create the directory if it doesn't exist
                    if (!fs.existsSync(directory)) {
                        directory = path.resolve('app/src/files');
                    }
                    const stream = fs.createWriteStream(path.join(directory, file))
                    stream.on('error', (err) => {
                        console.error('Error al escribir en el archivo:', err);
                    });
                    stream.write(fileData.data);
                    stream.end();
                } catch (error) {
                    console.error({ error: error.message, file: file })
                    continue
                }
            }
            return files.data.files
        } catch (error) {
            return { error: true, status: error.statusCode || 500, message: error.message }
        }
    }
    static async getItem(file) {
        try {
            const headers = {
                Authorization: 'Bearer aSuperSecretKey'
            }
            const fileData = await axios.get(`https://echo-serv.tbxnet.com/v1/secret/file/${file}`, {
                headers,
                method: 'GET',
                responseType: 'arraybuffer',
            })
            const stream = fs.createWriteStream(`/app/src/files/${file}`)
            stream.on('error', (err) => {
                console.error('Error al escribir en el archivo:', err);
            });
            stream.write(fileData.data);
            stream.end();
            return file
        } catch (error) {
            return error
        }
    }
}

module.exports = IndexServices;