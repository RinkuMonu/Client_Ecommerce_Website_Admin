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
  Chip,
} from "@mui/material";
import { DeleteForeverOutlined, EditNoteOutlined } from "@mui/icons-material";
import DeleteDialog from "../Website/DeleteDialog";
import CouponForm from "./CouponForm";
import { apiDelete, apiGet } from "../../../api/apiMethods";

const CouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState(null);

  const fetchCoupons = async () => {
    try {
      const response = await apiGet("api/coupons");
      // console.log(response?.data,"dfghuji")
      if (Array.isArray(response?.data?.data)) setCoupons(response.data?.data);
      else console.error("Data is not an array:", response.data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const deleteHandler = async (id) => {
    try {
      const response = await apiDelete(`api/coupons/${id}`);
      if (response.status === 200) fetchCoupons();
    } catch (error) {
      console.error(error);
    }
  };

  const openDeleteDialog = (id) => {
    setSelectedCouponId(id);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedCouponId(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return "Scheduled";
    if (now > end) return "Expired";
    return "Active";
  };

  return (
    <>
      <Box sx={{ mb: 4, mt: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Coupon Management
        </Typography>
        <CouponForm dataHandler={fetchCoupons} />
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Discount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Min. Order</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Valid Dates</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Usage Limit</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  No coupons available.
                </TableCell>
              </TableRow>
            ) : (
              coupons?.map((coupon, index) => {
                const status = getStatus(coupon.startDate, coupon.endDate);
                return (
                  <TableRow key={coupon._id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Typography fontWeight={500}>{coupon.code}</Typography>
                    </TableCell>
                    <TableCell>
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`}
                      {coupon.maxDiscountAmount && 
                        coupon.discountType === "percentage" && (
                          <Typography variant="caption" display="block">
                            (Max: ₹{coupon.maxDiscountAmount})
                          </Typography>
                        )}
                    </TableCell>
                    <TableCell>
                      {coupon.minOrderAmount > 0 
                        ? `₹${coupon.minOrderAmount}` 
                        : "None"}
                    </TableCell>
                    <TableCell>
                      {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
                    </TableCell>
                    <TableCell>
                      {coupon.usageLimit || "Unlimited"}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={status}
                        color={
                          status === "Active" ? "success" : 
                          status === "Expired" ? "error" : "warning"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          onClick={() => openDeleteDialog(coupon._id)}
                          size="small"
                          color="error"
                        >
                          <DeleteForeverOutlined fontSize="small" />
                        </IconButton>
                        <CouponForm
                          dataHandler={fetchCoupons}
                          initialData={coupon}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <DeleteDialog
        deleteHandler={deleteHandler}
        itemId={selectedCouponId}
        open={dialogOpen}
        onClose={closeDialog}
        title="Delete Coupon"
        message="Are you sure you want to delete this coupon? This action cannot be undone."
      />
    </>
  );
};

export default CouponPage;