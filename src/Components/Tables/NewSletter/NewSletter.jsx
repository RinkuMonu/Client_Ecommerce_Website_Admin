import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { Delete as DeleteIcon, Email as EmailIcon } from "@mui/icons-material";
import axios from "axios";
import { axiosInstance } from "../../../api/axiosInstance";
import { useParams } from "react-router";

// Create axios instance

const NewsletterManager = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    subscriber: null,
  });
  console.log(deleteDialog);

  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all subscribers
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("api/newsletter/allsubscribers");
      setSubscribers(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Delete subscriber
  const deleteSubscriber = async (id) => {
    try {
      await axiosInstance.delete(`api/newsletter/deleteSubscriber/${id}`);
      setSuccess("Subscriber deleted successfully");
      fetchSubscribers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete subscriber");
    }
    setDeleteDialog({ open: false, subscriber: null });
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess("");
  };

  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" gutterBottom>
          Newsletter Subscribers
        </Typography>
        <Chip
          label={`${subscribers.length} subscribers`}
          color="primary"
          variant="outlined"
        />
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search subscribers by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
          }}
        />
      </Paper>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="200px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Subscription Date
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSubscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                    {searchTerm ? "No subscribers found" : "No subscribers yet"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.email} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <EmailIcon color="action" sx={{ mr: 1 }} />
                        {subscriber.email}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(
                        subscriber.createdAt || subscriber.subscriptionDate
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="error"
                        onClick={() =>
                          setDeleteDialog({ open: true, subscriber })
                        }
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, subscriber: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove {deleteDialog.subscriber?.email}{" "}
            from the newsletter subscribers?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, subscriber: null })}
          >
            Cancel
          </Button>
          <Button
            onClick={() => deleteSubscriber(deleteDialog?.subscriber?._id)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbars */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {success}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NewsletterManager;
