Nick Haselton
Features:
Missing: no extra credit, also can’t drag from game board back to rack
Gives player letters randomly, only has a certain amount of each
Letters can be dragged from the rack to the board
Letters return to the rack if misplaced, or if it’s an invalid spot on the board
Board contains bonus squares that work
The game allows you to continue as long as you have pieces remaining
Board is cleared after each round
Only the missing pieces are given back to the player
All tiles must be placed next to a letter, either in front or behind. No gaps
User can always restart the game

Files:
CSS.css
* Tiny bit of CSS to space out the images
Index.html
* Loads in jquery
* Creates div for game board, and letter rack
* Contains buttons for restarting and going to next game
* Note: All images are created in game.js
Game.js
* Loads and creates images for the pieces
* Implements dragging and dropping them from the rack to the board (but not back to the rack)
* Gives random letters based on distribution given by assignment
* Draws score and lets the game restart
