// Firebase setup
const firebaseApp = firebase.initializeApp({ 
  apiKey: "AIzaSyDTNglTem0-gijXDoImBLPGW7tjfz1nP0Y",
  authDomain: "todolist-376f8.firebaseapp.com",
  databaseURL: "https://todolist-376f8-default-rtdb.firebaseio.com",
  projectId: "todolist-376f8",
  storageBucket: "todolist-376f8.firebasestorage.app",
  messagingSenderId: "928323406559",
  appId: "1:928323406559:web:bbce0a3e06d718af50f76a"
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

// Function to check if passwords match
const checkPassword = (password, confirmPassword) => {
  return password === confirmPassword;
};

// Signup function
const SignUp = () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('pass').value;
  const confirmPassword = document.getElementById('cpass').value;

  // Check if passwords match
  if (checkPassword(password, confirmPassword)) {
    // Firebase code to create user
    auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        // Signed in
        document.write("you are sign up ");
        console.log(result)

        // Additional processing, like storing user data in Firestore, if needed
      })
      .catch((error) => {
       console.log(error.code);
       console.log(error.message)
      });
  } else {
    // Passwords do not match, show an error message
    console.log("Passwords do not match!");
    alert("Passwords do not match!");
  }
}
//SignIn function
const SignIn = () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('pass').value;
  //firebase code
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((result) => {
    // Signed in
    window.location.href = 'todo2.html';
    console.log(result)
    // ...
  })
  .catch((error) => {
    console.log(error.code);
    console.log(error.message)
   });
}
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      console.log("Google Login Successful:", result.user);
      // Redirect or update UI here
      window.location.href= 'todo2.html';
    })
    .catch((error) => {
      console.error("Google Login Error:", error.message);
    });
}

// Apple Sign-In using namespaced API
function appleLogin() {
  const provider = new firebase.auth.OAuthProvider('apple.com');
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      console.log("Apple Login Successful:", result.user);
      // Redirect or update UI here
    })
    .catch((error) => {
      console.error("Apple Login Error:", error.message);
    });
}