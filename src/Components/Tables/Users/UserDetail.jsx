// import React from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid } from '@mui/material';

// const UserDetail = ({ open, onClose, data }) => {
//     return (
//         <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//             <DialogTitle sx={{ fontSize: 22, fontWeight: 'medium' }}>User Details</DialogTitle>
//             <DialogContent>
//                 {data ? (
//                     <Grid container spacing={2}>
//                         <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <Typography variant="body1" fontWeight="bold" color="textSecondary">
//                                 Name :
//                             </Typography>
//                             <Typography variant="body1" sx={{ marginTop: 0.5 }}>
//                                 {data.firstName + ' ' + data.lastName}
//                             </Typography>
//                         </Grid>
//                         <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <Typography variant="body1" fontWeight="bold" color="textSecondary">
//                                 Email
//                             </Typography>
//                             <Typography variant="body1" sx={{ marginTop: 0.5 }}>
//                                 {data.email || ""}
//                             </Typography>
//                         </Grid>
//                         <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <Typography variant="body1" fontWeight="bold" color="textSecondary">
//                                 Mobile
//                             </Typography>
//                             <Typography variant="body1" sx={{ marginTop: 0.5 }}>
//                                 {data.mobile || ''}
//                             </Typography>
//                         </Grid>
//                         <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <Typography variant="body1" fontWeight="bold" color="textSecondary">
//                                 Address
//                             </Typography>
//                             <Typography
//                                 variant="body1"
//                                 sx={{ marginTop: 0.5 }}
//                             >
//                                 {data.address || ""}
//                             </Typography>
//                         </Grid>
//                         <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <Typography variant="body1" fontWeight="bold" color="textSecondary">
//                                 Role
//                             </Typography>
//                             <Typography
//                                 variant="body1"
//                                 sx={{ marginTop: 0.5 }}
//                             >
//                                 {data.role || ""} 
//                             </Typography>
//                         </Grid>
//                     </Grid>
//                 ) : (
//                     <Typography variant="body1" color="textSecondary">
//                         No data available
//                     </Typography>
//                 )}
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={onClose} color="primary" variant="contained">
//                     Close
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// export default UserDetail;




import React from 'react';
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
    Divider,
    List,
    ListItem,
    ListItemText,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const UserDetail = ({ open, onClose, data }) => {
    const getSegmentColor = (segment) => {
        switch (segment) {
            case 'loyal': return 'success';
            case 'high-value': return 'primary';
            case 'new': return 'warning';
            default: return 'default';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ fontSize: 22, fontWeight: 'medium' }}>
                User Details: {data ? `${data.firstName} ${data.lastName}` : ''}
            </DialogTitle>
            <DialogContent>
                {data ? (
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                Name
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 0.5, mb: 2 }}>
                                {data.firstName + ' ' + data.lastName}
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                Email
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 0.5, mb: 2 }}>
                                {data.email || "N/A"}
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                Mobile
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 0.5, mb: 2 }}>
                                {data.mobile || 'N/A'}
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                Customer Segment
                            </Typography>
                            <Box sx={{ marginTop: 0.5, mb: 2 }}>
                                <Chip 
                                    label={data.segment || 'regular'} 
                                    color={getSegmentColor(data.segment)}
                                />
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                Total Orders
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 0.5, mb: 2 }}>
                                {data.orderCount || 0}
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                Total Spent
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 0.5, mb: 2 }}>
                                ₹{data.totalSpent?.toLocaleString() || 0}
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                Role
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 0.5, mb: 2 }}>
                                {data.role || "N/A"} 
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                Company
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 0.5, mb: 2 }}>
                                {data.company || "N/A"} 
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                        </Grid>
                        
                        {data.address && (
                            <Grid item xs={12}>
                                <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                    Address
                                </Typography>
                                <Typography variant="body1" sx={{ marginTop: 0.5, mb: 2 }}>
                                    {data.address}
                                </Typography>
                            </Grid>
                        )}
                        
                        {data.savedAddresses && data.savedAddresses.length > 0 && (
                            <Grid item xs={12}>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography fontWeight="bold">Saved Addresses ({data.savedAddresses.length})</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <List dense>
                                            {data.savedAddresses.map((address, index) => (
                                                <ListItem key={index} divider>
                                                    <ListItemText 
                                                        primary={address.address} 
                                                        secondary={`${address.state}, ${address.country} - ${address.pinCode}`}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        )}
                        
                        {data.orders && data.orders.length > 0 && (
                            <Grid item xs={12}>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography fontWeight="bold">Order History ({data.orders.length})</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <List dense>
                                            {data.orders.slice(0, 5).map((order, index) => (
                                                <ListItem key={index} divider>
                                                    <ListItemText 
                                                        primary={`Order #${order._id}`}
                                                        secondary={
                                                            <>
                                                                <Typography variant="body2">
                                                                    Date: {formatDate(order.createdAt)}
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    Status: {order.status} | Payment: {order.paymentStatus}
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    Amount: ₹{order.totalAmount?.toLocaleString()}
                                                                </Typography>
                                                            </>
                                                        }
                                                    />
                                                </ListItem>
                                            ))}
                                            {data.orders.length > 5 && (
                                                <ListItem>
                                                    <Typography variant="body2" color="primary">
                                                        ...and {data.orders.length - 5} more orders
                                                    </Typography>
                                                </ListItem>
                                            )}
                                        </List>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        )}
                        
                        {data.wishlistItems && data.wishlistItems.length > 0 && (
                            <Grid item xs={12}>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography fontWeight="bold">Wishlist Items ({data.wishlistItems.length})</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="body2">
                                            User has {data.wishlistItems.length} items in their wishlist.
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        )}
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

export default UserDetail;