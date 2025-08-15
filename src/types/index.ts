export interface Genre {
  id: number
  name: string
}

export type BookStatus = 'Lido' | 'Lendo' | 'Quero'

export interface Book {
  id: number
  name: string
  author: string
  coverUrl: string
  yearPublished: number
  status: BookStatus
  genre: Genre
}

export interface User {
  id: number
  username: string
}

export interface WishlistItem {
  id: number
  book: Pick<Book, 'id' | 'name' | 'coverUrl'>
}

export interface Loan {
  id: number
  book: Book
  lender: User
  borrower: User
  status: 'ativo' | 'concluido'
}