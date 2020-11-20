const router = require('express').Router();
const State = require('../model/State');

function getCurrentDate() {
    let monthNames = ["January", "February", "March", "April", "May", "June",
         "July", "August", "September", "October", "November", "December"];
    let dateObj = new Date();
    let monthString = monthNames[dateObj.getMonth()];
    let monthNo = monthNames.indexOf(monthString) + 1;
    let day = String(dateObj.getDate()).padStart(2, '0');
    let year = dateObj.getFullYear();
    let output =  day + '.'+ monthNo  + '.' + year;
    return output;
}

function getData(userDate = getCurrentDate()) {
    const queryDate = userDate;
    const mydata = State.find({date: queryDate});
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