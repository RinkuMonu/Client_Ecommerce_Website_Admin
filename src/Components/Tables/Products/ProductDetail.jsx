import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  Chip,
} from "@mui/material";

const ProductDetail = ({ open, onClose, data }) => {
  console.log(data, "data from product details");
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{ fontSize: 22, fontWeight: "medium", color: "#872d67" }}
      >
        Product Details
      </DialogTitle>
      <DialogContent>
        {data ? (
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              {data?.images?.map((item, index) => (
                <img
                  key={index}
                  src={`https://api.jajamblockprints.com${item}`}
                  alt={`Image ${index + 1}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    margin: "5px",
                  }}
                />
              ))}
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body1"
                fontWeight="bold"
                color="textSecondary"
              >
                Name :
              </Typography>
              <Typography variant="body1" sx={{ marginTop: 0.5 }}>
                {data?.productName}
              </Typography>
            </Grid>
            <Grid
              item
              xs={11}
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Typography
                variant="body1"
                fontWeight="bold"
                color="textSecondary"
              >
                Description:
              </Typography>
              <Typography variant="body1" sx={{ marginTop: 0.5 }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: data?.description || "No Description",
                  }}
                />
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body1"
                fontWeight="bold"
                color="textSecondary"
              >
                Price
              </Typography>
              <Typography variant="body1" sx={{ marginTop: 0.5 }}>
                {data?.price || "0"} &#8377;
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body1"
                fontWeight="bold"
                color="textSecondary"
              >
                Discount
              </Typography>
              <Typography variant="body1" sx={{ marginTop: 0.5 }}>
                {data?.discount || 0} %
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body1"
                fontWeight="bold"
                color="textSecondary"
              >
                Actual Price
              </Typography>
              <Typography variant="body1" sx={{ marginTop: 0.5 }}>
                {data?.actualPrice || 0} &#8377;
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" color="textSecondary" mb={2}>
                Available Sizes
              </Typography>
              {data?.size?.length > 0 ? (
                <Box sx={{ 
                  display: "flex", 
                  flexWrap: "wrap", 
                  gap: 1,
                  justifyContent: "center"
                }}>
                  {data.size.map((item) => (
                    <Chip
                      key={item._id}
                      label={`${item.sizes} - ₹${item.price}`}
                      variant="outlined"
                      color="primary"
                      sx={{ 
                        fontWeight: "bold",
                        borderWidth: 2,
                        minWidth: 100
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary" textAlign="center">
                  No sizes available
                </Typography>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body1"
                fontWeight="bold"
                color="textSecondary"
              >
                Product Category
              </Typography>
              <Typography variant="body1" sx={{ marginTop: 0.5 }}>
                {data?.category?.name || "Not available"}
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body1" color="textSecondary">
            No data available
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetail;
