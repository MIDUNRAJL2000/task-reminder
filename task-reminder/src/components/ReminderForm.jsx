import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ReminderForm = () => {
  const [habitName, setHabitName] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [endDate, setEndDate] = useState("");
  const [reminders, setReminders] = useState([]);
  const [email, setEmail] = useState("");

  const handleDaySelection = (day) => {
    const updatedDays = selectedDays.includes(day)
      ? selectedDays.filter((selectedDay) => selectedDay !== day)
      : [...selectedDays, day];

    setSelectedDays(updatedDays);
  };
  const createHabit = async () => {
    try {
      const response = await fetch("http://localhost:8080/habit/createHabit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: habitName,
          description,
          reminderTime: time,
          reminderDays: selectedDays,
          email: email,
          endDate: endDate,
        }),
      });

      if (response.ok) {
        const createdHabit = await response.json();

        console.log("Created Habit:", createdHabit);
        console.log(createdHabit.habitId);
        createReminderDays(createdHabit.habitId);
      } else {
        throw new Error("Failed to create habit");
      }
    } catch (error) {
      console.error("Error creating habit:", error.message);
    }
  };

  const createReminderDays = async (habitId) => {
    console.log(habitId, selectedDays);
    const uppercaseSelectedDays = selectedDays.map((day) => day.toUpperCase());
    console.log(uppercaseSelectedDays);

    try {
      const response = await axios.post(
        `http://localhost:8080/habit/${habitId}/createReminderDays`,
        {
          reminderDays: uppercaseSelectedDays,
          endDate: endDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Created Reminder Days:", response.data);
    } catch (error) {
      console.error("Error creating reminder days:", error.message);
    }
  };

  const addReminder = () => {
    if (!habitName || !time || !endDate) {
      alert("Please fill in all the details");
      return;
    }
    createHabit();

    const newReminder = {
      habitName,
      description,
      time,
      selectedDays,
      endDate,
    };

    setReminders([...reminders, newReminder]);
    setHabitName("");
    setDescription("");
    setTime("");
    setSelectedDays([]);
    setEndDate("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 to-blue-500 pt-10 font-sans ">
      <div className="container mx-auto p-8  rounded-lg bg-white shadow-lg animate__animated animate__fadeIn animate__delay-1s ">
        <blockquote className="text-lg italic font-light text-gray-700 mb-8 text-center animate__animated animate__fadeInUp animate__delay-1s transition-transform transform hover:scale-105">
          <span style={{ fontSize: "2.5em", color: "#YourMatchingColor" }}>
            The
          </span>{" "}
          only way to achieve the impossible is to believe it is possible.
        </blockquote>

        <div className="form-container py-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label
                className="block  text-xl font-bold mb-2 text-gray-700"
                htmlFor="habitName"
              >
                Habit Name:
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300  transition duration-300 "
                type="text"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-xl font-bold mb-2 text-gray-700"
                htmlFor="description"
              >
                Description:
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-300"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label text-xl text-gray-700 font-bold">
              Email:
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-300 mt-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="label text-xl text-gray-700 font-bold">
              Time:
            </label>
            <input
              className="w-full px-3 py-2 mt-2 border rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-300"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-xl text-gray-700  font-bold mb-2"
              htmlFor="endDate"
            >
              End Date:
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-300"
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-xl font-bold mb-2"
              htmlFor="selectedDays"
            >
              Repeat on Days:
            </label>
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <label
                key={day}
                className="checkbox-label mx-[40px]  text-lg text-gray-800 inline-block"
              >
                <input
                  className="checkbox mt-2 "
                  style={{ margin: "5px" }}
                  type="checkbox"
                  checked={selectedDays.includes(day)}
                  onChange={() => handleDaySelection(day)}
                />
                {day}
              </label>
            ))}
          </div>
        </div>
        <button
          className=" bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-full  transition duration-300 transform hover:scale-105 focus:outline-none"
          onClick={() => addReminder()}
        >
          Set Reminder
        </button>
        <Link to="/habit-list">
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-5 float-right mb-4 rounded transition-transform transform hover:scale-105 focus:outline-none">
            View List of Habits
          </button>
        </Link>
      </div>
    </div>
  );
};
export default ReminderForm;
