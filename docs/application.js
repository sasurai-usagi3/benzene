window.addEventListener('load', () => {
  const benzeneOmittedElm = document.getElementById('js-benzene--omitted');
  const benzeneSpecifiedElm = document.getElementById('js-benzene--specified');
  const loadingSentenceElm = document.getElementById('js-loading-sentence');
  const benzene = new Benzene(benzeneOmittedElm, benzeneSpecifiedElm);
  const loadingSentence = 'Loading...'
  let a = 0, showLengthOfLoadingSentence = 0;

  setInterval(() => {
    a = (a + 1) % 360;
    benzene.reset();
    benzene.move(110, 150);
    benzene.rotate(a);
    benzene.scale(50, 50);
    benzene.update();

    if(a === 0) {
      benzene.change();
    }
  }, 5);

  setInterval(() => {
    showLengthOfLoadingSentence = (showLengthOfLoadingSentence + 1) % 11;

    loadingSentenceElm.textContent = loadingSentence.slice(0, showLengthOfLoadingSentence);
  }, 150);
});

class Benzene {
  constructor(omittedElement, specifiedElement) {
    this._element = omittedElement;
    this._hiddenElement = specifiedElement;
    this._matrix = new Matrix(1, 0, 0, 0, 1, 0, 0, 0, 1);

    this._element.classList.remove('is-hidden');
    this._hiddenElement.classList.add('is-hidden');
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

  // NOTE: 回転させるメソッド
  rotate(a) {
    const rad = a * Math.PI / 180;
    const matrix = new Matrix(Math.cos(rad), -Math.sin(rad), 0, Math.sin(rad), Math.cos(rad), 0, 0, 0, 1);

    this._matrix = this._matrix.multiply(matrix);
  }

  change() {
    const tmp = this._element;
    this._element = this._hiddenElement;
    this._hiddenElement = tmp;

    this._element.classList.remove('is-hidden');
    this._hiddenElement.classList.add('is-hidden');
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
