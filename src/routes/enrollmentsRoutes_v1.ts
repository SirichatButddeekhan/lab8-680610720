import { Router, type Request, type Response } from "express";
import { DB } from "../db/db.js";

const router = Router();

// GET /api/v1/enrollments
router.get("/", (req: Request, res: Response) => {
  const { studentId, courseNo } = req.query;

  // ต้องเลือกค้นหาด้วย studentId หรือ courseNo อย่างใดอย่างหนึ่ง
  if ((!studentId && !courseNo) || (studentId && courseNo)) {
    return res.status(400).json({
      success: false,
      message: "Please specify either studentId or courseNo",
    });
  }

  // ค้นหานักศึกษาที่ลงทะเบียนวิชานี้
  if (courseNo) {
    const courseId = String(courseNo);

    if (!/^\d{6}$/.test(courseId)) {
      return res.status(400).json({
        success: false,
        message: "courseNo must contain 6 digits",
      });
    }

    const result = DB.enrollments
      .filter((enrollment) => enrollment.courseId === courseId)
      .map((enrollment) => {
        const student = DB.students.find(
          (student) => student.studentId === enrollment.studentId
        );

        return {
          studentId: student?.studentId,
          firstName: student?.firstName,
          lastName: student?.lastName,
          program: student?.program,
        };
      });

    return res.status(200).json({
      success: true,
      data: result,
    });
  }

  // ค้นหารายวิชาที่นักศึกษาลงทะเบียน
  const id = String(studentId);

  if (id.length !== 9) {
    return res.status(400).json({
      success: false,
      message: "studentId must contain 9 characters",
    });
  }

  const result = DB.enrollments
    .filter((enrollment) => enrollment.studentId === id)
    .map((enrollment) => {
      const course = DB.courses.find(
        (course) => course.courseId === enrollment.courseId
      );

      return {
        courseId: course?.courseId,
        courseTitle: course?.courseTitle,
        instructors: course?.instructors,
      };
    });

  return res.status(200).json({
    success: true,
    data: result,
  });
});

export default router;
