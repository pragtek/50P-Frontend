import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { Box, Container, Typography } from "@mui/material";
import { Colors } from "../../theme/colors";
import JobListing from "../components/jobs/JobListing";
import Footer from "../global/footer";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AskDaysiJobs = ({ isDialogOpened, handleCloseDialog }) => {
  const handleClose = () => handleCloseDialog(false);

  return (
    <Dialog fullScreen open={isDialogOpened} onClose={handleClose} TransitionComponent={Transition}>
      <IconButton
        edge="start"
        onClick={handleClose}
        sx={{
          position: "fixed",
          right: "30px",
          top: "20px",
          border: `1px solid ${Colors.black}`,
          padding: "3px",
          color: Colors.black,
          backgroundColor: Colors.white,
        }}
      >
        <CloseIcon />
      </IconButton>

      <Container sx={{ py: 10 }}>
        <Box textAlign="center" sx={{ mb: 6 }}>
          <Typography variant="h2" sx={{ fontSize: "28px", fontWeight: 500 }}>
            Job List 
          </Typography>
          <Typography variant="h4" sx={{ opacity: 0.7 }}>
            Find job easily 
          </Typography>
        </Box>

        <JobListing />
      </Container>

      <Footer />
    </Dialog>
  );
};

export default AskDaysiJobs;
