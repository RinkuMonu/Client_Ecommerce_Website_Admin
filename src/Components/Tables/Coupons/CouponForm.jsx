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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { EditNoteOutlined, Close } from "@mui/icons-material";
import { useUser } from "../../../Context/UserContext";
import { apiPost, apiPut } from "../../../api/apiMethods";

const CouponForm = ({ dataHandler, initialData, fetchCoupons }) => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState(0);
  const [minOrderAmount, setMinOrderAmount] = useState(0);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [usageLimit, setUsageLimit] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [applicableProducts, setApplicableProducts] = useState("all");
  const [productIds, setProductIds] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const { user } = useUser();

  // Convert ISO date to YYYY-MM-DD format for date inputs
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (initialData) {
      setCode(initialData.code || "");
      setDiscountType(initialData.discountType || "percentage");
      setDiscountValue(initialData.discountValue || 0);
      setMinOrderAmount(initialData.minOrderAmount || 0);
      setMaxDiscountAmount(initialData.maxDiscountAmount || null);
      setStartDate(formatDateForInput(initialData.startDate));
      setEndDate(formatDateForInput(initialData.endDate));
      setUsageLimit(initialData.usageLimit || null);
      setIsActive(initialData.isActive !== false);
      setApplicableProducts(initialData.applicableProducts || "all");
      setProductIds(initialData.productIds || []);
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setCode("");
    setDiscountType("percentage");
    setDiscountValue(0);
    setMinOrderAmount(0);
    setMaxDiscountAmount(null);
    setStartDate("");
    setEndDate("");
    setUsageLimit(null);
    setIsActive(true);
    setApplicableProducts("all");
    setProductIds([]);
  };

  const handleSubmit = async () => {
    if (!code || !discountType || !discountValue || !startDate || !endDate) {
      setSnackbarMessage("Please fill all required fields");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setSnackbarMessage("End date must be after start date");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const couponData = {
      code,
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount),
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      usageLimit: usageLimit ? Number(usageLimit) : null,
      isActive,
      applicableProducts,
      productIds,
      referenceWebsite: user?.referenceWebsite || "",
    };

    try {
      const response = initialData
        ? await apiPut(`api/coupons/${initialData._id}`, couponData)
        : await apiPost("api/coupons", couponData);

      if (response.status === 200 || response.status === 201) {
        setSnackbarMessage(response?.data?.message);
        setSnackbarSeverity("success");
        setOpen(false);
        if (dataHandler) dataHandler();
        if (typeof fetchCoupons === "function") fetchCoupons();
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage(error.response?.data?.message || "Request failed");
      setSnackbarSeverity("error");
    }

    setSnackbarOpen(true);
  };

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
          New Coupon
        </Button>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {initialData ? "Update" : "Create New"} Coupon
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} pt={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Coupon Code*"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Discount Type*</InputLabel>
                <Select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  required
                >
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="fixed">Fixed Amount</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={`Discount Value (${
                  discountType === "percentage" ? "%" : "₹"
                })*`}
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Order Amount"
                type="number"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value)}
              />
            </Grid>

            {discountType === "percentage" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Maximum Discount Amount"
                  type="number"
                  value={maxDiscountAmount || ""}
                  onChange={(e) => setMaxDiscountAmount(e.target.value || null)}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date*"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date*"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Usage Limit (leave blank for unlimited)"
                type="number"
                value={usageLimit || ""}
                onChange={(e) => setUsageLimit(e.target.value || null)}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    color="primary"
                  />
                }
                label="Active Coupon"
              />
            </Grid>

            {/* <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Applicable To</InputLabel>
                <Select
                  value={applicableProducts}
                  onChange={(e) => setApplicableProducts(e.target.value)}
                >
                  <MenuItem value="all">All Products</MenuItem>
                  <MenuItem value="specific">Specific Products</MenuItem>
                  <MenuItem value="category">Product Categories</MenuItem>
                </Select>
              </FormControl>
            </Grid> */}

            {applicableProducts === "specific" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product IDs (comma separated)"
                  value={productIds.join(",")}
                  onChange={(e) =>
                    setProductIds(
                      e.target.value.split(",").map((id) => id.trim())
                    )
                  }
                  placeholder="123, 456, 789"
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {initialData ? "Update" : "Create"} Coupon
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

export default CouponForm;
