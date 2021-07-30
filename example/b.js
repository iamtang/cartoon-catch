var maxwidth = 750;
var maxheight = 1800;
var orginalwidth = 0;
var orginalheight = 0;
var acivestyle = "1px solid #6699ff"

document.oncontextmenu = function() {
    return false;
}
;
function bbimg(o) {
    var zoom = parseInt(o.style.zoom, 10) || 100;
    zoom += event.wheelDelta / 12;
    if (zoom > 0)
        o.style.zoom = zoom + '%';
    return false;
}

function zoomb(o) {
    var zoom = parseInt(document.getElementById("TheImg").style.zoom, 10) || 100;
    zoom += 20;
    if (zoom > 0 && zoom <= 400) {
        if (document.all)
            document.getElementById("TheImg").style.zoom = zoom + '%';
        else {
            document.getElementById("TheImg").style.zoom = 2
        }
    }

}
function zoombb(o) {
    var zoom = parseInt(document.getElementById("TheImg").style.zoom, 10) || 100;
    if (zoom > 0 && zoom <= 400)
        zoom += 20;
    zoomb(o)
    writecookie(zoom);
    SetActive(o);
}

function zooms(o) {
    var zoom = parseInt(document.getElementById("TheImg").style.zoom, 10) || 100;
    zoom -= 20;
    if (zoom >= 20)
        document.getElementById("TheImg").style.zoom = zoom + '%';
}
function zoomss(o) {
    var zoom = parseInt(document.getElementById("TheImg").style.zoom, 10) || 100;
    if (zoom >= 20)
        zoom -= 20;
    zooms(o)
    writecookie(zoom);
    SetActive(o);
}

function zoomf(o) {

    //alert(screen.width+" "+document.body.scrollWidth+" "+maxwidth)
    //var zoom=100;
    //if(document.body.scrollWidth>screen.width) {maxwidth=screen.width-50; }
    //Else {maxwidth=document.body.scrollWidth-50;}
    //if(document.getElementById("TheImg").width>document.getElementById("TheImg").height*maxwidth/maxheight) zoom=maxwidth/document.getElementById("TheImg").width;
    //Else zoom=maxheight/document.getElementById("TheImg").height;
    //if(zoom>4) z=1;
    //document.getElementById("TheImg").style.zoom=zoom*100+'%';
    //if(document.getElementById("TheTable").style.width>screen.width*0.9)

    //document.getElementById("TheTable").style.width=screen.width*0.95;
    document.getElementById("TheImg").style.width = screen.width * 0.89;

}
function zoomff(o) {
    var zoom = 0;
    writecookie(zoom);
    zoomf(o)
    SetActive(o);
}

function zooma(o) {
    //document.getElementById("TheImg").style.zoom='100%';
    //document.getElementById("TheTable").style.width='';
    document.getElementById("TheImg").style.width = '';
}

function zoomaa(o) {
    var zoom = 100;
    writecookie(zoom);
    zooma(o)
    SetActive(o);
}

function SetActive(o) {
    //document.getElementById("zb").style.border="";
    //document.getElementById("zs").style.border="";
    document.getElementById("za").style.border = "";
    document.getElementById("zf").style.border = "";

    o.style.border = acivestyle;

}

function shakeimg(o) {
}

function resetmaxsize() {
    if (document.body.scrollWidth > screen.width) {
        maxwidth = screen.width - 50;
    } else {
        maxwidth = document.body.scrollWidth - 50;
    }
}
//window.onresize=resetmaxsize;
//window.onload=resetmaxsize;

var scrollcount = 0;
var dragy;
var dragx;

function initdrag() {
    scrollcount = 1;
    dragy = event.clientY;
    dragx = event.clientX;
    //document.body.setCapture();
    //document.body.style.cursor='move';
    //window.status='x:'+dragx+' y:'+dragy;
}

function startdrag() {
    if (scrollcount == 1) {
        window.scrollBy((dragx - event.clientX) * 2, (dragy - event.clientY) * 2);
        dragy = event.clientY;
        dragx = event.clientX;
    }
}

function enddrag() {
    //document.body.style.cursor='';
    scrollcount = 0;
    //document.body.releaseCapture();
}

var hm = 0;
document.onkeydown = onkeydown;
function onkeydown() {

    switch (window.event.keyCode) {

        //			case 93 : window.external.addFavorite("www.twocomic.com","www.twocomic.com");
        //			case 27 : window.close(); break;
        //			case 17 : jumpnext(); break;   //Ctrl
        //			case 37 : jumpnext(); break;
    case 32:
        if (hm == 0) {
            window.scrollBy(1000, 0);
            hm = 1;
            return false;
        } else {
            window.scrollBy(-1000, 0);
            hm = 0;
            return false;
        }
        break;
        //			case 38 : document.location.href=document.getElementById("prev").href; break;
        //			case 16 : jumpprev(); break;   //Shift
        //			case 18 : jumpnext(); break;   //Alt

        //			case 39 : jumpprev(); break;
    case 90:
        zoomff(o);
        break;
    case 122:
        zoomff(o);
        break;
    case 65:
        zoomaa(o);
        break;
    case 97:
        zoomaa(o);
        break;
        //			case 40 : document.location.href=document.getElementById("next").href; break;

        //		window.event.keyCode = 0;
        //		window.event.returnValue= false;
    }
}

function writecookie(zoom) {
    setCookie("zoom", zoom, 30)
}

function readcookie() {
    if (getCookie_1DIM("zoom"))
        initzoom = getCookie_1DIM("zoom")
    else
        initzoom = "100";
    return initzoom;
}

function getCookie_1DIM(Name) {
    var search = Name + "="
    if (document.cookie.length > 0) {
        offset = document.cookie.indexOf(search)
        if (offset != -1) {
            offset += search.length

            end = document.cookie.indexOf(";", offset)

            if (end == -1)
                end = document.cookie.length
            return unescape(document.cookie.substring(offset, end))
        }
    }
}

function setCookie(name, value, expiredays) {
    var expire_date = new Date();
    expire_date.setDate(expire_date.getDate() + expiredays);
    document.cookie = name + "=" + escape(value) + "; expires=" + expire_date.toGMTString() + "; path=/";
}

function initzoom() {
    var initzoom = "100";
    initzoom = readcookie();
    //if(initzoom>400) initzoom=400;
    if (initzoom != "0" && initzoom != 0 && document.getElementById("TheImg")) {
        document.getElementById("TheImg").style.zoom = initzoom + '%';
        //if(initzoom>100) document.getElementById("zb").style.border=acivestyle;
        //if(initzoom<100) document.getElementById("zs").style.border=acivestyle; 
        if (initzoom == 100)
            document.getElementById("za").style.border = acivestyle;

    } else {
        zoomf();
        document.getElementById("zf").style.border = acivestyle;
    }

}

function replaceurl(keyname, keyvalue) {
    var u = document.location.href;
    if (u.indexOf('#') == u.length - 1)
        u = u.substring(0, u.length -
        1);
    if (u.indexOf('?') > 0) {
        return u.substring(0, u.indexOf('?')) + '?' + keyname + '=' + keyvalue + ('&' + u.substring(u.indexOf
        ('?') + 1)).replace(eval('/&' + keyname + '=[^&]*/gi'), '');
    } else
        return u + '?' + keyname + '=' + keyvalue;
}

function request(queryStringName) {
    var returnValue = "";
    var URLString = new String(document.location);
    var serachLocation = -1;
    var queryStringLength = queryStringName.length;
    do {
        serachLocation = URLString.indexOf(queryStringName + "\=");
        if (serachLocation != -1) {
            if ((URLString.charAt(serachLocation - 1) == '?') || (URLString.charAt(serachLocation - 1) == '&')) {
                URLString = URLString.substr(serachLocation);
                break;
            }
            URLString = URLString.substr(serachLocation + queryStringLength + 1);
        }
    } while (serachLocation != -1)if (serachLocation != -1) {
        var seperatorLocation = URLString.indexOf("&");
        if (seperatorLocation == -1) {
            returnValue = URLString.substr(queryStringLength + 1);
        } else {
            returnValue = URLString.substring(queryStringLength + 1, seperatorLocation);
        }
    }
    return returnValue;
}

function initpage(totalstr, indexstr, elename) {
    var ele = document.getElementById(elename);
    if (ele == null)
        return false;
    var total = parseInt(totalstr);
    var iedx = parseInt(indexstr);

    //	o = document.createElement("OPTION");
    //	o.text='Cover';
    //	o.value=0;
    //	if(document.all) ele.add(o);else ele.add(o,null);

    for (var i = 1; i <= total; i++) {
        o = document.createElement("OPTION");
        o.text = 'Page: ' + i + '';
        o.value = i;
        if (document.all)
            ele.add(o);
        else
            ele.add(o, null);

    }
    ele.selectedIndex = iedx - 1;

}

function initnav(totalstr, indexstr, elename) {
    var ele = document.getElementById(elename);
    if (ele == null)
        return false;
    var total = parseInt(totalstr);
    var iedx = parseInt(indexstr);
    var addnum = 5;
    var percent = parseInt(iedx * 100 / total);
    var leftpercent = 100 - percent;
    var cell = (parseInt(1000 / total)) / 10;
    var text = 'Page: ' + iedx + '/' + total + '';
    var str = "<table  cellPadding=1 cellSpacing=1 bgcolor=#cccccc width=220 height=10 id='tnav'  style='position:absolute;left:100px' ><tr><td bgcolor=#ffffff >"
    str += "<table cellSpacing=0 cellSpacing=0 width=100% height=12><tr>"
    str += "<td style='cursor:hand' onclick='jump(basep,1)' bgcolor=#cccccc   width=1%><font style='font-family:webdings;font:8px;line-height:8px' >7</font></td>";
    str += "<td style='cursor:hand' bgcolor=#d8e8ff width=" + percent + "% ></td>"
    str += "<td style='cursor:hand' bgcolor=#ffffff width=" + leftpercent + "% ></td>"
    str += "<td style='cursor:hand' onclick='jump(basep," + total + ")' bgcolor=#cccccc width=1%><font  style='font-family:webdings;font:8px;line-height:8px' >8</font></td>";
    str += "</tr></table>";
    str += "</td></tr></table>";

    ele.innerHTML = str;

}
function j(n) {
    document.location.href = reurl("ch", ch + "-" + n);
}
function initpage(totalstr, indexstr, elename) {
    var ele = document.getElementById(elename);
    var total = parseInt(totalstr);
    var iedx = parseInt(indexstr);
    for (var i = 1; i <= total; i++) {
        o = document.createElement("OPTION");
        o.text = 'Page: ' + i + '';
        o.value = i;
        if (document.all)
            ele.add(o);
        else
            ele.add(o, null);
    }
    ele.selectedIndex = iedx - 1;
}
var ch = request('ch');
function reurl(keyname, keyvalue) {
    var u = document.location.href;
    if (u.indexOf('#') == u.length - 1)
        u = u.substring(0, u.length - 1);
    if (u.indexOf('?') > 0) {
        return u.substring(0, u.indexOf('?')) + '?' + keyname + '=' + keyvalue + ('&' + u.substring(u.indexOf('?') + 1)).replace(eval('/&' + keyname + '=[^&]*/gi'), '');
    } else
        return u + '?' + keyname + '=' + keyvalue;
}

function jump(n) {
    document.location.href = reurl("ch", ch + "-" + n);
}
console.log(p)
var p = 1;
var f = 50;
if (ch.indexOf('-') > 0) {
    p = parseInt(ch.split('-')[1]);
    ch = ch.split('-')[0];
}
if (ch == '')
    ch = 1;
else
    ch = parseInt(ch);
var pi = '';
var ni = '';
var c = '';
var ci = 0;
var ps = '';
function ge(e) {
    return document.getElementById(e);
}
function ss(a, b, c, d) {
    console.log(a, b, c, d, '====e====');
    var e = a.substring(b, b + c);
    return d == null ? e.replace(/[a-z]*/gi, "") : e;
}
function si(c) {
    ge('TheImg').src = 'https://img' + ss(c, 4, 2) + '.8comic.com/' + ss(c, 6, 1) + '/' + ti + '/' + ss(c, 0, 4) + '/' + nn(p) + '_' + ss(c, mm(p) + 10, 3, f) + '.jpg';
    console.log('https://img' + ss(c, 4, 2) + '.8comic.com/' + ss(c, 6, 1) + '/' + ti + '/' + ss(c, 0, 4) + '/' + nn(p) + '_' + ss(c, mm(p) + 10, 3, f) + '.jpg')
}
function nn(n) {
    return n < 10 ? '00' + n : n < 100 ? '0' + n : n;
}
function mm(p) {
    console.log(p, (parseInt((p - 1) / 10) % 10) + (((p - 1) % 10) * 3), '=====p======');
    return (parseInt((p - 1) / 10) % 10) + (((p - 1) % 10) * 3)
}
;function sp() {
    var cc = cs.length;
    for (var i = 0; i < cc / f; i++) {
        if (ss(cs, i * f, 4) == ch) {
            c = ss(cs, i * f, f, f);
            ci = i;
            break;
        }
    }
    if (c == '') {
        c = ss(cs, cc - f, f);
        ch = chs;
    }
    si(c);
    pi = ci > 0 ? ss(cs, ci * f - f, 4) : ch;
    var pt = '[ ' + pi + ' ]';
    ni = ci < cc - 1 ? ss(cs, ci * f + f, 4) : ch;
    var nt = '[ ' + ni + ' ]';
	ps = ss(c, 7, 3);
	console.log(ps, p, '------------')
    initpage(ps, p, "pageindex");
    initpage(ps, p, "pageindex2");
    ge("lastchapter").innerHTML = ch;
    if (p > ps) {
        ge('next').style.display = 'none;';
        ge('next2').style.display = 'none;';
    }
    if (p <= 1) {
        ge('prev').style.display = 'none;';
        ge('prev2').style.display = 'none;';
    }
    if (ch >= chs)
        ge('nextvol').style.display = "none";
    ge('nextname').innerHTML = nt;
    ge('prevname').innerHTML = pt;
    ge('pagenum').innerHTML = '\u7b2c' + p + '/' + ps + '\u9801';
}
function jn() {
    if (p < ps)
        jump(p + 1);
    else
        alert('\u5df2\u7d93\u662f\u6700\u5f8c\u4e00\u9801\u4e86');
}
function jp() {
    if (p > 1)
        jump(p - 1);
}
function nv() {
    if (ch < chs)
        jv(ni);
}
function pv() {
    if (ch > 1)
        jv(pi);
}
function lv() {
    jv(chs);
}
function jump(n) {
    document.location.href = replaceurl("ch", ch + "-" + n);
}
function jv(n) {
    document.location.href = replaceurl("ch", n);
}
//initpage(ps,p,"pageindex");
