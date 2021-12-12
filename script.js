const playground = document.querySelector("section");
const log = (s) => console.log(s);
const $ = (id) => document.getElementById(id);

let hash_code = 0;
let id;

init();
function init() {
  const eles = [];
  eles.push(createBody());
  eles.push(createBody());
  eles.push(createBody());

  id = setInterval(() => {
    for (const i in eles) {
      const copy = eles.slice();

      const ele = eles[i];
      ele.move(ele.vel);
      ele.vel = randomVel();
      ele.style["border-color"] = "#bbb";

      copy.splice(i, 1);
      for (const against of copy) {
        let result = checkCollision(ele,against);
        if (result) {
          ele.style["border-color"] = "green";
          result = checkCollision(ele.childNodes[0],against);
          ele.style["border-color"] = "green";
          if (result) {
            ele.style["border-color"] = "red";
          }
        }
      }
    }
  }, 200);
}

function createBody() {
  const map = document.createElement("div");
  const head = document.createElement("div");
  const hash_id = hash();

  head.setAttribute("id", hash_id);
  map.setAttribute("id", hash_id);
  map.x = random(10, 90);
  map.y = random(10, 90);
  map.vel = randomVel();

  map.move = ({ x, y }) => {
    map.x += x;
    map.y += y;
    map.style.top = map.x + "%";
    map.style.left = map.y + "%";
  };

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
  const isOverlapping = isInHoriztonalBounds && isInVerticalBounds;
  return isOverlapping;
}

/*
function checkCollision(ele, func) {
  const rect = ele.getBoundingClientRect();
  const matches = document
    .elementsFromPoint(rect.left, rect.top)
    .filter((x) => ele.id != x.id && x.id);

  if (!matches.length) log("null");

  for (const match of matches) {
    if (ele.id != match.id) {
      log(ele.id + " --> " + match.id);
      return match;
    }
  }
}
*/

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
