import { Link } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";

function MainPage() {
  return (
    <div className="bg-gradient-to-br from-indigo-500 to-teal-500 h-screen flex flex-col items-center justify-center text-center">
      <div className="mb-8 flex items-center">
        <FaLeaf className="text-4xl text-white mr-4" />{" "}
        <h1 className="text-4xl text-white font-roboto animate-pulse">
          HABIT REMINDER APP
        </h1>
      </div>
      <Link to="/reminder-form">
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded transition-transform transform hover:scale-105 focus:outline-none">
          Set the Habit Reminder
        </button>
      </Link>
      <Link to="/habit-list">
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 mt-4 rounded transition-transform transform hover:scale-105 focus:outline-none">
          View List of Habits
        </button>
      </Link>
    </div>
  );
}

export default MainPage;
