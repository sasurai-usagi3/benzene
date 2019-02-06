window.addEventListener('load', () => {
  const benzenElm = document.getElementById('js-benzen');
  const benzen = new Benzen(benzenElm);

  benzen.move(60, 60);
  benzen.scale(20, 20);
  benzen.update();
});

class Benzen {
  constructor(element) {
    this._element = element;
    this._matrix = new Matrix(1, 0, 0, 0, 1, 0, 0, 0, 1);
  }

  reset() {
    this._matrix = new Matrix(1, 0, 0, 0, 1, 0, 0, 0, 1);
  }

  // NOTE: 指定された座標分移動するメソッド
  move(x, y) {
    const matrix = new Matrix(1, 0, x, 0, 1, y, 0, 0, 1);

    this._matrix = this._matrix.multiply(matrix);
  }

  // NOTE: 拡大縮小するメソッド
  scale(sx, sy) {
    const matrix = new Matrix(sx, 0, 0, 0, sy, 0, 0, 0, 1);

    this._matrix = this._matrix.multiply(matrix);
  }

  update() {
    const transformMatrix = [];

    for(let c = 0; c < 3; ++c) {
      transformMatrix.push(this._matrix.getElement(0, c));
      transformMatrix.push(this._matrix.getElement(1, c));
    }

    const transformAttrValue = `matrix(${transformMatrix.join(', ')})`;

    this._element.setAttribute('transform', transformAttrValue);
  }
}

class Matrix {
  constructor(a, b, c, d, e, f, g, h, i) {
    this._array = [a, b, c, d, e, f, g, h, i];
  }

  multiply(other) {
    const thisArray = this._array;
    const otherArray = other._array;
    const newArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    for(let i = 0; i < 3; ++i) {
      for(let j = 0; j < 3; ++j) {
        newArray[i + 3 * j] = thisArray[3 * j] * otherArray[i] + thisArray[3 * j + 1] * otherArray[i + 3] + thisArray[3 * j + 2] * otherArray[i + 6];
      }
    }

    // TODO: 個々の要素を呼び出さずに書きたい
    return new Matrix(newArray[0], newArray[1], newArray[2], newArray[3], newArray[4], newArray[5], newArray[6], newArray[7], newArray[8]);
  }

  getElement(r, c) {
    return this._array[3 * r + c];
  }
}
