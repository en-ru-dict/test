 //long name google script global
 var g_ss='https://script.google.com/macros/s/AKfycbwFVX2pfU4UjERwyVYg6iz452sg_iwK4o_knvzZg9-PwSwbpr3cw0aNbSMvJGQvqQ4a/exec';
  //g_ss='test.js';
 var g_name='mem';//global
 var g_page='';//global
 var g_word=0;//global
 var g_num_vu=[];//номера карт-строк в списке юзера
 if(window['g_api']!=undefined)alert('g_api in use!');g_api='error';//global
//list=name+page
function log(s){console.log(s+'');}
function len(d){ return d.length;}
function run_js(vPathScript,fun1){var sc;
  sc=document.createElement('script');sc.async=true;
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
function ok_load_A(){var i,ms,n=0,s;
    if(g_page==''){put_v('id_text1',g_api);return;}
    ms=g_api.split('\n');
    vu.$data.todos.length=0;//write to vue
    for(i=0;i<len(ms);i++){
      n=i+1; s=ms[i];//номер строки=карты перед словом
      if(s)vu.$data.todos.push({text:n+'| '+s});
    }
    log('ok_load_A '+g_name+g_page+' vu='+len(ms));
}
function load_A(num_page){
 if(num_page){g_page=num_page+'';}
 run_js(g_ss+'?name='+g_name+g_page+'&adr=00',ok_load_A);
}
function load_vu_from_Loc(n){var i=0,ms,s='';
 if(n)g_page=n*1;//smena tek stranicy
 if(!g_page)g_page=1;
 put_h('id_list0',g_name+g_page);
 if(!isLocalStorageAvailable())return;
 vu.$data.todos.length=0;
 s=localStorage.getItem(g_name+g_page);
 if(s){ ms=s.split('\n'); for(i=0;i<len(ms);i++){if(ms[i]) vu.$data.todos.push({text:ms[i]});}}
 else vu.$data.todos.push({text:'пустой список'})
}
function save_vu_to_Loc(){ var i=0,s='';
 if(!isLocalStorageAvailable()){alert('нету localStorage?');return;}
 s='';for(i=0;i<len(vu.$data.todos);i++) s+= vu.$data.todos[i].text+'\n';
 try {localStorage.setItem(g_name+g_page,s);}
 catch(e) { if (e == QUOTA_EXCEEDED_ERR) alert('limit localStorage1');}
}
function save_s_to_Loc(name_el,s){
 try {localStorage.setItem(name_el,s);}
 catch(e) { if (e == QUOTA_EXCEEDED_ERR) alert('limit localStorage2');}
}
function load_s_from_Loc(name_el){
    var v=localStorage.getItem(name_el);
    if(v) return v;
    else return '';
}
function del_Loc(){localStorage.clear();alert('localStorage очищено');}
function del_LocElem(e){localStorage.removeItem(e+'');} //если нету то пофиг
function isLocalStorageAvailable() {
   try {return 'localStorage' in window && window['localStorage'] !== null;}
   catch(e) { return false;}
}

function put_v(id,s){var d=document.getElementById(id);if(d)d.value=s+'';}
function put_h(id,s){var d=document.getElementById(id);if(d)d.innerHTML=s+'';}
function put_src(id,s){var d=document.getElementById(id);if(s==undefined)s='';if(d)d.src=s+'';}

function but_enable(id_but,n){var d,v;//1-0
    d=document.getElementById(id_but);
    if(d){
     if(n)d.disabled=false;
     else d.disabled=true;
    }
}
function zvez_v_kurs(s){var i=0,ms,s0=s+'',v=''; // *слово  <i>слово</i>
    ms=s0.split(' ');
    for(i=0;i<len(ms);i++)if(ms[i].substring(0,1)=='*')ms[i]='<i>'+ms[i].substring(1)+'</i>';
    return ms.join(' ');
}
function get_num_cards_in_Loc(tek_list){var i=0,s='',d,r=','; //,1,7,9,
    for(i=0;i<localStorage.length;i++){
     s=localStorage.key(i)+'';
     d=s.split('_'); if(len(d)>1)if(d[0]==tek_list)r+=d[1]+',';
    }
    return r;
};

function next_word(){var le=0,s='',d,n=0;
    le=len(g_num_vu);
    if(le==0)return 0;
    if(g_word<(le-1))g_word++; //0...le-1
    show_card();
    return;
}
function prev_word(){var le=0,s='',d,n=0;
    le=len(g_num_vu);
    if(le==0)return 0;
    if(g_word>0)g_word--; //0...le-1
    show_card();
    return ;
}
function start_card(){var s='',le=0,i=0,d; //home
 //disable_buttons
 but_enable(id="id_but1",0);but_enable(id="id_but2",0);but_enable(id="id_but3",0);
 if(g_page==''){alert('не выбран список');return;}
 g_num_vu=[]; put_h('id_list',g_name+g_page);
 for(i=0;i<len(vu.$data.todos);i++){
   s=vu.$data.todos[i].text+'';
   d=s.split('|'); if(len(d)>1)g_num_vu.push(d[0]+'');
 }
 le=len(g_num_vu);g_word=0; if(le==0){return;}
 //удалить карты в локал сторе которые не в юзер списке
 s=get_num_cards_in_Loc(g_name+g_page);
 for(i=0;i<le;i++){s=s.replace(','+g_num_vu[i]+',',',');}
 log('cards надо удалить='+s);//остались которые надо удалить
 d=s.split(','); for(i=0;i<len(d);i++){del_LocElem(g_name+g_page+'_'+d[i]);}
 if(le>10)le=10; //грузим первые десять, а потом все сразу фоном пока эти учат
 s=get_num_cards_in_Loc(g_name+g_page);
 d=[];for(i=0;i<le;i++)if(s.indexOf(','+g_num_vu[i]+',')<0)d.push(g_num_vu[i]);//если нету в локал
 s=d.join(',');
 log('num10='+s);
 if(s)run_js(g_ss+'?name='+g_name+g_page+'&adr='+s,ok_str);
 else {g_api='';ok_str();}
}
function ok_str(){var i,mm,ms,s='',d;//10 card
 mm=g_api.split('\n');
 for(i=0;i<len(mm);i++){
  s=mm[i]+''; d=s.split('|'); if(len(d)>1){ save_s_to_Loc(g_name+g_page+'_'+d[0],s);}
 }
 g_word=0;show_card();
 but_enable(id="id_but1",1);but_enable(id="id_but2",1);but_enable(id="id_but3",1);
 setTimeout(load_all_cards,1);
}
function load_all_cards(){var s='',le=0;
 if(g_page==''){alert('не выбран список');return;}
 le=len(g_num_vu);
 if(le==0){alert('пустой список');return;}
 s=get_num_cards_in_Loc(g_name+g_page);
 d=[];for(i=0;i<le;i++)if(s.indexOf(','+g_num_vu[i]+',')<0)d.push(g_num_vu[i]);//если нету в локал
 s=d.join(',');
 log('загружаем все карточки..'+len(d));
 if(s)run_js(g_ss+'?name='+g_name+g_page+'&adr='+s,ok_load_all_cards);
}
function ok_load_all_cards(){var i,mm,ms,s='',d;//500 card max
 mm=g_api.split('\n');log('все карточки загружены='+len(mm));
 for(i=0;i<len(mm);i++){
  s=mm[i]+''; d=s.split('|'); if(len(d)>1){ save_s_to_Loc(g_name+g_page+'_'+d[0],s);}
 }
 log('все карточки записаны в локал');
}

function show_card(){var s,v='0|netu|1|2||4|5|6|7|';
 if(len(g_num_vu)>0){
    s=load_s_from_Loc(g_name+g_page+'_'+g_num_vu[g_word]);if(s==null)s=v;if(s=='undefined')s=v;
    put_h('id_word',g_num_vu[g_word]);
 }
 put_h("id_tek_word",vu.$data.todos[g_word].text+'');
 ms=s.split('|');
 put_h('id_p0',ms[0]+') '+ms[1]); //num+word+perevod
 put_h('id_p1',ms[2]);
 put_h('id_p2',zvez_v_kurs(ms[3]));
 put_src('id_p3',ms[4]);
 put_h('id_p4','доп.перевод: '+ms[5]);
 put_h('id_p5','доп.ассоц: '+ms[6]);
 put_h('id_p6','примеры: '+ms[7]);
 
}


