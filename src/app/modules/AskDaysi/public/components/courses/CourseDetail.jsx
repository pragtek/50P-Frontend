<<<<<<< HEAD

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { gqlQuery } from "@app/_utilities/http";
import { GET_COURSE_DETAIL, APPLY_COURSE } from "./query";
=======
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { gqlQuery } from "@app/_utilities/http";
import { GET_COURSE_DETAIL } from "./query";
>>>>>>> 60869eba7cc309bbee70ed978ddc02db6ec50742

import {
  Box,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Button,
  Divider,
<<<<<<< HEAD
  Snackbar,
  Alert,
=======
>>>>>>> 60869eba7cc309bbee70ed978ddc02db6ec50742
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LayersIcon from "@mui/icons-material/Layers";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["course details", courseId],
    queryFn: ({ signal }) =>
      gqlQuery({
        signal,
        path: "/graphql",
        inData: { gql: GET_COURSE_DETAIL },
      }),
  });

<<<<<<< HEAD
  // Apply course alert
  const [openAlert, setOpenAlert] = React.useState(false);

  const applyCourseMutation = useMutation({
    mutationFn: () =>
      gqlQuery({
        path: "/graphql",
        inData: {
          gql: APPLY_COURSE(courseId),
        },
      }),
    onSuccess: () => {
      setOpenAlert(true);
    },
  });

=======
>>>>>>> 60869eba7cc309bbee70ed978ddc02db6ec50742
  // Find selected course
  const course = data?.rows?.find(
    (item) => String(item.courseId) === String(courseId)
  );

  if (isLoading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !course) {
    return (
      <Typography color="error" textAlign="center">
        Course details not found.
      </Typography>
    );
  }

  return (
    <Box maxWidth="900px" mx="auto" p={5}>
<<<<<<< HEAD
=======
      
>>>>>>> 60869eba7cc309bbee70ed978ddc02db6ec50742
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back to Courses
      </Button>

      <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
<<<<<<< HEAD
=======
        
>>>>>>> 60869eba7cc309bbee70ed978ddc02db6ec50742
        {/* Course Title */}
        <Typography variant="h3" fontWeight={500}>
          {course.courseName}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Info Chips */}
        <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
          <Chip
            icon={<PersonIcon />}
            label={`Teacher: ${course.teacher?.firstName} ${course.teacher?.lastName}`}
          />
          <Chip icon={<ScheduleIcon />} label={`Duration: ${course.duration}`} />
          <Chip icon={<LayersIcon />} label={`Level: ${course.level}`} />
          <Chip icon={<SchoolIcon />} label={`Course ID: ${course.courseId}`} />
        </Box>

        {/* Course Overview */}
        <Typography variant="h5" gutterBottom>
          Course Overview
        </Typography>
<<<<<<< HEAD
        <Typography color="text.secondary" lineHeight={1.8} mb={4}>
=======
        <Typography color="text.secondary" lineHeight={1.8}>
>>>>>>> 60869eba7cc309bbee70ed978ddc02db6ec50742
          This course is designed to help students understand the fundamentals
          and advanced concepts related to the subject. It is suitable for
          learners at the <strong>{course.level}</strong> level and is guided by
          an experienced instructor.
        </Typography>

<<<<<<< HEAD
        {/* Apply for Course */}
        <Button
          variant="contained"
          fullWidth
          disabled={applyCourseMutation.isLoading}
          onClick={() => applyCourseMutation.mutate()}
        >
          {applyCourseMutation.isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Apply for the Course"
          )}
        </Button>

        {/* Success Alert */}
        <Snackbar
          open={openAlert}
          autoHideDuration={3000}
          onClose={() => setOpenAlert(false)}
        >
          <Alert severity="success" onClose={() => setOpenAlert(false)}>
            You have successfully applied for the course
          </Alert>
        </Snackbar>
=======
>>>>>>> 60869eba7cc309bbee70ed978ddc02db6ec50742
      </Paper>
    </Box>
  );
}
