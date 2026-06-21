(() => {
  'use strict';

  const SIZE = 11;
  const TOTAL_FLOORS = 81;
  const SAVE_KEY = 'journey-tower-save-v2';
  const chapters = [
    { name:'双叉岭', floors:'1—9', color:'#6d7d50', trials:['云开双叉岭 · 石径入幽冥','松风惊夜客 · 残月照孤行','古镜沉熊穴 · 灵光照眼明','魔影横山径 · 金箍破夜冥','双峰藏雾锁 · 一棒问前程','荒祠燃鬼火 · 古木动秋声','虎啸穿云壑 · 石碑悟道生','岭月随人瘦 · 山风伴影清','寅威封古道 · 棒落万山平'] },
    { name:'黑风山', floors:'10—18', color:'#466a5c', trials:['禅院钟初歇 · 松烟入夜深','巨灵临绝涧 · 神锋试道心','袈裟留旧火 · 故友赠丹心','黑风穿石径 · 暮雨洗尘襟','熊罴眠古坳 · 菩提入梦寻','松涛藏百怪 · 云影落幽林','洞门悬冷月 · 蛇影过疏林','九首翻沧浪 · 龙鳞照剑心','黑熊守佛衣 · 禅杖破云阴'] },
    { name:'黄风岭', floors:'19—27', color:'#8a6c35', trials:['黄沙连落日 · 古道起长风','风径通荒驿 · 土祠隐老翁','沙阵迷千里 · 灵龟渡远空','珠影沉石罅 · 暗门听晚风','山神留鹤迹 · 野渡入晴空','飞沙遮望眼 · 星使下云宫','洞口悬金刃 · 秋声满碧空','三昧翻黄浪 · 定风镇远空','大圣呼狂飙 · 金睛破昏蒙'] },
    { name:'流沙河', floors:'28—36', color:'#2f6f82', trials:['弱水涵星斗 · 古井卧苍龙','流沙横野渡 · 孤棹入烟重','河心浮旧月 · 故友护征蓬','枯骨鸣寒水 · 红尘渡几重','暗流穿水府 · 石隙隐蛟踪','水殿沉残鼓 · 蓝扉锁玉钟','一苇横天堑 · 禅心渡浪峰','沧浪翻夜雪 · 石上问禅宗','卷帘辞旧阙 · 宝杖定蛟龙'] },
    { name:'火云洞', floors:'37—45', color:'#9b3c2e', trials:['枯松啼暮鸦 · 石罅隐丹霞','号山云路断 · 野火照归鸦','童影藏深壑 · 黄扉锁赤霞','真火烧禅念 · 土祠煮晚茶','慈容生幻相 · 心火乱昏花','洞门浮紫焰 · 菩提指落花','五车围火阵 · 铁轮碾暮霞','内殿悬丹鼎 · 炉烟绕绛纱','圣婴持火槊 · 龙影渡云霞'] },
    { name:'女儿国', floors:'46—54', color:'#88506d', trials:['西梁春水暖 · 花雨落宫墙','子母河波静 · 石心藏暗香','驿路迎朝露 · 黄扉掩海棠','女王垂珠箔 · 灵龟问行藏','毒雾侵花径 · 土祠燃晚香','琵琶弹月冷 · 蓝扉锁红妆','倒马钩魂魄 · 石花隐暗香','情丝缠客梦 · 心定水云长','蝎尾摇寒月 · 金箍破毒光'] },
    { name:'狮驼岭', floors:'55—63', color:'#5d4e41', trials:['尸岭连云暗 · 神锋照骨寒','巡山传夜柝 · 古井映星残','宝瓶收日月 · 黄扉锁玉关','狮吼崩云壁 · 风尘满故山','象步摇深谷 · 长廊落叶斑','鹏翼垂天际 · 八戒赠仙丹','魔窟连三界 · 阴风绕九关','三王遗石殿 · 石壁隐玄关','金翅遮天日 · 棒开万里山'] },
    { name:'盘丝洞', floors:'64—72', color:'#684568', trials:['蛛丝牵古径 · 月冷照幽泉','垢泉浮花影 · 神刃断尘缘','七情织罗网 · 黄扉锁洞天','黄花凝晓露 · 石罅隐金蝉','百眼生毒雾 · 秋灯照暮烟','金光迷法眼 · 星使授真诠','金针穿雾阵 · 菩提落指尖','千丝缠皓月 · 一棒扫寒烟','魔眼开千日 · 毗蓝破毒天'] },
    { name:'灵山', floors:'73—81', color:'#8b6931', trials:['凌云横法界 · 一苇渡金莲','无底舟无缆 · 心灯照彼岸','佛光开玉阙 · 黄扉锁梵天','雷音闻暮鼓 · 云路接诸天','五方垂法印 · 灵龟问夙缘','天龙盘宝座 · 悟净护经筵','无字藏真谛 · 心经写大千','心劫生莲火 · 土祠问宿缘','佛掌涵三界 · 猴心证大千'] }
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
    12:{id:'bajie',name:'猪八戒',text:'猴哥，老猪只帮这一回！九齿钉耙替你扫开些妖气。',reward:{atk:12,hp:220}},
    24:{id:'taibai',name:'太白金星',text:'大圣，此处妖风厉害。这三把钥匙，收好了。',reward:{yellow:2,blue:1}},
    30:{id:'shaseng',name:'沙悟净',text:'大师兄，流沙河底炼得一身硬骨，分你三分护体罡气。',reward:{def:22,hp:350}},
    45:{id:'bailong',name:'小白龙',text:'大师兄，乘我破火云而去。龙鳞可护你周全。',reward:{def:32,red:1}},
    60:{id:'bajie',name:'猪八戒',text:'猴哥，前头三个魔王不好惹。这几颗仙桃你先吃。',reward:{hp:1000}},
    69:{id:'taibai',name:'太白金星',text:'八十一难已近圆满，莫执着于一时胜负。金丹赠你。',reward:{atk:45,def:45,hp:1200}},
    78:{id:'shaseng',name:'沙悟净',text:'大师兄，师父就在前方。我们只能送你到这里。',reward:{atk:65,def:55,hp:1600}}
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

  const artifactBook = {
    'demon-mirror':{name:'照妖镜',art:'demon-mirror',skill:'洞察真形',detail:'开启妖鉴完整数值，战斗中看破妖怪气血。'},
    'three-point-blade':{name:'三尖两刃刀',art:'three-point-blade',atk:16,skill:'破甲真锋',detail:'每层无视妖怪 4% 防御，最高 24%。'},
    'nine-tooth-rake':{name:'九齿钉耙',art:'nine-tooth-rake',atk:20,hp:120,skill:'天蓬横扫',detail:'每层令开场横扫伤害提高，最高为一次普攻的 60%。'},
    'kasaya':{name:'锦斓袈裟',art:'kasaya',def:17,hp:220,skill:'佛光护体',detail:'每层减免 4% 所受伤害，最高 24%。'},
    'dragon-shield':{name:'白龙鳞盾',art:'dragon-shield',def:15,hp:280,skill:'龙鳞卸力',detail:'每层削弱妖怪 3% 攻击，最高 18%。'},
    'chaos-armor':{name:'混世玄甲',art:'dragon-shield',skill:'玄甲镇岳',detail:'额外减免 8% 所受伤害。'},
    'giant-edge':{name:'巨灵神锋',art:'three-point-blade',skill:'神锋裂阵',detail:'对劫主与首领额外造成 15% 伤害。'},
    'nine-dragon-scale':{name:'九首龙鳞',art:'kasaya',skill:'九龙回护',detail:'削弱妖怪 8% 攻击。'},
    'tiger-saber':{name:'虎魄偃月刀',art:'tiger-saber',skill:'虎魄斩将',detail:'对劫主与首领额外造成 20% 伤害。'},
    'blackwind-kasaya':{name:'黑风锦斓袈裟',art:'blackwind-kasaya',skill:'黑风护心',detail:'额外减免 10% 所受伤害。'},
    'wind-pearl':{name:'定风珠',art:'wind-pearl',skill:'定风止息',detail:'削弱妖怪 10% 攻击。'},
    'demon-staff':{name:'降妖宝杖',art:'demon-staff',skill:'镇妖伏魔',detail:'对普通妖怪额外造成 18% 伤害。'},
    'fire-spear':{name:'火尖枪',art:'fire-spear',skill:'真火灼魂',detail:'开场灼烧妖怪 8% 气血。'},
    'scorpion-pipa':{name:'倒马毒琵琶',art:'scorpion-pipa',skill:'倒马奇毒',detail:'削弱妖怪 12% 攻击。'},
    'twogas-vase':{name:'阴阳二气瓶',art:'twogas-vase',skill:'阴阳收摄',detail:'所有攻击额外造成 12% 伤害。'},
    'golden-eye':{name:'金光宝眼',art:'golden-eye',skill:'洞虚金光',detail:'额外无视妖怪 12% 防御。'},
    'lotus-scripture':{name:'莲台真经',art:'lotus-scripture',skill:'莲台不灭',detail:'额外减免 12% 所受伤害。'}
  };

  const $ = s => document.querySelector(s);
  const npcArt = id => `assets/npcs/${id}.png`;
  const itemArt = id => `assets/items/${id}.png`;
  const itemAsset = e => ({yellow:'key-yellow',blue:'key-blue',red:'key-red',potion:'peach'}[e.item]||e.art);
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
  let bgmStarted = false;

  function freshState(){
    return {floor:1,pos:{x:1,y:9},hp:1000,maxHp:1000,atk:24,def:10,coin:0,level:1,exp:0,
      keys:{yellow:0,blue:0,red:0},removed:{},companions:[],artifacts:{},hasMirror:false,steps:0,startedAt:Date.now(),log:[],won:false};
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
    const r=rng(floor*9187),grid=Array.from({length:SIZE},()=>Array(SIZE).fill('wall'));
    const pointKey=(x,y)=>`${x},${y}`;
    const shuffle=list=>{for(let i=list.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[list[i],list[j]]=[list[j],list[i]]}return list};
    const inside=(x,y)=>x>0&&y>0&&x<SIZE-1&&y<SIZE-1;
    const directions=[[1,0],[-1,0],[0,1],[0,-1]];
    const floorNeighbors=(x,y)=>directions.map(([dx,dy])=>[x+dx,y+dy]).filter(([nx,ny])=>inside(nx,ny)&&grid[ny][nx]==='floor');
    const floorCells=()=>{const cells=[];for(let y=1;y<SIZE-1;y++)for(let x=1;x<SIZE-1;x++)if(grid[y][x]==='floor')cells.push([x,y]);return cells};
    const reachableFrom=(start,blocked=new Set())=>{const queue=[start],seen=new Set([pointKey(...start)]);while(queue.length){const [x,y]=queue.shift();for(const [nx,ny] of floorNeighbors(x,y)){const k=pointKey(nx,ny);if(!seen.has(k)&&!blocked.has(k)){seen.add(k);queue.push([nx,ny])}}}return seen};
    const shortestPath=(start,goal,blocked=new Set())=>{const queue=[start],previous=new Map([[pointKey(...start),null]]);while(queue.length){const [x,y]=queue.shift(),k=pointKey(x,y);if(x===goal[0]&&y===goal[1]){const path=[];let cursor=k;while(cursor){path.unshift(cursor.split(',').map(Number));cursor=previous.get(cursor)}return path}for(const [nx,ny] of floorNeighbors(x,y)){const nk=pointKey(nx,ny);if(!previous.has(nk)&&!blocked.has(nk)){previous.set(nk,k);queue.push([nx,ny])}}}return null};

    // 以 5×5 节点生成完美迷宫，再有限度打通回路；比随机墙段更密集且始终有解。
    const start=[1,9],exit=[9,1],visited=new Set([pointKey(...start)]),stack=[start];grid[start[1]][start[0]]='floor';
    while(stack.length){const [x,y]=stack[stack.length-1];const options=shuffle(directions.map(([dx,dy])=>[x+dx*2,y+dy*2,dx,dy]).filter(([nx,ny])=>inside(nx,ny)&&!visited.has(pointKey(nx,ny))));if(!options.length){stack.pop();continue}const [nx,ny,dx,dy]=options[0];grid[y+dy][x+dx]='floor';grid[ny][nx]='floor';visited.add(pointKey(nx,ny));stack.push([nx,ny])}
    grid[exit[1]][exit[0]]='floor';
    const originalRoute=shortestPath(start,exit),desiredGateCount=3;
    const gateIndices=[.28,.55,.78];
    const mainGates=[];
    for(const ratio of gateIndices){const target=Math.floor((originalRoute.length-1)*ratio);let chosen=null;for(let offset=0;offset<originalRoute.length;offset++){for(const index of [target-offset,target+offset]){if(index<3||index>originalRoute.length-3)continue;const candidate=originalRoute[index],k=pointKey(...candidate);if(mainGates.some(g=>pointKey(...g)===k))continue;if(!shortestPath(start,exit,new Set([k]))){chosen=candidate;break}}if(chosen)break}if(chosen)mainGates.push(chosen)}

    const loopWalls=shuffle([]);for(let y=1;y<SIZE-1;y++)for(let x=1;x<SIZE-1;x++){if(grid[y][x]!=='wall')continue;const horizontal=grid[y][x-1]==='floor'&&grid[y][x+1]==='floor',vertical=grid[y-1][x]==='floor'&&grid[y+1][x]==='floor';if(horizontal||vertical)loopWalls.push([x,y])}
    let loops=0;for(const [x,y] of loopWalls){if(loops>=2+floor%3)break;grid[y][x]='floor';const preservesGates=mainGates.every(g=>!shortestPath(start,exit,new Set([pointKey(...g)])));if(preservesGates)loops++;else grid[y][x]='wall'}

    const hasVault=floor%3===0&&floor<TOTAL_FLOORS;
    let vaultPlan=null;
    if(hasVault){const routeSet=new Set(originalRoute.map(([x,y])=>pointKey(x,y)));const endpoints=shuffle(floorCells().filter(([x,y])=>floorNeighbors(x,y).length===1&&!routeSet.has(pointKey(x,y))));for(const [x,y] of endpoints){const wallOptions=shuffle(directions.map(([dx,dy])=>[x+dx,y+dy]).filter(([nx,ny])=>inside(nx,ny)&&grid[ny][nx]==='wall'));if(!wallOptions.length)continue;const [gx,gy]=wallOptions[0];grid[gy][gx]='floor';const rewardOptions=shuffle(directions.map(([dx,dy])=>[gx+dx,gy+dy]).filter(([nx,ny])=>inside(nx,ny)&&grid[ny][nx]==='wall'));if(!rewardOptions.length){grid[gy][gx]='wall';continue}const [rx,ry]=rewardOptions[0];grid[ry][rx]='floor';vaultPlan={door:[x,y],guard:[gx,gy],reward:[rx,ry]};break}}

    const entities=[],occupied=new Set([pointKey(...start),pointKey(...exit)]);
    if(vaultPlan)[vaultPlan.door,vaultPlan.guard,vaultPlan.reward].forEach(([x,y])=>occupied.add(pointKey(x,y)));
    const add=(x,y,type,data={})=>{if(!isRemoved(x,y))entities.push({x,y,type,...data})};
    const addFixed=(x,y,type,data={})=>{occupied.add(pointKey(x,y));add(x,y,type,data)};
    const freePool=preferred=>shuffle((preferred||floorCells()).filter(([x,y])=>!occupied.has(pointKey(x,y))));
    const place=(type,data,count=1,preferred=null)=>{const placed=[];for(const [x,y] of freePool(preferred)){if(count<=0)break;occupied.add(pointKey(x,y));add(x,y,type,typeof data==='function'?data():data);placed.push([x,y]);count--}return placed};
    addFixed(...exit,'stairs',{direction:'up'});if(floor>1)addFixed(...start,'stairs',{direction:'down'});

    const doorColors=['yellow','blue','red'];
    mainGates.forEach((gate,index)=>addFixed(...gate,'door',{door:doorColors[index],mainGate:true}));
    mainGates.forEach((gate,index)=>{const blocked=new Set(mainGates.slice(index).map(g=>pointKey(...g)));if(vaultPlan)blocked.add(pointKey(...vaultPlan.door));const reachable=reachableFrom(start,blocked),candidates=floorCells().filter(([x,y])=>reachable.has(pointKey(x,y))&&!occupied.has(pointKey(x,y)));candidates.sort((a,b)=>{const score=p=>(floorNeighbors(...p).length===1?20:0)+(originalRoute.some(q=>pointKey(...q)===pointKey(...p))?0:10)+Math.abs(p[0]-gate[0])+Math.abs(p[1]-gate[1]);return score(b)-score(a)});const chosen=candidates[0]||start,kind=doorColors[index];addFixed(...chosen,'item',{item:kind,name:`${doorName(kind)}钥匙`,gateKey:true})});

    const tier=Math.min(enemyBook.length-1,Math.floor((floor-1)/7)),attackRelic=floor%10===0?'nine-tooth-rake':'three-point-blade',defenseRelic=floor%12===0?'kasaya':'dragon-shield';
    const bossRelicBook=[
      {id:'tiger-saber',name:'虎魄偃月刀',art:'tiger-saber'},{id:'blackwind-kasaya',name:'黑风锦斓袈裟',art:'blackwind-kasaya'},{id:'wind-pearl',name:'定风珠',art:'wind-pearl'},
      {id:'demon-staff',name:'降妖宝杖',art:'demon-staff'},{id:'fire-spear',name:'火尖枪',art:'fire-spear'},{id:'scorpion-pipa',name:'倒马毒琵琶',art:'scorpion-pipa'},
      {id:'twogas-vase',name:'阴阳二气瓶',art:'twogas-vase'},{id:'golden-eye',name:'金光宝眼',art:'golden-eye'},{id:'lotus-scripture',name:'莲台真经',art:'lotus-scripture'}
    ];
    const routeSet=new Set(originalRoute.map(([x,y])=>pointKey(x,y)));
    const makeBossChamber=()=>{const candidates=shuffle(floorCells().filter(([x,y])=>!routeSet.has(pointKey(x,y))&&!occupied.has(pointKey(x,y))));for(const spot of candidates){const open=floorNeighbors(...spot).filter(([x,y])=>!occupied.has(pointKey(x,y))),walls=shuffle(directions.map(([dx,dy])=>[spot[0]+dx,spot[1]+dy]).filter(([x,y])=>inside(x,y)&&grid[y][x]==='wall'));if(!open.length||open.length+walls.length<3)continue;while(open.length<3&&walls.length){const carved=walls.shift();grid[carved[1]][carved[0]]='floor';open.push(carved)}return{boss:spot,entry:open[0],guard:open[1],relic:open[2]}}return null};
    const bossIndex=floor%9===0?floor/9-1:-1;
    if(bossIndex>=0){
      const relic={...bossRelicBook[bossIndex],reward:{atk:22+bossIndex*7,def:14+bossIndex*6,hp:650+bossIndex*320}};
      const chamber=makeBossChamber();
      if(chamber){
        const seal=`${floor}:${chamber.boss[0]}:${chamber.boss[1]}`;
        addFixed(...chamber.boss,'enemy',{...bosses[bossIndex],boss:true,bossChamber:true,relic});
        addFixed(...chamber.entry,'enemy',{...enemyBook[Math.max(0,tier-1)],bossGuard:true});
        addFixed(...chamber.guard,'enemy',{...enemyBook[Math.max(0,tier-1)],bossGuard:true});
        addFixed(...chamber.relic,'item',{item:'bossRelic',artifactId:relic.id,name:relic.name,art:relic.art,reward:relic.reward,sealedBy:seal});
      }
    }
    const elite=eliteBosses[floor];
    if(elite){const eliteIndex=[4,11,17].indexOf(floor),eliteRelics=[{id:'chaos-armor',name:'混世玄甲',art:'dragon-shield'},{id:'giant-edge',name:'巨灵神锋',art:'three-point-blade'},{id:'nine-dragon-scale',name:'九首龙鳞',art:'kasaya'}],relic={...eliteRelics[eliteIndex],reward:{atk:14+eliteIndex*5,def:12+eliteIndex*4,hp:600+eliteIndex*260}},chamber=makeBossChamber();if(chamber){const seal=`${floor}:${chamber.boss[0]}:${chamber.boss[1]}`;addFixed(...chamber.boss,'enemy',{...elite,bossChamber:true,relic});addFixed(...chamber.entry,'enemy',{...enemyBook[Math.max(0,tier-1)],bossGuard:true});addFixed(...chamber.guard,'enemy',{...enemyBook[Math.max(0,tier-1)],bossGuard:true});addFixed(...chamber.relic,'item',{item:'bossRelic',artifactId:relic.id,name:relic.name,art:relic.art,reward:relic.reward,sealedBy:seal})}}
    if(floor===3){
      const routeSet=new Set(originalRoute.map(([x,y])=>pointKey(x,y)));
      const mirrorBranches=shuffle(floorCells().filter(([x,y])=>!routeSet.has(pointKey(x,y))&&!occupied.has(pointKey(x,y))&&floorNeighbors(x,y).length===1));
      const mirrorSpot=mirrorBranches.find(([x,y])=>floorNeighbors(x,y).some(([nx,ny])=>!occupied.has(pointKey(nx,ny))));
      if(mirrorSpot){const guardSpot=floorNeighbors(...mirrorSpot).find(([x,y])=>!occupied.has(pointKey(x,y))),seal=`${floor}:${guardSpot[0]}:${guardSpot[1]}`;addFixed(...guardSpot,'enemy',{sprite:'bear',name:'镇镜熊罴',hp:380,atk:48,def:20,coin:55,color:'#80634c',mirrorGuardian:true});addFixed(...mirrorSpot,'item',{item:'mirror',art:'demon-mirror',name:'照妖镜',sealedBy:seal})}
    }
    const routePool=originalRoute.slice(2,-2).filter(([x,y])=>!occupied.has(pointKey(x,y))),monsterCount=7+floor%4+Math.floor(floor/27);
    place('enemy',()=>({...enemyBook[Math.max(0,tier-(r()<.28?1:0))]}),Math.min(4,monsterCount),routePool);
    place('enemy',()=>({...enemyBook[Math.max(0,tier-(r()<.28?1:0))]}),monsterCount-Math.min(4,monsterCount));
    place('item',{item:'potion',name:'大蟠桃'},1+(floor%4===0?1:0));
    if(floor%2===1)place('item',{item:'yellow',name:'黄钥匙'},1);
    if(floor%5===0)place('item',{item:'gemAtk',art:attackRelic,name:attackRelic==='nine-tooth-rake'?'九齿钉耙':'三尖两刃刀'},1);
    if(floor%6===0)place('item',{item:'gemDef',art:defenseRelic,name:defenseRelic==='kasaya'?'锦斓袈裟':'白龙鳞盾'},1);
    if(floor%8===0)place('item',{item:'blue',name:'蓝钥匙'},1);
    if(floor%18===0)place('item',{item:'red',name:'红钥匙'},1);
    if(floor%10===0)place('shop',{npc:'landgod',name:'土地庙'},1);
    if(helpers[floor])place('npc',{...helpers[floor],npc:helpers[floor].id},1);
    if(floor===81)place('npc',{npc:'tangseng',name:'唐僧',text:'悟空，最后一难不在塔外，在你心中。'},1);
    if(floor%5===2)place('secret',{name:'可疑石板',secret:floor%3},1);
    if(floor%7===0)place('adventure',{name:'未知奇遇',adventure:Math.floor(floor/7)%adventures.length},1);
    if(vaultPlan){const kind=doorColors[(floor/3-1)%3];place('item',{item:kind,name:`${doorName(kind)}钥匙`,vaultKey:true},1);addFixed(...vaultPlan.door,'door',{door:kind,vault:true});addFixed(...vaultPlan.guard,'enemy',{...enemyBook[Math.min(enemyBook.length-1,tier)],vaultGuard:true});addFixed(...vaultPlan.reward,'item',floor%2?{item:'gemAtk',art:attackRelic,name:`秘藏·${attackRelic==='nine-tooth-rake'?'九齿钉耙':'三尖两刃刀'}`}:{item:'gemDef',art:defenseRelic,name:`秘藏·${defenseRelic==='kasaya'?'锦斓袈裟':'白龙鳞盾'}`})}
    return {grid,entities,hasVault:!!vaultPlan,routeLength:originalRoute.length,mainRoute:originalRoute,loops};
  }

  function getFloorMeta(floor){
    const chapter=chapters[Math.floor((floor-1)/9)],baseTitle=chapter.trials[(floor-1)%9],bossIndex=floor%9===0?floor/9-1:-1;
    if(bossIndex>=0)return{title:baseTitle,kind:'boss',badge:'BOSS'};
    if(eliteBosses[floor])return{title:baseTitle,kind:'elite',badge:'劫主'};
    if(floor===3)return{title:baseTitle,kind:'mirror',badge:'照妖镜'};
    if(helpers[floor])return{title:baseTitle,kind:'helper',badge:'助阵'};
    if(floor%7===0)return{title:baseTitle,kind:'adventure',badge:'奇遇'};
    if(floor%10===0)return{title:baseTitle,kind:'shop',badge:'土地庙'};
    if(floor%3===0&&floor<TOTAL_FLOORS)return{title:baseTitle,kind:'vault',badge:'秘藏'};
    if(floor%5===2)return{title:baseTitle,kind:'secret',badge:'暗格'};
    if(floor%5===0||floor%6===0)return{title:baseTitle,kind:'relic',badge:'法宝'};
    return{title:baseTitle,kind:'journey',badge:'行路'};
  }

  function getFloorTitle(floor){return getFloorMeta(floor).title}

  function previewFloorData(floor){
    const previousState=state;state={floor,removed:{}};
    try{return generateFloor(floor)}finally{state=previousState}
  }

  function showFloorPreview(floor){
    const data=previewFloorData(floor),meta=getFloorMeta(floor),chapter=chapters[Math.floor((floor-1)/9)];
    const entities=new Map(data.entities.map(e=>[`${e.x},${e.y}`,e]));
    const glyph=e=>e.boss?'王':e.type==='enemy'?'妖':e.type==='door'?'门':e.type==='item'?'宝':e.type==='npc'?'友':e.type==='shop'?'祠':e.type==='adventure'?'缘':e.type==='secret'?'隐':e.type==='stairs'?'阶':'';
    const cells=data.grid.flatMap((row,y)=>row.map((tile,x)=>{const e=entities.get(`${x},${y}`),kind=e?`entity-${e.type}${e.boss?' boss':''}${e.door?` door-${e.door}`:''}`:tile;return `<i class="preview-cell ${kind}" title="${e?.name||e?.type||tile}">${x===1&&y===9?'始':e?glyph(e):''}</i>`})).join('');
    const enemies=data.entities.filter(e=>e.type==='enemy'),boss=enemies.find(e=>e.boss),helper=data.entities.find(e=>e.type==='npc'&&e.npc!=='tangseng'),adventure=data.entities.find(e=>e.type==='adventure'),vault=data.entities.find(e=>e.type==='door'&&e.vault);
    const feature=boss?`此间强敌为${boss.name}，另有近卫守护法宝。`:floor===3?'熊罴镇守古镜，破阵后方可洞察群妖。':helper?`${helper.name}在此候你，或可赠予一程助力。`:adventure?`行至幽处，将遇「${adventures[adventure.adventure].title}」之缘。`:vault?`${doorName(vault.door)}门之后另藏机缘，钥匙取舍不可轻忽。`:meta.kind==='shop'?'土地古祠隐在岔路，可用功德换取修为。':meta.kind==='secret'?'石壁有异，细察或能寻得未载于图的暗格。':'此层门路交错，三色钥匙的次序决定去路。';
    showModal(`<article class="floor-preview"><header><small>第 ${String(floor).padStart(2,'0')} 难 · ${chapter.name}</small><span class="catalog-badge">${meta.badge}</span></header><h2>${meta.title}</h2><div class="preview-layout"><div><div class="preview-board" aria-label="第 ${floor} 难地图缩略图">${cells}</div><div class="preview-legend"><span>始 起点</span><span>阶 云梯</span><span>妖 妖怪</span><span>宝 法宝</span></div></div><div class="preview-copy"><p>${feature}</p><dl><div><dt>妖怪</dt><dd>${enemies.length} 只</dd></div><div><dt>封门</dt><dd>${data.entities.filter(e=>e.type==='door').length} 道</dd></div><div><dt>路径</dt><dd>${data.routeLength} 格</dd></div><div><dt>回环</dt><dd>${data.loops} 处</dd></div></dl><small>仅供观阵，不会改变当前存档。</small></div></div></article>`);
  }

  function renderTrialCatalog(){
    const root=$('#trialCatalog');if(!root)return;
    let current=1;try{const saved=JSON.parse(localStorage.getItem(SAVE_KEY));if(saved?.floor)current=Math.max(1,Math.min(TOTAL_FLOORS,saved.floor))}catch{}
    root.innerHTML=chapters.map((chapter,chapterIndex)=>{
      const start=chapterIndex*9+1,items=chapter.trials.map((_,index)=>{const floor=start+index,meta=getFloorMeta(floor),progress=floor===current?' current':floor<current?' passed':'';return `<li><button type="button" data-preview-floor="${floor}" class="catalog-trial ${meta.kind}${progress}"${floor===current?' aria-current="step"':''} aria-label="预览第 ${floor} 难：${meta.title}"><span class="catalog-number">${String(floor).padStart(2,'0')}</span><span class="catalog-name" title="${meta.title}">${meta.title}</span><span class="catalog-badge">${meta.badge}</span></button></li>`}).join('');
      return `<section class="catalog-chapter"><h2><b>${chapterIndex+1}</b>${chapter.name}<small>${chapter.floors}</small></h2><ol>${items}</ol></section>`;
    }).join('');
    root.querySelectorAll('[data-preview-floor]').forEach(button=>button.onclick=()=>showFloorPreview(Number(button.dataset.previewFloor)));
    root.querySelector('[aria-current="step"]')?.scrollIntoView({block:'center'});
  }

  function render(){
    const data=generateFloor(state.floor), chapter=chapters[Math.floor((state.floor-1)/9)], trial=getFloorTitle(state.floor);
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
    renderArtifacts();
    const neededExp=expToNext(state.level);$('#expText').textContent=`${state.exp||0} / ${neededExp}`;$('#expBar').style.width=`${Math.min(100,(state.exp||0)/neededExp*100)}%`;
    $('#floorProgressText').textContent=`${state.floor} / ${TOTAL_FLOORS}`;$('#floorProgressBar').style.width=`${state.floor/TOTAL_FLOORS*100}%`;
    const vaultDoor=data.entities.find(e=>e.type==='door'&&e.vault),mainGate=data.entities.find(e=>e.type==='door'&&e.mainGate),elite=data.entities.find(e=>e.elite);
    $('#objectiveText').textContent=state.floor===3&&!state.hasMirror?'探索支路，取得照妖镜':state.floor===81?'穿过封印，战胜如来':elite?`${elite.name}暂不可敌，可绕行后再回来挑战`:vaultDoor?`权衡路线：主门通关，${doorName(vaultDoor.door)}门藏有秘宝`:mainGate?`寻找${doorName(mainGate.door)}钥匙，破解本层路线`:'寻找通往上层的云梯';
    $('#bestiaryBtn span').textContent=state.hasMirror?'照妖镜 · 洞察全貌':'未得照妖镜 · 仅可辨名';
    document.documentElement.style.setProperty('--chapter-color',chapter.color);
    updateCompanions();renderLog();save();
  }

  function renderEntity(e){
    const n=document.createElement('span');n.className=`entity ${e.type}`;n.dataset.type=e.type;
    if(e.type==='enemy'){n.classList.add('game-sprite');if(e.elite)n.classList.add('elite-boss');if(e.boss&&!e.elite)n.classList.add('boss-unit');if(e.bossGuard)n.classList.add('boss-guard');if(e.mirrorGuardian)n.classList.add('mirror-guardian');n.style.setProperty('--sprite',`url("assets/sprites/${e.sprite}.png")`);n.title=state.hasMirror?`${e.name} HP${e.hp} 攻${e.atk} 防${e.def}`:e.name;n.setAttribute('aria-label',n.title)}
    if(e.type==='item'){
      n.classList.add(`item-${e.item}`,'ui-art','item-art');n.title=e.name;if(e.vaultKey)n.dataset.vaultKey='true';
      n.style.setProperty('--ui-art',`url("${itemArt(itemAsset(e))}")`);n.setAttribute('aria-label',e.name);
    }
    if(e.type==='door'){n.classList.add(`door-${e.door}`);n.title=`${doorName(e.door)}门 · 需要${doorName(e.door)}钥匙`;n.setAttribute('aria-label',n.title);if(e.vault)n.dataset.vault='true'}
    if(e.type==='stairs'){n.classList.add(`stairs-${e.direction}`);n.innerHTML='<i></i><i></i><i></i><i></i><i></i>';n.title=e.direction==='up'?'上楼 · 通往下一难':'下楼 · 返回上一难';n.setAttribute('aria-label',n.title)}
    if(e.type==='npc'){n.classList.add('ui-art','npc-art');n.style.setProperty('--ui-art',`url("${npcArt(e.npc)}")`);n.title=e.name;n.setAttribute('aria-label',e.name)}
    if(e.type==='shop'){n.classList.add('ui-art','npc-art','shop-art');n.style.setProperty('--ui-art',`url("${npcArt(e.npc||'landgod')}")`);n.title=e.name;n.setAttribute('aria-label',e.name)}
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
    if(e.type==='item'){if(e.sealedBy&&!state.removed[e.sealedBy]){toast(`${e.name}仍被劫主妖气封印`);sound('bump');return false}collect(e);markRemoved(e.x,e.y);sound('item');return true}
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

  const artifactCount=id=>state.artifacts?.[id]?.count||0;
  function getBattleEffects(e){
    const blade=artifactCount('three-point-blade'),rake=artifactCount('nine-tooth-rake'),kasaya=artifactCount('kasaya'),shield=artifactCount('dragon-shield');
    const armorPierce=Math.min(.36,blade*.04+(artifactCount('golden-eye')?.12:0));
    const enemyWeak=Math.min(.38,shield*.03+(artifactCount('nine-dragon-scale')?.08:0)+(artifactCount('wind-pearl')?.10:0)+(artifactCount('scorpion-pipa')?.12:0));
    const reduction=Math.min(.5,kasaya*.04+(artifactCount('chaos-armor')?.08:0)+(artifactCount('blackwind-kasaya')?.10:0)+(artifactCount('lotus-scripture')?.12:0));
    let damageBoost=artifactCount('twogas-vase')?.12:0;
    if(e.boss)damageBoost+=(artifactCount('giant-edge')?.15:0)+(artifactCount('tiger-saber')?.20:0);
    else damageBoost+=artifactCount('demon-staff')?.18:0;
    const effectiveDef=Math.max(0,Math.floor(e.def*(1-armorPierce))),heroHit=Math.max(0,Math.floor(state.atk*(1+damageBoost))-effectiveDef);
    const openingDamage=Math.min(e.hp-1,Math.floor(heroHit*Math.min(.6,rake*.1)+e.hp*(artifactCount('fire-spear')?.08:0)));
    const enemyHit=Math.max(0,Math.floor(Math.max(0,e.atk*(1-enemyWeak)-state.def)*(1-reduction)));
    const triggers=[];
    if(armorPierce)triggers.push({name:'破甲真锋',text:`金光透甲，无视 ${Math.round(armorPierce*100)}% 防御。`});
    if(openingDamage)triggers.push({name:artifactCount('fire-spear')?'真火横扫':'天蓬横扫',text:`法宝先发，开场造成 ${openingDamage} 伤害。`,damage:openingDamage});
    if(damageBoost)triggers.push({name:'伏魔神威',text:`法宝共鸣，本战伤害提高 ${Math.round(damageBoost*100)}%。`});
    if(enemyWeak||reduction)triggers.push({name:'护体神光',text:`妖力削弱 ${Math.round(enemyWeak*100)}%，所受伤害再减 ${Math.round(reduction*100)}%。`});
    return{heroHit,enemyHit,openingDamage,effectiveDef,triggers};
  }

  async function runBattle(e){
    if(busy)return false;
    const effects=getBattleEffects(e),{heroHit,enemyHit,openingDamage}=effects;
    const rounds=heroHit>0?Math.ceil(Math.max(1,e.hp-openingDamage)/heroHit):Infinity;
    const loss=Number.isFinite(rounds)?Math.max(0,(rounds-1)*enemyHit):Infinity;
    openBattleScene(e);
    if(heroHit<=0){
      busy=true;showBattleBlocked(state.hasMirror?`金箍棒无法破开 ${e.def} 点防御`:'妖气护体，暂时无法破防',state.hasMirror?`${e.name} 的防御高于你的攻击。先寻找攻击法宝，再回来挑战。`:'未得照妖镜，无法判断具体防御。先提升攻击后再试。');return false;
    }
    if(loss>=state.hp){
      busy=true;showBattleBlocked(state.hasMirror?`预计损失 ${loss} 气血`:'镜中妖气翻涌，此战必败',state.hasMirror?'此战会令悟空倒下。提升防御或补充气血后再战。':'先取得照妖镜或继续提升修为，再回来挑战。');addLog('危机',state.hasMirror?`${e.name}不可强攻，预计损失 ${loss} 气血。`:`${e.name}妖气过盛，当前不可强攻。`,'danger');return false;
    }

    busy=true;
    const visualRounds=Math.min(rounds,6),startHeroHp=state.hp;
    let completed=0,shownHeroHp=startHeroHp,shownEnemyHp=e.hp-openingDamage;
    for(const trigger of effects.triggers){$('#battleScene').classList.add('artifact-skill');appendBattleLog(`法宝·${trigger.name}`,trigger.text,'artifact');if(trigger.damage){showDamage('#enemyDamage',trigger.damage);updateBattleHp('Enemy',shownEnemyHp,e.hp)}await wait(240);$('#battleScene').classList.remove('artifact-skill')}
    for(let i=0;i<visualRounds;i++){
      const nextCompleted=Math.max(completed+1,Math.round((i+1)*rounds/visualRounds));
      const attacks=nextCompleted-completed;
      const dealt=Math.min(shownEnemyHp,heroHit*attacks);
      $('#battleHeroWrap').classList.add('attacking');sound('battle');await wait(150);
      $('#battleHeroWrap').classList.remove('attacking');$('#battleEnemyWrap').classList.add('hit');showDamage('#enemyDamage',dealt);
      shownEnemyHp=Math.max(0,e.hp-openingDamage-heroHit*nextCompleted);updateBattleHp('Enemy',shownEnemyHp,e.hp);
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
    const atkGain=e.elite?(bonus.atk||0):e.boss?10+Math.floor(state.floor/9)*3:0;
    const defGain=e.elite?(bonus.def||0):e.boss?7+Math.floor(state.floor/9)*2:0;
    const hpGain=bonus.hp||0,redGain=bonus.red||0;
    const xpGain=e.elite?60+state.floor*4:e.boss?18+state.floor*2:5+Math.ceil(state.floor/4);
    state.hp-=loss;state.coin+=e.coin;state.atk+=atkGain;state.def+=defGain;state.maxHp+=hpGain;state.hp+=hpGain;state.keys.red+=redGain;
    const progress=gainExperience(xpGain);markRemoved(e.x,e.y);
    addLog('胜战',`击败${e.name}，损失 ${loss} 气血，获得 ${e.coin} 功德。`,loss>state.maxHp*.18?'danger':'good');save();
    $('#battleKicker').textContent=e.elite?'远古劫主已伏':e.boss?'大难已破':'战斗胜利';
    $('#battleReward').innerHTML=`<strong>胜利奖励</strong>${e.relic?`<div class="boss-relic-preview"><i style="--relic-art:url('${itemArt(e.relic.art)}')"></i><span>封印解除<br><b>${e.relic.name}</b>可拾取</span></div>`:''}<div><span>功德 <b>+${e.coin}</b></span><span>修为 <b>+${xpGain}</b></span><span>战斗损伤 <b>-${loss}</b></span>${e.boss?`<span>攻击 <b>+${atkGain}</b></span><span>防御 <b>+${defGain}</b></span>`:''}${hpGain?`<span>气血上限 <b>+${hpGain}</b></span>`:''}${redGain?`<span>红钥匙 <b>+${redGain}</b></span>`:''}${progress.levels?`<span>等级 <b>+${progress.levels}</b></span>`:''}</div>`;
    $('#battleReward').classList.remove('hidden');
    const done=$('#battleContinue');done.textContent=e.boss?'击破封印 · 收取法宝':'收下奖励';done.classList.remove('hidden');done.onclick=()=>{closeBattleScene();state.pos={x:e.x,y:e.y};state.steps++;busy=false;render();if(redGain)showKeyNotice('red');if(progress.levels)setTimeout(()=>showGainEffect('level','修为提升',`等级提升至 LV ${state.level}`),redGain?450:0)};
    return false;
  }

  function openBattleScene(e){
    $('#battleScene').classList.remove('hidden');$('#battleKicker').textContent=`第 ${state.floor} 难 · 遭遇战`;
    $('#battleEnemyName').textContent=e.name;$('#battleEnemyType').textContent=e.elite?'远古劫主 · 可绕行':e.boss?'本层劫主':e.mirrorGuardian?'照妖镜守护者':e.bossGuard?'劫主亲卫':e.vaultGuard?'藏宝室守卫':'拦路妖怪';
    $('#battleEnemySprite').style.setProperty('--sprite',`url("assets/sprites/${e.sprite}.png")`);
    $('#battleHeroStats').textContent=`攻 ${state.atk}　防 ${state.def}`;$('#battleEnemyStats').textContent=state.hasMirror?`攻 ${e.atk}　防 ${e.def}`:'照妖镜未取得 · 数值不明';
    document.querySelector('.enemy-hp').classList.toggle('unknown',!state.hasMirror);$('#battleHeroMax').textContent=state.maxHp;$('#battleEnemyMax').textContent=state.hasMirror?e.hp:'?';updateBattleHp('Hero',state.hp,state.maxHp);updateBattleHp('Enemy',e.hp,e.hp);
    $('#battleLog').innerHTML='<div class="battle-log-line"><b>交锋</b><span>悟空与妖怪狭路相逢。</span></div>';
    $('#battleReward').classList.add('hidden');$('#battleReward').innerHTML='';$('#battleContinue').classList.add('hidden');
  }

  function showBattleBlocked(title,text){
    $('#battleKicker').textContent='暂不可敌';$('#battleLog').innerHTML=`<div class="battle-warning"><strong>${title}</strong><p>${text}</p></div>`;
    const done=$('#battleContinue');done.textContent='暂且退避';done.classList.remove('hidden');done.onclick=()=>{closeBattleScene();busy=false};sound('bump');
  }

  function closeBattleScene(){$('#battleScene').classList.add('hidden');$('#battleHeroWrap').className='battle-sprite-wrap';$('#battleEnemyWrap').className='battle-sprite-wrap'}
  function updateBattleHp(side,value,max){if(side==='Enemy'&&!state.hasMirror){$(`#battle${side}Hp`).textContent='?';$(`#battle${side}Bar`).style.width='100%';return}$(`#battle${side}Hp`).textContent=Math.max(0,Math.floor(value));$(`#battle${side}Bar`).style.width=`${Math.max(0,Math.min(100,value/max*100))}%`}
  function appendBattleLog(title,text,type){const line=document.createElement('div');line.className=`battle-log-line ${type}`;line.innerHTML=`<b>${title}</b><span>${text}</span>`;$('#battleLog').appendChild(line);$('#battleLog').scrollTop=$('#battleLog').scrollHeight}
  function showDamage(selector,value){const n=$(selector);n.textContent=typeof value==='number'?`-${value}`:value;n.classList.remove('pop');void n.offsetWidth;n.classList.add('pop')}
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

  function registerArtifact(e){
    state.artifacts=state.artifacts||{};
    const id=e.artifactId||e.art||(e.item==='mirror'?'demon-mirror':null),definition=artifactBook[id]||{name:e.name,art:e.art,skill:'灵蕴加身',detail:'攻防与气血获得永久提升。'};
    const owned=state.artifacts[id]||{id,count:0};owned.count++;state.artifacts[id]=owned;
    const reward=e.reward||{atk:definition.atk||0,def:definition.def||0,hp:definition.hp||0};
    owned.bonus=owned.bonus||{atk:0,def:0,hp:0};owned.bonus.atk+=reward.atk||0;owned.bonus.def+=reward.def||0;owned.bonus.hp+=reward.hp||0;
    state.atk+=reward.atk||0;state.def+=reward.def||0;state.maxHp+=reward.hp||0;state.hp+=reward.hp||0;
    return{id,definition,reward,count:owned.count};
  }

  function collect(e){
    const scale=1+Math.floor(state.floor/12);
    if(e.item==='mirror'){state.hasMirror=true;registerArtifact({...e,artifactId:'demon-mirror'});showGainEffect('mirror','照妖镜',`洞察真形 · 妖鉴显示完整数值`,'demon-mirror');addLog('神器','获得照妖镜，已收入法宝栏。','good')}
    else if(e.item==='bossRelic'){const gained=registerArtifact(e),reward=gained.reward;showGainEffect('relic',e.name,`${gained.definition.skill}　攻 +${reward.atk||0}　防 +${reward.def||0}　气血 +${reward.hp||0}`,e.art);addLog('劫主法宝',`收服${e.name}，获得技能「${gained.definition.skill}」。`,'good')}
    else if(e.item==='potion'){const gain=120*scale;state.hp+=gain;state.maxHp=Math.max(state.maxHp,state.hp);showGainEffect('peach','大蟠桃',`气血 +${gain}`,'peach');addLog('仙果',`蟠桃恢复 ${gain} 气血。`,'good')}
    else if(e.item==='gemAtk'||e.item==='gemDef'){const gained=registerArtifact(e),reward=gained.reward;showGainEffect(e.item==='gemAtk'?'attack':'defense',gained.definition.name,`${gained.definition.skill} · 第 ${gained.count} 层　攻 +${reward.atk||0}　防 +${reward.def||0}　气血 +${reward.hp||0}`,e.art);addLog('法宝',`${gained.definition.name}收入法宝栏，「${gained.definition.skill}」叠至 ${gained.count} 层。`,'good')}
    else{state.keys[e.item]++;addLog('拾取',`获得一把${doorName(e.item)}钥匙。`,'good');showKeyNotice(e.item)}
  }

  function meetHelper(e){
    const reward=e.reward||{};for(const [k,v] of Object.entries(reward)){if(k==='yellow'||k==='blue'||k==='red'){state.keys[k]+=v;showKeyNotice(k)}else{state[k]+=v;if(k==='hp')state.maxHp=Math.max(state.maxHp,state.hp)}}
    if(['bajie','shaseng','bailong'].includes(e.npc)&&!state.companions.includes(e.npc))state.companions.push(e.npc);
    ui.oracle.textContent=`${e.name}：${e.text}`;addLog('相助',`${e.name}略施援手。`,'good');toast(`${e.name}送来一份助力`);sound('helper');
  }

  function openShop(){
    const atkCost=30+Math.floor(state.floor/10)*8,defCost=30+Math.floor(state.floor/10)*8,hpCost=22+Math.floor(state.floor/10)*6;
    showModal(`<div class="shop-heading"><span class="ui-art npc-art shop-portrait" style="--ui-art:url('${npcArt('landgod')}')"></span><div><h2>土地庙</h2><p>土地公捻须道：功德可换些仙缘，但切莫贪多。</p></div></div><div class="modal-actions shop-offers"><button class="pixel-btn" data-buy="atk" data-cost="${atkCost}"><i class="shop-offer-art" style="--offer-art:url('${itemArt('three-point-blade')}')"></i>攻击 +12<br><small>${atkCost} 功德</small></button><button class="pixel-btn" data-buy="def" data-cost="${defCost}"><i class="shop-offer-art" style="--offer-art:url('${itemArt('dragon-shield')}')"></i>防御 +10<br><small>${defCost} 功德</small></button><button class="pixel-btn" data-buy="hp" data-cost="${hpCost}"><i class="shop-offer-art" style="--offer-art:url('${itemArt('peach')}')"></i>气血 +500<br><small>${hpCost} 功德</small></button></div>`);
    ui.modalContent.querySelectorAll('[data-buy]').forEach(btn=>btn.onclick=()=>{const cost=+btn.dataset.cost;if(state.coin<cost){toast('功德不足');return}state.coin-=cost;if(btn.dataset.buy==='atk')state.atk+=12;if(btn.dataset.buy==='def')state.def+=10;if(btn.dataset.buy==='hp'){state.hp+=500;state.maxHp+=500}addLog('土地庙','以功德换得一份仙缘。','good');closeModal();render()});
  }

  function showBestiary(){
    const enemies=generateFloor(state.floor).entities.filter(e=>e.type==='enemy');
    if(!state.hasMirror){const rows=enemies.length?enemies.map(e=>`<div class="monster-row obscured"><span class="mini-enemy game-sprite" style="--sprite:url('assets/sprites/${e.sprite}.png')"></span><div><b>${e.name}</b><small>${e.elite?'远古劫主':e.boss?'本层劫主':e.mirrorGuardian?'照妖镜守护者':e.bossGuard?'劫主亲卫':e.vaultGuard?'藏宝室守卫':'拦路妖怪'}</small></div><span class="mirror-unknown">妖气遮蔽</span></div>`).join(''):'<p>本层妖气已清。</p>';showModal(`<h2>本层妖鉴</h2><div class="mirror-lock"><span class="ui-art item-art" style="--ui-art:url('${itemArt('demon-mirror')}')"></span><p>尚未取得照妖镜，只能辨认妖怪名号。照妖镜由第三难支路中的镇镜熊罴守护。</p></div>${rows}`);return}
    const rows=enemies.length?enemies.map(e=>{const effects=getBattleEffects(e),hit=effects.heroHit,rounds=hit>0?Math.ceil(Math.max(1,e.hp-effects.openingDamage)/hit):Infinity,loss=hit>0?Math.max(0,(rounds-1)*effects.enemyHit):Infinity;return `<div class="monster-row"><span class="mini-enemy game-sprite" style="--sprite:url('assets/sprites/${e.sprite}.png')"></span><div><b>${e.name}</b><small>${e.elite?'远古劫主 · 可绕行':e.boss?'本层劫主':e.mirrorGuardian?'照妖镜守护者':e.bossGuard?'劫主亲卫':e.vaultGuard?'藏宝室守卫':'拦路妖怪'}</small></div><span><small>气血</small>${e.hp}</span><span><small>攻/防</small>${e.atk}/${e.def}</span><span><small>功德</small>${e.coin}</span><span class="loss"><small>法宝后损伤</small>${Number.isFinite(loss)?loss:'不可破防'}</span></div>`}).join(''):'<p>本层妖气已清。</p>';
    showModal(`<h2>本层妖鉴</h2><p>战斗自动结算。你先出手；敌人每轮反击，最后一击后不会反击。</p>${rows}`);
  }

  function showMenu(){showModal(`<h2>行者歇脚</h2><p>进度已自动保存在浏览器中。当前第 ${state.floor} 难，已行 ${state.steps} 步。</p><div class="modal-actions"><button class="pixel-btn" data-action="resume">继续游戏</button><button class="pixel-btn" data-action="save">手动存档</button><button class="pixel-btn" data-action="title">返回标题</button><button class="pixel-btn" data-action="restart">重开此世</button></div>`);ui.modalContent.querySelector('[data-action=resume]').onclick=closeModal;ui.modalContent.querySelector('[data-action=save]').onclick=()=>{save();toast('前缘已记入天命卷');closeModal()};ui.modalContent.querySelector('[data-action=title]').onclick=()=>{closeModal();ui.game.classList.add('hidden');ui.title.classList.remove('hidden');pauseBgm();renderTrialCatalog()};ui.modalContent.querySelector('[data-action=restart]').onclick=()=>{if(confirm('确定抹去当前进度，从第一难重新开始？'))startNew()}}
  function showHelp(){showModal(`<h2>西行要诀</h2><p><b>移动：</b>使用 WASD、方向键或屏幕方向按钮。<br><b>照妖镜：</b>未取得前，妖鉴只能显示妖怪名称，战斗中也看不到敌方攻防和气血条。照妖镜藏在第三难。<br><b>法宝栏：</b>获得的法宝会永久收入左侧法宝栏。重复获得可叠加层数，点击图标可查看属性和技能。<br><b>法宝技能：</b>破甲、横扫、佛光和龙鳞等技能会自动参与战斗，并在战斗记录中显示触发效果。<br><b>战斗：</b>撞向妖怪会进入战斗场景。攻击必须高于妖怪防御；无法取胜时只能暂且退避。<br><b>劫主：</b>章节Boss由亲卫守护，身边法宝受妖气封印。击败Boss可获得更高属性奖励，并解除专属法宝封印。<br><b>路线：</b>每层由主路线、支路和少量回路组成。封印门位于关键通道，先探索门前区域、取得同色钥匙，再决定是否绕路取宝。<br><b>藏宝门：</b>每三层会出现一座可选藏宝室。钥匙必在门外，开门后仍需面对守卫才能取得秘宝。<br><b>探索：</b>留意地砖上极细的裂纹，也不要错过紫色星光。前者可能藏有宝物，后者会触发有选择的奇遇。<br><b>存档：</b>每一步都会自动保存。</p>`)}

  function winGame(){state.won=true;save();sound('win');const minutes=Math.max(1,Math.floor((Date.now()-state.startedAt)/60000));showModal(`<div class="ending-art"></div><h2>八十一难 · 功德圆满</h2><p>金箍棒停在佛掌之前。悟空终于明白，最后一战并非弑佛，而是打破心中最后的执念。如来让开雷音寺门，唐僧重获自由，师徒再踏归途。</p><p>通关记录：${state.steps} 步 · ${minutes} 分钟 · 剩余气血 ${Math.floor(state.hp)}</p><div class="modal-actions"><button class="pixel-btn primary" data-action="again">再历一世</button><button class="pixel-btn" data-action="title">返回标题</button></div>`);ui.modalContent.querySelector('[data-action=again]').onclick=startNew;ui.modalContent.querySelector('[data-action=title]').onclick=()=>{closeModal();ui.game.classList.add('hidden');ui.title.classList.remove('hidden');pauseBgm();renderTrialCatalog()}}

  function updateCompanions(){document.querySelectorAll('.companion').forEach(n=>{const active=state.companions.includes(n.dataset.id);n.classList.toggle('locked',!active);if(active)n.querySelector('small').textContent='已结缘 · 偶尔相助'})}
  function renderArtifacts(){
    const root=$('#artifactBar');if(!root)return;state.artifacts=state.artifacts||{};
    const collected=Object.values(state.artifacts).filter(entry=>entry.count>0),mirrorOwned=!!state.artifacts['demon-mirror'];
    const entries=[{id:'demon-mirror',count:mirrorOwned?state.artifacts['demon-mirror'].count:0,locked:!mirrorOwned},...collected.filter(entry=>entry.id!=='demon-mirror')];
    const emptyCount=Math.max(0,6-entries.length),total=collected.reduce((sum,entry)=>sum+entry.count,0);$('#artifactCount').textContent=total;
    root.innerHTML=entries.map(entry=>{const item=artifactBook[entry.id]||{name:entry.id,art:entry.id,skill:'未知灵蕴'},locked=entry.locked?' locked':'';return `<button class="artifact-slot${locked}" type="button" data-artifact="${entry.id}" title="${entry.locked?'尚未取得照妖镜':`${item.name} · ${item.skill}`}" ${entry.locked?'disabled':''}><i style="--artifact-art:url('${itemArt(item.art)}')"></i><span>${item.name}</span>${entry.count>1?`<b>×${entry.count}</b>`:''}</button>`}).join('')+Array.from({length:emptyCount},()=>'<span class="artifact-slot empty" aria-hidden="true"><i></i><span>未得</span></span>').join('');
    root.querySelectorAll('[data-artifact]').forEach(button=>button.onclick=()=>showArtifactDetail(button.dataset.artifact));
  }
  function showArtifactDetail(id){
    const item=artifactBook[id],entry=state.artifacts?.[id];if(!item||!entry)return;
    const bonus=entry.bonus||{},stats=[bonus.atk?`攻击总计 +${bonus.atk}`:item.atk?`攻击 +${item.atk}/层`:'',bonus.def?`防御总计 +${bonus.def}`:item.def?`防御 +${item.def}/层`:'',bonus.hp?`气血总计 +${bonus.hp}`:item.hp?`气血 +${item.hp}/层`:''].filter(Boolean).join('　')||'特殊功能法宝';
    showModal(`<div class="artifact-detail"><span class="artifact-detail-art" style="--artifact-art:url('${itemArt(item.art)}')"></span><div><small>已炼化 ${entry.count} 层</small><h2>${item.name}</h2><strong>${item.skill}</strong><p>${item.detail}</p><em>${stats}</em></div></div>`);
  }
  function addLog(title,text,type=''){state.log.unshift({title,text,type});state.log=state.log.slice(0,20)}
  function renderLog(){ui.log.innerHTML=state.log.map(x=>`<div class="log-entry ${x.type}"><b>${x.title}</b> · ${x.text}</div>`).join('')||'<div class="log-entry">天命卷尚无记载。</div>'}
  function doorName(k){return{yellow:'黄',blue:'蓝',red:'红'}[k]}
  function showKeyNotice(kind){
    clearTimeout(keyNoticeTimer);const notice=$('#keyNotice');notice.className=`key-notice ${kind}`;
    $('.big-key').style.setProperty('--key-art',`url("${itemArt(`key-${kind}`)}")`);
    $('#keyNoticeName').textContent=`${doorName(kind)}钥匙`;$('#keyNoticeCount').textContent=state.keys[kind];
    void notice.offsetWidth;notice.classList.add('show');keyNoticeTimer=setTimeout(()=>{notice.classList.remove('show');setTimeout(()=>notice.classList.add('hidden'),260)},2100);
  }
  function showGainEffect(kind,title,detail,art){
    clearTimeout(effectTimer);const effect=$('#itemEffect');effect.className=`item-effect ${kind}`;
    const icon=$('#effectIcon');icon.innerHTML='';icon.style.setProperty('--effect-art',`url("${itemArt(art||(kind==='level'?'kasaya':'peach'))}")`);
    $('#effectTitle').textContent=title;$('#effectDetail').textContent=detail;void effect.offsetWidth;effect.classList.add('show');
    effectTimer=setTimeout(()=>{effect.classList.remove('show');setTimeout(()=>effect.classList.add('hidden'),220)},1500);
  }
  function toast(text){clearTimeout(toastTimer);ui.toast.textContent=text;ui.toast.classList.add('show');toastTimer=setTimeout(()=>ui.toast.classList.remove('show'),1800)}
  function showModal(html){ui.modalContent.innerHTML=html;ui.modal.classList.remove('hidden')}
  function closeModal(){ui.modal.classList.add('hidden')}
  function save(){if(state)localStorage.setItem(SAVE_KEY,JSON.stringify(state));$('#continueBtn').disabled=!localStorage.getItem(SAVE_KEY)}
  function load(){try{return JSON.parse(localStorage.getItem(SAVE_KEY))}catch{return null}}
  function enterGame(){ui.title.classList.add('hidden');ui.game.classList.remove('hidden');closeModal();$('#battleScene').classList.add('hidden');$('#itemEffect').classList.add('hidden');$('#floorTransition').classList.add('hidden');busy=false;render();syncBgm()}
  function startNew(){state=freshState();state.log=[{title:'启程',text:'悟空闯入八十一难塔，誓要救回唐僧。',type:'good'}];const bgm=$('#bgm');bgm.currentTime=0;bgmStarted=false;enterGame()}
  function continueGame(){state=load();if(!state){startNew();return}if(typeof state.hasMirror!=='boolean')state.hasMirror=false;state.artifacts=state.artifacts||{};if(state.hasMirror&&!state.artifacts['demon-mirror'])state.artifacts['demon-mirror']={id:'demon-mirror',count:1};enterGame()}

  let audioCtx;
  function syncBgm(){
    const bgm=$('#bgm');bgm.volume=.24;
    if(audioOn&&!ui.game.classList.contains('hidden')){const playback=bgm.play();if(playback)playback.then(()=>{bgmStarted=true;$('#soundBtn').classList.remove('needs-gesture');$('#soundBtn').setAttribute('aria-label','切换声音')}).catch(()=>{bgmStarted=false;$('#soundBtn').classList.add('needs-gesture');$('#soundBtn').setAttribute('aria-label','点击开启背景音乐')})}
    else bgm.pause();
  }
  function pauseBgm(){const bgm=$('#bgm');if(!bgm.paused)bgm.pause()}
  function sound(type){if(!audioOn)return;try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();const freq={step:130,bump:80,item:620,door:210,stairs:440,battle:95,helper:520,win:740}[type]||220;o.type=type==='battle'?'sawtooth':'square';o.frequency.setValueAtTime(freq,audioCtx.currentTime);if(type==='win')o.frequency.exponentialRampToValueAtTime(1180,audioCtx.currentTime+.35);g.gain.setValueAtTime(.035,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+(type==='win'?.5:.09));o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+(type==='win'?.5:.1))}catch{}}

  renderTrialCatalog();
  $('#newGameBtn').onclick=startNew;$('#continueBtn').onclick=continueGame;$('#continueBtn').disabled=!localStorage.getItem(SAVE_KEY);
  $('#bestiaryBtn').onclick=showBestiary;$('#menuBtn').onclick=showMenu;$('#helpBtn').onclick=showHelp;
  $('#soundBtn').onclick=e=>{if(audioOn&&e.currentTarget.classList.contains('needs-gesture')){syncBgm();toast('正在开启背景音乐');return}audioOn=!audioOn;e.currentTarget.textContent=audioOn?'♪':'×';syncBgm();toast(audioOn?'背景音乐与音效已开启':'声音已关闭')};
  $('#clearLogBtn').onclick=()=>{state.log=[];renderLog()};
  document.querySelectorAll('[data-close-modal]').forEach(n=>n.onclick=closeModal);
  document.querySelectorAll('.mobile-controls button').forEach(n=>n.onclick=()=>{const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[n.dataset.dir];move(...d)});
  window.addEventListener('keydown',e=>{if(busy){e.preventDefault();return}const map={ArrowUp:[0,-1],w:[0,-1],W:[0,-1],ArrowDown:[0,1],s:[0,1],S:[0,1],ArrowLeft:[-1,0],a:[-1,0],A:[-1,0],ArrowRight:[1,0],d:[1,0],D:[1,0]};if(map[e.key]){e.preventDefault();move(...map[e.key])}else if(e.key==='Escape'){ui.modal.classList.contains('hidden')&&state?showMenu():closeModal()}else if(e.key==='e'||e.key==='E')showBestiary()});
})();
