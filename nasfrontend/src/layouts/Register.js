import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { TextField,Button,Link,Box } from '@mui/material'
import { authServices } from '../services/authServices';

function Register() {
    const navigate=useNavigate();

    //local states
    const [loginForm, setLoginForm] = useState({"email": null, "password": null, "confirmPassword": null})

    const formOnChange = (textFieldData) =>{
      setLoginForm({...loginForm, ...textFieldData})
    }

    const onRegister = async () => {
      const response = await authServices.register({email: loginForm.email, password: loginForm.password, username: loginForm.email})
      if(response.status == 200){
        navigate('/');
      }
    }

  return (<>
    <Box sx={{width:350,height:350,marginTop:20,marginLeft:90,border:'1px solid black',paddingLeft:8,paddingRight:8,borderRadius:12}}>
      <p style={{paddingLeft:140}}>REGISTER</p>
      <div style={{ marginBottom: 20 }}><TextField
      fullWidth
      id="outlined-email"
      name = "email"
      label="E-mail"
      type="email"
      onChange={(e)=>formOnChange({[e.target.name]: e.target.value})}
      />
      </div>
      <div style={{ marginBottom: 20 }}>
      <TextField
      fullWidth
      id="outlined-password"
      name="password"
      label="Password"
      type="password"
      onChange={(e)=>formOnChange({[e.target.name]: e.target.value})}
      />
      </div>
      <div style={{ marginBottom: 20 }}>
      <TextField
      fullWidth
      id="outlined-confirm-password"
      name="confirmPassword"
      label="Confirm Password"
      type="password"
      onChange={(e)=>formOnChange({[e.target.name]: e.target.value})}
      />
      </div>
      <p style={{display:'inline'}}>Have an account? <Link href="/" underline='none'>Login</Link></p>
      <Button style={{marginLeft:70}} variant="contained" onClick={onRegister}>Register</Button>
    </Box>
      </>
  )
}

export default Register