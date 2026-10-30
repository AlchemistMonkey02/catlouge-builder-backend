const express = require("express");
const router = express.Router();
const {
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
} = require("../controllers/catalogueRecordController");

router.route("/").get(getRecords).post(createRecord);
router.route("/:id").get(getRecordById).put(updateRecord).delete(deleteRecord);

module.exports = router;
