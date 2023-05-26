
import './App.css';
import Auth from './components/auth';
import { db } from "./config/firebase-config";
import {useEffect, useState} from "react";
import { getDocs, collection } from "firebase/firestore";



function App() {
    const [movieList, setMovieList] = useState("");
    const moviesCollectionRef = collection(db, "movies")

    useEffect(() => {
        const getMovieList = async() => {
            //READ THE DATA FROM DATABASE
            //SET MOVIE LIST TO BE EQUAL TO THE DATA
            try{
                const data = await getDocs(moviesCollectionRef);
                const filteredData = data.docs.map((doc) => {
                    return {
                        ...doc.data(),
                        id: doc.id,

                    }
                });
                setMovieList(filteredData);
            } catch (err) {
                console.error(err);
            }
        };

        getMovieList();
    }, []);

  return (
      <div className="App">
            <Auth/>

          <div>
              {movieList.map((movie) => (
                        <div>
                            <h1 style ={{color: movie.received_oscar ? "green" : "red"}}>{movie.title}</h1>
                            <p>Date: {movie.release_date}</p>
                        </div>
                    )
              )}
          </div>
      </div>
  );
}

export default App;
