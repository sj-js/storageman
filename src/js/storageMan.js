/****************************************************************************************************
 *  StorageMan
 *  Created By sujkim
 ****************************************************************************************************/

function StorageMan(){
}
StorageMan.prototype.get = function(key){
    var val = this.getString(key);
    if (val && (val.indexOf('[') == 0 || val.indexOf('{') == 0))
        return JSON.parse(val);
    return val;
};
StorageMan.prototype.getString = function(key){
    return localStorage.getItem(key);
};
StorageMan.prototype.getObj = function(key){
    var val = this.getString(key);
    return JSON.parse(val);
};
StorageMan.prototype.set = function(key, val){
    if (typeof val == 'string' || typeof val == 'number'){
        localStorage.setItem(key, val);
    }else{
        localStorage.setItem(key, JSON.stringify(val));
    }
};
StorageMan.prototype.remove = function(key){
    localStorage.removeItem(key);
};






StorageMan.prototype.removeSameObj = function(recentObjList, targetObj){
    var length = recentObjList.length;
    for (var i=0; i<length; i++){
        var j = length - (i + 1);
        var obj = recentObjList[j];
        var flag = true;
        for (var attr in obj){
            if (obj[attr] != targetObj[attr]) flag = false;
        }
        if (flag) recentObjList.splice(j, 1);
    }
};
StorageMan.prototype.addRecentData = function(key, obj, cnt, isAccum){
    var recentObjList = this.getObj(key);
    if (!recentObjList || !recentObjList.splice) recentObjList = [];
    if (!isAccum) this.removeSameObj(recentObjList, obj);
    recentObjList.splice(0, 0, obj);
    recentObjList.splice(cnt, 1);
    this.set(key, recentObjList);
};
StorageMan.prototype.getRecentData = function(key, cnt){
    var resultList = [];
    var recentObjList = this.getObj(key);
    if (recentObjList){
        resultList = recentObjList.splice(0, cnt);
        resultList = (cnt) ? resultList : recentObjList;
    }
    return resultList;
};





(function(){
    if (!JSON){
        // implement JSON.stringify serialization
        JSON.stringify = JSON.stringify || function (obj) {

            var t = typeof (obj);
            if (t != "object" || obj === null) {

                // simple data type
                if (t == "string") obj = '"'+obj+'"';
                return String(obj);

            }
            else {

                // recurse array or object
                var n, v, json = [], arr = (obj && obj.constructor == Array);

                for (n in obj) {
                    v = obj[n]; t = typeof(v);

                    if (t == "string") v = '"'+v+'"';
                    else if (t == "object" && v !== null) v = JSON.stringify(v);

                    json.push((arr ? "" : '"' + n + '":') + String(v));
                }

                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
        };

        // implement JSON.parse de-serialization
        JSON.parse = JSON.parse || function (str) {
            if (str === "") str = '""';
            eval("var p=" + str + ";");
            return p;
        };
    }
}());