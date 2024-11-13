import AppBar from "../../components/AppBar"
import MainPage from "../../containers/MainPage"
import { Grid2 as Grid } from "@mui/material"

import styled from "@emotion/styled"
import Styles from "./style"

const PrivateLayout = (props) => {

    const {className} = props
    
    return <>
        <Grid className={className}>
            <AppBar />
            <Grid container className={"mainContainerLayout"}>
                <MainPage />
            </Grid>
        </Grid> 
    </>
}

export default styled(PrivateLayout)(Styles)