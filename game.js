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
    {sprite:'yin',name:'寅将军',icon:'寅',hp:380,atk:55,def:18,coin:35,color:'#d58a32',
      intro:'山君设宴，客便是肉。猴头，你也来添一道菜？',
      defeat:'青烟散尽，俺老孙才晓得——这第一难怕的不是死，是再也回不去花果山。'},
    {sprite:'blackbear',name:'黑熊精',icon:'黑',hp:900,atk:105,def:40,coin:60,color:'#6f6251',
      intro:'这袈裟佛光万丈，凭什么是那和尚的，凭什么不是俺的？',
      defeat:'贪一件宝，便丢一座山。原来这黑风山，困的是俺自家的贪心。'},
    {sprite:'yellowking',name:'黄风大圣',icon:'黄',hp:1700,atk:175,def:70,coin:85,color:'#c7a13d',
      intro:'一口三昧神风，吹灭你心头那盏灯，看你还认不认得路！',
      defeat:'风停了，俺却越看越糊涂——这塔里要救的，当真是师父么？'},
    {sprite:'shaseng',name:'沙悟净',icon:'沙',hp:2500,atk:245,def:102,coin:100,color:'#4e849c',flag:'shaRedeemed',
      intro:'九颗骷髅挂在颈上，都是俺吞过的取经人。大师兄，你敢说自己没造过杀业？',
      defeat:'流沙翻涌，真沙僧接过宝杖：「那不是我，那是俺不愿想起的旧我。多谢大师兄，替俺了断了它。」'},
    {sprite:'redboy',name:'红孩儿',icon:'红',hp:3700,atk:340,def:145,coin:130,color:'#e14934',
      intro:'还记得三昧真火烧得你睁不开眼么？这把火，专烧不肯认输的猴子！',
      defeat:'火灭了，俺攥着这股烧不尽的旧恨，忽然不知该烧向谁。',
      revelation:'大圣，息怒。这座塔里，从没有妖怪掳走唐僧——唐僧从未被掳。是你压在五行山下那五百年里咽不下的一口气，化成了这座塔。你打过的每一难，都是你自己。'},
    {sprite:'scorpionqueen',name:'蝎子精',icon:'蝎',hp:5200,atk:455,def:195,coin:160,color:'#a0447e',
      intro:'留下吧。不必取经，不必成佛，在这西梁国，做一回不是齐天大圣的人。',
      defeat:'倒马毒桩崩碎。最难斩的，从来不是恨，是舍不得。'},
    {sprite:'peng',name:'金翅大鹏',icon:'鹏',hp:7200,atk:590,def:258,coin:210,color:'#bd8b3e',
      intro:'俺是佛祖的舅父，三界想吃谁便吃谁。你那点取经的念想，在俺眼里不过一口饭。',
      defeat:'翅再快也飞不出这方塔。原来连绝望，都是俺自个儿生出来的。'},
    {sprite:'hundredeye',name:'百眼魔君',icon:'眼',hp:9800,atk:760,def:340,coin:270,color:'#8860a2',
      intro:'千只眼看尽你七情六欲——喜怒哀惧爱恶欲，哪一根丝，是你舍得剪的？',
      defeat:'金光散尽。看清了，也就不怕了。'},
    {sprite:'buddha',name:'如来佛祖',icon:'佛',hp:16000,atk:820,def:520,coin:999,color:'#e5b94f',final:true,
      intro:'悟空，你举着这条棒子打上灵山，是要救人，还是要弑佛？',
      defeat:'法相崩散的刹那，那张脸缓缓回头——竟与你自己，有七八分像。'}
  ];

  const helpers = {
    12:{id:'bajie',name:'猪八戒',text:'猴哥，老猪也想散伙回高老庄……可这一回，就帮你扫开些妖气！九齿钉耙拿去使。',reward:{atk:12,hp:220}},
    24:{id:'taibai',name:'太白金星',text:'大圣，此处妖风厉害。天机可借，心机难测——这三把钥匙，收好了。',reward:{yellow:2,blue:1}},
    30:{id:'shaseng',name:'沙悟净',text:'大师兄，流沙河底炼得一身硬骨，分你三分护体罡气。',reward:{def:22,hp:350}},
    45:{id:'bailong',name:'小白龙',text:'大师兄，我曾是纵火烧明珠的逆子，今日只愿做你脚下一片云。乘我破火云而去。',reward:{def:32,red:1}},
    60:{id:'bajie',name:'猪八戒',text:'猴哥，前头狮驼岭进得去出不来，三个魔王不好惹。这几颗仙桃，你先垫垫肚子。',reward:{hp:1000}},
    69:{id:'taibai',name:'太白金星',text:'八十一难已近圆满。莫执着于一时胜负——金丹赠你，可这条路，终究要你自己走完。',reward:{atk:45,def:45,hp:1200}},
    78:{id:'shaseng',name:'沙悟净',text:'大师兄，师父就在前方。我们只能送你到这里了。',reward:{atk:65,def:55,hp:1600}}
  };

  const mentors = {
    8:{id:'bodhi',name:'菩提祖师',title:'斜月三星 · 故师一指',text:'悟空，筋斗不是为逃难，是为记得自己走过的路。',skillId:'somersault-cloud'},
    16:{id:'guanyin',name:'观音菩萨',title:'慈悲为箍 · 桀骜为锋',text:'这道金箍既约束你，也逼你在疼痛中守住本心。',artifactId:'tight-fillet'},
    35:{id:'guanyin',name:'观音菩萨',title:'杨柳垂露 · 三毫救命',text:'三根毫毛，只救你三次。真正能渡劫的，仍是你自己。',skillId:'rescue-hair'}
  };

  const adventures = [
    {title:'月下古井',text:'井底传来龙吟，水面浮着一枚龙宫旧印——像极了你不肯丢下的某段旧事。',a:'跃入井中探宝',b:'投下一枚功德问路'},
    {title:'无字石碑',text:'碑上本无一字，金箍棒靠近时却显出淡淡佛光，仿佛在问你来此究竟为何。',a:'以金箍棒叩碑',b:'静坐参悟片刻'},
    {title:'菩提残影',text:'那道斜月三星的背影一闪而过，只留下半句未尽的口诀。原来故师，始终在看着你。',a:'追上残影',b:'留在原地默记口诀'},
    {title:'通天老龟',text:'老龟驮着一只上锁的铜匣，问你是否还记得当年托它问佛的那桩心事。',a:'坦言相告',b:'用火眼金睛看铜匣'}
  ];

  const eliteBosses = {
    4:{sprite:'bear',name:'混世魔王',icon:'魔',hp:2400,atk:170,def:80,coin:180,color:'#b66c42',boss:true,elite:true,reward:{atk:18,def:12,hp:800,red:1},
      intro:'花果山的猴子，离了金箍棒，你还是不是齐天大圣？',
      defeat:'混世玄甲归你。记住——逞强与逞勇之间，差着一整座山。（拾得一片心魔残片）'},
    11:{sprite:'yin',name:'巨灵神将',icon:'巨',hp:5200,atk:330,def:170,coin:320,color:'#c49a45',boss:true,elite:true,reward:{atk:32,def:24,hp:1600,red:1},
      intro:'当年天庭拿你，俺是头一个被你打跑的。这一回，俺要讨回那点颜面。',
      defeat:'神锋认主。旧日的敌人，也能照出今日的你。（拾得一片心魔残片）'},
    17:{sprite:'dragon',name:'九头妖王',icon:'九',hp:9800,atk:560,def:290,coin:520,color:'#58a49d',boss:true,elite:true,reward:{atk:55,def:42,hp:2600,red:2},
      intro:'九颗头颅九张嘴，专说你不敢听的那些话。',
      defeat:'九首垂地。你既听见了，便不必再怕了。（拾得一片心魔残片）'}
  };

  const artifactBook = {
    'demon-mirror':{name:'照妖镜',art:'demon-mirror',skill:'洞察真形',detail:'开启妖鉴完整数值，并在开战前判断胜负与预计损伤。'},
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
    'lotus-scripture':{name:'莲台真经',art:'lotus-scripture',skill:'莲台不灭',detail:'额外减免 12% 所受伤害。'},
    'tight-fillet':{name:'紧箍咒',art:'tight-fillet',atk:28,skill:'紧箍催战',detail:'攻击永久 +28；每场战斗有 22% 概率反噬，损失 8% 最大气血。照妖镜无法预知反噬。'}
  };

  const skillBook = {
    'somersault-cloud':{name:'筋斗云',art:'somersault-cloud',teacher:'菩提祖师',detail:'腾云返回本次西行已经到达过的任意关卡，不会开启尚未走到的难关。',active:true},
    'fiery-eyes':{name:'火眼金睛',art:'fiery-eyes',teacher:'八卦炉余火',detail:'照见地图暗格，并在战斗中额外无视妖怪 6% 防御。'},
    'rescue-hair':{name:'三根救命毫毛',art:'rescue-hair',teacher:'观音菩萨',detail:'本次西行共三根。战败时自动消耗一根，恢复 35% 最大气血并脱离战斗。'}
  };

  const $ = s => document.querySelector(s);
  const npcArt = id => `assets/npcs/${id}.png`;
  const itemArt = id => `assets/items/${id}.png`;
  const itemAsset = e => ({yellow:'key-yellow',blue:'key-blue',red:'key-red',potion:'peach'}[e.item]||e.art);
  const sixEarBoss = {
    sprite:'sixear',name:'六耳猕猴',icon:'耳',hp:13800,atk:875,def:455,coin:888,color:'#6c426f',boss:true,hiddenBoss:true,
    intro:'你打不过我，因为我就是你不肯承认的那一半。你有的记忆、神通和不甘，我一样不少。',
    defeat:'六耳伏地，黑甲化作飞灰。原来所谓二心，从来不是另一个我——只是我不肯承认的自己。'
  };
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
      keys:{yellow:0,blue:0,red:0},removed:{},companions:[],artifacts:{},skills:{},visitedFloors:[1],hasMirror:false,steps:0,flags:{shards:0,revealed:false,shaRedeemed:false,lionCamelSeen:false,sixEarDefeated:false},startedAt:Date.now(),log:[],won:false};
  }

  function freshDebugState(floor=1){
    const next=freshState();return{...next,floor,pos:{x:1,y:9},hp:99999,maxHp:99999,atk:9999,def:9999,coin:9999,level:81,
      keys:{yellow:99,blue:99,red:99},skills:{'somersault-cloud':{id:'somersault-cloud'},'fiery-eyes':{id:'fiery-eyes'},'rescue-hair':{id:'rescue-hair',charges:3}},visitedFloors:Array.from({length:TOTAL_FLOORS},(_,i)=>i+1),hasMirror:true,debug:true,flags:{shards:3,revealed:true,shaRedeemed:true,lionCamelSeen:false,sixEarDefeated:false},log:[{title:'调试模式',text:`已传送至第 ${floor} 难；调试进度不会覆盖正式存档。`,type:'good'}]};
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
    const makeFinalCheckpoint=()=>{for(let i=originalRoute.length-3;i>=4;i--){const boss=originalRoute[i],entry=originalRoute[i-1];if(occupied.has(pointKey(...boss))||occupied.has(pointKey(...entry)))continue;const sides=directions.map(([dx,dy])=>[boss[0]+dx,boss[1]+dy]).filter(([x,y])=>inside(x,y)&&!routeSet.has(pointKey(x,y))&&!occupied.has(pointKey(x,y)));if(sides.length<2)continue;for(const [x,y] of sides.slice(0,2))grid[y][x]='floor';return{boss,entry,guard:sides[0],relic:sides[1]}}return makeBossChamber()};
    const makePrisonerCorner=()=>{const corners=[[1,1],[9,1],[1,9],[9,9]],cornerDistance=([x,y])=>Math.min(...corners.map(([cx,cy])=>Math.abs(x-cx)+Math.abs(y-cy))),candidates=floorCells().filter(([x,y])=>!routeSet.has(pointKey(x,y))&&!occupied.has(pointKey(x,y))).sort((a,b)=>cornerDistance(a)-cornerDistance(b)||floorNeighbors(...a).length-floorNeighbors(...b).length);for(const prisoner of candidates){const guards=floorNeighbors(...prisoner).filter(([x,y])=>!routeSet.has(pointKey(x,y))&&!occupied.has(pointKey(x,y)));if(guards.length)return{prisoner,guard:guards[0]}}return null};
    const bossIndex=floor%9===0?floor/9-1:-1;
    if(bossIndex>=0){
      const relic={...bossRelicBook[bossIndex],reward:{atk:22+bossIndex*7,def:14+bossIndex*6,hp:650+bossIndex*320}};
      const chamber=floor===81?makeFinalCheckpoint():makeBossChamber();
      if(chamber){
        const seal=`${floor}:${chamber.boss[0]}:${chamber.boss[1]}`;
        addFixed(...chamber.boss,'enemy',{...bosses[bossIndex],boss:true,bossChamber:true,relic});
        addFixed(...chamber.entry,'enemy',{...enemyBook[Math.max(0,tier-1)],bossGuard:true});
        addFixed(...chamber.guard,'enemy',{...enemyBook[Math.max(0,tier-1)],bossGuard:true});
        addFixed(...chamber.relic,'item',{item:'bossRelic',artifactId:relic.id,name:relic.name,art:relic.art,reward:relic.reward,sealedBy:seal});
      }
    }
    if(floor===81){const prison=makePrisonerCorner();if(prison){addFixed(...prison.prisoner,'npc',{npc:'tangseng',name:'唐僧',text:'悟空，最后一难不在塔外，在你心中。',prisonerCorner:true});addFixed(...prison.guard,'enemy',{...enemyBook[tier],name:'护经天龙',prisonerGuard:true})}}
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
    if(mentors[floor])place('npc',{...mentors[floor],npc:mentors[floor].id,mentor:true},1);
    if(helpers[floor])place('npc',{...helpers[floor],npc:helpers[floor].id},1);
    if(floor===41)place('item',{item:'skill',skillId:'fiery-eyes',art:'fiery-eyes',name:'八卦炉余火'},1);
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
    if(mentors[floor])return{title:baseTitle,kind:'helper',badge:'传法'};
    if(floor===41)return{title:baseTitle,kind:'relic',badge:'神通'};
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
    state.visitedFloors=state.visitedFloors||[state.floor];if(!state.visitedFloors.includes(state.floor))state.visitedFloors.push(state.floor);
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
    renderArtifacts();renderSkills();
    const neededExp=expToNext(state.level);$('#expText').textContent=`${state.exp||0} / ${neededExp}`;$('#expBar').style.width=`${Math.min(100,(state.exp||0)/neededExp*100)}%`;
    $('#floorProgressText').textContent=`${state.floor} / ${TOTAL_FLOORS}`;$('#floorProgressBar').style.width=`${state.floor/TOTAL_FLOORS*100}%`;
    const vaultDoor=data.entities.find(e=>e.type==='door'&&e.vault),mainGate=data.entities.find(e=>e.type==='door'&&e.mainGate),elite=data.entities.find(e=>e.elite),mentor=data.entities.find(e=>e.mentor),skillItem=data.entities.find(e=>e.skillId);
    $('#objectiveText').textContent=state.floor===3&&!state.hasMirror?'探索支路，取得照妖镜':mentor?`寻访${mentor.name}，承接一段旧缘`:skillItem?`寻找${skillItem.name}，唤醒大圣神通`:state.floor===81?'穿过封印，战胜如来':elite?`${elite.name}暂不可敌，可绕行后再回来挑战`:vaultDoor?`权衡路线：主门通关，${doorName(vaultDoor.door)}门藏有秘宝`:mainGate?`寻找${doorName(mainGate.door)}钥匙，破解本层路线`:'寻找通往上层的云梯';
    $('#bestiaryBtn span').textContent=state.hasMirror?'照妖镜 · 洞察全貌':'未得照妖镜 · 仅可辨名';
    document.documentElement.style.setProperty('--chapter-color',chapter.color);
    if(audioOn)window.JourneyAudio?.setRegion(Math.floor((state.floor-1)/9));
    updateCompanions();renderLog();save();
  }

  function renderEntity(e){
    const n=document.createElement('span');n.className=`entity ${e.type}`;n.dataset.type=e.type;
    if(e.type==='enemy'){n.classList.add('game-sprite');if(e.elite)n.classList.add('elite-boss');if(e.boss&&!e.elite)n.classList.add('boss-unit');if(e.bossGuard||e.prisonerGuard)n.classList.add('boss-guard');if(e.mirrorGuardian)n.classList.add('mirror-guardian');n.style.setProperty('--sprite',`url("assets/sprites/${e.sprite}.png")`);n.title=state.hasMirror?`${e.name} HP${e.hp} 攻${e.atk} 防${e.def}`:e.name;n.setAttribute('aria-label',n.title)}
    if(e.type==='item'){
      n.classList.add(`item-${e.item}`,'ui-art','item-art');n.title=e.name;if(e.vaultKey)n.dataset.vaultKey='true';
      n.style.setProperty('--ui-art',`url("${itemArt(itemAsset(e))}")`);n.setAttribute('aria-label',e.name);
    }
    if(e.type==='door'){n.classList.add(`door-${e.door}`);n.title=`${doorName(e.door)}门 · 需要${doorName(e.door)}钥匙`;n.setAttribute('aria-label',n.title);if(e.vault)n.dataset.vault='true'}
    if(e.type==='stairs'){n.classList.add(`stairs-${e.direction}`);n.innerHTML='<i></i><i></i><i></i><i></i><i></i>';n.title=e.direction==='up'?'上楼 · 通往下一难':'下楼 · 返回上一难';n.setAttribute('aria-label',n.title)}
    if(e.type==='npc'){n.classList.add('ui-art','npc-art');n.style.setProperty('--ui-art',`url("${npcArt(e.npc)}")`);n.title=e.name;n.setAttribute('aria-label',e.name)}
    if(e.type==='shop'){n.classList.add('ui-art','npc-art','shop-art');n.style.setProperty('--ui-art',`url("${npcArt(e.npc||'landgod')}")`);n.title=e.name;n.setAttribute('aria-label',e.name)}
    if(e.type==='secret'){const revealed=!!state.skills?.['fiery-eyes'];n.classList.toggle('revealed',revealed);n.title=revealed?'火眼金睛：此处藏有暗格':'石板上似乎有一道细微裂纹';n.setAttribute('aria-label',revealed?'火眼金睛发现暗格':'可疑石板')}
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
    if(e.type==='item'){if(e.sealedBy&&!state.removed[e.sealedBy]){toast(`${e.name}仍被劫主妖气封印`);sound('bump');return false}collect(e);markRemoved(e.x,e.y);return true}
    if(e.type==='stairs'){
      if(e.direction==='up'&&state.floor===81){const finalAlive=generateFloor(81).entities.some(x=>x.final);if(finalAlive){toast('如来仍守在雷音寺前');return false}winGame();return false}
      startFloorTransition(e.direction);return false;
    }
    if(e.type==='npc'){
      if(e.npc==='tangseng'){const finalAlive=generateFloor(81).entities.some(x=>x.final);if(finalAlive)toast('师父就在眼前，击败如来便可渡过最后心关。');else winGame();return false}
      meetHelper(e);markRemoved(e.x,e.y);return true;
    }
    if(e.type==='shop'){openShop();return true}
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
    const firstVisit=direction==='up'&&!state.visitedFloors?.includes(target);
    busy=true;const transition=$('#floorTransition');transition.className=`floor-transition ${direction} show`;
    $('#transitionLabel').textContent=direction==='up'?'登临下一难':'返回上一难';$('#transitionFloor').textContent=target;sound('stairs');
    setTimeout(()=>{
      state.floor=target;state.pos=direction==='up'?{x:1,y:9}:{x:9,y:1};
      const progress=firstVisit?gainExperience(3+Math.ceil(state.floor/3)):{levels:0};
      addLog(direction==='up'?'登塔':'回返',direction==='up'?`踏入第 ${state.floor} 难。`:`返回第 ${state.floor} 难。`,'good');render();
      setTimeout(()=>{transition.className='floor-transition hidden';busy=false;if(progress.levels)showGainEffect('level','修为提升',`等级提升至 LV ${state.level}`);maybeShowFloorStory()},480);
    },420);
  }

  function showCloudTravel(){
    if(!state.skills?.['somersault-cloud']){toast('尚未习得筋斗云');return}const floors=[...new Set(state.visitedFloors||[state.floor])].sort((a,b)=>a-b);
    const buttons=floors.map(floor=>`<button class="cloud-floor${floor===state.floor?' current':''}" data-cloud-floor="${floor}" ${floor===state.floor?'disabled':''}><b>${String(floor).padStart(2,'0')}</b><small>${getFloorTitle(floor)}</small></button>`).join('');
    showModal(`<div class="cloud-travel"><span class="skill-detail-art" style="--skill-art:url('${itemArt('somersault-cloud')}')"></span><small>大圣神通</small><h2>筋斗云</h2><p>一个筋斗十万八千里，但只能落在这次西行亲自走过的难关。</p><div class="cloud-floor-grid">${buttons}</div></div>`);
    ui.modalContent.querySelectorAll('[data-cloud-floor]').forEach(button=>button.onclick=()=>travelByCloud(+button.dataset.cloudFloor));
  }

  function travelByCloud(target){
    if(!state.visitedFloors?.includes(target)||target===state.floor)return;closeModal();busy=true;const transition=$('#floorTransition');transition.className='floor-transition cloud show';
    $('#transitionLabel').textContent='筋斗云 · 腾云归返';$('#transitionFloor').textContent=target;sound('stairs');setTimeout(()=>{state.floor=target;state.pos={x:1,y:9};addLog('筋斗云',`翻身踏云，返回第 ${target} 难。`,'good');render();setTimeout(()=>{transition.className='floor-transition hidden';busy=false},480)},420);
  }

  function discoverSecret(e){
    const n=5+Math.floor(state.floor/15)*2;
    if(e.secret===0){state.atk+=n;addLog('隐藏宝物',`石板下藏着一截定海神铁，攻击提升 ${n}。`,'good');toast('发现隐藏宝物：定海神铁')}
    else if(e.secret===1){state.def+=n;addLog('隐藏宝物',`墙缝中封着一片护心龙鳞，防御提升 ${n}。`,'good');toast('发现隐藏宝物：护心龙鳞')}
    else{state.coin+=18+state.floor;state.keys.yellow++;showKeyNotice('yellow');addLog('隐藏宝物','暗格里藏着功德钱与一把黄钥匙。','good');toast('发现石板暗格')}
    sound('helper');
  }

  function openAdventure(e){
    const a=adventures[e.adventure],reward=getAdventureRewards(state.floor),risky=state.floor%14===0;
    const bravePreview=risky?`代价：当前气血 -15%<br>攻击 +${reward.riskyAtk} · 功德 +${reward.riskyCoin} · 红钥匙 +1`:`攻击 +${reward.braveAtk} · 气血上限 +${reward.braveHp} · 功德 +${reward.braveCoin}`;
    const calmPreview=`防御 +${reward.calmDef} · 气血上限及恢复 +${reward.calmHp} · 功德 +${reward.calmCoin}`;
    showModal(`<h2>${a.title}</h2><p>${a.text}</p><div class="adventure-mark">奇</div><div class="adventure-hint">选择后立即获得永久奖励</div><div class="modal-actions adventure-choices"><button class="pixel-btn primary" data-choice="a"><b>${a.a}</b><small>${bravePreview}</small></button><button class="pixel-btn" data-choice="b"><b>${a.b}</b><small>${calmPreview}</small></button></div>`);
    ui.modalContent.querySelectorAll('[data-choice]').forEach(btn=>btn.onclick=()=>resolveAdventure(e,btn.dataset.choice));
  }

  function getAdventureRewards(floor){
    return{braveAtk:12+Math.floor(floor/10)*3,braveHp:180+floor*12,braveCoin:35+floor,
      riskyAtk:18+Math.floor(floor/10)*4,riskyCoin:55+floor,calmDef:10+Math.floor(floor/12)*3,calmHp:260+floor*14,calmCoin:20+floor};
  }

  function resolveAdventure(e,choice){
    const reward=getAdventureRewards(state.floor),risky=state.floor%14===0;let result;
    if(choice==='a'&&!risky){state.atk+=reward.braveAtk;state.maxHp+=reward.braveHp;state.hp+=reward.braveHp;state.coin+=reward.braveCoin;result=`攻击 +${reward.braveAtk}　气血上限 +${reward.braveHp}　功德 +${reward.braveCoin}`}
    else if(choice==='a'){const loss=Math.min(Math.floor(state.hp*.15),state.hp-1);state.hp-=loss;state.atk+=reward.riskyAtk;state.coin+=reward.riskyCoin;state.keys.red++;showKeyNotice('red');result=`气血 -${loss}　攻击 +${reward.riskyAtk}　功德 +${reward.riskyCoin}　红钥匙 +1`}
    else{state.def+=reward.calmDef;state.maxHp+=reward.calmHp;state.hp+=reward.calmHp;state.coin+=reward.calmCoin;result=`防御 +${reward.calmDef}　气血上限及恢复 +${reward.calmHp}　功德 +${reward.calmCoin}`}
    addLog('奇遇',`${adventures[e.adventure].title}：${result}。`,'good');markRemoved(e.x,e.y);state.pos={x:e.x,y:e.y};state.steps++;closeModal();sound('helper');render();
    showModal(`<div class="adventure-result"><small>奇遇所得</small><h2>${adventures[e.adventure].title}</h2><strong>${result}</strong><p>奖励已永久计入本次西行属性。</p><button class="pixel-btn primary" data-adventure-done>收下机缘</button></div>`);ui.modalContent.querySelector('[data-adventure-done]').onclick=closeModal;
  }

  function battle(e){void runBattle(e);return false}

  const artifactCount=id=>state.artifacts?.[id]?.count||0;
  const skillOwned=id=>!!state.skills?.[id];
  const companionAidBook={
    bajie:{name:'猪八戒',skill:'九齿钉耙',ratio:.12},
    shaseng:{name:'沙悟净',skill:'降妖宝杖',ratio:.10},
    bailong:{name:'小白龙',skill:'白龙吐息',ratio:.14}
  };
  function getTightFilletBacklash(random=Math.random){return artifactCount('tight-fillet')&&random()<.22?Math.min(state.hp,Math.max(1,Math.floor(state.maxHp*.08))):0}
  function getCompanionAid(e,random=Math.random){
    const available=(state.companions||[]).filter(id=>companionAidBook[id]);
    if(!available.length||random()>=.5)return null;
    const id=available[Math.floor(random()*available.length)],aid=companionAidBook[id];
    return{id,...aid,damage:Math.max(1,Math.floor(e.hp*aid.ratio))};
  }
  function getBattleEffects(e){
    const blade=artifactCount('three-point-blade'),rake=artifactCount('nine-tooth-rake'),kasaya=artifactCount('kasaya'),shield=artifactCount('dragon-shield');
    const armorPierce=Math.min(.42,blade*.04+(artifactCount('golden-eye')?.12:0)+(skillOwned('fiery-eyes')?.06:0));
    const enemyWeak=Math.min(.38,shield*.03+(artifactCount('nine-dragon-scale')?.08:0)+(artifactCount('wind-pearl')?.10:0)+(artifactCount('scorpion-pipa')?.12:0));
    const reduction=Math.min(.5,kasaya*.04+(artifactCount('chaos-armor')?.08:0)+(artifactCount('blackwind-kasaya')?.10:0)+(artifactCount('lotus-scripture')?.12:0));
    let damageBoost=artifactCount('twogas-vase')?.12:0;
    if(e.boss)damageBoost+=(artifactCount('giant-edge')?.15:0)+(artifactCount('tiger-saber')?.20:0);
    else damageBoost+=artifactCount('demon-staff')?.18:0;
    const effectiveDef=Math.max(0,Math.floor(e.def*(1-armorPierce))),heroHit=Math.max(0,Math.floor(state.atk*(1+damageBoost))-effectiveDef);
    const openingDamage=Math.min(e.hp-1,Math.floor(heroHit*Math.min(.6,rake*.1)+e.hp*(artifactCount('fire-spear')?.08:0)));
    const enemyHit=Math.max(0,Math.floor(Math.max(0,e.atk*(1-enemyWeak)-state.def)*(1-reduction)));
    const triggers=[];
    if(armorPierce)triggers.push({name:skillOwned('fiery-eyes')?'火眼破妄':'破甲真锋',text:`金光透甲，无视 ${Math.round(armorPierce*100)}% 防御。`});
    if(openingDamage)triggers.push({name:artifactCount('fire-spear')?'真火横扫':'天蓬横扫',text:`法宝先发，开场造成 ${openingDamage} 伤害。`,damage:openingDamage});
    if(damageBoost)triggers.push({name:'伏魔神威',text:`法宝共鸣，本战伤害提高 ${Math.round(damageBoost*100)}%。`});
    if(enemyWeak||reduction)triggers.push({name:'护体神光',text:`妖力削弱 ${Math.round(enemyWeak*100)}%，所受伤害再减 ${Math.round(reduction*100)}%。`});
    return{heroHit,enemyHit,openingDamage,effectiveDef,triggers};
  }

  async function runBattle(e){
    if(busy)return false;
    const effects=getBattleEffects(e),{heroHit,enemyHit}=effects,rolledAid=getCompanionAid(e);
    const companionDamage=rolledAid?Math.min(rolledAid.damage,Math.max(0,e.hp-1-effects.openingDamage)):0;
    const companionAid=companionDamage?{...rolledAid,damage:companionDamage}:null,openingDamage=effects.openingDamage+companionDamage;
    const victoryRounds=heroHit>0?Math.ceil(Math.max(1,e.hp-openingDamage)/heroHit):Infinity;
    const projectedLoss=Number.isFinite(victoryRounds)?Math.max(0,(victoryRounds-1)*enemyHit):Infinity;
    openBattleScene(e);
    if(state.hasMirror&&heroHit<=0){
      busy=true;showBattleBlocked(`照妖镜判定：无法破防`,`${e.name} 的有效防御为 ${effects.effectiveDef}，当前每次攻击造成 0 伤害。先提升攻击后再回来挑战。`);return false;
    }
    if(state.hasMirror&&projectedLoss>=state.hp){
      busy=true;showBattleBlocked(`照妖镜判定：此战必败`,`预计损失 ${projectedLoss} 气血，当前仅余 ${Math.floor(state.hp)}。提升防御或补充气血后再战。`);addLog('镜示危机',`${e.name}不可强攻，预计损失 ${projectedLoss} 气血。`,'danger');return false;
    }
    if(heroHit<=0&&enemyHit<=0){
      busy=true;showBattleBlocked('双方均无法破防','金箍棒与妖怪攻势都无法造成伤害，此战只能暂且作罢。');return false;
    }

    busy=true;
    const backlashDamage=getTightFilletBacklash(),startHeroHp=Math.max(0,state.hp-backlashDamage);
    const defeated=heroHit<=0||projectedLoss>=startHeroHp;
    const combatRounds=startHeroHp<=0?0:defeated?Math.ceil(startHeroHp/enemyHit):victoryRounds;
    const counterRounds=defeated?combatRounds:Math.max(0,combatRounds-1);
    const visualRounds=Math.min(combatRounds,6);
    let completed=0,shownHeroHp=startHeroHp,shownEnemyHp=e.hp-openingDamage;
    if(companionAid){appendBattleLog(`同伴·${companionAid.name}`,`${companionAid.skill}从旁助阵，直接削去 ${companionAid.damage} 气血。`,'companion');updateBattleHp('Enemy',e.hp-companionAid.damage,e.hp)}
    if(state.hasMirror)appendBattleLog('照妖镜',`胜算已明：预计 ${victoryRounds} 回合取胜，损失 ${projectedLoss} 气血${companionAid?`；已计入${companionAid.name}助阵`:''}${artifactCount('tight-fillet')?'；紧箍反噬无法预知':''}。`,'artifact');
    if(backlashDamage){sound('backlash');$('#battleScene').classList.add('fillet-backlash');$('#battleHeroWrap').classList.add('hit');showDamage('#heroDamage',backlashDamage);updateBattleHp('Hero',shownHeroHp,state.maxHp);appendBattleLog('紧箍反噬',`咒音骤紧，悟空先损失 ${backlashDamage} 气血。`,'backlash');await wait(420);$('#battleHeroWrap').classList.remove('hit');$('#battleScene').classList.remove('fillet-backlash')}
    for(const trigger of effects.triggers){$('#battleScene').classList.add('artifact-skill');appendBattleLog(`法宝·${trigger.name}`,trigger.text,'artifact');if(trigger.damage){showDamage('#enemyDamage',trigger.damage);updateBattleHp('Enemy',shownEnemyHp,e.hp)}await wait(240);$('#battleScene').classList.remove('artifact-skill')}
    for(let i=0;i<visualRounds;i++){
      const nextCompleted=Math.max(completed+1,Math.round((i+1)*combatRounds/visualRounds));
      const attacks=nextCompleted-completed;
      const dealt=Math.min(shownEnemyHp,heroHit*attacks);
      $('#battleHeroWrap').classList.add('attacking');sound('battle');await wait(150);
      $('#battleHeroWrap').classList.remove('attacking');$('#battleEnemyWrap').classList.add('hit');showDamage('#enemyDamage',dealt||'未破防');
      shownEnemyHp=Math.max(0,e.hp-openingDamage-heroHit*nextCompleted);updateBattleHp('Enemy',shownEnemyHp,e.hp);
      appendBattleLog(`第 ${nextCompleted} 回合`,heroHit<=0?'金箍棒未能破开妖怪防御。':attacks>1?`金箍棒连击 ×${attacks}，造成 ${dealt} 伤害。`:`悟空先攻，造成 ${dealt} 伤害。`,'hero');
      await wait(220);$('#battleEnemyWrap').classList.remove('hit');
      const countersBefore=Math.min(completed,counterRounds),countersNow=Math.min(nextCompleted,counterRounds),counters=countersNow-countersBefore;
      if(counters>0){
        const taken=enemyHit*counters;$('#battleEnemyWrap').classList.add('attacking');await wait(130);$('#battleEnemyWrap').classList.remove('attacking');$('#battleHeroWrap').classList.add('hit');showDamage('#heroDamage',taken||'格挡');
        shownHeroHp=Math.max(0,startHeroHp-enemyHit*countersNow);updateBattleHp('Hero',shownHeroHp,state.maxHp);
        appendBattleLog('妖怪反击',enemyHit?`${e.name}${counters>1?`连续反击 ×${counters}`:'反击'}，悟空损失 ${taken} 气血。`:`悟空挡住了全部伤害。`,'enemy');
        await wait(220);$('#battleHeroWrap').classList.remove('hit');
      }
      completed=nextCompleted;
    }

    if(defeated){
      state.hp=0;appendBattleLog('败亡',`${e.name}仍余 ${shownEnemyHp} 气血，悟空力竭倒下。`,'enemy');if(showRescueHairRevival(e,shownEnemyHp))return false;showBattleDeath(e,shownEnemyHp);return false;
    }

    const bonus=e.elite?e.reward||{}:{};
    const atkGain=e.elite?(bonus.atk||0):e.boss?10+Math.floor(state.floor/9)*3:0;
    const defGain=e.elite?(bonus.def||0):e.boss?7+Math.floor(state.floor/9)*2:0;
    const hpGain=bonus.hp||0,redGain=bonus.red||0;
    const xpGain=e.elite?60+state.floor*4:e.boss?18+state.floor*2:5+Math.ceil(state.floor/4);
    const loss=projectedLoss;
    state.hp=startHeroHp-loss;state.coin+=e.coin;state.atk+=atkGain;state.def+=defGain;state.maxHp+=hpGain;state.hp+=hpGain;state.keys.red+=redGain;
    const progress=gainExperience(xpGain);if(!e.hiddenBoss)markRemoved(e.x,e.y);
    state.flags=state.flags||{shards:0};if(e.elite)state.flags.shards=(state.flags.shards||0)+1;if(e.flag)state.flags[e.flag]=true;if(e.hiddenBoss)state.flags.sixEarDefeated=true;
    addLog('胜战',`击败${e.name}，战斗损失 ${loss}${backlashDamage?`，紧箍反噬 ${backlashDamage}`:''}，获得 ${e.coin} 功德。`,loss+backlashDamage>state.maxHp*.18?'danger':'good');save();
    if(e.defeat)appendBattleLog('战罢',e.defeat,'hero');
    sound(e.boss?'bossWin':'reward');
    $('#battleKicker').textContent=e.elite?'远古劫主已伏':e.boss?'大难已破':'战斗胜利';
    $('#battleReward').innerHTML=`<strong>胜利奖励</strong>${e.relic?`<div class="boss-relic-preview"><i style="--relic-art:url('${itemArt(e.relic.art)}')"></i><span>封印解除<br><b>${e.relic.name}</b>可拾取</span></div>`:''}<div><span>功德 <b>+${e.coin}</b></span><span>修为 <b>+${xpGain}</b></span><span>战斗损伤 <b>-${loss}</b></span>${backlashDamage?`<span class="loss">紧箍反噬 <b>-${backlashDamage}</b></span>`:''}${e.boss?`<span>攻击 <b>+${atkGain}</b></span><span>防御 <b>+${defGain}</b></span>`:''}${hpGain?`<span>气血上限 <b>+${hpGain}</b></span>`:''}${redGain?`<span>红钥匙 <b>+${redGain}</b></span>`:''}${progress.levels?`<span>等级 <b>+${progress.levels}</b></span>`:''}</div>`;
    $('#battleReward').classList.remove('hidden');
    const done=$('#battleContinue');done.textContent=e.hiddenBoss?'收棒 · 直面本心':e.final?'渡过最后心关':e.boss?'击破封印 · 收取法宝':'收下奖励';done.classList.remove('hidden');done.onclick=()=>{closeBattleScene();state.pos={x:e.x,y:e.y};state.steps++;busy=false;render();if(e.hiddenBoss||e.final){winGame();return}if(redGain)showKeyNotice('red');if(progress.levels)setTimeout(()=>showGainEffect('level','修为提升',`等级提升至 LV ${state.level}`),redGain?450:0);if(e.revelation&&!state.flags.revealed){state.flags.revealed=true;save();setTimeout(()=>showRevelation(e.revelation),redGain||progress.levels?900:400)}};
    return false;
  }

  function openBattleScene(e){
    $('#battleScene').className=`battle-scene${e.hiddenBoss?' hidden-boss':''}`;$('#battleKicker').textContent=e.hiddenBoss?'真心魔 · 二心之战':`第 ${state.floor} 难 · 遭遇战`;
    $('#battleEnemyName').textContent=e.name;$('#battleEnemyType').textContent=e.hiddenBoss?'另一个齐天大圣':e.elite?'远古劫主 · 可绕行':e.boss?'本层劫主':e.mirrorGuardian?'照妖镜守护者':e.prisonerGuard?'护经守卫':e.bossGuard?'劫主亲卫':e.vaultGuard?'藏宝室守卫':'拦路妖怪';
    $('#battleEnemySprite').style.setProperty('--sprite',`url("assets/sprites/${e.sprite}.png")`);
    $('#battleHeroStats').textContent=`攻 ${state.atk}　防 ${state.def}`;$('#battleEnemyStats').textContent=`攻 ${e.atk}　防 ${e.def}`;
    $('#battleHeroMax').textContent=state.maxHp;$('#battleEnemyMax').textContent=e.hp;updateBattleHp('Hero',state.hp,state.maxHp);updateBattleHp('Enemy',e.hp,e.hp);
    $('#battleLog').innerHTML=e.intro?`<div class="battle-log-line enemy"><b>${e.name}</b><span>${e.intro}</span></div>`:'<div class="battle-log-line"><b>交锋</b><span>悟空与妖怪狭路相逢。</span></div>';
    $('#battleReward').classList.add('hidden');$('#battleReward').innerHTML='';$('#battleContinue').classList.add('hidden');
    window.JourneyAudio?.duck(true);if(e.boss)sound('bossIntro');
  }

  function showBattleBlocked(title,text){
    $('#battleKicker').textContent='暂不可敌';$('#battleLog').innerHTML=`<div class="battle-warning"><strong>${title}</strong><p>${text}</p></div>`;
    const done=$('#battleContinue');done.textContent='暂且退避';done.classList.remove('hidden');done.onclick=()=>{closeBattleScene();busy=false};sound('bump');
  }

  function showRescueHairRevival(e,enemyHp){
    const hair=state.skills?.['rescue-hair'];if(!hair?.charges)return false;hair.charges--;state.hp=Math.max(1,Math.ceil(state.maxHp*.35));
    const scene=$('#battleScene');scene.classList.remove('artifact-skill','fillet-backlash');scene.classList.add('rescued');$('#battleKicker').textContent='毫毛替命';updateBattleHp('Hero',state.hp,state.maxHp);
    appendBattleLog('观音救命毫毛',`金光化作替身，悟空恢复 ${state.hp} 气血并脱离战斗。`,'artifact');$('#battleReward').innerHTML=`<div class="battle-rescue"><i style="--rescue-art:url('${itemArt('rescue-hair')}')"></i><div><strong>死劫暂消</strong><p>消耗一根救命毫毛 · 尚余 <b>${hair.charges}</b> 根<br>${e.name}仍余 ${enemyHp} 气血，此战并未取胜。</p></div></div>`;$('#battleReward').classList.remove('hidden');
    const done=$('#battleContinue');done.textContent='借毫毛脱身';done.classList.remove('hidden');done.onclick=()=>{closeBattleScene();busy=false;addLog('毫毛替命',`从${e.name}面前脱身，尚余 ${hair.charges} 根救命毫毛。`,'good');render()};sound('rescue');save();return true;
  }

  function showBattleDeath(e,enemyHp){
    const scene=$('#battleScene');scene.classList.remove('artifact-skill');scene.classList.add('defeated');$('#battleKicker').textContent='大圣陨落';
    $('#battleReward').innerHTML=`<div class="battle-death"><strong>此劫未渡</strong><p>悟空倒在 <b>${e.name}</b> 面前，妖怪尚余 <b>${enemyHp}</b> 气血。<br>此世行程终结，只能从第一难重新来过。</p></div>`;
    $('#battleReward').classList.remove('hidden');const done=$('#battleContinue');done.textContent='重走西行路';done.classList.remove('hidden');done.onclick=()=>{closeBattleScene();startNew()};sound('death');
  }

  function closeBattleScene(){$('#battleScene').className='battle-scene hidden';$('#battleHeroWrap').className='battle-sprite-wrap';$('#battleEnemyWrap').className='battle-sprite-wrap';window.JourneyAudio?.duck(false)}
  function updateBattleHp(side,value,max){$(`#battle${side}Hp`).textContent=Math.max(0,Math.floor(value));$(`#battle${side}Bar`).style.width=`${Math.max(0,Math.min(100,value/max*100))}%`}
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
    sound({mirror:'relic',skill:'skill',bossRelic:'relic',potion:'heal',gemAtk:'relic',gemDef:'relic'}[e.item]||'key');
    if(e.item==='mirror'){state.hasMirror=true;delete state.artifacts?.['demon-mirror'];showGainEffect('mirror','照妖镜',`洞察真形 · 妖鉴已开启胜负预估`,'demon-mirror');addLog('神器','获得照妖镜，妖鉴现可提前判断胜负与损伤。','good')}
    else if(e.item==='skill'){unlockSkill(e.skillId);showGainEffect('skill',skillBook[e.skillId].name,skillBook[e.skillId].detail,e.art);addLog('神通',`八卦炉旧火重燃，悟空唤醒「${skillBook[e.skillId].name}」。`,'good');showStoryReward('八卦炉旧火','炉火烧不死我，只会让我看得更清。',e.skillId)}
    else if(e.item==='bossRelic'){const gained=registerArtifact(e),reward=gained.reward;showGainEffect('relic',e.name,`${gained.definition.skill}　攻 +${reward.atk||0}　防 +${reward.def||0}　气血 +${reward.hp||0}`,e.art);addLog('劫主法宝',`收服${e.name}，获得技能「${gained.definition.skill}」。`,'good')}
    else if(e.item==='potion'){const gain=120*scale;state.hp+=gain;state.maxHp=Math.max(state.maxHp,state.hp);showGainEffect('peach','大蟠桃',`气血 +${gain}`,'peach');addLog('仙果',`蟠桃恢复 ${gain} 气血。`,'good')}
    else if(e.item==='gemAtk'||e.item==='gemDef'){const gained=registerArtifact(e),reward=gained.reward;showGainEffect(e.item==='gemAtk'?'attack':'defense',gained.definition.name,`${gained.definition.skill} · 第 ${gained.count} 层　攻 +${reward.atk||0}　防 +${reward.def||0}　气血 +${reward.hp||0}`,e.art);addLog('法宝',`${gained.definition.name}收入法宝栏，「${gained.definition.skill}」叠至 ${gained.count} 层。`,'good')}
    else{state.keys[e.item]++;addLog('拾取',`获得一把${doorName(e.item)}钥匙。`,'good');showKeyNotice(e.item)}
  }

  function meetHelper(e){
    if(e.mentor){meetMentor(e);return}
    const reward=e.reward||{};for(const [k,v] of Object.entries(reward)){if(k==='yellow'||k==='blue'||k==='red'){state.keys[k]+=v;showKeyNotice(k)}else{state[k]+=v;if(k==='hp')state.maxHp=Math.max(state.maxHp,state.hp)}}
    if(['bajie','shaseng','bailong'].includes(e.npc)&&!state.companions.includes(e.npc))state.companions.push(e.npc);
    let text=e.text;
    if(e.npc==='shaseng'&&state.floor===78&&state.flags?.shaRedeemed)text='大师兄，流沙河那一战，你替我斩了那个不愿想起的旧我。师父就在前方，我只能送你到这里了。';
    ui.oracle.textContent=`${e.name}：${text}`;addLog('相助',`${e.name}略施援手。`,'good');toast(`${e.name}送来一份助力`);sound('helper');
  }

  function unlockSkill(id){
    state.skills=state.skills||{};if(state.skills[id])return false;state.skills[id]={id};if(id==='rescue-hair')state.skills[id].charges=3;return true;
  }

  function meetMentor(e){
    let rewardId=e.skillId,rewardName,rewardDetail;
    if(e.artifactId){const gained=registerArtifact({artifactId:e.artifactId,art:e.artifactId,name:artifactBook[e.artifactId].name}),reward=gained.reward;rewardId=e.artifactId;rewardName=artifactBook[e.artifactId].name;rewardDetail=`攻击 +${reward.atk}；战斗时可能遭受紧箍反噬。`}
    else{unlockSkill(e.skillId);rewardName=skillBook[e.skillId].name;rewardDetail=e.skillId==='rescue-hair'?'获得三次败亡复生机会。':skillBook[e.skillId].detail}
    ui.oracle.textContent=`${e.name}：${e.text}`;addLog('传法',`${e.name}传下「${rewardName}」。`,'good');sound('helper');showStoryReward(e.title,e.text,rewardId,rewardDetail,e.id);
  }

  function showStoryScene({art,npc,eyebrow,title,body,button='继续',page='',onDone}){
    const banner=art?`<div class="scene-art"><img src="assets/${art}" alt="" /></div>`:'';
    const face=npc?`<span class="story-npc" style="--story-npc:url('${npcArt(npc)}')"></span>`:'';
    showModal(`<div class="story-scene">${banner}${face}<small>${eyebrow||''}</small><h2>${title}</h2><p>${body}</p>${page?`<div class="scene-page">${page}</div>`:''}<button class="pixel-btn primary" data-scene-done>${button}</button></div>`);
    ui.modalContent.querySelector('[data-scene-done]').onclick=()=>(onDone||closeModal)();
  }
  function showIntro(done){
    const pages=[
      {art:'journey-tower-keyart.png',eyebrow:'西游 · 八十一难',title:'取经路断',body:'大唐贞观年间，玄奘法师奉旨西行取经。一路降妖伏魔，九九八十一难，眼看只差抵达灵山雷音寺的最后一程。'},
      {art:'journey-tower-keyart.png',eyebrow:'变故',title:'灵山倒悬',body:'就在雷音寺前，一股无名业障骤然卷起，掳走了唐僧。佛光尽灭，整座灵山轰然倒悬，化作一座深不见底的妖塔——八十一难，尽数封锁其中。'},
      {art:'journey-tower-keyart.png',eyebrow:'你的使命',title:'独闯妖塔',body:'你是齐天大圣孙悟空。金箍棒在手，唯有逐层闯过这八十一难，才能救回师父。八戒、沙僧、白龙、太白只能在途中偶尔相助——这一程，终究要你自己走完。'}
    ];
    let i=0;
    const step=()=>{const p=pages[i],last=i===pages.length-1;showStoryScene({art:p.art,eyebrow:p.eyebrow,title:p.title,body:p.body,button:last?'踏入第一难':'继续',page:`${i+1} / ${pages.length}`,onDone:()=>{if(last)done();else{i++;step()}}})};
    step();
  }
  function showRevelation(text){
    sound('reveal');
    showStoryScene({art:'midpoint-revelation.png',npc:'taibai',eyebrow:'塔中真言 · 道破天机',title:'原来这塔，是你自己',body:`“${text}”`,button:'怔在原地'});
  }
  function maybeShowFloorStory(){
    state.flags=state.flags||{shards:0};
    if(state.floor!==55||state.flags.lionCamelSeen)return;
    state.flags.lionCamelSeen=true;save();sound('reveal');
    showStoryScene({art:'lion-camel-despair.png',eyebrow:'第七难域 · 狮驼岭',title:'尸山遮断西行路',body:'狮驼国中不见炊烟，只见白骨堆成城墙。这里的妖魔并不只是拦路——它们要你相信，取经人走到这里，十个便会死十个。悟空第一次握紧金箍棒，却没有立刻说出那句“怕什么”。',button:'踏过尸山'});
  }
  function showSixEarEncounter(){
    sound('reveal');
    showStoryScene({art:'mind-demon-final.png',eyebrow:'三片残心 · 真相现形',title:'宝座上，是另一个你',body:'三片心魔残片同时发亮。如来的法相从中央裂开，一半仍是佛，一半却生出猴王的金瞳。阴影中，六耳猕猴提棒起身：“世人都说真假美猴王，可你我之间，从来没有真假——只有你敢不敢认。”',button:'直面二心',onDone:()=>{closeModal();runBattle({...sixEarBoss,x:state.pos.x,y:state.pos.y})}});
  }
  function showStoryReward(title,text,rewardId,rewardDetail='',npc=''){
    const skill=skillBook[rewardId],artifact=artifactBook[rewardId],item=skill||artifact,art=item?.art||rewardId;
    showModal(`<div class="story-reward">${npc?`<span class="story-npc" style="--story-npc:url('${npcArt(npc)}')"></span>`:''}<small>西行旧缘</small><h2>${title}</h2><p>“${text}”</p><div class="story-gift"><i style="--story-art:url('${itemArt(art)}')"></i><div><b>${item?.name||title}</b><span>${rewardDetail||item?.detail||''}</span></div></div><button class="pixel-btn primary" data-story-done>谨记于心</button></div>`);ui.modalContent.querySelector('[data-story-done]').onclick=closeModal;
  }

  function openShop(){
    const atkCost=30+Math.floor(state.floor/10)*8,defCost=30+Math.floor(state.floor/10)*8,hpCost=22+Math.floor(state.floor/10)*6;
    showModal(`<div class="shop-heading"><span class="ui-art npc-art shop-portrait" style="--ui-art:url('${npcArt('landgod')}')"></span><div><h2>土地庙</h2><p>土地公捻须道：功德可换些仙缘，但切莫贪多。</p></div></div><div class="modal-actions shop-offers"><button class="pixel-btn" data-buy="atk" data-cost="${atkCost}"><i class="shop-offer-art" style="--offer-art:url('${itemArt('three-point-blade')}')"></i>攻击 +12<br><small>${atkCost} 功德</small></button><button class="pixel-btn" data-buy="def" data-cost="${defCost}"><i class="shop-offer-art" style="--offer-art:url('${itemArt('dragon-shield')}')"></i>防御 +10<br><small>${defCost} 功德</small></button><button class="pixel-btn" data-buy="hp" data-cost="${hpCost}"><i class="shop-offer-art" style="--offer-art:url('${itemArt('peach')}')"></i>气血 +500<br><small>${hpCost} 功德</small></button></div>`);
    ui.modalContent.querySelectorAll('[data-buy]').forEach(btn=>btn.onclick=()=>{const cost=+btn.dataset.cost;if(state.coin<cost){toast('功德不足');return}state.coin-=cost;if(btn.dataset.buy==='atk')state.atk+=12;if(btn.dataset.buy==='def')state.def+=10;if(btn.dataset.buy==='hp'){state.hp+=500;state.maxHp+=500}addLog('土地庙','以功德换得一份仙缘。','good');closeModal();render()});
  }

  function showBestiary(){
    const enemies=generateFloor(state.floor).entities.filter(e=>e.type==='enemy');
    if(!state.hasMirror){const rows=enemies.length?enemies.map(e=>`<div class="monster-row obscured"><span class="mini-enemy game-sprite" style="--sprite:url('assets/sprites/${e.sprite}.png')"></span><div><b>${e.name}</b><small>${e.elite?'远古劫主':e.boss?'本层劫主':e.mirrorGuardian?'照妖镜守护者':e.bossGuard?'劫主亲卫':e.vaultGuard?'藏宝室守卫':'拦路妖怪'}</small></div><span class="mirror-unknown">妖气遮蔽</span></div>`).join(''):'<p>本层妖气已清。</p>';showModal(`<h2>本层妖鉴</h2><div class="mirror-lock"><span class="ui-art item-art" style="--ui-art:url('${itemArt('demon-mirror')}')"></span><p>尚未取得照妖镜，只能辨认妖怪名号。照妖镜由第三难支路中的镇镜熊罴守护。</p></div>${rows}`);return}
    const rows=enemies.length?enemies.map(e=>{const effects=getBattleEffects(e),hit=effects.heroHit,rounds=hit>0?Math.ceil(Math.max(1,e.hp-effects.openingDamage)/hit):Infinity,loss=hit>0?Math.max(0,(rounds-1)*effects.enemyHit):Infinity,status=!Number.isFinite(loss)?'不可破防':loss>=state.hp?'必败':`可胜 · 损伤 ${loss}`;return `<div class="monster-row"><span class="mini-enemy game-sprite" style="--sprite:url('assets/sprites/${e.sprite}.png')"></span><div><b>${e.name}</b><small>${e.elite?'远古劫主 · 可绕行':e.boss?'本层劫主':e.mirrorGuardian?'照妖镜守护者':e.bossGuard?'劫主亲卫':e.vaultGuard?'藏宝室守卫':'拦路妖怪'}</small></div><span><small>气血</small>${e.hp}</span><span><small>攻/防</small>${e.atk}/${e.def}</span><span><small>功德</small>${e.coin}</span><span class="loss"><small>照妖镜判定</small>${status}</span></div>`}).join(''):'<p>本层妖气已清。</p>';
    showModal(`<h2>本层妖鉴</h2><div class="mirror-lock acquired"><span class="ui-art item-art" style="--ui-art:url('${itemArt('demon-mirror')}')"></span><p><b>照妖镜已开启</b><br>下列胜负与损伤均已计入当前属性和法宝效果${artifactCount('tight-fillet')?'；紧箍反噬属于天机变数，不计入预估':''}。</p></div><p>你先出手；敌人每轮反击，最后一击后不会反击。</p>${rows}`);
  }

  function showDebugPanel(){
    if(!state?.debug)return;const buttons=Array.from({length:TOTAL_FLOORS},(_,i)=>{const floor=i+1,meta=getFloorMeta(floor);return `<button class="debug-floor ${meta.kind}${floor===state.floor?' current':''}" data-debug-floor="${floor}" title="${getFloorTitle(floor)}"><b>${String(floor).padStart(2,'0')}</b><small>${meta.badge}</small></button>`}).join('');
    showModal(`<div class="debug-panel"><small>DEBUG MODE · 正式存档不会被覆盖</small><h2>八十一难跳关台</h2><p>点击任意关卡即可传送。每次跳关都会恢复满属性、99 把三色钥匙、照妖镜和全部大圣神通，并重置该关场景。</p><div class="debug-floor-grid">${buttons}</div></div>`);
    ui.modalContent.querySelectorAll('[data-debug-floor]').forEach(button=>button.onclick=()=>jumpDebug(+button.dataset.debugFloor));
  }

  function jumpDebug(floor){state=freshDebugState(Math.max(1,Math.min(TOTAL_FLOORS,floor)));closeModal();render();toast(`DEBUG：已跳转至第 ${state.floor} 难`)}
  function returnToTitle(){closeModal();ui.game.classList.add('hidden');ui.title.classList.remove('hidden');pauseBgm();renderTrialCatalog()}
  function showMenu(){
    const cloudAction=state.skills?.['somersault-cloud']?'<button class="pixel-btn cloud-menu-action" data-action="cloud">筋斗云 · 返回旧关</button>':'';
    const debugActions=state.debug?'<button class="pixel-btn primary" data-action="debug">DEBUG 跳关</button><button class="pixel-btn" data-action="title">退出调试并返回标题</button>':'<button class="pixel-btn" data-action="save">手动存档</button><button class="pixel-btn" data-action="title">返回标题</button><button class="pixel-btn" data-action="restart">重开此世</button>';
    showModal(`<h2>行者歇脚</h2><p>${state.debug?'当前为调试模式，所有操作均不会覆盖正式存档。':`进度已自动保存在浏览器中。当前第 ${state.floor} 难，已行 ${state.steps} 步。`}</p><div class="modal-actions"><button class="pixel-btn" data-action="resume">继续游戏</button>${cloudAction}${debugActions}</div>`);
    ui.modalContent.querySelector('[data-action=resume]').onclick=closeModal;ui.modalContent.querySelector('[data-action=title]').onclick=returnToTitle;
    const saveButton=ui.modalContent.querySelector('[data-action=save]');if(saveButton)saveButton.onclick=()=>{save();toast('前缘已记入天命卷');closeModal()};
    const restartButton=ui.modalContent.querySelector('[data-action=restart]');if(restartButton)restartButton.onclick=()=>{if(confirm('确定抹去当前进度，从第一难重新开始？'))startNew()};
    const debugButton=ui.modalContent.querySelector('[data-action=debug]');if(debugButton)debugButton.onclick=showDebugPanel;
    const cloudButton=ui.modalContent.querySelector('[data-action=cloud]');if(cloudButton)cloudButton.onclick=showCloudTravel;
  }
  function showHelp(){showModal(`<h2>西行要诀</h2><p><b>移动：</b>使用 WASD、方向键或屏幕方向按钮。<br><b>大圣神通：</b>菩提、观音与八卦炉旧火会唤醒筋斗云、火眼金睛和救命毫毛。点击左侧神通图标查看或使用。<br><b>筋斗云：</b>只能返回本次西行已经到达过的关卡；移动端可从菜单使用。<br><b>紧箍咒：</b>永久提高攻击，但每场战斗有 22% 概率反噬 8% 最大气血，照妖镜无法预知。<br><b>照妖镜：</b>战斗中始终显示双方气血与攻防；未取得时妖鉴只能辨认名号，取得后会在妖鉴顶部显示并预估胜负。照妖镜不占法宝栏。<br><b>战斗：</b>无镜强攻可能战死；三根救命毫毛可自动替命并退战。<br><b>奇遇：</b>每个选择都会提前列出永久奖励，完成后还会显示本次实际所得。<br><b>DEBUG：</b>标题页可进入验关模式，通过顶部“DEBUG · 跳关”在 1—81 难间传送。调试进度不会覆盖正式存档。<br><b>存档：</b>正式模式每一步都会自动保存。</p>`)}

  function winGame(){
    const shards=state.flags?.shards||0;
    if(shards>=3&&!state.flags?.sixEarDefeated){showSixEarEncounter();return}
    state.won=true;save();sound('win');const minutes=Math.max(1,Math.floor((Date.now()-state.startedAt)/60000));
    const hair=state.skills?.['rescue-hair'];
    let ending='zhan';
    if(shards>=3)ending='wu';
    else if(hair&&hair.charges===0&&shards===0)ending='mi';
    const endings={
      wu:{title:'八十一难 · 心猿归真',body:'六耳的身影散去，你终于收住了金箍棒。三片心魔残片在掌心化作金光——这八十一难里的每一个妖魔，都是不肯放下的自己。塔轰然崩塌，灵山归位。唐僧就立在原处，从未离开：「悟空，你回来了。」'},
      zhan:{title:'八十一难 · 功德圆满',body:'金箍棒重重砸下，「如来」的法相崩成漫天金屑。雷音寺门轰然洞开，唐僧重获自由，师徒再踏归途。只是夜深时，悟空偶尔还会想起塔顶那张脸——它笑得，竟和自己有几分像。'},
      mi:{title:'八十一难 · 心猿成魔',body:'三根救命毫毛早已耗尽，你是被一次次替命的金光，硬生生拖到了塔顶。当最后一棒落下，你忽然分不清自己究竟救了谁。塔没有崩，它只是换了个主人——下一个闯进来的人，会在妖魔的眼里，看见一只似曾相识的猴子。'}
    };
    const data=endings[ending];
    showModal(`<div class="ending-art ${ending}"></div><h2>${data.title}</h2><p>${data.body}</p><p>通关记录：${state.steps} 步 · ${minutes} 分钟 · 剩余气血 ${Math.floor(state.hp)} · 心魔残片 ${shards}/3</p><div class="modal-actions"><button class="pixel-btn primary" data-action="again">再历一世</button><button class="pixel-btn" data-action="title">返回标题</button></div>`);
    ui.modalContent.querySelector('[data-action=again]').onclick=startNew;ui.modalContent.querySelector('[data-action=title]').onclick=()=>{closeModal();ui.game.classList.add('hidden');ui.title.classList.remove('hidden');pauseBgm();renderTrialCatalog()}}

  function updateCompanions(){document.querySelectorAll('.companion').forEach(n=>{const active=state.companions.includes(n.dataset.id);n.classList.toggle('locked',!active);if(active)n.querySelector('small').textContent='已结缘 · 50% 概率助阵'})}
  function renderArtifacts(){
    const root=$('#artifactBar');if(!root)return;state.artifacts=state.artifacts||{};
    const entries=Object.values(state.artifacts).filter(entry=>entry.count>0&&entry.id!=='demon-mirror');
    const emptyCount=Math.max(0,6-entries.length),total=entries.reduce((sum,entry)=>sum+entry.count,0);$('#artifactCount').textContent=total;
    root.innerHTML=entries.map(entry=>{const item=artifactBook[entry.id]||{name:entry.id,art:entry.id,skill:'未知灵蕴'};return `<button class="artifact-slot" type="button" data-artifact="${entry.id}" title="${item.name} · ${item.skill}"><i style="--artifact-art:url('${itemArt(item.art)}')"></i><span>${item.name}</span>${entry.count>1?`<b>×${entry.count}</b>`:''}</button>`}).join('')+Array.from({length:emptyCount},()=>'<span class="artifact-slot empty" aria-hidden="true"><i></i><span>未得</span></span>').join('');
    root.querySelectorAll('[data-artifact]').forEach(button=>button.onclick=()=>showArtifactDetail(button.dataset.artifact));
  }
  function renderSkills(){
    const root=$('#skillBar');if(!root)return;state.skills=state.skills||{};const entries=Object.values(state.skills).filter(entry=>skillBook[entry.id]),emptyCount=Math.max(0,3-entries.length);$('#skillCount').textContent=entries.length;
    root.innerHTML=entries.map(entry=>{const skill=skillBook[entry.id],charges=entry.id==='rescue-hair'?`<b>${entry.charges}</b>`:'';return `<button class="skill-slot" data-skill="${entry.id}" title="${skill.name} · ${skill.teacher}"><i style="--skill-art:url('${itemArt(skill.art)}')"></i><span>${skill.name}</span>${charges}</button>`}).join('')+Array.from({length:emptyCount},()=>'<span class="skill-slot empty" aria-hidden="true"><i></i><span>未悟</span></span>').join('');
    root.querySelectorAll('[data-skill]').forEach(button=>button.onclick=()=>showSkillDetail(button.dataset.skill));
  }
  function showSkillDetail(id){
    const skill=skillBook[id],entry=state.skills?.[id];if(!skill||!entry)return;const charges=id==='rescue-hair'?`剩余 ${entry.charges} / 3 根`:`传授者：${skill.teacher}`;
    showModal(`<div class="skill-detail"><span class="skill-detail-art" style="--skill-art:url('${itemArt(skill.art)}')"></span><div><small>大圣神通</small><h2>${skill.name}</h2><strong>${charges}</strong><p>${skill.detail}</p>${skill.active?'<button class="pixel-btn primary" data-use-skill>驾云返回旧关</button>':''}</div></div>`);const use=ui.modalContent.querySelector('[data-use-skill]');if(use)use.onclick=showCloudTravel;
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
    if(kind==='level')sound('levelup');
    clearTimeout(effectTimer);const effect=$('#itemEffect');effect.className=`item-effect ${kind}`;
    const icon=$('#effectIcon');icon.innerHTML='';icon.style.setProperty('--effect-art',`url("${itemArt(art||(kind==='level'?'kasaya':'peach'))}")`);
    $('#effectTitle').textContent=title;$('#effectDetail').textContent=detail;void effect.offsetWidth;effect.classList.add('show');
    effectTimer=setTimeout(()=>{effect.classList.remove('show');setTimeout(()=>effect.classList.add('hidden'),220)},1500);
  }
  function toast(text){clearTimeout(toastTimer);ui.toast.textContent=text;ui.toast.classList.add('show');toastTimer=setTimeout(()=>ui.toast.classList.remove('show'),1800)}
  function showModal(html){ui.modalContent.innerHTML=html;ui.modal.classList.remove('hidden')}
  function closeModal(){ui.modal.classList.add('hidden')}
  function save(){if(state&&!state.debug)localStorage.setItem(SAVE_KEY,JSON.stringify(state));$('#continueBtn').disabled=!localStorage.getItem(SAVE_KEY)}
  function load(){try{return JSON.parse(localStorage.getItem(SAVE_KEY))}catch{return null}}
  function enterGame(){ui.title.classList.add('hidden');ui.game.classList.remove('hidden');closeModal();$('#battleScene').classList.add('hidden');$('#itemEffect').classList.add('hidden');$('#floorTransition').classList.add('hidden');$('#debugJumpBtn').classList.toggle('hidden',!state.debug);busy=false;render();syncBgm();setTimeout(maybeShowFloorStory,120)}
  function startNew(){state=freshState();state.log=[{title:'启程',text:'悟空闯入八十一难塔，誓要救回唐僧。',type:'good'}];window.JourneyAudio?.resume();showIntro(()=>enterGame())}
  function startDebug(){state=freshDebugState(1);window.JourneyAudio?.stop();enterGame();showDebugPanel()}
  function continueGame(){state=load();if(!state){startNew();return}if(typeof state.hasMirror!=='boolean')state.hasMirror=false;state.artifacts=state.artifacts||{};state.skills=state.skills||{};state.flags={shards:0,revealed:false,shaRedeemed:false,lionCamelSeen:false,sixEarDefeated:false,...state.flags};state.visitedFloors=state.visitedFloors||Array.from({length:Math.max(1,state.floor)},(_,i)=>i+1);delete state.artifacts['demon-mirror'];delete state.debug;enterGame()}

  function syncBgm(){
    const A=window.JourneyAudio;if(!A)return;A.setEnabled(audioOn);
    if(audioOn&&!ui.game.classList.contains('hidden')){A.resume();A.setRegion(Math.floor(((state?.floor||1)-1)/9))}
  }
  function pauseBgm(){const A=window.JourneyAudio;if(!A)return;if(audioOn){A.resume();A.playTitle()}else A.setEnabled(false)}
  function sound(type){if(!audioOn)return;window.JourneyAudio?.sfx(type)}

  renderTrialCatalog();
  $('#newGameBtn').onclick=startNew;$('#continueBtn').onclick=continueGame;$('#debugGameBtn').onclick=startDebug;$('#continueBtn').disabled=!localStorage.getItem(SAVE_KEY);
  $('#bestiaryBtn').onclick=showBestiary;$('#menuBtn').onclick=showMenu;$('#helpBtn').onclick=showHelp;$('#debugJumpBtn').onclick=showDebugPanel;
  $('#soundBtn').onclick=e=>{audioOn=!audioOn;e.currentTarget.textContent=audioOn?'♪':'×';window.JourneyAudio?.setEnabled(audioOn);if(audioOn)window.JourneyAudio?.resume();syncBgm();toast(audioOn?'背景音乐与音效已开启':'声音已关闭')};
  $('#clearLogBtn').onclick=()=>{state.log=[];renderLog()};
  document.querySelectorAll('[data-close-modal]').forEach(n=>n.onclick=closeModal);
  document.querySelectorAll('.mobile-controls button').forEach(n=>n.onclick=()=>{const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[n.dataset.dir];move(...d)});
  const primeAudio=()=>{if(audioOn){window.JourneyAudio?.resume();if(ui.game.classList.contains('hidden'))window.JourneyAudio?.playTitle()}window.removeEventListener('pointerdown',primeAudio,true);window.removeEventListener('keydown',primeAudio,true)};
  window.addEventListener('pointerdown',primeAudio,true);window.addEventListener('keydown',primeAudio,true);
  window.addEventListener('keydown',e=>{if(busy){e.preventDefault();return}const map={ArrowUp:[0,-1],w:[0,-1],W:[0,-1],ArrowDown:[0,1],s:[0,1],S:[0,1],ArrowLeft:[-1,0],a:[-1,0],A:[-1,0],ArrowRight:[1,0],d:[1,0],D:[1,0]};if(map[e.key]){e.preventDefault();move(...map[e.key])}else if(e.key==='Escape'){ui.modal.classList.contains('hidden')&&state?showMenu():closeModal()}else if(e.key==='e'||e.key==='E')showBestiary()});
})();
