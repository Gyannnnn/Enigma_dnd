import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const getFormStats = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId?.trim()) {
    res.status(400).json({
      message: "All fields are required !",
    });
    return;
  }

  try {
    const isUserExist = await prisma.user.findUnique({
      where: {
        userId,
      },
    });
    if (!isUserExist) {
      res.status(404).json({
        message: "No users found !",
      });
      return;
    }

    const stats = await prisma.form.aggregate({
      where: {
        userId,
      },
      _sum: {
        visits: true,
        submissions: true,
      },
    });
    if (!stats) {
      res.status(500).json({
        message: "Something went wrong try again",
      });
    }

    const visits = stats._sum.visits || 0;
    const submissions = stats._sum.submissions || 0;

    let submissionRate = 0;

    if (visits > 0) {
      submissionRate = (submissions / visits) * 100;
    }

    const bounceRate = 100 - submissionRate;

    res.status(200).json({
      message: "Statistics fetched successfully",
      data: {
        visits: visits,
        submissions: submissions,
        submissionRate: submissionRate,
        bounceRate: bounceRate,
      },
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
