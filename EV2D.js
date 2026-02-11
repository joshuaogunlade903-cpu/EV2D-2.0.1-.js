console.log("EV2D version 0.2.0 by Joshua Ogunlade Oluwanifemi");
class Joystick {
  constructor(options = {}) {
    this.container = options.container || document.body;

    this.size = options.size || 150;
    this.baseColor = options.baseColor || 'rgba(0,0,0,0.3)';
    this.stickColor = options.stickColor || 'rgba(0,0,0,0.6)';
    this.zIndex = options.zIndex || 20;
    this.position = options.position || 'absolute';
    this.left = options.left !== undefined ? options.left: 20;
    this.top = options.top !== undefined ? options.top: 20;

    this.canvas = document.createElement('canvas');
    this._ = this.canvas

    // Use devicePixelRatio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.size * dpr;
    this.canvas.height = this.size * dpr;

    // Set CSS size to be square and fixed
    this.canvas.style.width = this.size + 'px';
    this.canvas.style.height = this.size + 'px';

    this.canvas.style.position = this.position;
    this.canvas.style.zIndex = this.zIndex;
    this.canvas.style.touchAction = 'none';
    this.canvas.style.userSelect = 'none';

    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(dpr, dpr);

    this.container.appendChild(this.canvas);

    this.center = this.size / 2;
    this.maxRadius = this.center * 0.9;
    this.stickRadius = this.maxRadius * 0.4;

    this.stickX = this.center;
    this.stickY = this.center;

    this.active = false;
    this.pointerId = null;

    this.deltaX = 0;
    this.deltaY = 0;

    this._startHandler = this._start.bind(this);
    this._moveHandler = this._move.bind(this);
    this._endHandler = this._end.bind(this);

    this.canvas.addEventListener('pointerdown', this._startHandler);
    window.addEventListener('pointermove', this._moveHandler);
    window.addEventListener('pointerup', this._endHandler);
    window.addEventListener('pointercancel', this._endHandler);

    this.draw();
  }
  _start(e) {
    if (this.active) return;
    if (e.pointerType !== 'touch' && e.pointerType !== 'pen' && e.pointerType !== 'mouse') return;

    this.active = true;
    this.pointerId = e.pointerId;
    this._updateStickPosition(e);
  }
  positionLT(x, y) {
    this._.style.left = x
    this._.style.top = y
  }
  positionLB(x, y) {
    this._.style.left = x
    this._.style.bottom = y
  }
  positionRB(x, y) {
    this._.style.right = x
    this._.style.bottom = y
  }
  positionRT(x, y) {
    this._.style.right = x
    this._.style.top = y
  }
  size(x, y) {
    this._.style.width = x
    this._.style.height = y
  }
  scale(x, y) {
    this._.style.padding = x+" "+y
  }
  attr(x, v) {
    this._.style.setProperty(x, v)
  }
  _move(e) {
    if (!this.active || e.pointerId !== this.pointerId) return;
    this._updateStickPosition(e);
  }

  _end(e) {
    if (!this.active || e.pointerId !== this.pointerId) return;
    this.active = false;
    this.pointerId = null;
    this.stickX = this.center;
    this.stickY = this.center;
    this.deltaX = 0;
    this.deltaY = 0;
    this.draw();
  }

  _updateStickPosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    let dx = x - this.center;
    let dy = y - this.center;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > this.maxRadius) {
      dx = (dx / dist) * this.maxRadius;
      dy = (dy / dist) * this.maxRadius;
    }

    this.stickX = this.center + dx;
    this.stickY = this.center + dy;

    this.deltaX = dx / this.maxRadius;
    this.deltaY = dy / this.maxRadius;

    this.draw();
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.size, this.size);

    // Draw base circle
    ctx.beginPath();
    ctx.arc(this.center, this.center, this.maxRadius, 0, Math.PI * 2);
    ctx.fillStyle = this.baseColor;
    ctx.fill();

    // Draw stick circle
    ctx.beginPath();
    ctx.arc(this.stickX, this.stickY, this.stickRadius, 0, Math.PI * 2);
    ctx.fillStyle = this.stickColor;
    ctx.fill();
  }
  getPosition() {
    return {
      x: this.deltaX,
      y: this.deltaY
    }
  }
  destroy() {
    this.canvas.removeEventListener('pointerdown', this._startHandler);
    window.removeEventListener('pointermove', this._moveHandler);
    window.removeEventListener('pointerup', this._endHandler);
    window.removeEventListener('pointercancel', this._endHandler);
    if (this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}
function toImage(url) {
  return Image(url)
}
const CALLS = []
function MAINLOOP() {
  CALLS.forEach(e => {
    e()
  })
  requestAnimationFrame(MAINLOOP)
}
requestAnimationFrame(MAINLOOP)

function getRandomInt(min, max) {
  min = Math.ceil(min); // Round up min to the nearest integer
  max = Math.floor(max); // Round down max to the nearest integer
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function toRad(deg) {
  return deg * Math.PI / 180;
}
GUIUPDATE = []
class Vector {
  constructor(x = 0, y = 0) {
    this._ = [x,
      y];
  }
  add(b) {
    this._[0] += b._[0];
    this._[1] += b._[1];
    return this;
  }
  subtract(b) {
    this._[0] -= b._[0];
    this._[1] -= b._[1];
    return this;
  }
  multiply(b) {
    // fixed typo from 'multipy' to 'multiply'
    this._[0] *= b._[0];
    this._[1] *= b._[1];
    return this;
  }
  divide(b) {
    this._[0] /= b._[0];
    this._[1] /= b._[1];
    return this;
  }
  scale(n) {
    this._[0] *= n
    this._[1] *= n
    return this;
  }
  fill(n) {
    this._[0] = n
    this._[1] = n
    return this;
  }
  negate() {
    this._[0]*=-1
    this._[1]*=-1
    return this;
  }
  rotate(rad) {
    let x = this._[0]
    let y = this._[1]
    const radians = rad
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    this._[0] = x * cos - y * sin;
    this._[1] = x * sin + y * cos;
    return this
  }
  normalize() {
    let length = Math.sqrt(this._[0] ** 2 + this._[1] ** 2);
    if (length === 0) return this;
    this._[0] /= length;
    this._[1] /= length;
    return this;
  }
  get x() {
    return this._[0]
  }
  get y() {
    return this._[1]
  }
  set x(v) {
    this._[0] = v
  }
  set y(v) {
    this._[1] = v
  }
}
class OOBCollider {
  constructor(entity) {
    let center = entity.position
    let width = entity.width
    let height = entity.height
    let rotation = entity.rotation
    this.center = center; // {x, y}
    this.halfWidth = width / 2;
    this.halfHeight = height / 2;
    this.rotation = rotation; // in radians
    this.yE = 0
    this.xE = 0
    this.cE = vec2(0, 0)
  }

  // Calculate the four corners of the rotated box
  getPoints() {
    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);

    const corners = [{
      x: -this.halfWidth,
      y: -this.halfHeight
    },
      {
        x: this.halfWidth,
        y: -this.halfHeight
      },
      {
        x: this.halfWidth,
        y: this.halfHeight
      },
      {
        x: -this.halfWidth,
        y: this.halfHeight
      },
    ];

    return corners.map(({
      x, y
    }) => ({
      x: this.center.x + x * cos - y * sin,
      y: this.center.y + x * sin + y * cos,
    }));
  }

  // Update collider position and rotation (call every frame or on transform change)
  update(ts) {
    this.center = new Vector(ts.width/2, ts.height/2).add(ts.position)
    this.rotation = ts.rotation;
    this.halfWidth = ts.width/2
    this.halfHeight = ts.height/2
  }
}


function perpendicular(v) {
  return {
    x: -v.y,
    y: v.x
  };
}

function project(points, axis) {
  let min = dot(points[0], axis);
  let max = min;
  for (let i = 1; i < points.length; i++) {
    const p = dot(points[i], axis);
    if (p < min) min = p;
    if (p > max) max = p;
  }
  return {
    min,
    max
  };
}

function overlap(proj1, proj2) {
  return proj1.max >= proj2.min && proj2.max >= proj1.min;
}

function getAxes(points) {
  const axes = [];
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    const edge = subtract(p2, p1);
    const axis = normalize(perpendicular(edge));
    axes.push(axis);
  }
  return axes;
}

function isColliding(boxA, boxB) {
  const pointsA = boxA.getPoints();
  const pointsB = boxB.getPoints();

  const axesA = getAxes(pointsA);
  const axesB = getAxes(pointsB);

  const axes = axesA.concat(axesB);

  for (const axis of axes) {
    const projA = project(pointsA, axis);
    const projB = project(pointsB, axis);
    if (!overlap(projA, projB)) {
      return false; // Separation found, no collision
    }
  }
  return true; // No separation found, collision detected
}

class Texture {
  constructor(imgUrl = "", a = 1) {
    this.name = "texture"
    this.image = new Image();
    this.image.src = imgUrl;
    this.settings = {
      alpha: a
    };
    if (imgUrl == "") {
      this.fillWithColor("black")}
  }

  fillWithColor(color, w = 100, h = 100) {
    let canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    let ctx = canvas.getContext("2d");
    ctx.globalAlpha = this.settings.alpha;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.image.src = canvas.toDataURL("image/png");
    canvas = null;
  }
  fillWithText(text = "default", w = 100, h = 50, color = "blue", font = "20px Tahoma") {
    let canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    let ctx = canvas.getContext("2d");
    ctx.globalAlpha = this.settings.alpha;
    ctx.fillStyle = color;
    ctx.alignment = "center"
    ctx.font = font
    let yk = ctx.measureText(text)
    ctx.fillText(text, w/2-yk.width/2, h/2)
    this.image.src = canvas.toDataURL("image/png");
    yk = null
    canvas = null;
  }
  fillCustom(func) {
    let canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    let ctx = canvas.getContext("2d");
    ctx.globalAlpha = this.settings.alpha;
    func(ctx, canvas);
    this.image.src = canvas.toDataURL("image/png");
    canvas = null;
    ctx = null;
  }

  resize(w, h) {
    let canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    let ctx = canvas.getContext("2d");
    ctx.globalAlpha = this.settings.alpha;
    ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);
    this.image.src = canvas.toDataURL("image/png");
    canvas = null;
    ctx = null;
  }

  crop(x, y, w, h) {
    let canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    let ctx = canvas.getContext("2d");
    ctx.globalAlpha = this.settings.alpha;
    // Draw the cropped portion of the image at 0,0 on the canvas
    ctx.drawImage(this.image, x, y, w, h, x, y, w, h);
    this.image.src = canvas.toDataURL("image/png");
    canvas = null;
    ctx = null;
  }
  onReady(f) {
    this.image.onload = e => f(this, e)
  }
  getImage() {
    return this.image;
  }

  changeURL(url) {
    this.image.src = url;
  }

  getURL() {
    return this.image.src
  }

}
//{1:[20,20,Image("")]
class ImageAnimator {
  constructor(entity, frames = [], duration = 1300, loop = false, warn = false) {
    if (warn) console.warn("use ImageSrcAnimation for better result as this is not suitable for speed but is for efficiency");
    this.entity = entity
    this.frames = frames
    this.key = 0
    this.step = 1
    this.fps = duration
    this.loop = loop
    this.isPaused = true
    this.isFinished = false
    this.registeredKeys = frames
  }
  shouldLoop(v) {
    this.loop = v
  }
  setDuration(d) {
    this.fps = d
  }
  work() {
    if (!this.isFinished && !this.isPaused) {
      this.registeredKeys.forEach(e => {
        if (Number(this.key) == Number(e[0])) {
          this.entity.texture.image = e[1]
        }
      })
      this.key += 1
      if (this.key > this.fps) {
        if (!this.loop) {
          this.isFinished = true
        } else {
          this.key = 0
        }
      }
    }
  }
  add(key = 1, image) {
    this.registeredKeys.push(([key, image]))
  }

  addAll(l) {
    l.forEach(e => {
      this.registeredKeys.push(e)
    })
  }
  clearKey(num = 1) {
    this.registeredKeys.forEach((e, i)=> {
      if (Number(e[0]) == Number(num)) {
        this.registeredKeys.splice(i, 1)
      }
    })
  }
  clear() {
    this.registeredKeys = []
  }
  start() {
    this.isPaused = false
  }
  stop() {
    this.isPaused = true
  }
  reset() {
    this.key = 0
    this.isFinished = false
  }
}

class ImageSrcAnimator extends ImageAnimator {
  constructor(entity,
    frames = [],
    duration = 1300,
    loop = false) {
    super(entity,
      frames,
      duration,
      loop);
  }
  work() {
    if (!this.isFinished && !this.isPaused) {
      this.registeredKeys.forEach(e => {
        if (Number(this.key) == Number(e[0])) {
          this.entity.texture.image.src = e[1]
        }
      })
      this.key += 1
      if (this.key > this.fps) {
        if (!this.loop) {
          this.isFinished = true
        } else {
          this.key = 0
        }
      }
    }
  }
}
class FunctionAnimator extends ImageAnimator {
  constructor(entity, frames = [], duration = 1300, loop = false) {
    super(entity, frames, duration, loop);
  }
  work() {
    if (!this.isFinished && !this.isPaused) {
      this.registeredKeys.forEach(e => {
        if (Number(this.key) == Number(e[0])) {
          e[1](this.entity)
        }
      })
      this.key += 1
      if (this.key > this.fps) {
        if (!this.loop) {
          this.isFinished = true
        } else {
          this.key = 0
        }
      }
    }
  }
}

class Base {
  constructor() {
    this.name = "base";
    this.velocity = new Vector(0, 0)
    this.position = new Vector(0, 0);
    this.animators = {
      image: new ImageAnimator(this)}
    this.rotation = 0; // rotation in radians
    this.texture = new Texture();
    this.moveWith = new Vector()
    this.data = {}
    this.texture.fillWithColor("red");
    this.collider = new OOBCollider(this);
    this.colliderList = []
    this.collideLevel = 0
    this.settings = {
      alpha: 1,
      hasTexture: true,
      hasOutline: false,
      outlineColor: "black",
      isVisible: true,
      isPaused: false,
      rotationType: "position",
      parentFollow: "all",
      applyVelocity: true,
      velocityReduction: 0.1,
      velocitySensitivity: 0.2,
      allowMoveWith: true
    };
    this.parent = null;
  }

  beforeRender(entity, time, deltatime) {
    // Placeholder for logic before rendering
  }
  startAllAnimations() {
    Object.values(this.animators).forEach(e => {
      e.start()
    })
  }
  stopAllAnimations() {
    Object.values(this.animators).forEach(e => {
      e.stop()
    })
  }
  resetAllAnimations() {
    Object.values(this.animators).forEach(e => {
      e.reset()
    })
  }
  collideWith(y) {
    return isColliding(this.collider, y.collider)
  }
  setMoveWith(m) {
    this.moveWith = m
  }
  clearMoveWith() {
    this.moveWith = new Vector()
  }
  getDirection(direction) {
    // Map cardinal directions to base angles in radians
    const angleMap = {
      north: -Math.PI / 2,
      // Upwards in canvas coordinates (y-axis down)
      east: 0,
      south: Math.PI / 2,
      west: Math.PI,
    };
    // Get base angle for the requested direction
    let baseAngle = angleMap[direction.toLowerCase()];
    if (baseAngle === undefined) {
      // Default to north if unknown direction
      baseAngle = -Math.PI / 2;
    }

    // Add the player's current rotation to the base angle
    let totalAngle = baseAngle + this.rotation;

    // Calculate the direction vector components
    const x = Math.cos(totalAngle);
    const y = Math.sin(totalAngle);

    // Return a normalized Vector instance
    return new Vector(x, y).normalize();
  }

  get width() {
    return this.texture.image.width
  }
  get height() {
    return this.texture.image.height
  }
  set width(w) {
    this.texture.resize(w, this.texture.image.height)
  }
  set height(h) {
    this.texture.resize(this.texture.image.width, h)
  }
  lookAt(e, offsetAngle = 0) {
    let p = new Vector()
    p.subtract(this.position)
    p.add(e.position)
    this.rotation = Math.atan2(p.y, p.x) + offsetAngle
  }
  checkBeforeForce() {
    return true
  }
  applyForce(v) {
    if (this.checkBeforeForce()) {
      this.velocity.add(v)
    }
  }
  onCollide(e, i) {}
  draw(ctx) {
    this.colliderList.forEach((e, i)=> {
      if (e.collideWith(this)) {
        this.onCollide(e, i)
      }
    })
    if (this.settings.allowMoveWith) {
      this.position.add(this.moveWith)
    }
    if (this.settings.applyVelocity) {
      this.position.add(this.velocity)
      if (this.velocity.x > this.settings.velocitySensitivity) {
        this.velocity.x -= this.settings.velocityReduction
      }
      if (this.velocity.x < -1*(this.settings.velocitySensitivity)) {
        this.velocity.x += this.settings.velocityReduction
      }
      if (this.velocity.y > this.settings.velocitySensitivity) {
        this.velocity.y -= this.settings.velocityReduction
      }
      if (this.velocity.y < -1*(this.settings.velocitySensitivity)) {
        this.velocity.y += this.settings.velocityReduction
      }
      if (this.velocity.x < this.settings.velocitySensitivity && this.velocity.x > -1*(this.settings.velocitySensitivity)) {
        this.velocity.x = 0
      }
      if (this.velocity.y < this.settings.velocitySensitivity && this.velocity.y > -1*(this.settings.velocitySensitivity)) {
        this.velocity.y = 0
      }
    }
    if (this.settings.isVisible) {
      ctx.save();
      this.collider.update(this)
      let rot = new Vector()
      let pos = new Vector()
      if (this.settings.rotationType == "center") {
        rot = new Vector(this.width/2, this.height/2)
        pos = new Vector(this.width/2, this.height/2)
        pos.negate()
      }
      if (this.parent) {
        if (this.settings.parentFollow == "all" || this.parentFollow == "position") {
          ctx.translate(this.position.x+this.parent.position.x, this.position.y+this.parent.position.y);
        }
        if (this.settings.parentFollow == "all" || this.parentFollow == "position") {
          ctx.rotate(this.parent.rotation);
        }
        ctx.translate(this.position.x, this.position.y)
        ctx.rotate(this.rotation)
      } else {
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
      }
      ctx.globalAlpha = this.settings.alpha;
      const img = this.texture.getImage();
      if (this.settings.hasTexture) {
        ctx.drawImage(img, pos.x, pos.y);
      }
      if (this.settings.hasOutline) {
        ctx.strokeStyle = this.settings.outlineColor;
        ctx.strokeRect(pos.x, pos.y, img.width, img.height);
      }
      ctx.restore();
    }
  }
}
/**
* @param pos: position of element new Vector()
* @param bou: boundingBox of element new Vector()
*/
class ParticleSystem extends Base {
  constructor(pos = new Vector(), bou = new Vector(200, 200), s = 5, i = 100, color = "blue", alpha = 1) {
    super();
    this.position = pos
    this.size = s
    this.boundingBox = bou
    this.count = i
    this.texture = new Texture()
    this.color = color
    this.alpha = alpha
    this.settings = {
      updateWhen: "manual",
      hasOutline: false,
      outlineColor: "blue"
    }
    this.redraw()
  }
  redraw() {
    let canvas = document.createElement("canvas")
    canvas.width = this.boundingBox.x
    canvas.height = this.boundingBox.y
    let ctx = canvas.getContext("2d")
    for (let i = 0; i < this.count; i++) {
      ctx.globalAlpha = this.alpha
      ctx.fillStyle = this.color
      ctx.fillRect(getRandomInt(0, this.boundingBox.x), getRandomInt(0, this.boundingBox.y), this.size, this.size)
    }
    this.texture.changeURL(canvas.toDataURL("image/png"))
  }

  beforeRender() {}
  draw(ctx) {
    ctx.drawImage(this.texture.getImage(), this.position.x, this.position.y)
    if (this.settings.hasOutline) {
      ctx.strokeStyle = this.settings.outlineColor
      ctx.strokeRect(this.position.x, this.position.y, this.texture.image.width, this.texture.image.height)
    }
  }
}

class EV2DEngine {
  constructor(parent = document.body, settings = {}) {
    this.parent = parent;
    this.fps = 0
    this.currentFrame = 0
    this.time = 0
    this.fpsDisplay = document.createElement("h2")
    this.fpsDisplay.textContent = "0"
    this.fpsDisplay.style.color = "lightgreen"
    this.fpsDisplay.style.position = "fixed"
    this.fpsDisplay.style.top = "0"
    this.fpsDisplay.style.right = "0"
    document.body.appendChild(this.fpsDisplay)
    this.lastFrame = performance.now()
    this.canvas = document.createElement("canvas");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext("2d");
    this.parent.appendChild(this.canvas);
    this.settings = settings;
    this.entities = [];
    this.isPaused = false
    this.showFPS = true
    this.updateFps = true
    this.deltaTime = 16.67
    this.draw = this.render
    this.data={}
    document.querySelector("body").style.overflow = "none"
    window.addEventListener("resize", () => {
      if (window.matchMedia("(orientation: landscape)").matches) {
        this.onResize("landscape")
      } else {
        this.onResize("portrait")
      }
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
  }
  orientation() {
    if (window.matchMedia("(orientation: landscape)").matches) {
      return "landscape"
    } else {
      return "portrait"
    }
  }
  register(v) {
    CALLS.push(v)
  }
  clearRegister() {
    CALLS.clear()
  }
  reload() {
    window.location.reload()
  }
  add(e) {
    this.entities.push(e);
  }
  reset() {
    this.entities = []
  }
  beforeRender(e) {}
  render() {
    this.time += 1
    if (this.updateFps) {
      if (this.showFPS) {
        this.fpsDisplay.style.display = "block"
      } else {
        this.fpsDisplay.style.display = "none"
      }
      this.fpsDisplay.textContent = this.fps
    }
    this.currentFrame = performance.now();
    this.deltaTime = this.currentFrame-this.lastFrame;
    this.fps = (100-this.deltaTime).toFixed(1)
    if (this.fps < 0) {
      this.fps = getRandomInt(1, 10)
    }

    this.lastFrame = this.currentFrame
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (!this.isPaused) {
      this.beforeRender(this, this.time, this.deltaTime)}
    this.entities.forEach(e => {
      if (!this.isPaused&&!e.isPaused) {
        e.beforeRender(e, this.time, this.deltaTime);
        Object.values(e.animators).forEach(e => {
          e.work()})
      }
      e.draw(this.ctx);
    });
  }
  draw() {
    this.render()
    console.log("g")
    requestAnimationFrame((v)=>this.draw)
  }
  onResize(orientation) {}
  get entityCount() {
    return this.entities.lenght
  }
  lockOrientation(orientation) {
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock(orientation)
      .then(() => {
        console.log(`Orientation locked to ${orientation}`);
      })
      .catch(err => {
        console.error('Orientation lock failed:', err);
      });
    } else {
      console.warn('Screen Orientation API not supported on this browser.');
    }
  }
  optimizeCanvasSize() {
    let style = document.createElement("style")
    style.textContent = `
    *{
    margin:0;
    padding:0;
    }
    `
    document.head.appendChild(style)
  }
  optimizeCanvasDraw() {
    let style = document.createElement("style")
    style.textContent = `
    *{
    image-rendering: pixelated;
    }
    `
    document.head.appendChild(style)
  }
  disableScroll() {
    let style = document.createElement("style")
    style.textContent = `
    body{
    overflow:hidden;
    }
    `
    document.head.appendChild(style)
  }
  optimize() {
    this.optimizeCanvasSize()
    this.disableScroll()
  }
  get width() {
    return game.canvas.width
  }
  get height() {
    return game.canvas.height
  }
  setBackground(color) {
    this.canvas.style.background = color
  }
  setBackgroundTexture(texture) {
    this.canvas.style.background = `url(${texture.getImage().src})`
  }
  fps() {
    return window.performance.now()
  }
}

function smoothVolumeTransition(sound, targetVolume, duration) {
  audio = sound._
  const steps = 30; // Number of steps in the transition
  const stepTime = duration / steps;
  const volumeStep = (targetVolume - audio.volume) / steps;
  let currentStep = 0;

  const interval = setInterval(() => {
    if (currentStep >= steps) {
      clearInterval(interval);
      audio.volume = targetVolume; // Ensure exact target volume
      return;
    }
    audio.volume += volumeStep;
    currentStep++;
  },
    stepTime);
}

class Sound {
  constructor(src,
    autoplay = false) {
    this._ = new Audio(src)
    if (autoplay) {
      this.play()}
  }
  set time(t) {
    this._.currentTime = t
  }
  play() {
    this._.play()
  }
  pause() {
    this._.pause()
  }
  get time() {
    return this._.currentTime
  }
  set volume(v) {
    this._.volume = v
  }
  get volume() {
    return this._.volume
  }
  callOnLoad(f) {
    this._.addEventListener("loadedmetadata", f)
  }
  get duration() {
    return this._.duration
  }
  set preload(p = "metadate") {
    this._.preload = p
  }
  get ended() {
    return this._.ended
  }
  set loop(l) {
    this._.loop = l
  }
  get loop() {
    return this._.loop
  }
  callOnEnd(f) {
    this._.addEventListener("ended", f)
  }
  callOnPlay(f) {
    this._.addEventListener("play", f)
  }
  callOnTimeUpdate(f) {
    this._.addEventListener("timeupdate", f)
  }
  callOnPause(f) {
    this._.addEventListener("pause", f)
  }
}
class GUI {
  constructor(styles = [], type = "button") {
    this._ = document.createElement(type)
    this._.style.position = "fixed";
    this._.style.bottom = "30px";
    this._.style.right = "20px";
    this._.style.padding = "15px";
    this._.style.borderRadius = "50%";
    this._.style.userSelect = 'none';
    this._.style.zIndex = '100';
    this._.style.webkitUserSelect = 'none';
    this._.style.mozUserSelect = 'none';
    this._.style.msUserSelect = 'none';
    styles.forEach(e => {
      this._.style.setProperty(e[0], e[1])
    })
    this._.textContent = ""
    this._.onclick = (e)=>this.onClick(e)
    this.buttonDown = false
    document.body.appendChild(this._)
    this._.ontouchstart = (e)=> {
      this.onTouchDown(e); this.buttonDown = true
    }
    this._.onmousedown = (e)=> {
      this.onTouchDown(e); this.buttonDown = true
    }
    this._.ontouchend = (e)=> {
      this.onTouchUp(e); this.buttonDown = false
    }
    this._.onmouseup = (e)=> {
      this.onTouchUp(e); this.buttonDown = false
    }
    GUIUPDATE.push(this)
  }
  checkUpdate() {
    if (this.buttonDown) {
      this.repeatOnTouch(this)
    }
  }
  setStyles(styles = []) {
    styles.forEach(e => {
      this._.style.setProperty(e[0], e[1])
    })
  }
  set value(text) {
    this._.textContent = text
  }
  get value() {
    return this._.textContent
  }
  set text(text) {
    this._.textContent = text
  }
  get text() {
    return this._.textContent
  }
  positionLT(x, y) {
    this._.style.left = x
    this._.style.top = y
  }
  positionLB(x, y) {
    this._.style.left = x
    this._.style.bottom = y
  }
  positionRB(x, y) {
    this._.style.right = x
    this._.style.bottom = y
  }
  positionRT(x, y) {
    this._.style.right = x
    this._.style.top = y
  }
  size(x, y) {
    this._.style.width = x
    this._.style.height = y
  }
  scale(x, y) {
    this._.style.padding = x+" "+y
  }
  attr(x, v) {
    this._.style.setProperty(x, v)
  }
  remove() {
    this._.remove()
    delete(this)
  }
  isVisible(v) {
    if (v) {
      this._.style.display = "block"
    } else {
      this._.style.display = "none"
    }
  }
  onClick(e) {}
  repeatOnTouch(e) {}
  onTouchDown(e) {}
  onTouchUp(e) {}
}
class Button extends GUI {
  constructor(text = "default", styles = []) {
    super(styles, "button");
    this._.textContent = text
  }
}
class Canvas2D extends GUI {
  constructor(text = "default", styles = []) {
    super(styles, "canvas");
    this._.textContent = text
    this.pen=this._.getContext("2d")
    this.ctx=()=>this.pen
    this.width=()=>this._.width
    this.height=()=>this._.height
    this._.style.padding="0px"
    this._.style.margin="0px"
  }
}
class Label extends GUI {
  constructor(text = "default", level = "h1", styles = []) {
    super(styles, level);
    this._.textContent = text
  }
}
class Input extends GUI {
  constructor(v = "default", styles = []) {
    super(styles, "input");
    this.placeholder = v;
  }
}
class Textarea extends GUI {
  constructor(v = "default", styles = []) {
    super(styles, "textarea");
    this.placeholder = v;
  }
}

class Box extends Base {
  constructor(pos = new Vector(0, 0), texture = new Texture()) {
    super();
    this.name = "box"
    this.position = pos
    this.texture = texture
  }
}

function UPDATEGUI() {
  GUIUPDATE.forEach(e => {
    e.checkUpdate(e)
  })
  requestAnimationFrame(UPDATEGUI)
}
UPDATEGUI()





function BLHC() {
  return [new Button("^", [["left", "100px"], ["bottom", "170px"], ["width", "70px"], ["height", "70px"], ["background", "black"], ["color", "white"]]),
    new Button("<", [["left", "30px"], ["bottom", "100px"], ["width", "70px"], ["height", "70px"], ["background", "black"], ["color", "white"]]),
    new Button(">", [["left", "170px"], ["bottom", "100px"], ["width", "70px"], ["height", "70px"], ["background", "black"], ["color", "white"]]),
    new Button("✓", [["left", "100px"], ["bottom", "30px"], ["width", "70px"], ["height", "70px"], ["background", "black"], ["color", "white"]])]
}
function BasicLeftHandController() {
  return BLHC()
}
function BRHC() {
  return [new Button("(-_-)", [["right", "160px"], ["bottom", "170px"], ["width", "90px"], ["height", "90px"], ["background", "black"], ["color", "white"]]),
    new Button("(+_+)", [["right", "30px"], ["bottom", "170px"], ["width", "90px"], ["height", "90px"], ["background", "black"], ["color", "white"]]),
    new Button("(!_!)", [["right", "30px"], ["bottom", "30px"], ["width", "90px"], ["height", "90px"], ["background", "black"], ["color", "white"]]),
    new Button("(=_=)", [["right", "160px"], ["bottom", "30px"], ["width", "90px"], ["height", "90px"], ["background", "black"], ["color", "white"]])]
}
function BasicRightHandController() {
  return BLHC()
}
class Instance {
  constructor(game) {
    this.game = game
    this.memory = {}
    this.entities = {}
    this.controls = {}
  }
  onCreate() {}
  add(name, e) {
    this.entities[name] = e
  }
  addToMemory(name, value) {
    if (!this.memory[name]) {
      this.memory[name] = value
    }
  }
  fetchFromMemory(name) {
    return this.memory[name]
  }
  clearObjectInMemory(name) {
    delete this.memory[name];
  }
  fromMemoryToObject(name) {
    if (this.memory[name]) {
      this.add(name, this.memory[name])
    }
  }
  fromObjectToMemory(name) {
    if (this.fetch(name)) {
      this.addToMemory(name, this.fetch(name))
    }
  }
  addGUI(name, g) {
    this.controls[name] = g
  }
  fetchGUI(name) {
    return this.controls[name]
  }
  fetch(name) {
    return this.entities[name]
  }
  show() {
    this.game.reset()
    GUIUPDATE.forEach(e => {
      e.isVisible(false)
    })
    this.onCreate(this)
    Object.values(this.entities).forEach(e => {
      this.game.add(e)
    })
    Object.values(this.controls).forEach(e => {
      e.isVisible(true)
    })
  }
}
class Section {
  constructor(game) {
    this.game = game
    this.instances = {}
  }
  createInstance(name, f) {
    let t = new Instance(this.game)
    t.onCreate = f
    this.instances[name] = t
  }
  deleteInstance(name) {
    delete this.instances[name];
  }
  connect(name, t) {
    this.instances[name] = t
  }
  fetchInstance(name) {
    return this.instances[name]
  }
  showInstance(name) {
    this.instances[name].show()
  }
}
class Asset {
  constructor(content) {
    this.content = content
  }
  loadToSound() {
    return new Sound(this.content)
  }
  loadToImage() {
    return new Image(this.content)
  }
  loadToTexture() {
    let p = new Texture()
    p.changeURL(this.content)
    return p;
  }
}
class HTMLDialog {
  constructor(html) {
    this._ = document.createElement("dialog")
    this._.innerHTML = html
    this._.style.padding = "20px"
    this._.style.width = "100%"
    this._.style.height = "100vh"
    this._.style.boxShadow = "0 0 15px black"
    document.body.appendChild(this._)
  }
  setBackground(s) {
    this._.style.background = s
  }
  setBackgroundTexture(tex) {
    this._.style.background = `url(${text.getImage().src})`
  }
  show() {
    this._.showModal()
  }
  close() {
    this._.close()
  }
  get html() {
    return this._.innerHTML
  }
  set html(t) {
    this._.innerHTML = t
  }
}
class Gravity extends Base {
  constructor(ref, entities = [], vector = new Vector(0, 1)) {
    super();
    this.ref = ref
    this.__entities__ = entities
    this.__value__ = vector
  }
  add(e) {
    this.__entities__.push(e)
  }
  _() {
    return this.__entities__
  }
  draw(ctx) {
    this.__entities__.forEach(e => {
      if (!e.collideWith(this.ref)) {
        e.position.add(this.__value__)
      }
    })
  }
  setValue(v) {
    this.__value__ = v
  }
}
class TEXTDialog {
  constructor(text = "Default",
    font = "Tahoma",
    size = "30px") {
    this._ = document.createElement("dialog")
    this._.innerHTML = text+"<br><h6>(click to continue) </h6>"
    this._.style.padding = "20px"
    this._.style.outline = "none"
    this._.style.border = "none"
    this._.style.textAlign = "center"
    this._.style.background = "transparent"
    this._.style.font = font
    this._.style.fontSize = size
    this._.style.width = String(window.innerWidth)+"px"
    document.body.appendChild(this._)
    window.addEventListener('click',
      ()=> {
        this.close()
      })
  }
  setBackground(s) {
    this._.style.background = s
  }
  setBackgroundTexture(tex) {
    this._.style.background = `url(${text.getImage().src})`
  }
  show() {
    this._.showModal()
  }
  close() {
    this._.close()
  }
  get html() {
    return this._.innerHTML
  }
  set html(t) {
    this._.innerHTML = t
  }
}
function speak(text, p = 1, r = 1, v = 1) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    // Optional: Set voice, pitch, rate, volume
    utterance.pitch = p;
    utterance.rate = r;
    utterance.volume = v;
    // Speak the text
    window.speechSynthesis.speak(utterance);
  } else {
    alert(text)
  }
}
const Tools = {
  randomNumber(min, max) {
    return getRandomInt(min, max)
  },
  randomChoice(list) {
    return list[getRandomInt(0, list.length)]
  },
  toRadians(deg) {
    return toRad(deg)
  },
  toDegrees(rad) {
    return rad/Math.PI*180
  },
  nullVector() {
    return new Vector()
  },
  getWorldDirection(dir = "north") {
    if (dir === "north") return new Vector(0, -1);
    else if (dir === "south") return new Vector(0, 1);
    else if (dir === "west") return new Vector(-1, 0);
    else if (dir === "east") return new Vector(1, 0);
    else {
      return new Vector(0, 0)
    }
  },
  texture(color, w, h) {
    d = new Texture()
    d.fillWithColor(color, w, h)
  },
  toImage(url) {
    new Image(url).onload = (e)=> {
      return e;
    }
  },
  toSrc(image) {
    return image.src
  },
  setRotation(entity, rotationType, rotation) {
    entity.settings.rotationType = rotationType
    entity.rotation = rotation
  },
  findEntityByName(n) {
    game.entities.forEach(e => {
      if (e.name == n) {
        return e
      }
    })
  },
  findEntitiesByName(n) {
    en = []
    game.entities.forEach(e => {
      if (e.name == n) {
        en.push(e)
      }
    })
    return en
  },
  setVelocity(entity,
    velocity,
    velocityReduction,
    velocitySensitivity) {
    entity.velocity = velocity
    entity.settings.velocityReduction = velocityReduction
    entity.settings.velocitySensitivity = velocitySensitivity
  },
  root(entity) {
    return entity._
  },
  bind: {
    speed: 2
  },
  bindButtons(m,
    b,
    up = true,
    down = true) {
    if (up) {
      b[0].repeatOnTouch = ()=> {
        m.position.add(m.getDirection("north").scale(Tools.bind.speed))
      }
    }
    b[1].repeatOnTouch = ()=> {
      m.position.add(m.getDirection("west").scale(Tools.bind.speed))
    }
    b[2].repeatOnTouch = ()=> {
      m.position.add(m.getDirection("east").scale(Tools.bind.speed))
    }
    if (down) {
      b[3].repeatOnTouch = ()=> {
        m.position.add(scale(m.getDirection("south"), Tools.bind.speed))
      }
    }
  }
}
const Emitter = {
  _: {},

  add(name) {
    if (!Emitter._[name]) {
      Emitter._[name] = [];
    }
  },

  on(name, listener) {
    if (Emitter._[name]) {
      Emitter._[name].push(listener);
    } else {
      console.warn(`Event "${name}" is not registered. Please call add("${name}") first.`);
    }
  },

  remove(name) {
    delete Emitter._[name];
  },

  off(name, listener) {
    if (Emitter._[name]) {
      Emitter._[name] = Emitter._[name].filter(l => l !== listener);
    } else {
      console.warn(`Event "${name}" is not registered. Cannot remove listener.`);
    }
  },

  emit(name, args) {
    if (Emitter._[name]) {
      Emitter._[name].forEach(e => {
        e(...args);
      });
    } else {
      console.warn(`Event "${name}" is not registered. Cannot call listeners.`);
    }
  }
};
class Thread {
  constructor(text = "") {
    this.content = text
    this.worker = null
    this.config = {
      JSON: true
    }
  }
  loadFromScript(id) {
    this.content = document.getElementById(id).textContent
  }
  loadFromText(text) {
    this.content = text
  }
  run() {
    let ob = URL.createObjectURL(new Blob([this.content], {
      type: "application/javascript"
    }))
    this.worker = new Worker(ob)
    this.worker.onmessage = e => {
      this.onMessage(e);
      URL.revokeObjectURL(ob);
    }
    this.worker.onerror = e => {
      this.onError(e);
      URL.revokeObjectURL(ob);
    }
    ob = null
  }
  send(msg, js = false) {
    if (js) {
      if (this.worker) {
        this.worker.postMessage(JSON.stringify(msg))
      }
    } else {
      if (this.worker) {
        this.worker.postMessage(msg)
      }
    }
  }
  onError() {}
  terminate() {
    this.worker.terminate()
    this.worker = null
  }
  onMessage(e) {}
}
const Threads = {
  _: {},
  create(name) {
    Threads._[name] = new Thread()
  },
  fetch(name) {
    return Threads._[name]
  },
  isOk() {
    return Object.value(Threads._).length < navigator.hardwareConcurency
  },
  remove(name) {
    Threads._[name].terminate()
    delete Threads._[name]
  },
  script(s) {
    return s.replace("<e>", "self.onmessage = function(e) {").replace("</e>", "};").replace("<-$->", "const $parse=(tag)=>JSON.parse(tag),$string=(tag)=>JSON.stringify(tag),$post=(tag)=>self.postMessage(tag),$out=(s)=>$post($string(s));").replace("<-v->", `
      const vec2=(x=0,y=0)=>{x,y},
      add=(a,b)=>vec2(a.x+b.x,a.y+b.y),
      subtract=(a,b)=>vec2(a.x-b.x,a.y-b.y),
      multiply=(a,b)=>vec2(a.x*b.x,a.y*b.y),
      divide=(a,b)=>vec2(a.x/b.x,a.y/b.y),
      invert=(a)=>vec2(1/a.x,1/a.y),
      dot=(a, b)=>{
      return a.x * b.x + a.y * b.y;
      },
      negate=(a)=>vec2(-a.x,-a.y),
      sqrt=(...z)=>Math.sqrt(...z),
      min=(...z)=>Math.min(...z),
      max=(...z)=>Math.max(...z),
      sqr=(x)=>x*x,
      cos=(...z)=>Math.cos(...z),
      sin=(...z)=>Math.sin(...z),
      tan=(...z)=>Math.tan(...z),
      normalize=(a)=>{
      let u=Math.sqrt(a.x*a.x+b.x*b.x)
      return vec2(a.x/u,a.y/u)
      },
      lerp=(a,b,d)=>{
      vec2(
      a.x+d*(b.x-a.x),
      a.y+d*(b.y-a.y)
      )
      },
      vectodict=(v)=>{
      return {x:v.x,y:v.y}
      },
      dicttovec=(v)=>{
      vec2(v.x,v.y)
      }
      `)
  }
}
const vec2 = (x = 0, y = 0)=>new Vector(x, y),
add = (a, b)=>vec2(a.x+b.x, a.y+b.y),
subtract = (a, b)=>vec2(a.x-b.x, a.y-b.y),
multiply = (a, b)=>vec2(a.x*b.x, a.y*b.y),
scale = (a, b)=>vec2(a.x*b, a.y*b),
divide = (a, b)=>vec2(a.x/b.x, a.y/b.y),
invert = (a)=>vec2(1/a.x, 1/a.y),
dot = (a, b)=> {
  return a.x * b.x + a.y * b.y;
},
negate = (a)=>vec2(-a.x, -a.y),
sqrt = (...z)=>Math.sqrt(...z),
min = (...z)=>Math.min(...z),
max = (...z)=>Math.max(...z),
sqr = (x)=>x*x,
cos = (...z)=>Math.cos(...z),
sin = (...z)=>Math.sin(...z),
tan = (...z)=>Math.tan(...z),
normalize = (a)=> {
  let u = Math.sqrt(a.x*a.x+a.y*a.y)
  return vec2(a.x/u, a.y/u)
},
lerp = (a, b, d)=> {
  vec2(
    a.x+d*(b.x-a.x),
    a.y+d*(b.y-a.y)
  )
},
vectodict = (v)=> {
  return {
    x: v.x,
    y: v.y
  }
},
dicttovec = (v)=> {
  vec2(v.x, v.y)
}
const Clock = {
  _: [],
  register_once(call, t = 1) {
    const b = setInterval((dt)=> {
      call(dt)
      clearInterval(b)
    }, t)
  },
  register_interval(call, t = 1) {
    const b = setInterval((dt)=> {
      call(dt)
      clearInterval(b)
    }, t)
    return b
  },
  remove_interval(id) {
    clearInterval(id)
  },
  register_loop(call) {
    Clock._.push(call)
  },
  remove_loop(call) {
    Clock._.forEach((e, i)=> {
      if (e == call) {
        Clock._.splice(i, 1)
      }
    })
  }
}
Clock.update = (dt)=> {
  Clock._.forEach(e => {
    e(dt)
  })
  requestAnimationFrame(Clock.update)
}
requestAnimationFrame(Clock.update)


const Entity = (...g)=>new Base(...g)
const Ground = (game, col = "lightgreen", h)=> {
  let t = new Texture()
  t.fillWithColor(col,
    game.width,
    h)
  let r = new Box(vec2(0, game.height-h),
    t)
  return r
}
class TileGravity extends Base {
  constructor(p = [],
    t = [],
    v = vec2(0, 1)) {
    this.p = p
    this.t = t
    this.g = v
  }
  setVelocity(v) {
    this.g.x = v.x
    this.g.y = v.y
  }
  draw(ctx) {
    this.t.forEach(e => {
      let fall = true
      this.p.forEach(e => {
        if (e.collideWith(p)) {
          fall = false
        }
      })
      if (fall) {
        t.position.add(this.g)
      }
    })
  }
  setValue(v) {
    this.__value__ = v
  }
}
const Buttons = {
  attrs(col,
    val,
    but) {
    but.forEach(e => {
      e._.style.setProperty(col, val)
    })
  },
  attr(col,
    val,
    b) {
    b._.style.setProperty(col,
      val)
  },
  disable(i,
    buts) {
    i.forEach(e => {
      buts[e].isVisible(false)
    })
  },
  enable(i,
    buts) {
    i.forEach(e => {
      buts[e].isVisible(true)
    })
  }
}
const GUIs = Buttons
class Stream{
  constructor(o={binary:false,data:[]}){
    this.data=o.data||[]
    this.b=o.binary??false
    this.il=0
  }
  onPush(){}
  onConfirm(c){return true}
  chunk(i){
    return this.data[i]
  }
  push(chunk){
    if(this.onConfirm(chunk,this.il)){
      this.onPush(chunk,this.il)
      this.data[this.il]=chunk
      this.il+=1
      return true
    }
    return false
  }
  toIndex(chunk,i){
    if(this.onConfirm(chunk,i)){
      this.onPush(chunk,i)
      this.data[i]=chunk
      this.il+=1
      return true
    }
    return false
  }
  forEach(func){
    for(let i=0;i<this.data.length;i++){
      func(this.data[i],i)
    }
  }
  concat(del=" , "){
    return this.data.join(del)
  }
  splice(ind,binary=false){
    let s1=new Stream({binary})
    let s2=new Stream({binary})
    for(let v=0;v<ind;v++){
      s1.push(this.data[v])
    }
    for(let i=ind;i<this.data.length;i++){
      s2.push(this.data[i])
    }
    return [s1,s2]
  }
}
/*data=new Stream()
data.onConfirm=(e)=>{
if(typeof e == "string"){
    return true
  }else{
    return false
  }
}

data.push("hdhhdhd")
data.push(526)
data.push("hello")
data.push("mth")
*/

class Writer{
  constructor(o={key:"default1234",config:"local"}){
    this.key=o.key||"default1234"
    this.type=o.config||"local"
    this.LOCALSTORAGE="local"
    this.SESSIONSTORAGE="session"
    this.INDEXDB="index"
    this._={}
    this._.delete=(k)=>{
      delete this._[k]
    }
    this._.add=(k,v)=>{
      this._[k]=v
    }
  }
  onEdit(){}
  onRead(){}
  config(t){
    this.type=t
  }
  get pen(){
    this.onRead(this._)
    return this._
  }
  set pen(i){
    this.onEdit(this._,i)
    this._=i
  }
  store(json=true){
    let str=json?JSON.stringify(this._):this._
    if(this.type==this.LOCALSTORAGE){
      localStorage.setItem(this.key,str)
    }else if(this.type==this.SESSIONSTORAGE){
      sessionStorage.setItem(this.key,str)
    }
  }
  recover(json=true){
    let p = ""
    if(this.type==this.LOCALSTORAGE){
      p=localStorage.getItem(this.key)
    }else if(this.type==this.SESSIONSTORAGE){
      p=sessionStorage.getItem(this.key)
    }
    this._=json?JSON.parse(p):p
    return this._
  }
}

//store=new Writer()
//store.pen["hello"]=[1,4,2,5]
//store.store()
//store.recover()
class SubProcess{
  constructor(args=[],beg=null,loop=null,die=false){
    this.beg=beg
    this.loop=loop
    this.args=args
    this.data={}
    this.id=26
    this.die=die
    this.count=0
  }
  updateCount(){
    this.count+=1
    if(this.die&&this.count>this.die){
      this.terminate()
    }
  }
  onStart(){}
  run(delay=2){
    this.beg(...this.args)
    this.onStart(...this.args)
    this.update()
    this.delay=delay
  }
  update(){
    this.updateCount()
    if (this.count%this.delay==0){
      try{
        this.loop(...this.args)
      }catch{}
    }
    requestAnimationFrame(()=>this.update())
  }
  pause(){
    clearInterval(this.loop)
  }
  terminate(){
    clearInterval(this.loop)
    this.beg=null
    this.loop=null
    this.args=null
  }
  config(a=[],b=null,l=null){
    this.beg=b
    this.loop=l
    this.args=a
  }
}
const Process={
  _:{},
  create(id="17887"){
    id=String(id)
    let f=new SubProcess()
    f.id=id
    Process._[id]=f
    return Process._[id]
  },
  config(p,...b){
    p.config(...b)
  },
  terminate(id){
    Process._[id].terminate()
  },
  get pool(){return Process._},
  set pool(h){Process._=h}
}