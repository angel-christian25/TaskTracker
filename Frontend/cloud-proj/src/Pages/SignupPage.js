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
const SignupPage = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Signup successful!');
        localStorage.setItem('token', data.token);
        history.push('/login');
      } else {
        toast.error('Signup failed. Please check your information and try again.');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      toast.error('Error during signup. Please try again later.');
    }
  };

  return (
    <div>
      <Container>
      <Typography variant="h6">Task Tracker</Typography>
        <Box mt={6} display="flex" justifyContent="center">
          <Paper elevation={3} style={{ padding: 20, borderRadius: 8 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Signup
            </Typography>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="firstName"
                    label="First Name"
                    fullWidth
                    required
                    placeholder="only letters allowed"
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="lastName"
                    label="Last Name"
                    fullWidth
                    required
                    placeholder="only letters allowed"
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    name="email"
                    label="Email"
                    fullWidth
                    required
                    placeholder="Valid Email format"
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
                    placeholder="Minimum 8 characters"
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    required
                    placeholder="Same as password"
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    style={{ color: 'white' }}
                    type="button"
                    variant="contained"
                    fullWidth
                    onClick={handleSignup}
                  >
                    Signup
                  </Button>
                </Grid>
              </Grid>
            </form>
            <Button
            style={{marginTop:'20px'}}
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => history.push('/login')} 
                  >
                    Sign In
                  </Button>
          </Paper>
        </Box>
      </Container>

      <ToastContainer />
    </div>
  );
};

export default SignupPage;
