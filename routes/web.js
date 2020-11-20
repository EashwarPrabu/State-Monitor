const router = require('express').Router();
const State = require('../model/State');

function getData() {
    const mydata = State.find();
    return mydata;
}

router.get('/getData', async(req, res) => {
    const mydata = await getData();
    console.log(mydata);
    return res.json(mydata);
});

router.get('/', (req, res) => {
    return res.render('index');
});

module.exports = router; 