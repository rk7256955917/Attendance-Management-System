import Sidebar from "./components/Sidebar";
import AddStudent from "./components/AddStudent";

function App() {
  return (
    <div className="h-screen flex flex-col">

      <div className="flex flex-1 min-h-0">

        <Sidebar />

        <main className="flex-1 p-4 overflow-auto">
          <AddStudent />
        </main>

      </div>

    </div>
  );
}

export default App;