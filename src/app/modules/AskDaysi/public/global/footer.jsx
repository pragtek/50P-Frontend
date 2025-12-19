import { Box, Container, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import {
  ADFooterContainer,
  ADFooterCopy,
  ADFooterWrapper,
} from "../../styles/global/footer";
import AskDaysiAbout from "../dialogs/about";
import CopyrightOutlinedIcon from "@mui/icons-material/CopyrightOutlined";
import AskDaysiJobs from "../dialogs/jobs";
import AskDaysiTermsOfService from "../dialogs/TermsOfService";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const today = new Date();
  const year = today.getFullYear();

  const [isOpen, setIsOpen] = useState(false);
  const [isJobs, setIsJobs] = useState(false);
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  const [isTerms, setIsTerms] = useState(false);
  const handleTerms = () => {
    setIsTerms(!isTerms);
  };

  const { t } = useTranslation();

  return (
    <ADFooterWrapper
  maxWidth="100%"
  style={{
    background: "#fafafa",
    borderTop: "1px solid rgba(0,0,0,0.08)",
    padding: "30px 0",
  }}
>
  <Container maxWidth="xl">
    <ADFooterContainer
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px",
      }}
    >
      {/* Left Section */}
      <Stack direction="row" spacing={1} alignItems="center">
        <CopyrightOutlinedIcon
          sx={{ fontSize: 18, opacity: 0.6, position: "relative", top: "1px" }}
        />
        <ADFooterCopy
          style={{
            fontSize: "15px",
            opacity: 0.8,
            fontWeight: 500,
            letterSpacing: "0.2px",
          }}
        >
           {year} 50Paisa — All rights reserved.
        </ADFooterCopy>
      </Stack>

      {/* Right Section */}
      <Stack direction="row" spacing={3} alignItems="center">
        <Typography
          variant="body1"
          onClick={() => handleTerms()}
          sx={{
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: 600,
            opacity: 0.8,
            transition: "0.2s",
            "&:hover": {
              opacity: 1,
              color: "#1976d2",
            },
          }}
        >
          {t("terms.pageTitle")}
        </Typography>

        <Typography
          variant="body1"
          onClick={() => setIsOpen(true)}
          sx={{
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: 600,
            opacity: 0.8,
            transition: "0.2s",
            "&:hover": {
              opacity: 1,
              color: "#1976d2",
            },
          }}
        >
          About
        </Typography>
      </Stack>
    </ADFooterContainer>

    {/* Dialogs */}
    <AskDaysiAbout
      isDialogOpened={isOpen}
      handleCloseDialog={() => setIsOpen(false)}
    />
    <AskDaysiTermsOfService
      isDialogOpened={isTerms}
      handleCloseDialog={() => setIsTerms(false)}
    />
  </Container>
</ADFooterWrapper>

  );
};

export default Footer;
