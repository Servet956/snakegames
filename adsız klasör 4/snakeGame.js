const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const box = 30;  // Yılanın ve yemeğin boyutunu belirler
const canvasSize = canvas.width / box;
let snake = [];
let direction = "";
let food = {
  x: Math.floor(Math.random() * canvasSize) * box,
  y: Math.floor(Math.random() * canvasSize) * box,
};
let score = 0;
let game;

// Başlama düğmesine tıklandığında oyunu başlat
startButton.addEventListener("click", () => {
  startButton.style.display = "none"; // Düğmeyi gizle
  restartButton.style.display = "none"; // Yeniden başla düğmesini gizle
  resetGame(); // Yılanı ve yemeği baştan oluştur
  game = setInterval(draw, 100); // Oyunu başlat
});

// Yeniden başla düğmesine tıklandığında oyunu sıfırla
restartButton.addEventListener("click", () => {
  resetGame(); // Yılanı ve yemeği baştan oluştur
});

// Klavye ile yılanın hareketini sağla
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Yılanı ve yemeği yeniden oluştur
function resetGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = "";
  score = 0;
  spawnNewFood();
}

// Çarpışma kontrolü
function collision(newHead, snake) {
  for (let i = 0; i < snake.length; i++) {
    if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

// Yemeğin yeniden doğmasını sağlayan fonksiyon
function spawnNewFood() {
  food = {
    x: Math.floor(Math.random() * canvasSize) * box,
    y: Math.floor(Math.random() * canvasSize) * box,
  };
}

// Yılanın başına gözler ve ağız ekleyen fonksiyon
function drawSnakeHead(x, y) {
  ctx.beginPath();
  ctx.arc(x + box / 2, y + box / 2, box / 2, 0, 2 * Math.PI);
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.strokeStyle = "black";
  ctx.stroke();

  const eyeRadius = 4;
  const eyeOffsetX = 8;
  const eyeOffsetY = 8;

  // Sol göz
  ctx.beginPath();
  ctx.arc(x + box / 2 - eyeOffsetX, y + box / 2 - eyeOffsetY, eyeRadius, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.stroke();

  // Sağ göz
  ctx.beginPath();
  ctx.arc(x + box / 2 + eyeOffsetX, y + box / 2 - eyeOffsetY, eyeRadius, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.stroke();

  // Ağız (küçük bir yay olarak çizilir)
  ctx.beginPath();
  ctx.arc(x + box / 2, y + box / 2 + 5, 10, 0, Math.PI, false); // Yarım yay (ağız)
  ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Yılanı çiz (her bir parçası yuvarlak olacak)
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      // Yılanın başını çizerken gözler ve ağız ekliyoruz
      drawSnakeHead(snake[i].x, snake[i].y);
    } else {
      ctx.beginPath();
      ctx.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 2, 0, 2 * Math.PI);
      ctx.fillStyle = "white";  // Diğer kısımlar beyaz
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.stroke();
    }
  }

  // Yemeği çiz (kare olarak kalabilir)
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Yılanın pozisyonunu güncelle
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  // Eğer yılan yemeği yerse
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    spawnNewFood();  // Yemeği yedikten sonra yeni bir yemek oluştur
  } else {
    snake.pop(); // Yılan hareket ederken son eleman çıkarılacak
  }

  // Yeni baş pozisyonunu oluştur
  const newHead = { x: snakeX, y: snakeY };

  // Duvara çarpma veya kendine çarpma durumu
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    alert("Oyun Bitti! Skor: " + score);
    restartButton.style.display = "block"; // Yeniden başla düğmesini göster
  }

  snake.unshift(newHead);

  // Skoru göster
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Skor: " + score, 10, 20);
}
