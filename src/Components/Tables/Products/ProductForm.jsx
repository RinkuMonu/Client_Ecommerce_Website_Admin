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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import { apiPost, apiPut } from "../../../api/apiMethods";
import { EditNoteOutlined } from "@mui/icons-material";
import { useUser } from "../../../Context/UserContext";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { makeStyles } from "@mui/styles";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Checkbox, FormControlLabel } from "@mui/material";
const useStyles = makeStyles({
  selectInput: {
    minWidth: 200,
    fontSize: "14px",
  },
});

const ProductForm = ({ dataHandler, initialData, websites, addCategory }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [sizes, setSizes] = useState([{ sizes: "", price: 0 }]);
  const [discount, setDiscount] = useState(0);
  const [referenceWebsite, setReferenceWebsite] = useState("");
  const [category, setCategory] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [material, setMaterial] = useState("");
  const [inStock, setInStock] = useState(0);
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryPreview, setCategoryPreview] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [subcategory, setSubCategory] = useState("");
  const { user, categories } = useUser();

  useEffect(() => {
    if (initialData) {
      setProductName(initialData?.productName || "");
      setDescription(initialData.description || "");
      setPrice(initialData?.price || 0);
      setSizes(
        Array.isArray(initialData?.size) && initialData.size.length > 0
          ? initialData.size.map((item) => ({
              sizes: item.sizes || "",
              price: item.price || 0,
            }))
          : [{ sizes: "", price: 0 }]
      );
      setDiscount(initialData?.discount || 0);
      setReferenceWebsite(initialData?.referenceWebsite || "");
      setCategory(initialData?.category?._id || "");
      setMaterial(initialData?.material || "");
      setPreviewImages(
        initialData?.images?.map(
          (img) => `https://api.jajamblockprints.com${img}`
        ) || []
      );
      setInStock(initialData?.inStock || 0);
    } else {
      resetForm();
    }
  }, [initialData]);

  useEffect(() => {
    if (user && !initialData) {
      setReferenceWebsite(user.referenceWebsite || "");
    }
  }, [user, initialData]);

  const resetForm = () => {
    setProductName("");
    setDescription("");
    setPrice(0);
    setSizes([{ sizes: "", price: 0 }]);
    setDiscount(0);
    setReferenceWebsite("");
    setCategory("");
    setSubCategory("");
    setMaterial("");
    setImageFiles([]);
    setPreviewImages([]);
    setCategoryImage(null);
    setCategoryPreview("");
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleCategoryImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      setCategoryPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const cleanedSizes = Array.isArray(sizes)
      ? sizes.filter((s) => s.sizes.trim() !== "" && s.price > 0)
      : [];

    if (
      (!addCategory &&
        (!productName ||
          !description ||
          (!initialData && imageFiles.length === 0) ||
          // !price ||
          !referenceWebsite ||
          !category)) ||
      (addCategory && (!productName || !categoryImage))
    ) {
      setSnackbarMessage("Please fill all required fields");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();

    if (addCategory) {
      formData.append("name", productName);
      formData.append("subcategory", subcategory);
      if (description) formData.append("description", description);
      if (referenceWebsite)
        formData.append("referenceWebsite", referenceWebsite);
      formData.append("images", categoryImage);
    } else {
      formData.append("productName", productName);
      formData.append("description", description);
      formData.append("price", price);
      formData.append(
        "actualPrice",
        ((price * (100 - discount)) / 100).toFixed(2)
      );
      formData.append("discount", discount);
      formData.append("size", JSON.stringify(cleanedSizes));
      formData.append("referenceWebsite", referenceWebsite);
      formData.append("category", category);
      formData.append("material", material);
      formData.append("stock", inStock);

      imageFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    try {
      const response = initialData
        ? await apiPut(`api/product/products/${initialData._id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : addCategory
        ? await apiPost("api/categories", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await apiPost("api/product/products", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      if (response.status === 200) {
        setSnackbarMessage(
          addCategory
            ? "Category created successfully"
            : "Product saved successfully"
        );
        setSnackbarSeverity("success");
        setOpen(false);
        dataHandler();
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Failed to save");
      setSnackbarSeverity("error");
    }

    setSnackbarOpen(true);
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const [groupedCategories, setGroupedCategories] = useState({});

  useEffect(() => {
    const referenceWebsite = "686f69980a9e01743e29bd4c";
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `https://api.jajamblockprints.com/api/website/${referenceWebsite}`
        );
        const data = await res.json();

        // Group items by subcategory
        const grouped = {};
        if (Array.isArray(data?.website?.categories)) {
          data?.website?.categories.forEach((item) => {
            const sub = item?.subcategory;
            if (!grouped[sub]) grouped[sub] = [];
            grouped[sub].push(item);
          });
        }
        console.log(grouped);

        setGroupedCategories(grouped);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, [referenceWebsite]);

  return (
    <div>
      {initialData ? (
        <IconButton onClick={handleClickOpen}>
          <EditNoteOutlined />
        </IconButton>
      ) : user && (user.role === "admin" || user.role === "vendor") ? (
        <Button sx={{ px: 2, py: 1 }} color="primary" onClick={handleClickOpen}>
          <AddIcon /> {addCategory ? "Add Category" : "New Product"}
        </Button>
      ) : null}

      <Dialog
        open={open}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: { width: "900px", maxWidth: "90vw" },
        }}
        onClose={handleClose}
      >
        <DialogTitle sx={{ color: "#872d67" }}>
          {initialData
            ? "Update Product"
            : addCategory
            ? "Add Category"
            : "New Product"}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ width: "100%" }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={addCategory ? "Category Name" : "Product Name"}
                variant="outlined"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Grid>

            {addCategory && (
              <>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="subcategory-label">
                      Add Sub Category
                    </InputLabel>
                    <Select
                      labelId="subcategory-label"
                      value={subcategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                    >
                      {Object.keys(groupedCategories).map((key) => (
                        <MenuItem key={key} value={key}>
                          {key}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description (optional)"
                    variant="outlined"
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
                  {categoryPreview && (
                    <img
                      src={categoryPreview}
                      alt="category-preview"
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 4,
                        marginTop: 8,
                      }}
                    />
                  )}
                </Grid>
              </>
            )}

            {!addCategory && (
              <>
                <Grid item xs={12}>
                  <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={(value) => setDescription(value)}
                    placeholder="Enter product description..."
                    style={{ background: "#fff", borderRadius: 4 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ marginTop: 8 }}
                  />
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    {previewImages.map((img, idx) => (
                      <Grid item key={idx}>
                        <img
                          src={img}
                          alt={`preview-${idx}`}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Price"
                    variant="outlined"
                    type="number"
                    inputProps={{ min: 0 }}
                    value={price}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setPrice(value >= 0 ? value : 0);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Material"
                    variant="outlined"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <strong>Sizes & Prices</strong>
                </Grid>

                {Array.isArray(sizes) &&
                  sizes.map((item, index) => (
                    <Grid
                      container
                      spacing={1}
                      key={index}
                      alignItems="center"
                      sx={{ mb: 1 }}
                      style={{ marginLeft: "10px" }}
                    >
                      <Grid item xs={5}>
                        <TextField
                          fullWidth
                          label="Size"
                          variant="outlined"
                          value={item.sizes}
                          onChange={(e) => {
                            const updated = [...sizes];
                            updated[index].sizes = e.target.value;
                            setSizes(updated);
                          }}
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <TextField
                          fullWidth
                          label="Price"
                          variant="outlined"
                          type="number"
                          value={item.price}
                          onChange={(e) => {
                            const updated = [...sizes];
                            updated[index].price = Number(e.target.value);
                            setSizes(updated);
                          }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton
                          onClick={() => {
                            if (index === sizes.length - 1) {
                              setSizes([...sizes, { sizes: "", price: 0 }]);
                            } else {
                              const filtered = sizes.filter(
                                (_, i) => i !== index
                              );
                              setSizes(
                                filtered.length
                                  ? filtered
                                  : [{ sizes: "", price: 0 }]
                              );
                            }
                          }}
                        >
                          {index === sizes.length - 1 ? (
                            <AddIcon />
                          ) : (
                            <DeleteIcon />
                          )}
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Discount (%)"
                    variant="outlined"
                    type="number"
                    inputProps={{ min: 0 }}
                    value={discount}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setDiscount(value >= 0 ? value : 0);
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Stock Quantity"
                      variant="outlined"
                      type="number"
                      inputProps={{ min: 0 }}
                      value={inStock}
                      onChange={(e) => setInStock(Number(e.target.value))}
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
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

export default ProductForm;
