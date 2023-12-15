import React, { useCallback, useState } from "react";

export default {
  title: "useCallBackComponent",
}

type BooksSecretType = {
  books: string[]
  addBook: () => void
}

const BooksSecret = (props: BooksSecretType) => {
  console.log("BooksSecret")
  return <>
    <button onClick={props.addBook}>add User</button>
    <div>{props.books.map((b, index) => <div key={index}>{b}</div>)}</div>
  </>
}

const Books = React.memo(BooksSecret) //не перезапускает перерендер КОМПОНЕНТЫ,
// если не произошло изменений! писать всегда для использов useMemo/useCallback

export const useCallBackRender = () => {
  console.log("useCallBack")

  const [counter, setCounter] = useState(0)
  const [books, setBooks] = useState(["React", "JS", "CSS", "HTML"])

  // const newArr = useMemo(() => {
  //   return books.filter(b => b.toLowerCase().includes("a"))
  // }, [books])

  // const addBook = useMemo(() => {
  //   return () => {
  //     setBooks([...books, "Angular " + new Date().getFullYear()])
  //   }
  // }, [books])

  const addBook2 = useCallback(() => {
    setBooks([...books, "Angular " + new Date().getFullYear()])
  }, [books])

  return <>
    <button onClick={() => setCounter(counter + 1)}>+</button>
    {counter}
    <Books books={books} addBook={addBook2} />
    {/* useCallBackComponent рендер самой компоненты родителя и соответсвенного 
    вызванного и
        BooksSecret */}
  </>
}