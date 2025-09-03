import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { apiPut, apiGet } from "../../../api/apiMethods";

const OfferDialog = ({
  open,
  onClose,
  productId,
  initialDiscount = 0,
  onSuccess,
}) => {
  const [discount, setDiscount] = useState(initialDiscount);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState("");

  console.log(coupons);
  useEffect(() => {
    if (open) {
      setDiscount(initialDiscount);
      setSelectedCoupon("");
    }
  }, [open, initialDiscount]);

  const fetchCoupons = async () => {
    try {
      const response = await apiGet("api/coupons");
      // console.log(response.data.coupons);
      
      if (Array.isArray(response?.data?.coupons)) {
        setCoupons(response?.data?.coupons);
      } else {
        console.error("Data is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCoupons();
    }
  }, [open]);

  const handleSave = async () => {
    try {
      await apiPut(`api/product/apply-coupon/${productId}`, {
        couponId: selectedCoupon || null,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update offer:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Set Product Offer</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Apply a coupon to this product.
        </Typography>

        {/* Discount field
        <TextField
          type="number"
          fullWidth
          label="Discount (%)"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          inputProps={{ min: 0, max: 100 }}
          sx={{ mb: 2 }}
        /> */}

        {/* Coupon dropdown */}
        <FormControl fullWidth>
          <InputLabel id="coupon-select-label">Coupon</InputLabel>
          <Select
            labelId="coupon-select-label"
            value={selectedCoupon}
            onChange={(e) => setSelectedCoupon(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            {coupons.map((coupon) => (
              <MenuItem key={coupon?._id} value={coupon?._id}>
                {coupon?.code} - {coupon?.discountValue}% OFF
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OfferDialog;
