import React from "react";
import {
  Toolbar,
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  IconButton
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SearchIcon from "@mui/icons-material/Search";
import Header from "./Header";

// Dummy data for files and permissions
const filesData = [
  { id: 1, name: "File 1", permission: "Read Only" },
  { id: 2, name: "File 2", permission: "Read and Write" },
  { id: 3, name: "File 3", permission: "Read Only" },
  { id: 4, name: "File 4", permission: "Read and Write" },
  { id: 5, name: "File 5", permission: "Read Only" },
  { id: 6, name: "File 6", permission: "Read and Write" },
  { id: 7, name: "File 7", permission: "Read Only" },
  { id: 8, name: "File 8", permission: "Read and Write" },
];
function Home() {
  return (<>
        <Header />
        <Box component="main" sx={{marginLeft:28, flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontWeight: 400,
            color: "#202124",
            textAlign: "center",
          }}
        >
          Welcome to NAS Storage Drive
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
            width: "100%",
          }}
        >
          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <InsertDriveFileIcon sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {filesData.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Files
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <TextField
            placeholder="Search in Drive"
            variant="outlined"
            size="small"
            sx={{
              width: "800px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "24px",
                backgroundColor: "#f1f3f4",
                "&:hover": {
                  backgroundColor: "#fff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <IconButton type="button" aria-label="search" size="small">
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
          <Button
            variant="contained"
            sx={{
              height: 40,
              borderRadius: "20px",
              textTransform: "none",
              px: 3,
            }}
          >
            Upload
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="files table">
            <TableHead>
              <TableRow>
                <TableCell>File Name</TableCell>
                <TableCell>Permissions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filesData.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>{file.permission}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default Home;
