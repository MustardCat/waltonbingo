var pageTitle = "Bill Walton Bingo"
var cardDimension = 5;
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
  "\"It's Dave, Right?\"",
  "Truck Stop Conference",
  "Makes animal noise",
  "Drug Reference",
  "Grateful Dead",
  "Mentions his wife (Lori)",
  "Mentions his son (Luke)",
  "Dave is a Coal Burner",
  "\"Throw it down, big man\"",
  "Complains about refs",
  "Compliments the refs",
  "Bill gives a present",
  "Bill receives a present",
  "Creates Player Nickname",
  "Nature Fact",
  "\"That's not a foul\"",
  "Dave corrects Bill",
  "Mentions his playing days",
  "Won't answer Dave's question",
  "Yoga/Meditation Reference",
  "(Top 5) Worst play ever",
  "Creationism",
  "\"Fossil fuel\"",
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
  "Asks Dave if he's been to a location",
  "\"Great Pass\" (bad shot)",
  "\"Climb the ladder\"",
  "\"Why do you hate my grandchildren?\"",
  "Mentions his bike",
  "Plenty of time for a comeback",
  "___ is much better than media perception",
  "Says it's someone's birthday"
];

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

//Helper Scripts
function RandomizeSeed()
{
  randomSeed = Math.floor(Math.random() * 1000000);
  document.getElementById("seedNumber").value = randomSeed;
  document.getElementById("seedNumberPrint").innerHTML = randomSeed;
  randomEngine = Random.engines.mt19937().seed(randomSeed);
}

function CreateBingoCard()
{
  CreateHeader();
  for (var y = 0; y < cardDimension; y++)
  {
    var currentRow = CreateBingoRow();

    for (var x = 0;x < cardDimension; x++)
    {
      CreateBingoBox(currentRow, x, y);
    }
  }
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
  if (y == middlePos && x == middlePos)
  {
    currentBox.innerHTML = "FREE";
    currentBox.classList.add('free');
  }
  else
  {
    var randNum = Math.floor(Math.random(0,bingoOptions.length - 1));
    currentBox.innerHTML = bingoOptions[randNum];
    bingoOptions.splice(randNum,1);
  }
  currentRow.appendChild(currentBox);
  currentBox.onclick = ToggleBingo(currentBox);
}

function ToggleBingo(e)
{
  return function()
  {
    if (e.classList.contains("selected"))
    {
      e.classList.remove("selected");
    }
    else {
      e.classList.add("selected");
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
