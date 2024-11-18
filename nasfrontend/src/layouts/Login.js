import React, { useState,useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Link, Box } from '@mui/material'
import { authServices } from '../services/authServices';
import { LoginContext } from '../App';


function Login() {
  const navigate = useNavigate()
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const useLoginContext=useContext(LoginContext);

  async function check() {
    console.log("Form Submited");
    const response = await authServices.login({username: email, password: password})
    console.log(response)
      if(response.status === 200){
        useLoginContext.setIsLoggedIn(true)
        useLoginContext.setUserId(""+response.data.user_id)
        useLoginContext.setUserLevel(""+response.data.user_level)
        navigate('/home');
      }
  }
  return (<>
    <Box sx={{ width: 350, height: 250, marginTop: '10%', marginLeft: '35%', border: '1px solid black', paddingLeft: 8, paddingRight: 8, borderRadius: 12 }}>
      <p style={{ paddingLeft: 145 }}>LOGIN</p>
      <div style={{ marginBottom: 20 }}>
        <TextField
        fullWidth
        id="outlined-email"
        label="E-mail"
        type="email"
        onChange={(e)=> setEmail(e.target.value)}
      />
      </div>
      <div style={{ marginBottom: 20 }}>
        <TextField
          fullWidth
          id="outlined-password"
          label="Password"
          type="password"
          onChange={(e)=> setPassword(e.target.value)}
        />
      </div>
      <p style={{ display: 'inline' }}>Don't have an account?<Link href="../register" underline='none'>Register</Link></p>
      <Button style={{ marginLeft: 42 }} variant="contained" onClick={check}>Login</Button>
    </Box>
  </>
  )
}

export default Login