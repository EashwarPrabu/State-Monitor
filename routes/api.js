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

async function getData(userDate) {
    const queryDate = userDate;
    const mydata = await State.find({date: queryDate});
    return mydata;
}

router.get('/', async(req, res) => {
    let userDate;
    if(req.query.date) {
        userDate = req.query.date;
        console.log(userDate);
    } else {
        userDate = getCurrentDate();
    }
    const mydata = await getData(userDate);
    console.log(mydata);
    return res.json(mydata);
});

router.post('/', async (req, res) => {
    if(req.body.STATE == 1) {
        const devState = new State({
            id: req.body.REQUESTNO,
            ontime: req.body.TIME,
            date: req.body.DATE,
            day: req.body.DAY
        });
        try{
            const savedState = await devState.save();
            console.log("[On Time Success]");
            console.log(savedState);
            return res.send("Success");    
        } catch(err) {
            return res.status(400).send(err);
        }
    } else {
        State.updateOne({id: req.body.REQUESTNO}, {$set: {offtime: req.body.TIME}}, (err) => {
            if(err) return res.status(400).send(err);
            console.log("[Off Time Success]");
            return res.send("Success");
        });
    }
});

module.exports = router;