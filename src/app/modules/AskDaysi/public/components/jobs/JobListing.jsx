import React, { useEffect, useState } from "react";
import { Box, Typography, Card, Stack } from "@mui/material";

export default function JobListing() {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const GRAPHQL_URL = "http://localhost:8000/graphql/"; 

  useEffect(() => {
    const fetchJobs = async () => {
      const query = `
        query GetJobs($first: Int, $skip: Int, $search: String) {
          allJobList(first: $first, skip: $skip, search: $search) {
            totalRows
            rows {
              jobId
              jobTitle
            }
          }
        }
      `;

      const variables = {
        first: 10,  // how many to show
        skip: 0,    // pagination offset
        search: ""  // search text
      };

      try {
        const res = await fetch(GRAPHQL_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query, variables }),
        });

        const json = await res.json();
        const data = json.data.allJobList;

        setJobs(data.rows);
        setTotal(data.totalRows);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography sx={{ mb: 2 }}>{`We've found ${total} jobs!`}</Typography>

      <Stack spacing={2}>
        {jobs.map((job) => (
          <Card
            key={job.jobId}
            sx={{
              p: 2,
              borderRadius: 2,
              cursor: "pointer",
              "&:hover": { border: "2px solid #a477f2" },
            }}
          >
            <Typography variant="h6">{job.jobTitle}</Typography>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
