let canv1 = document.getElementById("canvas") as HTMLCanvasElement;
let ctx1 = canv1.getContext("2d");
setInterval(main, 1000/4);
canv1.addEventListener('click', addBlock, false)

const size = canv1.width;
const block_size = 40;

let isRunning: boolean = false;
let positions: Array<Array<boolean>> = Array.from(Array(block_size), () => Array(block_size));

function main(): void
{
    if (isRunning)
        update();
    draw();
}

function clear(): void
{
    isRunning = false;
    for (let i: number = 0; i < block_size; i++)
    {
        for (let j: number = 0; j < block_size; j++)
        {
            positions[i][j] = false;
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
            let sX: number = posx + sideX[i];
            let sY: number = posy + sideY[j];
            if (sX == posx && sY == posy) break;
            if ((sX >= 0 || sX < canv1.width/block_size) && 
                (sY >= 0 || sY < canv1.width/block_size))
            {
                if (location[sX][sY]) count++; 
            }
        }
    }
    return count == 3;
}


function update()
{
    
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
    ctx1.fillStyle = "lightblue";
    for (let i = 0; i < block_size; i++)
    {
        for (let j = 0; j < block_size; j++)
        {
            if (positions[i][j])
            {
                ctx1.fillRect(i*block_size+1, j*block_size+1, block_size-1, block_size-1);
            }
        }
    }

}

function drawBackground(): void {
    ctx1.fillStyle = "rgb(15, 47, 102)";
    ctx1.fillRect(0, 0, size, size);
}

function drawGrid(): void
{
    ctx1.globalAlpha = .05;
    ctx1.lineWidth = 1;
    for(let xi = 0; xi <= size/block_size; xi++)
    {   
        ctx1.strokeStyle = "black";
        ctx1.beginPath();
        ctx1.moveTo(xi*block_size, 0);
        ctx1.lineTo(xi*block_size, size);
        ctx1.stroke();
    }
    for(let yi = 0; yi <= size/block_size; yi++)
    {
        ctx1.strokeStyle = "black";
        ctx1.beginPath();
        ctx1.moveTo(0, yi*block_size);
        ctx1.lineTo(size, yi*block_size);
        ctx1.stroke();
    }
}

function addBlock(event) {
    const rect = canv1.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    positions[Math.floor(x*2/block_size)][Math.floor(y*2/block_size)] = !positions[Math.floor(x*2/block_size)][Math.floor(y*2/block_size)];
    console.log("x: " + x + " y: " + y)
}
