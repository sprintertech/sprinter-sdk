import { useState } from 'react'
import './App.css'
import {SprinterContext} from "../lib/main.ts";
import {Component} from "./Component.tsx";
import {Action} from "./Action.tsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <SprinterContext >
      <div>
        <Component />
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Action />
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </SprinterContext>
  )
}

export default App
