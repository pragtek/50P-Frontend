import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import {
  Box,
  Button,
  TextField,
  Paper,
  Container,
  Stack,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

import { gqlQuery, gqlMutate, queryClient } from "@app/_utilities/http";
import {
  GET_SITE_CONTENT_BY_ID,
  CREATE_SITE_CONTENT,
  UPDATE_SITE_CONTENT,
} from "./SiteContentQueries";

export default function SiteContentForm() {
  const navigate = useNavigate();
  const params = useParams();

  const [values, setValues] = useState({
    title: "",
    content: "",
  });

  const [error, setError] = useState("");

  /* ===========================
     Fetch (Edit Mode)
     =========================== */
  const { isLoading } = useQuery({
    queryKey: ["site-content", params.id],
    enabled: !!params.id,
    queryFn: ({ signal }) =>
      gqlQuery({
        signal,
        path: "/graphql",
        inData: { gql: GET_SITE_CONTENT_BY_ID(params.id) },
      }),
    onSuccess: (res) => {
      const d = res?.contentById;
      if (d) {
        setValues({
          title: d.title || "",
          content: d.content || "",
        });
      }
    },
  });

  /* ===========================
     Mutation
     =========================== */
  const { mutate, isPending } = useMutation({
    mutationFn: gqlMutate,
    onSuccess: () => {
      queryClient.invalidateQueries(["site-content"]);
      navigate("/askdaysi/SiteContent");
    },
    onError: (err) =>
      setError(err?.info?.message || "Something went wrong"),
  });

  /* ===========================
     Submit
     =========================== */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!values.title || !values.content) {
      setError("All fields are required");
      return;
    }

    const gql = params.id
      ? UPDATE_SITE_CONTENT({ ...values, id: params.id })
      : CREATE_SITE_CONTENT(values);

    mutate({ path: "/graphql", inData: { gql } });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          {params.id ? "Edit Content" : "Add Content"}
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {isLoading ? (
          <Stack alignItems="center">
            <CircularProgress />
          </Stack>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Title (e.g. JOB_APPLY_SUCCESS)"
                value={values.title}
                onChange={(e) =>
                  setValues({ ...values, title: e.target.value })
                }
                fullWidth
                required
              />

              <TextField
                label="Content"
                value={values.content}
                onChange={(e) =>
                  setValues({ ...values, content: e.target.value })
                }
                multiline
                rows={4}
                fullWidth
                required
              />

              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/askdaysi/SiteContent")}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={isPending}>
                  {params.id ? "Update" : "Save"}
                </Button>
              </Box>
            </Stack>
          </form>
        )}
      </Paper>
    </Container>
  );
}
