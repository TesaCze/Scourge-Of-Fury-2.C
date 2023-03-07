document.addEventListener("keypress", (event) => {
    switch (event.key) {
        case "a":
            player1.dir.left = true;
            break;
        case "w":
            player1.canJump = true;
            break;
        case "d":
            player1.dir.right = true;
            break;
        case "j":
            player2.dir.left = true;
            break;
        case "i":
            player2.canJump = true;
            break;
        case "l":
            player2.dir.right = true;
            break;
        case "1":
            lvl1();
            break;
        case "2":
            lvl2();
            break;
        case "3":
            lvl3();
            break;
    }
});
document.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "a":
            player1.dir.left = false;
            break;
        case "d":
            player1.dir.right = false;
            break;
        case "j":
            player2.dir.left = false;
            break;
        case "l":
            player2.dir.right = false;
    }
});