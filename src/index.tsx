import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

type SquareValue = "X" | "O" | null;
type BoardValue = SquareValue[];

interface SquareProps {
  value: SquareValue;
  onClick: () => void;
}

interface BoardProps {
  value: number;
  squares: BoardValue;
  xIsNext: boolean;
  onClick: (i: number) => void;
}

interface GameProps {}

interface GameState {
  history: BoardValue[];
  xIsNext: boolean;
}

function Square(props: SquareProps) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component<BoardProps> {
  renderSquare(i: number) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);
    this.state = {
      history: [Array(9).fill(null)],
      xIsNext: true,
    };
  }

  handleClick(i: number) {
    const history = this.state.history;
    const current = history[history.length - 1];

    const squares = current.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([squares]),
      xIsNext: !this.state.xIsNext,
    });
  }

  renderBoard(i: number, squares: BoardValue) {
    return (
      <Board
        value={i}
        squares={squares}
        xIsNext={this.state.xIsNext}
        onClick={(num) => this.handleClick(num)}
      />
    );
  }

  render() {
    const history = this.state.history;
    const squares = history[history.length - 1];
    const winner = calculateWinner(squares);
    let status =
      winner !== null
        ? "Winner: " + winner
        : "Next player: " + (this.state.xIsNext ? "X" : "O");
    return (
      <div className="game">
        <div className="game-board">{this.renderBoard(9, squares)}</div>

        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares: SquareValue[]): SquareValue {
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

ReactDOM.render(<Game />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
