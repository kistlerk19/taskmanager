import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving users: ${error.message}` });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { cognitoId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        cognitoId: cognitoId,
      },
    });
    res.json(user);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user: ${error.message}` });
  }
};

export const postUser = async (req: Request, res: Response) => {
  try {
    console.log("Received user data:", req.body); // Add logging
    
    const {
      username,
      email, // Make sure email is included
      cognitoId,
      profilePictureUrl = "i1.jpg",
      teamId = 1,
    } = req.body;

    // Validate required fields
    if (!username || !email || !cognitoId) {
      return res.status(400).json({ 
        message: "Missing required fields: username, email, and cognitoId are required" 
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { cognitoId }
    });

    if (existingUser) {
      return res.status(409).json({ 
        message: "User already exists",
        user: existingUser 
      });
    }

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        cognitoId,
        profilePictureUrl,
        teamId,
      },
    });

    console.log("User created successfully:", newUser); // Add logging
    res.status(201).json({ message: "User Created Successfully", newUser });
    
  } catch (error: any) {
    console.error("Error creating user:", error); // Add logging
    res
      .status(500)
      .json({ message: `Error creating user: ${error.message}` });
  }
};