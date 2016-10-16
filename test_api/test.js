var esprima = require('esprima');
var whiteList = require('./whiteList.json');
var blackList = require('./blackList.json');
var structure = require('./structure.json');
var whiteDict;
var whiteAns;
var blackAns;

function reset(){
    whiteDict = {};
    whiteAns = [];
    blackAns = [];
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
        } else if (code.type == 'IfStatement'){
            searchCodeTree(code.consequent);
            if (code.alternate) {
                searchCodeTree(code.alternate);
            }
        } else {
            searchCodeTree(code.body);
        }
    }
}

/*function compareCodeTrees(code, struc, bool){

}*/

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
    for (var type in whiteDict){
        if (whiteDict.hasOwnProperty(type)){
            if (!whiteDict[type]){
                whiteAns.push("Code MUST include a "+type);
            }
        }
    }
    answer['whiteList'] = whiteAns;
    answer['blackList'] = blackAns;
    answer['structure'] = "Code does not include required structure";
    return answer;
}

module.exports = main;