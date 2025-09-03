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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { EditNoteOutlined } from "@mui/icons-material";
import { useUser } from "../../../Context/UserContext";
import { apiPost, apiPut } from "../../../api/apiMethods";

const CouponForm = ({ dataHandler, initialData, fetchCoupons }) => {
  const [open, setOpen] = useState(false);

  // form states
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState(0);
  const [usageLimit, setUsageLimit] = useState(1);
  const [perUserLimit, setPerUserLimit] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [minimumOrderValue, setMinimumOrderValue] = useState(""); // optional
  const [isActive, setIsActive] = useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const { user } = useUser();

  // format date for input[type=date]
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return "";
    return new Date(isoDate).toISOString().split("T")[0];
  };

  // load initial data for update
  useEffect(() => {
    if (initialData) {
      setCode(initialData.code || "");
      setDiscountType(initialData.discountType || "percentage");
      setDiscountValue(initialData.discountValue || 0);
      setUsageLimit(initialData.usageLimit || 1);
      setPerUserLimit(initialData.perUserLimit || 1);
      setStartDate(formatDateForInput(initialData.startDate));
      setExpiryDate(formatDateForInput(initialData.expiryDate));
      setMinimumOrderValue(initialData.minimumOrderValue || "");
      setIsActive(initialData.isActive !== false);
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setCode("");
    setDiscountType("percentage");
    setDiscountValue(0);
    setUsageLimit(1);
    setPerUserLimit(1);
    setStartDate("");
    setExpiryDate("");
    setMinimumOrderValue("");
    setIsActive(true);
  };

  // submit handler
  const handleSubmit = async () => {
    if (!code || !discountType || !discountValue || !startDate || !expiryDate) {
      setSnackbarMessage("Please fill all required fields");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const couponData = {
      code,
      discountType,
      discountValue: Number(discountValue),
      usageLimit: usageLimit ? Number(usageLimit) : 1,
      perUserLimit: perUserLimit ? Number(perUserLimit) : 1,
      startDate: new Date(startDate).toISOString(),
      expiryDate: new Date(expiryDate).toISOString(),
      minimumOrderValue: minimumOrderValue ? Number(minimumOrderValue) : 0,
      isActive,
      referenceWebsite: user?.referenceWebsite || "",
    };

    try {
      const response = initialData
        ? await apiPut(`api/coupons/${initialData._id}`, couponData)
        : await apiPost("api/coupons", couponData);

      if (response.status === 200 || response.status === 201) {
        setSnackbarMessage(
          response?.data?.message || "Coupon saved successfully"
        );
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
                type="text"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Usage Limit"
                type="text"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Per User Limit"
                type="text"
                value={perUserLimit}
                onChange={(e) => setPerUserLimit(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Order Value (optional)"
                type="text"
                value={minimumOrderValue}
                onChange={(e) => setMinimumOrderValue(e.target.value)}
              />
            </Grid>

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
                label="Expiry Date*"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
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
