var express = require('express');
var router = express.Router();
var path = require('path');
var convert = require('xml-js');
var edDb = require('../model/oracleDB');
var SQL_CONSTANTS = require('../resources/sql.json');
var testInputConstants = require('../resources/testInput.json');
var rowCount = 0;
var connection = null;

function processXml(xml, res) {  

    console.log(xml);
    var options = { compact: true, ignoreComment: true, spaces: 4 };
    let json = convert.xml2js(xml, options);    // to convert xml text to javascript object
    console.log(json);
    var element = {
        "_text": "this is line 3"
    };

    json.note.lines.line.push(element);

    var xml2 = convert.json2xml(json, options);
    res.send(xml2);


}


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../views/samplePost.html'));

});

router.post('/sampleHW', (req, res) => {

    xmlPost = '';
    req.setEncoding('utf8');

    req.on('data', function (chunk) {
        xmlPost += chunk;
    });

    req.on('end', function () {
        processXml(xmlPost, res);
    });

});

// Ed's changes for this URL

router.post('/hw1', (req, res) => {

    xmlPost = '';
    req.setEncoding('utf8');
    //console.log('body-', req);
    req.on('data', function (chunk) {
        // console.log('chunk-' +chunk);
        xmlPost += chunk;
        //console.log('xmlpost var-'+ xmlPost);
    });

    req.on('end', function () {
        console.log('xmlToTranspose-' + xmlPost);
        var options = { compact: true, ignoreComment: true, spaces: 4 };
        processXmlEd(xmlPost, res, function(pricebookJSON){
            var xml2 = convert.json2xml(pricebookJSON, options);
            res.send(xml2);
        });
         
        //console.log('xmlpost-'+ xmlPost);
    });

});

function processXmlEd(xml, res, callback) {
    //console.log('incoming xml'+ xml);
    var options = { compact: true, ignoreComment: true, spaces: 4 };
    let json = convert.xml2js(xml, options);    // to convert xml text to javascript object
    const jsonAddElement = addPriceTableElement('13A543XY', '1499.99', '20');
    console.log('returned method val-' + JSON.stringify(jsonAddElement));
    json.pricebooks.pricebook['price-tables']['price-table'].push(jsonAddElement);
    console.log('returned json val-' + JSON.stringify(json.pricebooks.pricebook['price-tables']['price-table']));
    let sqlResults = edDb.getPricingFromDbTake2(testInputConstants.itemNumber,testInputConstants.catalogId).then(function(results){
        console.log('results-', results);
        let newJsonElement = addPriceTableElement(results["MFPARTNUMBER"], results["PRICE"],'34');
        console.log('newjsonelement-', newJsonElement);
        json.pricebooks.pricebook['price-tables']['price-table'].push(newJsonElement);
        console.log('returned json2 val-' + JSON.stringify(json.pricebooks.pricebook['price-tables']['price-table']));
        callback(json);
    })
    .catch((error) => {
        console.error('Something bad happened:', error.toString());
      });
    
}


function addPriceTableElement(productId, price, amount) {
    console.log(productId + '-' + price + '-' + amount);
    var pricebookJSON =
    {
        "_attributes": {
            "product-id": productId
        },
        "amount": {
            "_attributes": {
                "quantity": amount
            },
            "_text": price
        }
    };
    return pricebookJSON;

}

module.exports = router;