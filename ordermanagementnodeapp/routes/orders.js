var express = require('express');
var router = express.Router();

/* GET orderlist. */
router.get('/orderlist', function(req, res) {
    var db = req.db;
    db.collection('orderlist').find().toArray(function (err, items) {
        res.json(items);
    });
});

/* POST to addorder. */
router.post('/addorder', function(req, res) {
    var db = req.db;
    db.collection('orderlist').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/* DELETE to deleteorder. */
router.delete('/deleteorder/:id', function(req, res) {
    var db = req.db;
    var orderToDelete = req.params.id;
    db.collection('orderlist').removeById(orderToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
