import fs from 'node:fs';

const source = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
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

const failures = [];
let vaults = 0;
let elites = 0;
for (let floor = 1; floor <= TOTAL_FLOORS; floor++) {
  state.floor = floor;
  const data = generateFloor(floor);
  const entry = [1, 9];
  const up = data.entities.find(entity => entity.type === 'stairs' && entity.direction === 'up');
  const normalReach = reachable(data, entry);
  const noCombatReach = reachable(data, entry, new Set(['enemy', 'door']));
  if (!up || !normalReach.has(`${up.x},${up.y}`)) failures.push(`第 ${floor} 难无法到达上楼梯`);
  if (up && !noCombatReach.has(`${up.x},${up.y}`)) failures.push(`第 ${floor} 难被怪物或门完全堵死`);

  for (const entity of data.entities) {
    if (['wall', 'water', 'lava'].includes(data.grid[entity.y][entity.x])) failures.push(`第 ${floor} 难的 ${entity.type} 生成在不可通行地块`);
  }

  const door = data.entities.find(entity => entity.type === 'door' && entity.vault);
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
    const approach = `${door.x - 1},${door.y}`;
    if (!normalReach.has(approach)) failures.push(`第 ${floor} 难藏宝门入口不可达`);
    const vaultReach = reachable(data, [door.x, door.y]);
    for (const entity of data.entities.filter(item => item.vaultGuard || item.name?.startsWith('秘藏'))) {
      if (!vaultReach.has(`${entity.x},${entity.y}`)) failures.push(`第 ${floor} 难门后奖励区不可达`);
    }
  }
}

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
console.log(`81 层审计通过：${vaults} 座藏宝室、${elites} 位可绕行远古劫主；主路线可达；数值曲线通关等级 LV${hero.level}。`);
