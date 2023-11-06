 //long name google script global
 var g_ss='https://script.google.com/macros/s/AKfycbxK-RRzIuK_jDiHqChJosqBSgIjE9BwAMneDMIw_HiRBGNWDYdPNW_273eOISmpciZq/exec';
 var g_name='mem';//global
 var g_page='';//global
 var g_word=0;//global
 if(window['g_api']!=undefined)alert('g_api in use!');g_api='error';//global

function run_js(vPathScript,fun1){var sc;
  sc=document.createElement('script');
 sc.src=''+vPathScript; document.head.appendChild(sc);
 sc.onerror=function(){console.log('no file='+vPathScript+': error in run_js');}
 sc.onload=function(){
  if(!this.executed){
   this.executed=true;
   if(fun1)setTimeout(fun1,0);
  }
 }
 sc.onreadystatechange=function(){var self=this;
  if(this.readyState == "complete" || this.readyState == "loaded"){
   setTimeout(function(){self.onload()}, 0);
  }
 }
}
function load_A(){
 run_js(g_ss+'?name='+g_name+g_page+'&adr=00',ok_js);
}
function load_page(n){
    g_page=n; load_A();
 }
function ok_js(){var i,ms,n=0,s;
    if(g_page==''){put_v('id_text1',g_api);return;}
    ms=g_api.split('\n');ms.shift();
    vu.$data.todos.length=0;//write to vue
    for(i=0;i<ms.length;i++){
      n=i+1; s=ms[i];
      if(s)vu.$data.todos.push({text:n+'| '+s});}
}
function loadLoc(n){var i,ms,s,d;
    g_page=n;//smena tek stranicy
    put_h('id_tek_page',g_name+g_page);
 if(!isLocalStorageAvailable())return;
 vu.$data.todos.length=0;
 s=localStorage.getItem(g_name+g_page);
 if(s){ ms=s.split('\n'); for(i=0;i<ms.length;i++){if(ms[i]) vu.$data.todos.push({text:ms[i]}); } }
}

function saveLoc(){ var i,s;
if(!isLocalStorageAvailable())return;
 //localStorage.clear();
 s='';for(i=0;i< vu.$data.todos.length;i++) s+= vu.$data.todos[i].text+'\n';
 try {localStorage.setItem(g_name+g_page,s);}
 catch(e) { if (e == QUOTA_EXCEEDED_ERR) alert('limit local store');}
}

function isLocalStorageAvailable() {
   try {return 'localStorage' in window && window['localStorage'] !== null;}
   catch(e) { return false;}
}

function put_v(id,s){var d=document.getElementById(id);if(d)d.value=s+'';}
function put_h(id,s){var d=document.getElementById(id);if(d)d.innerHTML=s+'';}
function put_src(id,s){var d=document.getElementById(id);if(d)d.src=s+'';}
function len(d){ return d.length;}
function next_num_word(){var le=0,s='',d,n=0;
    le=vu.$data.todos.length;
    if(le==0)return 0;
    g_word++; if(g_word==le)g_word=0; //0...n
    s=vu.$data.todos[g_word].text+'';
    put_h('id_tek_word',s);
    d=s.split('|'); if(len(d)>1)n=d[0];
    put_h('id_word',n);
    return n;
}
function start_card(){
    g_word=-1; n=next_num_word()
 put_h('id_page',g_name+g_page);
 if(n>0)load_card(n);
}
function ok_str(){//заполняем карточку
 var ms=g_api.split('|');	
 put_h('id_p0',ms[0]);
 put_h('id_p1',ms[1]);
 put_h('id_p2',zv_to_kr(ms[2]));
 put_src('id_p3',ms[3]);
 put_h('id_p4','доп.перевод: '+ms[4]);
 put_h('id_p5','доп.ассоц: '+ms[5]);
 put_h('id_p6','примеры: '+ms[6]);
}
function load_card(n){
 //загружаем строку тек страницы
 run_js(g_ss+'?name='+g_name+g_page+'&adr='+n,ok_str);
}

function zv_to_kr(s){var i=0,ms,s0=s+'',v='';
 	ms=s0.split(' ');
 	for(i=0;i<len(ms);i++)if(ms[i].substring(0,1)=='*')ms[i]='<i>'+ms[i].substring(1)+'</i>';
 	return ms.join(' ');
}
