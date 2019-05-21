// ==UserScript==
// @name         Infominder Custom Script
// @namespace    http://www.infominder.com
// @version      0.1
// @description  Takes the user to edit options for a minder after adding a new minder
// @match        http://app.infominder.com/webminder/minderListView.do*
// @match        http://app.infominder.com/webminder/index.do*
// @match        http://app.infominder.com/webminder/WebMinderNew.jsp*
// @match        http://app.infominder.com/webminder/WebMinderNewProcess.jsp
// @match        http://infominder.com/webminder/minderListView.do*
// @match        http://app.infominder.com/webminder/minderCategoryView.do*
// @match        http://infominder.com/webminder/WebMinderNew.jsp*
// @match        http://infominder.com/webminder/WebMinderNewProcess.jsp*
// @match        http://infominder.com/webminder/WebMinderEditProcess.jsp*



// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

// 1. Create new minder
// 2. try - groupByCategory(true) catch ungroup(true) - on pages = minderListView,index
// 3. expandCategory('(None)', 'yes','cid0'); on page - minderCategoryView
// 4. Get last edit value - on page - minderCategoryView and window.location has cid0 in it
// 5- Go to edit page URL
//
//
//
//
//

(function() {
    'use strict';

    console.log("Infominder User Script!");
    if(window.location.href.indexOf("WebMinderNew.jsp")>=0)
    {
        set_onclick();
        return;
    }
    else if(window.location.href.indexOf("WebMinderNewProcess.jsp")>=0 || window.location.href.indexOf("WebMinderEditProcess.jsp")>=0 || window.location.href.indexOf("minderListView.do")>=0 || window.location.href.indexOf("index.do")>=0 && localStorage.getItem('minder_is_found') == "1")
            {
              try{
              ungroup(true);
              }catch(err) {
             check_for_url();
              }

            }
  //check_for_url("tbl_minders");
})();
function set_onclick()
{
 var inputs = document.getElementsByTagName("input");
    for(var i=0;i<inputs.length;i++)
    {
        if(inputs[i].name == "save" || inputs[i].name == "savecreate")
        {
            inputs[i].onclick = function() {
        console.log("Adding webminder");
        set_local_storage();
        };
        }
    }
}
function get_input_url()
{
 return document.getElementsByName("url")[0].value;
}


function is_last_page(css_class)
{
    var all_pages = [];
    var elements = 	$("."+css_class+" a");
 for(var i=0;i<elements.length;i++ )
 {
     if(elements[i].text == "Next>>")
     {
         return false;
     }
 }
     return true;
}
function get_next_url(css_class)
{
    var elements = 	$("."+css_class+" a");
 for(var i=0;i<elements.length;i++ )
 {
     if(elements[i].text == "Next>>")
     {
         return elements[i].href;
     }
 }
}

function go_to(href)
{
    window.location = href;
}
function get_edit_url()
{
    //funciton to get the last table row's edit link
    var table = $("#"+"tbl_minders"+' tr');
    var match_url = localStorage.getItem('infominder_input_url');
    //console.log(localStorage.getItem('infominder_input_url'));
    for(var i=1;i<table.length;i++)
    {
       if(table[i].cells.length == 6)
       {
           var on_mouse_over = table[i].cells[2].childNodes[1].attributes[2].textContent;
           var url = on_mouse_over.substring(27,on_mouse_over.length-8);
           //console.log(url);
           if(url == match_url || (url+"/") == match_url || (match_url+"/") == url)
           {
           return table[i].cells[1].childNodes[0].href;
           }
       }
    }
    return "no";
}

function check_for_url()
{
    var res = get_edit_url()
    console.log(res);
    if(res != "no" && localStorage.getItem("minder_is_found") == "1")
    {
        localStorage.setItem('minder_is_found',"0");
        go_to(res);
        return;
    }
    var is_found = localStorage.getItem('minder_is_found');
    console.log(is_found);
    if(is_last_page("wmfieldlabel") && is_found == "1")
    {
     localStorage.setItem('minder_is_found',"0");
     alert("Recently Input minder not found.");
    }
    else if(is_found == "1")
    {
        go_to(get_next_url("wmfieldlabel"));
    }
}

function set_local_storage()
{
    localStorage.setItem('infominder_input_url',get_input_url());
    localStorage.setItem('minder_is_found',"1");
}
