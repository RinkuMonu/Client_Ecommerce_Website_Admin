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
  Box,
} from "@mui/material";
import { apiPost, apiPut } from "../../../api/apiMethods";
import { EditNoteOutlined, Close } from "@mui/icons-material";
import { useUser } from "../../../Context/UserContext";

const CategoryForm = ({ dataHandler, initialData, categories }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategory, setParentCategory] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [categoryImage, setCategoryImage] = useState([]);
  const [categoryPreview, setCategoryPreview] = useState([]);
  const [hasExistingImage, setHasExistingImage] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setParentCategory(initialData.subcategory || "");
      
      if (initialData.image) {
        const imageUrl = `https://api.jajamblockprints.com${initialData.image}`;
        if (categoryPreview.length === 0) {
          setCategoryPreview([imageUrl]);
          setHasExistingImage(true);
        }
      }
    } else {
      setName("");
      setDescription("");
      setParentCategory("");
      setCategoryPreview([]);
      setCategoryImage([]);
      setHasExistingImage(false);
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

    // Handle image upload
    if (categoryImage.length > 0) {
      // If new images are selected, append them
      categoryImage.forEach((file) => {
        formData.append("images", file);
      });
    } else if (hasExistingImage && initialData?.image) {
      // If no new images but existing image should be preserved
      formData.append("image", initialData.image);
    } else {
      // If explicitly removing all images
      formData.append("image", "");
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
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    setCategoryImage(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setCategoryPreview(previews);
    setHasExistingImage(false);
  };

  const handleRemoveImage = (index) => {
    setCategoryImage((prev) => prev.filter((_, i) => i !== index));
    setCategoryPreview((prev) => prev.filter((_, i) => i !== index));
    
    // If we're removing the existing image (not a newly uploaded one)
    if (initialData?.image && categoryPreview[index] === `https://api.jajamblockprints.com${initialData.image}`) {
      setHasExistingImage(false);
    }
  };

  const [groupedCategories, setGroupedCategories] = useState([]);

  useEffect(() => {
    if (!user?.referenceWebsite) return;
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `https://api.jajamblockprints.com/api/categories/getMainCategory`
        );
        const data = await res.json();
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
                id="category-image-upload"
                hidden
              />
              <label htmlFor="category-image-upload">
                <Button variant="contained" component="span">
                  Upload Image
                </Button>
              </label>
            </Grid>

            {categoryPreview.length > 0 && (
              <Grid
                item
                xs={12}
                sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}
              >
                {categoryPreview.map((preview, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      width: "120px",
                      height: "120px",
                      border: "1px dashed #ccc",
                      borderRadius: "4px",
                      overflow: "hidden",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={preview}
                      alt={`Category preview ${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <IconButton
                      onClick={() => handleRemoveImage(index)}
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(0,0,0,0.7)",
                        },
                      }}
                    >
                      <Close />
                    </IconButton>
                  </Box>
                ))}
              </Grid>
            )}

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