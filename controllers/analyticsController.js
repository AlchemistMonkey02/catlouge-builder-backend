const CatalogueProduct = require("../models/CatalogueProduct");
const BatchImport = require("../models/BatchImport");
const AuditLog = require("../models/AuditLog");
const Organization = require("../models/Organization");

const getDashboardAnalytics = async (req, res, next) => {
  try {
    const orgId = req.organizationId;

    const [
      totalProducts,
      statusBreakdown,
      categoryBreakdown,
      recentBatches,
      recentActivity,
      org,
    ] = await Promise.all([
      CatalogueProduct.countDocuments({ organizationId: orgId }),
      CatalogueProduct.aggregate([
        { $match: { organizationId: orgId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      CatalogueProduct.aggregate([
        { $match: { organizationId: orgId } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),
      BatchImport.find({ organizationId: orgId }).sort({ createdAt: -1 }).limit(5).lean(),
      AuditLog.find({ organizationId: orgId }).sort({ createdAt: -1 }).limit(10).lean(),
      Organization.findById(orgId).lean(),
    ]);

    const statusMap = {
      draft: 0,
      needs_review: 0,
      validated: 0,
      approved: 0,
      exported: 0,
      submitted: 0,
      published: 0,
      failed: 0,
    };

    statusBreakdown.forEach((s) => {
      if (statusMap.hasOwnProperty(s._id)) {
        statusMap[s._id] = s.count;
      }
    });

    // Calculate overall catalogue completion rate
    const readyProducts = statusMap.validated + statusMap.approved + statusMap.exported + statusMap.submitted + statusMap.published;
    const completionRate = totalProducts > 0 ? Math.round((readyProducts / totalProducts) * 100) : 0;

    res.json({
      success: true,
      data: {
        kpis: {
          totalProducts,
          draftProducts: statusMap.draft,
          needsReview: statusMap.needs_review,
          readyForExport: statusMap.validated + statusMap.approved,
          exportedOrPublished: statusMap.exported + statusMap.submitted + statusMap.published,
          completionRate,
          aiTokensUsed: org?.quotas?.aiTokensUsed || 0,
          aiTokensLimit: org?.quotas?.aiTokensMonthlyLimit || 500000,
        },
        statusDistribution: statusMap,
        categoryDistribution: categoryBreakdown,
        recentBatches,
        recentActivity,
        brandProfile: org?.businessProfile || {},
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardAnalytics,
};
