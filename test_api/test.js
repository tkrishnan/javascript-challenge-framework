var esprima = require('esprima');
var whiteList = require('./whiteList.json');
var blackList = require('./blackList.json');
var structure = require('./structure.json');
var whiteDict;
var blackAns;
var strucBool;

function reset(){
    whiteDict = {};
    blackAns = [];
    strucBool = false;
}

function checkWhiteList(type){
    if (whiteList.indexOf(type) != -1){
        whiteDict[type] = true;
    }
}

function checkBlackList(type){
    if (blackList.indexOf(type) != -1){
        blackAns.push("Code MUST NOT include a "+type);
    }
}

function searchCodeTree(code){
    checkWhiteList(code.type);
    checkBlackList(code.type);
    if (code.body || code.consequent) {
        if (code.type == 'BlockStatement'){
            for (var i=0; i<code.body.length; i++){
                searchCodeTree(code.body[i]);
            }
        } else {
            searchCodeTree(code.body);
        }
    } else if (code.consequent) {
        searchCodeTree(code.consequent);
        if (code.alternate){
            searchCodeTree(code.alternate);
        }
    }
}

function compareTreeNodes(code, struc){
    if (code.constructor == Array){
        for (var i=0; i<code.length; i++){
            compareTreeNodes(code[i], struc);    
        }
    } else {
        if (code.type == struc.type) {
            checkEqualNodes(code, struc);
        } else {
            if (code.body){
                compareTreeNodes(code.body, struc);
            } else if (code.consequent){
                compareTreeNodes(code.consequent, struc);
                if (code.alternate){
                    compareTreeNodes(code.alternate, struc);
                }
            }
        }
    }
}

function checkEqualNodes(code, struc, bool){
    if (code.type == struc.type) {
        if (struc.body.length != 0) {
            if (code.body) {
                compareTreeNodes(code.body, struc.body[0]);
            } else if (code.consequent){
                compareTreeNodes(code.consequent, struc.body[0]);
                if (code.alternate){
                    compareTreeNodes(code.alternate, struc.body[0]);
                }
            }
        } else {
            strucBool = true;
        }
    }
}

function main(js_code){
    reset();
    var answer = {};
    var parsed = esprima.parse(js_code, {tolerant: true}).body;
    console.log("I made it here");
    for (var i=0; i<whiteList.length; i++){
        whiteDict[whiteList[i]] = false;
    }
    for (var i=0; i<parsed.length; i++){
        searchCodeTree(parsed[i], whiteDict, blackAns);
    }
    var whiteAns = [];
    for (var type in whiteDict){
        if (whiteDict.hasOwnProperty(type)){
            if (!whiteDict[type]){
                whiteAns.push("Code MUST include a "+type);
            }
        }
    }
    compareTreeNodes(parsed, structure[0]);
    var strucAns;
    if (!strucBool){
        strucAns = "Code does not include required structure";
    }
    answer['whiteList'] = whiteAns;
    answer['blackList'] = blackAns;
    answer['structure'] = strucAns;
    return answer;
}

module.exports = main;