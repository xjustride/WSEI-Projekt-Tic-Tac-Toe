'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function TestPage() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "testCollection"));
      const data = querySnapshot.docs.map(doc => doc.data().message);
      setMessages(data);
    };

    fetchData();
  }, []);

  const addMessage = async () => {
    await addDoc(collection(db, "testCollection"), {
      message: "Hello Firebase!"
    });
    alert('Message added!');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Test Firebase Firestore</h1>
      <button onClick={addMessage} className="p-2 bg-blue-500 text-white rounded">
        Add Message
      </button>
      <ul className="mt-4">
        {messages.map((msg, index) => (
          <li key={index} className="border p-2 mt-2">{msg}</li>
        ))}
      </ul>
    </div>
  );
}
