$(createSpreadsheet);

var mainArray = [];
const   r = 20,
        c = 10;
function populateArray(){
    for (let i = 0; i < r; i++) {
        mainArray[i] = [];
        for (let j = 0; j < c; j++) {
            mainArray[i][j] = "";
        }
    }
}
populateArray();



function createSpreadsheet(){
    let tableHtml ="<table class='tableMain' border='1' cellpadding='0'cellspacing='0'>";
    tableHtml+="<tr><th></th>";
    //column header labels
    for (let i = 0; i < c; i++) {
        tableHtml+="<th>"+String.fromCharCode(i+65)+"</th>";
    }
    tableHtml+="</tr>";
    //main table area
    for (let i = 1; i <= r; i++) {
        tableHtml+= "<tr>";
        tableHtml+="<td class='mainColumn' id='"+i+"_0' >" +
            i +
            "</td>";

        //COLUMNS
        for (let j = 1; j <=c ; j++) {
            tableHtml+="<td class='alphaColumn' id='"+i+"_"+j+"' onclick='clickCell(this)'></td>";

        }
        tableHtml+="</tr>";
    }
    tableHtml+="</table>";

    $("#tableSpreadsheet").html(tableHtml);
}


var currCell, //id of the cell
    cellInd;  // array with index of the cell

function clickCell(cell) {
    //set the id of the selected cell
    let cellId = cell.id;
    console.log(cellId);
    currCell = cellId;
    //return the index of the cell
    let cellIndex = cell.id.split('_');
    cellIndex[0] = parseInt(cellIndex[0]) -1;
    cellIndex[1] = parseInt(cellIndex[1]) -1;
    cellInd = cellIndex;
    //allow user to enter data
    txt.prop('disabled',false).focus();
    cell.style.backgroundColor = "red";
    txt.val(mainArray[cellIndex[0]][cellIndex[1]]);
}

function recalculate() {
    for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
            if (mainArray[i][j].indexOf("=SUM") !== -1){
                calculation(i,j);
            }
        }
    }
}

const txt = $("input").first();

txt.keypress(function () {
    if (window.event.keyCode === 13){
        console.log("curr cell "+currCell+"\nCell ind "+cellInd);

        document.getElementById(currCell).innerHTML = txt.val();      //set the value to the html cell

        pushTo(cellInd[0],cellInd[1],txt.val());                //set the value to the array
        calculation(cellInd[0],cellInd[1]);
        recalculate();
    }
});

function pushTo(i,j,value) {
    mainArray[i][j]=value;
}

function getFormula(value){
    var pattern = /[:|\(|\)]/;
    var ar = value.split(pattern);
    var sum = ar[0].toUpperCase();

    if (ar.length < 3)
        return null;
    else if (sum !== "=SUM")
        return null;
    else {
        console.log(ar);
        return ar;
    }
}


function calculation(row,column){
    var formulaArr = getFormula(mainArray[row][column]);
        console.log("formulaArr"+formulaArr);

    if (formulaArr!==null) {
        let fromCol = formulaArr[1].substr(0, 1),
            fromRow = formulaArr[1].substr(1, formulaArr[1].length - 1),
            toCol = formulaArr[2].substr(0, 1),
            toRow = formulaArr[2].substr(1, formulaArr[2].length - 1);

        console.log(fromCol + "\n" + fromRow + "\n" + toCol + "\n" + toRow);
        //-----------------


        let fromColInd = fromCol.charCodeAt(0) - 65,
            fromRowInd = parseFloat(fromRow) - 1,
            toColInd = toCol.charCodeAt(0) - 65,
            toRowInd = parseFloat(toRow) - 1;

        console.log(fromColInd + "\n" + fromRowInd + "\n" + toColInd + "\n" + toRowInd);
        //-----------------

        var sumTotal = 0;
        for (let i = fromRowInd; i <= toRowInd; i++) {
            for (let j = fromColInd; j <= toColInd; j++) {
                console.log(mainArray[i][j]);
                if (isFloat(mainArray[i][j])) {
                    sumTotal += parseFloat(mainArray[i][j]);
                }
            }
        }
        console.log(sumTotal);
        var sumCell = (row + 1) + "_" + (column + 1);
        document.getElementById(sumCell).innerHTML = sumTotal;
    }

}
function isFloat(s){
    var ch = "";
    var justFloat = "0123456789.";

    for (var i = 0; i < s.length; i++){
        ch = s.substr(i, 1);

        if (justFloat.indexOf(ch) == -1)
            return false;
    }
    return true;
}

$("#clear").on("click",function () {
    $("input").first().val("");
    createSpreadsheet();
    populateArray();


});