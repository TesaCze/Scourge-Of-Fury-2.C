document.addEventListener("keypress", (event) => {
    switch (event.key) {
        case "a":
            game.AllGameObjects[player].dir.left = true;
            break;
        case "w":
            game.AllGameObjects[player].dir.up = true;
            break;
        case "d":
            game.AllGameObjects[player].dir.right = true;
            break;
        case "s":
            game.AllGameObjects[player].dir.down = true;
            break;
    }
});
document.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "a":
            game.AllGameObjects[player].dir.left = false;
            break;
        case "d":
            game.AllGameObjects[player].dir.right = false;
            break;
        case "w":
            game.AllGameObjects[player].dir.up = false;
            break;
        case "s":
            game.AllGameObjects[player].dir.down = false;
    }
});
document.addEventListener("click", (event) => {
    return 0;
})