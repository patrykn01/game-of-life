let board, context;
board = document.getElementById("board_canvas");
context = board.getContext("2d");
const color_dead_cell = "rgb(88, 198, 185)";
const color_live_cell = "rgb(149, 35, 35)";
let animation_handle;
let speed;
let gameRunning = 0;
let num_cells_x, num_cells_y;
let cell_size_x;
let cell_size_y;
let x, y;
let density;
let life_array = [];
let new_life_array = [];

function ChangeNumCellsX() {
	document.getElementById("current_value_slider_x").innerHTML = document.getElementById("slider_num_cells_x").value;
}

function ChangeDensity() {
	document.getElementById("current_density").innerHTML = document.getElementById("slider_density").value;
}

function ChangeSpeed() {
	document.getElementById("current_speed").innerHTML = document.getElementById("slider_speed").value;
	clearInterval(animation_handle);
	if (gameRunning) {
		StartGame();
	}
}

function CalculateNextGenerationValue(x, y) {
	let sum = 0;
	for (let curr_x = (x - 1); curr_x <= x + 1; ++curr_x)
		for (let curr_y = (y - 1); curr_y <= y + 1; ++curr_y)
			sum += life_array[curr_x][curr_y];

	sum -= life_array[x][y];

	return (life_array[x][y] === 0 && sum === 3) || (life_array[x][y] === 1 && (sum === 2 || sum === 3)) ? 1 : 0;
}

function CalculateNextGeneration() {
	for (x = 1; x <= (num_cells_x - 2); ++x)
		for (y = 1; y <= (num_cells_y - 2); ++y)
			new_life_array[x][y] = CalculateNextGenerationValue(x, y);

	for (x = 1; x <= num_cells_x - 2; ++x)
		for (y = 1; y <= num_cells_y - 2; ++y)
			life_array[x][y] = new_life_array[x][y];
}

function DrawCells() {
	let number_of_alive_cells = 0;
	document.getElementById("current_step").innerHTML++;
	for (x = 1; x <= (num_cells_x - 2); ++x) {
		for (y = 1; y <= (num_cells_y - 2); ++y) {
			if (life_array[x][y]) {
				number_of_alive_cells++;
			}
			context.fillStyle = life_array[x][y] ? color_live_cell : color_dead_cell;
			context.fillRect(cell_size_x * (x - 1), cell_size_y * (y - 1), cell_size_x, cell_size_y);
		}
	}
	document.getElementById("curr_density").innerHTML = (number_of_alive_cells / ((num_cells_x - 2) * (num_cells_y - 2)) * 100).toFixed(2);
}

function Animation() {
	DrawCells();
	CalculateNextGeneration();
}

function Reset() {
	clearInterval(animation_handle);
	gameRunning = 0;

	num_cells_x = parseInt(document.getElementById("slider_num_cells_x").value);
	density = parseInt(document.getElementById("slider_density").value) / 100;
	num_cells_y = Math.floor(num_cells_x * board.height / board.width);
	num_cells_x += 2; num_cells_y += 2;
	cell_size_x = board.width / (num_cells_x - 2);
	cell_size_y = board.height / (num_cells_y - 2);
	for (x = 0; x < num_cells_x; ++x)
		life_array[x] = [];
	for (x = 0; x < num_cells_x; ++x)
		new_life_array[x] = [];

	document.getElementById("current_step").innerHTML = -1;

	for (x = 1; x <= num_cells_x - 2; ++x)
		for (y = 1; y <= num_cells_y - 2; ++y)
			life_array[x][y] = 0;

	context.fillStyle = color_dead_cell;
	context.fillRect(0, 0, board.width, board.height);

	for (x = 1; x <= num_cells_x - 2; ++x)
		for (y = 1; y <= num_cells_y - 2; ++y)
			life_array[x][y] = Math.random() < density ? 1 : 0;

	DrawCells();
}

function OneStep() {
	gameRunning = 0;
	CalculateNextGeneration();
	DrawCells();
}

function StartGame() {
	gameRunning = 1;
	clearInterval(animation_handle);
	speed = parseInt(document.getElementById("slider_speed").value);
	animation_handle = setInterval(Animation, speed);
}

function StopGame() {
	gameRunning = 0;
	clearInterval(animation_handle);
}

Reset();

