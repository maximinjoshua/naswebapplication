import { AppBar as Core, Typography, Grid2 as Grid } from "@mui/material"

const AppBar = (props) => {

    const {className} = props
    return <>
        <Core className={className}>
            <Grid container direction={"row"}>
                <Typography textAlign={"center"}>This is the appbar</Typography>
            </Grid>
        </Core>
    </>
}

export default AppBar