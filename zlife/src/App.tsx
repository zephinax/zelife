import { useFinanceStore } from "./store/store";
function App() {
  const { createYear, removeYear } = useFinanceStore();
  return (
    <>
      <button
        onClick={() => {
          createYear("1404");
        }}
      >
        create year
      </button>
      <button
        onClick={() => {
          removeYear("1404");
        }}
      >
        delete year
      </button>
    </>
  );
}

export default App;
