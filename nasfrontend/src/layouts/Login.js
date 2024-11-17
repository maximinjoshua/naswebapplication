import React from 'react'
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Link, Box } from '@mui/material'


function Login() {
  const navigate = useNavigate();
  function check() {
    console.log("Form Submited");
    navigate('/home');
  }
  return (<>
    <Box sx={{ width: 350, height: 250, marginTop: 20, marginLeft: 90, border: '1px solid black', paddingLeft: 8, paddingRight: 8, borderRadius: 12 }}>
      <p style={{ paddingLeft: 145 }}>LOGIN</p>
      <div style={{ marginBottom: 20 }}><TextField
        fullWidth
        id="outlined-email"
        label="E-mail"
        type="email"
      />
      </div>
      <div style={{ marginBottom: 20 }}>
        <TextField
          fullWidth
          id="outlined-password"
          label="Password"
          type="password"
        />
      </div>
      <p style={{ display: 'inline' }}>Don't have an account?<Link href="../register" underline='none'>Register</Link></p>
      <Button style={{ marginLeft: 42 }} variant="contained" onClick={check}>Login</Button>
    </Box>
  </>
  )
}

export default Login