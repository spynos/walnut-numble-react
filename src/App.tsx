import { useEffect, useState } from "react";
import { getAnswer, getKeypad } from "./utils";

// Styles are written in object syntax
// Learn more: https://reactjs.org/docs/dom-elements.html#style
const containerStyle = {
  backgroundColor: "gray",
  height: "100%",
  display: "flex",
  overflow: "hidden",
  flexDirection: "column",
  alignItems: "center"
};

const AnswerPanelStyle = {
  container: {
    display: "flex",
    alignSelf: "start",
    backgroundColor: "white",
    padding: 8
  },
  itemContainer: {
    backgroundColor: "white",
    padding: 8,
    margin: 2.5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 24
  }
};

const KeypadStyle = {
  container: {
    display: "flex",
    alignSelf: "start",
    flexWrap: "wrap",
    width: "315px",
    margin: 2.5
  },
  itemContainer: {
    width: 100,
    height: 100,
    padding: 8,
    margin: 2.5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 24
  }
};

function AnswerPanel(props: any) {
  const [values, setValues] = useState([]);

  useEffect(() => {
    setValues(
      props.history
        .filter((history: any) => history.isCorrect)
        .map((history: any) => history.value)
    );
  }, [props.history]);

  return (
    <div style={AnswerPanelStyle.container}>
      {props.answer.map((value: any) => {
        const isAnswered =
          values.findIndex((answeredValue) => answeredValue === value) > -1;
        return (
          <span
            key={value}
            style={{
              ...AnswerPanelStyle.itemContainer,
              ...{
                color: isAnswered ? "green" : "rgba(0,0,0,0.1)"
              }
            }}
          >
            {value}
          </span>
        );
      })}
    </div>
  );
}

function Keypad(props: any) {
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    setAnswers(
      props.history
        .filter((history: any) => history.isCorrect)
        .map((history: any) => history.value)
    );
  }, [props.history]);

  return (
    <div style={KeypadStyle.container as React.CSSProperties}>
      {props.keypad.map((value: any) => {
        return (
          <span
            key={value}
            style={{
              ...KeypadStyle.itemContainer,
              ...{
                backgroundColor:
                  answers.findIndex((keypad) => keypad === value) > -1
                    ? "#aaa"
                    : "white"
              }
            }}
            onClick={() => {
              if (answers.findIndex((keypad) => keypad === value) > -1) {
              } else {
                props.onClick(value);
              }
            }}
          >
            {value}
          </span>
        );
      })}
    </div>
  );
}

interface INumble {
  time: number;
  keypad: number[]; // ?????????
  countCorrect: number;
  answer: number[]; // ??????
  history: { timestamp: number; value: number; isCorrect: boolean }[];
  onPlay: boolean;
}

export default function NumbleBoard(props: any) {
  const [numble, setNumble] = useState<INumble | null>(null);

  function check(value: number) {
    // ?????? ???????????? ????????????
    const currentAnswer = numble?.answer[numble.countCorrect];
    if (currentAnswer === value) {
      // ??????
      return true;
    } else {
      // ??????
      return false;
    }
  }

  function isGameDone() {
    // ????????? ??? ??????????????? ????????? ??????
    if (numble && numble.countCorrect >= numble.answer.length) {
      return true;
    } else return false;
  }

  function clickButton(value: number) {
    let newNumble: any = { ...numble };
    if (!isGameDone()) {
      const isCorrect = check(+value);
      // ???????????? ????????? ?????? ?????? ???
      // 1. HISTORY ?????? ??????
      newNumble.history = [
        ...newNumble.history,
        {
          timestamp: +new Date(),
          value,
          isCorrect
        }
      ];

      if (isCorrect) {
        // 2. countCorrect ????????????
        newNumble.countCorrect++;
        if (newNumble.countCorrect === newNumble.answer.length)
          newNumble.onPlay = false;
      }
    } else {
      newNumble.onPlay = false;
    }

    setNumble(newNumble);
  }

  function init() {
    setNumble({
      time: +new Date(),
      keypad: getKeypad(),
      countCorrect: 0,
      answer: getAnswer(),
      history: [],
      onPlay: true
    });
  }

  useEffect(() => {
    if (!numble) {
      setTimeout(() => {
        setNumble({
          time: +new Date(),
          keypad: getKeypad(),
          countCorrect: 0,
          answer: getAnswer(),
          history: [],
          onPlay: true
        });
      }, 200);
    }
  }, [numble]);

  if (!numble) {
    return <div>Loading...</div>;
  }

  if (numble.countCorrect === numble.answer.length) {
    return (
      <div>
        <h3>??????</h3>
        <ul>
          <li>????????????: {(+new Date() - numble.time) / 1000}s</li>
          <li>
            ?????????:{" "}
            {(
              (numble.history.filter((history) => history.isCorrect).length /
                numble.history.length) *
              100
            ).toFixed(1)}
            %
          </li>
          <li>
            ?????? ??????:{" "}
            {numble.history.filter((history) => !history.isCorrect).length} /{" "}
            {numble.history.length}
          </li>
        </ul>
        <button onClick={init}>????????? ???!</button>
      </div>
    );
  }

  return (
    <div style={{ ...containerStyle } as React.CSSProperties}>
      <AnswerPanel answer={numble.answer} history={numble.history} />
      <Keypad
        keypad={numble.keypad}
        history={numble.history}
        onClick={clickButton}
      />
    </div>
  );
}
