document.addEventListener("keypress", (event) => {
    switch (event.key) {
        case "a":
            player1.dir.left = true;
            break;
        case "w":
            player1.dir.up = true;
            break;
        case "d":
            player1.dir.right = true;
            break;
        case "s":
            player1.dir.down = true;
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
        case "w":
            player1.dir.up = false;
            break;
        case "s":
            player1.dir.down = false;
    }
});
document.addEventListener("click", (event) => {
    
})