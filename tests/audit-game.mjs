import fs from 'node:fs';

const source = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const bgm = fs.readFileSync(new URL('../assets/audio/journey-tower-bgm.wav', import.meta.url));
const SIZE = 11;
const TOTAL_FLOORS = 81;

function literal(name, next) {
  const prefix = `const ${name} = `;
  const start = source.indexOf(prefix) + prefix.length;
  const end = source.indexOf(`\n\n  const ${next}`, start);
  return Function(`return (${source.slice(start, end).trim().replace(/;$/, '')})`)();
}

const enemyBook = literal('enemyBook', 'bosses');
const bosses = literal('bosses', 'helpers');
const helpers = literal('helpers', 'adventures');
const adventures = literal('adventures', 'eliteBosses');
const eliteBosses = literal('eliteBosses', '$');
const rng = Function(`${source.slice(source.indexOf('function rng'), source.indexOf('const keyOf')).trim()}; return rng`)();
let state = { floor: 1, removed: {} };
const keyOf = (floor, x, y) => `${floor}:${x}:${y}`;
const isRemoved = (x, y) => state.removed[keyOf(state.floor, x, y)];
const doorName = key => ({ yellow: '黄', blue: '蓝', red: '红' })[key];
const generatorSource = source.slice(source.indexOf('function generateFloor'), source.indexOf('\n\n  function render()'));
const generateFloor = Function(
  'SIZE', 'TOTAL_FLOORS', 'enemyBook', 'bosses', 'helpers', 'adventures', 'eliteBosses', 'rng', 'isRemoved', 'doorName',
  `${generatorSource}; return generateFloor`,
)(SIZE, TOTAL_FLOORS, enemyBook, bosses, helpers, adventures, eliteBosses, rng, isRemoved, doorName);

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
if (!source.includes('hasMirror:false')) failures.push('新游戏状态缺少照妖镜字段');
if (!source.includes("if(!state.hasMirror)")) failures.push('妖鉴没有受照妖镜状态控制');
if (!source.includes("side==='Enemy'&&!state.hasMirror")) failures.push('战斗血条没有受照妖镜状态控制');
if (!/<audio[^>]+id="bgm"[^>]+loop/.test(html)) failures.push('背景音乐没有配置循环播放');
if (bgm.toString('ascii', 0, 4) !== 'RIFF' || bgm.toString('ascii', 8, 12) !== 'WAVE') failures.push('背景音乐不是有效 WAV 文件');
const bgmRate = bgm.readUInt32LE(24), bgmChannels = bgm.readUInt16LE(22), bgmBits = bgm.readUInt16LE(34), bgmDataBytes = bgm.readUInt32LE(40);
const bgmDuration = bgmDataBytes / (bgmRate * bgmChannels * (bgmBits / 8));
if (Math.abs(bgmDuration - 180) > 0.01) failures.push(`背景音乐时长错误：${bgmDuration.toFixed(2)} 秒`);
const doorRule = css.match(/\.entity\.door\{([^}]*)\}/)?.[1] || '';
if (!/background:[^;}]*var\(--door(?:-dark)?\)/.test(doorRule)) failures.push('门板主体没有使用门色变量，三种门会显示成同一颜色');
let vaults = 0;
let elites = 0;
const seenDoorColors = new Set();
let mirrors = 0;
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
  const mirrorItems = data.entities.filter(entity => entity.item === 'mirror');
  mirrors += mirrorItems.length;
  density.minWalls = Math.min(density.minWalls, innerWalls); density.maxWalls = Math.max(density.maxWalls, innerWalls);
  density.minEnemies = Math.min(density.minEnemies, normalEnemies); density.maxEnemies = Math.max(density.maxEnemies, normalEnemies);
  density.minRoute = Math.min(density.minRoute, data.routeLength); density.maxRoute = Math.max(density.maxRoute, data.routeLength);
  if (!up || !progression.seen.has(`${up.x},${up.y}`)) failures.push(`第 ${floor} 难无法按钥匙顺序到达上楼梯`);
  if (floor < TOTAL_FLOORS && innerWalls < 18) failures.push(`第 ${floor} 难内墙过少，仅 ${innerWalls} 格`);
  if (floor < TOTAL_FLOORS && normalEnemies < 7) failures.push(`第 ${floor} 难怪物密度过低，仅 ${normalEnemies} 只`);
  const expectedGates = 1 + (floor >= 19 ? 1 : 0) + (floor >= 55 ? 1 : 0);
  if (mainGates.length !== expectedGates) failures.push(`第 ${floor} 难主路线封印门数量错误：${mainGates.length}/${expectedGates}`);
  if (data.routeLength < 15) failures.push(`第 ${floor} 难主路线过短：${data.routeLength} 格`);
  if (data.loops < 2) failures.push(`第 ${floor} 难缺少可选择的回路：${data.loops}`);
  const boss = data.entities.find(entity => entity.boss && !entity.elite);
  if (boss) {
    const guards = data.entities.filter(entity => entity.bossGuard && Math.abs(entity.x - boss.x) + Math.abs(entity.y - boss.y) === 1);
    const relics = data.entities.filter(entity => entity.item === 'bossRelic' && entity.sealedBy === `${floor}:${boss.x}:${boss.y}`);
    if (guards.length < 2) failures.push(`第 ${floor} 难 Boss 身边守卫不足：${guards.length}`);
    if (!relics.length) failures.push(`第 ${floor} 难 Boss 身边没有封印法宝`);
    if (relics.some(relic => !relic.reward || relic.reward.atk < 14 || relic.reward.def < 9 || relic.reward.hp < 420)) failures.push(`第 ${floor} 难 Boss 法宝奖励过低`);
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
console.log(`81 层审计通过：${vaults} 座藏宝室、${elites} 位可绕行远古劫主；内墙 ${density.minWalls}–${density.maxWalls} 格，怪物 ${density.minEnemies}–${density.maxEnemies} 只，主路线 ${density.minRoute}–${density.maxRoute} 格；数值曲线通关等级 LV${hero.level}。`);
