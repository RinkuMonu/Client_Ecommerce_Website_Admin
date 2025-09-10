// import Payinout from "./Payinamout";
// import { useUser } from "../../Context/UserContext";
// import { apiGet } from "../../api/apiMethods";
// import { useEffect, useState } from "react";
// import ProductOverview from "./ProductOverview";
// import UserOverview from "./UserOverview";
// import Linegraph from "./Linegraph";
// import Chancechart from "./Chancechart";
// import { Box, Grid, Typography } from "@mui/material";
// import CountUp from "react-countup";
// import { Chip, Avatar } from "@mui/material";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import TrendingDownIcon from "@mui/icons-material/TrendingDown";

// import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
// import SalesOverview from "./SalesOverview";

// const iconMap = {
//   Orders: <ShoppingBagIcon sx={{ fontSize: 16 }} />,
// };
// function Dashboard() {
//   const icon = iconMap["Orders"];
//   const { user } = useUser();
//   const [data, setData] = useState();
//   const [salesData, setSalesData] = useState();
//   const API_ENDPOINT = `api/dashboard`;
//   const API_ENDPOINT1 = `api/salesOverview`;

//   const fetchData = async () => {
//     try {
//       const response = await apiGet(API_ENDPOINT);
//       if (response.status === 200) {
//         setData(response.data?.data);
//       }

//       const response1 = await apiGet(API_ENDPOINT1);
//       if (response1.status === 200) {
//         setSalesData(response1.data);
//       }
//     } catch (error) {
//       console.error(error.message);
//       setData();
//       setSalesData();
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Calculate total products
//   const totalProducts = data?.productStats?.reduce(
//     (sum, product) => sum + (product.totalProducts || 0),
//     0
//   );
//   const getRandomTrend = () => {
//     const trends = ["up", "down"];
//     const randomTrend = trends[Math.floor(Math.random() * trends.length)];
//     const randomPercent = (Math.random() * 10).toFixed(2);
//     return {
//       direction: randomTrend,
//       percent: randomPercent,
//       icon:
//         randomTrend === "up" ? (
//           <TrendingUpIcon fontSize="small" />
//         ) : (
//           <TrendingDownIcon fontSize="small" />
//         ),
//     };
//   };
//   const trend = getRandomTrend();
//   return (
//     <div style={{ padding: "10px" }}>
//       {/* Total Products Summary Card */}
//       <Box
//         sx={{
//           padding: 2,
//           border: 0,
//           borderRadius: "0.5rem",
//           // backgroundColor: '#f1f8fe',
//           boxShadow: "rgba(143, 155, 166, 0.08) 0px 12px 24px -4px",
//           position: "relative",
//           width: "fit-content",
//           textAlign: "left",
//           transition: "transform 0.3s ease-in-out",
//           "&:hover": {
//             transform: "scale(1.05)",
//           },
//           color: "#000",
//           display: "flex",
//           justifyContent: "space-between",
//           // alignItems: 'center',
//           gap: 2,
//         }}
//       >
//         <Avatar
//           sx={{
//             bgcolor: "#f1f3ff",
//             color: "#4f46e5",
//             width: 32,
//             height: 32,
//           }}
//         >
//           {icon}
//         </Avatar>
//         <Box>
//           <Typography variant="subtitle2" sx={{ fontWeight: 500, color: "" }}>
//             Total Products
//           </Typography>
//           <Typography variant="h5" sx={{ fontWeight: 700 }}>
//             <CountUp end={totalProducts || 0} duration={2} />
//           </Typography>
//         </Box>
//         <Chip
//           icon={trend.icon}
//           label={`${trend.percent}%`}
//           size="small"
//           sx={{
//             backgroundColor: trend.direction === "up" ? "#e8f5e9" : "#ffebee",
//             color: trend.direction === "up" ? "#388e3c" : "#d32f2f",
//             fontWeight: "bold",
//             fontSize: "12px",
//             p: 1,
//           }}
//         />
//       </Box>

//       {/* Product Overview Section */}
//       <Box
//         sx={{
//           padding: 1,
//           borderRadius: 2,
//           boxShadow: "none",
//           marginTop: 0,
//         }}
//       >
//         <ProductOverview products={data?.productStats} />
//       </Box>

//       {/* User Overview Section */}
//       <Box
//         sx={{
//           padding: 2,
//           borderRadius: 2,
//           boxShadow: "none",
//           marginTop: 2,
//         }}
//       >
//         <UserOverview users={data?.userStats} />
//       </Box>

//       {/* Charts Section (Linegraph and Chancechart) */}
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <Box
//             sx={{
//               padding: 2,
//               borderRadius: 2,
//               boxShadow: "none",
//               height: "100%",
//             }}
//           >
//             <Linegraph />
//           </Box>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Box
//             sx={{
//               padding: 2,
//               borderRadius: 2,
//               boxShadow: "none",
//               height: "100%",
//             }}
//           >
//             <Chancechart />
//           </Box>
//         </Grid>
//       </Grid>

//       {/* Payinout Section */}
//       <Box
//         sx={{
//           padding: 2,
//           borderRadius: 2,
//           boxShadow: "none",
//           marginTop: 2,
//         }}
//       >
//         <Payinout orders={data?.orders} />
//       </Box>
//       <Box
//         sx={{
//           padding: 2,
//           borderRadius: 2,
//           boxShadow: "none",
//           marginTop: 2,
//         }}
//       >
//         <SalesOverview salesData={salesData} />
//       </Box>
//     </div>
//   );
// }

// export default Dashboard;





import Payinout from "./Payinamout";
import { useUser } from "../../Context/UserContext";
import { apiGet } from "../../api/apiMethods";
import { useEffect, useState } from "react";
import ProductOverview from "./ProductOverview";
import UserOverview from "./UserOverview";
import Linegraph from "./Linegraph";
import Chancechart from "./Chancechart";
import { Box, Grid, Typography, Chip, Avatar, Card, CardContent } from "@mui/material";
import CountUp from "react-countup";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CategoryIcon from "@mui/icons-material/Category";
import StarIcon from "@mui/icons-material/Star";

import SalesOverview from "./SalesOverview";

const iconMap = {
  Orders: <ShoppingBagIcon sx={{ fontSize: 16 }} />,
};

function Dashboard() {
  const icon = iconMap["Orders"];
  const { user } = useUser();

  const [data, setData] = useState();
  const [salesData, setSalesData] = useState();
  const [topProducts, setTopProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);

  const API_ENDPOINT = `api/dashboard`;
  const API_ENDPOINT1 = `api/salesOverview`;
  const API_TOP_PRODUCTS = `api/product/topselling`;
  const API_TOP_CATEGORIES = `api/product/topsales`;

  // const fetchData = async () => {
  //   try {
  //     const response = await apiGet(API_ENDPOINT);
  //     if (response.status === 200) setData(response.data?.data);

  //     const response1 = await apiGet(API_ENDPOINT1);
  //     if (response1.status === 200) setSalesData(response1.data);

  //     const resProducts = await apiGet(API_TOP_PRODUCTS);
  //     console.log(resProducts);
  //     if (resProducts.status === 200) setTopProducts(resProducts.data.products || []);

  //     const resCategories = await apiGet(API_TOP_CATEGORIES);
  //     console.log(resCategories);
  //     if (resCategories.status === 200) setTopCategories(resCategories.data.category || []);
  //   } catch (error) {
  //     console.error(error.message);
  //     setData();
  //     setSalesData();
  //   }
  // };


  const fetchData = async () => {
    try {
      const response = await apiGet(API_ENDPOINT);
      if (response.status === 200) setData(response.data?.data);

      const response1 = await apiGet(API_ENDPOINT1);
      if (response1.status === 200) setSalesData(response1.data);

      const resProducts = await apiGet(API_TOP_PRODUCTS);
      if (resProducts.status === 200) {
        // ✅ Correct field name: topProducts
        setTopProducts(resProducts.data.topProducts || []);
      }

      const resCategories = await apiGet(API_TOP_CATEGORIES);
      if (resCategories.status === 200) {
        // ✅ Correct field name: topCategories
        setTopCategories(resCategories.data.topCategories || []);
      }
    } catch (error) {
      console.error(error.message);
      setData();
      setSalesData();
      setTopProducts([]);
      setTopCategories([]);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  // Calculate total products
  const totalProducts = data?.productStats?.reduce(
    (sum, product) => sum + (product.totalProducts || 0),
    0
  );

  const getRandomTrend = () => {
    const trends = ["up", "down"];
    const randomTrend = trends[Math.floor(Math.random() * trends.length)];
    const randomPercent = (Math.random() * 10).toFixed(2);
    return {
      direction: randomTrend,
      percent: randomPercent,
      icon:
        randomTrend === "up" ? (
          <TrendingUpIcon fontSize="small" />
        ) : (
          <TrendingDownIcon fontSize="small" />
        ),
    };
  };

  const trend = getRandomTrend();

  return (
    <div style={{ padding: "10px" }}>
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item>
          <Box
            sx={{
              padding: 2,
              borderRadius: "0.5rem",
              boxShadow: "rgba(143, 155, 166, 0.08) 0px 12px 24px -4px",
              display: "flex",
              alignItems: "center",
              gap: 2,
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <Avatar sx={{ bgcolor: "#f1f3ff", color: "#4f46e5", width: 32, height: 32 }}>
              {icon}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                Total Products
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                <CountUp end={totalProducts || 0} duration={2} />
              </Typography>
            </Box>
            <Chip
              icon={trend.icon}
              label={`${trend.percent}%`}
              size="small"
              sx={{
                backgroundColor: trend.direction === "up" ? "#e8f5e9" : "#ffebee",
                color: trend.direction === "up" ? "#388e3c" : "#d32f2f",
                fontWeight: "bold",
                fontSize: "12px",
              }}
            />
          </Box>
        </Grid>

        {/* Top Selling Product Card */}
        <Grid item>
          <Card
            sx={{
              minWidth: 250,
              borderRadius: "0.5rem",
              boxShadow: "rgba(143, 155, 166, 0.08) 0px 12px 24px -4px",
              "&:hover": { transform: "scale(1.05)" },
              transition: "transform 0.3s",
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Avatar sx={{ bgcolor: "#fff3e0", color: "#ef6c00", width: 32, height: 32 }}>
                  <StarIcon />
                </Avatar>
                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                  Top Selling Product
                </Typography>
              </Box>
              {topProducts.length > 0 ? (
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {topProducts[0].productDetails?.productName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Orders: {topProducts[0].totalOrders} | Qty: {topProducts[0].totalQuantity}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No data
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Top Selling Category Card */}
        <Grid item>
          <Card
            sx={{
              minWidth: 250,
              borderRadius: "0.5rem",
              boxShadow: "rgba(143, 155, 166, 0.08) 0px 12px 24px -4px",
              "&:hover": { transform: "scale(1.05)" },
              transition: "transform 0.3s",
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Avatar sx={{ bgcolor: "#e3f2fd", color: "#1565c0", width: 32, height: 32 }}>
                  <CategoryIcon />
                </Avatar>
                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                  Top Selling Category
                </Typography>
              </Box>
              {topCategories.length > 0 ? (
                <Box>
                 
                  <Typography variant="body2" color="text.secondary">
                    Orders: {topCategories[0].totalOrders} | Qty: {topCategories[0].totalQuantity}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No data
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* Product Overview Section */}
      <Box sx={{ padding: 1, borderRadius: 2, marginTop: 0 }}>
        <ProductOverview products={data?.productStats} />
      </Box>

      {/* User Overview Section */}
      <Box sx={{ padding: 2, borderRadius: 2, marginTop: 2 }}>
        <UserOverview users={data?.userStats} />
      </Box>

      {/* Charts Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ padding: 2, borderRadius: 2, height: "100%" }}>
            <Linegraph />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ padding: 2, borderRadius: 2, height: "100%" }}>
            <Chancechart />
          </Box>
        </Grid>
      </Grid>

      {/* Payinout Section */}
      <Box sx={{ padding: 2, borderRadius: 2, marginTop: 2 }}>
        <Payinout orders={data?.orders} />
      </Box>

      {/* Sales Overview Section */}
      <Box sx={{ padding: 2, borderRadius: 2, marginTop: 2 }}>
        <SalesOverview salesData={salesData} />
      </Box>
    </div>
  );
}

export default Dashboard;
