import { Component, OnInit } from '@angular/core';

import { Square } from "../square"

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})
export class StageComponent implements OnInit {
  stageArray: any = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
  currSquare: Square;
  nextSquare: Square;
  moveTimer: any = null;
  moveInterval: number = 500;
  gameTimer: any = null;
  gameInterval: number = 1000;
  gameTime: number = 0;
  ft: string = '00:00';
  isGameOver: boolean = false;
  isPause: boolean = false;
  gameScore: number = 0;

  constructor() { }

  ngOnInit() {
    this._init();
    this.gameController();
  }

  _init () {
    this.currSquare = this.createSquare();
    this.nextSquare = this.createSquare();
    this.render();
    this.gameTimeCalc();
    this.moveTimer = setInterval(() => { this.move() }, this.moveInterval);
  }

  rand (num: number = 1) {
    return Math.round(Math.random() * num);
  }

  createSquare () {
    let squareIndex = this.rand(6);
    let s: Square = new Square(squareIndex);
    s.dir = this.rand(4);
    s.origin = {
      x: 0,
      y: 3
    }
    s.rotate(s.dir);
    return s;
  }

  render (type: string = 'set') {
    let x = this.currSquare.origin.x;
    let y = this.currSquare.origin.y;
    for (let i = 0, len = this.currSquare.data.length; i < len; i++) {
      for (let j = 0, lenj = this.currSquare.data[i].length; j < lenj; j++) {
        if (this.currSquare.checkPoint(this.currSquare.origin, i, j, this.stageArray)) {
          if (type === 'clear') {
            this.stageArray[i + x][j + y] = 0;
          }
          else if (type === 'set') {
            this.stageArray[i + x][j + y] = this.currSquare.data[i][j];
          }
        }
      }
    }
  }

  gameController () {
    document.addEventListener('keydown', (e: any) => {
      e = e || event;
      let code: number = e.keyCode;
      if (code === 38) {
        this.rotate();
      }
      if (code === 37) {
        this.left();
      }
      if (code === 39) {
        this.right();
      }
      if (code === 40) {
        this.down();
      }
    });
  }

  rotate () {
    if (this.isPause) return;
    if (this.currSquare.canRotate(this.stageArray)) {
      this.render('clear');
      this.currSquare.rotate();
      this.render('set');
    }
  }

  left () {
    if (this.isPause) return;
    if (this.currSquare.canLeft(this.stageArray)) {
      this.render('clear');
      this.currSquare.left();
      this.render('set');
    }
  }

  right () {
    if (this.isPause) return;
    if (this.currSquare.canRight(this.stageArray)) {
      this.render('clear');
      this.currSquare.right();
      this.render('set');
    }
  }

  down () {
    if (this.isPause) return;
    if (this.currSquare.canDown(this.stageArray)) {
      this.render('clear');
      this.currSquare.down();
      this.render('set');
      return true;
    } else {
      return false;
    }
  }

  move () {
    if (!this.down()) {
      let score: number = 0;
      this.fixed();
      score = this.checkLine();
      this.gameScore += score;
      if (this.checkGameOver()) {
        this.isGameOver = true;
        this.stop();
      } else {
        this.currSquare = this.nextSquare;
        this.render('set');
        this.nextSquare = this.createSquare();
      }
    }
  }

  fixed () {
    let data: any = this.currSquare.data;
    for (let i = 0, len = data.length; i < len; i++) {
      for (let j = 0, lenj = data[i].length; j < lenj; j++) {
        if (this.currSquare.checkPoint(this.currSquare.origin, i, j, this.stageArray)) {
          if (this.stageArray[this.currSquare.origin.x + i][this.currSquare.origin.y + j] === 1) {
            this.stageArray[this.currSquare.origin.x + i][this.currSquare.origin.y + j] = 2;
          }
        }
      }
    } 
  }

  checkLine () {
    let line: number = 0;
    for (let i = 0; i < this.stageArray.length; i++) {
      let checknum: number = 0;
      for (let j = 0; j < this.stageArray[i].length; j++) {
        if (this.stageArray[i][j] === 2) {
          checknum = checknum + 1;
        }
      }
      if (checknum === this.stageArray[i].length) {
        line = line + 1;
        for (let k = i; k > 0; k--) {
          for (let m = 0; m < this.stageArray[i].length; m++) {
            this.stageArray[k][m] = this.stageArray[k - 1][m];
          }
        }
      }
    }
    return line;
  }

  checkGameOver () {
    let isGameover: boolean = false;
    for (let i = 0, len = this.stageArray[0].length; i < len; i++) {
      if (this.stageArray[0][i] === 2) {
        isGameover = true;
        break;
      }
    }
    return isGameover;
  }

  stop () {
    if (this.moveTimer) {
      clearInterval(this.moveTimer);
      this.moveTimer = null;
    }
  }

  gameTimeCalc () {
    this.gameTimer = setInterval( () => {
      this.gameTime = this.gameTime + 1;
      this.ft = this.formatTime(this.gameTime);
      if (this.isGameOver) {
        clearInterval(this.gameTimer);
        this.gameTimer = null;
      }
    }, this.gameInterval);
  }

  formatTime (time: number = 0) {
    let str = this.fd(Math.floor(time / 60)) + ':' + this.fd(time % 60);
    if (time > 3600) {
      return this.fd(Math.floor(time / 3600)) + ':' + str;
    }
    return str;
  }

  fd (num: number) {
    return num < 10 ? '0' + num : num;
  }

  restart () {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }
    if (this.moveTimer) {
      clearInterval(this.moveTimer);
      this.moveTimer = null;
    }
    this.clearStage();
    this.isGameOver = false;
    this.currSquare = null;
    this.nextSquare = null;
    this.gameScore = 0;
    this.gameTime = 0;
    this.ft = '00:00';
    this._init();
  }

  clearStage () {
    for (let i = 0, len = this.stageArray.length; i < len; i++) {
      for (let j = 0, lenj = this.stageArray[i].length; j < lenj; j++) {
        this.stageArray[i][j] = 0;
      }
    }
  }

  pause () {
    if (this.isPause) {
      this.isPause = false;
      this.gameTimeCalc();
      this.moveTimer = setInterval(() => { this.move() }, this.moveInterval);
    } else {
      this.isPause = true;
      if (this.gameTimer) {
        clearInterval(this.gameTimer);
        this.gameTimer = null;
      }
      if (this.moveTimer) {
        clearInterval(this.moveTimer);
        this.moveTimer = null;
      }
    }
  }
}
