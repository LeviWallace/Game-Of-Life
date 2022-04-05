let canv1 = document.getElementById("canvas") as HTMLCanvasElement;
let ctx1 = canv1.getContext("2d");

canv1.addEventListener('click', addBlock, false)
canv1.width = .7 * window.innerHeight;
canv1.height = .7 * window.innerHeight;

const SIZE: number = canv1.width;
const MAX_AMOUNT: number = 50;

let amount: number = 15;
let block_size: number = SIZE/amount;

let cBlocks: string = "#add8e6";
let cBackground: string = "#050a37";
let isGridWhite: boolean = true;
let fps: number = 4;

let interval = setInterval(main, 1000/fps);
let isRunning: boolean = true;
let positions: Array<Array<boolean>> = Array.from(Array(MAX_AMOUNT), () => Array(MAX_AMOUNT));
clearing();

function changeApperance()
{
    cBlocks = (<HTMLInputElement>document.querySelector("#blockColor")).value;
    cBackground = (<HTMLInputElement>document.querySelector("#backgroundColor")).value;
    isGridWhite = (<HTMLInputElement>document.querySelector("#whiteChecked")).checked;
    amount = <number><unknown>(<HTMLInputElement>document.querySelector("#blockAmount")).value;
    fps = <number><unknown>(<HTMLInputElement>document.querySelector("#fpsInput")).value;
    clearInterval(interval);
    interval = setInterval(main, 1000/fps);
    block_size = SIZE/amount;
    console.log(isGridWhite);
;}

function changeState(turn: boolean): void
{
    isRunning = turn;
    const state: HTMLElement = document.querySelector(".state");
    if (turn)
    {
        state.innerText = "ON";
    }
    else
    {
        state.innerText = "OFF";
    }
    
}

function main(): void
{
    if (isRunning)
    {
        update();
    }
    draw();
}

function clearing(): void
{
    console.log("Clearing!");
    isRunning = false;
    for (let i: number = 0; i < amount; i++)
    {
        for (let j: number = 0; j < amount; j++)
        {
            positions[j][i] = false;
        }
    }
}

function checkPosition(posx: number, posy: number): boolean
{
    let sideX: number[] = [-1, 0, 1];
    let sideY: number[] = [-1, 0, 1];
    let count: number = 0;
    for (let i: number = 0; i < 3; i++)
    {
        for (let j: number = 0; j < 3; j++)
        {
            let sX: number = posx + sideX[j];
            let sY: number = posy + sideY[i];
            // inbounds

            if (sideX[j] == 0 && sideY[i] == 0) continue;

            // console.log(sX, sY, sideX[i], sideY[j], posx, posy);
            if ((sX >= 0 && sX < amount) && (sY >= 0 && sY < amount))
            {
                // if (posx == 2 && posy == 2)
                // {
                //     console.log(positions[sX][sY]);
                // }
                if (positions[sY][sX]) count++;
            }
        }
    }
    // console.log("X: ", posx, "Y", posy, "Value: ", positions[posy][posx], "Count: ", count, "Stay?", (count == 3 && !positions[posy][posx]) || ((count == 3 || count == 2) && positions[posy][posx]));
    return (count == 3 && !positions[posy][posx]) || ((count == 3 || count == 2) && positions[posy][posx]);
}


function update()
{   
    // create a copy of old positions
    let newPositions: Array<Array<boolean>> = [[]];
    for (let i: number = 0; i < amount-1; i++)
    {
        newPositions.push(positions[i].slice());
    }

    // loop through each value in 2d positions
    for (let i: number = 0; i < amount; i++)
    {
        for (let j: number = 0; j < amount; j++)
        {
            newPositions[j][i] = checkPosition(i, j);
        }
    }
    // console.log("New Positions: ", newPositions);
    // console.log("Old Positions: ", positions);
    positions = newPositions;
}

function draw(): void 
{
    drawBackground();
    drawGrid();
    drawBlocks();
}

function drawBlocks(): void
{
    ctx1.globalAlpha = 1.0;
    ctx1.fillStyle = cBlocks;
    console.log("amount: ", amount);

    for (let i = 0; i < amount; i++)
    {
        for (let j = 0; j < amount; j++)
        {
            if (positions[j][i])
            {
                ctx1.fillRect(i*block_size+1, j*block_size+1, block_size-1, block_size-1);
            }
        }
    }

}


function drawBackground(): void {
    ctx1.fillStyle = cBackground;
    ctx1.fillRect(0, 0, SIZE, SIZE);
}

function drawGrid(): void
{
    ctx1.globalAlpha = 1;
    ctx1.lineWidth = 1;
    for(let xi = 0; xi <= amount; xi++)
    {   
        ctx1.strokeStyle = isGridWhite ? "white" : "black";
        ctx1.beginPath();
        ctx1.moveTo(xi*block_size, 0);
        ctx1.lineTo(xi*block_size, SIZE);
        ctx1.stroke();
    }
    for(let yi = 0; yi <= amount; yi++)
    {
        ctx1.strokeStyle = isGridWhite ? "white" : "black";
        ctx1.beginPath();
        ctx1.moveTo(0, yi*block_size);
        ctx1.lineTo(SIZE, yi*block_size);
        ctx1.stroke();
    }
}

function addBlock(event) {
    const rect = canv1.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const nX = Math.floor(x/block_size);
    const nY = Math.floor(y/block_size);
    positions[nY][nX] = !positions[nY][nX];
    draw();
}

main();
