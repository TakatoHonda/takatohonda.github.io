function Move(url,isnewtab){
    if(isnewtab){
        window.open(url);
    }
    else{
        location.href = url;
    }
}

window.addEventListener('beforeunload', function(e){
    let ms = "更新しますか?(データが消えます)";
    e.returnValue = ms;
    return ms;
});

window.onload = function(){
    date_set();
    time_set();
    ID_set(9);
    var id_obj = document.getElementById("id");
    addopt("風吹けば名無し",id_obj.value);
}
function set(){
    var name = document.getElementById("nm");
    var id = document.getElementById("id");
    var select = document.getElementById("sel");
    var ind = select.value.indexOf("|");
    var NAME = select.value.substring(0,ind);
    var ID = select.value.substring(ind + 1,select.value.length);
    name.value = NAME;
    id.value = ID;
}
function save(){
    var name = document.getElementById("nm");
    var id = document.getElementById("id");
    addopt(name.value,id.value);
}

function date_set(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if(month < 10){
        month = "0" + month;
    }
    if(day < 10){
        day = "0" + day;
    }
    var date_obj = document.getElementById("dt");
    date_obj.value = year + "-" + month + "-" + day;
}
function time_set(){
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if(second < 10){
        second = "0" + second;
    }
    if(minute < 10){
        minute = "0" + minute;
    }
    if(hour < 10){
        hour = "0" + hour;
    }
    var time_obj = document.getElementById("tm");
    time_obj.value = hour + ":" + minute + ":" + second;
}
function ID_set(length){
    var id_obj = document.getElementById("id");
    var name_obj = document.getElementById("nm");
    var strings = new Array();
    strings = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9"];
    var ranstr = "";
    for(let i = 0;i < length;i++){
        var ran = Math.floor(Math.random() * 62);
        ranstr = ranstr + strings[ran];
    }
    id_obj.value = ranstr;
}
function paste_link(){
    var url = prompt("URLを入力してください");
    if(url == ""){
        return;
    }
    else{
        url = "|!" + url + "!|"
        var con = document.getElementById("cn");
        con.value = con.value + "\n" + url;
    }
}
function anka(){
    var num = prompt("安価を入力してください(1~999)");
    if(parseInt(num) <= 999 & parseInt(num) >= 1){
        num = "|^" + num + "^|";
        var con = document.getElementById("cn");
        con.value = con.value + "\n" + num;
    }
    else{
        alert("それは使えない番号です");
        return;
    }
}

var all = "";
var content = '<html><head><meta charset="UTF-8"><title>2ch_Thread</title></head><style>@page{margin:0;size:landscape;font-family: "MS PGothic";}body{background-color:#EFEFEF;font-size:17px;}.name{color:blue;text-decoration:underline blue;font-weight:bold;}.milisec{color:slategray;font-size:14px;}.threadtitle{font-size:21px;font-weight:bold;color:red;}.go{color:blue;text-decoration:underline blue;}.con{padding-left:40px;}.log{font-size:18px;color:red;}.res{color:blue;font-size:18px;}</style><body>';
var contentend = "</body></html>";
var con = "";

function kakiko(){
    var name_obj = document.getElementById("nm");
    var id_obj = document.getElementById("id");
    var dt_obj = document.getElementById("dt");
    var tm_obj = document.getElementById("tm");
    var cn_obj = document.getElementById("cn");
    var th_obj = document.getElementById("thnum");
    if(name_obj.value == "" || id_obj.value == "" || dt_obj.value == "" || tm_obj.value == "" || cn_obj.value == ""){
        alert("空欄があります");
        return;
    }
    var name = document.getElementById("nm").value;
    var cn = document.getElementById("cn").value;
    var id = document.getElementById("id").value;
    var dt = document.getElementById("dt").value;
    var tm = document.getElementById("tm").value;
    var th = document.getElementById("thnum").value;
    name = name.replace(/</g,"A");
    name = name.replace(/>/g,"B");
    cn = cn.replace(/</g,"&lt;");
    cn = cn.replace(/>/g,"&gt;");
    cn = cn.replace(/\n/g,"<br>");
    while(cn.indexOf("|!") != -1 & cn.indexOf("!|") != -1){
        var cnA = cn.indexOf("|!");
        var cnB = cn.indexOf("!|");
        var link = cn.substring(cnA + 2,cnB);
        cn = cn.substring(0,cnA) + '<a href="' + link + '">' + link + "</a>" + cn.substring(cnB + 2,cn.length);
    }
    while(cn.indexOf("|^") != -1 & cn.indexOf("^|") != -1){
        var inA = cn.indexOf("|^");
        var inB = cn.indexOf("^|");
        var num = cn.substring(inA + 2,inB);
        cn = cn.substring(0,inA) + '<span class="go">&gt;&gt;' + num + '</span>' + cn.substring(inB + 2,cn.length);
    }
    var year = dt.substring(0,4);
    var month = dt.substring(5,7);
    var day = dt.substring(8,10);
    var hour = tm.substring(0,2);
    var minute = tm.substring(3,5);
    var second = tm.substring(6,8);
    var dayOfWeekStrJP = [ "日", "月", "火", "水", "木", "金", "土" ];
    var d = new Date(year,month-1,day);
    var youbi = "(" + dayOfWeekStrJP[d.getDay()] + ")";
    var milisec = Math.floor(Math.random() * 99);
    if(milisec < 10){
        milisec = "0" + milisec;
    }
    milisec = "." + milisec;
    var dates = year + "/" + month + "/" + day + youbi;
    var times = hour + ":" + minute + ":" + second + '<span class="milisec">' +　milisec + '</span>';
    con = con + '<p style="display: inline;"><br>' + th + ' ：<span class="name">' + name + '</span>：' + dates + " " + times + " ID:" + id + '<div class="con">' + cn + '</div></p>';
    th_obj.innerText = parseInt(th) + 1;
    cn_obj.value = "";
   // date_set();
   // time_set();

    var lg_obj = document.getElementById("log");
    var num_obj = document.getElementById("thnum");
    var font_obj = document.getElementById("font");
    var iframe_obj = document.getElementById("if");
    var c = "";
    var f = "";
    if(lg_obj.checked){
        var c = '<p class="res">総レス数  <b>' + (parseInt(num_obj.innerText) - 1).toString() + '</b></p><h2 class="log">■このスレッドは過去ログ倉庫に格納されています</h2>';
    }
    if(font_obj.checked){
        var f = '<style>font-family: "MS PGothic",</style>';
    }
    var kinkyu = content + con + c + f + contentend;
    var blob = new Blob([kinkyu],{type:"text/html"});
    var url = window.URL.createObjectURL(blob);
    iframe_obj.src = url;
}
function end(){
    var thti = prompt("Input thread title.")
    if(thti != "" || !thti.includes("<") || !thti.includes(">")){
        var file_name = "2Channel_" + thti + ".html";
        thti = '<span class="threadtitle">' + thti + '</span><br>';
        var lg_obj = document.getElementById("log");
        var num_obj = document.getElementById("thnum");
        var font_obj = document.getElementById("font");
        var echo_obj = document.getElementById("echo");
        if(lg_obj.checked){
            con = con + '<p class="res">総レス数  <b>' + (parseInt(num_obj.innerText) - 1).toString() + '</b></p><h2 class="log">■このスレッドは過去ログ倉庫に格納されています</h2>';
        }
        if(font_obj.checked){
            con = con + '<style>font-family: "MS PGothic"</style>';
        }
        all = content + thti + con + contentend;
        var blob = new Blob([all],{type:"text/html"});
        var url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        link.download = file_name;
        link.click();
        echo_obj.disabled = true;
        echo_obj.value = "Reload page";
        window.open(url);
    }
    else{
        alert("空欄か＜、＞があります");
        return;
    }
}
function addopt(name,id){
    var select = document.getElementById("sel");
    var option = document.createElement("option");
    option.text = name + ":" + id;
    option.value = name + "|" + id;
    select.appendChild(option);
}