/*!
 * Stockfish.js 17 (c) 2025, Chess.com, LLC
 * https://github.com/nmrugg/stockfish.js
 * License: GPLv3
 *
 * Based on Stockfish (c) T. Romstad, M. Costalba, J. Kiiski, G. Linscott and other contributors.
 * https://github.com/official-stockfish/Stockfish
 *
 * Nets by Linmiao Xu (linrock)
 * https://tests.stockfishchess.org/nns?network_name=nn-9067e33176e
 */

(function () {
var Stockfish;
function INIT_ENGINE() {

var Stockfish = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return (
function(Stockfish) {
  Stockfish = Stockfish || {};


function d(){k.buffer!=l&&n(k.buffer);return aa}function u(){k.buffer!=l&&n(k.buffer);return ba}function w(){k.buffer!=l&&n(k.buffer);return ca}function da(){k.buffer!=l&&n(k.buffer);return fa}var x;x||(x=typeof Stockfish !== 'undefined' ? Stockfish : {});var ha,ia;x.ready=new Promise(function(a,b){ha=a;ia=b});
"undefined"!==typeof global&&"[object process]"===Object.prototype.toString.call(global.process)&&"undefined"!==typeof fetch&&("undefined"===typeof XMLHttpRequest&&(global.XMLHttpRequest=function(){var a,b={open:function(c,e){a=e},send:function(){require("fs").readFile(a,function(c,e){b.readyState=4;c?(console.error(c),b.status=404,b.onerror(c)):(b.status=200,b.response=e,b.onreadystatechange(),b.onload())})}};return b}),fetch=null);x.print=function(a){x.listener?x.listener(a):console.log(a)};
x.printErr=function(a){x.listener?x.listener(a):console.error(a)};x.terminate=function(){"undefined"!==typeof y&&y.sa()};var ja=Object.assign({},x),ka=[],z="./this.program",A=(a,b)=>{throw b;},la="object"==typeof window,B="function"==typeof importScripts,D="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,E=x.ENVIRONMENT_IS_PTHREAD||!1,F="";function ma(a){return x.locateFile?x.locateFile(a,F):F+a}var na,H,fs,oa,pa;
if(D){F=B?require("path").dirname(F)+"/":__dirname+"/";pa=()=>{oa||(fs=require("fs"),oa=require("path"))};na=function(b,c){pa();b=oa.normalize(b);return fs.readFileSync(b,c?void 0:"utf8")};H=b=>{b=na(b,!0);b.buffer||(b=new Uint8Array(b));return b};1<process.argv.length&&(z=process.argv[1].replace(/\\/g,"/"));ka=process.argv.slice(2);process.on("uncaughtException",function(b){if(!(b instanceof I))throw b;});process.on("unhandledRejection",function(b){throw b;});A=(b,c)=>{if(J())throw process.exitCode=
b,c;c instanceof I||K("exiting due to exception: "+c);process.exit(b)};x.inspect=function(){return"[Emscripten Module object]"};let a;try{a=require("worker_threads")}catch(b){throw console.error('The "worker_threads" module is not supported in this node.js build - perhaps a newer version is needed?'),b;}global.Worker=a.Worker}else if(la||B)B?F=self.location.href:"undefined"!=typeof document&&document.currentScript&&(F=document.currentScript.src),_scriptDir&&(F=_scriptDir),0!==F.indexOf("blob:")?F=
F.substr(0,F.replace(/[?#].*/,"").lastIndexOf("/")+1):F="",D||(na=a=>{var b=new XMLHttpRequest;b.open("GET",a,!1);b.send(null);return b.responseText},B&&(H=a=>{var b=new XMLHttpRequest;b.open("GET",a,!1);b.responseType="arraybuffer";b.send(null);return new Uint8Array(b.response)}));D&&"undefined"==typeof performance&&(global.performance=require("perf_hooks").performance);var qa=console.log.bind(console),ra=console.warn.bind(console);D&&(pa(),qa=a=>fs.writeSync(1,a+"\n"),ra=a=>fs.writeSync(2,a+"\n"));
var sa=x.print||qa,K=x.printErr||ra;Object.assign(x,ja);ja=null;x.arguments&&(ka=x.arguments);x.thisProgram&&(z=x.thisProgram);x.quit&&(A=x.quit);var L,M;x.wasmBinary&&(M=x.wasmBinary);var noExitRuntime=x.noExitRuntime||!0;"object"!=typeof WebAssembly&&N("no native wasm support detected");var k,ta,ua=!1;function va(a){var b=new TextDecoder(a);this.decode=c=>{c.buffer instanceof SharedArrayBuffer&&(c=new Uint8Array(c));return b.decode.call(b,c)}}
var wa="undefined"!=typeof TextDecoder?new va("utf8"):void 0;
function xa(a,b,c){var e=b+c;for(c=b;a[c]&&!(c>=e);)++c;if(16<c-b&&a.subarray&&wa)return wa.decode(a.subarray(b,c));for(e="";b<c;){var g=a[b++];if(g&128){var h=a[b++]&63;if(192==(g&224))e+=String.fromCharCode((g&31)<<6|h);else{var m=a[b++]&63;g=224==(g&240)?(g&15)<<12|h<<6|m:(g&7)<<18|h<<12|m<<6|a[b++]&63;65536>g?e+=String.fromCharCode(g):(g-=65536,e+=String.fromCharCode(55296|g>>10,56320|g&1023))}}else e+=String.fromCharCode(g)}return e}function P(a){return a?xa(u(),a,void 0):""}
function Q(a,b,c,e){if(0<e){e=c+e-1;for(var g=0;g<a.length;++g){var h=a.charCodeAt(g);if(55296<=h&&57343>=h){var m=a.charCodeAt(++g);h=65536+((h&1023)<<10)|m&1023}if(127>=h){if(c>=e)break;b[c++]=h}else{if(2047>=h){if(c+1>=e)break;b[c++]=192|h>>6}else{if(65535>=h){if(c+2>=e)break;b[c++]=224|h>>12}else{if(c+3>=e)break;b[c++]=240|h>>18;b[c++]=128|h>>12&63}b[c++]=128|h>>6&63}b[c++]=128|h&63}}b[c]=0}}
function ya(a){for(var b=0,c=0;c<a.length;++c){var e=a.charCodeAt(c);55296<=e&&57343>=e&&(e=65536+((e&1023)<<10)|a.charCodeAt(++c)&1023);127>=e?++b:b=2047>=e?b+2:65535>=e?b+3:b+4}return b}"undefined"!=typeof TextDecoder&&new va("utf-16le");function za(a){var b=ya(a)+1,c=R(b);Q(a,d(),c,b);return c}function Aa(a,b){d().set(a,b)}var l,aa,ba,ca,fa;E&&(l=x.buffer);
function n(a){l=a;x.HEAP8=aa=new Int8Array(a);x.HEAP16=new Int16Array(a);x.HEAP32=ca=new Int32Array(a);x.HEAPU8=ba=new Uint8Array(a);x.HEAPU16=new Uint16Array(a);x.HEAPU32=new Uint32Array(a);x.HEAPF32=new Float32Array(a);x.HEAPF64=fa=new Float64Array(a)}var Ba=x.INITIAL_MEMORY||134217728;
if(E)k=x.wasmMemory,l=x.buffer;else if(x.wasmMemory)k=x.wasmMemory;else if(k=new WebAssembly.Memory({initial:Ba/65536,maximum:32768,shared:!0}),!(k.buffer instanceof SharedArrayBuffer))throw K("requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag"),D&&console.log("(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and also use a recent version)"),
Error("bad memory");k&&(l=k.buffer);Ba=l.byteLength;n(l);var Ca,Da=[],Ea=[],Fa=[],Ga=[],Ha=0;function J(){return noExitRuntime||0<Ha}function Ia(){var a=x.preRun.shift();Da.unshift(a)}var S=0,Ja=null,T=null;x.preloadedImages={};x.preloadedAudios={};function N(a){if(E)postMessage({cmd:"onAbort",arg:a});else if(x.onAbort)x.onAbort(a);a="Aborted("+a+")";K(a);ua=!0;a=new WebAssembly.RuntimeError(a+". Build with -s ASSERTIONS=1 for more info.");ia(a);throw a;}
function Ka(){return U.startsWith("data:application/octet-stream;base64,")}var U;U="stockfish.wasm";Ka()||(U=ma(U));function La(){var a=U;try{if(a==U&&M)return new Uint8Array(M);if(H)return H(a);throw"both async and sync fetching of the wasm failed";}catch(b){N(b)}}
function Ma(){return M||!la&&!B||"function"!=typeof fetch?Promise.resolve().then(function(){return La()}):fetch(U,{credentials:"same-origin"}).then(function(a){if(!a.ok)throw"failed to load wasm binary file at '"+U+"'";return a.arrayBuffer()}).catch(function(){return La()})}var Na={};function V(a){for(;0<a.length;){var b=a.shift();if("function"==typeof b)b(x);else{var c=b.Va;"number"==typeof c?void 0===b.ga?Oa(c)():Oa(c)(b.ga):c(void 0===b.ga?null:b.ga)}}}
function Pa(a){var b=Qa();a=a();W(b);return a}function Ra(a){var b=y.ba[a];b&&(w()[a>>2]=0,y.xa(b.worker))}
var y={da:[],ia:[],na:[],Da:function(){E&&y.Fa()},Ya:function(){},Fa:function(){y.receiveObjectTransfer=y.Ia;y.threadInit=y.ya;y.setExitStatus=y.Ka;noExitRuntime=!1},ba:{},Ka:function(){},sa:function(){for(var a in y.ba){var b=y.ba[a];b&&b.worker&&y.xa(b.worker)}for(a=0;a<y.da.length;++a)y.da[a].terminate();y.da=[]},xa:function(a){y.Ja(function(){delete y.ba[a.ea.ta];y.da.push(a);y.ia.splice(y.ia.indexOf(a),1);Sa(a.ea.ta);a.ea=void 0})},Ja:function(a){w()[Ta>>2]=0;try{a()}finally{w()[Ta>>2]=1}},Ia:function(){},
ya:function(){for(var a in y.na)if(y.na.hasOwnProperty(a))y.na[a]()},Ga:function(a,b){a.onmessage=c=>{c=c.data;var e=c.cmd;a.ea&&(y.Aa=a.ea.ta);if(c.targetThread&&c.targetThread!=X()){var g=y.ba[c.cb];g?g.worker.postMessage(c,c.transferList):K('Internal error! Worker sent a message "'+e+'" to target pthread '+c.targetThread+", but that thread no longer exists!")}else if("processQueuedMainThreadWork"===e)Ua();else if("spawnThread"===e)Va(c);else if("cleanupThread"===e)Ra(c.thread);else if("killThread"===
e)c=c.thread,w()[c>>2]=0,e=y.ba[c],delete y.ba[c],e.worker.terminate(),Sa(c),y.ia.splice(y.ia.indexOf(e.worker),1),e.worker.ea=void 0;else if("cancelThread"===e)y.ba[c.thread].worker.postMessage({cmd:"cancel"});else if("loaded"===e)a.loaded=!0,b&&b(a),a.ha&&(a.ha(),delete a.ha);else if("print"===e)sa("Thread "+c.threadId+": "+c.text);else if("printErr"===e)K("Thread "+c.threadId+": "+c.text);else if("alert"===e)alert("Thread "+c.threadId+": "+c.text);else if("setimmediate"===c.target)a.postMessage(c);
else if("onAbort"===e){if(x.onAbort)x.onAbort(c.arg)}else K("worker sent an unknown command "+e);y.Aa=void 0};a.onerror=c=>{K("worker sent an error! "+c.filename+":"+c.lineno+": "+c.message);throw c;};D&&(a.on("message",function(c){a.onmessage({data:c})}),a.on("error",function(c){a.onerror(c)}),a.on("detachedExit",function(){}));a.postMessage({cmd:"load",urlOrBlob:x.mainScriptUrlOrBlob||_scriptDir,wasmMemory:k,wasmModule:ta})},za:function(){var a=ma("stockfish.worker.js");y.da.push(new Worker(a))},
Ca:function(){0==y.da.length&&(y.za(),y.Ga(y.da[0]));return y.da.pop()}};x.establishStackSpace=function(){var a=X(),b=w()[a+44>>2];a=w()[a+48>>2];Wa(b,b-a);W(b)};function Xa(a){if(E)return Y(1,0,a);try{Ya(a)}catch(b){b instanceof I||"unwind"==b||A(1,b)}}var Z=[];function Oa(a){var b=Z[a];b||(a>=Z.length&&(Z.length=a+1),Z[a]=b=Ca.get(a));return b}x.invokeEntryPoint=function(a,b){return Oa(a)(b)};var Za;
Za=D?()=>{var a=process.hrtime();return 1E3*a[0]+a[1]/1E6}:E?()=>performance.now()-x.__performance_now_clock_drift:()=>performance.now();function Va(a){var b=y.Ca();if(!b)return 6;y.ia.push(b);var c=y.ba[a.ra]={worker:b,ta:a.ra};b.ea=c;var e={cmd:"run",start_routine:a.La,arg:a.ga,threadInfoStruct:a.ra};b.ha=()=>{e.time=performance.now();b.postMessage(e,a.Qa)};b.loaded&&(b.ha(),delete b.ha);return 0}var $a=[null,[],[]],ab={};function bb(a,b,c){return E?Y(2,1,a,b,c):0}
function cb(a,b){if(E)return Y(3,1,a,b)}function db(a,b,c){return E?Y(4,1,a,b,c):0}function eb(a,b,c){if(E)return Y(5,1,a,b,c)}function Y(a,b){var c=arguments.length-2,e=arguments;return Pa(function(){for(var g=R(8*c),h=g>>3,m=0;m<c;m++){var v=e[2+m];da()[h+m]=v}return fb(a,c,g,b)})}var gb=[];function hb(a,b,c,e){Pa(function(){var g=R(12),h=0;if(b){h=ya(b)+1;var m=ib(h);Q(b,u(),m,h);h=m}w()[g>>2]=h;w()[g+4>>2]=c;w()[g+8>>2]=e;jb(a,657457152,0,h,g)})}
var kb=[0,"undefined"!=typeof document?document:0,"undefined"!=typeof window?window:0];function lb(a){a=2<a?P(a):a;return kb[a]||("undefined"!=typeof document?document.querySelector(a):void 0)}
function mb(a,b,c){var e=lb(a);if(!e)return-4;e.ma&&(w()[e.ma>>2]=b,w()[e.ma+4>>2]=c);if(e.wa||!e.Sa)e.wa&&(e=e.wa),a=!1,e.la&&e.la.ka&&(a=e.la.ka.getParameter(2978),a=0===a[0]&&0===a[1]&&a[2]===e.width&&a[3]===e.height),e.width=b,e.height=c,a&&e.la.ka.viewport(0,0,b,c);else return e.ma?(e=w()[e.ma+8>>2],a=a?P(a):"",hb(e,a,b,c),1):-4;return 0}function nb(a,b,c){return E?Y(6,1,a,b,c):mb(a,b,c)}
function ob(a){var b=a.getExtension("ANGLE_instanced_arrays");b&&(a.vertexAttribDivisor=function(c,e){b.vertexAttribDivisorANGLE(c,e)},a.drawArraysInstanced=function(c,e,g,h){b.drawArraysInstancedANGLE(c,e,g,h)},a.drawElementsInstanced=function(c,e,g,h,m){b.drawElementsInstancedANGLE(c,e,g,h,m)})}
function pb(a){var b=a.getExtension("OES_vertex_array_object");b&&(a.createVertexArray=function(){return b.createVertexArrayOES()},a.deleteVertexArray=function(c){b.deleteVertexArrayOES(c)},a.bindVertexArray=function(c){b.bindVertexArrayOES(c)},a.isVertexArray=function(c){return b.isVertexArrayOES(c)})}function qb(a){var b=a.getExtension("WEBGL_draw_buffers");b&&(a.drawBuffers=function(c,e){b.drawBuffersWEBGL(c,e)})}
function rb(a,b){a.ua||(a.ua=a.getContext,a.getContext=function(e,g){g=a.ua(e,g);return"webgl"==e==g instanceof WebGLRenderingContext?g:null});var c=a.getContext("webgl",b);return c?sb(c,b):0}function sb(a,b){var c=ib(8);w()[c+4>>2]=X();var e={Xa:c,attributes:b,version:b.Ha,ka:a};a.canvas&&(a.canvas.la=e);("undefined"==typeof b.va||b.va)&&tb(e);return c}
function tb(a){a||(a=ub);if(!a.Ea){a.Ea=!0;var b=a.ka;ob(b);pb(b);qb(b);b.Ta=b.getExtension("EXT_disjoint_timer_query");b.$a=b.getExtension("WEBGL_multi_draw");(b.getSupportedExtensions()||[]).forEach(function(c){c.includes("lose_context")||c.includes("debug")||b.getExtension(c)})}}var ub,vb=["default","low-power","high-performance"],xb={};
function yb(){if(!zb){var a={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"==typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:z||"./this.program"},b;for(b in xb)void 0===xb[b]?delete a[b]:a[b]=xb[b];var c=[];for(b in a)c.push(b+"="+a[b]);zb=c}return zb}var zb;
function Ab(a,b){if(E)return Y(7,1,a,b);var c=0;yb().forEach(function(e,g){var h=b+c;g=w()[a+4*g>>2]=h;for(h=0;h<e.length;++h)d()[g++>>0]=e.charCodeAt(h);d()[g>>0]=0;c+=e.length+1});return 0}function Bb(a,b){if(E)return Y(8,1,a,b);var c=yb();w()[a>>2]=c.length;var e=0;c.forEach(function(g){e+=g.length+1});w()[b>>2]=e;return 0}function Cb(a){return E?Y(9,1,a):0}function Db(a,b,c,e){if(E)return Y(10,1,a,b,c,e);a=ab.Wa(a);b=ab.Ua(a,b,c);w()[e>>2]=b;return 0}
function Eb(a,b,c,e,g){if(E)return Y(11,1,a,b,c,e,g)}function Fb(a,b,c,e){if(E)return Y(12,1,a,b,c,e);for(var g=0,h=0;h<c;h++){var m=w()[b>>2],v=w()[b+4>>2];b+=8;for(var C=0;C<v;C++){var q=u()[m+C],r=$a[a];0===q||10===q?((1===a?sa:K)(xa(r,0)),r.length=0):r.push(q)}g+=v}w()[e>>2]=g;return 0}function Gb(a){return 0===a%4&&(0!==a%100||0===a%400)}function Hb(a,b){for(var c=0,e=0;e<=b;c+=a[e++]);return c}var Ib=[31,29,31,30,31,30,31,31,30,31,30,31],Jb=[31,28,31,30,31,30,31,31,30,31,30,31];
function Kb(a,b){for(a=new Date(a.getTime());0<b;){var c=a.getMonth(),e=(Gb(a.getFullYear())?Ib:Jb)[c];if(b>e-a.getDate())b-=e-a.getDate()+1,a.setDate(1),11>c?a.setMonth(c+1):(a.setMonth(0),a.setFullYear(a.getFullYear()+1));else{a.setDate(a.getDate()+b);break}}return a}
function Lb(a,b,c,e){function g(f,p,t){for(f="number"==typeof f?f.toString():f||"";f.length<p;)f=t[0]+f;return f}function h(f,p){return g(f,p,"0")}function m(f,p){function t(wb){return 0>wb?-1:0<wb?1:0}var G;0===(G=t(f.getFullYear()-p.getFullYear()))&&0===(G=t(f.getMonth()-p.getMonth()))&&(G=t(f.getDate()-p.getDate()));return G}function v(f){switch(f.getDay()){case 0:return new Date(f.getFullYear()-1,11,29);case 1:return f;case 2:return new Date(f.getFullYear(),0,3);case 3:return new Date(f.getFullYear(),
0,2);case 4:return new Date(f.getFullYear(),0,1);case 5:return new Date(f.getFullYear()-1,11,31);case 6:return new Date(f.getFullYear()-1,11,30)}}function C(f){f=Kb(new Date(f.aa+1900,0,1),f.qa);var p=new Date(f.getFullYear()+1,0,4),t=v(new Date(f.getFullYear(),0,4));p=v(p);return 0>=m(t,f)?0>=m(p,f)?f.getFullYear()+1:f.getFullYear():f.getFullYear()-1}var q=w()[e+40>>2];e={Oa:w()[e>>2],Na:w()[e+4>>2],oa:w()[e+8>>2],ja:w()[e+12>>2],fa:w()[e+16>>2],aa:w()[e+20>>2],pa:w()[e+24>>2],qa:w()[e+28>>2],eb:w()[e+
32>>2],Ma:w()[e+36>>2],Pa:q?P(q):""};c=P(c);q={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S","%Ec":"%c","%EC":"%C","%Ex":"%m/%d/%y","%EX":"%H:%M:%S","%Ey":"%y","%EY":"%Y","%Od":"%d","%Oe":"%e","%OH":"%H","%OI":"%I","%Om":"%m","%OM":"%M","%OS":"%S","%Ou":"%u","%OU":"%U","%OV":"%V","%Ow":"%w","%OW":"%W","%Oy":"%y"};for(var r in q)c=c.replace(new RegExp(r,"g"),q[r]);var O="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
ea="January February March April May June July August September October November December".split(" ");q={"%a":function(f){return O[f.pa].substring(0,3)},"%A":function(f){return O[f.pa]},"%b":function(f){return ea[f.fa].substring(0,3)},"%B":function(f){return ea[f.fa]},"%C":function(f){return h((f.aa+1900)/100|0,2)},"%d":function(f){return h(f.ja,2)},"%e":function(f){return g(f.ja,2," ")},"%g":function(f){return C(f).toString().substring(2)},"%G":function(f){return C(f)},"%H":function(f){return h(f.oa,
2)},"%I":function(f){f=f.oa;0==f?f=12:12<f&&(f-=12);return h(f,2)},"%j":function(f){return h(f.ja+Hb(Gb(f.aa+1900)?Ib:Jb,f.fa-1),3)},"%m":function(f){return h(f.fa+1,2)},"%M":function(f){return h(f.Na,2)},"%n":function(){return"\n"},"%p":function(f){return 0<=f.oa&&12>f.oa?"AM":"PM"},"%S":function(f){return h(f.Oa,2)},"%t":function(){return"\t"},"%u":function(f){return f.pa||7},"%U":function(f){var p=new Date(f.aa+1900,0,1),t=0===p.getDay()?p:Kb(p,7-p.getDay());f=new Date(f.aa+1900,f.fa,f.ja);return 0>
m(t,f)?h(Math.ceil((31-t.getDate()+(Hb(Gb(f.getFullYear())?Ib:Jb,f.getMonth()-1)-31)+f.getDate())/7),2):0===m(t,p)?"01":"00"},"%V":function(f){var p=new Date(f.aa+1901,0,4),t=v(new Date(f.aa+1900,0,4));p=v(p);var G=Kb(new Date(f.aa+1900,0,1),f.qa);return 0>m(G,t)?"53":0>=m(p,G)?"01":h(Math.ceil((t.getFullYear()<f.aa+1900?f.qa+32-t.getDate():f.qa+1-t.getDate())/7),2)},"%w":function(f){return f.pa},"%W":function(f){var p=new Date(f.aa,0,1),t=1===p.getDay()?p:Kb(p,0===p.getDay()?1:7-p.getDay()+1);f=
new Date(f.aa+1900,f.fa,f.ja);return 0>m(t,f)?h(Math.ceil((31-t.getDate()+(Hb(Gb(f.getFullYear())?Ib:Jb,f.getMonth()-1)-31)+f.getDate())/7),2):0===m(t,p)?"01":"00"},"%y":function(f){return(f.aa+1900).toString().substring(2)},"%Y":function(f){return f.aa+1900},"%z":function(f){f=f.Ma;var p=0<=f;f=Math.abs(f)/60;return(p?"+":"-")+String("0000"+(f/60*100+f%60)).slice(-4)},"%Z":function(f){return f.Pa},"%%":function(){return"%"}};c=c.replace(/%%/g,"\x00\x00");for(r in q)c.includes(r)&&(c=c.replace(new RegExp(r,
"g"),q[r](e)));c=c.replace(/\0\0/g,"%");r=Mb(c);if(r.length>b)return 0;Aa(r,a);return r.length-1}y.Da();var Nb=[null,Xa,bb,cb,db,eb,nb,Ab,Bb,Cb,Db,Eb,Fb];function Mb(a){var b=Array(ya(a)+1);Q(a,b,0,b.length);return b}
var Sb={p:function(a,b){Ob(a,b)},l:function(a){Pb(a,!B,1,!la);y.ya()},i:function(a){E?postMessage({cmd:"cleanupThread",thread:a}):Ra(a)},e:function(a,b,c,e){if("undefined"==typeof SharedArrayBuffer)return K("Current environment does not support SharedArrayBuffer, pthreads are not available!"),6;var g=[];if(E&&0===g.length)return Qb(687865856,a,b,c,e);a={La:c,ra:a,ga:e,Qa:g};return E?(a.Ra="spawnThread",postMessage(a,g),0):Va(a)},g:bb,w:cb,v:db,x:eb,C:function(){return 2097152},m:function(a,b){if(a==
b)postMessage({cmd:"processQueuedMainThreadWork"});else if(E)postMessage({targetThread:a,cmd:"processThreadQueue"});else{a=(a=y.ba[a])&&a.worker;if(!a)return;a.postMessage({cmd:"processThreadQueue"})}return 1},b:function(){N("")},y:function(a,b){if(0===a)a=Date.now();else if(1===a||4===a)a=Za();else return w()[Rb()>>2]=28,-1;w()[b>>2]=a/1E3|0;w()[b+4>>2]=a%1E3*1E6|0;return 0},h:function(){D||B||(L||(L={}),L["Blocking on the main thread is very dangerous, see https://emscripten.org/docs/porting/pthreads.html#blocking-on-the-main-browser-thread"]||
(L["Blocking on the main thread is very dangerous, see https://emscripten.org/docs/porting/pthreads.html#blocking-on-the-main-browser-thread"]=1,K("Blocking on the main thread is very dangerous, see https://emscripten.org/docs/porting/pthreads.html#blocking-on-the-main-browser-thread")))},c:Za,B:function(a,b,c){u().copyWithin(a,b,b+c)},q:function(){return D?require("os").cpus().length:navigator.hardwareConcurrency},D:function(a,b,c){gb.length=b;c>>=3;for(var e=0;e<b;e++)gb[e]=da()[c+e];return(0>a?
Na[-a-1]:Nb[a]).apply(null,gb)},A:function(a){var b=u().length;a>>>=0;if(a<=b||2147483648<a)return!1;for(var c=1;4>=c;c*=2){var e=b*(1+.2/c);e=Math.min(e,a+100663296);var g=Math;e=Math.max(a,e);g=g.min.call(g,2147483648,e+(65536-e%65536)%65536);a:{try{k.grow(g-l.byteLength+65535>>>16);n(k.buffer);var h=1;break a}catch(m){}h=void 0}if(h)return!0}return!1},j:function(a,b,c){return lb(a)?mb(a,b,c):nb(a,b,c)},n:function(){throw"unwind";},k:function(a,b){b>>=2;var c=w()[b+6];b={alpha:!!w()[b],depth:!!w()[b+
1],stencil:!!w()[b+2],antialias:!!w()[b+3],premultipliedAlpha:!!w()[b+4],preserveDrawingBuffer:!!w()[b+5],powerPreference:vb[c],failIfMajorPerformanceCaveat:!!w()[b+7],Ha:w()[b+8],Za:w()[b+9],va:w()[b+10],Ba:w()[b+11],ab:w()[b+12],bb:w()[b+13]};a=lb(a);return!a||b.Ba?0:rb(a,b)},s:Ab,t:Bb,d:function(a){Ya(a)},f:Cb,u:Db,o:Eb,z:Fb,a:k||x.wasmMemory,r:function(a,b,c,e){return Lb(a,b,c,e)}};
(function(){function a(g,h){x.asm=g.exports;y.na.push(x.asm.J);Ca=x.asm.X;Ea.unshift(x.asm.E);ta=h;E||(S--,x.monitorRunDependencies&&x.monitorRunDependencies(S),0==S&&(null!==Ja&&(clearInterval(Ja),Ja=null),T&&(g=T,T=null,g())))}function b(g){a(g.instance,g.module)}function c(g){return Ma().then(function(h){return WebAssembly.instantiate(h,e)}).then(function(h){return h}).then(g,function(h){K("failed to asynchronously prepare wasm: "+h);N(h)})}var e={a:Sb};E||(S++,x.monitorRunDependencies&&x.monitorRunDependencies(S));
if(x.instantiateWasm)try{return x.instantiateWasm(e,a)}catch(g){return K("Module.instantiateWasm callback failed with error: "+g),!1}(function(){return M||"function"!=typeof WebAssembly.instantiateStreaming||Ka()||"function"!=typeof fetch?c(b):fetch(U,{credentials:"same-origin"}).then(function(g){return WebAssembly.instantiateStreaming(g,e).then(b,function(h){K("wasm streaming compile failed: "+h);K("falling back to ArrayBuffer instantiation");return c(b)})})})().catch(ia);return{}})();
x.___wasm_call_ctors=function(){return(x.___wasm_call_ctors=x.asm.E).apply(null,arguments)};var Ob=x._main=function(){return(Ob=x._main=x.asm.F).apply(null,arguments)};x._command=function(){return(x._command=x.asm.G).apply(null,arguments)};x._isReady=function(){return(x._isReady=x.asm.H).apply(null,arguments)};x._free=function(){return(x._free=x.asm.I).apply(null,arguments)};x._emscripten_tls_init=function(){return(x._emscripten_tls_init=x.asm.J).apply(null,arguments)};
var Rb=x.___errno_location=function(){return(Rb=x.___errno_location=x.asm.K).apply(null,arguments)};x.__emscripten_thread_crashed=function(){return(x.__emscripten_thread_crashed=x.asm.L).apply(null,arguments)};x._emscripten_proxy_main=function(){return(x._emscripten_proxy_main=x.asm.M).apply(null,arguments)};var Pb=x.__emscripten_thread_init=function(){return(Pb=x.__emscripten_thread_init=x.asm.N).apply(null,arguments)};
x._emscripten_current_thread_process_queued_calls=function(){return(x._emscripten_current_thread_process_queued_calls=x.asm.O).apply(null,arguments)};
var Qb=x._emscripten_sync_run_in_main_thread_4=function(){return(Qb=x._emscripten_sync_run_in_main_thread_4=x.asm.P).apply(null,arguments)},Ua=x._emscripten_main_thread_process_queued_calls=function(){return(Ua=x._emscripten_main_thread_process_queued_calls=x.asm.Q).apply(null,arguments)},fb=x._emscripten_run_in_main_runtime_thread_js=function(){return(fb=x._emscripten_run_in_main_runtime_thread_js=x.asm.R).apply(null,arguments)},jb=x._emscripten_dispatch_to_thread_=function(){return(jb=x._emscripten_dispatch_to_thread_=
x.asm.S).apply(null,arguments)},Sa=x.__emscripten_thread_free_data=function(){return(Sa=x.__emscripten_thread_free_data=x.asm.T).apply(null,arguments)};x.__emscripten_thread_exit=function(){return(x.__emscripten_thread_exit=x.asm.U).apply(null,arguments)};
var X=x._pthread_self=function(){return(X=x._pthread_self=x.asm.V).apply(null,arguments)},ib=x._malloc=function(){return(ib=x._malloc=x.asm.W).apply(null,arguments)},Wa=x._emscripten_stack_set_limits=function(){return(Wa=x._emscripten_stack_set_limits=x.asm.Y).apply(null,arguments)},Qa=x.stackSave=function(){return(Qa=x.stackSave=x.asm.Z).apply(null,arguments)},W=x.stackRestore=function(){return(W=x.stackRestore=x.asm._).apply(null,arguments)},R=x.stackAlloc=function(){return(R=x.stackAlloc=x.asm.$).apply(null,
arguments)},Ta=x.__emscripten_allow_main_runtime_queued_calls=6654832;x.ccall=function(a,b,c,e){var g={string:function(q){var r=0;if(null!==q&&void 0!==q&&0!==q){var O=(q.length<<2)+1,ea=r=R(O);Q(q,u(),ea,O)}return r},array:function(q){var r=R(q.length);Aa(q,r);return r}};a=x["_"+a];var h=[],m=0;if(e)for(var v=0;v<e.length;v++){var C=g[c[v]];C?(0===m&&(m=Qa()),h[v]=C(e[v])):h[v]=e[v]}c=a.apply(null,h);return c=function(q){0!==m&&W(m);return"string"===b?P(q):"boolean"===b?!!q:q}(c)};
x.keepRuntimeAlive=J;x.PThread=y;x.PThread=y;x.wasmMemory=k;x.ExitStatus=I;var Tb;function I(a){this.name="ExitStatus";this.message="Program terminated with exit("+a+")";this.status=a}T=function Ub(){Tb||Vb();Tb||(T=Ub)};
function Vb(a){function b(){if(!Tb&&(Tb=!0,x.calledRun=!0,!ua)){E||V(Ea);E||V(Fa);ha(x);if(x.onRuntimeInitialized)x.onRuntimeInitialized();if(Wb){var c=a,e=x._emscripten_proxy_main;c=c||[];var g=c.length+1,h=R(4*(g+1));w()[h>>2]=za(z);for(var m=1;m<g;m++)w()[(h>>2)+m]=za(c[m-1]);w()[(h>>2)+g]=0;e(g,h)}if(!E){if(x.postRun)for("function"==typeof x.postRun&&(x.postRun=[x.postRun]);x.postRun.length;)c=x.postRun.shift(),Ga.unshift(c);V(Ga)}}}a=a||ka;if(!(0<S))if(E)ha(x),E||V(Ea),postMessage({cmd:"loaded"});
else{if(x.preRun)for("function"==typeof x.preRun&&(x.preRun=[x.preRun]);x.preRun.length;)Ia();V(Da);0<S||(x.setStatus?(x.setStatus("Running..."),setTimeout(function(){setTimeout(function(){x.setStatus("")},1);b()},1)):b())}}x.run=Vb;function Ya(a){if(E)throw Xa(a),"unwind";J()||E||y.sa();if(!J()){y.sa();if(x.onExit)x.onExit(a);ua=!0}A(a,new I(a))}if(x.preInit)for("function"==typeof x.preInit&&(x.preInit=[x.preInit]);0<x.preInit.length;)x.preInit.pop()();var Wb=!0;x.noInitialRun&&(Wb=!1);Vb();


  return Stockfish.ready
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = Stockfish;
else if (typeof define === 'function' && define['amd'])
  define([], function() { return Stockfish; });
else if (typeof exports === 'object')
  exports["Stockfish"] = Stockfish;
return Stockfish;
}

if (typeof self !== "undefined" && self.location.hash.split(",")[1] === "worker" || typeof global !== "undefined" && Object.prototype.toString.call(global.process) === "[object process]" && !require("worker_threads").isMainThread) {
    (function() {
        "use strict";var Module={};var ENVIRONMENT_IS_NODE=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string";if(ENVIRONMENT_IS_NODE){var nodeWorkerThreads=require("worker_threads");var parentPort=nodeWorkerThreads.parentPort;parentPort.on("message",function(data){onmessage({data:data})});var fs=require("fs");Object.assign(global,{self:global,require:require,Module:Module,location:{href:__filename},Worker:nodeWorkerThreads.Worker,importScripts:function(f){(0,eval)(fs.readFileSync(f,"utf8"))},postMessage:function(msg){parentPort.postMessage(msg)},performance:global.performance||{now:function(){return Date.now()}}})}function threadPrintErr(){var text=Array.prototype.slice.call(arguments).join(" ");if(ENVIRONMENT_IS_NODE){fs.writeSync(2,text+"\n");return}console.error(text)}function threadAlert(){var text=Array.prototype.slice.call(arguments).join(" ");postMessage({cmd:"alert",text:text,threadId:Module["_pthread_self"]()})}var err=threadPrintErr;self.alert=threadAlert;Module["instantiateWasm"]=((info,receiveInstance)=>{var instance=new WebAssembly.Instance(Module["wasmModule"],info);receiveInstance(instance);Module["wasmModule"]=null;return instance.exports});self.onmessage=(e=>{try{if(e.data.cmd==="load"){Module["wasmModule"]=e.data.wasmModule;Module["wasmMemory"]=e.data.wasmMemory;Module["buffer"]=Module["wasmMemory"].buffer;Module["ENVIRONMENT_IS_PTHREAD"]=true;if(typeof e.data.urlOrBlob=="string"){importScripts(e.data.urlOrBlob)}else{var objectUrl=URL.createObjectURL(e.data.urlOrBlob);importScripts(objectUrl);URL.revokeObjectURL(objectUrl)}Stockfish(Module).then(function(instance){Module=instance})}else if(e.data.cmd==="run"){Module["__performance_now_clock_drift"]=performance.now()-e.data.time;Module["__emscripten_thread_init"](e.data.threadInfoStruct,/*isMainBrowserThread=*/0,/*isMainRuntimeThread=*/0,/*canBlock=*/1);Module["establishStackSpace"]();Module["PThread"].receiveObjectTransfer(e.data);Module["PThread"].threadInit();try{var result=Module["invokeEntryPoint"](e.data.start_routine,e.data.arg);if(Module["keepRuntimeAlive"]()){Module["PThread"].setExitStatus(result)}else{Module["__emscripten_thread_exit"](result)}}catch(ex){if(ex!="unwind"){if(ex instanceof Module["ExitStatus"]){if(Module["keepRuntimeAlive"]()){}else{Module["__emscripten_thread_exit"](ex.status)}}else{throw ex}}}}else if(e.data.cmd==="cancel"){if(Module["_pthread_self"]()){Module["__emscripten_thread_exit"](-1)}}else if(e.data.target==="setimmediate"){}else if(e.data.cmd==="processThreadQueue"){if(Module["_pthread_self"]()){Module["_emscripten_current_thread_process_queued_calls"]()}}else if(e.data.cmd==="processProxyingQueue"){if(Module["_pthread_self"]()){Module["_emscripten_proxy_execute_queue"](e.data.queue)}}else{err("worker.js received unknown command "+e.data.cmd);err(e.data)}}catch(ex){err("worker.js onmessage() captured an uncaught exception: "+ex);if(ex&&ex.stack)err(ex.stack);if(Module["__emscripten_thread_crashed"]){Module["__emscripten_thread_crashed"]()}throw ex}});
self._origOnmessage = self.onmessage;
self.onmessage = function (e)
{
    if (e.data.cmd === "load") {
        // Preload command that is called once per worker to parse and load the Emscripten code.
        // Module and memory were sent from main thread
        Module["wasmModule"] = e.data.wasmModule;
        Module["wasmMemory"] = e.data.wasmMemory;
        Module["buffer"] = Module["wasmMemory"].buffer;
        Module["ENVIRONMENT_IS_PTHREAD"] = true;
        if (e.data.workerID) {
            Module['workerID'] = e.data.workerID;
        }
        if (e.data.wasmSourceMap) {
            Module['wasmSourceMapData'] = e.data.wasmSourceMap;
        }
        if (e.data.wasmOffsetConverter) {
            Module['wasmOffsetData'] = e.data.wasmOffsetConverter;
        }
        Stockfish = INIT_ENGINE();
        Stockfish(Module).then(function (instance)
        {
            Module = instance;
        });
    } else {
        self._origOnmessage(e);
    }
};

    })();
/// Is it a web worker?
} else if (typeof onmessage !== "undefined" && (typeof window === "undefined" || typeof window.document === "undefined") || typeof global !== "undefined" && Object.prototype.toString.call(global.process) === "[object process]") {
    (function ()
    {
        var isNode = typeof global !== "undefined" && Object.prototype.toString.call(global.process) === "[object process]";
        var engine = {};
        var queue = [];
        var wasmPath;
        
        function completer(line)
        {
            var completions = [
                "compiler",
                "d",
                "eval",
                "exit",
                "flip",
                "go ",
                "isready ",
                "ponderhit ",
                "position fen ",
                "position startpos",
                "position startpos moves",
                "quit",
                "setoption name Clear Hash value true",
                "setoption name Contempt value ",
                "setoption name Hash value ",
                "setoption name Minimum Thinking Time value ",
                "setoption name Move Overhead value ",
                "setoption name MultiPV value ",
                "setoption name Ponder value ",
                "setoption name Skill Level value ",
                "setoption name Slow Mover value ",
                "setoption name Threads value ",
                "setoption name UCI_Chess960 value false",
                "setoption name UCI_Chess960 value true",
                "setoption name UCI_LimitStrength value true",
                "setoption name UCI_LimitStrength value false",
                "setoption name UCI_Elo value ",
                "setoption name UCI_ShowWDL value true",
                "setoption name UCI_ShowWDL value false",
                "setoption name nodestime value ",
                "stop",
                "uci",
                "ucinewgame"
            ];
            var completionsMid = [
                "binc ",
                "btime ",
                "confidence ",
                "depth ",
                "infinite ",
                "mate ",
                "maxdepth ",
                "maxtime ",
                "mindepth ",
                "mintime ",
                "moves ", /// for position fen ... moves
                "movestogo ",
                "movetime ",
                "ponder ",
                "searchmoves ",
                "shallow ",
                "winc ",
                "wtime "
            ];
            
            function filter(c)
            {
                return c.indexOf(line) === 0;
            }
            
            /// This looks for completions starting at the very beginning of the line.
            /// If the user has typed nothing, it will match everything.
            var hits = completions.filter(filter);
            
            if (!hits.length) {
                /// Just get the last word.
                line = line.replace(/^.*\s/, "");
                if (line) {
                    /// Find completion mid line too.
                    hits = completionsMid.filter(filter);
                } else {
                    /// If no word has been typed, show all options.
                    hits = completionsMid;
                }
            }
            
            return [hits, line];
        }
        
        if (isNode) {
            ///NOTE: Node.js v14-19 needs --experimental-wasm-threads --experimental-wasm-simd
            /// Was it called directly?
            if (require.main === module) {
                (function ()
                {
                    var p = require("path");
                    
                    function assembleWASM(count)
                    {
                        var fs = require("fs");
                        var ext = p.extname(wasmPath);
                        var basename = wasmPath.slice(0, -ext.length);
                        var i;
                        var buffers = [];
                        
                        for (i = 0; i < count; ++i) {
                            buffers.push(fs.readFileSync(basename + "-part-" + i + ".wasm"));
                        }
                        
                        return Buffer.concat(buffers);
                    }
                    wasmPath = p.join(__dirname, p.basename(__filename, p.extname(__filename)) + ".wasm");
                    engine = {
                        locateFile: function (path)
                        {
                            if (path.indexOf(".wasm") > -1) {
                                if (path.indexOf(".wasm.map") > -1) {
                                    /// Set the path to the wasm map.
                                    return wasmPath + ".map"
                                }
                                /// Set the path to the wasm binary.
                                return wasmPath;
                            }
                            /// Set path to worker
                            
                            return __filename;
                        },
                        listener: function onMessage(line)
                        {
                            process.stdout.write(line + "\n");
                        },
                    };
                    
                    if (typeof enginePartsCount === "number") {
                        /// Prepare the wasm data because it is in parts.
                        engine.wasmBinary = assembleWASM(enginePartsCount);
                    }
                }());
                
                Stockfish = INIT_ENGINE();
                Stockfish(engine).then(function checkIfReady()
                {
                    if (engine._isReady) {
                        if (!engine._isReady()) {
                            return setTimeout(checkIfReady, 10);
                        }
                        delete engine._isReady;
                    }
                    engine.sendCommand = function (cmd)
                    {
                        ///NOTE: The single-threaded engine needs to specifiy async for "go" commands to prevent memory leaks and other errors.
                        engine.ccall("command", null, ["string"], [cmd], {async: typeof IS_ASYNCIFY !== "undefined" && /^go\b/.test(cmd)});
                    };
                    
                    queue.forEach(engine.sendCommand);
                    queue = null;
                });
                
                require("readline").createInterface({
                    input: process.stdin,
                    output: process.stdout,
                    completer: completer,
                    historySize: 100,
                }).on("line", function online(cmd)
                {
                    if (cmd) {
                        if (engine.sendCommand) {
                            engine.sendCommand(cmd);
                        } else {
                            queue.push(cmd);
                        }
                        if (cmd === "quit" || cmd === "exit") {
                            process.exit();
                        }
                    }
                }).on("close", function onend()
                {
                    process.exit();
                }).setPrompt("");
                
            /// Is this a node module?
            } else {
                module.exports = INIT_ENGINE;
            }
        } else {
            (function ()
            {
                var wasmBlob;
                
                function loadBinary(onLoaded)
                {
                    function fetchBinary(path, cb)
                    {
                        fetch(new Request(path)).then(function (response)
                        {
                            return response.blob();
                        }).then(function (wasmData)
                        {
                            cb(wasmData);
                        });
                    }
                    function loadParts(total)
                    {
                        var doneCount = 0;
                        var i;
                        var parts = [];
                        var ext = wasmPath.slice((wasmPath.lastIndexOf(".") - 1 >>> 0) + 1);
                        var basename = wasmPath.slice(0, -ext.length);
                        
                        function createOnDownload(num)
                        {
                            return function onDownload(data)
                            {
                                var wasmBlob;
                                ++doneCount;
                                parts[num] = data;
                                if (doneCount === total) {
                                    wasmBlob = URL.createObjectURL(new Blob(parts));
                                    onLoaded(wasmBlob);
                                }
                            };
                        }
                        for (i = 0; i < total; ++i) {
                            fetchBinary(basename + "-part-" + i + ext, createOnDownload(i));
                        }
                    }
                    if (typeof enginePartsCount === "number") {
                        loadParts(enginePartsCount);
                    } else {
                        onLoaded();
                    }
                }
                
                var args = self.location.hash.substr(1).split(",");
                wasmPath = decodeURIComponent(args[0] || location.origin + location.pathname.replace(/\.js$/i, ".wasm"));
                
                loadBinary(function (wasmBlob)
                {
                    engine = {
                        locateFile: function (path)
                        {
                            if (path.indexOf(".wasm") > -1) {
                                if (path.indexOf(".wasm.map") > -1) {
                                    /// Set the path to the wasm map.
                                    return wasmPath + ".map"
                                }
                                /// Set the path to the wasm binary.
                                return wasmBlob || wasmPath;
                            }
                            /// Set path to worker (self + the worker hash)
                            return self.location.origin + self.location.pathname + "#" + wasmPath + ",worker";
                        },
                        listener: function onMessage(line)
                        {
                            postMessage(line);
                        },
                    }
                    Stockfish = INIT_ENGINE();
                
                    Stockfish(engine).then(function checkIfReady()
                    {
                        if (engine._isReady) {
                            if (!engine._isReady()) {
                                return setTimeout(checkIfReady, 10);
                            }
                            delete engine._isReady;
                        }
                        
                        engine.sendCommand = function (cmd)
                        {
                            ///NOTE: The single-threaded engine needs to specifiy async for "go" commands to prevent memory leaks and other errors.
                            engine.ccall("command", null, ["string"], [cmd], {async: typeof IS_ASYNCIFY !== "undefined" && /^go\b/.test(cmd)});
                            ///NOTE: The engine must be fully initialized before we can close the Pthreads. so we have to check this here, not in onmessage.
                            if (cmd === "quit" || cmd === "exit") {
                                /// Close the Pthreads.
                                try {
                                    engine.terminate();
                                } catch (e) {}
                            }
                        };
                        queue.forEach(engine.sendCommand);
                        queue = null;
                    }).catch(function (e)
                    {
                        /// Sadly, Web Workers will not trigger the error event when errors occur in promises, so we need to create a new context and throw an error there.
                        setTimeout(function throwError()
                        {
                            throw e;
                        }, 1);
                    });
                });
                
                /// Make sure that this is only added once.
                if (!onmessage) {
                    onmessage = function (event)
                    {
                        if (engine.sendCommand) {
                            engine.sendCommand(event.data);
                        } else {
                            queue.push(event.data);
                        }
                        ///NOTE: We check this here, not just in engine.sendCommand, because the engine might never finish loading.
                        if (event.data === "quit" || event.data === "exit") {
                            /// Exit the Web Worker.
                            try {
                                self.close();
                            } catch (e) {}
                        }
                    };
                }
            }());
        }
    }());
} else {
    ///NOTE: If it's a normal browser, the client can use the engine without polluting the global scope.
    if (typeof document === "object" && document.currentScript) {
        document.currentScript._exports = INIT_ENGINE();
    } else {
        Stockfish = INIT_ENGINE();
    }
}
}());
