// import { useState, useEffect } from 'react';
// import {
//     Paper,
//     Typography,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     TextField,
//     Grid,
//     Button,
//     Pagination,
//     useMediaQuery,
//     IconButton,
//     Snackbar,
//     MenuItem,
//     Select,
//     FormControl,
//     InputLabel,
//     Box,
//     Divider
// } from '@mui/material';
// import { apiGet } from '../../../api/apiMethods';
// import UserDetail from './UserDetail';
// import UserRoleForm from './UserForm';
// import { useUser } from '../../../Context/UserContext';

// const UsersPage = () => {
//     const [data, setData] = useState([]);
//     const [detailOpen, setDetailOpen] = useState(false);
//     const [dialogOpen, setDialogOpen] = useState(false);
//     const [selectedItemId, setSelectedItemId] = useState(null);
//     const [selectedWebsite, setSelectedWebsite] = useState(null);
//     const [searchInput, setSearchInput] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [sortBy, setSortBy] = useState('createdAt');
//     const [sortOrder, setSortOrder] = useState('desc');
//     const [pageSize, setPageSize] = useState(10);
//     const [websites, setWebsites] = useState([]);
//     const [filterWebsite, setfilterWebsite] = useState('');
//     const API_ENDPOINT = `api/auth/allusers`;

//     const { user } = useUser()

//     const fetchData = async () => {
//         try {
//             const response = await apiGet(API_ENDPOINT, {
//                 referenceWebsite: filterWebsite,
//                 search: searchInput,
//                 page: currentPage,
//                 limit: pageSize,
//                 sortBy,
//                 role: user.role === "super-admin" ? null : "user",
//                 sortOrder
//             });
//             const users = response.data?.data;
//             setData(users || []);
//             setTotalPages(response.data?.totalPages || 1);
//         } catch (error) {
//             console.error(error.message);
//             setData([])
//         }
//     };

//     const fetchDropdownData = async () => {
//         try {
//             const [websitesResponse] = await Promise.all([
//                 apiGet('api/website'),
//             ]);
//             setWebsites(websitesResponse.data?.websites || []);
//             setfilterWebsite(websitesResponse.data?.websites[0]._id);
//         } catch (error) {
//             console.error('Failed to fetch dropdown data:', error);
//         }
//     };
//     useEffect(() => {
//         if (!user) return;
//         if (user?.role === 'super-admin') {
//             fetchDropdownData();
//         } else {
//             setfilterWebsite(user?.referenceWebsite)
//         }
//     }, [user])
//     // useEffect(() => {
//     //     fetchDropdownData();
//     // }, [])

//     useEffect(() => {
//         if (filterWebsite) {
//             fetchData();
//         }
//     }, [filterWebsite, currentPage, searchInput, sortBy, sortOrder, pageSize]);

//     const openDialog = (id) => {
//         setSelectedItemId(id);
//         setDialogOpen(true);
//     };

//     const closeDialog = () => {
//         setDialogOpen(false);
//         setSelectedItemId(null);
//     };

//     const handlePageChange = (event, value) => {
//         setCurrentPage(value);
//     };

//     const handleSortChange = (field) => {
//         setSortBy(field);
//         setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
//     };

//     return (
//         <>
//             <Box >
//                 <Grid container alignItems="center" sx={{ mb: 0, p: 0 }}>
//                     <Grid item xs>
//                         <Typography variant="h5" gutterBottom sx={{
//                             flexGrow: 1,
//                             color: '#2a4172',
//                             fontWeight: '600',
//                             p: 0,
//                             mb: 0,
//                             fontSize: '20px',
//                         }}>Users</Typography>
//                     </Grid>
//                 </Grid>
//                 <Divider sx={{ mt: 1, borderBottomWidth: 1, pt: 0, }} />
//                 <Grid container spacing={3} alignItems="center" sx={{ mt: 0, mb: 2, px: 0, py: 0 }}>
//                     {/* Search by Name or Email */}
//                     <Grid item xs={12} md={3}>
//                         <TextField
//                             label="Search by Name or Email"
//                             variant="outlined"
//                             size="small"
//                             fullWidth
//                             value={searchInput}
//                             onChange={(e) => {
//                                 setSearchInput(e.target.value);
//                                 setCurrentPage(1);
//                             }}
//                         />
//                     </Grid>

//                     {/* Conditional Reference Website Field for Super-Admin */}
//                     {user?.role === "super-admin" && (
//                         <Grid item xs={12} md={3}>
//                             <FormControl fullWidth>
//                                 <InputLabel>Reference Website</InputLabel>
//                                 <Select
//                                     value={filterWebsite}
//                                     defaultValue={user?.referenceWebsite}
//                                     onChange={(e) => setfilterWebsite(e.target.value)}
//                                     label="Reference Website"
//                                 >
//                                     <MenuItem value="">None</MenuItem>
//                                     {websites &&
//                                         websites.map((item, index) => (
//                                             <MenuItem key={index} value={item._id}>
//                                                 {item.websiteName}
//                                             </MenuItem>
//                                         ))}
//                                 </Select>
//                             </FormControl>
//                         </Grid>
//                     )}

//                     {/* Sort By */}
//                     <Grid item xs={6} md={2}>
//                         <FormControl fullWidth>
//                             <InputLabel>Sort By</InputLabel>
//                             <Select
//                                 value={sortBy}
//                                 onChange={(e) => handleSortChange(e.target.value)}
//                                 label="Sort By"
//                                 size="small"
//                             >
//                                 <MenuItem value="productName">Name</MenuItem>
//                                 <MenuItem value="createdAt">Created</MenuItem>
//                             </Select>
//                         </FormControl>
//                     </Grid>

//                     {/* Sort Order Button */}
//                     <Grid item xs={6} md={2}>
//                         <Button
//                             fullWidth
//                             onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}

//                         >
//                             {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
//                         </Button>
//                     </Grid>
//                 </Grid>

//                 <TableContainer component={Paper} sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', p: 0 }}>
//                     <Table sx={{ borderCollapse: 'collapse' }}>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', backgroundColor: "#fbe5ec" }}><strong>#</strong></TableCell>
//                                 <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', backgroundColor: "#fbe5ec" }}><strong>Name</strong></TableCell>
//                                 <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', backgroundColor: "#fbe5ec" }}><strong>Email</strong></TableCell>
//                                 <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', backgroundColor: "#fbe5ec" }}><strong>Mobile</strong></TableCell>
//                                 <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', backgroundColor: "#fbe5ec" }}><strong>Role</strong></TableCell>
//                                 <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', backgroundColor: "#fbe5ec" }}><strong>Actions</strong></TableCell>
//                             </TableRow>
//                         </TableHead>

//                         <TableBody>
//                             {data.length === 0 ? (
//                                 <TableRow>
//                                     <TableCell colSpan={12} align="center">No data available.</TableCell>
//                                 </TableRow>
//                             ) : (
//                                 data.map((item, index) => (
//                                     <TableRow key={item._id}>
//                                         <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
//                                             {index + (currentPage - 1) * pageSize + 1}
//                                         </TableCell>
//                                         <TableCell onClick={() => {
//                                             setSelectedWebsite(item);
//                                             setDetailOpen(true)
//                                         }
//                                         } sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', cursor: 'pointer' }}>
//                                             {item.firstName + ' ' + item.lastName || 'NA'}
//                                         </TableCell>
//                                         <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
//                                             {item.email || 'NA'}
//                                         </TableCell>
//                                         <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
//                                             {item.mobile || '0'}
//                                         </TableCell>
//                                         <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
//                                             {item.role}
//                                         </TableCell>
//                                         <TableCell sx={{ display: 'flex', border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
//                                             <UserRoleForm userId={item._id} currentRole={item.role} userDetails={item} onRoleChange={fetchData} />
//                                         </TableCell>
//                                     </TableRow>
//                                 ))
//                             )}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//                 <UserDetail
//                     open={detailOpen}
//                     onClose={() => {
//                         setDetailOpen(false);
//                         setSelectedWebsite(null);
//                     }}
//                     data={selectedWebsite}
//                 />
//                 {/* <DeleteDialog
//                 itemId={selectedItemId}
//                 open={dialogOpen}
//                 onClose={closeDialog}
//             /> */}
//                 <Grid container justifyContent="right" sx={{ pr: 2, pb: 2 }}>
//                     <Pagination
//                         count={totalPages}
//                         page={currentPage}
//                         onChange={handlePageChange}
//                         variant="outlined"
//                         shape="rounded"
//                     />
//                 </Grid>
//             </Box>
//         </>
//     );
// };

// export default UsersPage;





// import { useState, useEffect } from 'react';
// import {
//     Paper,
//     Typography,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     TextField,
//     Grid,
//     Button,
//     Pagination,
//     MenuItem,
//     Select,
//     FormControl,
//     InputLabel,
//     Box,
//     Divider,
//     Chip
// } from '@mui/material';
// import { apiGet } from '../../../api/apiMethods';
// import UserDetail from './UserDetail';
// import UserRoleForm from './UserForm';
// import { useUser } from '../../../Context/UserContext';

// const UsersPage = () => {
//     const [data, setData] = useState([]);
//     const [detailOpen, setDetailOpen] = useState(false);
//     const [selectedWebsite, setSelectedWebsite] = useState(null);
//     const [searchInput, setSearchInput] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [sortBy, setSortBy] = useState('createdAt');
//     const [sortOrder, setSortOrder] = useState('desc');
//     const [pageSize, setPageSize] = useState(10);
//     const [websites, setWebsites] = useState([]);
//     const [filterWebsite, setFilterWebsite] = useState('');
//     const [segmentFilter, setSegmentFilter] = useState('all');
//     const [totalUsers, setTotalUsers] = useState(0);
//     const [loading, setLoading] = useState(false);
//     const API_ENDPOINT = `api/auth/allusers`;

//     const { user } = useUser();

//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             // Build query parameters
//             let queryParams = `?page=${currentPage}&limit=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
            
//             if (searchInput) {
//                 queryParams += `&search=${encodeURIComponent(searchInput)}`;
//             }
            
//             if (filterWebsite) {
//                 queryParams += `&referenceWebsite=${filterWebsite}`;
//             }
            
//             if (segmentFilter !== 'all') {
//                 queryParams += `&segment=${segmentFilter}`;
//             }

//             const response = await apiGet(`${API_ENDPOINT}${queryParams}`);
            
//             if (response.data) {
//                 const users = response.data.users || [];
//                 setData(users);
//                 setTotalPages(response.data.totalPages || 1);
//                 setTotalUsers(response.data.totalUsers || 0);
//             }
//         } catch (error) {
//             console.error('Error fetching users:', error.message);
//             setData([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchDropdownData = async () => {
//         try {
//             const [websitesResponse] = await Promise.all([
//                 apiGet('api/website'),
//             ]);
//             setWebsites(websitesResponse.data?.websites || []);
//             if (websitesResponse.data?.websites.length > 0) {
//                 setFilterWebsite(websitesResponse.data.websites[0]._id);
//             }
//         } catch (error) {
//             console.error('Failed to fetch dropdown data:', error);
//         }
//     };

//     useEffect(() => {
//         if (!user) return;
        
//         if (user?.role === 'super-admin') {
//             fetchDropdownData();
//         } else {
//             setFilterWebsite(user?.referenceWebsite || '');
//         }
//     }, [user]);

//     useEffect(() => {
//         // Add a small debounce to prevent too many API calls
//         const timer = setTimeout(() => {
//             if (filterWebsite || user?.role !== 'super-admin') {
//                 fetchData();
//             }
//         }, 300);
        
//         return () => clearTimeout(timer);
//     }, [filterWebsite, currentPage, searchInput, sortBy, sortOrder, pageSize, segmentFilter]);

//     const handlePageChange = (event, value) => {
//         setCurrentPage(value);
//     };

//     const handleSortChange = (field) => {
//         if (sortBy === field) {
//             setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//         } else {
//             setSortBy(field);
//             setSortOrder('desc');
//         }
//         setCurrentPage(1); // Reset to first page when sorting changes
//     };

//     const handleSearchChange = (e) => {
//         setSearchInput(e.target.value);
//         setCurrentPage(1);
//     };

//     const handleWebsiteChange = (e) => {
//         setFilterWebsite(e.target.value);
//         setCurrentPage(1);
//     };

//     const handleSegmentChange = (e) => {
//         setSegmentFilter(e.target.value);
//         setCurrentPage(1);
//     };

//     const handlePageSizeChange = (e) => {
//         setPageSize(e.target.value);
//         setCurrentPage(1);
//     };

//     const getSegmentColor = (segment) => {
//         switch (segment) {
//             case 'loyal': return 'success';
//             case 'high-value': return 'primary';
//             case 'new': return 'warning';
//             default: return 'default';
//         }
//     };

//     return (
//         <>
//             <Box>
//                 <Grid container alignItems="center" sx={{ mb: 0, p: 0 }}>
//                     <Grid item xs>
//                         <Typography variant="h5" gutterBottom sx={{
//                             flexGrow: 1,
//                             color: '#2a4172',
//                             fontWeight: '600',
//                             p: 0,
//                             mb: 0,
//                             fontSize: '20px',
//                         }}>Users ({totalUsers})</Typography>
//                     </Grid>
//                 </Grid>
//                 <Divider sx={{ mt: 1, borderBottomWidth: 1, pt: 0 }} />
//                 <Grid container spacing={2} alignItems="center" sx={{ mt: 1, mb: 2 }}>
//                     {/* Search by Name or Email */}
//                     <Grid item xs={12} md={3}>
//                         <TextField
//                             label="Search by Name or Email"
//                             variant="outlined"
//                             size="small"
//                             fullWidth
//                             value={searchInput}
//                             onChange={handleSearchChange}
//                             placeholder="Search users..."
//                         />
//                     </Grid>

//                     {/* Conditional Reference Website Field for Super-Admin */}
//                     {user?.role === "super-admin" && (
//                         <Grid item xs={12} md={2}>
//                             <FormControl fullWidth size="small">
//                                 <InputLabel>Website</InputLabel>
//                                 <Select
//                                     value={filterWebsite}
//                                     onChange={handleWebsiteChange}
//                                     label="Website"
//                                 >
//                                     <MenuItem value="">All Websites</MenuItem>
//                                     {websites.map((item) => (
//                                         <MenuItem key={item._id} value={item._id}>
//                                             {item.websiteName}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                         </Grid>
//                     )}

//                     {/* Segment Filter */}
//                     <Grid item xs={12} md={2}>
//                         <FormControl fullWidth size="small">
//                             <InputLabel>Segment</InputLabel>
//                             <Select
//                                 value={segmentFilter}
//                                 onChange={handleSegmentChange}
//                                 label="Segment"
//                             >
//                                 <MenuItem value="all">All Segments</MenuItem>
//                                 <MenuItem value="regular">Regular</MenuItem>
//                                 <MenuItem value="loyal">Loyal</MenuItem>
//                                 <MenuItem value="high-value">High Value</MenuItem>
//                                 <MenuItem value="new">New</MenuItem>
//                             </Select>
//                         </FormControl>
//                     </Grid>

//                     {/* Sort By */}
//                     <Grid item xs={12} md={2}>
//                         <FormControl fullWidth size="small">
//                             <InputLabel>Sort By</InputLabel>
//                             <Select
//                                 value={sortBy}
//                                 onChange={(e) => handleSortChange(e.target.value)}
//                                 label="Sort By"
//                             >
//                                 <MenuItem value="firstName">Name</MenuItem>
//                                 <MenuItem value="createdAt">Created Date</MenuItem>
//                                 <MenuItem value="totalSpent">Total Spent</MenuItem>
//                                 <MenuItem value="orderCount">Order Count</MenuItem>
//                             </Select>
//                         </FormControl>
//                     </Grid>

//                     {/* Sort Order Button */}
//                     <Grid item xs={12} md={2}>
//                         <Button
//                             fullWidth
//                             variant="outlined"
//                             onClick={() => {
//                                 setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//                                 setCurrentPage(1);
//                             }}
//                             size="small"
//                         >
//                             {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
//                         </Button>
//                     </Grid>

//                     {/* Page Size Selector */}
//                     <Grid item xs={12} md={1}>
//                         <FormControl fullWidth size="small">
//                             <InputLabel>Page Size</InputLabel>
//                             <Select
//                                 value={pageSize}
//                                 onChange={handlePageSizeChange}
//                                 label="Page Size"
//                             >
//                                 <MenuItem value={5}>5</MenuItem>
//                                 <MenuItem value={10}>10</MenuItem>
//                                 <MenuItem value={25}>25</MenuItem>
//                                 <MenuItem value={50}>50</MenuItem>
//                             </Select>
//                         </FormControl>
//                     </Grid>
//                 </Grid>

//                 <TableContainer component={Paper} sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap' }}>
//                     <Table>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>#</strong></TableCell>
//                                 <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Name</strong></TableCell>
//                                 <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Email</strong></TableCell>
//                                 <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Mobile</strong></TableCell>
//                                 <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Orders</strong></TableCell>
//                                 <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Total Spent</strong></TableCell>
//                                 <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Segment</strong></TableCell>
//                                 <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Role</strong></TableCell>
//                                 <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Actions</strong></TableCell>
//                             </TableRow>
//                         </TableHead>

//                         <TableBody>
//                             {loading ? (
//                                 <TableRow>
//                                     <TableCell colSpan={9} align="center">Loading users...</TableCell>
//                                 </TableRow>
//                             ) : data.length === 0 ? (
//                                 <TableRow>
//                                     <TableCell colSpan={9} align="center">No users found.</TableCell>
//                                 </TableRow>
//                             ) : (
//                                 data.map((item, index) => (
//                                     <TableRow key={item._id}>
//                                         <TableCell>
//                                             {index + (currentPage - 1) * pageSize + 1}
//                                         </TableCell>
//                                         <TableCell 
//                                             onClick={() => {
//                                                 setSelectedWebsite(item);
//                                                 setDetailOpen(true);
//                                             }}
//                                             sx={{ cursor: 'pointer', color: 'primary.main' }}
//                                         >
//                                             {item.firstName + ' ' + item.lastName || 'NA'}
//                                         </TableCell>
//                                         <TableCell>
//                                             {item.email || 'NA'}
//                                         </TableCell>
//                                         <TableCell>
//                                             {item.mobile || '0'}
//                                         </TableCell>
//                                         <TableCell>
//                                             {item.orderCount || 0}
//                                         </TableCell>
//                                         <TableCell>
//                                             ₹{item.totalSpent?.toLocaleString() || 0}
//                                         </TableCell>
//                                         <TableCell>
//                                             <Chip 
//                                                 label={item.segment || 'regular'} 
//                                                 size="small" 
//                                                 color={getSegmentColor(item.segment)}
//                                             />
//                                         </TableCell>
//                                         <TableCell>
//                                             {item.role}
//                                         </TableCell>
//                                         <TableCell>
//                                             <UserRoleForm 
//                                                 userId={item._id} 
//                                                 currentRole={item.role} 
//                                                 userDetails={item} 
//                                                 onRoleChange={fetchData} 
//                                             />
//                                         </TableCell>
//                                     </TableRow>
//                                 ))
//                             )}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
                
//                 <UserDetail
//                     open={detailOpen}
//                     onClose={() => {
//                         setDetailOpen(false);
//                         setSelectedWebsite(null);
//                     }}
//                     data={selectedWebsite}
//                 />
                
//                 <Grid container justifyContent="right" sx={{ pr: 2, pb: 2, pt: 2 }}>
//                     <Pagination
//                         count={totalPages}
//                         page={currentPage}
//                         onChange={handlePageChange}
//                         variant="outlined"
//                         shape="rounded"
//                     />
//                 </Grid>
//             </Box>
//         </>
//     );
// };

// export default UsersPage;



// import { useState, useEffect } from 'react';
// import {
//     Paper,
//     Typography,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     TextField,
//     Grid,
//     Button,
//     Pagination,
//     MenuItem,
//     Select,
//     FormControl,
//     InputLabel,
//     Box,
//     Divider,
//     Chip
// } from '@mui/material';
// import { apiGet } from '../../../api/apiMethods';
// import UserDetail from './UserDetail';
// import UserRoleForm from './UserForm';
// import { useUser } from '../../../Context/UserContext';

// const UsersPage = () => {
//     const [data, setData] = useState([]);
//     const [detailOpen, setDetailOpen] = useState(false);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [searchInput, setSearchInput] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [sortBy, setSortBy] = useState('createdAt');
//     const [sortOrder, setSortOrder] = useState('desc');
//     const [pageSize, setPageSize] = useState(10);
//     const [websites, setWebsites] = useState([]);
//     const [filterWebsite, setFilterWebsite] = useState('');
//     const [segmentFilter, setSegmentFilter] = useState('all');
//     const [roleFilter, setRoleFilter] = useState('all');
//     const [totalUsers, setTotalUsers] = useState(0);
//     const [loading, setLoading] = useState(false);
//     const API_ENDPOINT = `api/auth/allusers`;

//     const { user } = useUser();

//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             // Build query parameters
//             let queryParams = `?page=${currentPage}&limit=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
            
//             if (searchInput) {
//                 queryParams += `&search=${encodeURIComponent(searchInput)}`;
//             }
            
//             if (filterWebsite && filterWebsite !== 'all') {
//                 queryParams += `&referenceWebsite=${filterWebsite}`;
//             }
            
//             if (segmentFilter !== 'all') {
//                 queryParams += `&segment=${segmentFilter}`;
//             }
            
//             if (roleFilter !== 'all') {
//                 queryParams += `&role=${roleFilter}`;
//             }

//             const response = await apiGet(`${API_ENDPOINT}${queryParams}`);
            
//             if (response.data) {
//                 const users = response.data.users || [];
//                 setData(users);
//                 setTotalPages(response.data.totalPages || 1);
//                 setTotalUsers(response.data.totalUsers || 0);
//             }
//         } catch (error) {
//             console.error('Error fetching users:', error.message);
//             setData([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchDropdownData = async () => {
//         try {
//             const [websitesResponse] = await Promise.all([
//                 apiGet('api/website'),
//             ]);
//             setWebsites(websitesResponse.data?.websites || []);
//         } catch (error) {
//             console.error('Failed to fetch dropdown data:', error);
//         }
//     };

//     useEffect(() => {
//         if (!user) return;
        
//         if (user?.role === 'super-admin') {
//             fetchDropdownData();
//             setFilterWebsite('all');
//         } else {
//             setFilterWebsite(user?.referenceWebsite || '');
//         }
//     }, [user]);

//     useEffect(() => {
//         // Add a small debounce to prevent too many API calls
//         const timer = setTimeout(() => {
//             fetchData();
//         }, 300);
        
//         return () => clearTimeout(timer);
//     }, [filterWebsite, currentPage, searchInput, sortBy, sortOrder, pageSize, segmentFilter, roleFilter]);

//     const handlePageChange = (event, value) => {
//         setCurrentPage(value);
//     };

//     const handleSortChange = (field) => {
//         if (sortBy === field) {
//             setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//         } else {
//             setSortBy(field);
//             setSortOrder('desc');
//         }
//         setCurrentPage(1); // Reset to first page when sorting changes
//     };

//     const handleSearchChange = (e) => {
//         setSearchInput(e.target.value);
//         setCurrentPage(1);
//     };

//     const handleWebsiteChange = (e) => {
//         setFilterWebsite(e.target.value);
//         setCurrentPage(1);
//     };

//     const handleSegmentChange = (e) => {
//         setSegmentFilter(e.target.value);
//         setCurrentPage(1);
//     };

//     const handleRoleChange = (e) => {
//         setRoleFilter(e.target.value);
//         setCurrentPage(1);
//     };

//     const handlePageSizeChange = (e) => {
//         setPageSize(e.target.value);
//         setCurrentPage(1);
//     };

//     const getSegmentColor = (segment) => {
//         switch (segment) {
//             case 'loyal': return 'success';
//             case 'high-value': return 'primary';
//             case 'new': return 'warning';
//             default: return 'default';
//         }
//     };

//     return (
//         <>
//             <Box>
//                 <Grid container alignItems="center" sx={{ mb: 0, p: 0 }}>
//                     <Grid item xs>
//                         <Typography variant="h5" gutterBottom sx={{
//                             flexGrow: 1,
//                             color: '#2a4172',
//                             fontWeight: '600',
//                             p: 0,
//                             mb: 0,
//                             fontSize: '20px',
//                         }}>Users ({totalUsers})</Typography>
//                     </Grid>
//                 </Grid>
//                 <Divider sx={{ mt: 1, borderBottomWidth: 1, pt: 0 }} />
//                 <Grid container spacing={2} alignItems="center" sx={{ mt: 1, mb: 2 }}>
//                     {/* Search by Name or Email */}
//                     <Grid item xs={12} md={2}>
//                         <TextField
//                             label="Search by Name or Email"
//                             variant="outlined"
//                             size="small"
//                             fullWidth
//                             value={searchInput}
//                             onChange={handleSearchChange}
//                             placeholder="Search users..."
//                         />
//                     </Grid>

//                     {/* Role Filter */}
//                     <Grid item xs={12} md={2}>
//                         <FormControl fullWidth size="small">
//                             <InputLabel>Role</InputLabel>
//                             <Select
//                                 value={roleFilter}
//                                 onChange={handleRoleChange}
//                                 label="Role"
//                             >
//                                 <MenuItem value="all">All Roles</MenuItem>
//                                 <MenuItem value="user">User</MenuItem>
//                                 <MenuItem value="vendor">Vendor</MenuItem>
//                                 <MenuItem value="admin">Admin</MenuItem>
//                                 <MenuItem value="super-admin">Super Admin</MenuItem>
//                             </Select>
//                         </FormControl>
//                     </Grid>

//                     {/* Conditional Reference Website Field for Super-Admin */}
//                     {user?.role === "super-admin" && (
//                         <Grid item xs={12} md={2}>
//                             <FormControl fullWidth size="small">
//                                 <InputLabel>Website</InputLabel>
//                                 <Select
//                                     value={filterWebsite}
//                                     onChange={handleWebsiteChange}
//                                     label="Website"
//                                 >
//                                     <MenuItem value="all">All Websites</MenuItem>
//                                     {websites.map((item) => (
//                                         <MenuItem key={item._id} value={item._id}>
//                                             {item.websiteName}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                         </Grid>
//                     )}

//                     {/* Segment Filter */}
//                     <Grid item xs={12} md={2}>
//                         <FormControl fullWidth size="small">
//                             <InputLabel>Segment</InputLabel>
//                             <Select
//                                 value={segmentFilter}
//                                 onChange={handleSegmentChange}
//                                 label="Segment"
//                             >
//                                 <MenuItem value="all">All Segments</MenuItem>
//                                 <MenuItem value="regular">Regular</MenuItem>
//                                 <MenuItem value="loyal">Loyal</MenuItem>
//                                 <MenuItem value="high-value">High Value</MenuItem>
//                                 <MenuItem value="new">New</MenuItem>
//                             </Select>
//                         </FormControl>
//                     </Grid>

//                     {/* Sort By */}
//                     <Grid item xs={12} md={2}>
//                         <FormControl fullWidth size="small">
//                             <InputLabel>Sort By</InputLabel>
//                             <Select
//                                 value={sortBy}
//                                 onChange={(e) => handleSortChange(e.target.value)}
//                                 label="Sort By"
//                             >
//                                 <MenuItem value="firstName">Name</MenuItem>
//                                 <MenuItem value="createdAt">Created Date</MenuItem>
//                                 <MenuItem value="totalSpent">Total Spent</MenuItem>
//                                 <MenuItem value="orderCount">Order Count</MenuItem>
//                                 <MenuItem value="wallet">Wallet Balance</MenuItem>
//                             </Select>
//                         </FormControl>
//                     </Grid>

//                     {/* Sort Order Button */}
//                     <Grid item xs={12} md={1}>
//                         <Button
//                             fullWidth
//                             variant="outlined"
//                             onClick={() => {
//                                 setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//                                 setCurrentPage(1);
//                             }}
//                             size="small"
//                         >
//                             {sortOrder === 'asc' ? 'Asc' : 'Desc'}
//                         </Button>
//                     </Grid>

//                     {/* Page Size Selector */}
//                     <Grid item xs={12} md={1}>
//                         <FormControl fullWidth size="small">
//                             <InputLabel>Page Size</InputLabel>
//                             <Select
//                                 value={pageSize}
//                                 onChange={handlePageSizeChange}
//                                 label="Page Size"
//                             >
//                                 <MenuItem value={5}>5</MenuItem>
//                                 <MenuItem value={10}>10</MenuItem>
//                                 <MenuItem value={25}>25</MenuItem>
//                                 <MenuItem value={50}>50</MenuItem>
//                             </Select>
//                         </FormControl>
//                     </Grid>
//                 </Grid>

//                 <TableContainer component={Paper} sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap' }}>
//                     <Table>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>#</strong></TableCell>
//                                 <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Name</strong></TableCell>
//                                 <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Email</strong></TableCell>
//                                 <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Mobile</strong></TableCell>
//                                 <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Orders</strong></TableCell>
//                                 <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Total Spent</strong></TableCell>
//                                 <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Wallet</strong></TableCell>
//                                 <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Segment</strong></TableCell>
//                                 <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Role</strong></TableCell>
//                                 <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Actions</strong></TableCell>
//                             </TableRow>
//                         </TableHead>

//                         <TableBody>
//                             {loading ? (
//                                 <TableRow>
//                                     <TableCell colSpan={10} align="center">Loading users...</TableCell>
//                                 </TableRow>
//                             ) : data.length === 0 ? (
//                                 <TableRow>
//                                     <TableCell colSpan={10} align="center">No users found.</TableCell>
//                                 </TableRow>
//                             ) : (
//                                 data.map((item, index) => (
//                                     <TableRow key={item._id}>
//                                         <TableCell>
//                                             {index + (currentPage - 1) * pageSize + 1}
//                                         </TableCell>
//                                         <TableCell 
//                                             onClick={() => {
//                                                 setSelectedUser(item);
//                                                 setDetailOpen(true);
//                                             }}
//                                             sx={{ cursor: 'pointer', color: 'primary.main' }}
//                                         >
//                                             {item.firstName + ' ' + item.lastName || 'NA'}
//                                         </TableCell>
//                                         <TableCell>
//                                             {item.email || 'NA'}
//                                         </TableCell>
//                                         <TableCell>
//                                             {item.mobile || '0'}
//                                         </TableCell>
//                                         <TableCell>
//                                             {item.orderCount || 0}
//                                         </TableCell>
//                                         <TableCell>
//                                             ₹{item.totalSpent?.toLocaleString() || 0}
//                                         </TableCell>
//                                         <TableCell>
//                                             ₹{item.wallet?.toLocaleString() || 0}
//                                         </TableCell>
//                                         <TableCell>
//                                             <Chip 
//                                                 label={item.segment || 'regular'} 
//                                                 size="small" 
//                                                 color={getSegmentColor(item.segment)}
//                                             />
//                                         </TableCell>
//                                         <TableCell>
//                                             {item.role}
//                                         </TableCell>
//                                         <TableCell>
//                                             <UserRoleForm 
//                                                 userId={item._id} 
//                                                 currentRole={item.role} 
//                                                 userDetails={item} 
//                                                 onRoleChange={fetchData} 
//                                             />
//                                         </TableCell>
//                                     </TableRow>
//                                 ))
//                             )}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
                
//                 <UserDetail
//                     open={detailOpen}
//                     onClose={() => {
//                         setDetailOpen(false);
//                         setSelectedUser(null);
//                     }}
//                     data={selectedUser}
//                 />
                
//                 <Grid container justifyContent="right" sx={{ pr: 2, pb: 2, pt: 2 }}>
//                     <Pagination
//                         count={totalPages}
//                         page={currentPage}
//                         onChange={handlePageChange}
//                         variant="outlined"
//                         shape="rounded"
//                     />
//                 </Grid>
//             </Box>
//         </>
//     );
// };

// export default UsersPage;



import { useState, useEffect } from 'react';
import {
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Grid,
    Button,
    Pagination,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Box,
    Divider,
    Chip
} from '@mui/material';
import { apiGet } from '../../../api/apiMethods';
import UserDetail from './UserDetail';
import UserRoleForm from './UserForm';
import { useUser } from '../../../Context/UserContext';

const UsersPage = () => {
    const [data, setData] = useState([]);
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [pageSize, setPageSize] = useState(10);
    const [websites, setWebsites] = useState([]);
    const [filterWebsite, setFilterWebsite] = useState('');
    const [segmentFilter, setSegmentFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(false);
    const API_ENDPOINT = `api/auth/allusers`;

    const { user } = useUser();

    const fetchData = async () => {
        setLoading(true);
        try {
            // Build query parameters
            let queryParams = `?page=${currentPage}&limit=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
            
            if (searchInput) {
                queryParams += `&search=${encodeURIComponent(searchInput)}`;
            }
            
            if (filterWebsite && filterWebsite !== 'all') {
                queryParams += `&referenceWebsite=${filterWebsite}`;
            }
            
            if (segmentFilter !== 'all') {
                queryParams += `&segmentation=${segmentFilter}`; // Changed from 'segment' to 'segmentation'
            }
            
            if (roleFilter !== 'all') {
                queryParams += `&role=${roleFilter}`;
            }

            const response = await apiGet(`${API_ENDPOINT}${queryParams}`);
            
            if (response.data) {
                const users = response.data.users || [];
                setData(users);
                setTotalPages(response.data.totalPages || 1);
                setTotalUsers(response.data.totalUsers || 0);
            }
        } catch (error) {
            console.error('Error fetching users:', error.message);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchDropdownData = async () => {
        try {
            const [websitesResponse] = await Promise.all([
                apiGet('api/website'),
            ]);
            setWebsites(websitesResponse.data?.websites || []);
        } catch (error) {
            console.error('Failed to fetch dropdown data:', error);
        }
    };

    useEffect(() => {
        if (!user) return;
        
        if (user?.role === 'super-admin') {
            fetchDropdownData();
            setFilterWebsite('all');
        } else {
            setFilterWebsite(user?.referenceWebsite || '');
        }
    }, [user]);

    useEffect(() => {
        // Add a small debounce to prevent too many API calls
        const timer = setTimeout(() => {
            fetchData();
        }, 300);
        
        return () => clearTimeout(timer);
    }, [filterWebsite, currentPage, searchInput, sortBy, sortOrder, pageSize, segmentFilter, roleFilter]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleSortChange = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
        setCurrentPage(1); // Reset to first page when sorting changes
    };

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
        setCurrentPage(1);
    };

    const handleWebsiteChange = (e) => {
        setFilterWebsite(e.target.value);
        setCurrentPage(1);
    };

    const handleSegmentChange = (e) => {
        setSegmentFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleRoleChange = (e) => {
        setRoleFilter(e.target.value);
        setCurrentPage(1);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(e.target.value);
        setCurrentPage(1);
    };

    const getSegmentColor = (segment) => {
        switch (segment) {
            case 'loyal': return 'success';
            case 'high-value': return 'primary';
            case 'new': return 'warning';
            default: return 'default';
        }
    };

    return (
        <>
            <Box>
                <Grid container alignItems="center" sx={{ mb: 0, p: 0 }}>
                    <Grid item xs>
                        <Typography variant="h5" gutterBottom sx={{
                            flexGrow: 1,
                            color: '#2a4172',
                            fontWeight: '600',
                            p: 0,
                            mb: 0,
                            fontSize: '20px',
                        }}>Users ({totalUsers})</Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ mt: 1, borderBottomWidth: 1, pt: 0 }} />
                <Grid container spacing={2} alignItems="center" sx={{ mt: 1, mb: 2 }}>
                    {/* Search by Name or Email */}
                    <Grid item xs={12} md={2}>
                        <TextField
                            label="Search by Name or Email"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={searchInput}
                            onChange={handleSearchChange}
                            placeholder="Search users..."
                        />
                    </Grid>

                    {/* Role Filter */}
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={roleFilter}
                                onChange={handleRoleChange}
                                label="Role"
                            >
                                <MenuItem value="all">All Roles</MenuItem>
                                <MenuItem value="user">User</MenuItem>
                                <MenuItem value="vendor">Vendor</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="super-admin">Super Admin</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Conditional Reference Website Field for Super-Admin */}
                    {user?.role === "super-admin" && (
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Website</InputLabel>
                                <Select
                                    value={filterWebsite}
                                    onChange={handleWebsiteChange}
                                    label="Website"
                                >
                                    <MenuItem value="all">All Websites</MenuItem>
                                    {websites.map((item) => (
                                        <MenuItem key={item._id} value={item._id}>
                                            {item.websiteName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}

                    {/* Segment Filter */}
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Segment</InputLabel>
                            <Select
                                value={segmentFilter}
                                onChange={handleSegmentChange}
                                label="Segment"
                            >
                                <MenuItem value="all">All Segments</MenuItem>
                                <MenuItem value="regular">Regular</MenuItem>
                                <MenuItem value="loyal">Loyal</MenuItem>
                                <MenuItem value="high-value">High Value</MenuItem>
                                <MenuItem value="new">New</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Sort By */}
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value)}
                                label="Sort By"
                            >
                                <MenuItem value="firstName">Name</MenuItem>
                                <MenuItem value="createdAt">Created Date</MenuItem>
                                <MenuItem value="totalSpent">Total Spent</MenuItem>
                                <MenuItem value="orderCount">Order Count</MenuItem>
                                <MenuItem value="wallet">Wallet Balance</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Sort Order Button */}
                    <Grid item xs={12} md={1}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => {
                                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                setCurrentPage(1);
                            }}
                            size="small"
                        >
                            {sortOrder === 'asc' ? 'Asc' : 'Desc'}
                        </Button>
                    </Grid>

                    {/* Page Size Selector */}
                    <Grid item xs={12} md={1}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Page Size</InputLabel>
                            <Select
                                value={pageSize}
                                onChange={handlePageSizeChange}
                                label="Page Size"
                            >
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <TableContainer component={Paper} sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>#</strong></TableCell>
                                <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Name</strong></TableCell>
                                <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Email</strong></TableCell>
                                <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Mobile</strong></TableCell>
                                <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Orders</strong></TableCell>
                                <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Total Spent</strong></TableCell>
                                <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Wallet</strong></TableCell>
                                <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Segment</strong></TableCell>
                                <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Role</strong></TableCell>
                                <TableCell sx={{ backgroundColor: "#fbe5ec" }}><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={10} align="center">Loading users...</TableCell>
                                </TableRow>
                            ) : data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} align="center">No users found.</TableCell>
                                </TableRow>
                            ) : (
                                data.map((item, index) => (
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            {index + (currentPage - 1) * pageSize + 1}
                                        </TableCell>
                                        <TableCell 
                                            onClick={() => {
                                                setSelectedUser(item);
                                                setDetailOpen(true);
                                            }}
                                            sx={{ cursor: 'pointer', color: 'primary.main' }}
                                        >
                                            {item.firstName + ' ' + item.lastName || 'NA'}
                                        </TableCell>
                                        <TableCell>
                                            {item.email || 'NA'}
                                        </TableCell>
                                        <TableCell>
                                            {item.mobile || '0'}
                                        </TableCell>
                                        <TableCell>
                                            {item.orderCount || 0}
                                        </TableCell>
                                        <TableCell>
                                            ₹{item.totalSpent?.toLocaleString() || 0}
                                        </TableCell>
                                        <TableCell>
                                            ₹{item.wallet?.toLocaleString() || 0}
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={item.segment || 'regular'} 
                                                size="small" 
                                                color={getSegmentColor(item.segment)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {item.role}
                                        </TableCell>
                                        <TableCell>
                                            <UserRoleForm 
                                                userId={item._id} 
                                                currentRole={item.role} 
                                                userDetails={item} 
                                                onRoleChange={fetchData} 
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                
                <UserDetail
                    open={detailOpen}
                    onClose={() => {
                        setDetailOpen(false);
                        setSelectedUser(null);
                    }}
                    data={selectedUser}
                />
                
                <Grid container justifyContent="right" sx={{ pr: 2, pb: 2, pt: 2 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        variant="outlined"
                        shape="rounded"
                    />
                </Grid>
            </Box>
        </>
    );
};

export default UsersPage;