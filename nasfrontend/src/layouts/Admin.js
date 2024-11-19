import React, { useEffect, useState } from "react";
import { baseServices } from "../services/BaseServiceCalls";
import {
  Toolbar,
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Select
} from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Gauge } from '@mui/x-charts/Gauge';
import GroupIcon from "@mui/icons-material/Group";
import DeleteIcon from '@mui/icons-material/Delete';
import WebStoriesIcon from '@mui/icons-material/WebStories';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Header from "./Header";

function Admin() {
  const [admin,setAdmin]=useState([])
  const [level1,setLevel1]=useState([])
  const [level2,setLevel2]=useState([])
  const [user,setUser]=useState([])
  const [group,setGroup]=useState("")
  const [isopen,setIsOpen]=useState(false)
  const [selectedUser,setSelectedUser]=useState(-1)
  const [targetGroup,setTargetGroup]=useState("")
  const [used,setUsed]=useState(0)
  const [total,setTotal]=useState(0)
  const [percent,setPercent]=useState(0)
  const handleCardClick = (group) => {
    if(group === "Admin"){
      setGroup("Admin")
      setUser(admin)
    }
    else if(group === "Level 1"){
      setGroup("Level 1")
      setUser(level1)
    }
    else{
      setGroup("Level 2")
      setUser(level2)
    }
  };
  async function fetchUser(){
    const response=await baseServices.getData('getallusers/')
      console.log(response.data.data)
      setAdmin(await response.data.data.filter((user)=>user.user_level===0))
      setLevel1(await response.data.data.filter((user)=>user.user_level===1))
      setLevel2(await response.data.data.filter((user)=>user.user_level===2))
  }
  async function fetchSystemDetails(){
    // const response=await baseServices.getData('getdiskusage')
    // console.log(response.data)
    // setUsed(response.data.nas_disk_size)
    // setTotal(response.data.total_disk_size)
    // setPercent(response.data.cpu_usage)
    setUsed(69632)
    setTotal(37580963840)
    setPercent(4.76)
  }
  function handleOpenDialog(userId){
    setSelectedUser(userId);
    setIsOpen(true);
  }
  function handleCloseDialog(){
    setIsOpen(false);
    setSelectedUser(-1);
    setTargetGroup(-1);
  }
  async function handleSystemLogs(){
    const response=await baseServices.getData('getsystemlogs')
    console.log(response)
  }
  async function handleSwap(){
    console.log(selectedUser)
    console.log(targetGroup)
    const response=await baseServices.putData('edituserlevel/',{user_id:selectedUser,user_level:targetGroup})
    console.log(response)
    setSelectedUser(-1)
    setTargetGroup("") 
    setIsOpen(false)
    setGroup("")
  }

  async function handleDelete(userId) {
    const response=await baseServices.deleteData('deleteuser?user_id='+userId)
    setGroup("")
    console.log(response)
  }

  useEffect(()=>{
    fetchUser()
    fetchSystemDetails()
  },[group])

  return (<>
      <Header />
      <Box component="main" sx={{ marginLeft:28,flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h4" sx={{ textAlign: "center", mb: 4 }}>
          Admin Panel
        </Typography>
        <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}>
      <Box sx={{ textAlign: "start", flex: 1,width:"50%"}}>
        <Typography variant="h6" sx={{marginLeft:10}}>
          Storage Usage
        </Typography>
        <PieChart
          series={[
            {
              data: [
                { id: 0, value: used, label: "Used" },
                { id: 1, value: total-used, label: "Free Space" },
              ],
            },
          ]}
          width={400}
          height={200} 
        />
      </Box>
      <Box sx={{ textAlign: "start", flex: 1,width:"50%"}}>
        <Typography variant="h6" sx={{marginLeft:16}}>
          CPU Utilization
        </Typography>
        <Gauge
          width={400}
          height={200}
          value={percent}
        />
      </Box>
    </Box>
        <Box sx={{ display: "flex", gap:2,mb:3,justifyContent: "space-around",marginTop:5  }}>
          <Card
            sx={{
              width: 240,
              cursor: "pointer"
            }}
            onClick={() => {handleCardClick("Admin")}}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <AdminPanelSettingsIcon />
                <Box>
                  <Typography variant="h6">Admin</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {admin.length} Users
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card
            sx={{
              width: 240,
              cursor: "pointer"
            }}
            onClick={() => {handleCardClick("Level 1")}}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <GroupIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Level 1</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {level1.length} Users
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card
            sx={{
              width: 240,
              cursor: "pointer"
            }}
            onClick={() => {handleCardClick("Level 2")}}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <GroupIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Level 2</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {level2.length} Users
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card
            sx={{
              width: 240,
              cursor: "pointer"
            }}
            onClick={() => {handleSystemLogs()}}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <WebStoriesIcon />
                <Box>
                  <Typography variant="h6">System Logs</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        {group && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
              <TableCell align="center" colSpan={4}>
                {group}
              </TableCell>
              </TableRow>
              </TableHead>
              <TableHead>
                <TableRow>
                  <TableCell>User ID</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>User Level</TableCell>
                  {group !== "Admin" && <TableCell>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {user.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    {user.user_level===0? <TableCell>Admin</TableCell>: user.user_level===1?<TableCell>Level 1</TableCell>:<TableCell>Level 2</TableCell>}
                    {group !== "Admin" && <TableCell>
                      <IconButton onClick={() => handleOpenDialog(user.id)} ><SwapHorizIcon /></IconButton>
                      <IconButton onClick={() => handleDelete(user.id)} ><DeleteIcon></DeleteIcon></IconButton>
                      </TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
              <Dialog open={isopen} onClose={handleCloseDialog}>
              <DialogTitle>Swap User Group</DialogTitle>
              <DialogContent>
                <p>Select the target group for the user:</p>
                <Select
                  value={targetGroup}
                  onChange={(e) => setTargetGroup(e.target.value)}
                  displayEmpty
                  fullWidth
                >
                  <MenuItem value="" disabled>
                    Select a Group
                  </MenuItem>
                  <MenuItem value="0">Admin</MenuItem>
                  {group === "Level 1"?<MenuItem value="2">Level 2</MenuItem>:<MenuItem value="1">Level 1</MenuItem>}
                </Select>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="secondary">
                  Cancel
                </Button>
                <Button
                  onClick={handleSwap}
                  color="primary"
                  disabled={!targetGroup}
                >
                  Swap
                </Button>
              </DialogActions>
            </Dialog>
          </TableContainer>
        )}
      </Box>
    </>
  );
}

export default Admin;
