import { React, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import { Box,Drawer,Toolbar,Divider,List,ListItem,ListItemButton,ListItemIcon,ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { LoginContext } from '../App';


function Header() {

  const navigate=useNavigate()
  const useLoginContext=useContext(LoginContext)
  const handleNavigation = (text) => {
    if (text === "Home") {
      navigate("/home");
    } else if (text === "Admin") {
      console.log(useLoginContext.userLevel)
      if(useLoginContext.userLevel==="0")navigate("/admin")
      else{
        alert("You do not have permission to access the Admin page.");
      }
    }
    else{
        useLoginContext.setIsLoggedIn(false)
        useLoginContext.setUserId("")
        useLoginContext.setUserLevel("")
        navigate("/")
    }
  };
  return (<>
     <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {["Home", "Admin", "LogOut"].map((text, i) => (
            <ListItem key={text}>
              <ListItemButton onClick={() => handleNavigation(text)}>
                <ListItemIcon>
                  {i === 0 ? (
                    <HomeIcon />
                  ) : i === 1 ? (
                    <PersonIcon />
                  ) : (
                    <LogoutIcon />
                  )}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      </Box>
  </>)
}

export default Header