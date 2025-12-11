import React from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { Box, Container, Typography } from "@mui/material";
import CourseListing from "../components/courses/courselisting"; 
import Footer from "../global/footer";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AskDaysiCourses = ({ isDialogOpened, handleCloseDialog }) => {
  const handleClose = () => handleCloseDialog(false);

  return (
    <Dialog
      fullScreen
      open={isDialogOpened}
      onClose={handleClose}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          bgcolor: "#f5f7fb", // UI background
        },
      }}
    >
      {/* Glass Header */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: 72,
          backdropFilter: "blur(14px)",
          background: "rgba(255,255,255,0.78)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 4,
          zIndex: 20,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: "#111",
            letterSpacing: 0.5,
          }}
        >
          📘 Course Explorer
        </Typography>

        <IconButton
          onClick={handleClose}
          sx={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(0,0,0,0.1)",
            boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
            "&:hover": {
              background: "rgba(255,255,255,1)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Body */}
      <Container sx={{ pt: 14, pb: 10 }}>
        <Box textAlign="center" sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: "34px",
              color: "#222",
            }}
          >
            Courses List
          </Typography>

          <Typography
            variant="h6"
            sx={{
              opacity: 0.7,
              mt: 1,
              fontWeight: 400,
            }}
          >
            Explore new skills and upgrade yourself ✨
          </Typography>
        </Box>

        <CourseListing />
      </Container>

      <Footer />
    </Dialog>
  );
};

export default AskDaysiCourses;
