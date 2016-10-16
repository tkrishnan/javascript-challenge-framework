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
    if (code.body) {
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


function compareTrees(code, struc){
    //if we have multiple nodes in our current code tree level
    if (code.constructor == Array){
        //to compare trees level by level, make checkList of nodes we are currently
        //checking for in our structure requirements
        var checkList = {};
        var locations = {};
        for (var i=0; i<struc.length; i++){
            checkList[struc[i].type] = false;
            locations[struc[i].type] = 0;
        }
        for (var i=0; i<code.length; i++){
            if (code[i].type in checkList){
                checkList[code[i].type] = true;
                locations[code[i].type] = i;
            }
        }
        var allHere = true;
        //look to see if all nodes in struc reqs were at this code tree level
        for (var type in checkList){
            if (!checkList[type]){
                allHere = false;
            }
        }
        //if they were
        if (allHere) {
            //check if rest of levels are equal
            checkEqualNodes(code, struc, locations);
        //if they weren't
        } else {
            for (var i=0; i<code.length; i++){
                if (code[i].body){
                    compareTrees(code[i].body, struc);
                } else if (code[i].consequent){
                    compareTrees(code[i].consequent, struc);
                    if (code[i].alternate){
                        compareTrees(code[i].alternate, struc);
                    }
                }
            }
        }
    //if we have single node at our current code tree level
    } else {
        //if we also only have one node we're checking for in our structure reqs
        if (struc.length == 1){
            //if same type
            if (code.type == struc[0].type){
                checkEqualNodes(code, struc);
            //if not same type, move on    
            } else {
                if (code.body){
                    compareTrees(code.body, struc);    
                } else if (code.consequent) {
                    compareTrees(code.consequent, struc);
                    if (code.alternate) {
                        compareTrees(code.alternate, struc);
                    }
                }    
            }
        //if we have more than one node we're checking for, move on
        } else{
            if (code.body){
                compareTrees(code.body, struc);    
            } else if (code.consequent) {
                compareTrees(code.consequent, struc);
                if (code.alternate) {
                    compareTrees(code.alternate, struc);
                }
            }
        }
    }
}

function checkEqualNodes(code, struc, locs){
    var done = true;
    for (var i=0; i<struc.length; i++){
        if (struc[i].body.length != 0){
            done = false;
            if (locs){
                var j = locs[struc[i].type];
                if (code[j].body){
                    compareTrees(code[j].body, struc[i].body);
                } else if (code[j].consequent) {
                    compareTrees(code[j].consequent, struc[i].body);
                    if (code[j].alternate){
                        compareTrees(code[j].alternate, struc[i].body);
                    }
                }
            } else {
                if (code.body){
                    compareTrees(code.body, struc[i].body);
                } else if (code.consequent){
                    compareTrees(code.consequent, struc[i].body);
                    if (code.alternate){
                        compareTrees(code.alternate, struc[i].body);
                    }
                } 
            }
        }
    }
    if (done){
        strucBool = true;
        return;
    }
}


function main(js_code){
    reset();
    var answer = {};
    var parsed = esprima.parse(js_code, {tolerant: true}).body;
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
    compareTrees(parsed, structure);
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