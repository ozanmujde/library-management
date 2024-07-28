import { Request, Response } from "express";
import { Book, Borrow } from "../models";
import { validationResult } from "express-validator";

export const getBooks = async (req: Request, res: Response) => {
  const books = await Book.findAll();
  res.json(books);
};

export const getBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const book = await Book.findByPk(id);
  const scores = await Borrow.findAll({ where: { bookId: id } });

  if (book) {
    const averageScore = scores.length
      ? scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length
      : -1;
    res.json({ ...book.toJSON(), score: averageScore });
  } else {
    res.status(404).send("Book not found");
  }
};

export const createBook = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name } = req.body;
  const newBook = await Book.create({ name });
  res.status(201).json(newBook);
};
