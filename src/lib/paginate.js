import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  where
} from "firebase/firestore";
import { db } from "@/firebase";
import { async } from "@firebase/util";


export const Search = async (coll,q) =>{
    const page = query(collection(db,coll),q,where("name","<=","~"))
    
    const docSnaps = await getDocs(page)

    return docSnaps
}


export const Paginate = async (coll, orderby, _limit) => {
  let page;

  page = query(
    collection(db, coll),
    orderBy(orderby),
    limit(_limit)
  );

  const docSnaps = await getDocs(page);


  return docSnaps
};

export const PaginateNext = async (coll, orderby, _limit, last) => {
  let page;

  page = query(
    collection(db, coll),
    orderBy(orderby),
    startAfter(last),
    limit(_limit)
  );

  const docSnaps = await getDocs(page);



  return  docSnaps
};
