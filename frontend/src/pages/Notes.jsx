import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const [plan, setPlan] = useState(
    localStorage.getItem("plan")?.replace(/['"]+/g, "") || "Free"
  );

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";


  const userRole =
    localStorage.getItem("role")?.replace(/['"]+/g, "") || "Member";
  const userName = localStorage.getItem("name");
  const tenant = localStorage.getItem("tenant") || "";
  //   const plan = localStorage.getItem("plan");

  let slug=tenant.toLowerCase()

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("tenant");
    localStorage.removeItem("plan");
    navigate("/login");
  };

const checkPlanStatus = useCallback(async () => {
  try {
    const response = await axios.get(`${API_BASE}/notes`, getAuthHeaders());
    if (response.data.requiresRelogin) {
      alert("Your tenant's plan has been upgraded! Please login again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  } catch (error) {
    if (error.response?.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }
}, [API_BASE]);

useEffect(() => {
  const interval = setInterval(checkPlanStatus, 60000);
  return () => clearInterval(interval);
}, [checkPlanStatus]);





const fetchNotes = useCallback(async () => {
  try {
    const res = await axios.get(`${API_BASE}/notes`, getAuthHeaders());
    setNotes(res.data.data);
    setError("");
  } catch (err) {
    console.error("Error fetching notes:", err.response?.data || err.message);
  }
}, [API_BASE]); 


useEffect(() => {
  fetchNotes();
}, [fetchNotes]);






  const handleUpgrade = async () => {
    try {
      const response = await axios.post(
       `${API_BASE}/tenants/${slug}/upgrade`,
        {},
        getAuthHeaders()
      );
      if (response.data.success) {
        if (response.data.newToken) {
          localStorage.setItem("token", response.data.newToken);
        }

        localStorage.setItem("plan", "Pro");
        setPlan("Pro");

        alert("Successfully upgraded to Pro plan!");
        fetchNotes();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error upgrading plan");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `${API_BASE}/notes/${editId}`,
          { noteTitle, noteContent },
          getAuthHeaders()
        );
        setEditId(null);
      } else {
        await axios.post(
          `${API_BASE}/notes`,
          { noteTitle, noteContent },
          getAuthHeaders()
        );
      }
      setNoteTitle("");
      setNoteContent("");
      setError("");
      fetchNotes();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving note");
    }
  };

  const handleEdit = (note) => {
    setEditId(note._id);
    setNoteTitle(note.noteTitle);
    setNoteContent(note.noteContent);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/notes/${id}`, getAuthHeaders());
      fetchNotes();
    } catch (err) {
      console.error("Error deleting note:", err.response?.data || err.message);
    }
  };

  return (
    <div
      className="bg-cream min-h-screen font-sans text-gray-900"
      style={{ backgroundColor: "#FFF8F0" }}
    >
      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-300 bg-white shadow">
        <h1 className="text-2xl font-bold tracking-tight">Notes App</h1>
        <div className="flex items-center gap-4">
          <div className="text-gray-900 font-bold text-lg">{tenant}</div>

          {userRole === "admin" && (
            <button
              onClick={handleUpgrade}
              className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-xl shadow-2xl hover:from-yellow-700 hover:to-yellow-500 transition duration-300"
            >
              Upgrade to Pro
            </button>
          )}

          <button
            onClick={handleLogout}
            className="bg-gray-900 text-white font-bold px-4 py-2 rounded-xl shadow-md hover:bg-gray-800 transition duration-300"
          >
            Logout
          </button>
        </div>
      </nav>



      <div className="text-center px-10 py-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          Welcome, {userName} ({userRole})
        </h2>
        <p className="inline-block bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 text-gray-800 font-extrabold text-xl px-6 py-3 rounded-xl shadow-2xl">
          Plan: {plan}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-10 pb-16">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl mb-8 animate-pulse shadow-md">
            {error}
          </div>
        )}



        <form
          onSubmit={handleSubmit}
          className="mb-10 flex flex-col md:flex-row gap-6"
        >
          <input
            type="text"
            placeholder="Note Title"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            className="bg-white border border-gray-300 p-4 rounded-xl flex-1 focus:outline-none focus:ring-4 focus:ring-gray-300 placeholder-gray-400 shadow-md"
            required
          />
          <textarea
            placeholder="Note Content"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="bg-white border border-gray-300 p-4 rounded-xl flex-2 h-32 md:h-auto focus:outline-none focus:ring-4 focus:ring-gray-300 placeholder-gray-400 shadow-md"
            required
          />
          <button
            type="submit"
            className="bg-gray-900 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-800 transition duration-300 self-start md:self-auto"
          >
            {editId ? "Update Note" : "Add Note"}
          </button>
        </form>




        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-white border border-gray-200 p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition duration-300 flex flex-col justify-between"
            >
              <div>
                <h2 className="font-extrabold text-2xl mb-3 text-gray-800">
                  {note.noteTitle}
                </h2>
                <p className="text-gray-700 mb-3">{note.noteContent}</p>
                <p className="text-sm text-gray-500">
                  Created by: {note.createdBy?.name || "Unknown"}
                </p>
              </div>


              <div className="mt-5 flex gap-4">
                <button
                  onClick={() => handleEdit(note)}
                  className="bg-yellow-400 text-gray-900 px-5 py-2 rounded-lg font-bold hover:bg-yellow-300 shadow-md transition duration-300"
                >
                  Edit
                </button>


                <button
                  onClick={() => handleDelete(note._id)}
                  className="bg-red-500 text-white px-5 py-2 rounded-lg font-bold hover:bg-red-400 shadow-md transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
