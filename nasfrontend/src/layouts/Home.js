import React from 'react'
import { Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

function Home() {
  return (
    <Drawer
    variant="permanent"
    anchor="left">
        <Toolbar />
        <Divider />
        <List>
            {["Home","Admin","LogOut"].map((text,i)=>(
                <ListItem key={text}>
                    <ListItemButton>
                        <ListItemIcon>
                            {i ===0 ? <HomeIcon />:i ===1 ? <PersonIcon />:<LogoutIcon />}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    </Drawer>
  )
}

export default Home