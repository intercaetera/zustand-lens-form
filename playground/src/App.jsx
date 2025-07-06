import { useTest } from '../../src/index'
import './App.css'

function App() {
  const hi = useTest()

  return (
    <div>{hi}</div>
  )
}

export default App
