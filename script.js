const playground = document.querySelector("section");
const log = (s) => console.log(s);
const $ = (id) => document.getElementById(id);

let hash_code = 0;
let id;
const dirs = generateDirs();

init();
function init() {
  const eles = [];
  eles.push(createBody());
  eles.push(createBody());
  eles.push(createBody());

  id = setInterval(() => {
    for (const i in eles) {
      const copy = eles.slice();
      copy.splice(i, 1);
      frame(eles[i], copy);
    }
  }, 200);
}

function frame(ele, copy) {
  ele.style["border-color"] = "#bbb";

  // check collision
  for (let against of copy) {
    against = against.childNodes[0];
    const result = checkCollision(ele, against);
    if (result) {
      ele.style["border-color"] = "green";
      ele.following = against;
    }
  }

  // follow
  if (ele.following) {
    ele.vel = bestDir(
      ele.childNodes[0].getBoundingClientRect(),
      ele.following.getBoundingClientRect()
    );
    ele.move(ele.vel);
    return;
  }

  // move randomly
  ele.vel = randomVel();
  ele.move(ele.vel)
}

function bestDir(pos, goal) {
  let best = Infinity;
  let bestDir;

  for (const dir of dirs) {
    // add dir and pos
    const newPos = {
      x: pos.x + dir.x,
      y: pos.y + dir.y,
    };

    const distance = dist(newPos, goal);
    if (best > distance) {
      best = distance;
      bestDir = dir;
    }
  }

  return bestDir;
}

function createBody() {
  const map = document.createElement("div");
  const head = document.createElement("div");
  const hash_id = hash();

  head.setAttribute("id", hash_id);
  map.setAttribute("id", hash_id);
  map.x = random(10, 90);
  map.y = random(10, 90);
  map.following = null;
  map.vel = randomVel();

  map.move = ({ x = 0, y = 0 }) => {
    map.x += x;
    map.y += y;
    map.style.top = map.y + "%";
    map.style.left = map.x + "%";
  };

  map.move({});
  head.classList.add("head");
  map.appendChild(head);
  map.classList.add("creature");

  playground.appendChild(map);
  return map;
}

function checkCollision(a, b) {
  const rect1 = a.getBoundingClientRect();
  const rect2 = b.getBoundingClientRect();
  const isInHoriztonalBounds =
    rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
  const isInVerticalBounds =
    rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
  return isInHoriztonalBounds && isInVerticalBounds;
}

function randomVel() {
  return {
    x: random(-1, 1),
    y: random(-1, 1),
  };
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function hash() {
  hash_code += 1;
  return "hash" + hash_code;
}

function stop() {
  return clearInterval(id);
}

function dist(a, b) {
  // distance formula
  // √[(x2 − x1)2 + (y2 − y1)2]
  const dist = Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
  return Math.sqrt(dist);
}

function generateDirs() {
  const dirs = [];
  for (let x = -1; x != 2; x++) {
    for (let y = -1; y != 2; y++) {
      dirs.push({ x, y });
    }
  }
  dirs.splice(4, 1);
  return dirs;
}
