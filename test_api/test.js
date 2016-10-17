var esprima = require('esprima');
var whiteList = require('./whiteList.json');
var blackList = require('./blackList.json');
var structure = require('./structure.json');

var whiteDict;
var blackAns;
var strucBool;


function reset(){
    blackAns = [];
    strucBool = false;
    whiteDict = {};
    for (var i=0; i<whiteList.length; i++){
        whiteDict[whiteList[i]] = false;
    }
}

function moveDownTree(node, func, args){
    if (node.body){
        func(node.body, args);
    } else if (node.consequent){
        func(node.consequent, args);
        if (node.alternate){
            func(node.alternate, args);
        }
    }
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
    if (code.constructor == Array){
        for (var i=0; i<code.length; i++){
            searchCodeTree(code[i]);
        }
    } else {
        checkWhiteList(code.type);
        checkBlackList(code.type);
        moveDownTree(code, searchCodeTree);
    }
}

function compareTrees(code, struc){
    //if we have multiple nodes in our current code tree level
    if (code.constructor == Array){
        compareNodeLevels(code, struc);
    //if we have a single node in our current code tree level
    } else {
        compareSingleNodes(code, struc);
    }
}

function compareSingleNodes(code, struc){
    //if we also only have one node we're checking for in our structure reqs
    if (struc.length == 1){
        //if same type
        if (code.type == struc[0].type){
            checkEqualSingleNodes(code, struc);
        //if not same type, move on    
        } else {
            moveDownTree(code, compareTrees, struc);
        }
    //if we have more than one node we're checking for, move on
    } else{
        moveDownTree(code, compareTrees, struc);
    }    
}

function compareNodeLevels(code, struc){
    //make checkList of nodes we are currently checking for in our structure reqs
    var checkList = {};
    var locations = {};
    for (var i=0; i<struc.length; i++){
        checkList[struc[i].type] = false;
        locations[struc[i].type] = 0;
    }
    //for each node in this current level, check if it's in checklist
    for (var i=0; i<code.length; i++){
        if (code[i].type in checkList){
            checkList[code[i].type] = true;
            locations[code[i].type] = i;
        }
    }
    //look to see if all nodes in struc reqs were at this code tree level
    var allHere = true;
    for (var type in checkList){
        if (!checkList[type]){
            allHere = false;
            break;
        }
    }
    //if they were, check if levels below these are equal
    if (allHere) {
        checkEqualNodeLevels(code, struc, locations);
    //if they weren't, move onto levels in code tree below current level
    } else {
        for (var i=0; i<code.length; i++){
            moveDownTree(code[i]. compareTrees, struc);
        }
    }    
}

function checkEqualSingleNodes(code, struc){
    if (struc[0].body.length != 0){
        moveDownTree(code, compareTrees, struc[0].body);
    } else {
        strucBool = true;
        return;
    }
}

function checkEqualNodeLevels(code, struc, locs){
    var done = true;
    for (var i=0; i<struc.length; i++){
        if (struc[i].body.length != 0){
            done = false;
            if (locs){
                var j = locs[struc[i].type];
                moveDownTree(code[j], compareTrees, struc[i].body);
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
    searchCodeTree(parsed);
    var whiteAns = [];
    for (var type in whiteDict){
        if (!whiteDict[type]){
            whiteAns.push("Code MUST include a "+type);
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