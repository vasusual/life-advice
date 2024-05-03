import { useEffect, useState } from "react";
import styles from "./App.module.scss";
import Spinner from "./components/Spinner";

export type AdviceSlip = {
  slip: {
    id: number;
    advice: string;
  };
};

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<AdviceSlip | null>(null);
  const [error, setError] = useState<string | null>(null);
  const number = data?.slip.id;
  const slip = data?.slip.advice;

  async function fetchHandler() {
    const abortController = new AbortController();
    const signal = abortController.signal;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://api.adviceslip.com/advice", {
        signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const advice = await response.json();
      setData(advice);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
      abortController.abort();
    }
  }

  useEffect(() => {
    fetchHandler();
  }, []);

  return (
    <div className={styles.Box}>
      <h1>Today's life advice</h1>
      {loading ? (
        <Spinner />
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className={styles.TextBox}>
          <p className={styles.Number}>Advice №{number}</p>
          <p className={styles.Advice}>"{slip}"</p>
          <button
            onClick={fetchHandler}
            title="Get a new life advice"
            type="button"
            disabled={loading}
            className={styles.Button}
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
