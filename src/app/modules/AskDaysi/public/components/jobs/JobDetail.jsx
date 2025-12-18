import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useMutation } from "react-query";
import { gqlQuery } from "@app/_utilities/http";
import { GET_JOB_DETAIL } from "./queries";
import { Snackbar, Alert } from "@mui/material";
import { APPLY_JOB } from "./queries";

import {
  Box,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Button,
  Divider,
} from "@mui/material";

import PlaceIcon from "@mui/icons-material/Place";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["jobdetails", id],
    queryFn: ({ signal }) =>
      gqlQuery({
        signal,
        path: "/graphql",
        inData: { gql: GET_JOB_DETAIL(id) }, 
      }),
  });

// Appy to job alert
const [openAlert, setOpenAlert] = React.useState(false);

const applyJobMutation = useMutation({
  mutationFn: () =>
    gqlQuery({
      path: "/graphql",
      inData: {
        gql: APPLY_JOB(id),
      },
    }),
  onSuccess: () => {
    setOpenAlert(true);
  },
    onError: () => {
    alert("Failed to apply for the job");
  },

});
  // find clicked job from list
 const job = data?.rows?.find(
   (item) => String(item.jobId) === String(id)
 );

  if (isLoading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !job) {
    return (
      <Typography color="error" textAlign="center">
        Job details not found.
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
        Back to Jobs
      </Button>

      <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
        
        {/* Title */}
        <Typography variant="h3" fontWeight={500}>
          {job.jobTitle}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Info */}
        <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
          <Chip icon={<PlaceIcon />} label={job.location} />
          <Chip icon={<CurrencyRupeeIcon />} label={`Rs. ${job.salary}`} />
          <Chip icon={<BusinessIcon />} label={`Experience: ${job.experience}`} />
          <Chip icon={<CategoryIcon />} label={job.category} />
        </Box>

        {/* Description */}
        <Typography variant="h5" gutterBottom>
          Job Description
        </Typography>
        <Typography color="text.secondary" lineHeight={1.8} mb={3}>
          {job.description}
        </Typography>

        {/* Qualification */}
        <Typography variant="h5" gutterBottom>
          Qualification
        </Typography>
        <Typography color="text.secondary">
          {job.qualification}
        </Typography>

          {/* add to job box */}
        <Box mt={4}>
          <Button
            variant="contained"
            fullWidth
            disabled={applyJobMutation.isLoading}
            onClick={() => applyJobMutation.mutate()}
          >
            {applyJobMutation.isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Apply to Job"
            )}
          </Button>
        </Box>
        <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={() => setOpenAlert(false)}
      >
        <Alert severity="success" onClose={() => setOpenAlert(false)}>
          You have successfully applied for the job
        </Alert>
      </Snackbar>

      </Paper>
    </Box>
  );
}
