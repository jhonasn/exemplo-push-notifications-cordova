var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var unirest = require('unirest');

var filePath = path.join('../', 'data.json');

module.getJson = function () {
    if(!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
    }

    var json = fs.readFileSync(filePath, 'utf8');

    if(!json) {
        json = [];
    } else {
        json = JSON.parse(json);
    }

    return json;
};

/* GET home page. */
router.post('/enviar-notificacao', function(req, res, next) {
    var devicesIds = module.getJson();
    var dataSend = req.body;

    unirest.post('https://gcm-http.googleapis.com/gcm/send')
        .headers({
            'Content-Type': 'application/json',
            'Authorization': 'key=AIzaSyDF5WBa9vQumRl_Ndcas_X_XQHC1-cOnPU'
        })
        .send({
            "registration_ids": devicesIds,
            "data": dataSend
        })
        .end(function (response) {
            //res.send(200, null);
        })
        .error(function (err) {
            next(err);
        });

	res.send(200);
});

router.post('/registrar-dispositivo', function (req, res, next) {
    var id = req.body.id;

    if(!id) {
        res.send(406);
    } else {
        try {
            var json = module.getJson();

            json.push(id);

            fs.writeFileSync(filePath, JSON.stringify(json));

            res.send(200);
        } catch (err) {
            next(err);
        }
    }
});

module.exports = router;
