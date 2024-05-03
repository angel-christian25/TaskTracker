import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useHistory } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Modal,
} from '@material-ui/core';
import { AddCircle, CheckCircle, Close, Delete as DeleteIcon } from '@material-ui/icons';
import TaskCalendar from './TaskCalendar';
import dotenv from 'dotenv';
dotenv.config();

const TaskTracker = () => {
  const history = useHistory();
  const [tabValue, setTabValue] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState()
  const [taskDetails, setTaskDetails] = useState({
    title: '',
    description: '',
    deadline: '',
  });
  const [calendarView, setCalendarView] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/login');
    }
  }, [history]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwt.decode(token);
      const userId = decodedToken.userId;
      setCurrentUserId(userId)
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/todos?userId=${userId}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Error fetching tasks');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/todos/${taskId}`, {
        method: 'DELETE',
      });

      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Error deleting task');
    }
  };

  const handleTaskStatusChange = async (taskId) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === taskId);
      const isTaskOpen = !taskToUpdate.is_open;
      const closedAt = isTaskOpen ? null : new Date().toISOString();

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/todos/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...taskToUpdate,
          is_open: isTaskOpen,
          closed_at: closedAt,
        }),
      });

      const updatedTask = await response.json();
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, is_open: updatedTask.is_open, closed_at: updatedTask.closed_at } : task
      );
      setTasks(updatedTasks);
      toast.success(`Task status updated successfully`);
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Error updating task status');
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    setTaskDetails({
      title: '',
      description: '',
      deadline: '',
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setTaskDetails({
      ...taskToEdit,
      deadline: taskToEdit.deadline ? taskToEdit.deadline.slice(0, -1) : '',
    });
    handleOpenEditModal();
  };

  const handleOpenEditModal = () => {
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleSaveEditedTask = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/todos/${taskDetails.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskDetails),
      });

      const updatedTask = await response.json();
      const updatedTasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
      setTasks(updatedTasks);
      toast.success('Task edited successfully');
      handleCloseEditModal();
    } catch (error) {
      console.error('Error editing task:', error);
      toast.error('Error editing task');
    }
  };

  const handleSaveTask = async () => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwt.decode(token);
      const userId = decodedToken.userId;
      const newTaskDetails = { ...taskDetails, is_open: true, created_by: userId };
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTaskDetails),
      });

      const data = await response.json();
      setTasks([...tasks, data]);
      toast.success('Task added successfully');
      handleCloseModal();
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Error adding task');
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Task Tracker</Typography>
          <Box flexGrow={1} />
          <Button color="inherit" onClick={() => setCalendarView(!calendarView)}>
            {calendarView ? 'Normal View' : 'Calendar View'}
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container>
        {calendarView ? (
          // Display TaskCalendar component in calendar view
          <TaskCalendar />
        ) : (
          // Display normal task list view
          <Box mt={2}>
            <Paper>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Open Tasks" />
                <Tab label="Closed Tasks" />
              </Tabs>
              {tabValue === 0 ? (
                <div>
                  <Typography variant="h5" align="center" mt={2}>
                    Open Tasks
                  </Typography>
                  <List>
                    {tasks
                      .filter((task) => task.is_open)
                      .map((task) => (
                        <ListItem key={task.id} disableGutters>
                          <ListItemText
                            primary={task.title}
                            secondary={`Deadline: ${task.deadline}`}
                            onClick={() => handleEditTask(task.id)} 
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              aria-label="close"
                              onClick={() => handleTaskStatusChange(task.id)}
                            >
                              <CheckCircle />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                  </List>
                </div>
              ) : (
                <div>
                  <Typography variant="h5" align="center" mt={2}>
                    Closed Tasks
                  </Typography>
                  <List>
                    {tasks
                      .filter((task) => !task.is_open)
                      .map((task) => (
                        <ListItem key={task.id} disableGutters>
                          <ListItemText
                            primary={task.title}
                            secondary={`Deadline: ${task.deadline}`}
                            onClick={() => handleEditTask(task.id)}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                            <IconButton
                              edge="end"
                              aria-label="close"
                              onClick={() => handleTaskStatusChange(task.id)}
                            >
                              <Close />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                  </List>
                </div>
              )}
            </Paper>
          </Box>
        )}

        <Box mt={4} display="flex" justifyContent="flex-end">
          {tabValue === 0 && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircle />}
              onClick={handleOpenModal}
            >
              Add New Task
            </Button>
          )}
        </Box>

        {/* Modal for adding new task */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: 24,
              borderRadius: 8,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" align="center" gutterBottom>
              New Task
            </Typography>
            <TextField
              label="Title"
              fullWidth
              value={taskDetails.title}
              onChange={(e) => setTaskDetails({ ...taskDetails, title: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Description"
              fullWidth
              value={taskDetails.description}
              onChange={(e) => setTaskDetails({ ...taskDetails, description: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Deadline"
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={taskDetails.deadline}
              onChange={(e) => setTaskDetails({ ...taskDetails, deadline: e.target.value })}
              margin="normal"
            />
            <Button variant="contained" color="primary" mt={2} onClick={handleSaveTask}>
              Save Task
            </Button>
          </div>
        </Modal>

        {/* Edit Modal */}
        <Modal open={editModalOpen} onClose={handleCloseEditModal}>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: 24,
              borderRadius: 8,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" align="center" gutterBottom>
              Edit Task
            </Typography>
            <TextField
              label="Title"
              fullWidth
              value={taskDetails.title}
              onChange={(e) => setTaskDetails({ ...taskDetails, title: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Description"
              fullWidth
              value={taskDetails.description}
              onChange={(e) => setTaskDetails({ ...taskDetails, description: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Deadline"
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={taskDetails.deadline}
              onChange={(e) => setTaskDetails({ ...taskDetails, deadline: e.target.value })}
              margin="normal"
            />
            <Button variant="contained" color="primary" mt={2} onClick={handleSaveEditedTask}>
              Save Changes
            </Button>
          </div>
        </Modal>

      </Container>

      <ToastContainer />
    </div>
  );
};

export default TaskTracker;
