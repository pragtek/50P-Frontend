import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import { gqlQuery, queryClient } from "@app/_utilities/http";
import {
  GET_SITE_CONTENT,
  DELETE_SITE_CONTENT,
} from "./SiteContentQueries";

export default function SiteContentList() {
  const navigate = useNavigate();
  const searchRef = useRef();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["site-content", search, page],
    queryFn: ({ signal }) =>
      gqlQuery({
        signal,
        path: "/graphql",
        inData: { gql: GET_SITE_CONTENT(search, page) },
      }),
  });

  const rows = data?.rows || [];
  const totalRows = data?.totalRows || 0;
  const totalPages = Math.ceil(totalRows / 10);

  const handleDelete = (id) => {
    if (!confirm("Delete this content?")) return;

    gqlQuery({
      path: "/graphql",
      inData: { gql: DELETE_SITE_CONTENT(id) },
    }).then(() => {
      queryClient.invalidateQueries(["site-content"]);
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchRef.current.value);
    setPage(1);
  };

  return (
    <Box p={5}>
      {/* Search */}
      <form onSubmit={handleSearch}>
        <TextField
          inputRef={searchRef}
          placeholder="Search content..."
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <IconButton type="submit">
                <SearchOutlinedIcon />
              </IconButton>
            ),
          }}
        />
      </form>

      <Button
        variant="contained"
        sx={{ mt: 2, mb: 2 }}
        onClick={() => navigate("/askdaysi/SiteContent/new")}
      >
        + Add Content
      </Button>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Content</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="p-3 border">{r.id}</td>
                <td className="p-3 border font-medium">{r.title}</td>
                <td className="p-3 border">{r.content}</td>
                <td className="p-3 border flex gap-2">
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() =>
                      navigate(`/askdaysi/SiteContent/${r.id}`)
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => handleDelete(r.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <Box mt={3} display="flex" gap={2}>
        <Button
          variant="outlined"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>
        <Button
          variant="outlined"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
