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
  Paper
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import Header from "./Header";

// const userData = {
//   readOnly: [
//     {
//       id: "RO001",
//       firstName: "John",
//       lastName: "Doe",
//       email: "john.doe@example.com",
//     },
//     {
//       id: "RO002",
//       firstName: "Jane",
//       lastName: "Smith",
//       email: "jane.smith@example.com",
//     },
//     {
//       id: "RO003",
//       firstName: "Mike",
//       lastName: "Johnson",
//       email: "mike.j@example.com",
//     },
//     {
//       id: "RO004",
//       firstName: "Sarah",
//       lastName: "Williams",
//       email: "sarah.w@example.com",
//     },
//     {
//       id: "RO005",
//       firstName: "David",
//       lastName: "Brown",
//       email: "david.b@example.com",
//     },
//   ],
//   readWrite: [
//     {
//       id: "RW001",
//       firstName: "Alex",
//       lastName: "Wilson",
//       email: "alex.w@example.com",
//     },
//     {
//       id: "RW002",
//       firstName: "Emma",
//       lastName: "Davis",
//       email: "emma.d@example.com",
//     },
//     {
//       id: "RW003",
//       firstName: "James",
//       lastName: "Taylor",
//       email: "james.t@example.com",
//     },
//     {
//       id: "RW004",
//       firstName: "Lisa",
//       lastName: "Anderson",
//       email: "lisa.a@example.com",
//     },
//     {
//       id: "RW005",
//       firstName: "Robert",
//       lastName: "Martin",
//       email: "robert.m@example.com",
//     },
//   ],
// };

function Admin() {
  const [admin,setAdmin]=useState([])
  const [level1,setLevel1]=useState([])
  const [level2,setLevel2]=useState([])
  const [user,setUser]=useState([])
  const handleCardClick = (group) => {
    if(group === "admin"){
      setUser(admin)
    }
    else if(group === "Level 1"){
      setUser(level1)
    }
    else{
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

  useEffect(()=>{
    fetchUser()
  },[])

  return (<>
      <Header />
      <Box component="main" sx={{ marginLeft:28,flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h4" sx={{ textAlign: "center", mb: 4 }}>
          Admin Panel
        </Typography>
        <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
          <Card
            sx={{
              width: 240,
              cursor: "pointer"
            }}
            onClick={() => handleCardClick("admin")}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <GroupIcon sx={{ fontSize: 40 }} />
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
            onClick={() => handleCardClick("Level 1")}
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
            onClick={() => handleCardClick("Level 2")}
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
        </Box>
        {user.length!==0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User ID</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {user.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.user_level}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </>
  );
}

export default Admin;
