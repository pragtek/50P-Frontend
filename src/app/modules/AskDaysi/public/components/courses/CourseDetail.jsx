import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { gqlQuery } from "@app/_utilities/http";
import { GET_COURSE_DETAIL } from "./query";

import {
  Box,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Button,
  Divider,
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
      
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back to Courses
      </Button>

      <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
        
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
        <Typography color="text.secondary" lineHeight={1.8}>
          This course is designed to help students understand the fundamentals
          and advanced concepts related to the subject. It is suitable for
          learners at the <strong>{course.level}</strong> level and is guided by
          an experienced instructor.
        </Typography>

      </Paper>
    </Box>
  );
}
