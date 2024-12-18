/*
//Nick Haselton 01875894
	Note: The only requirement i didnt hit was: 
		(2) Once the tile is placed on the Scrabble board, it can be moved back to the “rack”.
*/

//https://api.jquery.com/
//https://jqueryui.com/draggable/

//Keeps track fo whats being stored and if this tile is special
class Slot {
	constructor(){
		this.modifier = 0;
		this.letter = 0
	}
};

//Player's hand
rack = []
//game Board row 
board = new Array(14)
//Fill it with an empty array
for ( let i = 0; i < 14;i++)board[i] = new Slot();

//Easy JQuery access
var boardUI = null
var rackUI = null

//Constants
const RACK_SIZE = 7;
const BOARD_SIZE = 14; 

//used in drag and drop methods
var mouse = { x: -1, y: -1 };
var tempI = 0 //This gets calculated in droppable::accept, and used in droppable::drop

//Remaining tiles of each type
var remaining = new Array(26)

var piecesPlaced = 0;
var score = 0

function tilePath(c){
	return 'graphics_data/Scrabble_Tiles/Scrabble_Tile_' + c + ".jpg"
}

function DrawScore(){
	$('#score').text("score: " + score)
}

$(document).ready(function() {
	boardUI = $('#board')
	rackUI = $('#letterRack')

		$("game").droppable()

	$( function() {
	    $( "#rack" ).draggable();
	});

  	$("#newgame").click(function() {
  		StartGame()
  		DrawScore()
	})


	$("#submit").click(function() {
		SubmitPieces(); 
		DrawScore() 		
	})

    $(document).mousemove(function(event) {
        mouse.x = event.pageX;
        mouse.y = event.pageY;
    });


    DrawScore()
    boardUI.droppable({
		accept:function(draggable){
			let x1 = mouse.x
			let y1 = mouse.y
			let numChildren = $(this).children('img').length;
			for ( let i = 0; i < numChildren; i++ ) {
				let childPos = $(this).children('img').eq(i).position()
				//Take center of child but still use top left of draggable
				let y2 = childPos.top + 32 
				let x2 = childPos.left + 32
 		
 				//See if the mouse near a box
				let dist = ( x2 - x1 ) * ( x2 - x1 ) + ( y2 - y1) * ( y2 - y1 )
				dist = Math.sqrt(dist)

				if ( dist > 32 ) {
					continue;
				}
				tempI = i
				//If this is the first one we've placed then drop it
				if ( piecesPlaced == 0 ) {
					return true;
				}
				//If it's not the first one, make sure we are placing next to a previous one
				else{
					//Dont place on already existing tiles
					if ( board[tempI].letter != 0 )
						return false;
					//not possible to place on first slot second
					if( tempI == 0 ) 
						return false; 
					
					if (  board[tempI-1].letter == 0 && board[tempI+1].letter == 0 )
						return false;
					else{
						piecesPlaced++;
						return true;
					}
				}
			}
			return false;
		},


		drop:function(event,ui){
			//Set board
			let letter = rack[ui.draggable.index()]
			board[tempI].letter = letter
			piecesPlaced++

			rack.splice(ui.draggable.index(),1)

			//Set image
			let child = $(this).children('img').eq(tempI)
			child.attr("src",tilePath( letter ));
			ui.draggable.remove()
        }
	});

	StartGame();
});


function DrawGame(){
		boardUI.empty();
	rackUI.empty();
	//Draw hand UI
	for ( let i = 0; i < RACK_SIZE; i++ ) {
		//let id = '"rack' + i + '" '
		let id = '"rack"'
		let size = " width = 50px height = 50px"
		let src = tilePath(rack[i])
		let newRack = $("<img>")
			.attr("src",src)
			.attr("id","rack")
		    .addClass("draggable") 
			.width(50)
			.height(50)

		rackUI.append(newRack); // Or some specific container element

		// Make the image draggable
		newRack.draggable({
		 start: function(event, ui) {
		        $(this).css("z-index", 99);
		        $(this).draggable("option", "revert", "invalid");
		      },
		});

	}

	//Draw Board UI
	for ( let i = 0; i < BOARD_SIZE; i++ ){
		let id = '"board' + i + '" '
		let src = '"graphics_data/Scrabble_Tiles/Scrabble_Tile_Board_'
		let size = " width = 50px height = 50px "


		//If no letter draw correct tile type
		if ( board[i].modifier == 0 )
			src += 'Blank.jpg"'
		else if ( board[i].modifier == 1 )
			src += 'Double_Letter.jpg"'
		else if ( board[i].modifier == 2 )
			src += 'Double_Word.jpg"'

		boardUI.append('<img id=' + id + "src=" + src + size + "/>")
	}
}

//Get a random number and return the char it corrosponds to
function randLetter(){
	n = Math.floor(Math.random() * 26)

	let nr = remaining[n] 
	if ( nr > 0 ) {
		remaining[n] -= 1
		return String.fromCharCode('A'.charCodeAt(0) + n);
	}else{
		return randLetter();
	}
}

function StartGame(){
	//Reset tilecounts
	for ( let i = 0; i < 25; i++){
		remaining[i] = ScrabbleTiles[i]["original-distribution"]
	}

//Reset stats
	score = 0
	piecesPlaced =0 
	rack = []
//Make sure boards set up right
	board[2].modifier = 2
	board[6].modifier = 1
	board[8].modifier = 1
	board[12].modifier = 2

	//Setup rack
	for ( let i =0 ; i < 7; i++)
		rack.push(randLetter())
//Create Visuals
	DrawGame()
}

function SubmitPieces() {
	let currentWordScore = 0
	let doubleWord = false;
	//Run through each letter and add the score
	for ( let i = 0; i < 14; i++) {
		//dont do blank tiles
		if ( board[i].letter == 0 )
			continue;

		//Get value from Key value pair thing
		let letter = board[i].letter
		let val = ScrabbleTiles[ letter.charCodeAt(0) - 65 ]["value"]

		currentWordScore += val

		//Double Letter
		if ( board[i].modifier == 1 )
			currentWordScore += val
		else if ( board[i].modifier == 2 )
			doubleWord = true
	}

	if ( doubleWord )
		currentWordScore *= 2

	score += currentWordScore

	//Empty Board
	for ( let i =0 ; i < 14; i++)
		board[i].letter = 0;

	piecesPlaced =0 


//Make sure there are enough tiles to keep playing
	let count = 0;
	for ( let i = 0; i < 26; i++ )
		count += remaining[i];

	let missing = 7 - rack.length;
	if ( missing > count)
		return;

//if not enough tiles dont give any

	//Refill hand with only whats needed
	for ( let i = rack.length; i < 7; i++)
		rack.push(randLetter())

	DrawGame()



}
