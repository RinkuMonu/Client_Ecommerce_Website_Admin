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
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  QuestionAnswer as FAQIcon,
} from "@mui/icons-material";
import { axiosInstance } from "../../../api/axiosInstance"; // same as newsletter

const FAQManager = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // For Delete confirmation
  const [deleteDialog, setDeleteDialog] = useState({ open: false, faq: null });

  // For Create/Edit dialog
  const [editDialog, setEditDialog] = useState({
    open: false,
    faq: { question: "", answer: "", category: "" },
    isEdit: false,
  });

  // Fetch FAQs
  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("api/faqs/all");
      setFaqs(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  // Create or Update FAQ
  const saveFAQ = async () => {
    try {
      if (editDialog.isEdit) {
        // update
        await axiosInstance.put(
          `api/faqs/${editDialog.faq._id}`,
          editDialog.faq
        );
        setSuccess("FAQ updated successfully");
      } else {
        // create
        await axiosInstance.post("api/faqs/create", editDialog.faq);
        setSuccess("FAQ created successfully");
      }
      fetchFAQs();
      setEditDialog({
        open: false,
        faq: { question: "", answer: "", category: "" },
        isEdit: false,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save FAQ");
    }
  };

  // Delete FAQ
  const deleteFAQ = async (id) => {
    try {
      await axiosInstance.delete(`api/faqs/${id}`);
      setSuccess("FAQ deleted successfully");
      fetchFAQs();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete FAQ");
    }
    setDeleteDialog({ open: false, faq: null });
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess("");
  };

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">FAQ Manager</Typography>
        <Box display="flex" gap={2}>
          <Chip label={`${faqs.length} FAQs`} color="primary" variant="outlined" />
          <Button
            variant="contained"
            onClick={() =>
              setEditDialog({
                open: true,
                faq: { question: "", answer: "", category: "" },
                isEdit: false,
              })
            }
          >
            Add FAQ
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search FAQs by question..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <FAQIcon color="action" sx={{ mr: 1 }} />,
          }}
        />
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Question</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Answer</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFaqs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    {searchTerm ? "No FAQs found" : "No FAQs yet"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredFaqs.map((faq) => (
                  <TableRow key={faq._id} hover>
                    <TableCell>{faq.question}</TableCell>
                    <TableCell>{faq.answer}</TableCell>
                    <TableCell>{faq.category || "General"}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          setEditDialog({ open: true, faq: { ...faq }, isEdit: true })
                        }
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => setDeleteDialog({ open: true, faq })}
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
        onClose={() => setDeleteDialog({ open: false, faq: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this FAQ:{" "}
            <strong>{deleteDialog.faq?.question}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, faq: null })}>
            Cancel
          </Button>
          <Button
            onClick={() => deleteFAQ(deleteDialog?.faq?._id)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={() =>
          setEditDialog({
            open: false,
            faq: { question: "", answer: "", category: "" },
            isEdit: false,
          })
        }
      >
        <DialogTitle>{editDialog.isEdit ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Question"
            value={editDialog.faq.question}
            onChange={(e) =>
              setEditDialog({ ...editDialog, faq: { ...editDialog.faq, question: e.target.value } })
            }
            fullWidth
          />
          <TextField
            label="Answer"
            value={editDialog.faq.answer}
            onChange={(e) =>
              setEditDialog({ ...editDialog, faq: { ...editDialog.faq, answer: e.target.value } })
            }
            fullWidth
            multiline
          />
          <TextField
            label="Category"
            value={editDialog.faq.category}
            onChange={(e) =>
              setEditDialog({ ...editDialog, faq: { ...editDialog.faq, category: e.target.value } })
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setEditDialog({
                open: false,
                faq: { question: "", answer: "", category: "" },
                isEdit: false,
              })
            }
          >
            Cancel
          </Button>
          <Button onClick={saveFAQ} variant="contained">
            {editDialog.isEdit ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbars */}
      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          {success}
        </Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FAQManager;
