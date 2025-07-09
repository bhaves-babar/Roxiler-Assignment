const express = require("express");
const router = express.Router();
const Product = require("../schema/product");

router.get("/product", async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    const query = {
      $or: [
        { productTitle: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { price: isNaN(search) ? undefined : Number(search) },
      ],
    };

    Object.keys(query.$or).forEach((key) => {
      if (query.$or[key] === undefined) query.$or.splice(key, 1);
    });

    const skip = (page - 1) * perPage;

    const transactions = await Product.find(search ? query : {})
      .skip(skip)
      .limit(perPage);

    const total = await Product.countDocuments(search ? query : {});

    res.status(200).json({
      page,
      perPage,
      total,
      transactions,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/stats", async (req, res) => {
  const month = parseInt(req.query.month);
  const year = parseInt(req.query.year);

  if (!month || !year || month < 1 || month > 12) {
    return res
      .status(400)
      .json({ error: "Enter valid month (1–12) and year." });
  }

  try {
    const [stats] = await Product.aggregate([
      {
        $addFields: {
          saleDate: { $toDate: "$dateOfSale" },
        },
      },
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $month: "$saleDate" }, month] },
              { $eq: [{ $year: "$saleDate" }, year] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSaleAmount: {
            $sum: { $cond: [{ $eq: ["$sold", true] }, "$price", 0] },
          },
          totalSoldItems: {
            $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] },
          },
          totalNotSoldItems: {
            $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] },
          },
        },
      },
    ]);

    res.json({
      totalSaleAmount: stats?.totalSaleAmount || 0,
      totalSoldItems: stats?.totalSoldItems || 0,
      totalNotSoldItems: stats?.totalNotSoldItems || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.get("/price", async (req, res) => {
  const month = parseInt(req.query.month);
  const year = parseInt(req.query.year);

  if (!month || month < 1 || month > 12 || !year || isNaN(year)) {
    return res
      .status(400)
      .json({ error: "Enter a valid month (1-12) and year." });
  }

  try {
    const [stats] = await Product.aggregate([
      {
        $addFields: {
          saleDate: { $toDate: "$dateOfSale" },
        },
      },
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $month: "$saleDate" }, month] },
              { $eq: [{ $year: "$saleDate" }, year] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          range_0_100: { $sum: { $cond: [{ $lte: ["$price", 100] }, 1, 0] } },
          range_101_200: {
            $sum: {
              $cond: [
                { $and: [{ $gt: ["$price", 100] }, { $lte: ["$price", 200] }] },
                1,
                0,
              ],
            },
          },
          range_201_300: {
            $sum: {
              $cond: [
                { $and: [{ $gt: ["$price", 200] }, { $lte: ["$price", 300] }] },
                1,
                0,
              ],
            },
          },
          range_301_400: {
            $sum: {
              $cond: [
                { $and: [{ $gt: ["$price", 300] }, { $lte: ["$price", 400] }] },
                1,
                0,
              ],
            },
          },
          range_401_500: {
            $sum: {
              $cond: [
                { $and: [{ $gt: ["$price", 400] }, { $lte: ["$price", 500] }] },
                1,
                0,
              ],
            },
          },
          range_501_600: {
            $sum: {
              $cond: [
                { $and: [{ $gt: ["$price", 500] }, { $lte: ["$price", 600] }] },
                1,
                0,
              ],
            },
          },
          range_601_700: {
            $sum: {
              $cond: [
                { $and: [{ $gt: ["$price", 600] }, { $lte: ["$price", 700] }] },
                1,
                0,
              ],
            },
          },
          range_701_800: {
            $sum: {
              $cond: [
                { $and: [{ $gt: ["$price", 700] }, { $lte: ["$price", 800] }] },
                1,
                0,
              ],
            },
          },
          range_801_900: {
            $sum: {
              $cond: [
                { $and: [{ $gt: ["$price", 800] }, { $lte: ["$price", 900] }] },
                1,
                0,
              ],
            },
          },
          range_901_above: {
            $sum: { $cond: [{ $gt: ["$price", 900] }, 1, 0] },
          },
        },
      },
    ]);

    res.json({
      priceRanges: {
        "0-100": stats?.range_0_100 || 0,
        "101-200": stats?.range_101_200 || 0,
        "201-300": stats?.range_201_300 || 0,
        "301-400": stats?.range_301_400 || 0,
        "401-500": stats?.range_401_500 || 0,
        "501-600": stats?.range_501_600 || 0,
        "601-700": stats?.range_601_700 || 0,
        "701-800": stats?.range_701_800 || 0,
        "801-900": stats?.range_801_900 || 0,
        "901-above": stats?.range_901_above || 0,
      },
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.get("/category", async (req, res) => {
  const { month } = req.query;
  const monthInt = parseInt(month);
  if (!month || monthInt < 1 || monthInt > 12) {
    return res
      .status(400)
      .json({ error: "Please provide a valid month (1-12)." });
  }

  try {
    const stats = await Product.aggregate([
      {
        $addFields: {
          dateOfSale: { $toDate: "$dateOfSale" },
        },
      },
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthInt] },
        },
      },
      {
        $group: {
          _id: "$category",
          itemCount: { $sum: 1 },
        },
      },
      {
        $project: {
          category: "$_id",
          itemCount: 1,
          _id: 0,
        },
      },
    ]);

    const categories = [
      "men's clothing",
      "women's clothing",
      "electronics",
      "jewelry",
    ];
    const categoryStats = categories.map((cat) => {
      const found = stats.find((s) => s.category === cat);
      return { category: cat, itemCount: found ? found.itemCount : 0 };
    });

    res.status(200).json(categoryStats);
  } catch (err) {
    console.error("Error fetching category statistics:", err);
    res.status(500).json({ error: "Failed to fetch category statistics." });
  }
});

router.get("/combined", async (req, res) => {
  const { month, year } = req.query;
  const monthInt = parseInt(month);
  const yearInt = parseInt(year);

  if (!monthInt || monthInt < 1 || monthInt > 12) {
    return res.status(400).json({ error: "Invalid month (1–12)" });
  }
  if (!yearInt || isNaN(yearInt)) {
    return res.status(400).json({ error: "Invalid year" });
  }

  try {
    const baseUrl = req.protocol + "://" + req.get("host") + "/a";

    const [priceRes, statsRes, categoryRes] = await Promise.all([
      fetch(`${baseUrl}/price?month=${monthInt}&year=${yearInt}`).then((r) =>
        r.json()
      ),
      fetch(`${baseUrl}/stats?month=${monthInt}&year=${yearInt}`).then((r) =>
        r.json()
      ),
      fetch(`${baseUrl}/category?month=${monthInt}`).then((r) => r.json()),
    ]);

    res.status(200).json({
      month: monthInt,
      year: yearInt,
      stats: statsRes,
      priceRanges: priceRes.priceRanges,
      categoryDistribution: categoryRes,
    });
  } catch (err) {
    console.error("Error combining data:", err);
    res.status(500).json({ error: "Failed to fetch combined data." });
  }
});

module.exports = router;
