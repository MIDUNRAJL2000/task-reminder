import ReminderForm from "./components/ReminderForm";
import MainPage from "./components/MainPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HabitList from "./components/HabitList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />

        <Route path="reminder-form" element={<ReminderForm />} />
        <Route path="habit-list" element={<HabitList />} />
      </Routes>
    </Router>
  );
}
export default App;
