module.exports.Passport = class Passport {
  constructor(info) {
    this.info = info;
    this.Canvas = require('canvas');
    this.canvas = this.Canvas.createCanvas(1000, 620);
    this.ctx = this.canvas.getContext('2d');
  }

  async placeholder() {
    const background = await this.Canvas.loadImage('./src/passport/placeholder.png');
    this.ctx.drawImage(background, 0, 0, this.canvas.width, this.canvas.height);
  }

  async bottomBackground() {
    const background = await this.Canvas.loadImage('./src/passport/bottomPattern.png');
    this.ctx.fillStyle = this.ctx.createPattern(background, "repeat-x");
    this.ctx.save();
    this.ctx.globalCompositeOperation = "destination-over";
    this.ctx.fillRect(0, 870, this.canvas.width, 150);
    this.ctx.restore();
  }

  async topBackground() {
    const background = await this.Canvas.loadImage('./src/passport/topPattern.png');
    this.ctx.fillStyle = this.ctx.createPattern(background, "repeat");
    this.ctx.fillRect(0, 0, this.canvas.width, 130);
  }

  async draw() {
    await this.placeholder();
    await this.bottomBackground();
    await this.topBackground();
    return this.canvas.toBuffer();
  }
}

