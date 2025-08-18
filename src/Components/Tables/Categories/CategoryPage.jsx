import { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  IconButton,
  Box,
} from "@mui/material";
import { DeleteForeverOutlined, EditNoteOutlined } from "@mui/icons-material";

import DeleteDialog from "../Website/DeleteDialog";
import CategoryForm from "./CategoryForm";
import { apiDelete, apiGet } from "../../../api/apiMethods";

const CategoryPage = () => {
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const fetchData = async () => {
    try {
      const response = await apiGet("api/categories");
      if (Array.isArray(response.data)) setData(response.data);
      else console.error("Data is not an array:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteHandler = async (id) => {
    try {
      const response = await apiDelete(`api/categories/${id}`);
      if (response.status === 200) fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const openDialog = (id) => {
    setSelectedItemId(id);
    setDialogOpen(true);
  };
  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedItemId(null);
  };

  return (
    <>
      <Box sx={{ mb: 4, mt: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Product Categories
        </Typography>
        <CategoryForm dataHandler={fetchData} categories={data} />
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Parent Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  No data available.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={item._id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    {item.image ? (
                      <img
                        src={`https://api.jajamblockprints.com${item.image}`}
                        alt={item.name || "category-image"}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </TableCell>

                  <TableCell>{item.subcategory || "—"}</TableCell>
                  <TableCell>{item.description || "NA"}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        onClick={() => openDialog(item._id)}
                        size="small"
                        color="error"
                      >
                        <DeleteForeverOutlined fontSize="small" />
                      </IconButton>
                      <CategoryForm
                        dataHandler={fetchData}
                        categories={data}
                        initialData={item}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <DeleteDialog
        deleteHandler={deleteHandler}
        itemId={selectedItemId}
        open={dialogOpen}
        onClose={closeDialog}
      />
    </>
  );
};

export default CategoryPage;
