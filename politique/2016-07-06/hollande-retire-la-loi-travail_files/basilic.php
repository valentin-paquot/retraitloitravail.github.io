(parent.FOGLIO || FOGLIO).q('segment', {name:'cdn', value:"Online1", persist:false}); // Log CDN
if(!Array.prototype.indexOf){Array.prototype.indexOf=function(c,d){for(var b=(d||0),a=this.length;b<a;b++){if(this[b]===c){return b}}return -1}}FBOOMR_start=new Date().getTime();(function(b){var f=0;while(b.parent!==b&&f<5){f++;if(document.getElementById("boomr-if-as")&&document.getElementById("boomr-if-as").nodeName.toLowerCase()==="script"){if(b.FOGLIO!==undefined){b.parent.FOGLIO=b.FOGLIO}b=b.parent}}var e,a,c,h=b.document;if(b.FBOOMR===undefined){b.FBOOMR={}}FBOOMR=b.FBOOMR;FOGLIO=b.FOGLIO;if(FBOOMR.version){return}FBOOMR.version="0.9";FBOOMR.window=b;FBOOMR.fallbackBeaconUrl=FBOOMR.fallbackBeaconUrl||document.location.protocol+"//d2l2beldn0wvcm.cloudfront.net/beacon.gif";e={beacon_url:"",site_domain:document.domain||b.location.hostname.toLowerCase(),user_ip:"",onloadfired:false,handlers_attached:false,events:{page_ready:[],page_unload:[],dom_loaded:[],visibility_changed:[],before_beacon:[],click:[]},vars:{},disabled_plugins:{},onclick_handler:function(d){var j;if(!d){d=b.event}if(d.target){j=d.target}else{if(d.srcElement){j=d.srcElement}}if(j.nodeType===3){j=j.parentNode}if(j&&j.nodeName.toUpperCase()==="OBJECT"&&j.type==="application/x-shockwave-flash"){return}e.fireEvent("click",j)},fireEvent:function(d,m){var j,l,n;if(!this.events.hasOwnProperty(d)){return false}n=this.events[d];for(j=0;j<n.length;j++){l=n[j];l[0].call(l[2],m,l[1])}return true}};FBOOMR.impl=e;a={t_start:FBOOMR_start,t_end:null,utils:{objectToString:function(m,l){var j=[],d;if(!m||typeof m!=="object"){return m}if(l===undefined){l="\n\t"}for(d in m){if(Object.prototype.hasOwnProperty.call(m,d)){j.push(encodeURIComponent(d)+"="+encodeURIComponent(m[d]))}}return j.join(l)},getCookie:function(d){if(!d){return null}d=" "+d+"=";var j,l;l=" "+h.cookie+";";if((j=l.indexOf(d))>=0){j+=d.length;l=l.substring(j,l.indexOf(";",j));return l}return null},setCookie:function(m,n,j){var o,l,r,q;if(!m||!e.site_domain){return false}o=this.objectToString(n,"&");l=m+"="+o;r=[l,"path=/","domain="+e.site_domain];if(j){q=new Date();q.setTime(q.getTime()+j*1000);q=q.toGMTString();r.push("expires="+q)}else{var d=365*3600*24;q=new Date();q.setTime(q.getTime()+d*1000);q=q.toGMTString();r.push("expires="+q)}if(l.length<4000){h.cookie=r.join("; ");return(o===this.getCookie(m))}return false},getSubCookies:function(n){var m,j,d,q,o={};if(!n){return null}m=n.split("&");if(m.length===0){return null}for(j=0,d=m.length;j<d;j++){q=m[j].split("=");q.push("");o[decodeURIComponent(q[0])]=decodeURIComponent(q[1])}return o},removeCookie:function(d){return this.setCookie(d,{},-1)},pluginConfig:function(q,d,m,l){var j,n=0;if(!d||!d[m]){return false}for(j=0;j<l.length;j++){if(d[m][l[j]]!==undefined){q[l[j]]=d[m][l[j]];n++}}return(n>0)},addListener:function(l,j,d){if(l.addEventListener){l.addEventListener(j,d,false)}else{l.attachEvent("on"+j,d)}},removeListener:function(l,j,d){if(l.removeEventListener){l.removeEventListener(j,d,false)}else{l.detachEvent("on"+j,d)}}},init:function(j){var m,d,l=["beacon_url","site_domain","user_ip"];if(!j){j={}}for(m=0;m<l.length;m++){if(j[l[m]]!==undefined){e[l[m]]=j[l[m]]}}if(j.log!==undefined){this.log=j.log}if(!this.log){this.log=function(){}}for(d in this.plugins){if(this.plugins.hasOwnProperty(d)){if(j[d]&&j[d].hasOwnProperty("enabled")&&j[d].enabled===false){e.disabled_plugins[d]=1;continue}else{if(e.disabled_plugins[d]){delete e.disabled_plugins[d]}}if(typeof this.plugins[d].init==="function"){this.plugins[d].init(j)}}}if(e.handlers_attached){return this}if(!e.onloadfired&&(j.autorun===undefined||j.autorun!==false)){if(h.readyState&&h.readyState==="complete"){this.setImmediate(FBOOMR.page_ready,null,null,FBOOMR)}else{if(b.onpagehide||b.onpagehide===null){a.utils.addListener(b,"pageshow",FBOOMR.page_ready)}else{a.utils.addListener(b,"load",FBOOMR.page_ready)}}}a.utils.addListener(b,"DOMContentLoaded",function(){e.fireEvent("dom_loaded")});a.utils.addListener(b,"DOMContentLoaded",FBOOMR.dom_content_loaded);a.subscribe("page_unload",e.page_unload,null,e);(function(){var n=function(){e.fireEvent("visibility_changed")};if(h.webkitVisibilityState){a.utils.addListener(h,"webkitvisibilitychange",n)}else{if(h.msVisibilityState){a.utils.addListener(h,"msvisibilitychange",n)}else{if(h.visibilityState){a.utils.addListener(h,"visibilitychange",n)}}}a.utils.addListener(h,"mouseup",e.onclick_handler);if(!b.onpagehide&&b.onpagehide!==null){a.utils.addListener(b,"unload",function(){FBOOMR.window=b=null})}}());e.handlers_attached=true;return this},page_ready:function(){if(e.onloadfired){return this}FBOOMR.addVar("umm_onload",new Date().getTime()-FOGLIO.tag_s);e.fireEvent("page_ready");e.onloadfired=true;return this},dom_content_loaded:function(){setTimeout(function(){if(e.onloadfired==false){FBOOMR.page_ready()}},10000);FBOOMR.addVar("umm_dom",new Date().getTime()-FOGLIO.tag_s)},page_unload:function(){if(e.onloadfired==false){e.onloadfired=true;FBOOMR.page_ready()}},setImmediate:function(l,m,j,n){var d=function(){l.call(n||null,m,j||{});d=null};if(b.setImmediate){b.setImmediate(d)}else{if(b.msSetImmediate){b.msSetImmediate(d)}else{if(b.webkitSetImmediate){b.webkitSetImmediate(d)}else{if(b.mozSetImmediate){b.mozSetImmediate(d)}else{setTimeout(d,10)}}}}},subscribe:function(d,o,j,r){var l,n,q,m;if(!e.events.hasOwnProperty(d)){return this}q=e.events[d];for(l=0;l<q.length;l++){n=q[l];if(n[0]===o&&n[1]===j&&n[2]===r){return this}}q.push([o,j||{},r||null]);if(d==="page_ready"&&e.onloadfired){this.setImmediate(o,null,j,r)}if(d==="page_unload"){m=function(s){if(o){o.call(r,s||b.event,j)}};if(b.onpagehide||b.onpagehide===null){a.utils.addListener(b,"pagehide",m)}else{a.utils.addListener(b,"unload",m)}a.utils.addListener(b,"beforeunload",m)}return this},addVar:function(j,l){if(typeof j==="string"){e.vars[j]=l}else{if(typeof j==="object"){var m=j,d;for(d in m){if(m.hasOwnProperty(d)){e.vars[d]=m[d]}}}}return this},getVar:function(d){return e.vars[d]},getAllVars:function(d){return e.vars},removeVar:function(j){var d,l;if(!arguments.length){return this}if(arguments.length===1&&Object.prototype.toString.apply(j)==="[object Array]"){l=j}else{l=arguments}for(d=0;d<l.length;d++){if(e.vars.hasOwnProperty(l[d])){delete e.vars[l[d]]}}return this},sendBeacon:function(){var m,n,l,d=0;for(m in this.plugins){if(this.plugins.hasOwnProperty(m)){if(e.disabled_plugins[m]){continue}if(!this.plugins[m].is_complete()){return this}}}e.vars.md_ver=FBOOMR.version;e.vars.md_url=h.URL.replace(/#.*/,"");if(b!==window){e.vars["if"]=""}e.fireEvent("before_beacon",e.vars);if(!e.beacon_url){return this}n=[];for(m in e.vars){if(e.vars.hasOwnProperty(m)){d++;n.push(encodeURIComponent(m)+"="+(e.vars[m]===undefined||e.vars[m]===null?"":encodeURIComponent(e.vars[m])))}}var j=n;n=e.beacon_url+((e.beacon_url.indexOf("?")>-1)?"&":"?")+n.join("&");FBOOMR.debug("Sending url: "+n.replace(/&/g,"\n\t"));if(d){var l=new Image();l.onload=function(){if("naturalHeight" in this){if(this.naturalHeight==0&&this.naturalWidth==0){FBOOMR.debug("natural image size == 0x0 => Send to cloudfront fallback");this.onerror();return}}else{if(this.height==0&&this.width==0){FBOOMR.debug("image size == 0x0 => Send to cloudfront fallback");this.onerror();return}}};l.onerror=function(){FBOOMR.debug("image onError => Send to cloudfront fallback");l.onerror=function(){};l.src=FBOOMR.fallbackBeaconUrl+((FBOOMR.fallbackBeaconUrl.indexOf("?")>-1)?"&":"?")+j.join("&")};l.src=n;e.image=l}return this}};delete FBOOMR_start;(function(){var d=function(j){return function(l,n){this.log(l,j,"boomerang"+(n?"."+n:""));return this}};a.debug=d("debug");a.info=d("info");a.warn=d("warn");a.error=d("error")}());if(b.YAHOO&&b.YAHOO.widget&&b.YAHOO.widget.Logger){a.log=b.YAHOO.log}else{if(b.Y&&b.Y.log){a.log=b.Y.log}else{if(typeof console==="object"&&console.log!==undefined){a.log=function(d,j,n){console.log(n+": ["+j+"] "+d)}}}}for(c in a){if(a.hasOwnProperty(c)){FBOOMR[c]=a[c]}}FBOOMR.plugins=FBOOMR.plugins||{}}(window));
if(typeof JSON==="undefined"){if(typeof JSON!=="object"){JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==="string"){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}())}(function(){FBOOMR=FBOOMR||{};FBOOMR.plugins=FBOOMR.plugins||{};var a={complete:false,retry:0,done:function(){var c=FBOOMR.window,j,d,h,b,f;j=c.performance||c.msPerformance||c.webkitPerformance||c.mozPerformance;if(j&&j.timing&&j.navigation){FBOOMR.info("This user agent supports NavigationTiming.","nt");d=j.navigation;h=j.timing;b=h.navigationStart;f={ni_red_cnt:d.redirectCount,ni_nav_type:d.type,nt_nav_s:h.navigationStart,nm_red_s:((h.redirectStart-b)<0)?0:(h.redirectStart-b),nm_red_e:((h.redirectStart-b)<0)?0:(h.redirectEnd-b),nm_fet_s:h.fetchStart-b,nm_dns_s:h.domainLookupStart-b,nm_dns_e:h.domainLookupEnd-b,nm_con_s:h.connectStart-b,nm_con_e:h.connectEnd-b,nm_req_s:h.requestStart-b,nm_res_s:h.responseStart-b,nm_res_e:h.responseEnd-b,nm_dol:h.domLoading-b,nm_doi:h.domInteractive-b,nm_docle_s:h.domContentLoadedEventStart-b,nm_docle_e:h.domContentLoadedEventEnd-b,nm_doc:h.domComplete-b,nm_loa_s:h.loadEventStart-b,nm_loa_e:h.loadEventEnd-b,nm_unl_s:h.unloadEventStart-b,nm_unl_e:h.unloadEventEnd-b};if(h.secureConnectionStart){f.nm_ssl_s=h.secureConnectionStart-b}if(h.msFirstPaint){f.nm_fp=h.msFirstPaint-b}FBOOMR.addVar("nav_s",h.navigationStart);FBOOMR.addVar("nav_sm","navigation");FBOOMR.addVar(f);if(h.loadEventEnd==0&&this.retry<2){this.retry=this.retry+1;FBOOMR.sendBeacon();var e=this;return FBOOMR.window.setTimeout(function(){if(e.complete||h.loadEventEnd==0){return}e.complete=true;FBOOMR.addVar("nm_loa_e",h.loadEventEnd-b);FBOOMR.sendBeacon()},1000)}}if(c.chrome&&c.chrome.loadTimes){h=c.chrome.loadTimes();if(h){f={ni_spdy:(h.wasFetchedViaSpdy?1:0),nm_fp:Math.floor(h.firstPaintTime*1000-b)};FBOOMR.addVar(f)}}this.complete=true;FBOOMR.sendBeacon()}};FBOOMR.plugins.NavigationTiming={init:function(){FBOOMR.subscribe("page_ready",a.done,null,a);return this},is_complete:function(){return a.complete}}}());
(function(a){var c=a.document;FBOOMR=FBOOMR||{};FBOOMR.plugins=FBOOMR.plugins||{};FOGLIO=a.FOGLIO;var b={complete:false,createUUID:function(){var h=[];var d="0123456789abcdef";for(var e=0;e<36;e++){h[e]=d.substr(Math.floor(Math.random()*16),1)}h[14]="4";h[19]=d.substr((h[19]&3)|8,1);h[8]=h[13]=h[18]=h[23]="-";var f=h.join("");return f},isNewSession:function(e){if(e.pt===undefined||e.pt.lv===undefined){return true}else{var f=new Date().getTime();var d=e.pt.lv;var h=f-d;if(h<0||h>30*60*1000){return true}return false}},isCurrentLoadTimeInvalid:function(){var d=FBOOMR.getVar(FOGLIO.up.ltmn||"nm_loa_e");return(d<0)},isNewUser:function(d){return(d.pmd===undefined||d.pmd.u_id===undefined)},isLandingPage:function(){if(this.getReferrer()===""){return true}var d=c.createElement("a");d.href=this.getReferrer();if(d.hostname==a.location.hostname){return false}return true},getReferrer:function(){return FBOOMR.window.document.referrer},getPathName:function(){return FBOOMR.window.document.location.pathname},getTopReferrer:function(){return FBOOMR.window.top.document.referrer},getSearch:function(){return FBOOMR.window.document.location.search},getUTMInfos:function(){var f=this.getSearch().slice(1).split("&");var d={};for(var e=0;e<f.length;e++){param=f[e].split("=");if((param[0]==="utm_source"||param[0]==="utm_medium"||param[0]==="utm_campaign"||param[0]==="utm_content"||param[0]==="utm_term")&&param[1]){d[param[0]]=param[1]}}return d},getSearchKeywords:function(){var d="";var f=(this.getTopReferrer()!==undefined)?this.getTopReferrer():this.getReferrer();if("undefined"!==typeof(f.split("/")[2])){var h=f.split("/")[2].split(".");if(h.indexOf("google")===h.length-2){if(f.split("?").length>0){if("undefined"!==typeof(f.split("?")[1])){var j=f.split("?")[1].split("&");for(var e=0;e<j.length;e++){if(0===j[e].indexOf("q=")){d=j[e].substring(2).split(escape(" "))}}}}}if(d!==""){for(var e=0;e<d.length;e++){d[e]=decodeURI(d[e])}}}return d},getPersistentMetricsSession:function(f,e){var d={};if(this.isCurrentLoadTimeInvalid()){e.pm.sc_se++;return e.pm}d.sc_se=e.pm.sc_se;if(!e.pm.s_conv){if(FBOOMR.getVar("ubm_conv")==1){d.s_conv=1}}else{if(e.pm.s_conv){d.s_conv=e.pm.s_conv}}if(e.pm.sc_mean){d.sc_mean=parseFloat(((e.pm.sc_sum+f)/(e.pm.sc_pv+1)).toFixed(0));d.sp_mean=e.pm.sc_mean}else{d.sc_mean=f}d.sc_sum=e.pm.sc_sum+f;d.sc_pv=e.pm.sc_pv+1;if(e.pm.pp_nm_loa_e!=null){d.pp_nm_loa_e=e.pm.pp_nm_loa_e}if(e.pm.pp_type!=null){d.pp_type=e.pm.pp_type}return d},persistGetPersistentMetaData:function(){var d=JSON.parse(FBOOMR.utils.getCookie("_foglio_p"))||{};var f={};if(this.isNewUser(d)){f.pmd_u_id=this.createUUID()}else{f.pmd_u_id=d.pmd.u_id}if(this.isNewSession(d)){f.pmd_s_id=this.createUUID();d.pt.s_st=new Date().getTime()}if(this.isLandingPage()){delete d.pmd_utm_source;delete d.pmd_utm_medium;delete d.pmd_utm_content;delete d.pmd_utm_campaign;delete d.pmd_utm_term;delete d.pmd_s_seo;d.pmd.lp_ref=this.getReferrer().split("?")[0];d.pmd.lp_path=this.getPathName();d.pmd.lp_reftype=this.getLandingPageRefererType();if(typeof(FBOOMR.getVar("us_pagetype"))!=="undefined"){d.pmd.lp_type=FBOOMR.getVar("us_pagetype")}var e=this.getSearchKeywords().toString();if(e!==""){d.pmd.s_seo=this.getSearchKeywords().toString()}for(utm in utms=this.getUTMInfos()){d.pmd[utm]=utms[utm]}}for(k in d.pmd){f["pmd_"+k]=d.pmd[k]}FBOOMR.utils.setCookie("_foglio_p",JSON.stringify(d));return f},getLandingPageRefererType:function(){var f=c.createElement("a");var e=this.getReferrer();f.href=e;if(e.indexOf("plus.google.com")!=-1){return"google+"}var d=["google","bing","yahoo"];for(index=0;index<d.length;++index){if(e.indexOf(d[index])!=-1){return"search"}}if(e===undefined||e==""){return"direct"}else{if(JSON.stringify(this.getUTMInfos())!="{}"){return"SEM"}else{if(e.indexOf("twitter")!=-1||e.indexOf("t.co")!=-1){return"twitter"}else{if(e.indexOf("facebook")!=-1){return"facebook"}else{if(f.hostname!=FBOOMR.window.location.hostname){return"external"}}}}}},initPersistentMetricsCookie:function(){try{var d=JSON.parse(FBOOMR.utils.getCookie("_foglio_p"))||{}}catch(f){var d={}}if(this.isNewSession(d)){delete d.pm.s_conv;delete d.pm.sc_mean;delete d.pm.sp_mean;d.pm.sc_sum=0;d.pm.sc_pv=0;d.pm.sc_se=0;delete d.pm.pp_nm_loa_e;delete d.pm.pp_type}return d},persistGetPersistentMetrics:function(){var d=this.initPersistentMetricsCookie();var f=FBOOMR.getVar(FOGLIO.up.ltmn||"nm_loa_e");var e={};if(f!==undefined){for(p in pmss=this.getPersistentMetricsSession(f,d)){if(p==="pp_nm_loa_e"||p==="pp_type"){e["pm_"+p]=pmss[p]}else{e["pm_"+p]=d.pm[p]=pmss[p]}}}d.pm.pp_nm_loa_e=f;if(typeof(FBOOMR.getVar("us_pagetype"))!=="undefined"){d.pm.pp_type=FBOOMR.getVar("us_pagetype")}FBOOMR.utils.setCookie("_foglio_p",JSON.stringify(d));return e},persistGetUserPersistentSegments:function(){var d=JSON.parse(FBOOMR.utils.getCookie("_foglio_p"))||{};ups={};if(this.isNewSession(d)){d.ups={}}if(FOGLIO.queue.segment){for(var e=0;e<FOGLIO.queue.segment.length;e++){var f=FOGLIO.queue.segment[e];if(f.persist===true||f.name==="version"){d.ups[f.name]=f.value}}}for(k in d.ups){ups["us_"+k]=d.ups[k]}FBOOMR.utils.setCookie("_foglio_p",JSON.stringify(d));return ups},persistGetUserPersistentMetrics:function(){var d=JSON.parse(FBOOMR.utils.getCookie("_foglio_p"))||{};upm={};if(this.isNewSession(d)){d.upm={}}if(FOGLIO.queue.metric){for(var f=0;f<FOGLIO.queue.metric.length;f++){var e=FOGLIO.queue.metric[f];if(e.persist===true){d.upm[e.name]=e.value}}}for(k in d.upm){upm["um_"+k]=d.upm[k]}FBOOMR.utils.setCookie("_foglio_p",JSON.stringify(d));return upm},importFromQueues:function(){if(FOGLIO.queue.segment){for(var f=0;f<FOGLIO.queue.segment.length;f++){var h=FOGLIO.queue.segment[f];FBOOMR.addVar("us_"+h.name,h.value)}}if(FOGLIO.queue.metric){for(var f=0;f<FOGLIO.queue.metric.length;f++){var e=FOGLIO.queue.metric[f];FBOOMR.addVar("um_"+e.name,e.value)}}if(FOGLIO.queue.biz){for(var f=0;f<FOGLIO.queue.biz.length;f++){var d=FOGLIO.queue.biz[f];if(d.conversion===true){FBOOMR.addVar("ubm_conv",1);if(!isNaN(d.amount)&&d.amount){FBOOMR.addVar("ubm_amnt",d.amount)}if(!isNaN(d.cart)&&d.cart){FBOOMR.addVar("ubm_cart",d.cart)}}}}},getCookie:function(){try{var d=JSON.parse(FBOOMR.utils.getCookie("_foglio_p"))||{}}catch(f){var d={}}if(d.pmd&&d.pmd.fver!==FBOOMR.getVar("pmd_fver")){d={}}if(!d.pmd){d.pmd={fver:FBOOMR.getVar("pmd_fver")}}if(!d.pt){d.pt={}}if(!d.pm){d.pm={}}if(!d.ups){d.ups={}}if(!d.upm){d.upm={}}FBOOMR.utils.setCookie("_foglio_p",JSON.stringify(d));return d},done:function(){if(!FOGLIO.LOADED||FOGLIO.LOADED!==true){FOGLIO.LOADED=true;if(FOGLIO.cr==null||isNaN(FOGLIO.cr)){FOGLIO.cr=1}if(FOGLIO.sr==null||isNaN(FOGLIO.sr)){FOGLIO.sr=1}FOGLIO.cr=FOGLIO.cr*FOGLIO.sr;FOGLIO.sr=1;this.importFromQueues();FBOOMR.addVar("pmd_fver","20140625-1");FBOOMR.addVar("md_aid",FOGLIO.app_id);FBOOMR.addVar("tag_s",FOGLIO.tag_s);FBOOMR.addVar("md_sr",FOGLIO.sr);FBOOMR.addVar("md_cr",FOGLIO.cr);FBOOMR.addVar("md_tok",FOGLIO.ft||FOGLIO.tok);FBOOMR.addVar("md_id",this.createUUID());var e=c.createElement("a");e.href=(top.document.referrer!==undefined)?top.document.referrer:c.referrer;FBOOMR.addVar("md_ref",e.hostname+e.pathname);var d=this.getCookie();FBOOMR.utils.setCookie("_foglio_p",JSON.stringify(d));if(this.isNewUser(d)){FBOOMR.addVar("md_inu",1)}if(this.isNewSession(d)){FBOOMR.addVar("md_ins",1)}if(!FOGLIO.up){FOGLIO.up={}}for(k in pmds=this.persistGetPersistentMetaData()){FBOOMR.addVar(k,pmds[k])}for(k in pms=this.persistGetPersistentMetrics()){FBOOMR.addVar(k,pms[k])}if(this.isCurrentLoadTimeInvalid()){FBOOMR.addVar("md_lte",1)}for(k in ups=this.persistGetUserPersistentSegments()){FBOOMR.addVar(k,ups[k])}for(k in upm=this.persistGetUserPersistentMetrics()){FBOOMR.addVar(k,upm[k])}var d=JSON.parse(FBOOMR.utils.getCookie("_foglio_p"))||{};if(d.pt.lv){FBOOMR.addVar("pt_lv",d.pt.lv);FBOOMR.addVar("pto_lv",d.pt.lv-new Date().getTime())}if(d.pt.s_st){FBOOMR.addVar("pt_s_st",d.pt.s_st);FBOOMR.addVar("pto_s_st",d.pt.s_st-new Date().getTime())}d.pmd.u_id=FBOOMR.getVar("pmd_u_id");d.pmd.s_id=FBOOMR.getVar("pmd_s_id");if(this.isNewSession(d)){d.pt.lv=new Date().getTime();if(Math.random()>FOGLIO.cr){FBOOMR.info("SamplingRate test failed, we won't send beacons for this new session");d.pmd.ims="0";FBOOMR.utils.setCookie("_foglio_p",JSON.stringify(d));this.complete=false;return}else{FBOOMR.info("SamplingRate test passed, we will send beacons for this new session");d.pmd.ims="1";FBOOMR.utils.setCookie("_foglio_p",JSON.stringify(d));b.complete=true;FBOOMR.sendBeacon()}}else{if(d.pmd.ims&&d.pmd.ims=="0"){FBOOMR.info("Session not measured, we won't send the beacon");d.pt.lv=new Date().getTime();FBOOMR.utils.setCookie("_foglio_p",JSON.stringify(d));this.complete=false;return}else{if(d.pmd.ims&&d.pmd.ims=="1"){FBOOMR.info("Session is measured, we send the beacon");d.pt.lv=new Date().getTime();FBOOMR.utils.setCookie("_foglio_p",JSON.stringify(d));b.complete=true;FBOOMR.sendBeacon()}else{FBOOMR.info("This case shouldn't happen, so we do not send beacons for this session.");d.pmd.ims="0";d.pt.lv=new Date().getTime();FBOOMR.utils.setCookie("_foglio_p",JSON.stringify(d));this.complete=false;return}}}}else{b.complete=true;FBOOMR.sendBeacon()}}};FBOOMR.plugins.FOGLIO={init:function(d){FBOOMR.subscribe("page_ready",b.done,null,b);return this},impl:b,is_complete:function(){return b.complete}}}(window));
(function(a){var c=a.document,b;FBOOMR=FBOOMR||{};FBOOMR.plugins=FBOOMR.plugins||{};FOGLIO=a.FOGLIO;b={initialized:false,complete:false,timers:{},cookie:"RT",cookie_exp:600,strict_referrer:true,navigationType:0,navigationStart:undefined,responseStart:undefined,t_start:undefined,t_fb_approx:undefined,r:undefined,r2:undefined,setCookie:function(j,e){var h,d,f;if(!this.cookie){return this}f=FBOOMR.utils.getSubCookies(FBOOMR.utils.getCookie(this.cookie))||{};if(j==="ul"){f.r=c.URL.replace(/#.*/,"")}if(j==="cl"){if(e){f.nu=e}else{if(f.nu){delete f.nu}}}if(e===false){delete f.nu}d=new Date().getTime();if(j){f[j]=d}h=new Date().getTime();if(h-d>50){FBOOMR.utils.removeCookie(this.cookie);FBOOMR.error("took more than 50ms to set cookie... aborting: "+d+" -> "+h,"rt")}return this},initFromCookie:function(){var d;if(!this.cookie){return}d=FBOOMR.utils.getSubCookies(FBOOMR.utils.getCookie(this.cookie));if(!d){return}d.s=Math.max(+d.ul||0,+d.cl||0);FBOOMR.debug("Read from cookie "+FBOOMR.utils.objectToString(d),"rt");if(d.s&&d.r){this.r=d.r;FBOOMR.debug(this.r+" =?= "+this.r2,"rt");FBOOMR.debug(d.s+" <? "+(+d.cl+15),"rt");FBOOMR.debug(d.nu+" =?= "+c.URL.replace(/#.*/,""),"rt");if(!this.strict_referrer||this.r===this.r2||(d.s<+d.cl+15&&d.nu===c.URL.replace(/#.*/,""))){this.t_start=d.s;if(+d.hd>d.s){this.t_fb_approx=parseInt(d.hd,10)}}else{this.t_start=this.t_fb_approx=undefined}}},checkPreRender:function(){if(!(c.webkitVisibilityState&&c.webkitVisibilityState==="prerender")&&!(c.msVisibilityState&&c.msVisibilityState===3)){return false}FBOOMR.subscribe("visibility_changed",FBOOMR.plugins.RT.done,null,FBOOMR.plugins.RT);return true},initNavTiming:function(){var d,f,e;if(this.navigationStart){return}f=a.performance||a.msPerformance||a.webkitPerformance||a.mozPerformance;if(f&&f.navigation){this.navigationType=f.navigation.type}if(f&&f.timing){d=f.timing}else{if(a.chrome&&a.chrome.csi&&a.chrome.csi().startE){d={navigationStart:a.chrome.csi().startE};e="csi"}else{if(a.gtbExternal&&a.gtbExternal.startE()){d={navigationStart:a.gtbExternal.startE()};e="gtb"}}}if(d){this.navigationStart=d.navigationStart||d.fetchStart||undefined;this.responseStart=d.responseStart||undefined;if(navigator.userAgent.match(/Firefox\/[78]\./)){this.navigationStart=d.unloadEventStart||d.fetchStart||undefined}}else{FBOOMR.warn("This browser doesn't support the WebTiming API","rt")}return},page_unload:function(d){FBOOMR.debug("Unload called with "+FBOOMR.utils.objectToString(d),"rt")},onclick:function(d){if(!d){return}FBOOMR.debug("Click called with "+d.nodeName,"rt");while(d&&d.nodeName.toUpperCase()!=="A"){d=d.parentNode}if(d&&d.nodeName.toUpperCase()==="A"){FBOOMR.debug("passing through","rt")}},domloaded:function(){}};FBOOMR.plugins.RT={init:function(d){FBOOMR.debug("init RT","rt");if(a!==FBOOMR.window){a=FBOOMR.window;c=a.document}FBOOMR.utils.pluginConfig(b,d,"RT",["cookie","cookie_exp","strict_referrer"]);b.initFromCookie();if(b.initialized){return this}b.complete=false;b.timers={};FBOOMR.subscribe("page_ready",this.done,null,this);FBOOMR.subscribe("dom_loaded",b.domloaded,null,b);FBOOMR.subscribe("page_unload",b.page_unload,null,b);FBOOMR.subscribe("click",b.onclick,null,b);if(FBOOMR.t_start){}b.r=b.r2=c.referrer.replace(/#.*/,"");b.initialized=true;return this},startTimer:function(d,e){if(d){if(d==="t_page"){this.endTimer("t_resp",e)}b.timers[d]={start:(typeof e==="number"?e:new Date().getTime())};b.complete=false}return this},endTimer:function(d,e){if(d){b.timers[d]=b.timers[d]||{};if(b.timers[d].end===undefined){b.timers[d].end=(typeof e==="number"?e:new Date().getTime())}}return this},setTimer:function(d,e){if(d){b.timers[d]={delta:e}}return this},importFromQueue:function(){if(FOGLIO.tag_s==undefined||FOGLIO.tag_s==null){return false}for(index in FOGLIO.queue.mark){var d=FOGLIO.queue.mark[index];FBOOMR.plugins.RT.setTimer(d.name,d.value-FOGLIO.tag_s)}},done:function(){FBOOMR.debug("Called done","rt");var e,h=new Date().getTime(),l={t_done:1,t_resp:1,t_page:1},d=0,j,m,f=[];this.importFromQueue();b.complete=false;b.initFromCookie();b.initNavTiming();if(b.checkPreRender()){return this}if(b.responseStart){if(b.timers.t_load){}else{}}else{if(b.timers.hasOwnProperty("t_page")){}else{if(b.t_fb_approx){}}}if(b.timers.hasOwnProperty("t_postrender")){}if(b.navigationStart){e=b.navigationStart}else{if(b.t_start&&b.navigationType!==2){e=b.t_start}else{e=undefined}}FBOOMR.removeVar("t_done","t_page","t_resp","r","r2","rt.tstart","rt.bstart","rt.end","t_postrender","t_prerender","t_load");for(j in b.timers){if(b.timers.hasOwnProperty(j)){m=b.timers[j];if(typeof m.delta!=="number"){if(typeof m.start!=="number"){m.start=e}m.delta=m.end-m.start}if(isNaN(m.delta)){continue}if(l.hasOwnProperty(j)){FBOOMR.addVar(j,m.delta)}else{FBOOMR.addVar("umm_"+j,m.delta)}d++}}if(d){FBOOMR.addVar("md_ref",b.r);if(b.r2!==b.r){FBOOMR.addVar("md_ref2",b.r2)}if(f.length){FBOOMR.addVar("t_other",f.join(","))}}FBOOMR.utils.removeCookie(this.cookie);b.timers={};b.complete=true;FBOOMR.sendBeacon();return this},is_complete:function(){return b.complete}}}(window));
(function(){var a=function(e,d,c){d=Math.round(d);if(d>=0&&d<3600000){if(c&&window.rumMapping&&window.rumMapping[e]){FBOOMR.plugins.RT.setTimer(window.rumMapping[e],d)}}};utReportRUM=function(d){if(typeof FBOOMR.window.performance=="undefined"||typeof FBOOMR.window.performance.getEntriesByType=="undefined"){return}var c=FBOOMR.window.performance.getEntriesByType("mark");var e={};for(i=0;i<c.length;i++){g="usertiming";if(e[g]==undefined||c[i].startTime>e[g]){e[g]=c[i].startTime}p=c[i].name.match(/([^\.]+)\.([^\.]*)/);if(p&&p.length>2&&(e[p[1]]==undefined||c[i].startTime>e[p[1]])){e[p[1]]=c[i].startTime}}for(g in e){a(g,e[g],d)}};utOnLoad=function(){utReportRUM(false)};if(window.addEventListener){window.addEventListener("load",utOnLoad,false)}else{if(window.attachEvent){window.attachEvent("onload",utOnLoad)}}utSent=false;FBOOMR=window.FBOOMR||{};FBOOMR.plugins=FBOOMR.plugins||{};FBOOMR.plugins.UserTiming={init:function(b){FBOOMR.subscribe("page_ready",function(){if(!utSent){utReportRUM(true);utSent=true;FBOOMR.sendBeacon()}})},is_complete:function(){return utSent}}})();(function(){FBOOMR=FBOOMR||{};FBOOMR.plugins=FBOOMR.plugins||{};var a={complete:false,done:function(){if(FOGLIO.jserr!=null){FBOOMR.addVar("jserr",FOGLIO.jserr)}a.complete=true;FBOOMR.sendBeacon()}};FBOOMR.plugins.ERRORS={init:function(b){FBOOMR.subscribe("page_ready",a.done)},is_complete:function(){return a.complete}}}());
(function(a){var c=a.document;FBOOMR=FBOOMR||{};FBOOMR.plugins=FBOOMR.plugins||{};var b={complete:false,done:function(){if(a!==FBOOMR.window){a=FBOOMR.window;c=a.document}FBOOMR.blockers.setup();var d=setTimeout(function(){var e=[];if(FBOOMR.blockers.adblock){e.push("adblock")}if(FBOOMR.blockers.installed){e.push("ghostery")}if(e.length===0){FBOOMR.addVar("us_blockers","none")}else{FBOOMR.addVar("us_blockers",e.join("-"))}b.complete=true;FBOOMR.sendBeacon()},100)}};FBOOMR.blockers={installed:false,adblock:false,extensions:{ghostery:["chrome-extension://mlomiejdfkolichcflejclcbmpeaniij/data/images/click2play/ghosty_blocked.png","resource://firefox-at-ghostery-dot-com/ghostery/data/images/Icon-16.png"]},extensions:{firefox:{ghostery:"resource://firefox-at-ghostery-dot-com/ghostery/data/images/Icon-16.png"},chrome:{ghostery:"chrome-extension://mlomiejdfkolichcflejclcbmpeaniij/data/images/click2play/ghosty_blocked.png"}},setupDone:false,setup:function(){if(FBOOMR.blockers.setupDone){return}if(a!==FBOOMR.window){a=FBOOMR.window;c=a.document}var e=c.createElement("IFRAME");e.setAttribute("src","javascript:null");e.setAttribute("style","height: 1px; width: 1px; overflow: hidden; z-index: -1000; border: 0px solid #ffffff; position:absolute; top: -1px; left: -1px;");document.body.appendChild(e);var j=c.createElement("img");j.setAttribute("onload","FBOOMR.blockers.installed = true;");if(a.navigator.appName==="Netscape"&&a.navigator.vendor===""){j.setAttribute("src",FBOOMR.blockers.extensions.firefox.ghostery);e.appendChild(j)}else{if(a.navigator.appName==="Netscape"&&a.navigator.vendor==="Google Inc."){j.setAttribute("src",FBOOMR.blockers.extensions.chrome.ghostery);e.appendChild(j)}}var d=c.createElement("script");var h=window.location.protocol=="https:"?"https://d3phbp7p78bdk9.cloudfront.net/ad/basilic.adsense.js":"http://foglio.basilic.io/ad/basilic.adsense.js";d.setAttribute("src",h);d.setAttribute("onerror","FBOOMR.blockers.adblock = true;");e.appendChild(d);FBOOMR.blockers.setupDone=true}};FBOOMR.plugins.BLOCKERS={init:function(d){FBOOMR.subscribe("page_ready",b.done)},is_complete:function(){return b.complete}}}(window));
FBOOMR.addVar("mob.ct",(typeof navigator==="object"&&navigator.connection)?navigator.connection.type:0);FBOOMR.log=function(){};FBOOMR.init({beacon_url:(window.location.protocol=="https:")?"https://perpetuo-onl.basilic.io/"+FOGLIO.app_id+"/beacon.gif":"http://perpetuo-onl.basilic.io/"+FOGLIO.app_id+"/beacon.gif",indy_visit:{indy_url:(window.location.protocol=="https:")?"https://b.onfocus.io/vi/b.gif":"http://b.onfocus.io/vi/b.gif"},indy_navtiming:{indy_url:(window.location.protocol=="https:")?"https://b.onfocus.io/nt/b.gif":"http://b.onfocus.io/nt/b.gif"},indy_userdata:{indy_url:(window.location.protocol=="https:")?"https://b.onfocus.io/ud/b.gif":"http://b.onfocus.io/ud/b.gif"},indy_attention:{indy_url:(window.location.protocol=="https:")?"https://b.onfocus.io/zv/b.gif":"http://b.onfocus.io/zv/b.gif"},indy_ads:{indy_url:(window.location.protocol=="https:")?"https://b.onfocus.io/a/b.gif":"http://b.onfocus.io/a/b.gif"},indy_viewability:{indy_url:(window.location.protocol=="https:")?"https://b.onfocus.io/av/b.gif":"http://b.onfocus.io/av/b.gif"},indy_adclick:{indy_url:(window.location.protocol=="https:")?"https://b.onfocus.io/ac/b.gif":"http://b.onfocus.io/ac/b.gif"}});FBOOMR.t_end=new Date().getTime();
