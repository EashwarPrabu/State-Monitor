const router = require('express').Router();
const State = require('../model/State');

router.post('/', async (req, res) => {
    if(req.body.req == 0) {
        const devState = new State({
            id: req.body.id,
            ontime: req.body.on_time,
            offtime: req.body.off_time,
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
        State.updateOne({id: req.body.id}, {$set: {offtime: req.body.off_time}}, (err) => {
            if(err) return res.status(400).send(err);
            console.log("[Off Time Success]");
            return res.send("Success");
        });
    }
});

module.exports = router;