import { Link, Route, Switch } from "wouter"
import { BasicForm } from "./pages/BasicForm"

const App = () => {
  return (
    <main className="container">
      <nav>
        <ul>
          <li><Link href="/basic">Basic Form</Link></li>
          <li><Link href="/multi-step">Multi Step Form</Link></li>
        </ul>
      </nav>

      <Switch>
        <Route path="/basic">
          <BasicForm />
        </Route>
      </Switch>
    </main>
  )
}

export default App
