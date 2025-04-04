import { useEffect, useState } from "react";
import axios from "axios";
import AddModal from "../components/AddModal";

function Todo() {
    const [titles, setTitles] = useState([]); // Titles fetched from API
    const [showModal, setShowModal] = useState(false); // Modal visibility state
    const [tasks, setTasks] = useState({
        ongoing: [],
        done: [],
    });

    // Fetch titles from API
    useEffect(() => {
        const fetchTitles = async () => {
            try {
                const response = await axios.get('http://localhost:3000/get-titles');
                setTitles(response.data.titles);
                // Optionally initialize ongoing tasks with fetched titles
                setTasks((prev) => ({ ...prev, ongoing: response.data.titles }));
            } catch (error) {
                console.error("Error fetching titles:", error);
            }
        };
        fetchTitles();
    }, []);

    // Function to add a new task
    const addTask = (newTask, category = "ongoing") => {
        setTasks((prev) => ({
            ...prev,
            [category]: [...prev[category], newTask],
        }));
    };

    // Function to move a task between categories (e.g., ongoing -> done)
    const moveTask = (task, fromCategory, toCategory) => {
        setTasks((prev) => {
            const updatedFrom = prev[fromCategory].filter((t) => t !== task);
            const updatedTo = [...prev[toCategory], task];
            return {
                ...prev,
                [fromCategory]: updatedFrom,
                [toCategory]: updatedTo,
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload
        const newTask = e.target.task.value;  // Get the new task from the input field
        if (newTask.trim()) {
            addTask(newTask); // Add the new task to the ongoing category
            e.target.reset(); // Reset the form input field after submission
        }
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
            <div className="w-[600px] h-[500px] bg-white shadow-lg rounded-2xl p-5 flex flex-col justify-between">
                <h2 className="text-4xl text-center font-bold text-gray-800 mb-6">TO-DO LIST</h2>
                <div className="grid grid-cols-2 gap-6">
                    {/* Loop through the categories: ongoing and done */}
                    {Object.keys(tasks).map((category) => (
                        <div key={category} className="bg-gradient-to-r from-blue-300 via-green-300 to-blue-400 p-4 rounded-lg shadow-md">
                            <h3 className="text-2xl font-semibold mb-4 text-white text-center">{category.toUpperCase()}</h3>
                            <ul className="space-y-3">
                                {/* Display tasks for this category */}
                                {tasks[category].map((task, index) => (
                                    <li
                                        key={index}
                                        className="p-3 bg-white text-center rounded-md cursor-pointer hover:bg-gray-200 transition duration-300"
                                        onClick={() =>
                                            category === "ongoing" &&
                                            moveTask(task, "ongoing", "done")
                                        }
                                    >
                                        {task}
                                    </li>
                                ))}
                            </ul>
                            {/* Add Task Button inside the Ongoing category */}
                            {category === "ongoing" && (
                                <div className="flex justify-center mt-5">
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="bg-pink-600 text-white py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300"
                                    >
                                        Add Task
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {/* Modal Component - toggled based on showModal state */}
                {showModal && (
                    <AddModal
                        hide={() => setShowModal(false)}
                        addTask={(newTask) => {
                            addTask(newTask);
                            setShowModal(false);
                        }}
                    />
                )}
                {/* Task form for adding new task directly */}
                <form onSubmit={handleSubmit} className="mt-5 flex justify-between">
                    <input
                        type="text"
                        name="task"
                        placeholder="Enter new task"
                        className="w-[80%] p-2 border rounded-lg"
                    />
                    <button type="submit" className="w-[18%] bg-pink-600 text-white p-2 rounded-lg ml-2">
                        Add Task
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Todo;
