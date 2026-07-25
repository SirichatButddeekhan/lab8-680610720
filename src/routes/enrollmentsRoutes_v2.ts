import { Router, type Request, type Response } from "express";
import { DB } from "../db/db.js";

const router = Router();

// DELETE /api/v2/enrollments
router.delete("/", (req: Request, res: Response) => {
  const { studentId, courseNo } = req.body;

  const foundIndex = DB.enrollments.findIndex(
    (enrollment) =>
      enrollment.studentId === studentId &&
      enrollment.courseId === courseNo
  );

  if (foundIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Enrollment not found",
    });
  }

  DB.enrollments.splice(foundIndex, 1);

  return res.status(200).json({
    success: true,
    message: "Enrollment has been deleted successfully",
  });
});

export default router;
