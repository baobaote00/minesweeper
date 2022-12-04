const field = [];
const fieldSelected = [];

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

function init(level, levelOfDifficultSelect, locationPress) {
  const mine = level.levelOfDifficult[levelOfDifficultSelect]
  const { width, height } = level
  const ratio = level.ratio(levelOfDifficultSelect);

  for (let i = 0; i < width; i++) {
    field.push([])
    fieldSelected.push([])
    for (let j = 0; j < height; j++) {
      field[i].push(0)
      fieldSelected[i].push(0)
    }
  }

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const conditionX = i > (locationPress.X - 2) && i < (locationPress.X + 2);
      const conditionY = j > (locationPress.Y - 2) && j < (locationPress.Y + 2);

      if (conditionX && conditionY)
        console.log(conditionX, conditionY, i, j);

      let flag = random(conditionX && conditionY ? 0 : ratio)

      if (flag) {
        field[i][j] += 10
        for (let i1 = -1; i1 < 2; i1++) {
          for (let j1 = -1; j1 < 2; j1++) {
            if (i1 == 0 && j1 == 0) continue;
            if (field[i + i1] != undefined && field[i + i1][j + j1] != undefined) {
              field[i + i1][j + j1] += 1
            }
          }
        }
      }
    }
  }

  console.table(field)
}

