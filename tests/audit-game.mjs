import fs from 'node:fs';

const source = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const audio = fs.readFileSync(new URL('../audio.js', import.meta.url), 'utf8');
const SIZE = 11;
const TOTAL_FLOORS = 81;

function literal(name, next) {
  const prefix = `const ${name} = `;
  const start = source.indexOf(prefix) + prefix.length;
  const end = source.indexOf(`\n\n  const ${next}`, start);
  return Function(`return (${source.slice(start, end).trim().replace(/;$/, '')})`)();
}

const chapters = literal('chapters', 'enemyBook');
const enemyBook = literal('enemyBook', 'bosses');
const bosses = literal('bosses', 'helpers');
const helpers = literal('helpers', 'mentors');
const mentors = literal('mentors', 'adventures');
const adventures = literal('adventures', 'eliteBosses');
const eliteBosses = literal('eliteBosses', 'artifactBook');
const artifactBook = literal('artifactBook', 'skillBook');
const skillBook = literal('skillBook', '$');
const rng = Function(`${source.slice(source.indexOf('function rng'), source.indexOf('const keyOf')).trim()}; return rng`)();
let state = { floor: 1, removed: {} };
const keyOf = (floor, x, y) => `${floor}:${x}:${y}`;
const isRemoved = (x, y) => state.removed[keyOf(state.floor, x, y)];
const doorName = key => ({ yellow: '黄', blue: '蓝', red: '红' })[key];
const generatorSource = source.slice(source.indexOf('function generateFloor'), source.indexOf('\n\n  function render()'));
const generateFloor = Function(
  'SIZE', 'TOTAL_FLOORS', 'enemyBook', 'bosses', 'helpers', 'mentors', 'adventures', 'eliteBosses', 'rng', 'isRemoved', 'doorName',
  `${generatorSource}; return generateFloor`,
)(SIZE, TOTAL_FLOORS, enemyBook, bosses, helpers, mentors, adventures, eliteBosses, rng, isRemoved, doorName);
const floorTitleSource = source.slice(source.indexOf('function getFloorMeta'), source.indexOf('\n\n  function render()'));
const floorTitleHelpers = Function(
  'chapters', 'bosses', 'eliteBosses', 'helpers', 'mentors', 'adventures', 'TOTAL_FLOORS', 'doorName',
  `${floorTitleSource}; return { getFloorTitle, getFloorMeta }`,
)(chapters, bosses, eliteBosses, helpers, mentors, adventures, TOTAL_FLOORS, doorName);
const { getFloorTitle, getFloorMeta } = floorTitleHelpers;
const artifactState = { atk: 100, def: 30, hp: 1000, maxHp: 1000, artifacts: {}, skills: {} };
const battleEffectSource = source.slice(source.indexOf('const artifactCount'), source.indexOf('\n  async function runBattle'));
const battleHelpers = Function('state', `${battleEffectSource}; return { getBattleEffects, getTightFilletBacklash }`)(artifactState);
const { getBattleEffects, getTightFilletBacklash } = battleHelpers;

function reachable(data, start, blockedEntities = new Set()) {
  const blocked = new Set(data.entities.filter(entity => blockedEntities.has(entity.type)).map(entity => `${entity.x},${entity.y}`));
  const queue = [start];
  const seen = new Set([start.join(',')]);
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (queue.length) {
    const [x, y] = queue.shift();
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      const key = `${nx},${ny}`;
      if (nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE || seen.has(key) || blocked.has(key)) continue;
      if (['wall', 'water', 'lava'].includes(data.grid[ny][nx])) continue;
      seen.add(key);
      queue.push([nx, ny]);
    }
  }
  return seen;
}

function unlockReachable(data, start) {
  const doors = data.entities.filter(entity => entity.type === 'door');
  const states = [0], visited = new Set([0]);
  let best = { seen: new Set(), opened: new Set() };
  while (states.length) {
    const mask = states.shift();
    const spent = { yellow: 0, blue: 0, red: 0 };
    doors.forEach((door, index) => { if (mask & (1 << index)) spent[door.door]++; });
    const blocked = new Set(doors.filter((door, index) => !(mask & (1 << index))).map(door => `${door.x},${door.y}`));
    const queue = [start];
    const seen = new Set([start.join(',')]);
    while (queue.length) {
      const [x, y] = queue.shift();
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy, key = `${nx},${ny}`;
        if (nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE || seen.has(key) || blocked.has(key)) continue;
        if (['wall', 'water', 'lava'].includes(data.grid[ny][nx])) continue;
        seen.add(key); queue.push([nx, ny]);
      }
    }
    const inventory = { yellow: 0, blue: 0, red: 0 };
    for (const item of data.entities.filter(entity => entity.type === 'item' && inventory[entity.item] !== undefined && seen.has(`${entity.x},${entity.y}`))) inventory[item.item]++;
    const opened = new Set(doors.filter((door, index) => mask & (1 << index)).map(door => `${door.x},${door.y}`));
    if (opened.size > best.opened.size || (opened.size === best.opened.size && seen.size > best.seen.size)) best = { seen, opened };
    doors.forEach((door, index) => {
      if (mask & (1 << index) || inventory[door.door] <= spent[door.door]) return;
      if (![[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy]) => seen.has(`${door.x+dx},${door.y+dy}`))) return;
      const nextMask = mask | (1 << index);
      if (!visited.has(nextMask)) { visited.add(nextMask); states.push(nextMask); }
    });
  }
  return best;
}

const failures = [];
const tileRule = css.match(/\.tile\{([^}]*)\}/)?.[1] || '';
if (!/overflow:hidden/.test(tileRule)) failures.push('地图格子没有裁切呼吸动画，图标可能越界');
const itemArtRule = css.match(/\.item-art\{([^}]*)\}/)?.[1] || '';
const itemArtWidth = Number(itemArtRule.match(/width:([\d.]+)%/)?.[1] || 100);
if (itemArtWidth > 80) failures.push(`地图道具占格比例过大：${itemArtWidth}%`);
if (/\.enemy-hp\.unknown[^\n}]*[> ,]span[^\n}]*\{[^}]*display:none/.test(css)) failures.push('未取得照妖镜时不应隐藏实战血条');
if (!source.includes('hasMirror:false')) failures.push('新游戏状态缺少照妖镜字段');
if (!source.includes("if(!state.hasMirror)")) failures.push('妖鉴没有受照妖镜状态控制');
if (!source.includes("$('#battleEnemyStats').textContent=`攻 ${e.atk}　防 ${e.def}`")) failures.push('实战没有始终显示敌方攻防');
if (!source.includes('function showBattleDeath')) failures.push('战败后缺少死亡结算');
if (!source.includes("done.textContent='重走西行路'")) failures.push('死亡结算缺少重新开始入口');
if (!source.includes('state.hasMirror&&projectedLoss>=state.hp')) failures.push('照妖镜没有在开战前评估必败战');
if (!/<script[^>]+src="audio\.js/.test(html)) failures.push('index.html 没有加载程序化音频引擎 audio.js');
if (!html.includes('window.JourneyAudio') && !audio.includes('window.JourneyAudio')) failures.push('音频引擎未暴露 JourneyAudio');
if (!html.includes('id="trialCatalog"')) failures.push('入口缺少八十一难目录');
if (!html.includes('踏上取经路，比抵达灵山更重要')) failures.push('入口右下角文案未更新');
if (!source.includes('renderTrialCatalog();')) failures.push('八十一难目录没有初始化');
if (!/\.trial-catalog-scroll\{[^}]*overflow-y:auto/.test(css)) failures.push('八十一难目录不能上下滚动');
if (!source.includes('data-preview-floor')) failures.push('八十一难目录不能点击预览关卡');
if (!source.includes('function showFloorPreview')) failures.push('缺少关卡预览功能');
if (!html.includes('id="artifactBar"')) failures.push('角色面板缺少法宝栏');
if (!html.includes('id="skillBar"')) failures.push('角色面板缺少大圣神通栏');
if (!source.includes('function renderArtifacts')) failures.push('法宝栏没有渲染收藏法宝');
if (!source.includes('function registerArtifact')) failures.push('法宝拾取后没有进入收藏');
if (!source.includes('artifacts:{}')) failures.push('新存档缺少法宝收藏字段');
if (!source.includes("entry.id!=='demon-mirror'")) failures.push('照妖镜仍占用法宝栏');
if (!source.includes('照妖镜已开启')) failures.push('取得照妖镜后妖鉴顶部缺少状态提示');
if (!html.includes('id="debugGameBtn"') || !html.includes('id="debugJumpBtn"')) failures.push('缺少 DEBUG 验关入口');
if (!source.includes('function freshDebugState') || !source.includes('function jumpDebug')) failures.push('DEBUG 模式不能任意跳关');
if (!source.includes('state&&!state.debug')) failures.push('DEBUG 模式可能覆盖正式存档');
if (!source.includes('function getAdventureRewards')) failures.push('奇遇奖励没有独立数值规则');
if (!source.includes('选择后立即获得永久奖励') || !source.includes('奇遇所得')) failures.push('奇遇选择或结算没有明确说明奖励');
if (Object.keys(artifactBook).length < 17) failures.push(`法宝技能数量不足：${Object.keys(artifactBook).length}`);
if (!artifactBook['tight-fillet'] || artifactBook['tight-fillet'].atk < 25) failures.push('紧箍没有提供足够的攻击收益');
if (!skillBook['somersault-cloud'] || !skillBook['fiery-eyes'] || !skillBook['rescue-hair']) failures.push('大圣三项专属神通不完整');
for (const asset of ['assets/npcs/bodhi.png','assets/npcs/guanyin.png','assets/items/somersault-cloud.png','assets/items/fiery-eyes.png','assets/items/rescue-hair.png','assets/items/tight-fillet.png']) if (!fs.existsSync(new URL(`../${asset}`, import.meta.url))) failures.push(`缺少新剧情素材：${asset}`);
if (artifactBook['three-point-blade'].atk < 15 || artifactBook['nine-tooth-rake'].atk < 18) failures.push('攻击法宝基础属性仍然过低');
if (artifactBook.kasaya.def < 15 || artifactBook['dragon-shield'].def < 14) failures.push('防御法宝基础属性仍然过低');
if (!/\.battle-scene\.artifact-skill/.test(css) || !/\.battle-log-line\.artifact/.test(css)) failures.push('法宝技能缺少战斗特效');
const effectEnemy = { hp: 1000, atk: 120, def: 60, boss: true };
const baselineEffects = getBattleEffects(effectEnemy);
artifactState.artifacts = {'three-point-blade':{count:3},'nine-tooth-rake':{count:2},kasaya:{count:2},'dragon-shield':{count:2},'tiger-saber':{count:1}};
const artifactEffects = getBattleEffects(effectEnemy);
if (artifactEffects.heroHit <= baselineEffects.heroHit) failures.push('攻击法宝没有提高实际战斗伤害');
if (artifactEffects.openingDamage <= 0) failures.push('九齿钉耙没有触发开场技能');
if (artifactEffects.enemyHit >= baselineEffects.enemyHit) failures.push('防御法宝没有降低实际战斗伤害');
if (artifactEffects.triggers.length < 3) failures.push('法宝技能战斗触发信息不足');
artifactState.skills = {'fiery-eyes':{id:'fiery-eyes'}};
const fieryEyeEffects = getBattleEffects(effectEnemy);
if (fieryEyeEffects.effectiveDef >= artifactEffects.effectiveDef) failures.push('火眼金睛没有提供额外破甲');
artifactState.artifacts['tight-fillet'] = {count:1};
if (getTightFilletBacklash(() => 0) !== 80 || getTightFilletBacklash(() => 1) !== 0) failures.push('紧箍反噬概率或伤害不正确');
if (!source.includes("state.visitedFloors?.includes(target)") || !source.includes('function showCloudTravel')) failures.push('筋斗云没有限制为已走过关卡');
if (!source.includes('function showRescueHairRevival') || !source.includes("hair.charges--")) failures.push('三根救命毫毛没有实现败亡替命');
for (let r = 0; r < 9; r++) if (!new RegExp(`r${r}:\\s*T\\(`).test(audio)) failures.push(`音频引擎缺少第 ${r + 1} 域的独立 BGM 主题 r${r}`);
if (!/title:\s*T\(/.test(audio)) failures.push('音频引擎缺少标题界面主题');
for (const api of ['setRegion', 'playTitle', 'setEnabled', 'duck', 'sfx', 'resume', 'stop']) if (!new RegExp(`function ${api}\\b`).test(audio)) failures.push(`音频引擎缺少 ${api} 接口`);
for (const fx of ['battle', 'reward', 'levelup', 'relic', 'heal', 'bossIntro', 'bossWin', 'backlash', 'rescue', 'reveal', 'win', 'death']) if (!new RegExp(`case '${fx}'`).test(audio)) failures.push(`音效缺少 ${fx} 分支`);
if (!source.includes("window.JourneyAudio?.setRegion(Math.floor((state.floor-1)/9))")) failures.push('游戏没有按域切换 BGM');
if (!source.includes("window.JourneyAudio?.duck(true)")) failures.push('战斗时没有压低背景音乐');
if (!source.includes("sound(e.boss?'bossWin':'reward')")) failures.push('胜利结算缺少奖励音效');
if (!source.includes("if(kind==='level')sound('levelup')")) failures.push('升级缺少专属音效');
const doorRule = css.match(/\.entity\.door\{([^}]*)\}/)?.[1] || '';
if (!/background:[^;}]*var\(--door(?:-dark)?\)/.test(doorRule)) failures.push('门板主体没有使用门色变量，三种门会显示成同一颜色');
for (const color of ['yellow', 'blue', 'red']) if (!css.includes(`.entity.door.door-${color}`)) failures.push(`${color} 门颜色规则优先级不足`);
let vaults = 0;
let elites = 0;
const seenDoorColors = new Set();
let mirrors = 0;
const floorTitles = [];
const density = { minWalls: Infinity, maxWalls: 0, minEnemies: Infinity, maxEnemies: 0, minRoute: Infinity, maxRoute: 0 };
for (let floor = 1; floor <= TOTAL_FLOORS; floor++) {
  state.floor = floor;
  const data = generateFloor(floor);
  const entry = [1, 9];
  const up = data.entities.find(entity => entity.type === 'stairs' && entity.direction === 'up');
  const normalReach = reachable(data, entry);
  const progression = unlockReachable(data, entry);
  const innerWalls = data.grid.flat().filter(tile => tile === 'wall').length - 40;
  const normalEnemies = data.entities.filter(entity => entity.type === 'enemy' && !entity.elite).length;
  const mainGates = data.entities.filter(entity => entity.mainGate);
  const mainGateColors = new Set(mainGates.map(entity => entity.door));
  const mirrorItems = data.entities.filter(entity => entity.item === 'mirror');
  const floorTitle = getFloorTitle(floor);
  const floorMeta = getFloorMeta(floor);
  const titleBoss = data.entities.find(entity => entity.type === 'enemy' && entity.boss && !entity.elite);
  const titleElite = data.entities.find(entity => entity.type === 'enemy' && entity.elite);
  const titleMirror = data.entities.find(entity => entity.type === 'enemy' && entity.mirrorGuardian);
  const titleHelper = data.entities.find(entity => entity.type === 'npc' && entity.npc !== 'tangseng');
  const titleAdventure = data.entities.find(entity => entity.type === 'adventure');
  const titleShop = data.entities.find(entity => entity.type === 'shop');
  const titleVault = data.entities.find(entity => entity.type === 'door' && entity.vault);
  const titleSecret = data.entities.find(entity => entity.type === 'secret');
  floorTitles.push(floorTitle);
  if (!floorTitle?.trim()) failures.push(`第 ${floor} 难缺少关卡名称`);
  if (!/^[\p{Script=Han}]{5} · [\p{Script=Han}]{5}$/u.test(floorTitle)) failures.push(`第 ${floor} 难标题不是五字对句：${floorTitle}`);
  if (titleBoss) {
    if (floorMeta.kind !== 'boss') failures.push(`第 ${floor} 难没有标记 Boss ${titleBoss.name}`);
  } else if (titleElite) {
    if (floorMeta.kind !== 'elite') failures.push(`第 ${floor} 难没有标记远古劫主 ${titleElite.name}`);
  } else if (titleMirror) {
    if (floorMeta.kind !== 'mirror') failures.push(`第 ${floor} 难没有标记照妖镜`);
  } else if (titleHelper) {
    if (floorMeta.kind !== 'helper') failures.push(`第 ${floor} 难没有标记助阵 NPC ${titleHelper.name}`);
  } else if (titleAdventure) {
    if (floorMeta.kind !== 'adventure') failures.push(`第 ${floor} 难没有标记奇遇`);
  } else if (titleShop) {
    if (floorMeta.kind !== 'shop') failures.push(`第 ${floor} 难没有标记土地庙`);
  } else if (titleVault) {
    if (floorMeta.kind !== 'vault') failures.push(`第 ${floor} 难没有标记藏宝室`);
  } else if (titleSecret && floorMeta.kind !== 'secret') failures.push(`第 ${floor} 难没有标记隐藏宝物`);
  mirrors += mirrorItems.length;
  density.minWalls = Math.min(density.minWalls, innerWalls); density.maxWalls = Math.max(density.maxWalls, innerWalls);
  density.minEnemies = Math.min(density.minEnemies, normalEnemies); density.maxEnemies = Math.max(density.maxEnemies, normalEnemies);
  density.minRoute = Math.min(density.minRoute, data.routeLength); density.maxRoute = Math.max(density.maxRoute, data.routeLength);
  if (!up || !progression.seen.has(`${up.x},${up.y}`)) failures.push(`第 ${floor} 难无法按钥匙顺序到达上楼梯`);
  if (floor < TOTAL_FLOORS && innerWalls < 18) failures.push(`第 ${floor} 难内墙过少，仅 ${innerWalls} 格`);
  if (floor < TOTAL_FLOORS && normalEnemies < 7) failures.push(`第 ${floor} 难怪物密度过低，仅 ${normalEnemies} 只`);
  const expectedGates = 3;
  if (mainGates.length !== expectedGates) failures.push(`第 ${floor} 难主路线封印门数量错误：${mainGates.length}/${expectedGates}`);
  if (mainGateColors.size !== 3) failures.push(`第 ${floor} 难没有同时出现黄、蓝、红三种主门`);
  if (data.routeLength < 15) failures.push(`第 ${floor} 难主路线过短：${data.routeLength} 格`);
  if (data.loops < 2) failures.push(`第 ${floor} 难缺少可选择的回路：${data.loops}`);
  for (const mirror of mirrorItems) {
    const guardian = data.entities.find(entity => entity.mirrorGuardian && mirror.sealedBy === `${floor}:${entity.x}:${entity.y}`);
    if (!guardian || guardian.hp < 300) failures.push(`第 ${floor} 难照妖镜缺少大型守护者`);
  }
  for (const boss of data.entities.filter(entity => entity.boss)) {
    const guards = data.entities.filter(entity => entity.bossGuard && Math.abs(entity.x - boss.x) + Math.abs(entity.y - boss.y) === 1);
    const relics = data.entities.filter(entity => entity.item === 'bossRelic' && entity.sealedBy === `${floor}:${boss.x}:${boss.y}`);
    if (guards.length < 2) failures.push(`第 ${floor} 难 Boss 身边守卫不足：${guards.length}`);
    if (!relics.length) failures.push(`第 ${floor} 难 Boss 身边没有封印法宝`);
    if (relics.some(relic => !relic.artifactId || !artifactBook[relic.artifactId])) failures.push(`第 ${floor} 难 Boss 法宝没有进入法宝图鉴`);
    if (!boss.bossChamber) failures.push(`第 ${floor} 难 Boss 仍然摆在主路上`);
    if (data.mainRoute.some(([x, y]) => x === boss.x && y === boss.y)) failures.push(`第 ${floor} 难 Boss 坐标实际位于主路线`);
    const minimum = boss.elite ? { atk: 7, def: 6, hp: 360 } : { atk: 14, def: 9, hp: 420 };
    if (relics.some(relic => !relic.reward || relic.reward.atk < minimum.atk || relic.reward.def < minimum.def || relic.reward.hp < minimum.hp)) failures.push(`第 ${floor} 难 Boss 法宝奖励过低`);
  }

  for (const entity of data.entities) {
    if (['wall', 'water', 'lava'].includes(data.grid[entity.y][entity.x])) failures.push(`第 ${floor} 难的 ${entity.type} 生成在不可通行地块`);
    if (['item', 'npc', 'shop'].includes(entity.type) && entity.icon) failures.push(`第 ${floor} 难的 ${entity.name} 仍使用文字图标`);
    if (entity.type === 'npc' && !entity.npc) failures.push(`第 ${floor} 难的 NPC ${entity.name} 缺少人物素材标识`);
    if (entity.type === 'shop' && entity.npc !== 'landgod') failures.push(`第 ${floor} 难的土地庙缺少土地公素材标识`);
    if (['gemAtk', 'gemDef'].includes(entity.item) && !entity.art) failures.push(`第 ${floor} 难的 ${entity.name} 缺少法宝素材标识`);
  }

  const door = data.entities.find(entity => entity.type === 'door' && entity.vault);
  data.entities.filter(entity => entity.type === 'door').forEach(entity => seenDoorColors.add(entity.door));
  const elite = data.entities.find(entity => entity.elite);
  if (elite) {
    elites++;
    if (24 > elite.def) failures.push(`第 ${floor} 难远古劫主前期即可击败，未形成回头挑战`);
  }
  if (door) {
    vaults++;
    const key = data.entities.find(entity => entity.vaultKey);
    if (!key || key.item !== door.door) failures.push(`第 ${floor} 难门和钥匙颜色不匹配`);
    if (key && !normalReach.has(`${key.x},${key.y}`)) failures.push(`第 ${floor} 难钥匙不可达`);
    if (!progression.opened.has(`${door.x},${door.y}`)) failures.push(`第 ${floor} 难藏宝门无法按钥匙顺序开启`);
    for (const entity of data.entities.filter(item => item.vaultGuard || item.name?.startsWith('秘藏'))) {
      if (!progression.seen.has(`${entity.x},${entity.y}`)) failures.push(`第 ${floor} 难门后奖励区不可达`);
    }
  }
}

if (seenDoorColors.size !== 3) failures.push(`门色种类不足：${[...seenDoorColors].join('、')}`);
if (mirrors !== 1) failures.push(`照妖镜数量错误：${mirrors}`);
for (const floor of [8,16,35]) { state.floor=floor; if (!generateFloor(floor).entities.some(entity=>entity.mentor)) failures.push(`第 ${floor} 难缺少传法剧情人物`); }
state.floor=41;if (!generateFloor(41).entities.some(entity=>entity.skillId==='fiery-eyes')) failures.push('第 41 难缺少八卦炉余火');
if (new Set(floorTitles).size !== TOTAL_FLOORS) failures.push(`81 难存在重复标题：${TOTAL_FLOORS - new Set(floorTitles).size} 个`);

if (vaults !== 26) failures.push(`藏宝室数量错误：${vaults}`);
if (elites !== 3) failures.push(`前期远古劫主数量错误：${elites}`);

// 数值曲线：收集可见成长物、清理普通敌人和主线 Boss，跳过可绕行远古劫主。
const hero = { hp: 1000, maxHp: 1000, atk: 24, def: 10, level: 1, exp: 0 };
const expToNext = level => 20 + level * 8;
function gainExperience(amount) {
  hero.exp += amount;
  while (hero.exp >= expToNext(hero.level)) {
    hero.exp -= expToNext(hero.level);
    hero.level++;
    const atk = 3 + Math.floor(hero.level / 5);
    const def = 2 + Math.floor(hero.level / 7);
    const hp = 80 + hero.level * 8;
    hero.atk += atk;
    hero.def += def;
    hero.maxHp += hp;
    hero.hp += hp;
  }
}

for (let floor = 1; floor <= TOTAL_FLOORS; floor++) {
  state.floor = floor;
  const data = generateFloor(floor);
  if (floor > 1) gainExperience(3 + Math.ceil(floor / 3));
  for (const item of data.entities.filter(entity => entity.type === 'item')) {
    const scale = 1 + Math.floor(floor / 12);
    if (item.item === 'potion') {
      hero.hp += 120 * scale;
      hero.maxHp = Math.max(hero.maxHp, hero.hp);
    } else if (item.item === 'gemAtk') hero.atk += 7 + Math.floor(floor / 18) * 2;
    else if (item.item === 'gemDef') hero.def += 6 + Math.floor(floor / 18) * 2;
  }
  if (helpers[floor]) {
    for (const [stat, value] of Object.entries(helpers[floor].reward)) {
      if (stat === 'atk' || stat === 'def') hero[stat] += value;
      if (stat === 'hp') {
        hero.hp += value;
        hero.maxHp = Math.max(hero.maxHp, hero.hp);
      }
    }
  }
  const enemies = data.entities.filter(entity => entity.type === 'enemy' && !entity.elite).sort((a, b) => Number(a.boss) - Number(b.boss));
  for (const enemy of enemies) {
    const hit = hero.atk - enemy.def;
    if (hit <= 0) {
      failures.push(`数值曲线在第 ${floor} 难无法破防：${enemy.name}`);
      break;
    }
    const rounds = Math.ceil(enemy.hp / hit);
    const loss = (rounds - 1) * Math.max(0, enemy.atk - hero.def);
    if (loss >= hero.hp) {
      failures.push(`数值曲线在第 ${floor} 难必败：${enemy.name}`);
      break;
    }
    hero.hp -= loss;
    if (enemy.boss) {
      hero.atk += 4 + Math.floor(floor / 9) * 2;
      hero.def += 3 + Math.floor(floor / 12);
    }
    gainExperience(enemy.boss ? 18 + floor * 2 : 5 + Math.ceil(floor / 4));
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
if (process.env.SHOW_FLOOR_TITLES === '1') floorTitles.forEach((title, index) => console.log(`${String(index + 1).padStart(2, '0')} · ${title}`));
console.log(`81 层审计通过：${vaults} 座藏宝室、${elites} 位可绕行远古劫主；内墙 ${density.minWalls}–${density.maxWalls} 格，怪物 ${density.minEnemies}–${density.maxEnemies} 只，主路线 ${density.minRoute}–${density.maxRoute} 格；数值曲线通关等级 LV${hero.level}。`);
