const express = require('express')
const IndexController = require('../controllers/index.controller.js')
const router = new express.Router()

router.get('/files/data', async (req, res) => {
    try {
        const query = req.query.filename
        if(query){
            const data = await IndexController.getItems(query)
            //req.setHeader('Content-Type', 'application/json')
            res.status(200).send(data)
        } else {
            const data = await IndexController.getItems()
            //res.setHeader('content-type', 'application/json');
            res.status(200).send(data)
        }
    } catch (error) {
        res.status(error.status || 500).send({status: error.status, error: error.message})
    }
})

router.get('/files/list', async (req, res) => {
    try {
        const data = await IndexController.getList()
        //res.setHeader('content-type', 'application/json');
        res.status(200).send(data)
    } catch (error) {
        res.status(error.status || 500).send({status:error.status, error: error.message})
    }
})


module.exports = router;