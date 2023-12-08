import { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";

import ReactPaginate from "react-paginate";

function HabitList() {
  const [habitName, setHabitName] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [allHabits, setAllHabits] = useState([]);
  const [editingReminder, setEditingReminder] = useState(null);
  const [clickedDays, setClickedDays] = useState([]);
  const [email, setEmail] = useState(null);
  const [editHabit, setEditHabit] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const handleCompletedDays = async (HabitId, ReminderDaysId) => {
    try {
      const url = `http://localhost:8080/habit/${HabitId}/reminderDays/${ReminderDaysId}/complete`;

      const response = await axios.put(url);
      const updatedClickedDays = [...clickedDays];
      updatedClickedDays.push(ReminderDaysId);
      setClickedDays(updatedClickedDays);
      console.log("PUT Request Successful:", response.data);
    } catch (error) {
      console.error("Error making PUT request:", error);
    }
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleEdit = (reminder) => {
    setHabitName(reminder.name);
    setDescription(reminder.description);
    setTime(reminder.reminderTime);
    setEditingReminder(reminder);
    setEmail(reminder.email);
    setEditHabit(reminder);
    console.log(reminder);
  };

  const deleteHabit = async (habitId) => {
    try {
      await axios.delete(`http://localhost:8080/habit/delete/${habitId}`);
      setAllHabits((prevHabits) =>
        prevHabits.filter((habit) => habit.habitId !== habitId)
      );
    } catch (error) {
      console.error("Error deleting habit:", error.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to update the reminder?"
      );
      if (!confirmed) return;
      const response = await axios.put(
        `http://localhost:8080/habit/${editingReminder.habitId}/editHabit`,
        {
          name: habitName,
          description,
          reminderTime: time,
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const updatedHabit = response.data;
        const update = {
          ...editHabit,
          name: habitName,
          description,
          reminderTime: time,
          email,
        };
        console.log(update);
        const habit = allHabits.map((habit) =>
          habit.habitId === updatedHabit.habitId ? update : habit
        );
        console.log(habit);
        setAllHabits(habit);
        setEditingReminder(null);
        setHabitName("");
        setDescription("");
        setTime("");
        setEndDate("");
      } else {
        throw new Error("Failed to update habit");
      }
    } catch (error) {
      console.error("Error updating habit:", error.message);
    }
  };

  const fetchAllHabits = async () => {
    try {
      const response = await axios.get("http://localhost:8080/habit/viewHabit");

      if (response.status === 200) {
        setAllHabits(response.data);
        console.log("apple", response.data);
      } else {
        throw new Error("Failed to fetch habits");
      }
    } catch (error) {
      console.error("Error fetching habits:", error.message);
    }
  };

  useEffect(() => {
    fetchAllHabits();
  }, [clickedDays]);

  const pageCount = Math.ceil(allHabits.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentHabits = allHabits.slice(offset, offset + itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r font-sans">
      <nav className="bg-blue-500 p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-white hover:text-gray-200 transition duration-300">
            List of Habits
          </h1>
        </div>
      </nav>

      {currentHabits.map((habit) => (
        <div
          key={habit.habitId}
          className="reminder bg-gradient-to-r  from-green-100 to-green-200 border border-red-300 p-4 rounded-md text-center mb-4 mx-8 my-4"
        >
          <p className="text-lg text-gray-800">
            <strong>{habit.name}</strong>
            <br />
            <span>{` ${habit.description}`}</span>
            <br />
            <span>{`Time: ${habit.reminderTime}`}</span>
            <br />
            <span>
              Reminder Days:
              <div className="flex justify-center gap-6 mt-5">
                {days.map((day, index) => {
                  const matchingReminderDay = habit.reminderDays.find(
                    (reminderDay) =>
                      reminderDay.day.charAt(0).toUpperCase() +
                        reminderDay.day.slice(1).toLowerCase() ===
                      day
                  );
                  const dayAbbreviation = day.slice(0, 3).toUpperCase();

                  return (
                    <div
                      className={`
                      border-2  rounded-full w-14 h-12 ml-14 flex items-center justify-center cursor-pointer
                      ${matchingReminderDay ? "" : "bg-red-500 text-white"}
                      ${
                        matchingReminderDay && matchingReminderDay.completed
                          ? "bg-green-800 text-white  hover:bg-green-700 "
                          : ""
                      }
                      ${
                        clickedDays.includes(matchingReminderDay?.reminderDayId)
                          ? "clicked-bg-color"
                          : ""
                      }
                    `}
                      onClick={() =>
                        matchingReminderDay &&
                        handleCompletedDays(
                          habit.habitId,
                          matchingReminderDay.reminderDayId
                        )
                      }
                      key={index}
                    >
                      {dayAbbreviation}
                    </div>
                  );
                })}
              </div>
            </span>
            <br />
            <span>{`End Date: ${habit.reminderDays[0].endDate}`}</span>
          </p>
          <div className="flex justify-between">
            <FaEdit
              className="edit-icon cursor-pointer text-blue-500"
              onClick={() => handleEdit(habit)}
            />
            <FaTrash
              className="delete-icon cursor-pointer text-red"
              onClick={() => deleteHabit(habit.habitId)}
            />
          </div>
        </div>
      ))}

      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={
          "pagination  flex justify-center list-none gap-6 mt-4"
        }
        previousLinkClassName={
          "pagination__link bg-blue-500 text-white px-3 py-2 rounded-full"
        }
        nextLinkClassName={
          "pagination__link  bg-blue-500 text-white px-3 py-2 rounded-full"
        }
        disabledClassName={"pagination__link--disabled"}
        activeClassName={"pagination__link--active w-6 text-center bg-blue-700"}
      />

      {editingReminder && (
        <div className="edit-form">
          <label className="label text-xl text-gray-700">
            Habit Name:
            <input
              className="input border border-gray-300 ml-4 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md px-3 py-2 mt-2"
              type="text"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
            />
          </label>
          <label className="label text-xl text-gray-700 ml-4 ">
            Description:
            <input
              className="input border ml-5 border-gray-300 mt-6 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md px-3 py-2 "
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <div>
            <label className="label text-xl text-gray-700">
              Time:
              <input
                className="input border ml-20  border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md px-3 py-2 mt-2"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </label>
          </div>
          <label className="label text-xl text-gray-700">
            End Date:
            <input
              className="input border border-gray-300 ml-10 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md px-3 py-2 mt-2"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          <button
            className="button bg-blue-500 hover:bg-blue-600 text-white ml-4 py-2 px-5 rounded-full mt-6 transition duration-300 transform hover:scale-105"
            onClick={handleUpdate}
          >
            Update Reminder
          </button>
          <button
            className="button bg-gray-500 hover:bg-gray-600 text-white ml-4 py-2 px-5 rounded-full mt-6 transition duration-300 transform hover:scale-105"
            onClick={() => setEditingReminder(null)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default HabitList;
