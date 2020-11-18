const router = require('express').Router();
const State = require('../model/State');

function getData() {
    const mydata = State.find();
    return mydata;
}

router.get('/', async (req, res) => {
    const mydata = await getData();
    console.log(mydata);
    return res.send(mydata);
});

module.exports = router; 