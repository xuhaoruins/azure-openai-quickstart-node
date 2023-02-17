import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [TextInput, setTextInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatMsg: TextInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setTextInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Azure OpenAI + 21v</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Azure OpenAI Service App on 21v Azure</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="chatMsg"
            placeholder="请输入..."
            value={TextInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <input type="submit" value="生成内容" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
