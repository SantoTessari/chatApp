import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import firebase from "firebase/compat/app";
import { auth, firestore } from "./firebaseConfig"; // Import vanjskog file-a

//hooks
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

//aplikacija
function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <SignOut />
      </header>
      {/*Ako je user prijavljen ide u chat, ako nije ide na SingIn*/}
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

//SignIn
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return <button onClick={signInWithGoogle}>Sing in with Google</button>;
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
}

//ChatRoom
function ChatRoom() {
  const receivedDummy = useRef();
  const sentDummy = useRef();

  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt");

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    if (formValue.trim() !== "") {
      await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL,
      });

      setFormValue("");
      sentDummy.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              receivedDummy={receivedDummy}
              sentDummy={sentDummy}
            />
          ))}
        <div ref={receivedDummy}></div>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const { receivedDummy, sentDummy } = props;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  useEffect(() => {
    if (messageClass === "received") {
      receivedDummy.current.scrollIntoView({ behavior: "smooth" });
    } else {
      sentDummy.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [text, messageClass, receivedDummy, sentDummy]);

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
      <div ref={messageClass === "received" ? receivedDummy : sentDummy}></div>
    </div>
  );
}

export default App;
