import { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
  Snackbar,
  SnackbarContent,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { apiPost, apiPut } from "../../../api/apiMethods";
import { EditNoteOutlined } from "@mui/icons-material";
import { useUser } from "../../../Context/UserContext";

const CategoryForm = ({ dataHandler, initialData, categories }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategory, setParentCategory] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [categoryImage, setCategoryImage] = useState(null);

  const { user } = useUser();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setParentCategory(initialData.subcategory || "");
    } else {
      setName("");
      setDescription("");
      setParentCategory("");
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!name) {
      setSnackbarMessage("Please fill all required fields");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("subcategory", parentCategory || "");
    formData.append("referenceWebsite", user?.referenceWebsite || "");

    if (categoryImage) {
      formData.append("images", categoryImage); // ✅ use "images"
    }

    // ✅ optional: debug payload
    for (let pair of formData.entries()) {
      console.log(pair[0] + ":", pair[1]);
    }

    try {
      const response = initialData
        ? await apiPut(`api/categories/${initialData._id}`, formData)
        : await apiPost("api/categories", formData);

      if (response.status === 200) {
        setSnackbarMessage("Saved successfully");
        setSnackbarSeverity("success");
        setOpen(false);
        dataHandler();
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Request failed");
      setSnackbarSeverity("error");
    }

    setSnackbarOpen(true);
  };

  const handleCategoryImageUpload = (e) => {
    const file = e.target.files[0];
    console.log(file, "category image files");
    if (file) {
      setCategoryImage(file);
      setCategoryPreview(URL.createObjectURL(file));
    }
    console.log(categoryImage, "category image");
  };

  const [groupedCategories, setGroupedCategories] = useState([]);

  useEffect(() => {
    if (!user?.referenceWebsite) return;
    // const referenceWebsite = "686f69980a9e01743e29bd4c";
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `https://api.jajamblockprints.com/api/categories/getMainCategory`
        );
        const data = await res.json();

        // Group items by subcategory
        // const grouped = {};
        // if (Array.isArray(data?.website?.categories)) {
        //   data?.website?.categories.forEach((item) => {
        //     const sub = item?.subcategory;
        //     if (!grouped[sub]) grouped[sub] = [];
        //     grouped[sub].push(item);
        //   });
        // }

        setGroupedCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, [user?.referenceWebsite]);

  return (
    <div>
      {initialData ? (
        <IconButton onClick={() => setOpen(true)}>
          <EditNoteOutlined />
        </IconButton>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          New Category
        </Button>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{initialData ? "Update" : "New"} Category</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} pt={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <input
                type="file"
                accept="image/*"
                onChange={handleCategoryImageUpload}
                style={{ marginTop: 8 }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Parent Category</InputLabel>
                <Select
                  value={parentCategory}
                  onChange={(e) => setParentCategory(e.target.value)}
                  displayEmpty
                >
                  {groupedCategories?.map((item) => (
                    <MenuItem key={item.id} value={item.subcategory}>
                      {item.subcategory}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
      >
        <SnackbarContent
          message={snackbarMessage}
          style={{
            backgroundColor: snackbarSeverity === "success" ? "green" : "red",
          }}
        />
      </Snackbar>
    </div>
  );
};

export default CategoryForm;
