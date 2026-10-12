import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:8080/api";

function App() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    employeeName: "",
    email: "",
    salary: "",
    departmentId: "",
  });

  const [editingId, setEditingId] = useState(null);

  async function loadData() {
    try {
      setError("");

      const [employeeResponse, departmentResponse] =
        await Promise.all([
          axios.get(`${API}/employees`),
          axios.get(`${API}/departments`),
        ]);

      setEmployees(employeeResponse.data);
      setDepartments(departmentResponse.data);
    } catch (err) {
      setError(
        "Backend connection failed. Spring Boot running lo undho check cheyyi."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError("");

      const { employeeName, email, salary, departmentId } = form;

      if (!departmentId) {
        setError("Please select a department.");
        return;
      }

      const employeeData = {
        employeeName,
        email,
        salary: Number(salary),
      };

      if (editingId) {
        await axios.put(
          `${API}/employees/${editingId}?departmentId=${departmentId}`,
          employeeData
        );
      } else {
        await axios.post(
          `${API}/employees?departmentId=${departmentId}`,
          employeeData
        );
      }

      setForm({
        employeeName: "",
        email: "",
        salary: "",
        departmentId: "",
      });

      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Employee save failed. Backend logs check cheyyi."
      );
    }
  }

  function handleEdit(employee) {
    setEditingId(employee.employeeId);

    setForm({
      employeeName: employee.employeeName || "",
      email: employee.email || "",
      salary: employee.salary ?? "",
      departmentId: employee.department?.departmentId
        ? String(employee.department.departmentId)
        : "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Ee employee ni delete cheyyala?")) {
      return;
    }

    try {
      setError("");
      await axios.delete(`${API}/employees/${id}`);
      await loadData();
    } catch (err) {
      setError("Employee delete failed.");
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({
      employeeName: "",
      email: "",
      salary: "",
      departmentId: "",
    });
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">N</div>
          <div>
            <h2>NexaSphere</h2>
            <p>Employee Management</p>
          </div>
        </div>

        <span className="status">
          <span className="status-dot"></span>
          Management Portal
        </span>
      </header>

      <main className="container">
        <section className="welcome">
          <div>
            <p className="eyebrow">WORKSPACE / DASHBOARD</p>
            <h1>Welcome to NexaSphere</h1>
            <p className="subtitle">
              Manage your employees and departments in one place.
            </p>
          </div>

          <div className="welcome-mark">N</div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon purple">E</div>
            <div>
              <p>Total Employees</p>
              <h2>{employees.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">D</div>
            <div>
              <p>Total Departments</p>
              <h2>{departments.length}</h2>
            </div>
          </div>
        </section>

        {error && <div className="error-message">{error}</div>}

        <section className="content-grid">
          <div className="panel form-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">
                  {editingId ? "UPDATE DETAILS" : "NEW RECORD"}
                </p>
                <h2>{editingId ? "Edit Employee" : "Add Employee"}</h2>
              </div>
              <span className="heading-icon">+</span>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="employeeName">Full Name</label>
              <input
                id="employeeName"
                name="employeeName"
                value={form.employeeName}
                onChange={handleChange}
                placeholder="Enter employee name"
                required
              />

              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
              />

              <label htmlFor="salary">Salary</label>
              <input
                id="salary"
                type="number"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="Enter salary"
                min="0.01"
                step="0.01"
                required
              />

              <label htmlFor="departmentId">Department</label>
              <select
                id="departmentId"
                name="departmentId"
                value={form.departmentId}
                onChange={handleChange}
                required
              >
                <option value="">Select department</option>
                {departments.map((department) => (
                  <option
                    key={department.departmentId}
                    value={department.departmentId}
                  >
                    {department.departmentName}
                  </option>
                ))}
              </select>

              <button className="primary-button" type="submit">
                {editingId ? "Update Employee" : "Save Employee"}
              </button>

              {editingId && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={cancelEdit}
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          <div className="panel table-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">YOUR ORGANIZATION</p>
                <h2>Employee Directory</h2>
              </div>
              <span className="count-badge">{employees.length} records</span>
            </div>

            {loading ? (
              <p className="empty-state">Loading employees...</p>
            ) : employees.length === 0 ? (
              <p className="empty-state">
                No employees found. Add your first employee.
              </p>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Email</th>
                      <th>Salary</th>
                      <th>Department</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee.employeeId}>
                        <td>
                          <strong>{employee.employeeName}</strong>
                          <small>EMP-{employee.employeeId}</small>
                        </td>
                        <td>{employee.email}</td>
                        <td>
                          {Number(employee.salary).toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td>
                          {employee.department?.departmentName || "—"}
                        </td>
                        <td>
                          <div className="actions">
                            <button
                              className="edit-button"
                              onClick={() => handleEdit(employee)}
                            >
                              Edit
                            </button>
                            <button
                              className="delete-button"
                              onClick={() =>
                                handleDelete(employee.employeeId)
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <footer>
          NexaSphere · Employee Management System
        </footer>
      </main>
    </div>
  );
}

export default App;