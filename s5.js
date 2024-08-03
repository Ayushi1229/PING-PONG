let can = document.getElementById("table");
        let draw_ = can.getContext('2d');

        const ball = {
            x: can.width / 2,
            y: can.height / 2,
            radius: 10,
            velX: 5,
            velY: 5,
            speed: 5,
            color: "green"
        }

        const user = {
            x: 0,
            y: (can.height - 100) / 2,
            width: 10,
            height: 100,
            score: 0,
            color: "red"
        }

        const cpu = {
            x: can.width - 10,
            y: (can.height - 100) / 2,
            width: 10,
            height: 100,
            score: 0,
            color: "red"
        }

        const sep = {
            x: (can.width - 2) / 2,
            y: 0,
            height: 10,
            width: 2,
            color: "orange"
        }

        function drawRectangle(x, y, w, h, color) {
            draw_.fillStyle = color;
            draw_.fillRect(x, y, w, h);
        }

        function drawCircle(x, y, r, color) {
            draw_.fillStyle = color;
            draw_.beginPath();
            draw_.arc(x, y, r, 0, Math.PI * 2, true);
            draw_.closePath();
            draw_.fill();
        }

        function drawScore(text, x, y) {
            draw_.fillStyle = "white";
            draw_.font = "60px Arial";
            draw_.fillText(text, x, y);
        }

        function drawSeparator() {
            for (let i = 0; i <= can.height; i += 20) {
                drawRectangle(sep.x, sep.y + i, sep.width, sep.height, sep.color);
            }
        }

        function restart() {
            ball.x = can.width / 2;
            ball.y = can.height / 2;
            ball.velX = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
            ball.velY = (Math.random() * 2 - 1) * ball.speed;
            ball.speed = 5;
        }

        function detect_collision(ball, player) {
            player.top = player.y;
            player.bottom = player.y + player.height;
            player.left = player.x;
            player.right = player.x + player.width;

            ball.top = ball.y - ball.radius;
            ball.bottom = ball.y + ball.radius;
            ball.left = ball.x - ball.radius;
            ball.right = ball.x + ball.radius;

            return ball.right > player.left && ball.bottom > player.top && ball.left < player.right && ball.top < player.bottom;
        }

        can.addEventListener("mousemove", getMousePos);
        can.addEventListener("touchmove", getTouchPos, false);
        can.addEventListener("touchstart", getTouchPos, false);

        function getMousePos(evt) {
            let rect = can.getBoundingClientRect();
            user.y = evt.clientY - rect.top - user.height / 2;
        }

        function getTouchPos(evt) {
            let rect = can.getBoundingClientRect();
            user.y = evt.touches[0].clientY - rect.top - user.height / 2;
        }

        function cpu_movement() {
            let cpu_center = cpu.y + cpu.height / 2;
            let difference = ball.y - cpu_center;
            let move = difference * 0.1; 
            cpu.y += move;
        
            cpu.y = Math.max(0, Math.min(can.height - cpu.height, cpu.y));
        }

        function helper() {
            drawRectangle(0, 0, can.width, can.height, "black");
            drawScore(user.score, can.width / 4, can.height / 5);
            drawScore(cpu.score, 3 * can.width / 4, can.height / 5);
            drawSeparator();
            drawRectangle(user.x, user.y, user.width, user.height, user.color);
            drawRectangle(cpu.x, cpu.y, cpu.width, cpu.height, cpu.color);
            drawCircle(ball.x, ball.y, ball.radius, ball.color);
        }

        function updates() {
          
            ball.x += ball.velX;
            ball.y += ball.velY;
        
        
            if (ball.x - ball.radius <= 0) {
              
                cpu.score++;
                console.log("CPU Score:", cpu.score); 
                if(cpu.score >= 5){ 
                    showLose();
                    clearInterval(looper);
                    return;  
                } else {
                    restart();
                }
            } else if (ball.x + ball.radius >= can.width) {
               
                user.score++;
                console.log("User Score:", user.score);
                if(user.score >= 5){
                    showWin();
                    clearInterval(looper);
                    return;
                } else {
                    restart();
                }
            }
        
            cpu_movement();
        
          
            if (ball.y - ball.radius < 0 || ball.y + ball.radius > can.height) {
                ball.velY = -ball.velY;
            }
        
           
            let player = (ball.x < can.width / 2) ? user : cpu;
        
            if (detect_collision(ball, player)) {
                let collidePoint = ball.y - (player.y + player.height / 2);
                collidePoint = collidePoint / (player.height / 2);
                let angleRad = (Math.PI / 4) * collidePoint;
        
                let direction = (ball.x < can.width / 2) ? 1 : -1;
                ball.velX = direction * ball.speed * Math.cos(angleRad);
                ball.velY = ball.speed * Math.sin(angleRad);
                ball.speed += 0.5; 
            }
        }

        function call_back() {
            updates();
            helper();
        }

        let n = 50;
        let looper = setInterval(call_back, 1000 / n);

        function showLose() {           
            Swal.fire({
                title: "Game Over!",
                text: "You lost! The CPU scored 5 point.",
                icon: "error",
                confirmButtonText: 'Reset!'
            }).then((result) => {
                if (result.isConfirmed) {
                    resetGame();
                }
            });
        }
        
        function resetGame() {
            user.score = 0;
            cpu.score = 0;

            ball.x = can.width / 2;
            ball.y = can.height / 2;
            ball.velX = 5;
            ball.velY = 5;
            ball.speed = 5;

            user.y = (can.height - 100) / 2;
            cpu.y = (can.height - 100) / 2;

            looper = setInterval(call_back, 1000 / n);
        }