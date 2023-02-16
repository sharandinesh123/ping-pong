const cvs = document.getElementById("canvas")
const ctx = cvs.getContext("2d")

function drawrec(x, y, w, h, color) {
    ctx.fillStyle = color
    ctx.fillRect(x, y, w, h)
}
const user = {
    x: 10,
    y: cvs.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: 'white',
    score: 0
}
const com = {
    x: cvs.width - 10,
    y: cvs.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: "white",
    score: 0
}
const ball = {
    x: cvs.width / 2,
    y: cvs.height / 2,
    color: "white",
    radius: 10,
    speed: 5,
    velocityx: 5,
    velocityY: 5

}
const net = {
    x: cvs.width / 2 - 1,
    y: 0,
    width: 2,
    height: 10,
    color: "white"
}

function drawNet() {
    for (let i = 0; i <= cvs.height; i += 15) 
    {
        drawrec(net.x, net.y + i, net.width, net.height, net.color)
    }

}
//draw circle
function drawcir(x, y, r, color) 
{
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, r, Math.PI * 2, false)
    ctx.closePath()
    ctx.fill()
}

// draw text
function drawText(text, x, y, color) 
{
    ctx.fillStyle = color
    ctx.font = "45px fantasy"
    ctx.fillText(text, x, y)
}

function render() 
{
    // canvas
    drawrec(0, 0, cvs.width, cvs.height, "black")
        // net
    drawNet()
        //score 
    drawText(user.score, cvs.width / 4, cvs.height / 5, "white")
    drawText(com.score, 3 * cvs.width / 4, cvs.height / 5, "white")
        // paddle
    drawrec(user.x, user.y, user.width, user.height, user.color)
    drawrec(com.x, com.y, com.width, com.height, com.color)
        // ball
    drawcir(ball.x, ball.y, ball.radius, ball.color)
}


cvs.addEventListener("mousemove", movepaddle)

function movepaddle(evt) 
{
    let rect = cvs.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height / 2
}

function collision(b, p) 
{
    b.top = b.y - b.radius
    b.bottom = b.y + b.radius
    b.right = b.x + b.radius
    b.left = b.x - b.radius

    p.top = p.y
    p.bottom = p.y + p.height
    p.left = p.x
    p.right = p.x + p.width

    return b.left < p.right && b.top < p.bottom && b.right > p.left && b.bottom > p.top
}



// reset ball
function reset() 
{
    ball.x = cvs.width / 2
    ball.y = cvs.height / 2
    ball.speed = 5
    ball.velocityx = -ball.velocityx
}

function update() 
{
    ball.x += ball.velocityx
    ball.y += ball.velocityY
        //simple ai
    let computerlevel = 0.1
    com.y += (ball.y - (com.y + com.height / 2)) * computerlevel

    if (ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0) 
    {
        ball.velocityY = -ball.velocityY
    }

    let player = (ball.x < cvs.width / 2) ? user : com

    if (collision(ball, player)) 
    {
        let collidepoint = ball.y - (player.y + player.height / 2)
        collidepoint = collidepoint / (player.height / 2)
        let anglerad = collidepoint * Math.PI / 4
        let direction = (ball.x < cvs.width / 2) ? 1 : -1
        ball.velocityx = direction * ball.speed * Math.cos(anglerad)
        ball.velocityY = ball.speed * Math.sin(anglerad)
        ball.speed += 0.5
    }

    if (ball.x - ball.radius < 0) 
    {
        com.score++;
        reset();
    } 
    else if (ball.x + ball.radius > cvs.width) 
    {
        user.score++;
        reset();
    }

}

function game() 
{
    render()
    update()
}
const framepersecond = 50;
setInterval(game, 1000 / framepersecond)