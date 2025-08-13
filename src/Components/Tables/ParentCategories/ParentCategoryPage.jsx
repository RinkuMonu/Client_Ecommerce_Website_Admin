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
  IconButton,
  Box,
} from "@mui/material";
import { DeleteForeverOutlined, EditNoteOutlined } from "@mui/icons-material";
import { Button, Modal, Form, Input, message } from "antd";

import DeleteDialog from "../Website/DeleteDialog";
import { apiDelete, apiGet, apiPost } from "../../../api/apiMethods";

const ParentCategoryPage = () => {
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      const response = await apiGet("api/categories/getMainCategory");
      setData(response.data);
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
      if (response.status === 200) {
        message.success("Category deleted successfully");
        fetchData();
      }
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

  // Handle Add New Category
  const openAddModal = () => {
    setIsEditMode(false);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Handle Edit Category
  const openEditModal = (item) => {
    setIsEditMode(true);
    form.setFieldsValue({
      id: item.id,
      subcategory: item.subcategory,
    });
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);

      if (isEditMode) {
        // Update existing category
        await apiPost("api/categories/updateMainCategory", values);
        message.success("Category updated successfully");
      } else {
        // Create new category
        await apiPost("api/categories/createMainCategory", {
          subcategory: values.subcategory,
        });
        message.success("Category created successfully");
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      message.error(error.response.data.message);
    }
  };

  return (
    <>
      <Box sx={{ mb: 4, mt: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Product Categories
        </Typography>
        <Button
          type="primary"
          variant="contained"
          color="primary"
          onClick={openAddModal}
        >
          Add New Category
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  No data available.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={item.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.subcategory}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        onClick={() => openDialog(item.id)}
                        size="small"
                        color="error"
                      >
                        <DeleteForeverOutlined fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => openEditModal(item)}
                      >
                        <EditNoteOutlined fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Dialog */}
      <DeleteDialog
        deleteHandler={deleteHandler}
        itemId={selectedItemId}
        open={dialogOpen}
        onClose={closeDialog}
      />

      {/* Add/Edit Modal */}
      <Modal
        title={isEditMode ? "Edit Category" : "Add New Category"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText={isEditMode ? "Update" : "Create"}
      >
        <Form form={form} layout="vertical">
          {isEditMode && (
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
          )}
          <Form.Item
            name="subcategory"
            label="Category Name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ParentCategoryPage;
