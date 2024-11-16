import React from 'react'
import { useNavigate } from 'react-router-dom';
import { TextField,Button,Link,Box } from '@mui/material'

function Register() {
    const navigate=useNavigate();
    function check(){
        console.log("Register Button Clicked");
        navigate('/');
    }
  return (<>
    <Box sx={{width:350,height:350,marginTop:20,marginLeft:90,border:'1px solid black',paddingLeft:8,paddingRight:8,borderRadius:12}}>
      <p style={{paddingLeft:140}}>REGISTER</p>
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
      <div style={{ marginBottom: 20 }}>
      <TextField
      fullWidth
      id="outlined-confirm-password"
      label="Confirm Password"
      type="password"
      />
      </div>
      <p style={{display:'inline'}}>Have an account? <Link href="/" underline='none'>Login</Link></p>
      <Button style={{marginLeft:70}} variant="contained" onClick={check}>Register</Button>
    </Box>
      </>
  )
}

export default Register