import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import { Badge, Grid, Tab, Tabs, Typography } from '@material-ui/core';
import './TaskCalendar.css'; 
import dotenv from 'dotenv';
dotenv.config();

const TaskCalendar = () => {
  const [tasksData, setTasksData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const token = localStorage.getItem('token');
  const decodedToken = jwt.decode(token);
  const userId = decodedToken.userId;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/todos?userId=${userId}`);
        const tasks = await response.json();
        const tasksByDate = {};

        tasks.forEach(task => {
          const date = moment(task.deadline).format('YYYY-MM-DD');
          if (!tasksByDate[date]) {
            tasksByDate[date] = [];
          }
          tasksByDate[date].push(task);
        });

        setTasksData(tasksByDate);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [userId]);

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  const handleTileClick = () => {
    const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
    const tasks = tasksData[formattedDate] || [];
    setSelectedTasks(tasks);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Grid container justify="center">
      <Grid item xs={12} md={8} lg={6}>
        <div style={{ textAlign: 'center' }}>
          <h2>Task Calendar</h2>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            onClickDay={handleTileClick}
            tileContent={({ date }) => {
              const formattedDate = moment(date).format('YYYY-MM-DD');
              const tasks = tasksData[formattedDate] || [];
              const closedTasks = tasks.filter(task => !task.is_open).length;
              const remainingTasks = tasks.length - closedTasks;

              return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center' }}>
                    {remainingTasks > 0 && (
                      <Badge color="secondary" badgeContent={remainingTasks} max={999}>
                        <span style={{ marginRight: '20px' }}></span>
                      </Badge>
                    )}
                    {closedTasks > 0 && (
                      <Badge color="primary" badgeContent={closedTasks} max={999}>
                        <span style={{ marginRight: '20px' }}></span>
                      </Badge>
                    )}
                  </div>
                </div>
              );
            }}
            className="custom-calendar" 
          />
        </div>
        {isModalOpen && (
          <div className="modal-backdrop">
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <h3>Tasks for {moment(selectedDate).format('MMMM DD, YYYY')}</h3>
                <Tabs value={selectedTab} onChange={handleTabChange} centered className="modal-tabs">
                  <Tab label="Closed Tasks" />
                  <Tab label="Pending Tasks" />
                </Tabs>
                {selectedTab === 0 && (
                  <div>
                    <Typography variant="h6">Closed Tasks</Typography>
                    <ul>
                      {selectedTasks
                        .filter(task => !task.is_open)
                        .map(task => (
                          <li key={task.id}>
                            <strong>Title:</strong> {task.title}
                            <br />
                            <strong>Description:</strong> {task.description}
                            <br />
                            <strong>Deadline:</strong> {moment(task.deadline).format('MMMM DD, YYYY HH:mm')}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
                {selectedTab === 1 && (
                  <div>
                    <Typography variant="h6">Pending Tasks</Typography>
                    <ul>
                      {selectedTasks
                        .filter(task => task.is_open)
                        .map(task => (
                          <li key={task.id}>
                            <strong>Title:</strong> {task.title}
                            <br />
                            <strong>Description:</strong> {task.description}
                            <br />
                            <strong>Deadline:</strong> {moment(task.deadline).format('MMMM DD, YYYY HH:mm')}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Grid>
    </Grid>
  );
};

export default TaskCalendar;
