// import React from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid } from '@mui/material';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// const OrderDetail = ({ open, onClose, data }) => {
//     return (
//         <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//             <DialogTitle sx={{ fontSize: 22, fontWeight: 'medium' }}>Order Details</DialogTitle>
//             <DialogContent>
//                 {data ? (
//                     <Grid container spacing={2}>
//                         <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <Typography variant="body1" fontWeight="bold" color="textSecondary">
//                                 Customer Name :
//                             </Typography>
//                             <Typography variant="body1" sx={{ marginTop: 0.5 }}>
//                                 {data.customer?.firstName} {data.customer?.lastName}
//                             </Typography>
//                         </Grid>
//                         <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <Typography variant="body1" fontWeight="bold" color="textSecondary">
//                                 Customer Email
//                             </Typography>
//                             <Typography variant="body1" sx={{ marginTop: 0.5 }}>
//                                 {data.customer?.email}
//                             </Typography>
//                         </Grid>
//                         <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <Typography variant="body1" fontWeight="bold" color="textSecondary">
//                                 Payment Status
//                             </Typography>
//                             <Typography variant="body1" sx={{ marginTop: 0.5 }}>
//                                 {data.paymentStatus}
//                             </Typography>
//                         </Grid>
//                         <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <Typography variant="body1" fontWeight="bold" color="textSecondary">
//                                 Order Status
//                             </Typography>
//                             <Typography variant="body1" sx={{ marginTop: 0.5 }}>
//                                 {data.status}
//                             </Typography>
//                         </Grid>
//                         <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <Typography variant="body1" fontWeight="bold" color="textSecondary">
//                                 Order Amount
//                             </Typography>
//                             <Typography variant="body1" sx={{ marginTop: 0.5 }}>
//                                 {data.totalAmount} &#8377;
//                             </Typography>
//                         </Grid>
//                         <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <Typography variant="body1" fontWeight="bold" color="textSecondary">
//                                 Ordered Website
//                             </Typography>
//                             <Typography variant="body1" sx={{ marginTop: 0.5 }}>
//                                 {data.referenceWebsite?.websiteName}
//                             </Typography>
//                         </Grid>
//                         <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <Typography variant="body1" fontWeight="bold" color="textSecondary">
//                                 Order Date
//                             </Typography>
//                             <Typography variant="body1" sx={{ marginTop: 0.5 }}>
//                                 {new Date(data.createdAt).toLocaleString()}
//                             </Typography>
//                         </Grid>
//                         <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <Typography variant="body1" fontWeight="bold" color="textSecondary">
//                                 Shipping Address
//                             </Typography>
//                             <Typography variant="body1" sx={{ marginTop: 0.5 }}>
//                                 {`${data.shippingAddress?.address} ${data.shippingAddress?.state}, ${data.shippingAddress?.country}   ${data.shippingAddress?.pinCode}  `}
//                             </Typography>
//                         </Grid>
//                         <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <Typography variant="body1" fontWeight="bold" color="textSecondary">
//                                 Ordered Products
//                             </Typography>
//                         </Grid>
//                         <TableContainer component={Paper} sx={{ marginTop: 2 }}>
//                             <Table>
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell>#</TableCell>
//                                         <TableCell>Product Name</TableCell>
//                                         <TableCell>Price</TableCell>
//                                         <TableCell>Quantity</TableCell>
//                                         <TableCell>Total</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {data.products.map((item, index) => (
//                                         <TableRow key={index}>
//                                             <TableCell>{index + 1}</TableCell>
//                                             <TableCell>{item.product?.productName}</TableCell>
//                                             <TableCell>{item.product?.price}  &#8377;</TableCell>
//                                             <TableCell>{item.quantity}*</TableCell>
//                                             <TableCell>{item.total}  &#8377;</TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>

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

// export default OrderDetail;



import React, { useRef } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const OrderDetail = ({ open, onClose, data }) => {
    const invoiceRef = useRef();

    // Download Invoice as PDF
    // const handleDownload = async () => {
    //     const input = invoiceRef.current;
    //     if (!input) return;
    //     const canvas = await html2canvas(input, { scale: 2 });
    //     const imgData = canvas.toDataURL('image/png');
    //     const pdf = new jsPDF('p', 'mm', 'a4');
    //     const imgProps = pdf.getImageProperties(imgData);
    //     const pdfWidth = pdf.internal.pageSize.getWidth();
    //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    //     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    //     pdf.save(`Invoice_${data?._id || 'order'}.pdf`);
    // };

    const handleDownload = async () => {
        const input = invoiceRef.current;
        if (!input) return;

        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Padding in mm
        const paddingX = 10; // left-right padding
        const paddingY = 10; // top padding

        pdf.addImage(
            imgData,
            'PNG',
            paddingX,
            paddingY,
            pdfWidth - paddingX * 2, // width minus left+right padding
            pdfHeight - paddingY // height adjust if needed
        );

        pdf.save(`Invoice_${data?._id || 'order'}.pdf`);
    };


    // Print Invoice
    const handlePrint = () => {
        const printContent = invoiceRef.current.innerHTML;
        const newWin = window.open('', '', 'width=800,height=600');
        newWin.document.write(`
            <html>
                <head>
                    <title>Invoice</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        table { border-collapse: collapse; width: 100%; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    </style>
                </head>
                <body>
                    ${printContent}
                </body>
            </html>
        `);
        newWin.document.close();
        newWin.focus();
        newWin.print();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontSize: 22, fontWeight: 'medium' }}>
                Order Details
            </DialogTitle>
            <DialogContent>
                {data ? (
                    <div ref={invoiceRef}>
                        <Grid container spacing={2}>
                            {/* ---- Customer Details ---- */}
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography fontWeight="bold">Customer Name:</Typography>
                                <Typography>{data.customer?.firstName} {data.customer?.lastName}</Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography fontWeight="bold">Customer Email:</Typography>
                                <Typography>{data.customer?.email}</Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography fontWeight="bold">Payment Status:</Typography>
                                <Typography>{data.paymentStatus}</Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography fontWeight="bold">Order Status:</Typography>
                                <Typography>{data.status}</Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography fontWeight="bold">Order Amount:</Typography>
                                <Typography>{data.totalAmount} &#8377;</Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography fontWeight="bold">Ordered Website:</Typography>
                                <Typography>{data.referenceWebsite?.websiteName}</Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography fontWeight="bold">Order Date:</Typography>
                                <Typography>{new Date(data.createdAt).toLocaleString()}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography fontWeight="bold">Shipping Address:</Typography>
                                <Typography>
                                    {`${data.shippingAddress?.address}, ${data.shippingAddress?.state}, ${data.shippingAddress?.country} - ${data.shippingAddress?.pinCode}`}
                                </Typography>
                            </Grid>

                            {/* ---- Product Table ---- */}
                            <Grid item xs={12}>
                                <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>#</TableCell>
                                                <TableCell>Product Name</TableCell>
                                                <TableCell>Price</TableCell>
                                                <TableCell>Qty</TableCell>
                                                <TableCell>Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.products.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{item.product?.productName}</TableCell>
                                                    <TableCell>{item.product?.price} &#8377;</TableCell>
                                                    <TableCell>{item.quantity}</TableCell>
                                                    <TableCell>{item.quantity * (item.product?.price || 0)} &#8377;</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </div>
                ) : (
                    <Typography>No data available</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handlePrint} color="secondary" variant="outlined">
                    Print
                </Button>
                <Button onClick={handleDownload} color="primary" variant="outlined">
                    Download
                </Button>
                <Button onClick={onClose} color="primary" variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderDetail;
