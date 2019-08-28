import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square"
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function BoardRow(props) {
  return (
    <div key={props.row} className="board-row">
      {props.square}
    </div>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)} />;
  }

  buildRow(i) {
    const row = []
    for (let j = i; j < (i + 3); j++) {
      row.push(this.renderSquare(j));
    }
    return row;
  }

  renderBoard() {
    const board = [];
    for (let i = 0; i < 9; i += 3) {
      board.push(<BoardRow square={this.buildRow(i)}/>);
    }
    return board;
  }

  render() {
    return (
      <div>
        {this.renderBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      moveLocation: locateMove(i)
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const winner = calculateWinner(current.squares);
    const isDraw = (current.squares.indexOf(null) === -1) ? true : false;
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' - (' + this.state.moveLocation  + ')':
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (isDraw) {
      status = 'Result: Draw!';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function locateMove(i) {
  switch (i) {
    case 0:
      return 'col 1, row 1';
    case 1:
      return 'col 2, row 1';
    case 2:
      return 'col 3, row 1';
    case 3:
      return 'col 1, row 2';
    case 4:
      return 'col 2, row 2';
    case 5:
      return 'col 3, row 2';
    case 6:
      return 'col 1, row 3';
    case 7:
      return 'col 2, row 3';
    case 8:
      return 'col 3, row 3';
    default:
      console.log('What are you?! This is impossible!'); // ...xD
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
