import { Request, Response } from "express";
import { User, Book, Borrow } from "../models";
import { validationResult } from "express-validator";

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.findAll();
  res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findByPk(id, {
    include: [
      { model: Book, as: "borrowedBooks", through: { attributes: [] } },
    ],
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).send("User not found");
  }
};

export const createUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name } = req.body;
  const newUser = await User.create({ name });
  res.status(201).json(newUser);
};

export const borrowBook = async (req: Request, res: Response) => {
  const { id, bookId } = req.params;
  const user = await User.findByPk(id);
  const book = await Book.findByPk(bookId);

  if (!user || !book) {
    return res.status(404).send("User or Book not found");
  }

  const borrow = await Borrow.create({ userId: id, bookId });
  res.status(204).send();
};

export const returnBook = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, bookId } = req.params;
  const { score } = req.body;
  const borrow = await Borrow.findOne({ where: { userId: id, bookId } });

  if (!borrow) {
    return res.status(404).send("Borrow record not found");
  }

  borrow.score = score;
  await borrow.save();
  res.status(204).send();
};
