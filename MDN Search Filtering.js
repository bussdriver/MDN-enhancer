// ==UserScript==
// @name        MDN Search Filtering
// @namespace   Violentmonkey Scripts
// @match       https://developer.mozilla.org/*
// @grant       none
// @version     1.2
// @author      John Bussjaeger
// @description 7/17/2020, 7:24:01 PM
// @homepageURL https://github.com/bussdriver/MDN-enhancer
// @downloadURL https://raw.githubusercontent.com/bussdriver/MDN-enhancer/master/MDN%20Search%20Filtering.js
// ==/UserScript==

var filters=    ["all","api","addons","css","canvas","firefox","firefox-os","games","html","http","js","marketplace","mathml","mobile","apps","svg","webdev","standards","webext","webgl","docs","xpcom","xul"];
var localized=  {//map to filters + url + url_title
    'en':["All"//special case
     ,"APIs and DOM","Add-ons & Extensions","CSS","Canvas","Firefox","Firefox OS","Games","HTML","HTTP","JavaScript","Marketplace","MathML","Mobile","Open Web Apps","SVG","Web Development","Web Standards","WebExtensions","WebGL","Writing Documentation","XPCOM","XUL"
    ,"Search Topics","http://kb.mozillazine.org/Using_keyword_searches","Keyword Searching"]
};
localized=      localized[ navigator.language ] || localized[ navigator.language.split('-')[0] ] || localized.en;

//existing document elements:
var form=       document.getElementById('nav-main-search');
var input=      document.getElementById('main-q');

//CSS
var style=      getComputedStyle(form);
document.styleSheets[0].insertRule('.search-results-filters {position: absolute;left:calc( '+ ( style.borderBottomLeftRadius ? style.borderBottomLeftRadius : style.paddingLeft +' + '+ style.borderLeftWidth +' + '+ style.borderLeftWidth )  +' );top: calc( '+ style.height +' - '+ style.borderBottomWidth +' );border:inherit;border-bottom-left-radius: inherit;border-bottom-right-radius: inherit;background-color: #fff;padding: 8px;z-index:9;}',0);
document.styleSheets[0].insertRule('.search-results-filters label {display:block;padding-bottom:10px;}',0);
document.styleSheets[0].insertRule('.page-header {z-index:1;}',0);

var fset=       document.createElement('fieldset');
fset.className= "search-results-filters";
fset.style.display= "none";
var legend=     document.createElement('b');
legend.appendChild(document.createTextNode( localized[localized.length-3] ));// "search topics"
fset.appendChild(legend);

var checklist=  [];
var all;
for(var item,check,x,i=0;i<filters.length;++i){
    x=          filters[i];
    item=       document.createElement('label');
    check=      document.createElement('input');
    check.type= "checkbox";
    check.name= "topic";
    check.value=    x;
    if( (location+'').indexOf('topic='+x) >=0 ){
        check.checked=  true;
    }
    check.addEventListener('click',function(e){
        e.target.focus();//click should focus so submit can work
    },false);
    if(x==='all'){//"all" special case
        all=    check;
        check.name='';
        if(  (location+'').indexOf('topic=') === -1 ){
             check.checked=  true;
        }
        check.addEventListener('change',function(e){
            if( e.target.checked ){
                for(var i=checklist.length;--i>=0;){
                    checklist[i].checked=false;
                }
            }
        },false);
    }else{
        checklist.push(check);
        check.addEventListener('change',function(e){
            if( e.target.checked ){
                all.checked=    false;
            }
        },false);
    }
    item.appendChild(check);
    item.appendChild(document.createTextNode(" "+ localized[i]));
    fset.appendChild(item);
}

item = document.createElement('hr');
fset.appendChild(item);

item = document.createElement('a');
item.innerText=     localized[localized.length-1];// "keyword searching"
item.href=          localized[localized.length-2];// url help on keyword searching
fset.appendChild(item);

form.appendChild(fset);
form.addEventListener('mouseover',function(){fset.style.display="block"},false);
form.addEventListener('mouseout',function(){fset.style.display="none"},false);

input.setAttribute('autocomplete','off');
input.addEventListener('focus',function(){fset.style.display="block"},false);
