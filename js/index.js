const field = [];
const fieldSelected = [];
let checkInit = false;

class Level {
  constructor(width, height, levelOfDifficult) {
    this.width = width || 0;
    this.height = height || 0;
    this.area = width * height || 0;
    this.levelOfDifficult = levelOfDifficult || 0;
  }

  ratio(levelOfDifficultSelect) {
    return this.area / this.levelOfDifficult[levelOfDifficultSelect]
  }
}

const level = [
  new Level(5, 5, {
    easy: 33,
    medium: 50,
    hard: 60
  }
  ),
  new Level(10, 10, {
    easy: 33,
    medium: 50,
    hard: 60
  }
  ),
  new Level(20, 20,
    {
      easy: 100,
      medium: 150,
      hard: 195
    }
  ),
  new Level(15, 20,
    {
      easy: 90,
      medium: 120,
      hard: 170
    }
  )
]

function random(to) {
  return (Math.floor(Math.random() * to) - 1) == 1;
}

function initBoom(level, levelOfDifficultSelect, locationPress) {
  const { width, height } = level
  const ratio = level.ratio(levelOfDifficultSelect);

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const conditionX = i > (locationPress.X - 2) && i < (locationPress.X + 2);
      const conditionY = j > (locationPress.Y - 2) && j < (locationPress.Y + 2);

      let flag = random((conditionX && conditionY) ? 0 : ratio)
      console.log(conditionX && conditionY);
      console.log(ratio);

      console.count("test1")
      if (flag) {
        field[i][j] += 10
        for (let i1 = -1; i1 < 2; i1++) {
          for (let j1 = -1; j1 < 2; j1++) {
            console.count("test1")
            if (field[i + i1] != undefined && field[i + i1][j + j1] != undefined) {
              field[i + i1][j + j1] += 1
            }
          }
        }
      }
    }
  }

  console.log(field);
}

function genBoom(countBoom, width, height, firstClick) {
  let result = [];
  let x;
  let y;
  let point;

  for (let index = 0; index < countBoom; index++) {
    do {
      y = randomIndex(width);
      x = randomIndex(height);
      point = { x, y };

      if (!checkItemInList(point, result) && checkFirstClick(firstClick, point)) {
        result.push(point);
        field[x][y] += 10;
        for (let j = -1; j <= 1; j++) {
          if (j) {
            try {
              if (field[x + j][y + j] != undefined)
                field[x + j][y + j] += 1;
            } catch { }

            try {
              if (field[x + j][y] != undefined)
                field[x + j][y] += 1;
            } catch { }

            try {
              if (field[x][y + j] != undefined)
                field[x][y + j] += 1;
            } catch { }

            try {
              if (field[x - j][y + j] != undefined)
                field[x - j][y + j] += 1;
            } catch { }
          }
        }
        break;
      }
    } while (true);
  }

  return result;
}

function checkFirstClick(firstClick, point) {
  return ((firstClick.x != point.x) || (firstClick.y != point.y)) &&
    ((firstClick.x - 1 != point.x) || (firstClick.y - 1 != point.y)) &&
    ((firstClick.x != point.x) || (firstClick.y - 1 != point.y)) &&
    ((firstClick.x - 1 != point.x) || (firstClick.y != point.y)) &&
    ((firstClick.x + 1 != point.x) || (firstClick.y - 1 != point.y)) &&
    ((firstClick.x - 1 != point.x) || (firstClick.y + 1 != point.y)) &&
    ((firstClick.x != point.x) || (firstClick.y + 1 != point.y)) &&
    ((firstClick.x + 1 != point.x) || (firstClick.y != point.y)) &&
    ((firstClick.x + 1 != point.x) || (firstClick.y + 1 != point.y))
}

function checkItemInList(item, list) {
  for (const key of list) {
    if (key.x == item.x && key.y == item.y) {
      return true;
    }
  }
  return false;
}
function randomIndex(to) {
  return (Math.floor(Math.random() * to));
}

function init(level) {
  const { width, height } = level
  const wrap = document.querySelector(".field")

  const heightWindow = window.innerHeight;
  wrap.style.height = (heightWindow * 0.68) + 'px';
  wrap.style.width = (heightWindow * 0.68) + 'px';
  wrap.innerHTML = '';

  for (let i = 0; i < width; i++) {
    field.push([])
    fieldSelected.push([])
    for (let j = 0; j < height; j++) {
      const element = document.createElement("div")

      element.classList.add("box");
      element.setAttribute("location-x", `${i}`);
      element.setAttribute("location-y", `${j}`);

      element.style.width = `calc(${100 / width}% - 2px)`;
      element.style.height = `calc(${100 / height}% - 2px)`;

      field[i].push(0)
      fieldSelected[i].push(0)

      wrap.appendChild(element);
    }
  }
}

init(level[1])
// initBoom(level[0], "easy", { X: 5, Y: 5 })

function addEvent() {
  document.querySelectorAll('.box').forEach((element) => {
    element.addEventListener('click', (event) => {
      const locationX = +event.target.getAttribute("location-x")
      const locationY = +event.target.getAttribute("location-y")

      if (!checkInit) {
        genBoom(33, 10, 10, { x: locationX, y: locationY });
        checkInit = true
      }

      if (field[locationX][locationY] == 0) {
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            if (field[locationX + i] != undefined && field[locationX + i][locationY + j] != undefined) {
              fieldSelected[locationX + i][locationY + j] = 1
              const elementLocation = document.querySelector(`[location-x='${locationX + i}'][location-y='${locationY + j}']`);
              elementLocation.style.backgroundColor = "#000080";
              if (field[locationX + i][locationY + j] == 0) continue;
              elementLocation.innerHTML = field[locationX + i][locationY + j]
            }
          }
        }
      } else if (field[locationX][locationY] >= 10) {
        alert("thua")
      } else if (field[locationX][locationY] < 10) {
        document.querySelector(`[location-x='${locationX}'][location-y='${locationY}']`).innerHTML = field[locationX][locationY]
      }
    })

    element.addEventListener('contextmenu', function eventRightClick(event) {
      event.preventDefault()
      const locationX = +event.target.getAttribute("location-x")
      const locationY = +event.target.getAttribute("location-y")

      const elementLocation = document.querySelector(`[location-x='${locationX}'][location-y='${locationY}']`)

      if (fieldSelected[locationX][locationY] == 1) return
      if (fieldSelected[locationX][locationY] == 2) {
        elementLocation.innerHTML = ' '
        return
      }
      fieldSelected[locationX][locationY] = 2
      elementLocation.innerHTML = "cờ"
    });

    element.addEventListener('dblclick', (event) => {
      event.preventDefault()
      const locationX = +event.target.getAttribute("location-x")
      const locationY = +event.target.getAttribute("location-y")

      console.log(locationX, locationY);
    });
  })
}

addEvent()
