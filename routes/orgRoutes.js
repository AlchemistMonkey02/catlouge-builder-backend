const express = require("express");
const router = express.Router();
const { getOrganizationProfile, updateOrganizationProfile } = require("../controllers/organizationController");

router.get("/profile", getOrganizationProfile);
router.put("/profile", updateOrganizationProfile);

module.exports = router;
