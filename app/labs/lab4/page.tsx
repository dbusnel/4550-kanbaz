"use client";
import ArrayStateVariable from "./ArrayStateVariable";
import BooleanStateVariables from "./BooleanStateVariables";
import ClickEvent from "./ClickEvent";
import Counter from "./Counter";
import DateStateVariable from "./DateStateVariable";
import ObjectStateVariable from "./ObjectStateVariable";
import ParentStateComponent from "./ParentStateComponent";
import PassingDataOnEvent from "./PassingDataOnEvent";
import PassingFunctions from "./PassingFunctions";
import HelloRedux from "./redux/hello";
import store from "./store";
import { Provider } from "react-redux";
import StringStateVariables from "./StringStateVariables";
import Link from "next/link";
import ReduxExamples from "./redux/page";
import CounterRedux from "./redux/CounterRedux";
import AddRedux from "./redux/AddRedux";

export default function Lab4() {
  function sayHello() {
    alert("Hello");
  }
  return (
    <Provider store={store}>
      <div className="flex-grow">
        <h1>Lab 4</h1>
        <Link href="./lab4/redux">Redux Examples</Link>{" "}
        {/* Maybe I misunderstood, but I'm not sure why the instructions have us make this link then put the examples on this page anyway */}
        {/* continue at page 19*/}
        <ReduxExamples />
        <CounterRedux />
        <AddRedux />
        <ClickEvent />
        <PassingDataOnEvent />
        <PassingFunctions theFunction={sayHello} />
        <Counter />
        <BooleanStateVariables />
        <StringStateVariables />
        <DateStateVariable />
        <ObjectStateVariable />
        <ArrayStateVariable />
        <ParentStateComponent />
      </div>
    </Provider>
  );
}
