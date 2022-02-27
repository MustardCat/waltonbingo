var pageTitle = "Bill Walton Bingo"
var enableDebugPrints = false;
var cardDimension = 5;
var gameState = new Array(cardDimension * cardDimension);
var bingoPositions = new Array(cardDimension);
var numBoxesSelected = 0;
var bingoLetters =
[
  "B",
  "I",
  "N",
  "G",
  "O"
]
var initialList =
[
  "Conference of Champions",
  "Truck Stop Conference",
  "Makes animal noise",
  "Drug Reference",
  "Grateful Dead",
  "Mentions his wife (Lori)",
  "Mentions his son (Luke)",
  "\"Throw it down, big man\"",
  "Complains about refs",
  "Compliments the refs",
  "Bill gives a present",
  "Bill receives a present",
  "Creates Player Nickname",
  "Nature Fact",
  "\"That's not a foul\"",
  "Mentions his playing days",
  "Yoga/Meditation Reference",
  "(Top 5) Worst play ever",
  "Calls player by nickname",
  "John Wooden",
  "Bill's mic is cut off while talking",
  "\"___ is a travesty\"",
  "Random tangent to music topic",
  "Sings a song",
  "Calls player by wrong name",
  "Talks about player's parents",
  "\"Please\"",
  "Geographical Reference",
  "Complains about ESPN",
  "\"Midget chairs\"",
  "\"Another timeout?\"",
  "Asks partner if he's been to a location",
  "\"Great Pass\" (bad shot)",
  "\"Climb the ladder\"",
  "Mentions his bike",
  "Plenty of time for a comeback",
  "___ is much better than media perception",
  "Says it's someone's birthday"
];
var optionalList =
[
  "\"It's Dave, Right?\"",
  "Dave is a Coal Burner",
  "Dave corrects Bill",
  "Won't answer Dave's question",
  "Creationism",
  "\"Fossil fuel\"",
  "\"Why do you hate my grandchildren?\""
];

var resizeTextCount = 25;

var middlePos = parseInt(cardDimension/2);
var bingoCard = document.getElementById("bingoCard");

document.getElementById("websiteLocation").innerHTML += window.location.href;
document.getElementsByTagName("h1")[0].innerHTML = pageTitle;
document.getElementsByTagName("title")[0].innerHTML = pageTitle;

var randomSeed;
var randomEngine;
var bingoOptions = initialList.slice(0); //Create copy of array

RandomizeSeed();
Random.shuffle(randomEngine, bingoOptions);
CreateBingoCard();

class BoxPosition
{
  constructor(row, column)
  {
    this.row = row;
    this.column = column;
  }
}

//Helper Scripts
function DebugLog(data)
{
	if (enableDebugPrints)
		console.log(data);
}

function RandomizeSeed()
{
  randomSeed = Math.floor(Math.random() * 1000000);
  document.getElementById("seedNumber").value = randomSeed;
  document.getElementById("seedNumberPrint").innerHTML = randomSeed;
  randomEngine = Random.engines.mt19937().seed(randomSeed);
}

function PlaySound(filename)
{
	var audioHandle = new Audio(filename);
	audioHandle.play();
}

function GetBingoIndex(row, column)
{
	return (row * cardDimension) + column;
}

function ClearBingoState()
{
	for (var x = 0; x < cardDimension; x++)
	{
		for (var y = 0; y < cardDimension; y++)
		{
		  gameState[GetBingoIndex(x, y)] = false;
		}
	}
	
	bingoPositions.length = 0;
	numBoxesSelected = 0;
}

function CreateBingoCard()
{
  CreateHeader();
  for (var x = 0; x < cardDimension; x++)
  {
    var currentRow = CreateBingoRow();

    for (var y = 0; y < cardDimension; y++)
    {
      CreateBingoBox(currentRow, x, y);
    }
  }
  ClearBingoState();
}

function CreateHeader()
{
  var currentRow = CreateBingoRow();

  for (var x = 0; x < cardDimension; x++)
  {
    var currentBox = document.createElement("div");
    currentBox.className = "bingoHeader";
    currentBox.innerHTML = bingoLetters[x];
    currentRow.appendChild(currentBox);
  }
}

function CreateBingoRow()
{
  var currentRow = document.createElement("div");
  currentRow.className = "bingoRow";
  bingoCard.appendChild(currentRow);

  return currentRow;
}

function CreateBingoBox(currentRow, x, y)
{
  var currentBox = document.createElement("div");
  currentBox.className = "bingoBox";
  currentBox.setAttribute("data-row", x);
  currentBox.setAttribute("data-column", y);
  if (y == middlePos && x == middlePos)
  {
    currentBox.innerHTML = "FREE";
    currentBox.classList.add('free');
  }
  else
  {
    var randNum = Math.floor(Math.random(0,bingoOptions.length - 1));
    currentBox.innerHTML = bingoOptions[randNum];

    if (currentBox.innerHTML.length > resizeTextCount)
    {
      currentBox.classList.add('smallText');
    }

    bingoOptions.splice(randNum,1);
  }
  currentRow.appendChild(currentBox);
  currentBox.onclick = ToggleBingo(currentBox);
}

function RemoveAllBingos()
{
	var boxes = document.getElementsByClassName("bingoBox");
	for (var i = 0; i < boxes.length; i++)
	{
		boxes[i].classList.remove("highlighted");
	}
}

function RemovePreviousBingo(positionsArray)
{
	for (var i = 0; i < positionsArray.length; i++)
	{
		var pos = positionsArray[i];
		DebugLog(pos.row.toString() + " " + pos.column.toString());
		var box = document.querySelector('.bingoBox[data-row="' + pos.row.toString() + '"]' + '[data-column="' + pos.column.toString() + '"]')
		if (!box)
		{
			RemoveAllBingos();
			PlaySound("audio/you-broke-it.mp3");
			return;
		}
		box.classList.remove("highlighted");
	}
}

function HighlightBingo(positionsArray)
{
	DebugLog("Bingo Positions [" + positionsArray.length.toString()+ "]");
	for (var i = 0; i < positionsArray.length; i++)
	{
		var pos = positionsArray[i];
		DebugLog(pos.row.toString() + " " + pos.column.toString());
		var box = document.querySelector('.bingoBox[data-row="' + pos.row.toString() + '"]' + '[data-column="' + pos.column.toString() + '"]')
		if (!box)
		{
			RemoveAllBingos();
			PlaySound("audio/you-broke-it.mp3");
			return;
		}
		box.classList.add("highlighted");
	}
}

function CheckForPossibleBingo()
{
	if (numBoxesSelected < cardDimension)
		return false;

	// row checks
	for (var x = 0; x < cardDimension; x++)
	{
		if (gameState[GetBingoIndex(x, 0)] && gameState[GetBingoIndex(x, cardDimension-1)])
		{
			return true;
		}
	}
	
	// column checks
	for (var y = 0; y < cardDimension; y++)
	{
		if (gameState[GetBingoIndex(0, y)] && gameState[GetBingoIndex(cardDimension - 1, y)])
		{
			return true;
		}
	}
	
	// diagonal checks
	if (gameState[GetBingoIndex(0, 0)] && gameState[GetBingoIndex(cardDimension - 1, cardDimension - 1)])
	{
		return true;
	}
	if (gameState[GetBingoIndex(cardDimension - 1, 0)] && gameState[GetBingoIndex(0, cardDimension - 1)])
	{
		return true;
	}
	
	return false;
}

function CheckForBingo(positions)
{
	positions.length = 0;
	
	var bingoPossible = CheckForPossibleBingo();
	if (!bingoPossible)
		return false;
	
	DebugLog("Bingo Possible");
	
	// row bingo checks
	for (var x = 0; x < cardDimension; x++)
	{
		if (!gameState[GetBingoIndex(x, 0)])
			continue;
		
		for (var y = 0; y < cardDimension; y++)
		{
			if (!gameState[GetBingoIndex(x, y)])
			{
				positions.length = 0;
				break;
			}
			
			positions.push(new BoxPosition(x, y));
			if (positions.length == cardDimension)
			{
				return true;
			}
			
		}
	}
	
	// column bingo checks
	for (var y = 0; y < cardDimension; y++)
	{
		if (!gameState[GetBingoIndex(0, y)])
			continue;
		
		for (var x = 0; x < cardDimension; x++)
		{
			if (!gameState[GetBingoIndex(x, y)])
			{
				positions.length = 0;
				break;
			}
			
			positions.push(new BoxPosition(x, y));
			if (positions.length == cardDimension)
			{
				return true;
			}
		}
	}
	
	// diagonal bingo checks
	for (var pos = 0; pos < cardDimension; pos++)
	{
		if (!gameState[GetBingoIndex(pos, pos)])
		{
			positions.length = 0;
			break;
		}
		
		positions.push(new BoxPosition(pos, pos));
	}
	
	if (positions.length == cardDimension)
	{
		return true;
	}
	
	for (var pos = 0; pos < cardDimension; pos++)
	{
		var x = cardDimension - pos;
		if (!gameState[GetBingoIndex(x, pos)])
		{
			positions.length = 0;
			break;
		}
		
		positions.push(new BoxPosition(x, pos));
	}
	
	return positions.length == cardDimension;
}

function ToggleBingo(e)
{
  return function()
  {
	var enabled = false;
    if (e.classList.contains("selected"))
    {
      e.classList.remove("selected");
	  numBoxesSelected--;
    }
    else {
      e.classList.add("selected");
	  numBoxesSelected++;
	  enabled = true;
    }
	
	RemovePreviousBingo(bingoPositions);
	
	var pos = new BoxPosition(parseInt(e.getAttribute("data-row")), parseInt(e.getAttribute("data-column")));
	DebugLog(pos.row + " " + pos.column);
	
	gameState[GetBingoIndex(pos.row, pos.column)] = enabled;
	
	if (CheckForBingo(bingoPositions))
	{
		DebugLog("Bingo!")
		HighlightBingo(bingoPositions);
	}
  }
}

function DeleteCard()
{
  bingoCard.innerHTML = "";
}

function RandomizeCard()
{
  bingoOptions = initialList.slice(0);

  //Add Optional List to Bingo Options if checked
  if (document.getElementById("chkBxDave").checked)
  {
    for (i = 0; i < optionalList.length; i++)
    {
      bingoOptions.push(optionalList[i]);
    }
  }

  RandomizeSeed();
  Random.shuffle(randomEngine, bingoOptions);
  DeleteCard();
  CreateBingoCard();
}

function LoadSeed()
{
  var numberEntered = document.getElementById("seedNumber").value;
  if (parseInt(numberEntered))
  {
    randomSeed = numberEntered;
    document.getElementById("seedNumberPrint").innerHTML = numberEntered;
    randomEngine = Random.engines.mt19937().seed(randomSeed);

    DeleteCard();
    bingoOptions = initialList.slice(0);

    //Add Optional List to Bingo Options if checked
    if (document.getElementById("chkBxDave").checked)
    {
      for (i = 0; i < optionalList.length; i++)
      {
        bingoOptions.push(optionalList[i]);
      }
    }

    Random.shuffle(randomEngine, bingoOptions);
    CreateBingoCard();
  }
  else {
    document.getElementById("seedNumber").value = "";
  }
}

function ResetBox(e)
{
  if (e.classList.contains("selected"))
  {
    e.classList.remove("selected");
  }
}
