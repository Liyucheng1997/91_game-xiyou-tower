(() => {
  'use strict';

  const SIZE = 11;
  const TOTAL_FLOORS = 81;
  const SAVE_KEY = 'journey-tower-save-v2';
  const chapters = [
    { name:'双叉岭', floors:'1—9', color:'#6d7d50', trials:['寅将军之劫','山野夜行','熊山君伏道','特处士拦关','双叉迷雾','荒祠妖火','猛虎巡山','岭上残月','寅将军决战'] },
    { name:'黑风山', floors:'10—18', color:'#466a5c', trials:['观音禅院','锦斓袈裟','禅房烈火','黑风小径','熊罴守关','苍狼来袭','白花蛇阵','黑风洞府','黑熊精决战'] },
    { name:'黄风岭', floors:'19—27', color:'#8a6c35', trials:['八百里黄风','虎先锋','风沙迷阵','定风珠影','山神指路','飞砂走石','黄风洞口','三昧神风','黄风怪决战'] },
    { name:'流沙河', floors:'28—36', color:'#2f6f82', trials:['弱水三千','流沙渡口','红葫芦','九骷髅阵','水府暗流','卷帘旧将','渡河之策','水浪滔天','沙悟净试炼'] },
    { name:'火云洞', floors:'37—45', color:'#9b3c2e', trials:['枯松涧','号山迷路','圣婴伏兵','三昧真火','假观音','火云洞门','五行战车','善财童子','红孩儿决战'] },
    { name:'女儿国', floors:'46—54', color:'#88506d', trials:['西梁国界','子母河水','迎阳驿','女王邀约','蝎子精影','琵琶洞府','倒马毒桩','情关难破','蝎子精决战'] },
    { name:'狮驼岭', floors:'55—63', color:'#5d4e41', trials:['八百里尸山','小钻风巡山','阴阳二气瓶','青狮张口','白象卷鼻','大鹏展翅','狮驼洞府','三魔会阵','金翅大鹏决战'] },
    { name:'盘丝洞', floors:'64—72', color:'#684568', trials:['蛛丝小径','濯垢泉影','七情蛛阵','黄花观','百眼魔君','金光毒阵','毗蓝婆指路','千丝万缕','蜈蚣精决战'] },
    { name:'灵山', floors:'73—81', color:'#8b6931', trials:['凌云渡','无底船','接引佛光','雷音寺门','五方揭谛','八部天龙','无字真经','最后心劫','如来佛祖'] }
  ];

  const enemyBook = [
    {id:'wolf',sprite:'wolf',name:'苍狼妖',icon:'狼',hp:45,atk:18,def:4,coin:3,color:'#7e8a93'},
    {id:'tiger',sprite:'tiger',name:'虎先锋',icon:'虎',hp:90,atk:28,def:8,coin:6,color:'#d08a35'},
    {id:'bear',sprite:'bear',name:'熊罴怪',icon:'熊',hp:160,atk:42,def:14,coin:10,color:'#80634c'},
    {id:'snake',sprite:'snake',name:'白花蛇精',icon:'蛇',hp:240,atk:57,def:20,coin:14,color:'#79a96e'},
    {id:'wind',sprite:'wind',name:'黄风妖将',icon:'风',hp:360,atk:78,def:29,coin:18,color:'#c49a45'},
    {id:'water',sprite:'water',name:'流沙水怪',icon:'水',hp:520,atk:104,def:42,coin:23,color:'#438ca2'},
    {id:'fire',sprite:'fire',name:'火云妖童',icon:'火',hp:740,atk:138,def:57,coin:29,color:'#d25838'},
    {id:'scorpion',sprite:'scorpion',name:'琵琶蝎精',icon:'蝎',hp:1050,atk:180,def:75,coin:36,color:'#9e4c82'},
    {id:'lion',sprite:'lion',name:'狮驼妖王',icon:'狮',hp:1450,atk:230,def:98,coin:45,color:'#bd7e42'},
    {id:'spider',sprite:'spider',name:'盘丝蛛精',icon:'蛛',hp:1950,atk:292,def:125,coin:56,color:'#965b9f'},
    {id:'dragon',sprite:'dragon',name:'八部天龙',icon:'龙',hp:2600,atk:368,def:158,coin:70,color:'#6ab7b2'}
  ];

  const bosses = [
    {sprite:'yin',name:'寅将军',icon:'寅',hp:380,atk:55,def:18,coin:35,color:'#d58a32'},
    {sprite:'blackbear',name:'黑熊精',icon:'黑',hp:900,atk:105,def:40,coin:60,color:'#6f6251'},
    {sprite:'yellowking',name:'黄风大圣',icon:'黄',hp:1700,atk:175,def:70,coin:85,color:'#c7a13d'},
    {sprite:'shaseng',name:'沙悟净',icon:'沙',hp:2500,atk:245,def:102,coin:100,color:'#4e849c'},
    {sprite:'redboy',name:'红孩儿',icon:'红',hp:3700,atk:340,def:145,coin:130,color:'#e14934'},
    {sprite:'scorpionqueen',name:'蝎子精',icon:'蝎',hp:5200,atk:455,def:195,coin:160,color:'#a0447e'},
    {sprite:'peng',name:'金翅大鹏',icon:'鹏',hp:7200,atk:590,def:258,coin:210,color:'#bd8b3e'},
    {sprite:'hundredeye',name:'百眼魔君',icon:'眼',hp:9800,atk:760,def:340,coin:270,color:'#8860a2'},
    {sprite:'buddha',name:'如来佛祖',icon:'佛',hp:16000,atk:820,def:520,coin:999,color:'#e5b94f',final:true}
  ];

  const helpers = {
    12:{id:'bajie',name:'猪八戒',icon:'猪',text:'猴哥，老猪只帮这一回！九齿钉耙替你扫开些妖气。',reward:{atk:12,hp:220}},
    24:{id:'taibai',name:'太白金星',icon:'星',text:'大圣，此处妖风厉害。这三把钥匙，收好了。',reward:{yellow:2,blue:1}},
    30:{id:'shaseng',name:'沙悟净',icon:'沙',text:'大师兄，流沙河底炼得一身硬骨，分你三分护体罡气。',reward:{def:22,hp:350}},
    45:{id:'bailong',name:'小白龙',icon:'龙',text:'大师兄，乘我破火云而去。龙鳞可护你周全。',reward:{def:32,red:1}},
    60:{id:'bajie',name:'猪八戒',icon:'猪',text:'猴哥，前头三个魔王不好惹。这几颗仙桃你先吃。',reward:{hp:1000}},
    69:{id:'taibai',name:'太白金星',icon:'星',text:'八十一难已近圆满，莫执着于一时胜负。金丹赠你。',reward:{atk:45,def:45,hp:1200}},
    78:{id:'shaseng',name:'沙悟净',icon:'沙',text:'大师兄，师父就在前方。我们只能送你到这里。',reward:{atk:65,def:55,hp:1600}}
  };

  const adventures = [
    {title:'月下古井',text:'井底传来龙吟，水面浮着一枚龙宫旧印。',a:'跃入井中探宝',b:'投下一枚功德问路'},
    {title:'无字石碑',text:'碑上本无一字，金箍棒靠近时却显出淡淡佛光。',a:'以金箍棒叩碑',b:'静坐参悟片刻'},
    {title:'菩提残影',text:'熟悉的背影在月色中一闪而过，只留下一道未完的口诀。',a:'追上残影',b:'留在原地默记口诀'},
    {title:'通天老龟',text:'老龟驮着一只上锁的铜匣，问你是否还记得旧日所托。',a:'坦言相告',b:'用火眼金睛看铜匣'}
  ];

  const eliteBosses = {
    4:{sprite:'bear',name:'混世魔王',icon:'魔',hp:2400,atk:170,def:80,coin:180,color:'#b66c42',boss:true,elite:true,reward:{atk:18,def:12,hp:800,red:1}},
    11:{sprite:'yin',name:'巨灵神将',icon:'巨',hp:5200,atk:330,def:170,coin:320,color:'#c49a45',boss:true,elite:true,reward:{atk:32,def:24,hp:1600,red:1}},
    17:{sprite:'dragon',name:'九头妖王',icon:'九',hp:9800,atk:560,def:290,coin:520,color:'#58a49d',boss:true,elite:true,reward:{atk:55,def:42,hp:2600,red:2}}
  };

  const $ = s => document.querySelector(s);
  const ui = {
    title:$('#titleScreen'), game:$('#gameScreen'), board:$('#board'), modal:$('#modal'), modalContent:$('#modalContent'),
    toast:$('#toast'), log:$('#eventLog'), oracle:$('#oracleText')
  };
  let state = null;
  let audioOn = true;
  let busy = false;
  let toastTimer;
  let keyNoticeTimer;
  let effectTimer;

  function freshState(){
    return {floor:1,pos:{x:1,y:9},hp:1000,maxHp:1000,atk:24,def:10,coin:0,level:1,exp:0,
      keys:{yellow:0,blue:0,red:0},removed:{},companions:[],steps:0,startedAt:Date.now(),log:[],won:false};
  }

  const expToNext=level=>20+level*8;
  function gainExperience(amount){
    state.exp=(state.exp||0)+amount;let levels=0,atk=0,def=0,hp=0;
    while(state.exp>=expToNext(state.level)){
      state.exp-=expToNext(state.level);state.level++;levels++;
      const atkGain=3+Math.floor(state.level/5),defGain=2+Math.floor(state.level/7),hpGain=80+state.level*8;
      state.atk+=atkGain;state.def+=defGain;state.maxHp+=hpGain;state.hp+=hpGain;atk+=atkGain;def+=defGain;hp+=hpGain;
    }
    return {amount,levels,atk,def,hp};
  }

  function rng(seed){let t=seed+0x6D2B79F5;return()=>{t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
  const keyOf=(f,x,y)=>`${f}:${x}:${y}`;
  const isRemoved=(x,y)=>state.removed[keyOf(state.floor,x,y)];
  const markRemoved=(x,y)=>state.removed[keyOf(state.floor,x,y)]=1;

  function generateFloor(floor){
    const r=rng(floor*9187), grid=Array.from({length:SIZE},()=>Array(SIZE).fill('floor'));
    for(let y=0;y<SIZE;y++) for(let x=0;x<SIZE;x++) if(x===0||y===0||x===10||y===10) grid[y][x]='wall';
    const safe=new Set(['1,9','2,9','9,1','8,1','1,8','9,2']);
    const wallPatterns=[[[3,2],[3,3],[3,4],[7,6],[7,7],[7,8]],[[2,5],[3,5],[4,5],[6,5],[7,5],[8,5]],[[5,2],[5,3],[5,7],[5,8]],[[2,3],[3,3],[7,7],[8,7]]];
    wallPatterns[floor%wallPatterns.length].forEach(([x,y])=>{if(!safe.has(`${x},${y}`))grid[y][x]='wall'});
    const hasVault=floor%3===0&&floor<TOTAL_FLOORS;
    if(hasVault){
      for(let y=5;y<=9;y++)for(let x=6;x<=9;x++)grid[y][x]='floor';
      for(let x=6;x<=9;x++)grid[5][x]='wall';
      for(let y=5;y<=9;y++)grid[y][6]='wall';
      grid[7][4]='floor';grid[7][5]='floor';grid[7][6]='floor';grid[6][7]='wall';grid[8][7]='wall';
    }else if(floor%4===0){[[2,2],[8,8]].forEach(([x,y])=>grid[y][x]=floor%8===0?'lava':'water')}

    const entities=[];
    const add=(x,y,type,data={})=>{if(!isRemoved(x,y))entities.push({x,y,type,...data})};
    const occupied=new Set(['1,9','9,1']);
    if(hasVault){for(let y=5;y<=9;y++)for(let x=6;x<=9;x++)occupied.add(`${x},${y}`);occupied.add('2,8')}
    const elite=eliteBosses[floor];
    if(elite){grid[1][1]='floor';grid[1][2]='floor';grid[2][1]='floor';occupied.add('1,1')}
    const addFixed=(x,y,type,data={})=>{occupied.add(`${x},${y}`);add(x,y,type,data)};
    addFixed(9,1,'stairs',{direction:'up'});
    if(floor>1)addFixed(1,9,'stairs',{direction:'down'});
    const place=(type,data,count=1)=>{
      let guard=0;while(count>0&&guard++<300){const x=1+Math.floor(r()*9),y=1+Math.floor(r()*9),k=`${x},${y}`;if(grid[y][x]==='floor'&&!occupied.has(k)&&!safe.has(k)){occupied.add(k);add(x,y,type,typeof data==='function'?data():data);count--;}}
    };
    const tier=Math.min(enemyBook.length-1,Math.floor((floor-1)/7));
    if(floor===81){
      place('enemy',{...bosses[8],boss:true},1); addFixed(8,1,'npc',{npc:'tangseng',name:'唐僧',icon:'僧',text:'悟空，最后一难不在塔外，在你心中。'});
    }else{
      place('enemy',()=>({...enemyBook[Math.max(0,tier-(r()<.32?1:0))]}),3+floor%3);
      if(floor%9===0) place('enemy',{...bosses[floor/9-1],boss:true},1);
      place('item',{item:'potion',icon:'桃',name:'蟠桃'},1+(floor%4===0?1:0));
      if(floor%2===1) place('item',{item:'yellow',icon:'⚿',name:'黄钥匙'},1);
      if(floor%5===0) place('item',{item:'gemAtk',icon:'◆',name:'攻击宝石'},1);
      if(floor%6===0) place('item',{item:'gemDef',icon:'◇',name:'防御宝石'},1);
      if(floor%8===0) place('item',{item:'blue',icon:'⚿',name:'蓝钥匙'},1);
      if(floor%18===0) place('item',{item:'red',icon:'⚿',name:'红钥匙'},1);
      if(floor%10===0) place('shop',{icon:'鼎',name:'土地庙'},1);
      if(helpers[floor]) place('npc',{...helpers[floor],npc:helpers[floor].id},1);
      if(floor%5===2) place('secret',{name:'可疑石板',secret:floor%3},1);
      if(floor%7===0) place('adventure',{name:'未知奇遇',adventure:Math.floor(floor/7)%adventures.length},1);
      if(elite)addFixed(1,1,'enemy',{...elite});
      if(hasVault){
        const door=floor%9===0?'red':floor%6===0?'blue':'yellow';
        addFixed(2,8,'item',{item:door,icon:'⚿',name:`${doorName(door)}钥匙`,vaultKey:true});
        addFixed(6,7,'door',{door,vault:true});
        addFixed(8,7,'enemy',{...enemyBook[Math.min(enemyBook.length-1,tier)],vaultGuard:true});
        addFixed(9,6,'item',{item:floor%2?'gemAtk':'gemDef',icon:floor%2?'◆':'◇',name:floor%2?'秘藏攻击宝石':'秘藏防御宝石'});
        addFixed(9,8,'item',{item:'potion',icon:'桃',name:'秘藏蟠桃'});
      }
    }
    return {grid,entities,hasVault};
  }

  function render(){
    const data=generateFloor(state.floor), chapter=chapters[Math.floor((state.floor-1)/9)], trial=chapter.trials[(state.floor-1)%9];
    ui.board.innerHTML='';
    for(let y=0;y<SIZE;y++) for(let x=0;x<SIZE;x++){
      const tile=document.createElement('div'); tile.className=`tile ${data.grid[y][x]}`;tile.dataset.x=x;tile.dataset.y=y;tile.setAttribute('role','gridcell');
      const ent=data.entities.find(e=>e.x===x&&e.y===y);
      if(ent) tile.appendChild(renderEntity(ent));
      if(state.pos.x===x&&state.pos.y===y) tile.appendChild(renderPlayer());
      ui.board.appendChild(tile);
    }
    $('#floorNumber').textContent=state.floor;$('#floorName').textContent=trial;$('#chapterName').textContent=chapter.name;
    $('#chapterKicker').textContent=`第 ${Math.floor((state.floor-1)/9)+1} 难域 · ${chapter.floors} 难`;
    $('#hpStat').textContent=Math.floor(state.hp);$('#atkStat').textContent=state.atk;$('#defStat').textContent=state.def;$('#coinStat').textContent=state.coin;
    $('#heroLevel').textContent=state.level;$('#yellowKey').textContent=state.keys.yellow;$('#blueKey').textContent=state.keys.blue;$('#redKey').textContent=state.keys.red;
    const neededExp=expToNext(state.level);$('#expText').textContent=`${state.exp||0} / ${neededExp}`;$('#expBar').style.width=`${Math.min(100,(state.exp||0)/neededExp*100)}%`;
    $('#floorProgressText').textContent=`${state.floor} / ${TOTAL_FLOORS}`;$('#floorProgressBar').style.width=`${state.floor/TOTAL_FLOORS*100}%`;
    const vaultDoor=data.entities.find(e=>e.type==='door'&&e.vault),elite=data.entities.find(e=>e.elite);
    $('#objectiveText').textContent=state.floor===81?'战胜如来，救回唐僧':elite?`${elite.name}暂不可敌，可绕行后再回来挑战`:vaultDoor?`找到${doorName(vaultDoor.door)}钥匙，开启藏宝门`:'寻找通往上层的云梯';
    document.documentElement.style.setProperty('--chapter-color',chapter.color);
    updateCompanions();renderLog();save();
  }

  function renderEntity(e){
    const n=document.createElement('span');n.className=`entity ${e.type}`;n.dataset.type=e.type;
    if(e.type==='enemy'){n.classList.add('game-sprite');if(e.elite)n.classList.add('elite-boss');n.style.setProperty('--sprite',`url("assets/sprites/${e.sprite}.png")`);n.title=`${e.name} HP${e.hp} 攻${e.atk} 防${e.def}`;n.setAttribute('aria-label',n.title)}
    if(e.type==='item'){
      n.classList.add(`item-${e.item}`);n.title=e.name;if(e.vaultKey)n.dataset.vaultKey='true';
      if(['yellow','blue','red'].includes(e.item)){n.classList.add('key-pickup');n.innerHTML='<i class="pickup-key"></i>'}
      else if(e.item==='potion'){n.classList.add('peach-item');n.innerHTML='<i class="peach-fruit"><b></b></i>'}
      else n.textContent=e.icon;
    }
    if(e.type==='door'){n.classList.add(`door-${e.door}`);n.title=`${doorName(e.door)}门 · 需要${doorName(e.door)}钥匙`;n.setAttribute('aria-label',n.title);if(e.vault)n.dataset.vault='true'}
    if(e.type==='stairs'){n.classList.add(`stairs-${e.direction}`);n.innerHTML='<i></i><i></i><i></i><i></i><i></i>';n.title=e.direction==='up'?'上楼 · 通往下一难':'下楼 · 返回上一难';n.setAttribute('aria-label',n.title)}
    if(e.type==='npc'){n.textContent=e.icon;n.title=e.name}
    if(e.type==='shop'){n.textContent=e.icon;n.title=e.name}
    if(e.type==='secret'){n.title='石板上似乎有一道细微裂纹';n.setAttribute('aria-label','可疑石板')}
    if(e.type==='adventure'){n.textContent='✦';n.title='未知奇遇'}
    return n;
  }
  function renderPlayer(){const n=document.createElement('span');n.className='entity player game-sprite';n.style.setProperty('--sprite','url("assets/sprites/wukong.png")');n.title='孙悟空';return n}

  function move(dx,dy){
    if(!state||state.won||busy||!ui.modal.classList.contains('hidden'))return;
    const nx=state.pos.x+dx,ny=state.pos.y+dy,data=generateFloor(state.floor);
    if(nx<0||ny<0||nx>=SIZE||ny>=SIZE||data.grid[ny][nx]==='wall'||data.grid[ny][nx]==='water'||data.grid[ny][nx]==='lava'){sound('bump');return}
    const ent=data.entities.find(e=>e.x===nx&&e.y===ny);
    if(ent&&!interact(ent))return;
    state.pos={x:nx,y:ny};state.steps++;sound('step');render();
    requestAnimationFrame(()=>ui.board.querySelector('.player')?.classList.add('moved'));
  }

  function interact(e){
    if(e.type==='enemy')return battle(e);
    if(e.type==='door')return openDoor(e);
    if(e.type==='item'){collect(e);markRemoved(e.x,e.y);sound('item');return true}
    if(e.type==='stairs'){
      if(e.direction==='up'&&state.floor===81){const finalAlive=generateFloor(81).entities.some(x=>x.type==='enemy');if(finalAlive){toast('如来仍守在雷音寺前');return false}winGame();return false}
      startFloorTransition(e.direction);return false;
    }
    if(e.type==='npc'){
      if(e.npc==='tangseng'){toast('师父就在眼前，先过最后心关。');return false}
      meetHelper(e);markRemoved(e.x,e.y);return true;
    }
    if(e.type==='shop'){openShop();return false}
    if(e.type==='secret'){discoverSecret(e);markRemoved(e.x,e.y);return true}
    if(e.type==='adventure'){openAdventure(e);return false}
    return true;
  }

  function openDoor(e){
    if(state.keys[e.door]<=0){toast(`门锁纹丝不动：缺少${doorName(e.door)}钥匙`);sound('bump');return false}
    state.keys[e.door]--;busy=true;$(`#${e.door}Key`).textContent=state.keys[e.door];
    const door=ui.board.querySelector(`.tile[data-x="${e.x}"][data-y="${e.y}"] .door`);
    door?.classList.add('opening');toast(`${doorName(e.door)}门正在开启`);sound('door');
    setTimeout(()=>{
      markRemoved(e.x,e.y);state.pos={x:e.x,y:e.y};state.steps++;
      addLog('启门',`消耗一把${doorName(e.door)}钥匙，藏宝室已经开启。`,'good');busy=false;render();
    },520);
    return false;
  }

  function startFloorTransition(direction){
    const target=direction==='up'?Math.min(TOTAL_FLOORS,state.floor+1):Math.max(1,state.floor-1);
    if(target===state.floor)return;
    busy=true;const transition=$('#floorTransition');transition.className=`floor-transition ${direction} show`;
    $('#transitionLabel').textContent=direction==='up'?'登临下一难':'返回上一难';$('#transitionFloor').textContent=target;sound('stairs');
    setTimeout(()=>{
      state.floor=target;state.pos=direction==='up'?{x:1,y:9}:{x:8,y:1};
      const progress=direction==='up'?gainExperience(3+Math.ceil(state.floor/3)):{levels:0};
      addLog(direction==='up'?'登塔':'回返',direction==='up'?`踏入第 ${state.floor} 难。`:`返回第 ${state.floor} 难。`,'good');render();
      setTimeout(()=>{transition.className='floor-transition hidden';busy=false;if(progress.levels)showGainEffect('level','修为提升',`等级提升至 LV ${state.level}`)},480);
    },420);
  }

  function discoverSecret(e){
    const n=5+Math.floor(state.floor/15)*2;
    if(e.secret===0){state.atk+=n;addLog('隐藏宝物',`石板下藏着一截定海神铁，攻击提升 ${n}。`,'good');toast('发现隐藏宝物：定海神铁')}
    else if(e.secret===1){state.def+=n;addLog('隐藏宝物',`墙缝中封着一片护心龙鳞，防御提升 ${n}。`,'good');toast('发现隐藏宝物：护心龙鳞')}
    else{state.coin+=18+state.floor;state.keys.yellow++;showKeyNotice('yellow');addLog('隐藏宝物','暗格里藏着功德钱与一把黄钥匙。','good');toast('发现石板暗格')}
    sound('helper');
  }

  function openAdventure(e){
    const a=adventures[e.adventure];
    showModal(`<h2>${a.title}</h2><p>${a.text}</p><div class="adventure-mark">奇</div><div class="modal-actions"><button class="pixel-btn primary" data-choice="a">${a.a}</button><button class="pixel-btn" data-choice="b">${a.b}</button></div>`);
    ui.modalContent.querySelectorAll('[data-choice]').forEach(btn=>btn.onclick=()=>resolveAdventure(e,btn.dataset.choice));
  }

  function resolveAdventure(e,choice){
    const risky=state.floor%14===0;
    if(choice==='a'&&!risky){const gain=8+Math.floor(state.floor/12)*3;state.atk+=gain;state.coin+=20;addLog('奇遇',`一番险探换来机缘：攻击提升 ${gain}，功德 +20。`,'good');toast('险中得缘')}
    else if(choice==='a'){const loss=Math.min(Math.floor(state.hp*.18),state.hp-1);state.hp-=loss;state.keys.red++;showKeyNotice('red');addLog('奇遇',`触动古禁，损失 ${loss} 气血，却得到一把红钥匙。`,'danger');toast('古禁反噬，却另有所得')}
    else{const gain=7+Math.floor(state.floor/18)*2;state.def+=gain;state.hp+=100+state.floor*5;state.maxHp=Math.max(state.maxHp,state.hp);addLog('奇遇',`谨慎参悟：防御提升 ${gain}，并恢复一些气血。`,'good');toast('静中悟得护体法门')}
    markRemoved(e.x,e.y);state.pos={x:e.x,y:e.y};state.steps++;closeModal();sound('helper');render();
  }

  function battle(e){void runBattle(e);return false}

  async function runBattle(e){
    if(busy)return false;
    const heroHit=state.atk-e.def;
    const rounds=heroHit>0?Math.ceil(e.hp/heroHit):Infinity;
    const enemyHit=Math.max(0,e.atk-state.def);
    const loss=Number.isFinite(rounds)?Math.max(0,(rounds-1)*enemyHit):Infinity;
    openBattleScene(e);
    if(heroHit<=0){
      busy=true;showBattleBlocked(`金箍棒无法破开 ${e.def} 点防御`,`${e.name} 的防御高于你的攻击。先寻找攻击宝石，再回来挑战。`);return false;
    }
    if(loss>=state.hp){
      busy=true;showBattleBlocked(`预计损失 ${loss} 气血`,`此战会令悟空倒下。提升防御或补充气血后再战。`);addLog('危机',`${e.name}不可强攻，预计损失 ${loss} 气血。`,'danger');return false;
    }

    busy=true;
    const visualRounds=Math.min(rounds,6),startHeroHp=state.hp;
    let completed=0,shownHeroHp=startHeroHp,shownEnemyHp=e.hp;
    for(let i=0;i<visualRounds;i++){
      const nextCompleted=Math.max(completed+1,Math.round((i+1)*rounds/visualRounds));
      const attacks=nextCompleted-completed;
      const dealt=Math.min(shownEnemyHp,heroHit*attacks);
      $('#battleHeroWrap').classList.add('attacking');sound('battle');await wait(150);
      $('#battleHeroWrap').classList.remove('attacking');$('#battleEnemyWrap').classList.add('hit');showDamage('#enemyDamage',dealt);
      shownEnemyHp=Math.max(0,e.hp-heroHit*nextCompleted);updateBattleHp('Enemy',shownEnemyHp,e.hp);
      appendBattleLog(`第 ${nextCompleted} 回合`,attacks>1?`金箍棒连击 ×${attacks}，造成 ${dealt} 伤害。`:`悟空先攻，造成 ${dealt} 伤害。`,'hero');
      await wait(220);$('#battleEnemyWrap').classList.remove('hit');
      const countersBefore=Math.min(completed,rounds-1),countersNow=Math.min(nextCompleted,rounds-1),counters=countersNow-countersBefore;
      if(counters>0){
        const taken=enemyHit*counters;$('#battleEnemyWrap').classList.add('attacking');await wait(130);$('#battleEnemyWrap').classList.remove('attacking');$('#battleHeroWrap').classList.add('hit');showDamage('#heroDamage',taken||'格挡');
        shownHeroHp=Math.max(0,startHeroHp-enemyHit*countersNow);updateBattleHp('Hero',shownHeroHp,state.maxHp);
        appendBattleLog('妖怪反击',enemyHit?`${e.name}${counters>1?`连续反击 ×${counters}`:'反击'}，悟空损失 ${taken} 气血。`:`悟空挡住了全部伤害。`,'enemy');
        await wait(220);$('#battleHeroWrap').classList.remove('hit');
      }
      completed=nextCompleted;
    }

    const bonus=e.elite?e.reward||{}:{};
    const atkGain=e.elite?(bonus.atk||0):e.boss?4+Math.floor(state.floor/9)*2:0;
    const defGain=e.elite?(bonus.def||0):e.boss?3+Math.floor(state.floor/12):0;
    const hpGain=bonus.hp||0,redGain=bonus.red||0;
    const xpGain=e.elite?60+state.floor*4:e.boss?18+state.floor*2:5+Math.ceil(state.floor/4);
    state.hp-=loss;state.coin+=e.coin;state.atk+=atkGain;state.def+=defGain;state.maxHp+=hpGain;state.hp+=hpGain;state.keys.red+=redGain;
    const progress=gainExperience(xpGain);markRemoved(e.x,e.y);
    addLog('胜战',`击败${e.name}，损失 ${loss} 气血，获得 ${e.coin} 功德。`,loss>state.maxHp*.18?'danger':'good');save();
    $('#battleKicker').textContent=e.elite?'远古劫主已伏':e.boss?'大难已破':'战斗胜利';
    $('#battleReward').innerHTML=`<strong>胜利奖励</strong><div><span>功德 <b>+${e.coin}</b></span><span>修为 <b>+${xpGain}</b></span><span>战斗损伤 <b>-${loss}</b></span>${e.boss?`<span>攻击 <b>+${atkGain}</b></span><span>防御 <b>+${defGain}</b></span>`:''}${hpGain?`<span>气血上限 <b>+${hpGain}</b></span>`:''}${redGain?`<span>红钥匙 <b>+${redGain}</b></span>`:''}${progress.levels?`<span>等级 <b>+${progress.levels}</b></span>`:''}</div>`;
    $('#battleReward').classList.remove('hidden');
    const done=$('#battleContinue');done.textContent=e.boss?'破劫前行':'收下奖励';done.classList.remove('hidden');done.onclick=()=>{closeBattleScene();state.pos={x:e.x,y:e.y};state.steps++;busy=false;render();if(redGain)showKeyNotice('red');if(progress.levels)setTimeout(()=>showGainEffect('level','修为提升',`等级提升至 LV ${state.level}`),redGain?450:0)};
    return false;
  }

  function openBattleScene(e){
    $('#battleScene').classList.remove('hidden');$('#battleKicker').textContent=`第 ${state.floor} 难 · 遭遇战`;
    $('#battleEnemyName').textContent=e.name;$('#battleEnemyType').textContent=e.elite?'远古劫主 · 可绕行':e.boss?'本层劫主':e.vaultGuard?'藏宝室守卫':'拦路妖怪';
    $('#battleEnemySprite').style.setProperty('--sprite',`url("assets/sprites/${e.sprite}.png")`);
    $('#battleHeroStats').textContent=`攻 ${state.atk}　防 ${state.def}`;$('#battleEnemyStats').textContent=`攻 ${e.atk}　防 ${e.def}`;
    $('#battleHeroMax').textContent=state.maxHp;$('#battleEnemyMax').textContent=e.hp;updateBattleHp('Hero',state.hp,state.maxHp);updateBattleHp('Enemy',e.hp,e.hp);
    $('#battleLog').innerHTML='<div class="battle-log-line"><b>交锋</b><span>悟空与妖怪狭路相逢。</span></div>';
    $('#battleReward').classList.add('hidden');$('#battleReward').innerHTML='';$('#battleContinue').classList.add('hidden');
  }

  function showBattleBlocked(title,text){
    $('#battleKicker').textContent='暂不可敌';$('#battleLog').innerHTML=`<div class="battle-warning"><strong>${title}</strong><p>${text}</p></div>`;
    const done=$('#battleContinue');done.textContent='暂且退避';done.classList.remove('hidden');done.onclick=()=>{closeBattleScene();busy=false};sound('bump');
  }

  function closeBattleScene(){$('#battleScene').classList.add('hidden');$('#battleHeroWrap').className='battle-sprite-wrap';$('#battleEnemyWrap').className='battle-sprite-wrap'}
  function updateBattleHp(side,value,max){$(`#battle${side}Hp`).textContent=Math.max(0,Math.floor(value));$(`#battle${side}Bar`).style.width=`${Math.max(0,Math.min(100,value/max*100))}%`}
  function appendBattleLog(title,text,type){const line=document.createElement('div');line.className=`battle-log-line ${type}`;line.innerHTML=`<b>${title}</b><span>${text}</span>`;$('#battleLog').appendChild(line);$('#battleLog').scrollTop=$('#battleLog').scrollHeight}
  function showDamage(selector,value){const n=$(selector);n.textContent=typeof value==='number'?`-${value}`:value;n.classList.remove('pop');void n.offsetWidth;n.classList.add('pop')}
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

  function collect(e){
    const scale=1+Math.floor(state.floor/12);
    if(e.item==='potion'){const gain=120*scale;state.hp+=gain;state.maxHp=Math.max(state.maxHp,state.hp);showGainEffect('peach','大蟠桃',`气血 +${gain}`);addLog('仙果',`蟠桃恢复 ${gain} 气血。`,'good')}
    else if(e.item==='gemAtk'){const gain=7+Math.floor(state.floor/18)*2;state.atk+=gain;showGainEffect('attack','攻击提升',`攻击 +${gain}`);addLog('法宝',`攻击提升 ${gain}。`,'good')}
    else if(e.item==='gemDef'){const gain=6+Math.floor(state.floor/18)*2;state.def+=gain;showGainEffect('defense','防御提升',`防御 +${gain}`);addLog('法宝',`防御提升 ${gain}。`,'good')}
    else{state.keys[e.item]++;addLog('拾取',`获得一把${doorName(e.item)}钥匙。`,'good');showKeyNotice(e.item)}
  }

  function meetHelper(e){
    const reward=e.reward||{};for(const [k,v] of Object.entries(reward)){if(k==='yellow'||k==='blue'||k==='red'){state.keys[k]+=v;showKeyNotice(k)}else{state[k]+=v;if(k==='hp')state.maxHp=Math.max(state.maxHp,state.hp)}}
    if(['bajie','shaseng','bailong'].includes(e.npc)&&!state.companions.includes(e.npc))state.companions.push(e.npc);
    ui.oracle.textContent=`${e.name}：${e.text}`;addLog('相助',`${e.name}略施援手。`,'good');toast(`${e.name}送来一份助力`);sound('helper');
  }

  function openShop(){
    const atkCost=30+Math.floor(state.floor/10)*8,defCost=30+Math.floor(state.floor/10)*8,hpCost=22+Math.floor(state.floor/10)*6;
    showModal(`<h2>土地庙</h2><p>土地公捻须道：功德可换些仙缘，但切莫贪多。</p><div class="modal-actions"><button class="pixel-btn" data-buy="atk" data-cost="${atkCost}">攻击 +12<br><small>${atkCost} 功德</small></button><button class="pixel-btn" data-buy="def" data-cost="${defCost}">防御 +10<br><small>${defCost} 功德</small></button><button class="pixel-btn" data-buy="hp" data-cost="${hpCost}">气血 +500<br><small>${hpCost} 功德</small></button></div>`);
    ui.modalContent.querySelectorAll('[data-buy]').forEach(btn=>btn.onclick=()=>{const cost=+btn.dataset.cost;if(state.coin<cost){toast('功德不足');return}state.coin-=cost;if(btn.dataset.buy==='atk')state.atk+=12;if(btn.dataset.buy==='def')state.def+=10;if(btn.dataset.buy==='hp'){state.hp+=500;state.maxHp+=500}addLog('土地庙','以功德换得一份仙缘。','good');closeModal();render()});
  }

  function showBestiary(){
    const enemies=generateFloor(state.floor).entities.filter(e=>e.type==='enemy');
    const rows=enemies.length?enemies.map(e=>{const hit=state.atk-e.def,rounds=hit>0?Math.ceil(e.hp/hit):Infinity,loss=hit>0?Math.max(0,(rounds-1)*Math.max(0,e.atk-state.def)):Infinity;return `<div class="monster-row"><span class="mini-enemy game-sprite" style="--sprite:url('assets/sprites/${e.sprite}.png')"></span><div><b>${e.name}</b><small>${e.elite?'远古劫主 · 可绕行':e.boss?'本层劫主':e.vaultGuard?'藏宝室守卫':'拦路妖怪'}</small></div><span><small>气血</small>${e.hp}</span><span><small>攻/防</small>${e.atk}/${e.def}</span><span><small>功德</small>${e.coin}</span><span class="loss"><small>预计损伤</small>${Number.isFinite(loss)?loss:'不可破防'}</span></div>`}).join(''):'<p>本层妖气已清。</p>';
    showModal(`<h2>本层妖鉴</h2><p>战斗自动结算。你先出手；敌人每轮反击，最后一击后不会反击。</p>${rows}`);
  }

  function showMenu(){showModal(`<h2>行者歇脚</h2><p>进度已自动保存在浏览器中。当前第 ${state.floor} 难，已行 ${state.steps} 步。</p><div class="modal-actions"><button class="pixel-btn" data-action="resume">继续游戏</button><button class="pixel-btn" data-action="save">手动存档</button><button class="pixel-btn" data-action="title">返回标题</button><button class="pixel-btn" data-action="restart">重开此世</button></div>`);ui.modalContent.querySelector('[data-action=resume]').onclick=closeModal;ui.modalContent.querySelector('[data-action=save]').onclick=()=>{save();toast('前缘已记入天命卷');closeModal()};ui.modalContent.querySelector('[data-action=title]').onclick=()=>{closeModal();ui.game.classList.add('hidden');ui.title.classList.remove('hidden')};ui.modalContent.querySelector('[data-action=restart]').onclick=()=>{if(confirm('确定抹去当前进度，从第一难重新开始？'))startNew()}}
  function showHelp(){showModal(`<h2>西行要诀</h2><p><b>移动：</b>使用 WASD、方向键或屏幕方向按钮。<br><b>战斗：</b>撞向妖怪会进入战斗场景，逐回合显示双方伤害、气血和最终奖励。攻击必须高于妖怪防御；预计损伤达到当前气血时只能暂且退避。<br><b>藏宝门：</b>每三层会出现一座封闭藏宝室。钥匙必在门外，开门后仍需面对守卫才能取得秘宝。<br><b>探索：</b>留意地砖上极细的裂纹，也不要错过紫色星光。前者可能藏有宝物，后者会触发有选择的奇遇。<br><b>成长：</b>拾取宝石、蟠桃和钥匙，或在土地庙用功德换取能力。<br><b>目标：</b>逐层登塔，经历八十一难。猪八戒、沙悟净、小白龙与太白金星会在少数难关略施援手。<br><b>存档：</b>每一步都会自动保存。</p>`)}

  function winGame(){state.won=true;save();sound('win');const minutes=Math.max(1,Math.floor((Date.now()-state.startedAt)/60000));showModal(`<div class="ending-art"></div><h2>八十一难 · 功德圆满</h2><p>金箍棒停在佛掌之前。悟空终于明白，最后一战并非弑佛，而是打破心中最后的执念。如来让开雷音寺门，唐僧重获自由，师徒再踏归途。</p><p>通关记录：${state.steps} 步 · ${minutes} 分钟 · 剩余气血 ${Math.floor(state.hp)}</p><div class="modal-actions"><button class="pixel-btn primary" data-action="again">再历一世</button><button class="pixel-btn" data-action="title">返回标题</button></div>`);ui.modalContent.querySelector('[data-action=again]').onclick=startNew;ui.modalContent.querySelector('[data-action=title]').onclick=()=>{closeModal();ui.game.classList.add('hidden');ui.title.classList.remove('hidden')}}

  function updateCompanions(){document.querySelectorAll('.companion').forEach(n=>{const active=state.companions.includes(n.dataset.id);n.classList.toggle('locked',!active);if(active)n.querySelector('small').textContent='已结缘 · 偶尔相助'})}
  function addLog(title,text,type=''){state.log.unshift({title,text,type});state.log=state.log.slice(0,20)}
  function renderLog(){ui.log.innerHTML=state.log.map(x=>`<div class="log-entry ${x.type}"><b>${x.title}</b> · ${x.text}</div>`).join('')||'<div class="log-entry">天命卷尚无记载。</div>'}
  function doorName(k){return{yellow:'黄',blue:'蓝',red:'红'}[k]}
  function showKeyNotice(kind){
    clearTimeout(keyNoticeTimer);const notice=$('#keyNotice');notice.className=`key-notice ${kind}`;
    $('#keyNoticeName').textContent=`${doorName(kind)}钥匙`;$('#keyNoticeCount').textContent=state.keys[kind];
    void notice.offsetWidth;notice.classList.add('show');keyNoticeTimer=setTimeout(()=>{notice.classList.remove('show');setTimeout(()=>notice.classList.add('hidden'),260)},2100);
  }
  function showGainEffect(kind,title,detail){
    clearTimeout(effectTimer);const effect=$('#itemEffect');effect.className=`item-effect ${kind}`;
    const icon=$('#effectIcon');icon.innerHTML=kind==='peach'?'<i class="peach-fruit large"><b></b></i>':kind==='attack'?'⚔':kind==='defense'?'◆':'悟';
    $('#effectTitle').textContent=title;$('#effectDetail').textContent=detail;void effect.offsetWidth;effect.classList.add('show');
    effectTimer=setTimeout(()=>{effect.classList.remove('show');setTimeout(()=>effect.classList.add('hidden'),220)},1500);
  }
  function toast(text){clearTimeout(toastTimer);ui.toast.textContent=text;ui.toast.classList.add('show');toastTimer=setTimeout(()=>ui.toast.classList.remove('show'),1800)}
  function showModal(html){ui.modalContent.innerHTML=html;ui.modal.classList.remove('hidden')}
  function closeModal(){ui.modal.classList.add('hidden')}
  function save(){if(state)localStorage.setItem(SAVE_KEY,JSON.stringify(state));$('#continueBtn').disabled=!localStorage.getItem(SAVE_KEY)}
  function load(){try{return JSON.parse(localStorage.getItem(SAVE_KEY))}catch{return null}}
  function enterGame(){ui.title.classList.add('hidden');ui.game.classList.remove('hidden');closeModal();$('#battleScene').classList.add('hidden');$('#itemEffect').classList.add('hidden');$('#floorTransition').classList.add('hidden');busy=false;render()}
  function startNew(){state=freshState();state.log=[{title:'启程',text:'悟空闯入八十一难塔，誓要救回唐僧。',type:'good'}];enterGame()}
  function continueGame(){state=load();if(!state){startNew();return}enterGame()}

  let audioCtx;
  function sound(type){if(!audioOn)return;try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();const freq={step:130,bump:80,item:620,door:210,stairs:440,battle:95,helper:520,win:740}[type]||220;o.type=type==='battle'?'sawtooth':'square';o.frequency.setValueAtTime(freq,audioCtx.currentTime);if(type==='win')o.frequency.exponentialRampToValueAtTime(1180,audioCtx.currentTime+.35);g.gain.setValueAtTime(.035,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+(type==='win'?.5:.09));o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+(type==='win'?.5:.1))}catch{}}

  $('#newGameBtn').onclick=startNew;$('#continueBtn').onclick=continueGame;$('#continueBtn').disabled=!localStorage.getItem(SAVE_KEY);
  $('#bestiaryBtn').onclick=showBestiary;$('#menuBtn').onclick=showMenu;$('#helpBtn').onclick=showHelp;
  $('#soundBtn').onclick=e=>{audioOn=!audioOn;e.currentTarget.textContent=audioOn?'♪':'×';toast(audioOn?'声音已开启':'声音已关闭')};
  $('#clearLogBtn').onclick=()=>{state.log=[];renderLog()};
  document.querySelectorAll('[data-close-modal]').forEach(n=>n.onclick=closeModal);
  document.querySelectorAll('.mobile-controls button').forEach(n=>n.onclick=()=>{const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[n.dataset.dir];move(...d)});
  window.addEventListener('keydown',e=>{if(busy){e.preventDefault();return}const map={ArrowUp:[0,-1],w:[0,-1],W:[0,-1],ArrowDown:[0,1],s:[0,1],S:[0,1],ArrowLeft:[-1,0],a:[-1,0],A:[-1,0],ArrowRight:[1,0],d:[1,0],D:[1,0]};if(map[e.key]){e.preventDefault();move(...map[e.key])}else if(e.key==='Escape'){ui.modal.classList.contains('hidden')&&state?showMenu():closeModal()}else if(e.key==='e'||e.key==='E')showBestiary()});
})();
