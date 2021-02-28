export interface TileProps extends Record<string, string | boolean | number> {}

export type FieldOfBugs = TileProps[][];

export const createMatrix = (x: number, y: number, fill: any) => {
  return new Array(x).fill(0).map(() => new Array(y).fill(fill));
};

const isTileExist = (x: number, y: number, field: FieldOfBugs) => {
  return x < field.length && x >= 0 && y < field[0].length && y >= 0;
};
const isTileNotABug = (x: number, y: number, field: FieldOfBugs) => {
  return typeof field[x][y].value === 'number';
};

const openTile = (x: number, y: number, field: FieldOfBugs) => {
  if (
    isTileExist(x, y, field) &&
    isTileNotABug(x, y, field) &&
    !field[x][y].open &&
    !field[x][y].flag
  ) {
    field[x][y].open = true;

    openEmptyTiles(x, y, field);
  }
  return field;
};

export const openEmptyTiles = (x: number, y: number, field: FieldOfBugs): FieldOfBugs => {
  if (!field[x][y].value) {
    openTile(x + 1, y, field);
    openTile(x + 1, y + 1, field);
    openTile(x + 1, y - 1, field);
    openTile(x - 1, y, field);
    openTile(x - 1, y - 1, field);
    openTile(x - 1, y + 1, field);
    openTile(x, y + 1, field);
    openTile(x, y - 1, field);
  }
  return field;
};

const addProperties = (matrix: number[][], propsObj = { value: 0, open: false, flag: false }) => {
  return matrix.map((arr) => {
    return arr.map((e) => {
      return { ...propsObj };
    });
  });
};

const randomInteger = (max: number): number => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const createRandomListOfCoordinats = (n: number, maxX: number, maxY: number): number[][] => {
  const list = new Set();
  while (list.size < n) {
    list.add(`${randomInteger(maxX)}-${randomInteger(maxY)}`);
  }
  const arr = Array.from(list) as string[];

  return arr.map((s) => s.split('-').map((e) => Number(e))); // spreading cause a TS warning
};

const bugCounter = (x: number, y: number, arr: FieldOfBugs): void => {
  if (isTileExist(x, y, arr) && isTileNotABug(x, y, arr)) {
    arr[x][y].value = Number(arr[x][y].value) + 1;
  }
};

export const plantBugs = (
  rows: number,
  columns: number,
  bugs: number,
): { field: FieldOfBugs; listOfBugs: number[][] } => {
  const field: FieldOfBugs = addProperties(createMatrix(rows, columns, 0));
  const listOfBugs = createRandomListOfCoordinats(bugs, rows, columns);
  listOfBugs.forEach((c: number[]) => {
    const [x, y] = c;
    field[x][y].value = 'B';
    bugCounter(x + 1, y, field);
    bugCounter(x + 1, y + 1, field);
    bugCounter(x + 1, y - 1, field);
    bugCounter(x - 1, y, field);
    bugCounter(x - 1, y - 1, field);
    bugCounter(x - 1, y + 1, field);
    bugCounter(x, y + 1, field);
    bugCounter(x, y - 1, field);
  });
  return { field, listOfBugs };
};
