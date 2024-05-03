import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Paper,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom';
import dotenv from 'dotenv';
dotenv.config();
const SigninPage = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Login successful!');
        localStorage.setItem('token', data.token);
        history.push('/tasktracker');
      } else {
        toast.error('Login failed. Please check your email and password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Error during login. Please try again later.');
    }
  };

  return (
    <div>
      <Container>
      <Typography variant="h6">Task Tracker</Typography>
        <Box mt={6} display="flex" justifyContent="center">
          <Paper elevation={3} style={{ padding: 20, borderRadius: 8 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Login
            </Typography>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    name="email"
                    label="Email"
                    fullWidth
                    required
                    placeholder="Your Email"
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    placeholder="Your Password"
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    style={{ color: 'white' }}
                    type="button"
                    variant="contained"
                    fullWidth
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                </Grid>
                
              </Grid>
            </form>
            <Button
            style={{marginTop:'20px'}}
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => history.push('/signup')} 
                  >
                    Sign UP
                  </Button>
          </Paper>
        </Box>
      </Container>

      <ToastContainer />
    </div>
  );
};

export default SigninPage;
