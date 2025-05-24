import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        userId: true,
        username: true,
        profilePictureUrl: true,
        teamId: true,
      },
    });
    res.json(users);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving users: ${error.message}` });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: parseInt(userId),
      },
      select: {
        userId: true,
        username: true,
        profilePictureUrl: true,
        teamId: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user: ${error.message}` });
  }
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    const user = await prisma.user.findUnique({
      where: {
        userId: decoded.userId,
      },
      select: {
        userId: true,
        username: true,
        profilePictureUrl: true,
        teamId: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error: any) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        username: username
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: "Username already taken" 
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        profilePictureUrl: "i1.jpg",
        teamId: 1,
      },
      select: {
        userId: true,
        username: true,
        profilePictureUrl: true,
        teamId: true,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.userId, username: newUser.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error registering user: ${error.message}` });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.userId, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Return user data without password
    const userResponse = {
      userId: user.userId,
      username: user.username,
      profilePictureUrl: user.profilePictureUrl,
      teamId: user.teamId,
    };

    res.json({
      message: "Login successful",
      user: userResponse,
      token,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error logging in: ${error.message}` });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  // In a JWT-based system, logout is typically handled client-side
  // by removing the token from storage
  res.json({ message: "Logged out successfully" });
};