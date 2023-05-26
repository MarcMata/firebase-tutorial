
import './App.css';
import Auth from './components/auth';
import { db, auth, storage} from "./config/firebase-config";
import {useEffect, useState} from "react";
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";


function App() {
    const [movieList, setMovieList] = useState([]);

    //New Movie States
    const [newMovieTitle, setNewMovieTitle] = useState("");
    const [newMovieReleaseDate, setNewReleaseDate] = useState(0);
    const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

    //Update Title State
    const [updatedTitle, setUpdatedTitle] = useState("");

    //File Upload State
    const [fileUpload, setFileUpload] = useState(null);

    const moviesCollectionRef = collection(db, "movies")

    const deleteMovie = async(id) => {
        const movieDoc = doc(db, "movies", id);
        await deleteDoc(movieDoc);
        getMovieList();
    }

    const updateMovieTitle = async(id) => {
        const movieDoc = doc(db, "movies", id);
        await updateDoc(movieDoc, {title: updatedTitle});
        getMovieList();
    }

    const updateFile = async(id) => {
        if (!fileUpload) return;
        const filesFolderRef = ref(storage, `project-files/${fileUpload.name}`);
        try {
            await uploadBytes(filesFolderRef, fileUpload);
        } catch (e) {
            console.error(e);
        }
    }

    const getMovieList = async() => {
        try{
            const data = await getDocs(moviesCollectionRef);
            const filteredData = data.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
            }));
            setMovieList(filteredData);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getMovieList();
    }, []);

    const onSubmitMovie = async() => {
        try {
            await addDoc(moviesCollectionRef,
                {
                    title: newMovieTitle,
                    release_date: newMovieReleaseDate,
                    received_oscar: isNewMovieOscar,
                    user_id: auth?.currentUser.uid
                });

            getMovieList();
        } catch (err) {
            console.error(err);
        }
    }


  return (
      <div className="App">
            <Auth/>

          <div>
              <input placeholder="Movie title..." onChange={(e) => setNewMovieTitle(e.target.value)}/>
              <input placeholder="Release Date..." type="number" onChange={(e) => setNewReleaseDate(Number(e.target.value))}/>
              <input type="checkbox" id="oscar" checked={isNewMovieOscar} onChange={(e) => setIsNewMovieOscar(e.target.checked)}/>
              <label htmlFor="oscar">Recieved an Oscar</label>
              <button onClick={onSubmitMovie}>Submit Movie</button>
          </div>

          <div>
              {movieList.map((movie) => (
                        <div>
                            <h1 style ={{color: movie.received_oscar ? "green" : "red"}} >{movie.title}</h1>
                            <p>Date: {movie.release_date}</p>

                            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>

                            <input placeholder="new title..." onChange={(e) => setUpdatedTitle(e.target.value)}/>
                            <button onClick={() => updateMovieTitle(movie.id)}>Update Title</button>
                        </div>
                    )
              )}
          </div>
          <div>
              <input type="file" onChange={(e) => setFileUpload(e.target.files[0])}/>
              <button onClick={updateFile}>Upload file</button>
          </div>
      </div>
  );
}

export default App;
