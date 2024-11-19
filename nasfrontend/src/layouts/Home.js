import React, { useState, useContext, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  FormGroup,
  FormControlLabel,
  DialogActions,
  Checkbox
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Header from "./Header";
import { LoginContext } from '../App';
import { fileServies } from "../services/fileServices";

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
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [options, setOptions] = useState({
    Level1R: false,
    Level1RW: false,
    Level2R: false,
    Level2RW: false
  });
  const useLoginContext = useContext(LoginContext)
  useEffect(() => {
    if (useLoginContext.userLevel === 1) {
      setOptions({
        Level1R: true,
        Level1RW: true,
        Level2R: false,
        Level2RW: false,
      });
    } else {
      setOptions({
        Level1R: true,
        Level1RW: true,
        Level2R: true,
        Level2RW: true,
      });
    }
  }, [useLoginContext.userLevel]);
  function handleOpen() {
    setIsOpen(true)
  }
  function handleClose() {
    setIsOpen(false)
    setFile(null)
  }
  // const formData = new FormData();

  function handleFileChange(e) {
    // formData.append(e)
    setFile(e.target.files[0])
    console.log(e)
  }
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setOptions((prevOptions) => ({
      ...prevOptions,
      [name]: checked,
    }));
  };

  const handleSubmit = async () => {
    let formData = new FormData()

    formData.append('file', file)
    formData.append('user_id', useLoginContext.userId)
    formData.append('folder_id', null)

    const response = await fileServies.uploadFiles(formData)

    // save the permissions of the uploaded file in database
    const user_file_permissions = { file_id_list: response.data.file_id_list, permissions_object: options, user_id: useLoginContext.userId}
    if (response?.data?.file_id_list) {
      const permissionUpdateResponse = await fileServies.createPermissionEntry(user_file_permissions)
      console.log(permissionUpdateResponse, "permission")
    }

  }
  return (<>
    <Header />
    <Box component="main" sx={{ marginLeft: 28, flexGrow: 1, p: 3 }}>
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
        <Button
          variant="contained"
          sx={{
            height: 40,
            borderRadius: "20px",
            textTransform: "none",
            px: 3,
          }}
          onClick={handleOpen}
        >
          Upload
        </Button>
        <Dialog open={isOpen} onClose={handleClose}>
          <DialogTitle>Upload File</DialogTitle>
          <DialogContent>
            <TextField
              type="file"
              fullWidth
              onChange={handleFileChange}
            />
            {useLoginContext.userLevel === "0" && (
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="Level1R"
                      checked={options.Level1R}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="Level 1 Read"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="Level1RW"
                      checked={options.Level1RW}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="Level 1 Read/Write"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="Level2R"
                      checked={options.Level2R}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="Level 2 Read"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="Level2RW"
                      checked={options.Level2RW}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="Level 2 Read/Write"
                />
              </FormGroup>
            )}
            {useLoginContext.userLevel === "1" && (
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="Level2R"
                      checked={options.Level2R}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="Level 2 Read"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="Level2RW"
                      checked={options.Level2RW}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="Level 2 Read/Write"
                />
              </FormGroup>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!file}>
              Upload
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
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
