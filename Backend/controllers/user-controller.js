import asyncHandler from "express-async-handler";
import prisma from "../config/db.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
// Implement user controller logic here

/** 
@controller Get all users
@description Create a new user
@route POST /api/users
@access private
@method POST
*/
export const UserRegister = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // Check if user already exists
  const userExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // Check if user already exists
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  // send the response
  res.status(201).json({
    success: true,
    error: null,
    data: user,
  });
});

// get all users controller
/**
@controller getUsersController
@description Get all users
@route GET /api/users
@access private
@method GET
 */
export const getUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json({
    suceses: true,
    error: null,
    results: {
      data: users,
    },
  });
});

// get user by id controller
/**
@controller getUserByIdController  
@description Get user by id
@route GET /api/users/:id
@access private
@method GET
 */

export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find user by id
  if(!ObjectId.isValid(id)){
    res.status(400);
    throw new Error(`Please provide user id ${id}`);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  // Check if user exists
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // send response
  res.status(200).json({
    success: true,
    error: null,
    data: user,
  });
});

// update user controller
/**
@controller updateUserController
@description Update user
@route PUT /api/users/:id
@access private
@method PUT
 */

// delete user controller
/**
@controller deleteUserController
@description Delete user
@route DELETE
@access private
@method DELETE
  */

// login user controller
/**
@controller loginUser
@description Login user
@route POST /api/users/login
@access public
@method POST
 */

// End of User Controller
