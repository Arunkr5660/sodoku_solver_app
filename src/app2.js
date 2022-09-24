import './App.css';
import { useState } from 'react';

let initial = [
  [-1, 5, -1, 9, -1, -1, -1, -1, -1],
  [8, -1, -1, -1, 4, -1, 3, -1, 7],
  [-1, -1, -1, 2, 8, -1, 1, 9, -1],
  [5, 3, 8, 6, -1, 7, 9, 4, -1],
  [-1, 2, -1, 3, -1, 1, -1, -1, -1],
  [1, -1, 9, 8, -1, 4, 6, 2, 3],
  [9, -1, 7, 4, -1, -1, -1, -1, -1],
  [-1, 4, 5, -1, -1, -1, 2, -1, 9],
  [-1, -1, -1, -1, 3, -1, -1, 7, -1]
]



function App() {
  const [sudokuArr,setSudokuArr] =useState(getDeepCopy(initial));
  function getDeepCopy(arr) {
    return JSON.parse(JSON.stringify(arr));
  }
  function onInputChange(e,row,col) {
    var val =parseInt(e.target.value) || -1 , grid =getDeepCopy(sudokuArr);
    // value restriction from 1-9
    if((val === -1 || val >=1) && val <=9) {
      grid[row][col]= val;
    }
    setSudokuArr(grid);
  }

  function compareSudokus(curruntSudoku,SolveSudoku) {
    let res ={
      isComplete :true,
      isSolvable :true
    }
    for(var i =0; i<9; i++){
      for(var j =0; j<9; j++){
        if(curruntSudoku[i][j] !== SolveSudoku[i][j]) {
          if(curruntSudoku[i][j] !== -1) {
            res.isSolvable =false;
          }
          res.isComplete =false;
        }
      }
    }
    return res;
  }

  function CheckSudoku(){
    let sudoku =getDeepCopy(initial);
    solver(sudoku);
    let compare =compareSudokus(sudokuArr,sudoku);
    if(compare.isComplete) {
      alert("Congratulations ! You solved the Sudoku");
    }
    else if(compare.isSolvable) {
      alert("Keep Going");
    }
    else {
      alert("Can't be Solved. Try again")
    }

  }

  

  function CheckRow (grid, row, num) {
    return grid[row].indexOf(num) === -1

  }

  function CheckCol(grid, col , num) {
    return grid.map(row => row[col]).indexOf(num) === -1;
  }
  
  function CheckBox (grid, row, col , num) {
    let boxArr =[],
    rowStart =row -(row%3),
    colStart =col -(col%3);

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++){
        boxArr.push(grid[rowStart +i][colStart +j]);
      }
      
    }
    return boxArr.indexOf(num) === -1;
  }
  
  function CheckValid(grid, row, col , num) {
    if(CheckRow(grid, row, num) && CheckCol(grid, col , num) && CheckBox(grid, row, col , num)){
      return true;
    }
    return false;
  }

  function getNext(row,col) {
    return col !== 8 ? [row, col+1] : row !== 8 ? [row+1,0] : [0,0];
  }
  function solver(grid, row=0, col=0) {
    if(grid[row][col] !== -1)
    {
      // if last row and col then leav it
      let isLast = row >=8 && col >=8;
      if(!isLast){
        let [newRow,newCol] = getNext(row,col);
        return solver(grid,newRow,newCol);
      }
    }
    for (let num =1; num<=9; num++)
    {
      if(CheckValid(grid, row ,col,num))
      {
        // fill num in cell
        grid[row][col]= num;
        // get next cell and repete function
        let [newRow,newCol] = getNext(row,col);
        if(!newRow && !newCol){
          return true;
        }
        if(solver(grid,newRow,newCol)){
          return true;
        }
      }
    }
    // if its invalid
    grid[row][col] = -1;
    return false;
  }

  function SolveSudoku(){
    let sudoku= getDeepCopy(initial);
    solver(sudoku);
    setSudokuArr(sudoku);
    
  }

  function ResetSudoku(){
    let sudoku = getDeepCopy(initial);
    setSudokuArr(sudoku)
  }

  return (
    <div className="App">
      <div className="App-header">
        <h3>Sudoku Solver</h3>
        <table>
          <tbody>
            {
              [0, 1, 2, 3, 4, 5, 6, 7, 8].map((row,rindex) =>{
                return <tr key ={rindex} className ={(row + 1) %3 === 0? 'bBorder' : ''}>
                 { [0, 1, 2, 3, 4, 5, 6, 7, 8].map((col,cindex) =>{
                   return <td key={rindex + cindex} className ={(col + 1) %3 === 0? 'rBorder' : ''}>
                   <input onChange={(e) => onInputChange(e,row,col)} 
                   value={sudokuArr[row][col] === -1 ?'': sudokuArr[row][col]}
                   className ="cellInput"
                   disabled = {initial[row][col] !== -1}
                    />
                 </td>
                 })}
                </tr>
              })
            }
          </tbody>
        </table>
        <div className='buttonContainer'>
          {/* <button className="get"onClick={getData}>GetData</button> */}
          <button className="CheckButton"onClick={CheckSudoku}>Check</button>
          <button className="SolveButton" onClick={SolveSudoku}>Solve</button>
          <button className="ResetButton"onClick={ResetSudoku}>Reset</button>
        </div>
      </div>
    </div>
  );
}

export default App;
