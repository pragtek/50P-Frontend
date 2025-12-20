import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { gqlQuery, queryClient } from "@app/_utilities/http";
import { GET_JOB_DETAIL, APPLY_JOB } from "./queries";

import {
  Box,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Button,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";

import PlaceIcon from "@mui/icons-material/Place";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ---------------------------------------
   * JOB DETAIL
   * ------------------------------------- */
  const { data, isLoading, isError } = useQuery({
    queryKey: ["jobdetails", id],
    queryFn: ({ signal }) =>
      gqlQuery({
        signal,
        path: "/graphql",
        inData: { gql: GET_JOB_DETAIL(id) },
      }),
  });

  const job = data?.rows?.find(
    (item) => String(item.jobId) === String(id)
  );

  /* ---------------------------------------
   * APPLIED JOBS (BY USER)
   * ------------------------------------- */
   const { data: appliedData, isLoading: appliedLoading } = useQuery({
    queryKey: ["appliedJobs"],
    queryFn: ({ signal }) =>
      gqlQuery({
        signal,
        path: "/graphql",
        inData: {
          gql: `
            query {
              allJobByUser(first: 100) {
                rows {
                  jobId
                }
              }
            }
          `,
        },
      }),
  });

 const alreadyApplied = appliedData?.allJobByUser?.rows?.some(
    (j) => String(j.jobId) === String(id)
  );

  /* ---------------------------------------
   * APPLY JOB MUTATION
   * ------------------------------------- */
  const [openAlert, setOpenAlert] = React.useState(false);

  const applyJobMutation = useMutation({
    mutationFn: () =>
      gqlQuery({
        path: "/graphql",
        inData: {
          gql: APPLY_JOB,
          variables: { jobId: Number(id) },
        },
      }),
    onSuccess: (res) => {
      if (res?.applyJob?.ok) {
        setOpenAlert(true);
        queryClient.invalidateQueries(["appliedJobs"]);
      }
    },
    onError: () => {
      alert("Failed to apply for the job");
    },
  });

  /* ---------------------------------------
   * LOADING / ERROR STATES
   * ------------------------------------- */
  if (isLoading || appliedLoading) {
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

        {/* Apply Button */}
        <Box mt={4}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={alreadyApplied || applyJobMutation.isLoading}
            onClick={() => applyJobMutation.mutate()}
            sx={{
              py: 1.4,
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 3,
              background: alreadyApplied
                ? "linear-gradient(135deg, #9ca3af, #6b7280)"
                : "linear-gradient(135deg, #f32f08ff, #f45009ff)",
            }}
          >
            {applyJobMutation.isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : alreadyApplied ? (
              "Already Applied ✔"
            ) : (
              "Apply for this Job"
            )}
          </Button>
        </Box>

        {/* Success Snackbar */}
        <Snackbar
          open={openAlert}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={() => setOpenAlert(false)}
        >
          <Alert severity="success" variant="filled">
             Application submitted successfully!
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}
