const express = require("express");
const router = express.Router();
const {
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  publishLiveRecord,
} = require("../controllers/catalogueRecordController");

router.route("/").get(getRecords).post(createRecord);
router.route("/:id").get(getRecordById).put(updateRecord).delete(deleteRecord);
router.route("/:id/publish-live").post(publishLiveRecord);

module.exports = router;
