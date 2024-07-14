window.onload = function () {
  var c = document.querySelector("canvas");
  var canvas = document.querySelector("canvas");
  c.width = innerWidth;
  c.height = innerHeight;
  var ctx = c.getContext("2d");

  function reset() {
    player_width = 32;
    player_height = 32;
    playerimg = new Image();
    score = 0;
    health = 100;
    playerimg.src = "https://image.ibb.co/dfbD1U/heroShip.png";

    _bullets = [];
    bullet_width = 6;
    bullet_height = 8;
    bullet_speed = 10;
    _enemies = [];
    enemyimg = new Image();
    enemyimg.src = "https://i.ibb.co/0YgHvmx/enemy-fotor-20230927153748.png";
    enemy_width = 32;
    enemy_height = 32;
    _healths = [];
    healthimg = new Image();
    healthimg.src = "https://image.ibb.co/gFvSEU/first_aid_kit.png";
    health_width = 32;
    health_height = 32;
  }

  var mouse = {
    x: innerWidth / 2,
    y: innerHeight - 33,
  };

  var touch = {
    x: innerWidth / 2,
    y: innerHeight - 33,
  };

  canvas.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  canvas.addEventListener("touchmove", function (e) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var touch = e.changedTouches[0];
    var touchx = touch.clientX;
    var touchy = touch.clientY - rect.top - root.scrollTop;
    e.preventDefault();
    mouse.x = touchx;
    mouse.y = touchy;
  });

  var player_width = 32;
  var player_height = 32;
  var playerimg = new Image();
  var score = 0;
  var health = 100;
  playerimg.src = "https://image.ibb.co/dfbD1U/heroShip.png";

  var _bullets = [];
  var bullet_width = 6;
  var bullet_height = 8;
  var bullet_speed = 10;
  var _enemies = [];
  var enemyimg = new Image();
  enemyimg.src = "https://i.ibb.co/0YgHvmx/enemy-fotor-20230927153748.png";
  var enemy_width = 32;
  var enemy_height = 32;
  var _healths = [];
  var healthimg = new Image();
  healthimg.src = "https://image.ibb.co/gFvSEU/first_aid_kit.png";
  var health_width = 32;
  var health_height = 32;

  function Player(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.draw = function () {
      ctx.beginPath();
      ctx.drawImage(playerimg, this.x, this.y);
    };
    this.update = function () {
      this.x = mouse.x - this.width / 2;
      this.y = mouse.y - this.height / 2;
      this.draw();
    };
  }

  function Bullet(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;

    this.draw = function () {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = "white";
      ctx.fill();
    };

    this.update = function () {
      this.y -= this.speed;
      this.draw();
    };
  }

  function Enemy(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;

    this.draw = function () {
      ctx.beginPath();
      ctx.drawImage(enemyimg, this.x, this.y);
    };

    this.update = function () {
      this.y += this.speed;
      this.draw();
    };
  }

  function Health(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.draw = function () {
      ctx.beginPath();
      ctx.drawImage(healthimg, this.x, this.y);
    };
    this.update = function () {
      this.y += this.speed;
      this.draw();
    };
  }

  var __player = new Player(mouse.x, mouse.y, player_width, player_height);

  function drawenemies() {
    for (var _ = 0; _ < 4; _++) {
      var x = Math.random() * (innerWidth - enemy_width);
      var y = -enemy_height;
      var width = enemy_width;
      var height = enemy_height;
      var speed = Math.random() * 2;
      var __enemy = new Enemy(x, y, width, height, speed);
      _enemies.push(__enemy);
    }
  }
  setInterval(drawenemies, 1234);

  function drawhealth() {
    for (var _ = 0; _ < 1; _++) {
      var x = Math.random() * (innerWidth - enemy_width);
      var y = -enemy_height;
      var width = health_width;
      var height = enemy_height;
      var speed = Math.random() * 2.6;
      var __health = new Health(x, y, width, height, speed);
      _healths.push(__health);
    }
  }
  setInterval(drawhealth, 15000);

  function fire() {
    var x = mouse.x - bullet_width / 2;
    var y = mouse.y - player_height;
    var __bullet = new Bullet(x, y, bullet_width, bullet_height, bullet_speed);
    _bullets.push(__bullet);
  }
  setInterval(fire, 200);

  function collision(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  ctx.font = "14px Arial";

  function stop() {
    return true;
  }

  window.onerror = stop;

  function animate() {
    requestAnimationFrame(animate);
    ctx.beginPath();
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.fillStyle = "white";
    ctx.fillText("Health: " + health, 5, 20);
    ctx.fillText("Score: " + score, innerWidth - 100, 20);
    __player.update();

    for (var i = 0; i < _bullets.length; i++) {
      _bullets[i].update();
      if (_bullets[i].y < 0) {
        _bullets.splice(i, 1);
      }
    }

    for (var k = 0; k < _enemies.length; k++) {
      _enemies[k].update();
      if (_enemies[k].y > innerHeight) {
        _enemies.splice(k, 1);
        health -= 5;
        if (health <= 0) {
          alert("You DIED!\nYour score was : " + score);
          reset();
          start();
        }
      }
    }

    for (var j = _enemies.length - 1; j >= 0; j--) {
      for (var l = _bullets.length - 1; l >= 0; l--) {
        if (collision(_enemies[j], _bullets[l])) {
          _enemies.splice(j, 1);
          _bullets.splice(l, 1);
          score++;
        }
      }
    }

    for (var h = 0; h < _healths.length; h++) {
      _healths[h].update();
    }

    for (var hh = _healths.length - 1; hh >= 0; hh--) {
      for (var hhh = _bullets.length - 1; hhh >= 0; hhh--) {
        if (collision(_healths[hh], _bullets[hhh])) {
          _healths.splice(hh, 1);
          _bullets.splice(hhh, 1);
          health += 10;
        }
      }
    }
  }

  function start() {
    reset();
    animate();
  }

  start();
};
