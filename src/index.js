// how to use webpack
// 1. npm init -y
// 2. npm i -D webpack webpack-cli
// 3. create webpack.config.js
/* add this code to webpack.config.js

const path = require('path');
module.exports = {
  mode: 'development', // development or production
  entry: './src/index.js', // entry point of the application (main file) 
  output: { // output of the application
    filename: 'bundle.js',  // output file name
    path: path.resolve(__dirname, 'dist'), // output directory path (absolute path)
  },
  watch: true,  // watch for changes in the files and recompile automatically
};
*/

// to run webpack use this command in terminal
// 1. npx webpack or add this to package.json scripts "build": "webpack"
// and run npm run build

import { initializeApp } from 'firebase/app';

import {
  getFirestore, // firestore
  collection, // collection
  getDoc, // get one document without listener
  getDocs, // get documents without listener
  doc, //get a document reference
  deleteDoc, // delete a document
  addDoc, // add a document
  onSnapshot, // real time listener
  query, // query reference for filtering and ordering
  where, // where for filtering Condition
  orderBy, // order by for ordering Condition
  serverTimestamp, // server timestamp for adding timestamp to document field
  updateDoc, // update a document
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA1a7aNMAiD9VnoSem2nRkElfQpoLy-5K8',
  authDomain: 'fir-9tutorial-2a3af.firebaseapp.com',
  projectId: 'fir-9tutorial-2a3af',
  storageBucket: 'fir-9tutorial-2a3af.appspot.com',
  messagingSenderId: '1088861594232',
  appId: '1:1088861594232:web:6df561d01ebac94ca1038d',
};

const app = initializeApp(firebaseConfig);

// Get a Firestore instance
const db = getFirestore(app);

// collection reference
const booksCollectionRef = collection(db, 'books');

//query reference
const queryRef = query(
  booksCollectionRef,
  // orderBy('title', 'desc'),
  orderBy('createdAt'), // default is ascending
  // where('price', '>', '10'),
);

// realTime Listeners  we can pass queryRef or collectionRef or one documnet ref
onSnapshot(queryRef, {
  next: (snapshot) => {
    const dataArr = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    console.log(dataArr);
  },
  error: (err) => console.log(err),
});

const docRef = doc(db, 'books', 'f0cqRg8bVhDEmnQ6lsEy');

// get one Document
// getDoc(docRef)
//   .then((doc) => {
//     if (doc.exists()) {
//       console.log('Document data:', doc.data());
//     } else {
//       // doc.data(); will be undefined in this case
//       console.log('No such document!');
//     }
//   })
//   .catch((error) => {
//     console.log('Error getting document:', error);
//   });

// realTime Listeners for  one documnet ref
onSnapshot(docRef, (doc) => {
  console.log({ ...doc.data(), id: doc.id });
});

// get Documents
// getDocs(booksCollectionRef)
//   .then((snapshot) => {
//     const dataArr = snapshot.docs.map((doc) => ({
//       ...doc.data(),
//       id: doc.id,
//     }));
//     console.log(dataArr);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// adding a Document
const addBookForm = document.querySelector('.add');
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const book = {
    title: addBookForm.title.value,
    price: addBookForm.price.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  };

  addDoc(booksCollectionRef, book)
    .then((docRef) => {
      console.log('Document written with ID: ', docRef.id);
      addBookForm.reset();
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });
});

// Deleting a Document with ID
const deleteBookForm = document.querySelector('.delete');
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = deleteBookForm.id.value;

  const docRef = doc(db, 'books', id);
  deleteDoc(docRef)
    .then(() => {
      console.log('Document successfully deleted!');
      deleteBookForm.reset();
    })
    .catch((error) => {
      console.error('Error removing document: ', error);
    });
});

// Updating a Document with ID
const updateBookForm = document.querySelector('.update');
updateBookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = updateBookForm.id.value;
  const docRef = doc(db, 'books', id);
  const book = {
    title: updateBookForm.title.value,
    price: updateBookForm.price.value,
    author: updateBookForm.author.value,
  };
  updateDoc(docRef, book)
    .then(() => {
      updateBookForm.reset();
    })
    .catch((error) => {
      console.error('Error updating document: ', error);
    });
});
